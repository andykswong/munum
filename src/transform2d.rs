//! 2D transformation matrix functions.

use crate::{FloatOps, Mat3, Vec2};
use num::traits::NumAssign;

/// Creates a 3x3 transformation matrix that represents a translation of (x, y).
///
/// # Examples
/// ```
/// # use munum::{transform2d, vec2};
/// assert_eq!(*transform2d::translation(vec2(2_i32, 3)).as_ref(), [1, 0, 0, 0, 1, 0, 2, 3, 1]);
/// ```
pub fn translation<T: Copy + NumAssign>(v: Vec2<T>) -> Mat3<T> {
    let mut result = Mat3::identity();
    result[(0, 2)] = v[0];
    result[(1, 2)] = v[1];
    result
}

/// Creates a 3x3 transformation matrix that represents a scaling of (x, y).
///
/// # Examples
/// ```
/// # use munum::{transform2d, vec2};
/// assert_eq!(*transform2d::scaling(vec2(2_i32, 3)).as_ref(), [2, 0, 0, 0, 3, 0, 0, 0, 1]);
/// ```
pub fn scaling<T: Copy + NumAssign>(v: Vec2<T>) -> Mat3<T> {
    let mut result = Mat3::identity();
    result[(0, 0)] = v[0];
    result[(1, 1)] = v[1];
    result
}

/// Creates a 3x3 transformation matrix that represents a rotation in couterclockwise direction.
///
/// # Examples
/// ```
/// # use munum::{transform2d, assert_float_eq};
/// assert_float_eq!(
///     transform2d::rotation(core::f32::consts::FRAC_PI_6).as_ref(),
///     &[3_f32.sqrt()/2., 0.5, 0., -0.5, 3_f32.sqrt()/2., 0., 0., 0., 1.]
/// );
/// ```
#[inline]
pub fn rotation<T: Copy + FloatOps + NumAssign>(theta: T) -> Mat3<T> {
    let mut result = Mat3::identity();
    let cos_theta = theta.cos();
    let sin_theta = theta.sin();
    result[(0, 0)] = cos_theta;
    result[(1, 0)] = sin_theta;
    result[(0, 1)] = T::zero() - sin_theta;
    result[(1, 1)] = cos_theta;
    result
}

/// Creates a 3x3 matrix that represents a transformation in TRS order (= translation * rotation * scaling).
///
/// # Examples
/// ```
/// # use munum::{transform2d, vec2, assert_float_eq};
/// assert_float_eq!(
///     transform2d::transformation(
///         vec2(11., 13.),
///         core::f32::consts::FRAC_PI_6,
///         vec2(5., 7.),
///     ).as_ref(),
///     &[5.*3_f32.sqrt()/2., 2.5, 0., -3.5, 7.*3_f32.sqrt()/2., 0., 11., 13., 1.]
/// );
/// ```
pub fn transformation<T: Copy + FloatOps + NumAssign>(
    translation: Vec2<T>,
    rotation_angle: T,
    scaling: Vec2<T>,
) -> Mat3<T> {
    // Start with rotation
    let mut result: Mat3<T> = rotation(rotation_angle);

    // Post-multiply scaling
    for c in 0..2 {
        for r in 0..2 {
            result[(r, c)] *= scaling[c];
        }
    }

    // Apply translation
    result[(0, 2)] = translation[0];
    result[(1, 2)] = translation[1];

    result
}
