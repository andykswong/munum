import { create, free, memory } from '../../wasm/index.js';
import { ManagedFloat64Array, MemoryManager, setMemoryManager } from '../memory.ts';

let view = new Float64Array(memory.buffer);

export const memoryManager: MemoryManager = {
  get buffer() {
    return memory.buffer;
  },
  get view() {
    if (view.buffer !== memory.buffer) {
      view = new Float64Array(memory.buffer);
    }
    return view;
  },
  create: function (size: number): number {
    return create(size);
  },
  free: function (byteOffset: number, size: number): void {
    free(byteOffset, size);
  }
};

setMemoryManager(memoryManager);

export { ManagedFloat64Array };
