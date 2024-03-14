//! Micro Library for 3D Math

#![no_std]

extern crate alloc;

#[cfg(any(feature = "std", test))]
extern crate std;

mod matrix;
mod matrix_ops;
mod matrix_special;
mod quat;

pub mod float;
pub mod scalar;
pub mod transform;
pub mod transform2d;

pub use float::{FloatEq, FloatOps};
pub use matrix::Matrix;
pub use matrix_special::*;
pub use quat::{quat, Quaternion};

#[cfg(target_arch = "wasm32")]
mod wasm;
