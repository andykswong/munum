//! Integration tests for the public surface of the `munum::matrix_ops` module.
//!
//! Only the crate's PUBLIC API is exercised (everything re-exported from
//! `lib.rs` plus `num`'s `One`/`Zero` traits, which are a normal dependency and
//! thus visible to integration test crates).
//!
//! IMPORTANT: `munum::Matrix` is COLUMN-MAJOR.
//!   * `Matrix::new([[c0..], [c1..], ..])` gives each inner array as a *column*.
//!   * `from_slice(&[..])` / `as_ref()` are the flat column-major layout.
//!   * Element (row r, col c) lives at flat index `c * R + r`.
//!
//! Expected values are computed by hand from the definitions in
//! `src/matrix_ops.rs`. Exact integer / simple-rational arithmetic uses
//! `assert_eq!`; only irrational results (normalization) use `assert_float_eq!`.

use munum::{assert_float_eq, Mat2, Mat3, Matrix, Vec2, Vec3};
use num::{One, Zero};

// region: Zero

#[test]
fn zero_matrix_is_all_zeros_and_reports_is_zero() {
    // Zero::zero() delegates to Default::default() -> every entry T::zero().
    let z = Matrix::<i32, 3, 2>::zero();
    assert_eq!(*z.as_ref(), [0, 0, 0, 0, 0, 0]);
    assert!(z.is_zero());
    // Zero::zero() must equal Default::default().
    assert_eq!(z, Matrix::<i32, 3, 2>::default());
}

#[test]
fn is_zero_false_when_any_entry_nonzero() {
    // Single non-zero entry at (row1, col1) -> flat index 1*2+1 = 3.
    let m = Matrix::<i32, 2, 2>::new([[0, 0], [0, 1]]);
    assert_eq!(*m.as_ref(), [0, 0, 0, 1]);
    assert!(!m.is_zero());
}

// endregion: Zero

// region: Add / Sub

#[test]
fn add_and_add_assign_square() {
    // a flat [1,2,3,4], b flat [5,6,7,8]; elementwise sum -> [6,8,10,12].
    let a = Mat2::<i32>::new([[1, 2], [3, 4]]);
    let b = Mat2::<i32>::new([[5, 6], [7, 8]]);
    assert_eq!(*(a + b).as_ref(), [6, 8, 10, 12]);

    let mut c = a;
    c += b;
    assert_eq!(*c.as_ref(), [6, 8, 10, 12]);
}

#[test]
fn sub_and_sub_assign_nonsquare() {
    // Non-square 3x2. a flat [9,8,7,6,5,4], b flat [1,2,3,4,5,6].
    // a-b elementwise -> [8,6,4,2,0,-2].
    let a = Matrix::<i32, 3, 2>::new([[9, 8, 7], [6, 5, 4]]);
    let b = Matrix::<i32, 3, 2>::new([[1, 2, 3], [4, 5, 6]]);
    assert_eq!(*(a - b).as_ref(), [8, 6, 4, 2, 0, -2]);

    let mut c = a;
    c -= b;
    assert_eq!(*c.as_ref(), [8, 6, 4, 2, 0, -2]);
}

#[test]
fn add_then_sub_round_trip() {
    // (a + b) - b == a for any a, b of equal dims.
    let a = Matrix::<i32, 3, 2>::from_slice(&[3, -1, 4, 1, -5, 9]);
    let b = Matrix::<i32, 3, 2>::from_slice(&[2, 7, 1, 8, 2, 8]);
    assert_eq!((a + b) - b, a);
}

// endregion: Add / Sub

// region: Matrix Mul

#[test]
fn mul_square_mat2() {
    // a: col0=[1,2], col1=[3,4] => rows [1,3] / [2,4].
    // b: col0=[5,6], col1=[7,8] => rows [5,7] / [6,8].
    // result[(r,c)] = sum_n a[(r,n)]*b[(n,c)]:
    //   (0,0)=1*5+3*6=23  (1,0)=2*5+4*6=34
    //   (0,1)=1*7+3*8=31  (1,1)=2*7+4*8=46
    // column-major flat => [23,34,31,46].
    let a = Mat2::<i32>::new([[1, 2], [3, 4]]);
    let b = Mat2::<i32>::new([[5, 6], [7, 8]]);
    assert_eq!(*(a * b).as_ref(), [23, 34, 31, 46]);
    // Matrix multiply is not commutative:
    //   b*a: (0,0)=5*1+7*2=19 (1,0)=6*1+8*2=22 (0,1)=5*3+7*4=43 (1,1)=6*3+8*4=50
    assert_eq!(*(b * a).as_ref(), [19, 22, 43, 50]);
}

