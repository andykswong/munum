//! Integration tests for the public matrix API of the `munum` crate.
//!
//! These tests only touch the crate's PUBLIC surface (items re-exported from
//! `lib.rs` plus the public `munum::scalar` module). The library is
//! COLUMN-MAJOR: `Matrix::new([[col0], [col1], ...])` and both `from_slice`
//! and `AsRef<[T]>` expose the flat storage in column-major order.
//!
//! Storage / indexing model taken directly from `src/matrix.rs`:
//!   * internal storage is `[[T; R]; C]` (an array of C columns, each R tall).
//!   * `as_ref()`  -> flat `&[T]` of length R*C, column-major.
//!   * usize index i -> `self.0[(i / R) % C][i % R]`.
//!   * (row, col)   -> `self.0[col % C][row % R]`  (both wrap by modulo).
//!
//! Expected values for integer / exactly-representable operations use
//! `assert_eq!`. Only the genuinely irrational normalization case uses
//! `assert_float_eq!` with an explicit 1e-6 epsilon.

use munum::assert_float_eq;
use munum::{
    mat2, mat3, mat4, vec2, vec3, vec4, Mat2, Mat3, Mat4, Matrix, Vec2, Vec3, Vec4,
};
use num::{One, Zero};

// region: construction & storage order

#[test]
fn new_stores_column_major() {
    // new takes [[col0], [col1]]. Column 0 = [1,2], column 1 = [3,4].
    // Flat column-major order is col0 then col1 => [1, 2, 3, 4].
    let m = Matrix::<i32, 2, 2>::new([[1, 2], [3, 4]]);
    assert_eq!(*m.as_ref(), [1, 2, 3, 4]);
}

#[test]
fn from_2d_array_equals_new() {
    // From<[[T; R]; C]> just forwards to new, so both must be identical.
    let from_new = Matrix::<i32, 2, 3>::new([[1, 2], [3, 4], [5, 6]]);
    let from_conv = Matrix::<i32, 2, 3>::from([[1, 2], [3, 4], [5, 6]]);
    assert_eq!(from_new, from_conv);
    // 3 columns of height 2, flattened column-major.
    assert_eq!(*from_conv.as_ref(), [1, 2, 3, 4, 5, 6]);
}

#[test]
fn from_slice_exact_length_column_major() {
    // A slice of length R*C=6 is copied verbatim into column-major storage.
    let m = Matrix::<i32, 2, 3>::from_slice(&[1, 2, 3, 4, 5, 6]);
    assert_eq!(*m.as_ref(), [1, 2, 3, 4, 5, 6]);
    // Columns recovered: col0=[1,2], col1=[3,4], col2=[5,6].
    let back: [[i32; 2]; 3] = m.into();
    assert_eq!(back, [[1, 2], [3, 4], [5, 6]]);
}

#[test]
#[should_panic(expected = "does not match destination slice length")]
fn from_slice_wrong_length_panics() {
    // NOTE: `from_slice` uses `clone_from_slice` against a length-R*C buffer,
    // which REQUIRES an exact-length source. A short (or long) slice does NOT
    // zero-fill; it panics. Here R*C = 4 but the slice has length 2.
    let _ = Matrix::<i32, 2, 2>::from_slice(&[1, 2]);
}

#[test]
fn default_is_all_zero() {
    // Default builds [[T::zero(); R]; C], i.e. every entry is 0.
    let sq = Matrix::<i32, 2, 2>::default();
    assert_eq!(*sq.as_ref(), [0, 0, 0, 0]);
    // Non-square 2x3 default: R*C = 6 zeros.
    let ns = Matrix::<i32, 2, 3>::default();
    assert_eq!(*ns.as_ref(), [0, 0, 0, 0, 0, 0]);
}

#[test]
fn identity_sets_diagonal_ones() {
    // identity() writes 1 on m.0[i][i]. In column-major flat form the diagonal
    // sits at flat indices i*N + i.
    let m = Matrix::<i32, 3, 3>::identity();
    assert_eq!(*m.as_ref(), [1, 0, 0, 0, 1, 0, 0, 0, 1]);
}

#[test]
fn columns_and_rows_report_dims_nonsquare() {
    // rows() = R, columns() = C, independent of contents.
    let m = Matrix::<i32, 2, 3>::default();
    assert_eq!(m.rows(), 2);
    assert_eq!(m.columns(), 3);
}

// endregion: construction & storage order

// region: AsRef / AsMut

