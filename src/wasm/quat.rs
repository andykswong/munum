use super::ptr::Load;
use crate::{Quaternion, Vec3};
use alloc::boxed::Box;

#[export_name = concat!("munum:wasm/quat#create")]
pub extern "C" fn quat_create(x: f64, y: f64, z: f64, w: f64) -> *const Quaternion<f64> {
    Box::into_raw(Box::new(Quaternion::new(x, y, z, w)))
}

#[export_name = concat!("munum:wasm/quat#from-unit-vecs")]
pub extern "C" fn quat_from_unit_vecs(
    from: *const Vec3<f64>,
    to: *const Vec3<f64>,
) -> *const Quaternion<f64> {
    Box::into_raw(Box::new(Quaternion::from_unit_vecs(from.load(), to.load())))
}

#[export_name = concat!("munum:wasm/quat#from-axis-angle")]
pub extern "C" fn quat_from_axis_angle(
    axis: *const Vec3<f64>,
    angle: f64,
) -> *const Quaternion<f64> {
    Box::into_raw(Box::new(Quaternion::from_axis_angle(axis.load(), angle)))
}

#[export_name = concat!("munum:wasm/quat#from-angle-x")]
pub extern "C" fn quat_from_angle_x(angle: f64) -> *const Quaternion<f64> {
    Box::into_raw(Box::new(Quaternion::from_angle_x(angle)))
}

#[export_name = concat!("munum:wasm/quat#from-angle-y")]
pub extern "C" fn quat_from_angle_y(angle: f64) -> *const Quaternion<f64> {
    Box::into_raw(Box::new(Quaternion::from_angle_y(angle)))
}

#[export_name = concat!("munum:wasm/quat#from-angle-z")]
pub extern "C" fn quat_from_angle_z(angle: f64) -> *const Quaternion<f64> {
    Box::into_raw(Box::new(Quaternion::from_angle_z(angle)))
}

#[export_name = concat!("munum:wasm/quat#free")]
pub extern "C" fn quat_free(ptr: *mut Quaternion<f64>) {
    drop(unsafe { Box::from_raw(ptr) })
}

#[export_name = "munum:wasm/quat#set"]
pub extern "C" fn quat_set(
    out: *mut Quaternion<f64>,
    x: f64,
    y: f64,
    z: f64,
    w: f64,
) -> *const Quaternion<f64> {
    if let Some(q) = unsafe { out.as_mut() } {
        q[0] = x;
        q[1] = y;
        q[2] = z;
        q[3] = w;
    }
    out
}

#[export_name = concat!("munum:wasm/quat#get")]
pub extern "C" fn quat_get(ptr: *const Quaternion<f64>) -> *const Quaternion<f64> {
    ptr
}

#[export_name = concat!("munum:wasm/quat#copy")]
pub extern "C" fn quat_copy(
    dst: *mut Quaternion<f64>,
    src: *const Quaternion<f64>,
) -> *const Quaternion<f64> {
    if let Some(o) = unsafe { dst.as_mut() } {
        *o = src.load();
    }
    dst
}

#[export_name = concat!("munum:wasm/quat#mul")]
pub extern "C" fn quat_mul(
    out: *mut Quaternion<f64>,
    a: *const Quaternion<f64>,
    b: *const Quaternion<f64>,
) -> *const Quaternion<f64> {
    if let Some(o) = unsafe { out.as_mut() } {
        *o = a.load() * b.load();
    }
    out
}

#[export_name = concat!("munum:wasm/quat#rotate-vec3")]
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

#[export_name = concat!("munum:wasm/quat#norm")]
pub extern "C" fn quat_norm(
    out: *mut Quaternion<f64>,
    q: *const Quaternion<f64>,
) -> bool {
    if let Some(o) = unsafe { out.as_mut() } {
        *o = q.load();
        o.normalize()
    } else {
        false
    }
}

#[export_name = concat!("munum:wasm/quat#dot")]
pub extern "C" fn quat_dot(a: *const Quaternion<f64>, b: *const Quaternion<f64>) -> f64 {
    a.load().dot(b.load())
}

#[export_name = concat!("munum:wasm/quat#sqr-len")]
pub extern "C" fn quat_sqr_len(q: *const Quaternion<f64>) -> f64 {
    q.load().sqr_len()
}

#[export_name = concat!("munum:wasm/quat#len")]
pub extern "C" fn quat_len(q: *const Quaternion<f64>) -> f64 {
    q.load().len()
}

#[export_name = concat!("munum:wasm/quat#conj")]
pub extern "C" fn quat_conj(
    out: *mut Quaternion<f64>,
    q: *const Quaternion<f64>,
) -> *const Quaternion<f64> {
    if let Some(o) = unsafe { out.as_mut() } {
        *o = q.load();
        o.conj();
    }
    out
}

#[export_name = concat!("munum:wasm/quat#invert")]
pub extern "C" fn quat_invert(out: *mut Quaternion<f64>, q: *const Quaternion<f64>) -> bool {
    if let Some(o) = unsafe { out.as_mut() } {
        *o = q.load();
        o.invert()
    } else {
        false
    }
}

#[export_name = concat!("munum:wasm/quat#lerp")]
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

#[export_name = concat!("munum:wasm/quat#slerp")]
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
