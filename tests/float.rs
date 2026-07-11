//! Integration tests for the public `munum::float` module.
//!
//! Only the crate's public API is exercised:
//!   * `munum::float::EPSILON` (the `pub const`) and `munum::float::epsilon()`
//!   * the `munum::FloatOps` trait (acos/cos/sin/sqrt/tan) for f32 and f64
//!   * the `munum::FloatEq` trait for scalars, `&[V]` slices, `Matrix`, `Quaternion`
//!   * the `munum::assert_float_eq!` macro (2-arg default-epsilon and 3-arg forms)
//!
//! Supporting operations (dot/cross/matmul/add/det/invert/normalize/slerp/lerp)
//! are used to produce inputs for `FloatEq`/`FloatOps`; integer results are
//! checked exactly with `assert_eq!`, and only irrational/transcendental
//! results use `assert_float_eq!` with an explicit small epsilon.
//!
//! Key facts derived from the source:
//!   * `EPSILON = 128. * f32::EPSILON`. `f32::EPSILON = 2^-23`, so
//!     `EPSILON = 2^7 * 2^-23 = 2^-16 = 0.0000152587890625` (exactly representable).
//!   * `epsilon::<T>() = NumCast::from(EPSILON).unwrap_or(T::zero())`.
//!   * `FloatEq::float_eq(a, b, eps)` is `abs(a-b) < eps` (STRICT less-than).
//!   * Matrices are COLUMN-MAJOR: `as_ref()` yields `[col0.., col1.., ...]`.

use munum::float::{epsilon, EPSILON};
use munum::{assert_float_eq, FloatEq, FloatOps, Mat2, Mat3, Mat4, Matrix, Quaternion, Vec2, Vec3};

use std::f32::consts as f32c;
use std::f64::consts as f64c;

// region: epsilon

#[test]
fn epsilon_constant_is_2_pow_neg16() {
    // EPSILON = 128 * f32::EPSILON = 2^7 * 2^-23 = 2^-16 = 0.0000152587890625.
    // 2^-16 is exactly representable, so this is a bit-exact equality.
    assert_eq!(EPSILON, 2.0_f32.powi(-16));
    assert_eq!(EPSILON, 128. * f32::EPSILON);
}

#[test]
fn epsilon_f32_matches_constant() {
    // epsilon::<f32>() = NumCast::from(EPSILON) = EPSILON (identity cast).
    assert_eq!(epsilon::<f32>(), EPSILON);
    assert_eq!(epsilon::<f32>(), 2.0_f32.powi(-16));
}

#[test]
fn epsilon_f64_value() {
    // Widening cast f32 -> f64 of 2^-16 is exact => 2^-16 as f64.
    assert_eq!(epsilon::<f64>(), 2.0_f64.powi(-16));
    assert_eq!(epsilon::<f64>(), 0.0000152587890625_f64);
}

#[test]
fn epsilon_i32_truncates_to_zero() {
    // NumCast::from(1.52587890625e-5_f32) to i32 truncates toward zero => 0
    // (and even a failed cast would fall back to T::zero() via unwrap_or).
    assert_eq!(epsilon::<i32>(), 0_i32);
}

// endregion: epsilon

// region: FloatOps (f32)

#[test]
fn floatops_f32_exact_values() {
    // These transcendental/sqrt inputs give bit-exact results, so use assert_eq.
    // Explicit `FloatOps::` path guarantees the trait impl (not an inherent
    // method) is exercised.
    assert_eq!(FloatOps::cos(0.0_f32), 1.0); // cos(0) = 1
    assert_eq!(FloatOps::sin(0.0_f32), 0.0); // sin(0) = 0
    assert_eq!(FloatOps::tan(0.0_f32), 0.0); // tan(0) = 0
    assert_eq!(FloatOps::acos(1.0_f32), 0.0); // acos(1) = 0
    assert_eq!(FloatOps::sqrt(4.0_f32), 2.0); // sqrt(4) = 2
    assert_eq!(FloatOps::sqrt(0.25_f32), 0.5); // sqrt(1/4) = 1/2
    assert_eq!(FloatOps::sqrt(9.0_f32), 3.0); // sqrt(9) = 3
}

