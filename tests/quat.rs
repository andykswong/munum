//! Integration tests for the public `munum::Quaternion` type.
//!
//! Only the crate's public API is exercised. Integer-exact operations use
//! `assert_eq!`; irrational results (trig-based construction, rotation,
//! normalization, slerp) use `assert_float_eq!` with an explicit epsilon.
//!
//! Conventions from the source:
//!   * Components are stored xyzw; `identity()` = (0,0,0,1).
//!   * `from_angle_*` / `from_axis_angle` use half-angle: xyz = axis*sin(a/2),
//!     w = cos(a/2).
//!   * `from_unit_vecs` handles the parallel (identity) and anti-parallel
//!     (PI about a perpendicular axis) special cases.

use core::f32::consts::PI;
use munum::{assert_float_eq, quat, Mat3, Quaternion, Vec3};
use num::{One, Zero};

const EPS: f32 = 1e-5;
const SIN_PI_6: f32 = 0.5; // sin(30 deg)
const COS_PI_6: f32 = 0.866_025_4; // sqrt(3)/2
const SIN_PI_4: f32 = core::f32::consts::FRAC_1_SQRT_2;

// region: Construction

#[test]
fn identity_is_zero_zero_zero_one() {
    assert_eq!(*Quaternion::<f32>::identity().as_ref(), [0., 0., 0., 1.]);
}

#[test]
fn new_and_from_array_and_from_slice_agree() {
    let a = Quaternion::<i32>::new(1, 2, 3, 4);
    let b = Quaternion::<i32>::from_array([1, 2, 3, 4]);
    let c = Quaternion::<i32>::from_slice(&[1, 2, 3, 4]);
    assert_eq!(*a.as_ref(), [1, 2, 3, 4]);
    assert_eq!(*b.as_ref(), [1, 2, 3, 4]);
    assert_eq!(*c.as_ref(), [1, 2, 3, 4]);
}

#[test]
fn from_axis_angle_uses_half_angle() {
    let q = <Quaternion>::from_axis_angle(<Vec3>::from_slice(&[3., 5., 7.]), PI / 3.);
    assert_float_eq!(
        q.as_ref(),
        &[3. * SIN_PI_6, 5. * SIN_PI_6, 7. * SIN_PI_6, COS_PI_6],
        EPS
    );
}

#[test]
fn from_angle_axes() {
    assert_float_eq!(<Quaternion>::from_angle_x(PI / 3.).as_ref(), &[SIN_PI_6, 0., 0., COS_PI_6], EPS);
    assert_float_eq!(<Quaternion>::from_angle_y(PI / 3.).as_ref(), &[0., SIN_PI_6, 0., COS_PI_6], EPS);
    assert_float_eq!(<Quaternion>::from_angle_z(PI / 3.).as_ref(), &[0., 0., SIN_PI_6, COS_PI_6], EPS);
}

#[test]
fn from_unit_vecs_general_case() {
    // +Z to +X is a 90 deg rotation about +Y.
    let q = <Quaternion>::from_unit_vecs(<Vec3>::from_slice(&[0., 0., 1.]), <Vec3>::from_slice(&[1., 0., 0.]));
    assert_float_eq!(q.as_ref(), &[0., SIN_PI_4, 0., SIN_PI_4], EPS);
}

#[test]
fn from_unit_vecs_parallel_is_identity() {
    let q = <Quaternion>::from_unit_vecs(<Vec3>::from_slice(&[1., 0., 0.]), <Vec3>::from_slice(&[1., 0., 0.]));
    assert_float_eq!(q.as_ref(), &[0., 0., 0., 1.], EPS);
}

#[test]
fn from_unit_vecs_antiparallel_is_180_about_perpendicular() {
    // +Z to -Z: a 180 deg rotation about a perpendicular axis (0, z, -y) = (0,1,0).
    let q = <Quaternion>::from_unit_vecs(<Vec3>::from_slice(&[0., 0., 1.]), <Vec3>::from_slice(&[0., 0., -1.]));
    assert_float_eq!(q.as_ref(), &[0., 1., 0., 0.], EPS);
    // The result is a unit quaternion representing a real half-turn.
    assert_float_eq!(q.len(), 1., EPS);
}

// endregion: Construction

// region: Conversions

#[test]
fn from_vec3_sets_w_zero_and_back() {
    let q = Quaternion::from(Vec3::<i32>::from_slice(&[2, 3, 4]));
    assert_eq!(*q.as_ref(), [2, 3, 4, 0]);
    let v = Vec3::from(Quaternion::<i32>::from_slice(&[2, 3, 4, 5]));
    assert_eq!(*v.as_ref(), [2, 3, 4]);
}

