//! Integration tests for the `munum::matrix_special` module, exercised
//! entirely through the crate's PUBLIC API.
//!
//! Matrices are COLUMN-MAJOR: `Matrix::new([[col0], [col1], ...])`,
//! `from_slice`/`as_ref` are column-major flat, and `m[(row, col)]` reads
//! `col`-th column, `row`-th entry. Every expected value below is computed by
//! hand from the definitions in `src/matrix_special.rs`.
//!
//! Exact integer / simple-rational results use `assert_eq!`; only genuinely
//! inexact float round-trips (division producing 1/3, 1/5, ...) use
//! `assert_float_eq!` with an explicit epsilon.

use munum::{
    assert_float_eq, mat2, mat3, mat4, vec2, vec3, vec4, Mat2, Mat3, Mat4, Vec2, Vec3, Vec4,
    Vector,
};

// region: Constructors

#[test]
fn vec_constructors_store_components_in_order() {
    // vec2/3/4 build a single column: as_ref lists the components in order.
    assert_eq!(*vec2(1_i32, 2).as_ref(), [1, 2]);
    assert_eq!(*vec3(1_i32, 2, 3).as_ref(), [1, 2, 3]);
    assert_eq!(*vec4(1_i32, 2, 3, 4).as_ref(), [1, 2, 3, 4]);
}

#[test]
fn vector_from_array_matches_input() {
    // Vector::from_array wraps the array as one column; as_ref returns it verbatim.
    let v = Vector::<i32, 4>::from_array([9, 8, 7, 6]);
    assert_eq!(*v.as_ref(), [9, 8, 7, 6]);
}

#[test]
fn mat_constructors_are_identity() {
    // mat2/3/4 return identity matrices (column-major flat).
    assert_eq!(*mat2::<i32>().as_ref(), [1, 0, 0, 1]);
    assert_eq!(*mat3::<i32>().as_ref(), [1, 0, 0, 0, 1, 0, 0, 0, 1]);
    assert_eq!(
        *mat4::<i32>().as_ref(),
        [1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1]
    );
}

// endregion: Constructors

// region: Vector array conversions

#[test]
fn vector_from_and_into_array_roundtrip() {
    // From<[T; R]> for Vector, and From<Vector> for [T; R].
    let v = Vec3::<i32>::from([5, 6, 7]);
    assert_eq!(*v.as_ref(), [5, 6, 7]);
    let arr: [i32; 3] = v.into();
    assert_eq!(arr, [5, 6, 7]);
}

// endregion: Vector array conversions

// region: Vec dimension conversions

#[test]
fn vec2_to_vec3_appends_one() {
    // From<Vec2> for Vec3 sets z = 1.
    let v = Vec3::from(vec2(2_i32, 3));
    assert_eq!(*v.as_ref(), [2, 3, 1]);
}

#[test]
fn vec3_to_vec2_truncates() {
    // From<Vec3> for Vec2 keeps (x, y).
    let v = Vec2::from(vec3(2_i32, 3, 4));
    assert_eq!(*v.as_ref(), [2, 3]);
}

#[test]
fn vec3_to_vec4_appends_one() {
    // From<Vec3> for Vec4 sets w = 1.
    let v = Vec4::from(vec3(2_i32, 3, 4));
    assert_eq!(*v.as_ref(), [2, 3, 4, 1]);
}

#[test]
fn vec4_to_vec3_truncates() {
    // From<Vec4> for Vec3 keeps (x, y, z) and drops w.
    let v = Vec3::from(vec4(2_i32, 3, 4, 5));
    assert_eq!(*v.as_ref(), [2, 3, 4]);
}

#[test]
fn from_vec2_and_from_vec3_use_given_last_component() {
    // Vec3::from_vec2(v, z) and Vec4::from_vec3(v, w).
    assert_eq!(*Vec3::from_vec2(vec2(2_i32, 3), 4).as_ref(), [2, 3, 4]);
    assert_eq!(*Vec4::from_vec3(vec3(2_i32, 3, 4), 1).as_ref(), [2, 3, 4, 1]);
}

