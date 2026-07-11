import { create, free, memory } from '../../wasm/index.js';
import {
  AbstractMemoryManager,
  BYTES_PER_FLOAT64,
  ManagedFloat64Array,
  externalPointer,
  float64View,
} from '../memory.ts';
import type { Float64ArrayPointer, Float64ArrayViewProvider, MemoryManager } from '../memory.ts';

/** Memory manager backed by the munum wasm module's linear memory. */
class WasmMemoryManager extends AbstractMemoryManager {
  private cachedView = new Float64Array(memory.buffer);

  public override get view(): Float64Array {
    if (this.cachedView.buffer !== memory.buffer) {
      this.cachedView = new Float64Array(memory.buffer);
    }
    return this.cachedView;
  }

  protected override createRaw(size: number): number {
    return create(size);
  }

  protected override freeRaw(byteOffset: number, size: number): void {
    free(byteOffset, size);
  }
}

/**
 * The default {@link MemoryManager} for the WebAssembly binding. Exported as the
 * concrete type (not annotated `MemoryManager`) so the binding classes can call
 * {@link AbstractMemoryManager.wrap} on wasm-op-returned raw offsets.
 */
export const memoryManager = new WasmMemoryManager();

export type { Float64ArrayPointer, Float64ArrayViewProvider, MemoryManager };
export { AbstractMemoryManager, BYTES_PER_FLOAT64, ManagedFloat64Array, externalPointer, float64View };