#[test]
fn mul_by_identity_is_noop() {
    // A * I == A and I * A == A.
    let a = Mat2::<i32>::new([[1, 2], [3, 4]]);
    let id = Mat2::<i32>::identity();
    assert_eq!(a * id, a);
    assert_eq!(id * a, a);
}

#[test]
fn mul_nonsquare_3x2_by_2x1() {
    // m1 (3x2) col-major [1,2,3,4,5,6]: col0=[1,2,3], col1=[4,5,6] => rows
    //   [1,4] / [2,5] / [3,6].  m2 (2x1) [7,8]: col0=[7,8].
    // result (3x1): 1*7+4*8=39, 2*7+5*8=54, 3*7+6*8=69 => [39,54,69].
    let m1 = Matrix::<i32, 3, 2>::from_slice(&[1, 2, 3, 4, 5, 6]);
    let m2 = Matrix::<i32, 2, 1>::from_slice(&[7, 8]);
    assert_eq!(*(m1 * m2).as_ref(), [39, 54, 69]);

    // Same result through the inherent mul_assign method.
    let mut result = Matrix::<i32, 3, 1>::default();
    result.mul_assign(m1, m2);
    assert_eq!(*result.as_ref(), [39, 54, 69]);
}

#[test]
fn mul_nonsquare_2x3_by_3x2() {
    // A (2x3) col-major [1..6]: rows [1,3,5] / [2,4,6].
    // B (3x2) col-major [7..12]: col0=[7,8,9], col1=[10,11,12].
    // C (2x2): (0,0)=1*7+3*8+5*9=76   (1,0)=2*7+4*8+6*9=100
    //          (0,1)=1*10+3*11+5*12=103 (1,1)=2*10+4*11+6*12=136
    // column-major flat => [76,100,103,136].
    let a = Matrix::<i32, 2, 3>::from_slice(&[1, 2, 3, 4, 5, 6]);
    let b = Matrix::<i32, 3, 2>::from_slice(&[7, 8, 9, 10, 11, 12]);
    assert_eq!(*(a * b).as_ref(), [76, 100, 103, 136]);
}

#[test]
fn mul_assign_square_operator_matches_mul() {
    // c = a; c *= b  must equal a * b (square, delegates to inherent method).
    let a = Mat2::<i32>::new([[1, 2], [3, 4]]);
    let b = Mat2::<i32>::new([[5, 6], [7, 8]]);
    let mut c = a;
    c *= b;
    assert_eq!(c, a * b);
    assert_eq!(*c.as_ref(), [23, 34, 31, 46]);
}

// endregion: Matrix Mul

// region: Scalar Ops

#[test]
fn scalar_mul_and_mul_assign() {
    // Every entry scaled by 3.
    let m = Matrix::<i32, 2, 2>::new([[1, 2], [3, 4]]);
    assert_eq!(*(m * 3).as_ref(), [3, 6, 9, 12]);

    let mut n = Matrix::<i32, 3, 2>::from_slice(&[1, 2, 3, 4, 5, 6]);
    n *= 2;
    assert_eq!(*n.as_ref(), [2, 4, 6, 8, 10, 12]);
}

#[test]
fn scalar_div_and_div_assign() {
    // Exact integer division: [10,20,30,40]/10 = [1,2,3,4].
    let m = Matrix::<i32, 2, 2>::from_slice(&[10, 20, 30, 40]);
    assert_eq!(*(m / 10).as_ref(), [1, 2, 3, 4]);

    // Integer division truncates toward zero: 7/2=3, 9/2=4, 11/2=5, 13/2=6.
    let mut t = Matrix::<i32, 2, 2>::from_slice(&[7, 9, 11, 13]);
    t /= 2;
    assert_eq!(*t.as_ref(), [3, 4, 5, 6]);

    // Float division is exact for these halves.
    let f = Matrix::<f32, 2, 2>::from_slice(&[1., 2., 3., 4.]);
    assert_eq!(*(f / 2.0).as_ref(), [0.5, 1.0, 1.5, 2.0]);
}

