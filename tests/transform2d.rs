//! Integration tests for the `munum::transform2d` module.
//!
//! These tests exercise the 2D transform builders (translation, scaling,
//! rotation, and the TRS `transformation`) through the crate's PUBLIC API only.
//!
//! Conventions used throughout:
//! * Matrices are COLUMN-MAJOR. `as_ref()` yields a flat column-major slice,
//!   i.e. `[col0[0], col0[1], col0[2], col1[0], ...]`.
//! * A 2D point/vector is represented as a homogeneous `Vec3` `(x, y, w)`.
//!   `w = 1` for a position (affected by translation), `w = 0` for a pure
//!   direction (unaffected by translation).
//! * `Mat3 * Vec3` performs the standard matrix-vector product and yields the
//!   transformed homogeneous coordinate.
//!
//! Exact integer arithmetic (`assert_eq!`) is used wherever the operation is
//! closed over the integers (matrix structure, integer point transforms,
//! composition of integer translations/scalings, determinants). Only the
//! transcendental (trig) results use `assert_float_eq!` with an explicit small
//! epsilon.

use core::f32::consts::{FRAC_PI_2, FRAC_PI_3, FRAC_PI_6, PI, TAU};

use munum::{assert_float_eq, transform2d, vec2, vec3, Mat3, Vec3};

// ---------------------------------------------------------------------------
// Translation
// ---------------------------------------------------------------------------

#[test]
fn translation_matrix_is_column_major_identity_with_offset_column() {
    // translation(2,3): identity with column 2 = (2, 3, 1).
    // Column-major flat layout:
    //   col0 = (1,0,0), col1 = (0,1,0), col2 = (2,3,1)
    let m = transform2d::translation(vec2(2_i32, 3));
    assert_eq!(*m.as_ref(), [1, 0, 0, 0, 1, 0, 2, 3, 1]);
}

#[test]
fn translation_moves_a_point() {
    // M * (5,7,1) with M = translation(2,3):
    //   x' = 1*5 + 0*7 + 2*1 = 7
    //   y' = 0*5 + 1*7 + 3*1 = 10
    //   w' = 0*5 + 0*7 + 1*1 = 1
    let m = transform2d::translation(vec2(2_i32, 3));
    let p = m * vec3(5_i32, 7, 1);
    assert_eq!(*p.as_ref(), [7, 10, 1]);
}

#[test]
fn translation_leaves_direction_vectors_unchanged() {
    // A direction has w = 0, so the translation column contributes nothing:
    //   x' = 5 + 2*0 = 5, y' = 7 + 3*0 = 7, w' = 0
    let m = transform2d::translation(vec2(2_i32, 3));
    let d = m * vec3(5_i32, 7, 0);
    assert_eq!(*d.as_ref(), [5, 7, 0]);
}

#[test]
fn translation_by_zero_is_identity() {
    // Edge case: zero translation must equal the identity matrix.
    let m = transform2d::translation(vec2(0_i32, 0));
    assert_eq!(*m.as_ref(), [1, 0, 0, 0, 1, 0, 0, 0, 1]);
}

#[test]
fn translations_compose_additively() {
    // T(2,3) * T(4,5) = T(6,8). Only the translation column adds:
    //   col2.x = 1*4 + 0*5 + 2*1 = 6
    //   col2.y = 0*4 + 1*5 + 3*1 = 8
    let a = transform2d::translation(vec2(2_i32, 3));
    let b = transform2d::translation(vec2(4_i32, 5));
    let c = a * b;
    assert_eq!(*c.as_ref(), [1, 0, 0, 0, 1, 0, 6, 8, 1]);
}

#[test]
fn translation_times_its_negation_is_identity() {
    // Round-trip: T(2,3) * T(-2,-3) = T(0,0) = identity (exact in integers).
    let a = transform2d::translation(vec2(2_i32, 3));
    let inv = transform2d::translation(vec2(-2_i32, -3));
    let id = a * inv;
    assert_eq!(*id.as_ref(), [1, 0, 0, 0, 1, 0, 0, 0, 1]);
}

#[test]
fn translation_matrix_inverse_is_negated_translation() {
    // Mat3::invert of translation(2,3) (det = 1, upper-triangular) is T(-2,-3).
    let mut m = transform2d::translation(vec2(2_f32, 3.));
    assert!(m.invert());
    assert_float_eq!(m.as_ref(), &[1., 0., 0., 0., 1., 0., -2., -3., 1.], 1e-6);
}

// ---------------------------------------------------------------------------
// Scaling
// ---------------------------------------------------------------------------

#[test]
fn scaling_matrix_is_diagonal() {
    // scaling(2,3): diag(2,3,1). Column-major flat:
    //   col0 = (2,0,0), col1 = (0,3,0), col2 = (0,0,1)
    let m = transform2d::scaling(vec2(2_i32, 3));
    assert_eq!(*m.as_ref(), [2, 0, 0, 0, 3, 0, 0, 0, 1]);
}

