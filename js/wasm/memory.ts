import { create, free, memory } from '../../wasm/index.js';

const registry = global.FinalizationRegistry &&
  new FinalizationRegistry(([ptr, size]: [number, number]) => free(ptr, size));

function register(arr: Float64Array): void {
  if (arr.buffer === memory.buffer) {
    registry?.register(arr, [arr.byteOffset, arr.length], arr);
  }
}

function unregister(arr: Float64Array): void {
  registry?.unregister(arr);
}

/** A TypedArray that requires explicit memory management. */
export interface ManagedArray<N extends number = number> extends Disposable {
  /** Whether the array is still valid. */
  readonly valid: boolean;

  /** Underlying buffer. */
  readonly buffer: ArrayBufferLike;

  /** Offset into the buffer. */
  readonly byteOffset: number;

  /** The length of the array. */
  readonly length: N;

  /** Frees the array. */
  free(): void;
}

/** A managed Float64Array. */
export class ManagedFloat64Array<N extends number = number>
  extends Float64Array implements ManagedArray<N> {

  public override readonly length!: N;
  public valid = true;

  public constructor(length: N, ptr = create(length)) {
    super(memory.buffer, ptr, length);
    register(this);
  }

  public override [Symbol.dispose](): void {
    this.free();
  }

  public free(): void {
    if (this.valid) {
      free(this.byteOffset, this.length);
      this.valid = false;
      unregister(this);
    }
  }
}