#[test]
fn swizzles_extract_expected_components() {
    // xy() from Vec3/Vec4 and xyz() from Vec4.
    assert_eq!(*vec3(2_i32, 3, 4).xy().as_ref(), [2, 3]);
    assert_eq!(*vec4(1_i32, 2, 3, 4).xy().as_ref(), [1, 2]);
    assert_eq!(*vec4(1_i32, 2, 3, 4).xyz().as_ref(), [1, 2, 3]);
}

// endregion: Vec dimension conversions

// region: Mat block conversions

#[test]
fn mat2_to_mat3_places_block_and_fills_identity() {
    // Mat2 col0=[2,3], col1=[4,5] -> Mat3 upper-left 2x2 block, rest identity:
    // col0=[2,3,0], col1=[4,5,0], col2=[0,0,1].
    let m = Mat3::from(Mat2::<i32>::from_slice(&[2, 3, 4, 5]));
    assert_eq!(*m.as_ref(), [2, 3, 0, 4, 5, 0, 0, 0, 1]);
}

#[test]
fn mat3_to_mat2_takes_upper_left_block() {
    // Mat3 col0=[2,3,4], col1=[5,6,7], col2=[8,9,1].
    // Upper-left 2x2: col0=[2,3], col1=[5,6].
    let m = Mat2::from(Mat3::<i32>::from_slice(&[2, 3, 4, 5, 6, 7, 8, 9, 1]));
    assert_eq!(*m.as_ref(), [2, 3, 5, 6]);
}

#[test]
fn mat3_to_mat4_places_block_and_fills_identity() {
    // Mat3 cols [2,3,4],[5,6,7],[8,9,10] -> Mat4 upper-left 3x3 block,
    // new row/col zeroed except m[(3,3)] = 1.
    let m = Mat4::from(Mat3::<i32>::from_slice(&[2, 3, 4, 5, 6, 7, 8, 9, 10]));
    assert_eq!(
        *m.as_ref(),
        [2, 3, 4, 0, 5, 6, 7, 0, 8, 9, 10, 0, 0, 0, 0, 1]
    );
}

#[test]
fn mat4_to_mat3_takes_upper_left_block() {
    // Mat4 cols [2,3,4,11],[5,6,7,12],[8,9,10,13],[14,15,0,1].
    // Upper-left 3x3: cols [2,3,4],[5,6,7],[8,9,10].
    let m = Mat3::from(Mat4::<i32>::from_slice(&[
        2, 3, 4, 11, 5, 6, 7, 12, 8, 9, 10, 13, 14, 15, 0, 1,
    ]));
    assert_eq!(*m.as_ref(), [2, 3, 4, 5, 6, 7, 8, 9, 10]);
}

// endregion: Mat block conversions

// region: Cross product

#[test]
fn cross_product_basic() {
    // a=[2,3,4], b=[5,6,7]:
    // x = 3*7 - 6*4 = 21-24 = -3
    // y = 4*5 - 7*2 = 20-14 =  6
    // z = 2*6 - 5*3 = 12-15 = -3
    let a = vec3(2_i32, 3, 4);
    let b = vec3(5_i32, 6, 7);
    assert_eq!(*a.cross(b).as_ref(), [-3, 6, -3]);
}

#[test]
fn cross_product_of_basis_vectors() {
    // Right-handed basis: x×y=z, y×z=x, z×x=y.
    let x = vec3(1_i32, 0, 0);
    let y = vec3(0_i32, 1, 0);
    let z = vec3(0_i32, 0, 1);
    assert_eq!(*x.cross(y).as_ref(), [0, 0, 1]);
    assert_eq!(*y.cross(z).as_ref(), [1, 0, 0]);
    assert_eq!(*z.cross(x).as_ref(), [0, 1, 0]);
}

#[test]
fn cross_product_is_anticommutative() {
    // a×b = [-3,6,-3] (above) => b×a must be its negation [3,-6,3].
    let a = vec3(2_i32, 3, 4);
    let b = vec3(5_i32, 6, 7);
    assert_eq!(*a.cross(b).as_ref(), [-3, 6, -3]);
    assert_eq!(*b.cross(a).as_ref(), [3, -6, 3]);
}