#[test]
fn as_mut_mutates_backing_storage() {
    // as_mut yields the flat column-major slice; writing through it must be
    // observable through as_ref and through indexing.
    let mut m = Matrix::<i32, 2, 3>::from_slice(&[1, 2, 3, 4, 5, 6]);
    {
        let s = m.as_mut();
        s[0] = 100; // flat 0 -> col0 row0
        s[5] = 600; // flat 5 -> col2 row1
    }
    assert_eq!(*m.as_ref(), [100, 2, 3, 4, 5, 600]);
    assert_eq!(m[(0, 0)], 100);
    assert_eq!(m[(1, 2)], 600);
}

// endregion: AsRef / AsMut

// region: indexing

#[test]
fn index_by_usize_is_column_major_flat() {
    // For R=2, C=3: usize i -> col=(i/2)%3, row=i%2. This reproduces the
    // column-major flat order, so m[i] == as_ref()[i].
    let m = Matrix::<i32, 2, 3>::from_slice(&[1, 2, 3, 4, 5, 6]);
    assert_eq!(m[0], 1); // col0 row0
    assert_eq!(m[1], 2); // col0 row1
    assert_eq!(m[2], 3); // col1 row0
    assert_eq!(m[3], 4); // col1 row1
    assert_eq!(m[4], 5); // col2 row0
    assert_eq!(m[5], 6); // col2 row1
}

#[test]
fn index_by_row_col_tuple() {
    // (row, col) -> self.0[col][row]. Values chosen so each (r,c) is distinct.
    let m = Matrix::<i32, 2, 3>::from_slice(&[1, 2, 3, 4, 5, 6]);
    assert_eq!(m[(0, 0)], 1);
    assert_eq!(m[(1, 0)], 2);
    assert_eq!(m[(0, 1)], 3);
    assert_eq!(m[(1, 1)], 4);
    assert_eq!(m[(0, 2)], 5);
    assert_eq!(m[(1, 2)], 6);
}

#[test]
fn index_mut_by_usize_and_tuple() {
    let mut m = Matrix::<i32, 2, 2>::default();
    m[0] = 7; // usize: col0 row0
    m[3] = 9; // usize: (3/2)%2 = 1 -> col1, 3%2 = 1 -> row1
    m[(1, 0)] = 8; // tuple: col0 row1
    // Storage now col0=[7,8], col1=[?,9]; col1 row0 still 0.
    assert_eq!(*m.as_ref(), [7, 8, 0, 9]);
}

#[test]
fn index_wraps_out_of_range_by_modulo() {
    // Both indexers take the operands modulo the dimensions, so out-of-range
    // indices wrap instead of panicking.
    let m = Matrix::<i32, 2, 3>::from_slice(&[1, 2, 3, 4, 5, 6]);
    // usize 6: col=(6/2)%3 = 0, row=6%2 = 0 -> same as m[0].
    assert_eq!(m[6], 1);
    // usize 7: col=(7/2)%3 = 0, row=7%2 = 1 -> same as m[1].
    assert_eq!(m[7], 2);
    // tuple (2,3): row 2%2 = 0, col 3%3 = 0 -> same as m[(0,0)].
    assert_eq!(m[(2, 3)], 1);
}

// endregion: indexing

// region: conversions

#[test]
fn from_ref_slice_conversion() {
    // From<&[T]> forwards to from_slice; slice length must equal R*C.
    let data = [10, 20, 30, 40];
    let m = Matrix::<i32, 2, 2>::from(&data[..]);
    assert_eq!(*m.as_ref(), [10, 20, 30, 40]);
}

#[test]
fn array_and_vector_roundtrip_conversions() {
    // Matrix <-> [[T; R]; C]
    let m = Matrix::<i32, 2, 2>::new([[1, 2], [3, 4]]);
    let arr: [[i32; 2]; 2] = m.into();
    assert_eq!(arr, [[1, 2], [3, 4]]);
    assert_eq!(Matrix::<i32, 2, 2>::from(arr), m);

    // Vector (R x 1) <-> [T; R]
    let v = Vec3::<i32>::from_array([5, 6, 7]);
    assert_eq!(*v.as_ref(), [5, 6, 7]);
    let back: [i32; 3] = v.into();
    assert_eq!(back, [5, 6, 7]);
    assert_eq!(Vec3::<i32>::from([5, 6, 7]), v);
}

