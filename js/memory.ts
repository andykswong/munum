const BYTES_PER_FLOAT64 = 8;

/** A linear memory manager. */
export interface MemoryManager {
  /** The active memory buffer. */
  readonly buffer: ArrayBufferLike;

  /** The active float64 memory view. */
  readonly view: Float64Array;

  /** Allocates given size of memory in the number of float64 and returns the byteOffset pointing to the new memory. */
  create(size: number): number;

  /** Frees the memory at given byteOffset and size in the number of float64. */
  free(byteOffset: number, size: number): void;
}

/** The {@link MemoryManager} to use. */
let memoryManager: MemoryManager;

/** Sets the {@link MemoryManager} to use. */
export function setMemoryManager(manager: MemoryManager): void {
  memoryManager = manager;
}

let usingFinalizationRegistry = true;

/** Sets if FinalizationRegistry should be used for automatic memory cleanup. */
export function useFinalizationRegistry(use: boolean): void {
  usingFinalizationRegistry = use;
}

const registry = global.FinalizationRegistry &&
  new FinalizationRegistry(([ptr, size]: [number, number]) => memoryManager.free(ptr, size));

function register(arr: ManagedBufferView): void {
  usingFinalizationRegistry && registry?.register(arr, [arr.byteOffset, arr.length], arr);
}

function unregister(arr: ManagedBufferView): void {
  usingFinalizationRegistry && registry?.unregister(arr);
}

/** A wrapped TypedArray that requires explicit memory management. */
export interface ManagedBufferView<N extends number = number> extends ArrayBufferView, Disposable {
  /** Whether the array is still valid. */
  readonly valid: boolean;

  /** The length of the array. */
  readonly length: N;

  /** Frees the array. */
  free(): void;
}

/** A managed Float64Array. */
export abstract class ManagedFloat64Array<N extends number = number>
  implements ManagedBufferView<N>, Iterable<number> {

  public constructor(public byteOffset: number) {
    register(this);
  }

  public *[Symbol.iterator](): Iterator<number> {
    if (!this.valid) { return; }
    const view = memoryManager.view;
    const offset = (this.byteOffset / BYTES_PER_FLOAT64) | 0;
    for (let i = 0; i < this.length && offset + i < view.length; i++) {
      yield view[offset + i];
    }
  }

  public [Symbol.dispose](): void {
    this.free();
  }

  /** Gets the value at given index. */
  public at(index: number): number | undefined {
    if (index < 0 || index >= this.length) { return; }
    return memoryManager.view[(this.byteOffset / BYTES_PER_FLOAT64 + index) | 0];
  }

  /** Sets the value at given index. */
  public setAt(index: number, value: number) {
    if (index < 0 || index >= this.length) { return; }
    memoryManager.view[(this.byteOffset / BYTES_PER_FLOAT64 + index) | 0] = value;
  }

  /** Copies a managed array to this. */
  public copy(
    from: ManagedFloat64Array, dstOffset = 0, srcOffset = 0,
    length = Math.min(from.length - srcOffset, this.length - dstOffset)
  ) {
    const start = (from.byteOffset / BYTES_PER_FLOAT64 + srcOffset) | 0;
    memoryManager.view.copyWithin((this.byteOffset / BYTES_PER_FLOAT64 + dstOffset) | 0, start, start + length);
  }

  /** Copies an array to this. */
  public set(array: ArrayLike<number>, offset = 0) {
    memoryManager.view.set(array, (this.byteOffset / BYTES_PER_FLOAT64 + offset) | 0);
  }

  public free(): void {
    if (this.byteOffset > 0) {
      memoryManager.free(this.byteOffset, this.length);
      unregister(this);
      this.byteOffset = -Infinity;
    }
  }

  public get buffer(): ArrayBufferLike {
    return memoryManager.buffer;
  }

  public get byteLength(): number {
    return this.length * BYTES_PER_FLOAT64;
  }

  public get valid(): boolean {
    return this.byteOffset >= 0;
  }

  public abstract readonly length: N;
}
