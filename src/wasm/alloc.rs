//! Memory allocator specifically designed for Vecs and Mats.

use core::{
    alloc::{GlobalAlloc, Layout},
    cell::{Cell, UnsafeCell},
    marker::PhantomData,
    ptr,
};

/// Wrapper for core::arch::wasm::memory_grow.
pub trait MemoryGrower {
    /// Grow the default linear memory by the specified delta of pages and return previous size.
    fn memory_grow(delta: usize) -> usize;

    /// Return the page size in bytes.
    fn page_size() -> usize;
}

/// Default stateless heap grower.
pub struct DefaultGrower;

impl MemoryGrower for DefaultGrower {
    #[inline]
    fn memory_grow(delta: usize) -> usize {
        core::arch::wasm32::memory_grow::<0>(delta)
    }

    #[inline]
    fn page_size() -> usize {
        65536
    }
}

/// Linked list of free nodes
#[repr(C)]
struct FreeListNode {
    next: *mut FreeListNode,
}

impl FreeListNode {
    pub const fn new() -> Self {
        FreeListNode {
            next: ptr::null_mut(),
        }
    }
}

/// A non-thread-safe allocator that uses free lists.
pub struct FreeListAllocator<T = DefaultGrower> {
    free_vec2: UnsafeCell<FreeListNode>,
    free_vec3: UnsafeCell<FreeListNode>,
    free_vec4: UnsafeCell<FreeListNode>,
    free_vec9: UnsafeCell<FreeListNode>,
    free_vec16: UnsafeCell<FreeListNode>,
    next_free: UnsafeCell<FreeListNode>,
    next_free_len: Cell<usize>,
    grower: PhantomData<T>,
}

// SAFETY: No one besides us has the raw pointer, so we can safely transfer the FreeListAllocator to another thread.
unsafe impl<T> Send for FreeListAllocator<T> {}

// SAFETY: This is technically unsafe, but required for global allocator use.
unsafe impl<T> Sync for FreeListAllocator<T> {}

impl<G: MemoryGrower> FreeListAllocator<G> {
    #[allow(dead_code)]
    pub const fn new() -> Self {
        FreeListAllocator {
            free_vec2: UnsafeCell::new(FreeListNode::new()),
            free_vec3: UnsafeCell::new(FreeListNode::new()),
            free_vec4: UnsafeCell::new(FreeListNode::new()),
            free_vec9: UnsafeCell::new(FreeListNode::new()),
            free_vec16: UnsafeCell::new(FreeListNode::new()),
            next_free: UnsafeCell::new(FreeListNode::new()),
            next_free_len: Cell::new(0),
            grower: PhantomData,
        }
    }

    fn grow_alloc(&self, size: usize) -> *mut u8 {
        let mut free_size = self.next_free_len.get();
        if free_size < size {
            let page_size = G::page_size();
            let prev_pages = G::memory_grow(1 + size / page_size);
            unsafe {
                if (*self.next_free.get()).next.is_null() {
                    (*self.next_free.get()).next = (prev_pages * page_size) as *mut FreeListNode;
                }
            }
            free_size += page_size;
        }

        let ptr = unsafe { (*self.next_free.get()).next };
        unsafe { (*self.next_free.get()).next = ptr.add(size) };
        free_size -= size;
        self.next_free_len.set(free_size);

        ptr as *mut u8
    }
}

unsafe impl<T: MemoryGrower> GlobalAlloc for FreeListAllocator<T> {
    unsafe fn alloc(&self, layout: Layout) -> *mut u8 {
        let size = layout.size();
        match size {
            16 => {
                let ptr = (*self.free_vec2.get()).next;
                if let Some(next) = ptr.as_ref() {
                    (*self.free_vec2.get()).next = next.next;
                    return ptr as *mut u8;
                }
            }
            24 => {
                let ptr = (*self.free_vec3.get()).next;
                if let Some(next) = ptr.as_ref() {
                    (*self.free_vec3.get()).next = next.next;
                    return ptr as *mut u8;
                }
            }
            32 => {
                let ptr = (*self.free_vec4.get()).next;
                if let Some(next) = ptr.as_ref() {
                    (*self.free_vec4.get()).next = next.next;
                    return ptr as *mut u8;
                }
            }
            72 => {
                let ptr = (*self.free_vec9.get()).next;
                if let Some(next) = ptr.as_ref() {
                    (*self.free_vec9.get()).next = next.next;
                    return ptr as *mut u8;
                }
            }
            128 => {
                let ptr = (*self.free_vec16.get()).next;
                if let Some(next) = ptr.as_ref() {
                    (*self.free_vec16.get()).next = next.next;
                    return ptr as *mut u8;
                }
            }
            // Other sizes are not supported
            _ => return ptr::null_mut(),
        }

        self.grow_alloc(size)
    }

    unsafe fn dealloc(&self, ptr: *mut u8, layout: Layout) {
        let ptr = ptr as *mut FreeListNode;
        let size = layout.size();

        match size {
            16 => {
                (*ptr).next = (*self.free_vec2.get()).next;
                (*self.free_vec2.get()).next = ptr;
            }
            24 => {
                (*ptr).next = (*self.free_vec3.get()).next;
                (*self.free_vec3.get()).next = ptr;
            }
            32 => {
                (*ptr).next = (*self.free_vec4.get()).next;
                (*self.free_vec4.get()).next = ptr;
            }
            72 => {
                (*ptr).next = (*self.free_vec9.get()).next;
                (*self.free_vec9.get()).next = ptr;
            }
            128 => {
                (*ptr).next = (*self.free_vec16.get()).next;
                (*self.free_vec16.get()).next = ptr;
            }
            _ => return, // Other sizes are not supported
        }
    }
}
