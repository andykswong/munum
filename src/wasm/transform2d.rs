use super::ptr::Load;
use crate::{transform2d, Mat3, Vec2};

#[export_name = concat!("munum:wasm/transform2d#translation")]
pub extern "C" fn transform2d_translation(
    out: *mut Mat3<f64>,
    v: *const Vec2<f64>,
) -> *const Mat3<f64> {
    if let Some(o) = unsafe { out.as_mut() } {
        *o = transform2d::translation(v.load())
    }
    out
}

#[export_name = concat!("munum:wasm/transform2d#scaling")]
pub extern "C" fn transform2d_scaling(
    out: *mut Mat3<f64>,
    v: *const Vec2<f64>,
) -> *const Mat3<f64> {
    if let Some(o) = unsafe { out.as_mut() } {
        *o = transform2d::scaling(v.load())
    }
    out
}

#[export_name = concat!("munum:wasm/transform2d#rotation")]
pub extern "C" fn transform2d_rotation(out: *mut Mat3<f64>, angle: f64) -> *const Mat3<f64> {
    if let Some(o) = unsafe { out.as_mut() } {
        *o = transform2d::rotation(angle)
    }
    out
}

#[export_name = concat!("munum:wasm/transform2d#transformation")]
pub extern "C" fn transform2d_transformation(
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