#[test]
fn to_mat3_for_120deg_diagonal_rotation() {
    let s = 1. / 3_f32.sqrt();
    let m = <Mat3>::from(<Quaternion>::from_slice(&[s, s, s, 0.]));
    // Column-major 3x3.
    assert_float_eq!(
        m.as_ref(),
        &[-1. / 3., 2. / 3., 2. / 3., 2. / 3., -1. / 3., 2. / 3., 2. / 3., 2. / 3., -1. / 3.],
        EPS
    );
}

#[test]
fn identity_quat_to_mat3_is_identity() {
    let m = <Mat3>::from(Quaternion::<f32>::identity());
    assert_float_eq!(m.as_ref(), &[1., 0., 0., 0., 1., 0., 0., 0., 1.], EPS);
}

// endregion: Conversions

// region: Ops

#[test]
fn dot_and_sqr_len_and_len() {
    let a = Quaternion::<i32>::from_slice(&[29, 31, 37, 41]);
    let b = Quaternion::<i32>::from_slice(&[43, 47, 53, 59]);
    assert_eq!(a.dot(b), 7084); // 29*43 + 31*47 + 37*53 + 41*59
    assert_eq!(Quaternion::<i32>::from_slice(&[2, 5, 14, 8]).sqr_len(), 289); // 4+25+196+64
    assert_eq!(<Quaternion>::from_slice(&[2., 5., 14., 8.]).len(), 17.); // sqrt(289)
}

#[test]
fn conj_negates_xyz_only() {
    let mut q = Quaternion::<i32>::from_slice(&[2, 5, 14, 8]);
    q.conj();
    assert_eq!(*q.as_ref(), [-2, -5, -14, 8]);
}

#[test]
fn invert_of_nonzero_quat() {
    let mut q = <Quaternion>::from_slice(&[2., 5., 14., 8.]);
    assert!(q.invert());
    // conj / sqr_len = (-2,-5,-14,8)/289
    assert_float_eq!(q.as_ref(), &[-2. / 289., -5. / 289., -14. / 289., 8. / 289.], EPS);
}

#[test]
fn invert_of_zero_quat_fails() {
    let mut q = Quaternion::<f32>::from_slice(&[0., 0., 0., 0.]);
    assert!(!q.invert());
}

#[test]
fn rotate_vec3_by_90deg_about_y() {
    // 90 deg about +Y sends (1,1,1) to (1,1,-1).
    let q = <Quaternion>::from_slice(&[0., SIN_PI_4, 0., SIN_PI_4]);
    let v = <Vec3>::from_slice(&[1., 1., 1.]);
    assert_float_eq!(q.rotate_vec3(v).as_ref(), &[1., 1., -1.], EPS);
}

#[test]
fn rotate_vec3_by_identity_is_unchanged() {
    let q = Quaternion::<f32>::identity();
    assert_float_eq!(q.rotate_vec3(<Vec3>::from_slice(&[3., -2., 5.])).as_ref(), &[3., -2., 5.], EPS);
}

#[test]
fn normalize_and_normalized() {
    let mut q = <Quaternion>::from_slice(&[2., 5., 14., 8.]);
    assert!(q.normalize());
    assert_float_eq!(q.as_ref(), &[2. / 17., 5. / 17., 14. / 17., 8. / 17.], EPS);

    let n = <Quaternion>::from_slice(&[2., 5., 14., 8.]).normalized().unwrap();
    assert_float_eq!(n.as_ref(), &[2. / 17., 5. / 17., 14. / 17., 8. / 17.], EPS);

    // A zero quaternion cannot be normalized.
    assert!(Quaternion::<f32>::from_slice(&[0., 0., 0., 0.]).normalized().is_none());
}

// endregion: Ops

// region: Interpolation

#[test]
fn lerp_midpoint() {
    // cos(PI/4) = sin(PI/4), so dot(a, b) = 0 (not negative): blend halfway
    // then normalize -> (1, 0, 0, 0).
    let a = <Quaternion>::from_slice(&[SIN_PI_4, 0., 0., SIN_PI_4]);
    let b = <Quaternion>::from_slice(&[SIN_PI_4, 0., 0., -SIN_PI_4]);
    assert_float_eq!(a.lerp(b, 0.5).as_ref(), &[1., 0., 0., 0.], EPS);
}

#[test]
fn lerp_negative_dot_takes_shortest_path() {
    // dot(identity, -identity) = -1 < 0 -> negate rhs -> halfway is identity.
    let a = Quaternion::<f32>::identity();
    let b = Quaternion::<f32>::from_slice(&[0., 0., 0., -1.]);
    assert_float_eq!(a.lerp(b, 0.5).as_ref(), &[0., 0., 0., 1.], EPS);
}

