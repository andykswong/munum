use alloc::{boxed::Box, vec};
use core::ptr;

#[unsafe(export_name = concat!("create"))]
pub extern "C" fn create(len: usize) -> *const f64 {
    Box::into_raw(vec![0_f64; len].into_boxed_slice()) as *const f64
}

#[unsafe(export_name = concat!("free"))]
pub extern "C" fn free(ptr: *mut f64, len: usize) {
    // SAFETY: `ptr`/`len` describe a boxed slice previously leaked by `create`.
    drop(unsafe { Box::from_raw(ptr::slice_from_raw_parts_mut(ptr, len)) })
}
