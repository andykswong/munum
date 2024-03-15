//! WebAssembly bindings.

mod ptr;

#[cfg(feature = "jsmath")]
mod jsmath;

#[cfg(feature = "wasm")]
mod mat;

#[cfg(feature = "wasm")]
mod vec;

#[cfg(feature = "wasm")]
mod quat;

#[cfg(feature = "wasm")]
mod transform;

#[cfg(feature = "wasm")]
mod transform2d;

#[cfg(all(feature = "wasm", not(any(feature = "std", test))))]
#[panic_handler]
fn panic(_panic: &core::panic::PanicInfo<'_>) -> ! {
    core::arch::wasm32::unreachable()
}