#[test]
fn scalar_rem_and_rem_assign() {
    // Integer remainder: 10%5=0, 11%5=1, 12%5=2, 13%5=3.
    let m = Matrix::<i32, 2, 2>::from_slice(&[10, 11, 12, 13]);
    assert_eq!(*(m % 5).as_ref(), [0, 1, 2, 3]);

    // Float remainder (exact): 5.5%2=1.5, 4%2=0, 7%2=1, 9.5%2=1.5.
    let mut f = Matrix::<f32, 2, 2>::from_slice(&[5.5, 4.0, 7.0, 9.5]);
    f %= 2.0;
    assert_eq!(*f.as_ref(), [1.5, 0.0, 1.0, 1.5]);
}

// endregion: Scalar Ops

// region: Square Matrix Ops (One / transpose)

#[test]
fn one_equals_identity() {
    // One::one() delegates to Matrix::identity().
    assert_eq!(*Mat2::<i32>::one().as_ref(), [1, 0, 0, 1]);
    assert_eq!(Mat3::<i32>::one(), Mat3::<i32>::identity());
    assert_eq!(*Mat3::<i32>::one().as_ref(), [1, 0, 0, 0, 1, 0, 0, 0, 1]);
}

#[test]
fn transpose_in_place_mat3() {
    // Column-major [1..9]: cols [1,2,3]/[4,5,6]/[7,8,9] => rows [1,4,7]/[2,5,8]/[3,6,9].
    // Transpose swaps rows<->cols; result column-major flat = [1,4,7,2,5,8,3,6,9].
    let mut m = Matrix::<i32, 3, 3>::from_slice(&[1, 2, 3, 4, 5, 6, 7, 8, 9]);
    m.transpose();
    assert_eq!(*m.as_ref(), [1, 4, 7, 2, 5, 8, 3, 6, 9]);
}

#[test]
fn transpose_mat2() {
    // [[1,2],[3,4]] flat [1,2,3,4] -> transposed flat [1,3,2,4].
    let mut m = Mat2::<i32>::new([[1, 2], [3, 4]]);
    m.transpose();
    assert_eq!(*m.as_ref(), [1, 3, 2, 4]);
}

#[test]
fn transposed_is_pure_and_double_transpose_is_identity() {
    // transposed() returns a copy and leaves the receiver unchanged.
    let m = Matrix::<i32, 3, 3>::from_slice(&[1, 2, 3, 4, 5, 6, 7, 8, 9]);
    let t = m.transposed();
    assert_eq!(*t.as_ref(), [1, 4, 7, 2, 5, 8, 3, 6, 9]);
    assert_eq!(*m.as_ref(), [1, 2, 3, 4, 5, 6, 7, 8, 9]); // original untouched
    // Transposing twice returns the original.
    assert_eq!(t.transposed(), m);
}

// endregion: Square Matrix Ops

// region: Vector Ops (dot / sqr_len / lerp)

#[test]
fn dot_product() {
    // [1,2,3]·[4,5,6] = 4+10+18 = 32.
    let v1 = Vec3::<i32>::from_slice(&[1, 2, 3]);
    let v2 = Vec3::<i32>::from_slice(&[4, 5, 6]);
    assert_eq!(v1.dot(v2), 32);

    // Orthogonal 2D basis vectors: [1,0]·[0,1] = 0.
    let e1 = Vec2::<i32>::from_slice(&[1, 0]);
    let e2 = Vec2::<i32>::from_slice(&[0, 1]);
    assert_eq!(e1.dot(e2), 0);
    // Non-orthogonal 2D: [1,2]·[3,4] = 3+8 = 11.
    assert_eq!(
        Vec2::<i32>::from_slice(&[1, 2]).dot(Vec2::<i32>::from_slice(&[3, 4])),
        11
    );
}

#[test]
fn sqr_len() {
    // 3^2+4^2+12^2 = 9+16+144 = 169.
    assert_eq!(Vec3::<i32>::from_slice(&[3, 4, 12]).sqr_len(), 169);
    // 3^2+4^2 = 25.
    assert_eq!(Vec2::<i32>::from_slice(&[3, 4]).sqr_len(), 25);
    // Zero vector -> 0.
    assert_eq!(Vec3::<i32>::default().sqr_len(), 0);
}

