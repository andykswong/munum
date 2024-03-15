use super::ptr::Load;
use crate::{Mat2, Mat3, Mat4, Vec2, Vec3, Vec4};
use alloc::boxed::Box;
use paste::paste;

macro_rules! export_vec {
    ($name:ident, $vec_type:ty, $mat_type:ty, $t:ty) => {
        paste! {
            #[export_name = concat!("munum:wasm/", stringify!($name), "#free")]
            pub extern "C" fn [<$name _free>](ptr: *mut $vec_type) {
                drop(unsafe { Box::from_raw(ptr) })
            }

            #[export_name = concat!("munum:wasm/", stringify!($name), "#get")]
            pub extern "C" fn [<$name _get>](ptr: *const $vec_type) -> *const $vec_type {
                ptr
            }

            #[export_name = concat!("munum:wasm/", stringify!($name), "#copy")]
            pub extern "C" fn [<$name _copy>](dst: *mut $vec_type, src: *const $vec_type) -> *const $vec_type {
                if let Some(o) = unsafe { dst.as_mut() } {
                    *o = src.load();
                }
                dst
            }

            #[export_name = concat!("munum:wasm/", stringify!($name), "#add")]
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

            #[export_name = concat!("munum:wasm/", stringify!($name), "#sub")]
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

            #[export_name = concat!("munum:wasm/", stringify!($name), "#mul")]
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

            #[export_name = concat!("munum:wasm/", stringify!($name), "#scale")]
            pub extern "C" fn [<$name _scale>](out: *mut $vec_type, a: *const $vec_type, s: f64) -> *const $vec_type {
                if let Some(o) = unsafe { out.as_mut() } {
                    *o = a.load();
                    *o *= s;
                }
                out
            }

            #[export_name = concat!("munum:wasm/", stringify!($name), "#norm")]
            pub extern "C" fn [<$name _norm>](out: *mut $vec_type, a: *const $vec_type) -> bool {
                if let Some(o) = unsafe { out.as_mut() } {
                    *o = a.load();
                    o.normalize()
                } else {
                    false
                }
            }

            #[export_name = concat!("munum:wasm/", stringify!($name), "#dot")]
            pub extern "C" fn [<$name _dot>](a: *const $vec_type, b: *const $vec_type) -> $t {
                a.load().dot(b.load())
            }

            #[export_name = concat!("munum:wasm/", stringify!($name), "#sqr-len")]
            pub extern "C" fn [<$name _sqr_len>](a: *const $vec_type) -> $t {
                a.load().sqr_len()
            }

            #[export_name = concat!("munum:wasm/", stringify!($name), "#len")]
            pub extern "C" fn [<$name _len>](a: *const $vec_type) -> $t {
                a.load().len()
            }

            #[export_name = concat!("munum:wasm/", stringify!($name), "#lerp")]
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

#[export_name = "munum:wasm/vec2#create"]
pub extern "C" fn vec2_create(x: f64, y: f64) -> *const Vec2<f64> {
    Box::into_raw(Box::new(Vec2::new([[x, y]])))
}

#[export_name = "munum:wasm/vec2#set"]
pub extern "C" fn vec2_set(out: *mut Vec2<f64>, x: f64, y: f64) -> *const Vec2<f64> {
    if let Some(v) = unsafe { out.as_mut() } {
        v[(0, 0)] = x;
        v[(1, 0)] = y;
    }
    out
}

#[export_name = "munum:wasm/vec3#create"]
pub extern "C" fn vec3_create(x: f64, y: f64, z: f64) -> *const Vec3<f64> {
    Box::into_raw(Box::new(Vec3::new([[x, y, z]])))
}

#[export_name = "munum:wasm/vec3#set"]
pub extern "C" fn vec3_set(out: *mut Vec3<f64>, x: f64, y: f64, z: f64) -> *const Vec3<f64> {
    if let Some(v) = unsafe { out.as_mut() } {
        v[(0, 0)] = x;
        v[(1, 0)] = y;
        v[(2, 0)] = z;
    }
    out
}

#[export_name = "munum:wasm/vec4#create"]
pub extern "C" fn vec4_create(x: f64, y: f64, z: f64, w: f64) -> *const Vec4<f64> {
    Box::into_raw(Box::new(Vec4::new([[x, y, z, w]])))
}

#[export_name = "munum:wasm/vec4#set"]
pub extern "C" fn vec4_set(
    out: *mut Vec4<f64>,
    x: f64,
    y: f64,
    z: f64,
    w: f64,
) -> *const Vec4<f64> {
    if let Some(v) = unsafe { out.as_mut() } {
        v[(0, 0)] = x;
        v[(1, 0)] = y;
        v[(2, 0)] = z;
        v[(3, 0)] = w;
    }
    out
}

#[export_name = "munum:wasm/vec2#mul3"]
pub extern "C" fn vec2_mul3(
    out: *mut Vec2<f64>,
    m: *const Mat3<f64>,
    a: *const Vec2<f64>,
) -> *const Vec2<f64> {
    if let Some(o) = unsafe { out.as_mut() } {
        *o = (m.load() * Vec3::from(a.load())).into();
    }
    out
}

#[export_name = "munum:wasm/vec3#mul4"]
pub extern "C" fn vec3_mul4(
    out: *mut Vec3<f64>,
    m: *const Mat4<f64>,
    a: *const Vec3<f64>,
) -> *const Vec3<f64> {
    if let Some(o) = unsafe { out.as_mut() } {
        *o = (m.load() * Vec4::from(a.load())).into();
    }
    out
}

#[export_name = "munum:wasm/vec3#cross"]
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