#[test]
fn free_constructor_helpers() {
    // vecN builders place components in the single column.
    assert_eq!(*vec2(1, 2).as_ref(), [1, 2]);
    assert_eq!(*vec3(1, 2, 3).as_ref(), [1, 2, 3]);
    assert_eq!(*vec4(1, 2, 3, 4).as_ref(), [1, 2, 3, 4]);
    // matN builders return identity matrices.
    assert_eq!(*mat2::<i32>().as_ref(), [1, 0, 0, 1]);
    assert_eq!(*mat3::<i32>().as_ref(), [1, 0, 0, 0, 1, 0, 0, 0, 1]);
    assert_eq!(
        *mat4::<i32>().as_ref(),
        [1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1]
    );
}

// endregion: conversions

// region: arithmetic (exact integer)

#[test]
fn add_and_sub_integer_elementwise() {
    let a = Mat2::<i32>::from_slice(&[1, 2, 3, 4]);
    let b = Mat2::<i32>::from_slice(&[5, 6, 7, 8]);
    // element-wise: [1+5, 2+6, 3+7, 4+8]
    assert_eq!(*(a + b).as_ref(), [6, 8, 10, 12]);
    // element-wise: [5-1, 6-2, 7-3, 8-4]
    assert_eq!(*(b - a).as_ref(), [4, 4, 4, 4]);
}

#[test]
fn scalar_mul_square_and_nonsquare() {
    // Every entry scaled by the scalar.
    let sq = Mat2::<i32>::from_slice(&[1, 2, 3, 4]);
    assert_eq!(*(sq * 3).as_ref(), [3, 6, 9, 12]);
    let ns = Matrix::<i32, 2, 3>::from_slice(&[1, 2, 3, 4, 5, 6]);
    assert_eq!(*(ns * 2).as_ref(), [2, 4, 6, 8, 10, 12]);
}

#[test]
fn matmul_nonsquare_integer() {
    // A (2x3), col-major [1,2,3,4,5,6] => rows: R0=[1,3,5], R1=[2,4,6].
    // B (3x2), col-major [1,0,-1,2,1,0] => cols: C0=[1,0,-1], C1=[2,1,0].
    // C = A*B is 2x2:
    //   C(0,0)=R0.C0 = 1*1+3*0+5*(-1) = -4
    //   C(1,0)=R1.C0 = 2*1+4*0+6*(-1) = -4
    //   C(0,1)=R0.C1 = 1*2+3*1+5*0   =  5
    //   C(1,1)=R1.C1 = 2*2+4*1+6*0   =  8
    // Column-major flat = [C(0,0), C(1,0), C(0,1), C(1,1)] = [-4,-4,5,8].
    let a = Matrix::<i32, 2, 3>::from_slice(&[1, 2, 3, 4, 5, 6]);
    let b = Matrix::<i32, 3, 2>::from_slice(&[1, 0, -1, 2, 1, 0]);
    let c: Matrix<i32, 2, 2> = a * b;
    assert_eq!(*c.as_ref(), [-4, -4, 5, 8]);
}

#[test]
fn matmul_square_integer_and_identity() {
    // A col-major [1,2,3,4]: rows R0=[1,3], R1=[2,4].
    // B col-major [5,6,7,8]: cols C0=[5,6], C1=[7,8].
    //   C(0,0)=1*5+3*6=23  C(1,0)=2*5+4*6=34
    //   C(0,1)=1*7+3*8=31  C(1,1)=2*7+4*8=46
    // flat = [23,34,31,46].
    let a = Mat2::<i32>::from_slice(&[1, 2, 3, 4]);
    let b = Mat2::<i32>::from_slice(&[5, 6, 7, 8]);
    assert_eq!(*(a * b).as_ref(), [23, 34, 31, 46]);
    // Multiplying by identity is a no-op.
    assert_eq!(a * Mat2::<i32>::identity(), a);
    assert_eq!(Mat2::<i32>::identity() * a, a);
}

#[test]
fn transpose_square_swaps_rows_and_columns() {
    // 3x3 col-major [1..9]. Transpose swaps m(r,c) with m(c,r).
    // As a flat column-major array this maps [1,2,3,4,5,6,7,8,9] to
    // [1,4,7,2,5,8,3,6,9].
    let mut m = Matrix::<i32, 3, 3>::from_slice(&[1, 2, 3, 4, 5, 6, 7, 8, 9]);
    let t = m.transposed(); // non-mutating variant
    assert_eq!(*t.as_ref(), [1, 4, 7, 2, 5, 8, 3, 6, 9]);
    m.transpose(); // in-place variant must agree
    assert_eq!(m, t);
    // Transposing twice returns the original.
    m.transpose();
    assert_eq!(*m.as_ref(), [1, 2, 3, 4, 5, 6, 7, 8, 9]);
}

