use super::ptr::Load;
use crate::{transform, Mat4, Quaternion, Vec3};

#[no_mangle]
pub extern "C" fn translation(
    out: *mut Mat4<f64>,
    v: *const Vec3<f64>,
) -> *const Mat4<f64> {
    if let Some(o) = unsafe { out.as_mut() } {
        *o = transform::translation(v.load())
    }
    out
}

#[no_mangle]
pub extern "C" fn scaling(out: *mut Mat4<f64>, v: *const Vec3<f64>) -> *const Mat4<f64> {
    if let Some(o) = unsafe { out.as_mut() } {
        *o = transform::scaling(v.load())
    }
    out
}

#[no_mangle]
pub extern "C" fn rotation(
    out: *mut Mat4<f64>,
    q: *const Quaternion<f64>,
) -> *const Mat4<f64> {
    if let Some(o) = unsafe { out.as_mut() } {
        *o = transform::rotation(q.load())
    }
    out
}

#[export_name = concat!("translationof")]
pub extern "C" fn translation_of(
    out: *mut Vec3<f64>,
    m: *const Mat4<f64>,
) -> *const Vec3<f64> {
    if let Some(o) = unsafe { out.as_mut() } {
        *o = transform::translation_of(m.load())
    }
    out
}

#[export_name = concat!("rotationof")]
pub extern "C" fn rotation_of(
    out: *mut Quaternion<f64>,
    m: *const Mat4<f64>,
) -> *const Quaternion<f64> {
    if let Some(o) = unsafe { out.as_mut() } {
        *o = transform::rotation_of(m.load())
    }
    out
}

#[export_name = concat!("scalingof")]
pub extern "C" fn scaling_of(
    out: *mut Vec3<f64>,
    m: *const Mat4<f64>,
) -> *const Vec3<f64> {
    if let Some(o) = unsafe { out.as_mut() } {
        *o = transform::scaling_of(m.load())
    }
    out
}

#[no_mangle]
pub extern "C" fn transformation(
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

#[export_name = concat!("inverttrs")]
pub extern "C" fn invert_trs(out: *mut Mat4<f64>, m: *const Mat4<f64>) -> bool {
    if let Some(o) = unsafe { out.as_mut() } {
        *o = m.load();
        transform::invert_trs(o)
    } else {
        false
    }
}

#[no_mangle]
pub extern "C" fn ortho(
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

#[no_mangle]
pub extern "C" fn perspective(
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

#[export_name = concat!("perspectiveviewport")]
pub extern "C" fn perspective_viewport(
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

#[export_name = concat!("targetto")]
pub extern "C" fn target_to(
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

#[export_name = concat!("lookat")]
pub extern "C" fn look_at(
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

#[export_name = concat!("lookatdir")]
pub extern "C" fn look_at_dir(
    out: *mut Vec3<f64>,
    pitch: f64,
    yaw: f64,
) -> *const Vec3<f64> {
    if let Some(o) = unsafe { out.as_mut() } {
        *o = transform::look_at_direction(pitch, yaw)
    }
    out
}
