import {
  AbstractMemoryManager,
  BYTES_PER_FLOAT64,
  ManagedFloat64Array,
  externalPointer,
  float64View,
} from '../memory.ts';
import type { Float64ArrayPointer, Float64ArrayViewProvider, MemoryManager } from '../memory.ts';

/** Free-list allocator over a growable WebAssembly linear memory. */
class JsMemoryManager extends AbstractMemoryManager {
  private readonly memory = new WebAssembly.Memory({ initial: 0 });
  private readonly freeList: Record<number, number> = {};
  private cachedView = new Float64Array(this.memory.buffer);
  private next = 0;

  public override get view(): Float64Array {
    if (this.cachedView.buffer !== this.memory.buffer) {
      this.cachedView = new Float64Array(this.memory.buffer);
    }
    return this.cachedView;
  }

  protected override createRaw(size: number): number {
    if (this.freeList[size]) {
      const offset = this.freeList[size] - 1;
      this.freeList[size] = this.view[offset];
      return offset * BYTES_PER_FLOAT64;
    }

    if (this.next + size > this.view.length) {
      this.memory.grow(1);
      this.cachedView = new Float64Array(this.memory.buffer);
    }

    const offset = this.next;
    this.next += size;
    return offset * BYTES_PER_FLOAT64;
  }

  protected override freeRaw(byteOffset: number, size: number): void {
    const offset = Math.ceil(byteOffset / BYTES_PER_FLOAT64);
    if (offset + size > this.view.length) {
      return;
    }
    this.view[offset] = this.freeList[size] || 0;
    this.freeList[size] = offset + 1;
  }
}

/** The default {@link MemoryManager} for the pure-JS implementation. */
export const memoryManager = new JsMemoryManager();

export type { Float64ArrayPointer, Float64ArrayViewProvider, MemoryManager };
export { AbstractMemoryManager, BYTES_PER_FLOAT64, ManagedFloat64Array, externalPointer, float64View };