#[test]
fn cross_product_of_parallel_or_zero_is_zero() {
    // Parallel vectors (w = 2v) and self-cross give the zero vector;
    // crossing with the zero vector also gives zero.
    let v = vec3(1_i32, 2, 3);
    let w = vec3(2_i32, 4, 6); // 2*v
    let zero = vec3(0_i32, 0, 0);
    assert_eq!(*v.cross(w).as_ref(), [0, 0, 0]);
    assert_eq!(*v.cross(v).as_ref(), [0, 0, 0]);
    assert_eq!(*v.cross(zero).as_ref(), [0, 0, 0]);
}

// endregion: Cross product

// region: Mat2 det & invert

#[test]
fn mat2_det_basic_and_singular() {
    // det = m00*m11 - m10*m01 (column-major indices).
    // [1,2,3,4]: cols [1,2],[3,4] => 1*4 - 3*2 = -2.
    assert_eq!(Mat2::<i32>::from_slice(&[1, 2, 3, 4]).det(), -2);
    // [1,2,2,4]: 1*4 - 2*2 = 0 (columns proportional => singular).
    assert_eq!(Mat2::<i32>::from_slice(&[1, 2, 2, 4]).det(), 0);
}

#[test]
fn mat2_invert_exact() {
    // det = -2. Inverse column-major:
    //   [0][0] = m11/det        =  4/-2  = -2
    //   [0][1] = -m01/det       = -2/-2  =  1
    //   [1][0] = -m10/det       = -3/-2  =  1.5
    //   [1][1] =  m00/det       =  1/-2  = -0.5
    // (halves are exact in f32.)
    let mut m = Mat2::<f32>::from_slice(&[1., 2., 3., 4.]);
    assert!(m.invert());
    assert_eq!(*m.as_ref(), [-2., 1., 1.5, -0.5]);
}

#[test]
fn mat2_invert_singular_returns_false_and_leaves_input() {
    // det = 0 => invert returns false and does not mutate the matrix.
    let mut m = Mat2::<i32>::from_slice(&[1, 2, 2, 4]);
    assert!(!m.invert());
    assert_eq!(*m.as_ref(), [1, 2, 2, 4]);
}

// endregion: Mat2 det & invert

// region: Mat3 det & invert

#[test]
fn mat3_det_basic_and_singular() {
    // [1,0,5,2,1,6,3,4,0] cols [1,0,5],[2,1,6],[3,4,0]:
    // 1*(1*0-4*6) - 2*(0*0-4*5) + 3*(0*6-1*5)
    //   = 1*(-24) - 2*(-20) + 3*(-5) = -24 + 40 - 15 = 1.
    assert_eq!(Mat3::<i32>::from_slice(&[1, 0, 5, 2, 1, 6, 3, 4, 0]).det(), 1);
    // [1,0,1,0,1,0,0,0,0] has a zero column (col2) => det = 0.
    assert_eq!(Mat3::<i32>::from_slice(&[1, 0, 1, 0, 1, 0, 0, 0, 0]).det(), 0);
}

#[test]
fn mat3_invert_exact_integer() {
    // det = 1 => integer inverse (division by 1 is exact even for i32).
    // Cofactor/adjugate (column-major) evaluates to:
    //   [-24, 20, -5, 18, -15, 4, 5, -4, 1].
    let mut m = Mat3::<i32>::from_slice(&[1, 0, 5, 2, 1, 6, 3, 4, 0]);
    assert!(m.invert());
    assert_eq!(*m.as_ref(), [-24, 20, -5, 18, -15, 4, 5, -4, 1]);
}

#[test]
fn mat3_invert_roundtrip_identity_exact() {
    // M * M^-1 = I, exact in integer arithmetic since det = 1.
    let m = Mat3::<i32>::from_slice(&[1, 0, 5, 2, 1, 6, 3, 4, 0]);
    let mut inv = m;
    assert!(inv.invert());
    let prod = m * inv;
    assert_eq!(*prod.as_ref(), *mat3::<i32>().as_ref());
}