#[test]
fn floatops_f32_transcendental() {
    // Irrational / rounded results: compare within 1e-6.
    assert_float_eq!(FloatOps::cos(f32c::FRAC_PI_3), 0.5_f32, 1e-6); // cos(60deg)=1/2
    assert_float_eq!(FloatOps::sin(f32c::FRAC_PI_6), 0.5_f32, 1e-6); // sin(30deg)=1/2
    assert_float_eq!(FloatOps::tan(f32c::FRAC_PI_4), 1.0_f32, 1e-6); // tan(45deg)=1
    assert_float_eq!(FloatOps::acos(0.5_f32), f32c::FRAC_PI_3, 1e-6); // acos(1/2)=60deg
    assert_float_eq!(FloatOps::acos(0.0_f32), f32c::FRAC_PI_2, 1e-6); // acos(0)=90deg
    assert_float_eq!(FloatOps::cos(f32c::PI), -1.0_f32, 1e-6); // cos(180deg)=-1
    assert_float_eq!(FloatOps::sin(f32c::FRAC_PI_2), 1.0_f32, 1e-6); // sin(90deg)=1
    assert_float_eq!(FloatOps::sqrt(2.0_f32), f32c::SQRT_2, 1e-6); // sqrt(2)
}

// endregion: FloatOps (f32)

// region: FloatOps (f64)

#[test]
fn floatops_f64_exact_values() {
    assert_eq!(FloatOps::cos(0.0_f64), 1.0); // cos(0) = 1
    assert_eq!(FloatOps::sin(0.0_f64), 0.0); // sin(0) = 0
    assert_eq!(FloatOps::acos(1.0_f64), 0.0); // acos(1) = 0
    assert_eq!(FloatOps::sqrt(16.0_f64), 4.0); // sqrt(16) = 4
    assert_eq!(FloatOps::sqrt(0.25_f64), 0.5); // sqrt(1/4) = 1/2
}

#[test]
fn floatops_f64_transcendental() {
    assert_float_eq!(FloatOps::sqrt(2.0_f64), f64c::SQRT_2, 1e-12); // sqrt(2)
    assert_float_eq!(FloatOps::cos(f64c::FRAC_PI_3), 0.5_f64, 1e-12); // cos(60deg)=1/2
    assert_float_eq!(FloatOps::acos(0.5_f64), f64c::FRAC_PI_3, 1e-12); // acos(1/2)=60deg
}

// endregion: FloatOps (f64)

// region: FloatEq scalars

#[test]
fn floateq_f32_scalar_equal_and_unequal() {
    // Matches the doctest: within 1e-4 tolerance.
    assert!(1.0_f32.float_eq(1.000001, 0.0001)); // |1e-6| < 1e-4 => true
    assert!(!1.0_f32.float_eq(1.1, 0.0001)); // |0.1| < 1e-4 => false
    assert!(2.0_f32.float_eq(2.0, EPSILON)); // identical => true
}

#[test]
fn floateq_f32_strict_boundary() {
    // float_eq is STRICT (<), so a difference exactly equal to eps is NOT equal.
    assert!(!1.0_f32.float_eq(1.5, 0.5)); // |0.5| < 0.5 is false
    assert!(0.0_f32.float_eq(0.4, 0.5)); // |0.4| < 0.5 is true
    assert!(!0.0_f32.float_eq(0.6, 0.5)); // |0.6| < 0.5 is false
}

#[test]
fn floateq_f64_scalar() {
    assert!(1.0_f64.float_eq(1.0 + 1e-9, 1e-6)); // |1e-9| < 1e-6 => true
    assert!(!1.0_f64.float_eq(2.0, 1e-6)); // |1.0| < 1e-6 => false
}

// endregion: FloatEq scalars

// region: FloatEq slices

#[test]
fn floateq_slice_equal_and_element_diff() {
    let a: &[f32] = &[1.0, 2.0, 3.0];
    let b: &[f32] = &[1.0, 2.0, 3.0];
    let c: &[f32] = &[1.0, 2.0, 3.1]; // last element differs by 0.1
    assert!(a.float_eq(b, 1e-6)); // all equal => true
    assert!(!a.float_eq(c, 0.05)); // |0.1| >= 0.05 at index 2 => false
    assert!(a.float_eq(c, 0.2)); // |0.1| < 0.2 everywhere => true
}

