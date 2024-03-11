//! Micro Library for 3D Math

#![no_std]

#[cfg(test)]
extern crate alloc;

#[cfg(feature = "std")]
extern crate std;

mod matrix;
mod matrix_special;
mod matrix_ops;
mod quat;

pub mod float;
pub mod scalar;
pub mod transform;

pub use float::{FloatEq, FloatOps};
pub use matrix::Matrix;
pub use matrix_special::*;
pub use quat::{quat, Quaternion};

#[cfg(target_arch = "wasm32")]
mod wasm;