#[test]
fn mat3_invert_float_roundtrip_diagonal() {
    // Diagonal scale S = diag(2,3,5). Inverse = diag(1/2, 1/3, 1/5);
    // 1/3 and 1/5 are NOT exact in binary, so use assert_float_eq.
    let s = Mat3::<f32>::from_slice(&[2., 0., 0., 0., 3., 0., 0., 0., 5.]);
    let mut inv = s;
    assert!(inv.invert());
    let expected_inv =
        Mat3::<f32>::from_slice(&[0.5, 0., 0., 0., 1. / 3., 0., 0., 0., 0.2]);
    assert_float_eq!(inv, expected_inv, 1e-6);
    // Round-trip back to identity.
    let prod = s * inv;
    assert_float_eq!(prod, mat3::<f32>(), 1e-6);
}

#[test]
fn mat3_invert_singular_returns_false_and_leaves_input() {
    let mut m = Mat3::<i32>::from_slice(&[1, 0, 1, 0, 1, 0, 0, 0, 0]);
    assert!(!m.invert());
    assert_eq!(*m.as_ref(), [1, 0, 1, 0, 1, 0, 0, 0, 0]);
}

#[test]
fn normal_matrix_of_orthogonal_is_unchanged() {
    // A permutation (orthogonal) matrix: inverse = transpose, so the
    // inverse-transpose (normal matrix) equals the original. det = 1,
    // so i32 division is exact.
    let mut m = Mat3::<i32>::from_slice(&[0, 0, 1, 1, 0, 0, 0, 1, 0]);
    assert!(m.normal_matrix());
    assert_eq!(*m.as_ref(), [0, 0, 1, 1, 0, 0, 0, 1, 0]);
}

#[test]
fn normal_matrix_singular_returns_false_and_leaves_input() {
    // Singular => invert fails => normal_matrix returns false, no mutation.
    let mut m = Mat3::<i32>::from_slice(&[1, 0, 1, 0, 1, 0, 0, 0, 0]);
    assert!(!m.normal_matrix());
    assert_eq!(*m.as_ref(), [1, 0, 1, 0, 1, 0, 0, 0, 0]);
}

// endregion: Mat3 det & invert

// region: Mat4 det & invert

#[test]
fn mat4_det_basic_and_singular() {
    // Hadamard-like ±1 matrix, det = -16 (verified via the 2x2-minor
    // expansion the crate uses: only fa1,fa2,fa3,fa4 and fb1..fb4 are
    // nonzero and combine to -4-4-4-4 = -16).
    assert_eq!(
        Mat4::<i32>::from_slice(&[1, 1, 1, -1, 1, 1, -1, 1, 1, -1, 1, 1, -1, 1, 1, 1]).det(),
        -16
    );
    // Identity with a zeroed last column => det = 0.
    assert_eq!(
        Mat4::<i32>::from_slice(&[1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0]).det(),
        0
    );
}

#[test]
fn mat4_invert_exact() {
    // det = -16; the inverse of this ±1 matrix is all ±0.25 (exact in f32).
    let mut m = Mat4::<f32>::from_slice(&[
        1., 1., 1., -1., 1., 1., -1., 1., 1., -1., 1., 1., -1., 1., 1., 1.,
    ]);
    assert!(m.invert());
    assert_eq!(
        *m.as_ref(),
        [
            0.25, 0.25, 0.25, -0.25, 0.25, 0.25, -0.25, 0.25, 0.25, -0.25, 0.25, 0.25, -0.25,
            0.25, 0.25, 0.25
        ]
    );
}

#[test]
fn mat4_invert_roundtrip_identity() {
    // M * M^-1 ≈ I. Entries are exact quarters here, but compare with a small
    // epsilon to stay robust to float multiply/accumulate ordering.
    let m = Mat4::<f32>::from_slice(&[
        1., 1., 1., -1., 1., 1., -1., 1., 1., -1., 1., 1., -1., 1., 1., 1.,
    ]);
    let mut inv = m;
    assert!(inv.invert());
    let prod = m * inv;
    assert_float_eq!(prod, mat4::<f32>(), 1e-6);
}

#[test]
fn mat4_invert_singular_returns_false_and_leaves_input() {
    // Zeroed last column => det = 0 => invert returns false, no mutation.
    let data = [1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0];
    let mut m = Mat4::<i32>::from_slice(&data);
    assert!(!m.invert());
    assert_eq!(*m.as_ref(), data);
}

// endregion: Mat4 det & invert