#[test]
fn floateq_slice_length_mismatch_and_empty() {
    let a: &[f32] = &[1.0, 2.0, 3.0];
    let short: &[f32] = &[1.0, 2.0]; // equal prefix but different length
    // Length mismatch short-circuits to false regardless of tolerance.
    assert!(!a.float_eq(short, 1000.0));
    // Two empty slices have equal (zero) length and the loop never runs => true.
    let e1: &[f32] = &[];
    let e2: &[f32] = &[];
    assert!(e1.float_eq(e2, 1e-6));
}

// endregion: FloatEq slices

// region: FloatEq Matrix / Quaternion

#[test]
fn floateq_matrix() {
    // Column-major flat data.
    let m1 = <Mat2>::from_slice(&[1.0, 2.0, 3.0, 4.0]);
    let m2 = <Mat2>::from_slice(&[1.0 + 1e-7, 2.0, 3.0, 4.0]); // tiny perturbation
    let m3 = <Mat2>::from_slice(&[1.0, 2.0, 3.0, 5.0]); // last entry off by 1
    // 2-arg macro uses default epsilon 2^-16 ~= 1.526e-5; 1e-7 < that => equal.
    assert_float_eq!(m1, m2);
    // Off by 1.0 in one entry => not equal.
    assert!(!m1.float_eq(m3, EPSILON));
}

#[test]
fn floateq_quaternion() {
    let q1 = <Quaternion>::from_slice(&[1.0, 2.0, 3.0, 4.0]);
    let q2 = <Quaternion>::from_slice(&[1.0, 2.0, 3.0, 4.0 + 1e-7]);
    let q3 = <Quaternion>::from_slice(&[1.0, 2.0, 3.0, 4.5]);
    assert!(q1.float_eq(q2, 1e-6)); // |1e-7| < 1e-6 in every lane => true
    assert!(!q1.float_eq(q3, 1e-6)); // |0.5| in w lane => false
}

// endregion: FloatEq Matrix / Quaternion

// region: assert_float_eq macro forms

#[test]
fn assert_float_eq_two_arg_default_eps() {
    // 2-arg form defaults to epsilon() = 2^-16 ~= 1.526e-5.
    assert_float_eq!(1.0_f32, 1.0_f32 + 1e-7); // |1e-7| < 1.526e-5 => passes
    assert_float_eq!(0.5_f64, 0.5_f64); // identical => passes
}

#[test]
fn assert_float_eq_three_arg_explicit_eps() {
    // 3-arg form with explicit tolerance.
    assert_float_eq!(1.0_f64, 1.0001_f64, 1e-3); // |1e-4| < 1e-3 => passes
    assert_float_eq!(-3.25_f32, -3.25_f32, 1e-6); // identical => passes
}

#[test]
#[should_panic(expected = "left.float_eq(right, epsilon)")]
fn assert_float_eq_three_arg_panics_when_far_apart() {
    // |1.0 - 2.0| = 1.0 is not < 1e-6 => must panic.
    assert_float_eq!(1.0_f32, 2.0_f32, 1e-6);
}

#[test]
#[should_panic(expected = "left.float_eq(right, epsilon)")]
fn assert_float_eq_two_arg_panics_when_beyond_default_eps() {
    // |1.0 - 1.1| = 0.1 is not < 1.526e-5 => must panic under default epsilon.
    assert_float_eq!(1.0_f32, 1.1_f32);
}

// endregion: assert_float_eq macro forms

// region: exact integer operations