#[test]
fn lerp_float_boundaries_and_midpoint() {
    // lerp(a,b,t) = a - a*t + b*t per component.
    let v1 = Vec3::<f32>::from_slice(&[1., 2., 3.]);
    let v2 = Vec3::<f32>::from_slice(&[5., 6., 7.]);
    // t=0 -> a (1-0+0, 2-0+0, 3-0+0).
    assert_eq!(*v1.lerp(v2, 0.0).as_ref(), [1.0, 2.0, 3.0]);
    // t=1 -> b (1-1+5, 2-2+6, 3-3+7).
    assert_eq!(*v1.lerp(v2, 1.0).as_ref(), [5.0, 6.0, 7.0]);
    // t=0.5 -> midpoint (1-0.5+2.5, 2-1+3, 3-1.5+3.5) = [3,4,5].
    assert_eq!(*v1.lerp(v2, 0.5).as_ref(), [3.0, 4.0, 5.0]);
}

#[test]
fn lerp_float_extrapolation() {
    // t=2 extrapolates: from [0,0,0] toward [1,2,3] => 0-0+2*[1,2,3] = [2,4,6].
    let a = Vec3::<f32>::default();
    let b = Vec3::<f32>::from_slice(&[1., 2., 3.]);
    assert_eq!(*a.lerp(b, 2.0).as_ref(), [2.0, 4.0, 6.0]);
}

#[test]
fn lerp_integer_exact() {
    // Integer lerp is exact at t=0 (a), t=1 (b), and t=2 (-a+2b).
    let v1 = Vec3::<i32>::from_slice(&[2, 4, 6]);
    let v2 = Vec3::<i32>::from_slice(&[10, 20, 30]);
    assert_eq!(*v1.lerp(v2, 0).as_ref(), [2, 4, 6]); // a
    assert_eq!(*v1.lerp(v2, 1).as_ref(), [10, 20, 30]); // b
    // t=2: 2-2*2+10*2 = 18, 4-4*2+20*2 = 36, 6-6*2+30*2 = 54.
    assert_eq!(*v1.lerp(v2, 2).as_ref(), [18, 36, 54]);
}

// endregion: Vector Ops

// region: Vector Ops (len / normalize / normalized)

#[test]
fn len_is_exact_for_perfect_squares() {
    // sqrt(3^2+4^2+12^2) = sqrt(169) = 13 exactly.
    assert_eq!(Vec3::<f32>::from_slice(&[3., 4., 12.]).len(), 13.0);
    // sqrt(3^2+4^2) = sqrt(25) = 5 exactly.
    assert_eq!(Vec2::<f32>::from_slice(&[3., 4.]).len(), 5.0);
    // Zero vector length is 0.
    assert_eq!(Vec3::<f32>::default().len(), 0.0);
}

#[test]
fn normalize_general_and_unit() {
    // [3,4] has len 5 -> [0.6, 0.8]; return value true.
    let mut v = Vec2::<f32>::from_slice(&[3., 4.]);
    assert!(v.normalize());
    assert_float_eq!(v, Vec2::<f32>::new([[0.6, 0.8]]), 1e-6);
    // Resulting length is 1.
    assert_float_eq!(v.len(), 1.0_f32, 1e-6);

    // [3,4,12] has len 13 -> [3/13, 4/13, 12/13].
    let mut w = Vec3::<f32>::from_slice(&[3., 4., 12.]);
    assert!(w.normalize());
    assert_float_eq!(
        w,
        Vec3::<f32>::new([[3.0 / 13.0, 4.0 / 13.0, 12.0 / 13.0]]),
        1e-6
    );

    // Already-unit vector stays put and returns true.
    let mut u = Vec3::<f32>::from_slice(&[1., 0., 0.]);
    assert!(u.normalize());
    assert_float_eq!(u, Vec3::<f32>::new([[1.0, 0.0, 0.0]]), 1e-6);
}

#[test]
fn normalize_zero_vector_returns_false_and_is_unchanged() {
    // len == 0 -> normalize returns false, vector untouched.
    let mut z = Vec2::<f32>::default();
    assert!(!z.normalize());
    assert_eq!(*z.as_ref(), [0.0, 0.0]);
}

#[test]
fn normalized_option() {
    // Non-zero -> Some(unit); receiver unchanged (takes &self).
    let v = Vec2::<f32>::from_slice(&[3., 4.]);
    let n = v.normalized().expect("non-zero vector normalizes");
    assert_float_eq!(n, Vec2::<f32>::new([[0.6, 0.8]]), 1e-6);
    assert_eq!(*v.as_ref(), [3.0, 4.0]); // original not mutated

    // Zero vector -> None.
    assert!(Vec3::<f32>::default().normalized().is_none());
}

// endregion: Vector Ops