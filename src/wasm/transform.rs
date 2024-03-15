use super::ptr::Load;
use crate::{transform, Mat4, Quaternion, Vec3};

#[export_name = concat!("munum:wasm/transform#translation")]
pub extern "C" fn transform_translation(
    out: *mut Mat4<f64>,
    v: *const Vec3<f64>,
) -> *const Mat4<f64> {
    if let Some(o) = unsafe { out.as_mut() } {
        *o = transform::translation(v.load())
    }
    out
}

#[export_name = concat!("munum:wasm/transform#scaling")]
pub extern "C" fn transform_scaling(out: *mut Mat4<f64>, v: *const Vec3<f64>) -> *const Mat4<f64> {
    if let Some(o) = unsafe { out.as_mut() } {
        *o = transform::scaling(v.load())
    }
    out
}

#[export_name = concat!("munum:wasm/transform#rotation")]
pub extern "C" fn transform_rotation(
    out: *mut Mat4<f64>,
    q: *const Quaternion<f64>,
) -> *const Mat4<f64> {
    if let Some(o) = unsafe { out.as_mut() } {
        *o = transform::rotation(q.load())
    }
    out
}

#[export_name = concat!("munum:wasm/transform#translation-of")]
pub extern "C" fn transform_translation_of(
    out: *mut Vec3<f64>,
    m: *const Mat4<f64>,
) -> *const Vec3<f64> {
    if let Some(o) = unsafe { out.as_mut() } {
        *o = transform::translation_of(m.load())
    }
    out
}

#[export_name = concat!("munum:wasm/transform#rotation-of")]
pub extern "C" fn transform_rotation_of(
    out: *mut Quaternion<f64>,
    m: *const Mat4<f64>,
) -> *const Quaternion<f64> {
    if let Some(o) = unsafe { out.as_mut() } {
        *o = transform::rotation_of(m.load())
    }
    out
}

#[export_name = concat!("munum:wasm/transform#scaling-of")]
pub extern "C" fn transform_scaling_of(
    out: *mut Vec3<f64>,
    m: *const Mat4<f64>,
) -> *const Vec3<f64> {
    if let Some(o) = unsafe { out.as_mut() } {
        *o = transform::scaling_of(m.load())
    }
    out
}

#[export_name = concat!("munum:wasm/transform#transformation")]
pub extern "C" fn transform_transformation(
    out: *mut Mat4<f64>,
    translation: *const Vec3<f64>,
    rotation: *const Quaternion<f64>,
    scaling: *const Vec3<f64>,
) -> *const Mat4<f64> {
    if let Some(o) = unsafe { out.as_mut() } {
        *o = transform::transformation(translation.load(), rotation.load(), scaling.load())
    }
    out
}

#[export_name = concat!("munum:wasm/transform#invert-trs")]
pub extern "C" fn transform_invert_trs(out: *mut Mat4<f64>, m: *const Mat4<f64>) -> bool {
    if let Some(o) = unsafe { out.as_mut() } {
        *o = m.load();
        transform::invert_trs(o)
    } else {
        false
    }
}

#[export_name = concat!("munum:wasm/transform#ortho")]
pub extern "C" fn transform_ortho(
    out: *mut Mat4<f64>,
    left: f64,
    right: f64,
    bottom: f64,
    top: f64,
    znear: f64,
    zfar: f64,
) -> *const Mat4<f64> {
    if let Some(o) = unsafe { out.as_mut() } {
        *o = transform::ortho(left, right, bottom, top, znear, zfar)
    }
    out
}

#[export_name = concat!("munum:wasm/transform#perspective")]
pub extern "C" fn transform_perspective(
    out: *mut Mat4<f64>,
    aspect: f64,
    yfov: f64,
    znear: f64,
    zfar: f64,
) -> *const Mat4<f64> {
    if let Some(o) = unsafe { out.as_mut() } {
        *o = transform::perspective(aspect, yfov, znear, zfar)
    }
    out
}

#[export_name = concat!("munum:wasm/transform#perspective-viewport")]
pub extern "C" fn transform_perspective_viewport(
    out: *mut Mat4<f64>,
    left: f64,
    right: f64,
    bottom: f64,
    top: f64,
    znear: f64,
    zfar: f64,
) -> *const Mat4<f64> {
    if let Some(o) = unsafe { out.as_mut() } {
        *o = transform::perspective_viewport(left, right, bottom, top, znear, zfar)
    }
    out
}

#[export_name = concat!("munum:wasm/transform#target-to")]
pub extern "C" fn transform_target_to(
    out: *mut Mat4<f64>,
    eye: *const Vec3<f64>,
    center: *const Vec3<f64>,
    up: *const Vec3<f64>,
) -> *const Mat4<f64> {
    if let Some(o) = unsafe { out.as_mut() } {
        *o = transform::target_to(eye.load(), center.load(), up.load())
    }
    out
}

#[export_name = concat!("munum:wasm/transform#look-at")]
pub extern "C" fn transform_look_at(
    out: *mut Mat4<f64>,
    eye: *const Vec3<f64>,
    center: *const Vec3<f64>,
    up: *const Vec3<f64>,
) -> *const Mat4<f64> {
    if let Some(o) = unsafe { out.as_mut() } {
        *o = transform::look_at(eye.load(), center.load(), up.load())
    }
    out
}

#[export_name = concat!("munum:wasm/transform#look-at-dir")]
pub extern "C" fn transform_look_at_dir(
    out: *mut Vec3<f64>,
    pitch: f64,
    yaw: f64,
) -> *const Vec3<f64> {
    if let Some(o) = unsafe { out.as_mut() } {
        *o = transform::look_at_direction(pitch, yaw)
    }
    out
}