#[test]
fn dot_and_cross_products_exact() {
    // Vec3 dot: (1,2,3).(4,5,6) = 4 + 10 + 18 = 32
    let v1 = Vec3::<i32>::from_slice(&[1, 2, 3]);
    let v2 = Vec3::<i32>::from_slice(&[4, 5, 6]);
    assert_eq!(v1.dot(v2), 32);
    // Cross product per src formula:
    //   x = a.y*b.z - b.y*a.z = 2*6 - 5*3 = 12 - 15 = -3
    //   y = a.z*b.x - b.z*a.x = 3*4 - 6*1 = 12 - 6  =  6
    //   z = a.x*b.y - b.x*a.y = 1*5 - 4*2 =  5 - 8  = -3
    assert_eq!(*v1.cross(v2).as_ref(), [-3, 6, -3]);
    // Quaternion dot (x,y,z,w): 29*43 + 31*47 + 37*53 + 41*59
    //   = 1247 + 1457 + 1961 + 2419 = 7084
    let q1 = Quaternion::<i32>::from_slice(&[29, 31, 37, 41]);
    let q2 = Quaternion::<i32>::from_slice(&[43, 47, 53, 59]);
    assert_eq!(q1.dot(q2), 7084);
}

#[test]
fn matrix_multiply_and_add_exact() {
    // Column-major. A: col0=(1,2), col1=(3,4) => rows [1,3] and [2,4].
    // B: col0=(5,6), col1=(7,8) => rows [5,7] and [6,8].
    let a = Mat2::<i32>::from_slice(&[1, 2, 3, 4]);
    let b = Mat2::<i32>::from_slice(&[5, 6, 7, 8]);
    // C = A*B:
    //   C(0,0)=1*5+3*6=23  C(1,0)=2*5+4*6=34
    //   C(0,1)=1*7+3*8=31  C(1,1)=2*7+4*8=46
    // Column-major flat = [C00, C10, C01, C11] = [23, 34, 31, 46]
    let c = a * b;
    assert_eq!(*c.as_ref(), [23, 34, 31, 46]);
    // A+B is element-wise: [1+5, 2+6, 3+7, 4+8] = [6, 8, 10, 12]
    let s = a + b;
    assert_eq!(*s.as_ref(), [6, 8, 10, 12]);

    // Non-square multiply: (3x2) * (2x1) = (3x1).
    // m1 col-major [1,2,3,4,5,6]: rows [1,4],[2,5],[3,6]; m2 col0=(7,8).
    //   r0 = 1*7+4*8 = 39 ; r1 = 2*7+5*8 = 54 ; r2 = 3*7+6*8 = 69
    let m1 = Matrix::<i32, 3, 2>::from_slice(&[1, 2, 3, 4, 5, 6]);
    let m2 = Matrix::<i32, 2, 1>::from_slice(&[7, 8]);
    let prod = m1 * m2;
    assert_eq!(*prod.as_ref(), [39, 54, 69]);
}

#[test]
fn determinants_exact() {
    // Mat2 [1,2,3,4] col-major: m00=1,m10=2,m01=3,m11=4 => 1*4 - 2*3 = -2
    assert_eq!(Mat2::<i32>::from_slice(&[1, 2, 3, 4]).det(), -2);
    // Mat3 (from src doctest) = 1
    assert_eq!(Mat3::<i32>::from_slice(&[1, 0, 5, 2, 1, 6, 3, 4, 0]).det(), 1);
    // Mat4 (from src doctest) = -16
    assert_eq!(
        Mat4::<i32>::from_slice(&[1, 1, 1, -1, 1, 1, -1, 1, 1, -1, 1, 1, -1, 1, 1, 1]).det(),
        -16
    );
    // Singular 2x2 [1,2,2,4]: 1*4 - 2*2 = 0
    assert_eq!(Mat2::<i32>::from_slice(&[1, 2, 2, 4]).det(), 0);
}

// endregion: exact integer operations

// region: float round-trips (FloatOps + FloatEq)

#[test]
fn invert_mat2_roundtrip_and_singular() {
    // Invert then multiply back == identity.
    let m = <Mat2>::from_slice(&[1.0, 2.0, 3.0, 4.0]);
    let mut inv = m;
    assert!(inv.invert()); // det = -2 != 0
    // Known inverse (src doctest): [-2, 1, 1.5, -0.5].
    assert_float_eq!(inv, <Mat2>::from_slice(&[-2.0, 1.0, 1.5, -0.5]), 1e-6);
    // m * inv should be the identity [1,0,0,1].
    let round = m * inv;
    assert_float_eq!(round, <Mat2>::identity(), 1e-6);

    // Singular matrix: det = 1*4 - 2*2 = 0 => invert returns false and is unchanged.
    let mut singular = <Mat2>::from_slice(&[1.0, 2.0, 2.0, 4.0]);
    assert!(!singular.invert());
    assert_eq!(*singular.as_ref(), [1.0, 2.0, 2.0, 4.0]);
}

