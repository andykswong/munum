use super::ptr::Load;
use crate::{Mat2, Mat3, Mat4, Vec2, Vec3, Vec4};
use paste::paste;

macro_rules! export_vec {
    ($name:ident, $vec_type:ty, $mat_type:ty, $t:ty) => {
        paste! {
            #[export_name = concat!(stringify!($name), "add")]
            pub extern "C" fn [<$name _add>](
                out: *mut $vec_type,
                a: *const $vec_type,
                b: *const $vec_type,
            ) -> *const $vec_type {
                if let Some(o) = unsafe { out.as_mut() } {
                    *o = a.load();
                    *o += b.load();
                }
                out
            }

            #[export_name = concat!(stringify!($name), "sub")]
            pub extern "C" fn [<$name _sub>](
                out: *mut $vec_type,
                a: *const $vec_type,
                b: *const $vec_type,
            ) -> *const $vec_type {
                if let Some(o) = unsafe { out.as_mut() } {
                    *o = a.load();
                    *o -= b.load();
                }
                out
            }

            #[export_name = concat!(stringify!($name), "mul")]
            pub extern "C" fn [<$name _mul>](
                out: *mut $vec_type,
                m: *const $mat_type,
                a: *const $vec_type,
            ) -> *const $vec_type {
                if let Some(o) = unsafe { out.as_mut() } {
                    *o = m.load() * a.load();
                }
                out
            }

            #[export_name = concat!(stringify!($name), "scale")]
            pub extern "C" fn [<$name _scale>](out: *mut $vec_type, a: *const $vec_type, s: f64) -> *const $vec_type {
                if let Some(o) = unsafe { out.as_mut() } {
                    *o = a.load();
                    *o *= s;
                }
                out
            }

            #[export_name = concat!(stringify!($name), "norm")]
            pub extern "C" fn [<$name _norm>](out: *mut $vec_type, a: *const $vec_type) -> bool {
                if let Some(o) = unsafe { out.as_mut() } {
                    *o = a.load();
                    o.normalize()
                } else {
                    false
                }
            }

            #[export_name = concat!(stringify!($name), "dot")]
            pub extern "C" fn [<$name _dot>](a: *const $vec_type, b: *const $vec_type) -> $t {
                a.load().dot(b.load())
            }

            #[export_name = concat!(stringify!($name), "lerp")]
            pub extern "C" fn [<$name _lerp>](
                out: *mut $vec_type,
                a: *const $vec_type,
                b: *const $vec_type,
                t: $t,
            ) -> *const $vec_type {
                if let Some(o) = unsafe { out.as_mut() } {
                    *o = a.load().lerp(b.load(), t);
                }
                out
            }
        }
    }
}

export_vec!(vec2, Vec2<f64>, Mat2<f64>, f64);
export_vec!(vec3, Vec3<f64>, Mat3<f64>, f64);
export_vec!(vec4, Vec4<f64>, Mat4<f64>, f64);

#[export_name = "mat3vec2mul"]
pub extern "C" fn mat3_mul_vec2(
    out: *mut Vec2<f64>,
    m: *const Mat3<f64>,
    a: *const Vec2<f64>,
) -> *const Vec2<f64> {
    if let Some(o) = unsafe { out.as_mut() } {
        *o = (m.load() * Vec3::from(a.load())).into();
    }
    out
}

#[export_name = "mat4vec3mul"]
pub extern "C" fn mat4_mul_vec3(
    out: *mut Vec3<f64>,
    m: *const Mat4<f64>,
    a: *const Vec3<f64>,
) -> *const Vec3<f64> {
    if let Some(o) = unsafe { out.as_mut() } {
        *o = (m.load() * Vec4::from(a.load())).into();
    }
    out
}

#[export_name = "vec3cross"]
pub extern "C" fn vec3_cross(
    out: *mut Vec3<f64>,
    a: *const Vec3<f64>,
    b: *const Vec3<f64>,
) -> *const Vec3<f64> {
    if let Some(o) = unsafe { out.as_mut() } {
        *o = a.load().cross(b.load());
    }
    out
}
