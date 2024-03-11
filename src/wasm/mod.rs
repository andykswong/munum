//! WebAssembly bindings.

mod ptr;

#[cfg(feature = "jsmath")]
mod jsmath;

#[cfg(feature = "wasm")]
mod vec;