#[test]
fn scaling_scales_a_point() {
    // M * (5,7,1) with M = scaling(2,3):
    //   x' = 2*5 = 10, y' = 3*7 = 21, w' = 1
    let m = transform2d::scaling(vec2(2_i32, 3));
    let p = m * vec3(5_i32, 7, 1);
    assert_eq!(*p.as_ref(), [10, 21, 1]);
}

#[test]
fn scaling_with_negative_factor_reflects_and_negates_determinant() {
    // scaling(-1,1) reflects across the y-axis: (5,7) -> (-5,7).
    // det(diag(-1,1,1)) = -1*1*1 = -1.
    let m = transform2d::scaling(vec2(-1_i32, 1));
    let p = m * vec3(5_i32, 7, 1);
    assert_eq!(*p.as_ref(), [-5, 7, 1]);
    assert_eq!(m.det(), -1);
}

#[test]
fn scaling_with_zero_factor_is_singular() {
    // Degenerate: scaling(0,3) collapses the x-axis.
    //   det(diag(0,3,1)) = 0*3*1 = 0  => singular.
    //   Point (5,7) still maps to (0,21).
    let m = transform2d::scaling(vec2(0_i32, 3));
    assert_eq!(m.det(), 0);
    let p = m * vec3(5_i32, 7, 1);
    assert_eq!(*p.as_ref(), [0, 21, 1]);

    // The float version must report non-invertibility and stay unchanged.
    let mut mf = transform2d::scaling(vec2(0_f32, 3.));
    assert!(!mf.invert());
    assert_eq!(*mf.as_ref(), [0., 0., 0., 0., 3., 0., 0., 0., 1.]);
}

#[test]
fn scalings_compose_by_multiplying_factors() {
    // S(2,3) * S(4,5) = S(8,15): diagonal entries multiply.
    let a = transform2d::scaling(vec2(2_i32, 3));
    let b = transform2d::scaling(vec2(4_i32, 5));
    let c = a * b;
    assert_eq!(*c.as_ref(), [8, 0, 0, 0, 15, 0, 0, 0, 1]);
}

#[test]
fn scaling_matrix_inverse_is_reciprocal_scaling() {
    // invert(scaling(2,4)) = scaling(1/2, 1/4) (det = 8 != 0).
    let mut m = transform2d::scaling(vec2(2_f32, 4.));
    assert!(m.invert());
    assert_float_eq!(m.as_ref(), &[0.5, 0., 0., 0., 0.25, 0., 0., 0., 1.], 1e-6);
}

// ---------------------------------------------------------------------------
// Rotation (counter-clockwise, about the origin)
// ---------------------------------------------------------------------------

#[test]
fn rotation_quarter_turn_matrix_layout() {
    // R(pi/2): cos = 0, sin = 1. The CCW rotation matrix is
    //   [ cos -sin ]   stored column-major as
    //   [ sin  cos ]   col0 = (cos, sin, 0), col1 = (-sin, cos, 0), col2 = (0,0,1)
    // => flat = (0, 1, 0, -1, 0, 0, 0, 0, 1)
    let m = transform2d::rotation(FRAC_PI_2);
    assert_float_eq!(m.as_ref(), &[0., 1., 0., -1., 0., 0., 0., 0., 1.], 1e-6);
}

#[test]
fn rotation_pi_over_six_matches_known_values() {
    // R(pi/6): cos = sqrt(3)/2, sin = 1/2.
    //   col0 = (sqrt3/2, 1/2, 0), col1 = (-1/2, sqrt3/2, 0), col2 = (0,0,1)
    let s3_2 = 3_f32.sqrt() / 2.;
    let m = transform2d::rotation(FRAC_PI_6);
    assert_float_eq!(
        m.as_ref(),
        &[s3_2, 0.5, 0., -0.5, s3_2, 0., 0., 0., 1.],
        1e-6
    );
}

#[test]
fn rotation_quarter_turn_rotates_basis_vectors_ccw() {
    // 90 deg CCW: (1,0) -> (0,1) and (0,1) -> (-1,0).
    //   For e_x: x' = cos*1 - sin*0 = 0, y' = sin*1 + cos*0 = 1
    //   For e_y: x' = cos*0 - sin*1 = -1, y' = sin*0 + cos*1 = 0
    let m = transform2d::rotation(FRAC_PI_2);
    let ex = m * vec3(1_f32, 0., 1.);
    let ey = m * vec3(0_f32, 1., 1.);
    assert_float_eq!(ex.as_ref(), &[0., 1., 1.], 1e-6);
    assert_float_eq!(ey.as_ref(), &[-1., 0., 1.], 1e-6);
}

#[test]
fn rotation_half_turn_negates_xy() {
    // R(pi): cos = -1, sin = 0. (3,4) -> (-3,-4); w stays 1.
    let m = transform2d::rotation(PI);
    let p = m * vec3(3_f32, 4., 1.);
    assert_float_eq!(p.as_ref(), &[-3., -4., 1.], 1e-6);
}

