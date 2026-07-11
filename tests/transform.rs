//! Integration tests for the public `munum::transform` module (3D affine
//! transforms, glTF projection matrices, and camera matrices).
//!
//! Only the crate's public API is exercised. Matrices are COLUMN-MAJOR, so
//! `as_ref()` yields `[col0.., col1.., ...]` and every expected array below is
//! written column-major. Integer-exact results use `assert_eq!`; irrational
//! results (normalized camera bases, projection ratios) use `assert_float_eq!`
//! with an explicit epsilon.

use core::f32::consts::PI;
use munum::{assert_float_eq, transform, vec3, vec4, Mat4, Quaternion};

const INFINITY: f32 = f32::INFINITY;

const EPS: f32 = 1e-5;

// region: Affine transformations

#[test]
fn translation_places_vector_in_last_column() {
    // Column-major: the translation lives in column 3 (indices 12,13,14).
    assert_eq!(
        *transform::translation(vec3(2_i32, 3, 5)).as_ref(),
        [1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 2, 3, 5, 1]
    );
}

#[test]
fn scaling_places_factors_on_diagonal() {
    assert_eq!(
        *transform::scaling(vec3(2_i32, 3, 5)).as_ref(),
        [2, 0, 0, 0, 0, 3, 0, 0, 0, 0, 5, 0, 0, 0, 0, 1]
    );
}

#[test]
fn rotation_by_identity_quat_is_identity_matrix() {
    // quat(0,0,0,1) is the identity rotation -> identity Mat4.
    let m = transform::rotation(Quaternion::<f32>::identity());
    assert_float_eq!(
        m.as_ref(),
        &[1., 0., 0., 0., 0., 1., 0., 0., 0., 0., 1., 0., 0., 0., 0., 1.],
        EPS
    );
}

#[test]
fn rotation_by_120deg_about_diagonal_axis() {
    // The doctest value: quat (1,1,1)/sqrt(3), w=0 is a 180deg rotation about the
    // (1,1,1) axis; its matrix cyclically permutes/flips the axes.
    let s = 1. / 3_f32.sqrt();
    assert_float_eq!(
        transform::rotation(Quaternion::<f32>::from_slice(&[s, s, s, 0.])).as_ref(),
        &[-1. / 3., 2. / 3., 2. / 3., 0., 2. / 3., -1. / 3., 2. / 3., 0., 2. / 3., 2. / 3., -1. / 3., 0., 0., 0., 0., 1.],
        EPS
    );
}

#[test]
fn transformation_composes_trs() {
    // Known TRS from the doctest: T=(1,2,3), R=120deg about (1,1,1), S=(3,6,9).
    let s = 0.5 / 3_f32.sqrt();
    let m = transform::transformation(
        vec3(1., 2., 3.),
        Quaternion::<f32>::from_slice(&[s, s, s, 3_f32.sqrt() / 2.]),
        vec3(3., 6., 9.),
    );
    assert_float_eq!(
        m.as_ref(),
        &[2., 2., -1., 0., -2., 4., 4., 0., 6., -3., 6., 0., 1., 2., 3., 1.],
        EPS
    );
}

#[test]
fn decompose_recovers_translation_scaling_rotation() {
    let m = <Mat4>::from_slice(&[
        2., 2., -1., 0., -2., 4., 4., 0., 6., -3., 6., 0., 11., 12., 13., 1.,
    ]);
    assert_float_eq!(transform::translation_of(m).as_ref(), &[11., 12., 13.], EPS);
    assert_float_eq!(transform::scaling_of(m).as_ref(), &[3., 6., 9.], EPS);
    let s = 0.5 / 3_f32.sqrt();
    assert_float_eq!(
        transform::rotation_of(m).as_ref(),
        &[s, s, s, 3_f32.sqrt() / 2.],
        EPS
    );
}

#[test]
fn transformation_then_decompose_roundtrips() {
    let t = vec3(4., -2., 7.);
    let s = 1. / 3_f32.sqrt();
    let r = Quaternion::<f32>::from_slice(&[s, s, s, 0.]);
    let scale = vec3(2., 2., 2.); // uniform so rotation_of stays well-conditioned
    let m = transform::transformation(t, r, scale);
    assert_float_eq!(transform::translation_of(m).as_ref(), &[4., -2., 7.], EPS);
    assert_float_eq!(transform::scaling_of(m).as_ref(), &[2., 2., 2.], EPS);
}

#[test]
fn invert_trs_matches_hand_computed_inverse() {
    let mut m = <Mat4>::from_slice(&[
        2., 2., -1., 0., -2., 4., 4., 0., 6., -3., 6., 0., 1., 2., 3., 1.,
    ]);
    assert!(transform::invert_trs(&mut m));
    assert_float_eq!(
        m.as_ref(),
        &[
            2. / 9., -1. / 18., 2. / 27., 0., 2. / 9., 1. / 9., -1. / 27., 0., -1. / 9., 1. / 9.,
            2. / 27., 0., -1. / 3., -1. / 2., -2. / 9., 1.
        ],
        EPS
    );
}

#[test]
fn invert_trs_composed_with_original_is_identity() {
    let orig = <Mat4>::from_slice(&[
        2., 2., -1., 0., -2., 4., 4., 0., 6., -3., 6., 0., 1., 2., 3., 1.,
    ]);
    let mut inv = orig;
    assert!(transform::invert_trs(&mut inv));
    let product = orig * inv;
    assert_float_eq!(
        product.as_ref(),
        &[1., 0., 0., 0., 0., 1., 0., 0., 0., 0., 1., 0., 0., 0., 0., 1.],
        EPS
    );
}

