use super::ptr::Load;
use crate::{Mat2, Mat3, Mat4};
use alloc::boxed::Box;
use paste::paste;

macro_rules! export_mat {
    ($name:ident, $mat_type:ty, $t:ty) => {
        paste! {
            #[export_name = concat!("munum:wasm/", stringify!($name), "#create")]
            pub extern "C" fn [<$name _create>]() -> *const $mat_type {
                Box::into_raw(Box::new(<$mat_type>::default()))
            }

            #[export_name = concat!("munum:wasm/", stringify!($name), "#identity")]
            pub extern "C" fn [<$name _identity>](out: *mut $mat_type) -> *const $mat_type {
                if let Some(o) = unsafe { out.as_mut() } {
                    *o = <$mat_type>::identity();
                }
                out
            }

            #[export_name = concat!("munum:wasm/", stringify!($name), "#free")]
            pub extern "C" fn [<$name _free>](ptr: *mut $mat_type) {
                drop(unsafe { Box::from_raw(ptr) })
            }

            #[export_name = concat!("munum:wasm/", stringify!($name), "#get")]
            pub extern "C" fn [<$name _get>](ptr: *const $mat_type) -> *const $mat_type {
                ptr
            }

            #[export_name = concat!("munum:wasm/", stringify!($name), "#copy")]
            pub extern "C" fn [<$name _copy>](dst: *mut $mat_type, src: *const $mat_type) -> *const $mat_type {
                if let Some(o) = unsafe { dst.as_mut() } {
                    *o = src.load();
                }
                dst
            }

            #[export_name = concat!("munum:wasm/", stringify!($name), "#add")]
            pub extern "C" fn [<$name _add>](
                out: *mut $mat_type,
                a: *const $mat_type,
                b: *const $mat_type,
            ) -> *const $mat_type {
                if let Some(o) = unsafe { out.as_mut() } {
                    *o = a.load();
                    *o += b.load();
                }
                out
            }

            #[export_name = concat!("munum:wasm/", stringify!($name), "#sub")]
            pub extern "C" fn [<$name _sub>](
                out: *mut $mat_type,
                a: *const $mat_type,
                b: *const $mat_type,
            ) -> *const $mat_type {
                if let Some(o) = unsafe { out.as_mut() } {
                    *o = a.load();
                    *o -= b.load();
                }
                out
            }

            #[export_name = concat!("munum:wasm/", stringify!($name), "#mul")]
            pub extern "C" fn [<$name _mul>](
                out: *mut $mat_type,
                a: *const $mat_type,
                b: *const $mat_type,
            ) -> *const $mat_type {
                if let Some(o) = unsafe { out.as_mut() } {
                    *o = a.load();
                    *o *= b.load();
                }
                out
            }

            #[export_name = concat!("munum:wasm/", stringify!($name), "#scale")]
            pub extern "C" fn [<$name _scale>](out: *mut $mat_type, a: *const $mat_type, s: f64) -> *const $mat_type {
                if let Some(o) = unsafe { out.as_mut() } {
                    *o = a.load();
                    *o *= s;
                }
                out
            }

            #[export_name = concat!("munum:wasm/", stringify!($name), "#transpose")]
            pub extern "C" fn [<$name _transpose>](out: *mut $mat_type, a: *const $mat_type) -> *const $mat_type {
                if let Some(o) = unsafe { out.as_mut() } {
                    *o = a.load();
                    o.transpose();
                }
                out
            }

            #[export_name = concat!("munum:wasm/", stringify!($name), "#invert")]
            pub extern "C" fn [<$name _invert>](out: *mut $mat_type, a: *const $mat_type) -> bool {
                if let Some(o) = unsafe { out.as_mut() } {
                    *o = a.load();
                    o.invert()
                } else {
                    false
                }
            }

            #[export_name = concat!("munum:wasm/", stringify!($name), "#det")]
            pub extern "C" fn [<$name _det>](a: *const $mat_type) -> $t {
                a.load().det()
            }
        }
    }
}

macro_rules! export_mat_convert {
    ($from_name:ident, $from_type:ty, $to_name:ident, $to_type:ty) => {
        paste! {
            #[export_name = concat!("munum:wasm/", stringify!($to_name), "#from-", stringify!($from_name))]
            pub extern "C" fn [<$to_name _from_ $from_name>](m: *const $from_type) -> *const $to_type {
                Box::into_raw(Box::new(m.load().into()))
            }
        }
    }
}

export_mat!(mat2, Mat2<f64>, f64);
export_mat!(mat3, Mat3<f64>, f64);
export_mat!(mat4, Mat4<f64>, f64);

export_mat_convert!(mat2, Mat2<f64>, mat3, Mat3<f64>);
export_mat_convert!(mat3, Mat3<f64>, mat2, Mat2<f64>);
export_mat_convert!(mat3, Mat3<f64>, mat4, Mat4<f64>);
export_mat_convert!(mat4, Mat4<f64>, mat3, Mat3<f64>);

#[export_name = "munum:wasm/mat2#set"]
pub extern "C" fn mat2_set(
    out: *mut Mat2<f64>,
    m00: f64,
    m10: f64,
    m01: f64,
    m11: f64,
) -> *const Mat2<f64> {
    if let Some(m) = unsafe { out.as_mut() } {
        *m = Mat2::new([[m00, m10], [m01, m11]]);
    }
    out
}

#[export_name = "munum:wasm/mat3#set"]
pub extern "C" fn mat3_set(
    out: *mut Mat3<f64>,
    m00: f64,
    m10: f64,
    m20: f64,
    m01: f64,
    m11: f64,
    m21: f64,
    m02: f64,
    m12: f64,
    m22: f64,
) -> *const Mat3<f64> {
    if let Some(m) = unsafe { out.as_mut() } {
        *m = Mat3::new([[m00, m10, m20], [m01, m11, m21], [m02, m12, m22]]);
    }
    out
}

#[export_name = "munum:wasm/mat4#set"]
pub extern "C" fn mat4_set(
    out: *mut Mat4<f64>,
    m00: f64,
    m10: f64,
    m20: f64,
    m30: f64,
    m01: f64,
    m11: f64,
    m21: f64,
    m31: f64,
    m02: f64,
    m12: f64,
    m22: f64,
    m32: f64,
    m03: f64,
    m13: f64,
    m23: f64,
    m33: f64,
) -> *const Mat4<f64> {
    if let Some(m) = unsafe { out.as_mut() } {
        *m = Mat4::new([
            [m00, m10, m20, m30],
            [m01, m11, m21, m31],
            [m02, m12, m22, m32],
            [m03, m13, m23, m33],
        ]);
    }
    out
}

#[export_name = "munum:wasm/mat3#normal-mat"]
pub extern "C" fn mat3_normal_mat(out: *mut Mat3<f64>, m: *const Mat3<f64>) -> bool {
    if let Some(o) = unsafe { out.as_mut() } {
        *o = m.load();
        o.normal_matrix()
    } else {
        false
    }
}