// endregion: arithmetic

// region: vector ops (exact)

#[test]
fn dot_and_sqr_len_integer() {
    // dot = sum of component products.
    let v1 = Vec3::<i32>::from_slice(&[1, 2, 3]);
    let v2 = Vec3::<i32>::from_slice(&[4, 5, 6]);
    assert_eq!(v1.dot(v2), 32); // 1*4 + 2*5 + 3*6 = 4+10+18
    // sqr_len = dot(self, self).
    let v = Vec3::<i32>::from_slice(&[3, 4, 12]);
    assert_eq!(v.sqr_len(), 9 + 16 + 144); // 169
    // Vec4 sqr_len for good measure: 1+4+9+16 = 30.
    assert_eq!(Vec4::<i32>::from_slice(&[1, 2, 3, 4]).sqr_len(), 30);
}

#[test]
fn cross_product_and_edge_cases() {
    let v1 = Vec3::<i32>::from_slice(&[2, 3, 4]);
    let v2 = Vec3::<i32>::from_slice(&[5, 6, 7]);
    // x = 3*7-6*4 = 21-24 = -3
    // y = 4*5-7*2 = 20-14 =  6
    // z = 2*6-5*3 = 12-15 = -3
    assert_eq!(*v1.cross(v2).as_ref(), [-3, 6, -3]);
    // Anti-commutative: v2 x v1 = -(v1 x v2).
    assert_eq!(*v2.cross(v1).as_ref(), [3, -6, 3]);
    // Cross of a vector with itself is the zero vector.
    assert_eq!(*v1.cross(v1).as_ref(), [0, 0, 0]);
    // Cross with the zero vector is the zero vector.
    let zero = Vec3::<i32>::from_slice(&[0, 0, 0]);
    assert_eq!(*v1.cross(zero).as_ref(), [0, 0, 0]);
}

#[test]
fn lerp_boundaries_and_midpoint_exact() {
    let v1 = Matrix::<f32, 3, 1>::from_slice(&[1., 2., 3.]);
    let v2 = Matrix::<f32, 3, 1>::from_slice(&[5., 6., 7.]);
    // lerp(a,b,t) = a - a*t + b*t. All halves are bit-exact in f32.
    assert_eq!(*v1.lerp(v2, 0.0).as_ref(), [1., 2., 3.]); // t=0 -> a
    assert_eq!(*v1.lerp(v2, 1.0).as_ref(), [5., 6., 7.]); // t=1 -> b
    assert_eq!(*v1.lerp(v2, 0.5).as_ref(), [3., 4., 5.]); // midpoint
}

// endregion: vector ops

// region: determinant & inverse

#[test]
fn determinants_integer() {
    // Mat2 [1,2,3,4]: det = m(0,0)m(1,1) - m(1,0)m(0,1) = 1*4 - 3*2 = -2.
    assert_eq!(Mat2::<i32>::from_slice(&[1, 2, 3, 4]).det(), -2);
    // Mat2 with a zero column is singular => det 0.
    assert_eq!(Mat2::<i32>::from_slice(&[0, 0, 3, 4]).det(), 0);
    // Mat3 [1,0,5, 2,1,6, 3,4,0] (column-major) => det 1 (worked by cofactor).
    assert_eq!(Mat3::<i32>::from_slice(&[1, 0, 5, 2, 1, 6, 3, 4, 0]).det(), 1);
    // Mat4 sign-pattern matrix => det -16.
    let m4 = Mat4::<i32>::from_slice(&[
        1, 1, 1, -1, 1, 1, -1, 1, 1, -1, 1, 1, -1, 1, 1, 1,
    ]);
    assert_eq!(m4.det(), -16);
    // Diagonal Mat4 diag(2,3,4,5): det = product = 120.
    let diag = Matrix::<i32, 4, 4>::new([
        [2, 0, 0, 0],
        [0, 3, 0, 0],
        [0, 0, 4, 0],
        [0, 0, 0, 5],
    ]);
    assert_eq!(diag.det(), 120);
    // Identity determinant is 1.
    assert_eq!(Mat3::<i32>::identity().det(), 1);
}

