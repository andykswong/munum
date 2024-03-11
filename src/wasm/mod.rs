//! WebAssembly bindings.

#[cfg(feature = "jsmath")]
mod jsmath;
#[cfg(feature = "jsmath")]
mod float;

#[cfg(feature = "wasm")]
mod bindings;
