import { free, memory } from '../../wasm/index.js';

const BYTES_PER_FLOAT64 = 8;

const registry = global.FinalizationRegistry &&
  new FinalizationRegistry(([ptr, size]: [number, number]) => free(ptr, size));

function register(arr: ManagedBufferView): void {
  registry?.register(arr, [arr.byteOffset, arr.length], arr);
}

function unregister(arr: ManagedBufferView): void {
  registry?.unregister(arr);
}

let view = new Float64Array(memory.buffer);
export function getMemoryView(): Float64Array {
  if (view.buffer !== memory.buffer) {
    view = new Float64Array(memory.buffer);
  }
  return view;
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
    const view = getMemoryView();
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
    return getMemoryView().at((this.byteOffset / BYTES_PER_FLOAT64 + index) | 0);
  }

  /** Copies a managed array to this. */
  public copy(from: ManagedFloat64Array, offset = 0, length = Math.min(from.length, this.length - offset)) {
    const start = (from.byteOffset / BYTES_PER_FLOAT64) | 0;
    getMemoryView().copyWithin((this.byteOffset / BYTES_PER_FLOAT64 + offset) | 0, start, start + length);
  }

  /** Copies an array to this. */
  public set(array: ArrayLike<number>, offset = 0) {
    getMemoryView().set(array, (this.byteOffset / BYTES_PER_FLOAT64 + offset) | 0);
  }

  public free(): void {
    if (this.byteOffset > 0) {
      free(this.byteOffset, this.length);
      unregister(this);
      this.byteOffset = -Infinity;
    }
  }

  public get buffer(): ArrayBufferLike {
    return memory.buffer;
  }

  public get byteLength(): number {
    return this.length * BYTES_PER_FLOAT64;
  }

  public get valid(): boolean {
    return this.byteOffset >= 0;
  }

  public abstract readonly length: N;
}