#[test]
fn slerp_spherical_midpoint() {
    // From the doctest: q1 at +30 deg-ish, q2 chosen so the midpoint is a 45 deg
    // rotation about X.
    let q1 = <Quaternion>::from_slice(&[SIN_PI_6, 0., 0., COS_PI_6]);
    let q2 = <Quaternion>::from_slice(&[-COS_PI_6, 0., 0., -SIN_PI_6]);
    assert_float_eq!(q1.slerp(q2, 0.5).as_ref(), &[SIN_PI_4, 0., 0., SIN_PI_4], EPS);
}

#[test]
fn slerp_endpoints_and_close_fallback() {
    let a = <Quaternion>::from_slice(&[SIN_PI_4, 0., 0., SIN_PI_4]);
    let b = <Quaternion>::from_slice(&[0., SIN_PI_4, 0., SIN_PI_4]);
    // t = 0 returns the first endpoint exactly.
    assert_float_eq!(a.slerp(b, 0.).as_ref(), &[SIN_PI_4, 0., 0., SIN_PI_4], EPS);
    // Nearly-identical inputs hit the linear-fallback branch (no NaN from acos).
    let same = Quaternion::<f32>::identity();
    assert_float_eq!(same.slerp(Quaternion::<f32>::identity(), 0.5).as_ref(), &[0., 0., 0., 1.], EPS);
}

// endregion: Interpolation

// region: Arithmetic and trait impls

#[test]
fn free_fn_quat_constructs() {
    assert_eq!(*quat(1, 2, 3, 4).as_ref(), [1, 2, 3, 4]);
}

#[test]
fn zero_and_one_traits() {
    assert_eq!(*Quaternion::<i32>::zero().as_ref(), [0, 0, 0, 0]);
    assert!(Quaternion::<i32>::zero().is_zero());
    assert!(!Quaternion::<i32>::from_slice(&[0, 0, 0, 1]).is_zero());
    // One is the identity rotation.
    assert_eq!(*Quaternion::<i32>::one().as_ref(), [0, 0, 0, 1]);
}

#[test]
fn from_array_slice_and_into_array() {
    let q: Quaternion<i32> = [1, 2, 3, 4].into();
    assert_eq!(*q.as_ref(), [1, 2, 3, 4]);
    let q2: Quaternion<i32> = (&[5, 6, 7, 8][..]).into();
    assert_eq!(*q2.as_ref(), [5, 6, 7, 8]);
    let arr: [i32; 4] = Quaternion::<i32>::from_slice(&[9, 10, 11, 12]).into();
    assert_eq!(arr, [9, 10, 11, 12]);
}

#[test]
fn index_and_index_mut() {
    let mut q = Quaternion::<i32>::from_slice(&[1, 2, 3, 4]);
    assert_eq!(q[0], 1);
    assert_eq!(q[3], 4);
    q[1] = 20;
    assert_eq!(q[1], 20);
}

#[test]
fn scalar_mul_and_div() {
    let q = Quaternion::<i32>::from_slice(&[2, 4, 6, 8]);
    assert_eq!(*(q * 3).as_ref(), [6, 12, 18, 24]);
    assert_eq!(*(q / 2).as_ref(), [1, 2, 3, 4]);
    let mut m = q;
    m *= 2;
    assert_eq!(*m.as_ref(), [4, 8, 12, 16]);
    let mut d = q;
    d /= 2;
    assert_eq!(*d.as_ref(), [1, 2, 3, 4]);
}

#[test]
fn component_add_and_sub() {
    let a = Quaternion::<i32>::from_slice(&[1, 2, 3, 4]);
    let b = Quaternion::<i32>::from_slice(&[10, 20, 30, 40]);
    assert_eq!(*(a + b).as_ref(), [11, 22, 33, 44]);
    assert_eq!(*(b - a).as_ref(), [9, 18, 27, 36]);
    let mut m = a;
    m += b;
    assert_eq!(*m.as_ref(), [11, 22, 33, 44]);
    let mut s = b;
    s -= a;
    assert_eq!(*s.as_ref(), [9, 18, 27, 36]);
}

#[test]
fn hamilton_product_mul() {
    // Exact integer Hamilton product (from the doctest).
    let q = Quaternion::<i32>::from_slice(&[2, 3, 5, -7]);
    let r = Quaternion::<i32>::from_slice(&[11, 13, -17, 19]);
    assert_eq!(*(q * r).as_ref(), [-155, 55, 207, -109]);
    let mut m = q;
    m *= r;
    assert_eq!(*m.as_ref(), [-155, 55, 207, -109]);
}

#[test]
fn identity_is_multiplicative_unit() {
    let q = Quaternion::<i32>::from_slice(&[2, 3, 5, -7]);
    let id = Quaternion::<i32>::identity();
    assert_eq!(*(q * id).as_ref(), *q.as_ref());
    assert_eq!(*(id * q).as_ref(), *q.as_ref());
}

// endregion: Arithmetic and trait impls