#[test]
fn normalize_vectors_and_zero_vector() {
    // len = sqrt(3^2 + 4^2 + 12^2) = sqrt(169) = 13 (exact).
    let v = <Vec3>::from_slice(&[3.0, 4.0, 12.0]);
    assert_eq!(v.len(), 13.0);
    let n = v.normalized().unwrap();
    assert_float_eq!(n.as_ref(), &[3.0 / 13.0, 4.0 / 13.0, 12.0 / 13.0], 1e-6);

    // 3-4-5 right triangle: [3,4] normalizes to [0.6, 0.8], len 5.
    let mut v2 = <Vec2>::from_slice(&[3.0, 4.0]);
    assert_eq!(v2.len(), 5.0);
    assert!(v2.normalize());
    assert_float_eq!(v2.as_ref(), &[0.6_f32, 0.8_f32], 1e-6);

    // Zero vector cannot be normalized: len == 0 => returns false, unchanged.
    let mut zero = <Vec3>::from_slice(&[0.0, 0.0, 0.0]);
    assert!(!zero.normalize());
    assert_eq!(*zero.as_ref(), [0.0, 0.0, 0.0]);
    assert!(zero.normalized().is_none());
}

#[test]
fn quaternion_slerp_half() {
    // q1 = rotation of pi/3 about x: [sin(pi/6), 0, 0, cos(pi/6)].
    // q2 = [-cos(pi/6), 0, 0, -sin(pi/6)].
    // dot = sin*(-cos) + cos*(-sin) = -2 sin(pi/6)cos(pi/6) = -sin(pi/3) < 0,
    // so the shortest path is taken (mag_rhs = -1, cos = sin(pi/3) = sqrt(3)/2).
    // theta = acos(sqrt(3)/2) = pi/6; slerp(0.5) yields the pi/2 rotation about x:
    //   [sin(pi/4), 0, 0, cos(pi/4)].
    let q1 = <Quaternion>::from_slice(&[
        f32c::FRAC_PI_6.sin(),
        0.0,
        0.0,
        f32c::FRAC_PI_6.cos(),
    ]);
    let q2 = <Quaternion>::from_slice(&[
        -f32c::FRAC_PI_6.cos(),
        0.0,
        0.0,
        -f32c::FRAC_PI_6.sin(),
    ]);
    let out = q1.slerp(q2, 0.5);
    assert_float_eq!(
        out.as_ref(),
        &[f32c::FRAC_PI_4.sin(), 0.0, 0.0, f32c::FRAC_PI_4.cos()],
        1e-5
    );
}

#[test]
fn quaternion_lerp_boundaries_and_half() {
    // q1 = [sin(pi/4),0,0,cos(pi/4)], q2 = [sin(pi/4),0,0,-cos(pi/4)] (both unit).
    let q1 = <Quaternion>::from_slice(&[f32c::FRAC_PI_4.sin(), 0.0, 0.0, f32c::FRAC_PI_4.cos()]);
    let q2 = <Quaternion>::from_slice(&[f32c::FRAC_PI_4.sin(), 0.0, 0.0, -f32c::FRAC_PI_4.cos()]);
    // t=0 => normalize(q1) = q1 (already unit).
    assert_float_eq!(q1.lerp(q2, 0.0).as_ref(), q1.as_ref(), 1e-6);
    // t=1 => dot(q1,q2)=sin^2 - cos^2 = 0 => mag_rhs=+1 => normalize(q2) = q2.
    assert_float_eq!(q1.lerp(q2, 1.0).as_ref(), q2.as_ref(), 1e-6);
    // t=0.5: x-lane averages to sin(pi/4); w-lane cancels to 0; normalize => [1,0,0,0].
    assert_float_eq!(q1.lerp(q2, 0.5).as_ref(), &[1.0_f32, 0.0, 0.0, 0.0], 1e-6);
}

// endregion: float round-trips