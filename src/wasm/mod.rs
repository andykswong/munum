//! WebAssembly bindings.

mod ptr;

#[cfg(feature = "jsmath")]
mod jsmath;

#[cfg(feature = "wasm")]
mod array;
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

#[cfg(feature = "wasm")]
mod alloc;

#[cfg(all(feature = "wasm", not(any(feature = "std", test))))]
#[panic_handler]
fn panic(_panic: &core::panic::PanicInfo<'_>) -> ! {
    core::arch::wasm32::unreachable()
}

#[cfg(all(feature = "wasm", not(any(feature = "std", test))))]
#[global_allocator]
static ALLOCATOR: alloc::FreeListAllocator = alloc::FreeListAllocator::new();