#[test]
fn invert_trs_rejects_zero_scale() {
    // A column of all zeros means a zero scale factor, which is non-invertible.
    let mut m = <Mat4>::from_slice(&[
        0., 0., 0., 0., 0., 1., 0., 0., 0., 0., 1., 0., 0., 0., 0., 1.,
    ]);
    assert!(!transform::invert_trs(&mut m));
}

#[test]
fn invert_trs_rejects_non_affine_bottom_row() {
    // A matrix whose bottom row is not [0,0,0,1] is not a TRS matrix.
    let mut m = <Mat4>::from_slice(&[
        1., 0., 0., 5., 0., 1., 0., 0., 0., 0., 1., 0., 0., 0., 0., 1.,
    ]);
    assert!(!transform::invert_trs(&mut m));
}

// endregion: Affine transformations

// region: Projection matrices

#[test]
fn ortho_matches_gltf_formula() {
    assert_float_eq!(
        transform::ortho(-1., 3., -7., 4., -2., 5.).as_ref(),
        &[1. / 2., 0., 0., 0., 0., 2. / 11., 0., 0., 0., 0., -2. / 7., 0., -1. / 2., 3. / 11., -3. / 7., 1.],
        EPS
    );
}

#[test]
fn perspective_infinite_and_finite_zfar() {
    assert_float_eq!(
        transform::perspective(2., PI / 2., 1., INFINITY).as_ref(),
        &[0.5, 0., 0., 0., 0., 1., 0., 0., 0., 0., -1., -1., 0., 0., -2., 0.],
        EPS
    );
    assert_float_eq!(
        transform::perspective(2., PI / 2., 1., 9.).as_ref(),
        &[0.5, 0., 0., 0., 0., 1., 0., 0., 0., 0., -1.25, -1., 0., 0., -2.25, 0.],
        EPS
    );
}

#[test]
fn perspective_viewport_infinite_and_finite_zfar() {
    assert_float_eq!(
        transform::perspective_viewport(-1.0, 3.0, -0.5, 1.5, 1., INFINITY).as_ref(),
        &[0.5, 0., 0., 0., 0., 1., 0., 0., 0.5, 0.5, -1., -1., 0., 0., -2., 0.],
        EPS
    );
    assert_float_eq!(
        transform::perspective_viewport(-1.0, 3.0, -0.5, 1.5, 1., 9.).as_ref(),
        &[0.5, 0., 0., 0., 0., 1., 0., 0., 0.5, 0.5, -1.25, -1., 0., 0., -2.25, 0.],
        EPS
    );
}

// endregion: Projection matrices

// region: Camera matrices

#[test]
fn target_to_maps_points_into_world() {
    // From the doctest: camera at (0,2,0) looking down at (0,0.6,0), up = -Z.
    let m = transform::target_to(vec3(0_f32, 2., 0.), vec3(0., 0.6, 0.), vec3(0., 0., -1.));
    assert_float_eq!((m * vec4(0_f32, 2., 0., 1.)).as_ref(), &[0., 2., -2., 1.], EPS);
    assert_float_eq!((m * vec4(0_f32, 2., -1., 1.)).as_ref(), &[0., 1., -2., 1.], EPS);
    assert_float_eq!((m * vec4(1_f32, 2., 0., 1.)).as_ref(), &[1., 2., -2., 1.], EPS);
    assert_float_eq!((m * vec4(0_f32, 1., 0., 1.)).as_ref(), &[0., 2., -1., 1.], EPS);
}

#[test]
fn look_at_view_matrix_maps_eye_to_origin() {
    let m = transform::look_at(vec3(0_f32, 2., 0.), vec3(0., 0.6, 0.), vec3(0., 0., -1.));
    // The eye maps to the view-space origin.
    assert_float_eq!((m * vec4(0_f32, 2., 0., 1.)).as_ref(), &[0., 0., 0., 1.], EPS);
    assert_float_eq!((m * vec4(0_f32, 2., -1., 1.)).as_ref(), &[0., 1., 0., 1.], EPS);
    assert_float_eq!((m * vec4(1_f32, 2., 0., 1.)).as_ref(), &[1., 0., 0., 1.], EPS);
    assert_float_eq!((m * vec4(0_f32, 1., 0., 1.)).as_ref(), &[0., 0., -1., 1.], EPS);
}

#[test]
fn look_at_direction_cardinal_angles() {
    use core::f32::consts::FRAC_PI_4;
    // pitch=0, yaw=0 looks toward -Z.
    assert_float_eq!(transform::look_at_direction(0_f32, 0.).as_ref(), &[0., 0., -1.], EPS);
    // yaw=PI turns to +Z.
    assert_float_eq!(transform::look_at_direction(0_f32, PI).as_ref(), &[0., 0., 1.], EPS);
    // pitch=PI/2 looks straight up (+Y).
    assert_float_eq!(transform::look_at_direction(PI / 2., 0.).as_ref(), &[0., 1., 0.], EPS);
    // yaw=-PI/2 turns to +X.
    assert_float_eq!(transform::look_at_direction(0_f32, -PI / 2.).as_ref(), &[1., 0., 0.], EPS);
    // diagonal
    assert_float_eq!(
        transform::look_at_direction(FRAC_PI_4, -PI / 2.).as_ref(),
        &[FRAC_PI_4.cos(), FRAC_PI_4.sin(), 0.],
        EPS
    );
}

// endregion: Camera matrices
