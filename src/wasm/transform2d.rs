use super::ptr::Load;
use crate::{transform2d, Mat3, Vec2};

#[export_name = "translation2d"]
pub extern "C" fn translation_2d(
    out: *mut Mat3<f64>,
    v: *const Vec2<f64>,
) -> *const Mat3<f64> {
    if let Some(o) = unsafe { out.as_mut() } {
        *o = transform2d::translation(v.load())
    }
    out
}

#[export_name = "scaling2d"]
pub extern "C" fn scaling_2d(
    out: *mut Mat3<f64>,
    v: *const Vec2<f64>,
) -> *const Mat3<f64> {
    if let Some(o) = unsafe { out.as_mut() } {
        *o = transform2d::scaling(v.load())
    }
    out
}

#[export_name = "rotation2d"]
pub extern "C" fn rotation_2d(out: *mut Mat3<f64>, angle: f64) -> *const Mat3<f64> {
    if let Some(o) = unsafe { out.as_mut() } {
        *o = transform2d::rotation(angle)
    }
    out
}

#[export_name = "transformation2d"]
pub extern "C" fn transformation_2d(
    out: *mut Mat3<f64>,
    translation: *const Vec2<f64>,
    rotation: f64,
    scaling: *const Vec2<f64>,
) -> *const Mat3<f64> {
    if let Some(o) = unsafe { out.as_mut() } {
        *o = transform2d::transformation(translation.load(), rotation, scaling.load())
    }
    out
}
