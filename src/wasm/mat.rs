use super::ptr::Load;
use crate::{Mat2, Mat3, Mat4};
use alloc::boxed::Box;
use paste::paste;

macro_rules! export_mat {
    ($name:ident, $mat_type:ty, $t:ty) => {
        paste! {
            #[export_name = concat!(stringify!($name), "identity")]
            pub extern "C" fn [<$name _identity>]() -> *const $mat_type {
                Box::into_raw(Box::new(<$mat_type>::identity()))
            }

            #[export_name = concat!(stringify!($name), "add")]
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

            #[export_name = concat!(stringify!($name), "sub")]
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

            #[export_name = concat!(stringify!($name), "mul")]
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

            #[export_name = concat!(stringify!($name), "scale")]
            pub extern "C" fn [<$name _scale>](out: *mut $mat_type, a: *const $mat_type, s: f64) -> *const $mat_type {
                if let Some(o) = unsafe { out.as_mut() } {
                    *o = a.load();
                    *o *= s;
                }
                out
            }

            #[export_name = concat!(stringify!($name), "transpose")]
            pub extern "C" fn [<$name _transpose>](out: *mut $mat_type, a: *const $mat_type) -> *const $mat_type {
                if let Some(o) = unsafe { out.as_mut() } {
                    *o = a.load();
                    o.transpose();
                }
                out
            }

            #[export_name = concat!(stringify!($name), "invert")]
            pub extern "C" fn [<$name _invert>](out: *mut $mat_type, a: *const $mat_type) -> bool {
                if let Some(o) = unsafe { out.as_mut() } {
                    *o = a.load();
                    o.invert()
                } else {
                    false
                }
            }

            #[export_name = concat!(stringify!($name), "det")]
            pub extern "C" fn [<$name _det>](a: *const $mat_type) -> $t {
                a.load().det()
            }
        }
    }
}

macro_rules! export_mat_convert {
    ($from_name:ident, $from_type:ty, $to_name:ident, $to_type:ty) => {
        paste! {
            #[export_name = concat!(stringify!($to_name), "from", stringify!($from_name))]
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

#[export_name = "normalmat3"]
pub extern "C" fn normal_mat3(out: *mut Mat3<f64>, m: *const Mat3<f64>) -> bool {
    if let Some(o) = unsafe { out.as_mut() } {
        *o = m.load();
        o.normal_matrix()
    } else {
        false
    }
}
