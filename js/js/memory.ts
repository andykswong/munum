import { ManagedFloat64Array, MemoryManager, setMemoryManager, useFinalizationRegistry } from '../memory.ts';

export const BYTES_PER_FLOAT64 = 8;
const memory = new WebAssembly.Memory({ initial: 0 });
const freeList: Record<number, number> = {};
let view = new Float64Array(memory.buffer);
let next = 0;

/** Free-list allocator using WASM growable memory. */
export const memoryManager: MemoryManager = {
  get buffer() {
    return memory.buffer;
  },
  get view() {
    return view;
  },
  create: function (size: number): number {
    if (freeList[size]) {
      const offset = freeList[size] - 1;
      freeList[size] = view[offset];
      return offset * BYTES_PER_FLOAT64;
    }

    if (next + size > view.length) {
      memory.grow(1);
      view = new Float64Array(memory.buffer);
    }

    const offset = next;
    next += size;
    return offset * BYTES_PER_FLOAT64;
  },
  free: function (byteOffset: number, size: number): void {
    const offset = Math.ceil(byteOffset / BYTES_PER_FLOAT64);
    if (offset + size > view.length) {
      return;
    }
    view[offset] = freeList[size] || 0;
    freeList[size] = offset + 1;
  }
};

setMemoryManager(memoryManager);

export type { MemoryManager };
export { ManagedFloat64Array, setMemoryManager, useFinalizationRegistry };
