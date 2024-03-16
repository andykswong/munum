use alloc::{boxed::Box, vec};
use core::slice;

#[export_name = concat!("create")]
pub extern "C" fn create(len: usize) -> *const f64 {
    Box::into_raw(vec![0_f64; len].into_boxed_slice()) as *const f64
}

#[export_name = concat!("free")]
pub extern "C" fn free(ptr: *mut f64, len: usize) {
    drop(unsafe { Box::from_raw(slice::from_raw_parts_mut(ptr, len)) })
}
