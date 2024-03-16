use super::ptr::Load;
use crate::{Quaternion, Vec3};
use alloc::boxed::Box;

#[export_name = concat!("quatidentity")]
pub extern "C" fn quat_identity() -> *const Quaternion<f64> {
    Box::into_raw(Box::new(Quaternion::identity()))
}

#[export_name = concat!("quatfromunitvecs")]
pub extern "C" fn quat_from_unit_vecs(
    from: *const Vec3<f64>,
    to: *const Vec3<f64>,
) -> *const Quaternion<f64> {
    Box::into_raw(Box::new(Quaternion::from_unit_vecs(from.load(), to.load())))
}

#[export_name = concat!("quatfromaxisangle")]
pub extern "C" fn quat_from_axis_angle(
    axis: *const Vec3<f64>,
    angle: f64,
) -> *const Quaternion<f64> {
    Box::into_raw(Box::new(Quaternion::from_axis_angle(axis.load(), angle)))
}

#[export_name = concat!("quatfromanglex")]
pub extern "C" fn quat_from_angle_x(angle: f64) -> *const Quaternion<f64> {
    Box::into_raw(Box::new(Quaternion::from_angle_x(angle)))
}

#[export_name = concat!("quatfromangley")]
pub extern "C" fn quat_from_angle_y(angle: f64) -> *const Quaternion<f64> {
    Box::into_raw(Box::new(Quaternion::from_angle_y(angle)))
}

#[export_name = concat!("quatfromanglez")]
pub extern "C" fn quat_from_angle_z(angle: f64) -> *const Quaternion<f64> {
    Box::into_raw(Box::new(Quaternion::from_angle_z(angle)))
}

#[export_name = concat!("quatmul")]
pub extern "C" fn quat_mul(
    out: *mut Quaternion<f64>,
    a: *const Quaternion<f64>,
    b: *const Quaternion<f64>,
) -> *const Quaternion<f64> {
    if let Some(o) = unsafe { out.as_mut() } {
        *o = a.load();
        *o *= b.load();
    }
    out
}

#[export_name = concat!("quatvec3rotate")]
pub extern "C" fn quat_rotate_vec3(
    out: *mut Vec3<f64>,
    q: *const Quaternion<f64>,
    v: *const Vec3<f64>,
) -> *const Vec3<f64> {
    if let Some(o) = unsafe { out.as_mut() } {
        *o = q.load().rotate_vec3(v.load())
    }
    out
}

#[export_name = concat!("quatnorm")]
pub extern "C" fn quat_norm(out: *mut Quaternion<f64>, q: *const Quaternion<f64>) -> bool {
    if let Some(o) = unsafe { out.as_mut() } {
        *o = q.load();
        o.normalize()
    } else {
        false
    }
}

#[export_name = concat!("quatdot")]
pub extern "C" fn quat_dot(a: *const Quaternion<f64>, b: *const Quaternion<f64>) -> f64 {
    a.load().dot(b.load())
}

#[export_name = concat!("quatinvert")]
pub extern "C" fn quat_invert(out: *mut Quaternion<f64>, q: *const Quaternion<f64>) -> bool {
    if let Some(o) = unsafe { out.as_mut() } {
        *o = q.load();
        o.invert()
    } else {
        false
    }
}

#[export_name = concat!("quatlerp")]
pub extern "C" fn quat_lerp(
    out: *mut Quaternion<f64>,
    a: *const Quaternion<f64>,
    b: *const Quaternion<f64>,
    t: f64,
) -> *const Quaternion<f64> {
    if let Some(o) = unsafe { out.as_mut() } {
        *o = a.load().lerp(b.load(), t);
    }
    out
}

#[export_name = concat!("quatslerp")]
pub extern "C" fn quat_slerp(
    out: *mut Quaternion<f64>,
    a: *const Quaternion<f64>,
    b: *const Quaternion<f64>,
    t: f64,
) -> *const Quaternion<f64> {
    if let Some(o) = unsafe { out.as_mut() } {
        *o = a.load().slerp(b.load(), t);
    }
    out
}