#[test]
fn rotation_negative_quarter_turn_rotates_cw() {
    // R(-pi/2): cos = 0, sin = -1. (1,0) -> (0,-1) (clockwise).
    //   x' = cos*1 - sin*0 = 0, y' = sin*1 + cos*0 = -1
    let m = transform2d::rotation(-FRAC_PI_2);
    let p = m * vec3(1_f32, 0., 1.);
    assert_float_eq!(p.as_ref(), &[0., -1., 1.], 1e-6);
}

#[test]
fn rotation_full_turn_is_identity() {
    // R(2*pi) leaves any point unchanged (within float tolerance).
    let m = transform2d::rotation(TAU);
    let p = m * vec3(3_f32, -4., 1.);
    assert_float_eq!(p.as_ref(), &[3., -4., 1.], 1e-5);
}

#[test]
fn rotation_preserves_length() {
    // Rotation is an isometry: |R * d| == |d|. For d = (3,4,0), sqr_len = 25.
    let m = transform2d::rotation(0.9_f32);
    let d = m * vec3(3_f32, 4., 0.);
    assert_float_eq!(d.sqr_len(), 25., 1e-4);
}

#[test]
fn rotations_compose_additively() {
    // R(pi/6) * R(pi/3) = R(pi/2) = (0,1,0,-1,0,0,0,0,1).
    let a = transform2d::rotation(FRAC_PI_6);
    let b = transform2d::rotation(FRAC_PI_3);
    let c = a * b;
    assert_float_eq!(c.as_ref(), &[0., 1., 0., -1., 0., 0., 0., 0., 1.], 1e-6);
}

#[test]
fn rotation_then_inverse_returns_original_point() {
    // Round-trip: rotating by theta then by -theta is the identity.
    let theta = 0.7_f32;
    let fwd = transform2d::rotation(theta);
    let back = transform2d::rotation(-theta);
    let p = vec3(3_f32, 4., 1.);
    let round = back * (fwd * p);
    assert_float_eq!(round.as_ref(), p.as_ref(), 1e-6);
}

// ---------------------------------------------------------------------------
// Transformation (TRS = translation * rotation * scaling)
// ---------------------------------------------------------------------------

#[test]
fn transformation_identity_parameters_give_identity() {
    // translation (0,0), angle 0 (cos=1, sin=0 exactly), scale (1,1) => identity.
    let m = transform2d::transformation(vec2(0_f32, 0.), 0., vec2(1_f32, 1.));
    assert_float_eq!(m.as_ref(), &[1., 0., 0., 0., 1., 0., 0., 0., 1.], 1e-6);
}

#[test]
fn transformation_matrix_layout() {
    // transformation(t=(11,13), theta=pi/6, s=(5,7)).
    // cos = sqrt3/2, sin = 1/2. Post-multiplying scaling into R:
    //   col0 = (cos*sx, sin*sx, 0) = (5*sqrt3/2, 2.5, 0)
    //   col1 = (-sin*sy, cos*sy, 0) = (-3.5, 7*sqrt3/2, 0)
    //   col2 = (tx, ty, 1) = (11, 13, 1)
    let s3_2 = 3_f32.sqrt() / 2.;
    let m = transform2d::transformation(vec2(11_f32, 13.), FRAC_PI_6, vec2(5_f32, 7.));
    assert_float_eq!(
        m.as_ref(),
        &[5. * s3_2, 2.5, 0., -3.5, 7. * s3_2, 0., 11., 13., 1.],
        1e-5
    );
}

#[test]
fn transformation_applies_scale_then_rotate_then_translate() {
    // t=(10,20), theta=pi/2, s=(2,3). Apply to point (1,1):
    //   scale:     (1,1) -> (2,3)
    //   rotate 90: (2,3) -> (-3,2)
    //   translate: (-3,2) + (10,20) -> (7,22)
    let m = transform2d::transformation(vec2(10_f32, 20.), FRAC_PI_2, vec2(2_f32, 3.));
    let p = m * vec3(1_f32, 1., 1.);
    assert_float_eq!(p.as_ref(), &[7., 22., 1.], 1e-6);
}

#[test]
fn transformation_equals_translation_times_rotation_times_scaling() {
    // The builder must equal the explicit product T * R * S.
    let t = vec2(11_f32, 13.);
    let theta = FRAC_PI_6;
    let s = vec2(5_f32, 7.);

    let expected: Mat3<f32> =
        transform2d::translation(t) * transform2d::rotation(theta) * transform2d::scaling(s);
    let actual = transform2d::transformation(t, theta, s);
    assert_float_eq!(actual.as_ref(), expected.as_ref(), 1e-6);
}

#[test]
fn transformation_round_trips_through_matrix_inverse() {
    // A TRS with non-zero scale is invertible; M^-1 * (M * p) == p.
    let t = vec2(4_f32, -2.);
    let theta = FRAC_PI_3;
    let s = vec2(2_f32, 5.);

    let m = transform2d::transformation(t, theta, s);
    let mut inv = m;
    assert!(inv.invert());

    let p: Vec3<f32> = vec3(3_f32, -1., 1.);
    let round = inv * (m * p);
    assert_float_eq!(round.as_ref(), p.as_ref(), 1e-5);
}