#[test]
fn mat2_invert_exact_and_roundtrip() {
    let orig = Mat2::<f32>::from_slice(&[1., 2., 3., 4.]);
    let mut m = orig;
    assert!(m.invert());
    // det = -2; inverse = (1/det) * [[d,-b],[-c,a]] laid out column-major:
    //   m0 = self(1,1)/det       = 4 / -2  = -2
    //   m1 = -self(0,1)/det      = -2 / -2 =  1
    //   m2 = -self(1,0)/det      = -3 / -2 =  1.5
    //   m3 = self(0,0)/det       = 1 / -2  = -0.5
    // All exactly representable in f32.
    assert_eq!(*m.as_ref(), [-2., 1., 1.5, -0.5]);
    // Round-trip: orig * inverse == identity (exact for these operands).
    assert_eq!(orig * m, Mat2::<f32>::identity());
}

#[test]
fn mat3_invert_exact_and_singular() {
    let orig = Mat3::<f32>::from_slice(&[1., 0., 5., 2., 1., 6., 3., 4., 0.]);
    let mut m = orig;
    assert!(m.invert());
    // det = 1, so the inverse equals the (integer) adjugate:
    assert_eq!(*m.as_ref(), [-24., 20., -5., 18., -15., 4., 5., -4., 1.]);
    // Round-trip to identity (exact).
    assert_eq!(orig * m, Mat3::<f32>::identity());

    // Singular matrix: det 0 => invert returns false and leaves it unchanged.
    let mut sing = Mat3::<f32>::from_slice(&[1., 0., 1., 0., 1., 0., 0., 0., 0.]);
    assert!(!sing.invert());
    assert_eq!(*sing.as_ref(), [1., 0., 1., 0., 1., 0., 0., 0., 0.]);
}

#[test]
fn mat4_invert_exact_and_roundtrip() {
    let orig = Mat4::<f32>::from_slice(&[
        1., 1., 1., -1., 1., 1., -1., 1., 1., -1., 1., 1., -1., 1., 1., 1.,
    ]);
    let mut m = orig;
    assert!(m.invert());
    // det = -16; every inverse entry is +/-0.25, all exact in f32.
    assert_eq!(
        *m.as_ref(),
        [
            0.25, 0.25, 0.25, -0.25, 0.25, 0.25, -0.25, 0.25, 0.25, -0.25, 0.25, 0.25, -0.25,
            0.25, 0.25, 0.25
        ]
    );
    // Round-trip to identity (exact).
    assert_eq!(orig * m, Mat4::<f32>::identity());
}

// endregion: determinant & inverse

// region: length & normalization (float)

#[test]
fn len_exact_perfect_square() {
    // len = sqrt(dot(self,self)); sqrt(9+16+144)=sqrt(169)=13 exactly.
    let v = Matrix::<f32, 3, 1>::from_slice(&[3., 4., 12.]);
    assert_eq!(v.len(), 13.0);
}

#[test]
fn normalize_unit_and_zero_vector() {
    // [3,4] has length 5; normalized = [0.6, 0.8]. Division is irrational-ish,
    // so compare within an epsilon.
    let mut v = Vec2::<f32>::from_slice(&[3., 4.]);
    assert!(v.normalize());
    assert_float_eq!(v, Vec2::<f32>::new([[0.6, 0.8]]), 1e-6);
    // The resulting vector has unit length.
    assert_float_eq!(v.len(), 1.0_f32, 1e-6);

    // normalized() on a fresh copy returns Some(unit vector).
    let src = Vec2::<f32>::from_slice(&[0., 5.]);
    let n = src.normalized().expect("non-zero vector normalizes");
    assert_float_eq!(n, Vec2::<f32>::new([[0.0, 1.0]]), 1e-6);

    // Zero vector: length 0 => normalize returns false and leaves it unchanged;
    // normalized() returns None.
    let mut z = Vec2::<f32>::from_slice(&[0., 0.]);
    assert!(!z.normalize());
    assert_eq!(*z.as_ref(), [0., 0.]);
    assert!(Vec2::<f32>::from_slice(&[0., 0.]).normalized().is_none());
}

// endregion: length & normalization

// region: num trait impls (Zero / One)

#[test]
fn zero_and_one_trait_impls() {
    // Zero: zero() is the all-zero matrix; is_zero() detects it.
    let z = Matrix::<i32, 2, 3>::zero();
    assert!(z.is_zero());
    let mut nz = z;
    nz[(0, 0)] = 1;
    assert!(!nz.is_zero());
    // One (square only): one() is the identity matrix.
    let o = Mat3::<i32>::one();
    assert_eq!(*o.as_ref(), [1, 0, 0, 0, 1, 0, 0, 0, 1]);
}

// endregion: num trait impls
