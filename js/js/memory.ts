import {
  AbstractMemoryManager,
  BYTES_PER_FLOAT64,
  ManagedFloat64Array,
  ManagedTypedArray,
  externalPointer,
  float64View,
} from '../memory.ts';
import type {
  Float64ArrayPointer,
  Float64ArrayViewProvider,
  MemoryManager,
  TypedArray,
  TypedArrayConstructor,
  TypedArrayPointer,
  TypedArrayViewProvider,
} from '../memory.ts';

/** Free-list allocator over a growable WebAssembly linear memory, generic over element type. */
export class JsMemoryManager<V extends TypedArray = Float64Array> extends AbstractMemoryManager<V> {
  private readonly memory = new WebAssembly.Memory({ initial: 0 });
  private readonly freeList: Record<number, number> = {};
  // NOTE: `Ctor` is a declared field + body assignment, NOT a TS parameter property
  // (`private readonly Ctor` in the ctor signature). Parameter properties are banned by
  // this repo's tsconfig `erasableSyntaxOnly: true` and would fail with TS1294.
  private readonly Ctor: TypedArrayConstructor<V>;
  private cachedView: V;
  private next = 0;

  /** @param Ctor the typed-array constructor selecting the element type (default `Float64Array`). */
  public constructor(Ctor: TypedArrayConstructor<V> = Float64Array as unknown as TypedArrayConstructor<V>) {
    super();
    this.Ctor = Ctor;
    this.cachedView = new Ctor(this.memory.buffer);
  }

  public override get view(): V {
    if (this.cachedView.buffer !== this.memory.buffer) {
      this.cachedView = new this.Ctor(this.memory.buffer);
    }
    return this.cachedView;
  }

  protected override createRaw(size: number): number {
    const stride = this.Ctor.BYTES_PER_ELEMENT;
    if (this.freeList[size]) {
      const offset = this.freeList[size] - 1;
      this.freeList[size] = this.view[offset];
      return offset * stride;
    }

    if (this.next + size > this.view.length) {
      this.memory.grow(1);
      this.cachedView = new this.Ctor(this.memory.buffer);
    }

    const offset = this.next;
    this.next += size;
    return offset * stride;
  }

  protected override freeRaw(byteOffset: number, size: number): void {
    const offset = Math.ceil(byteOffset / this.Ctor.BYTES_PER_ELEMENT);
    if (offset + size > this.view.length) {
      return;
    }
    this.view[offset] = this.freeList[size] || 0;
    this.freeList[size] = offset + 1;
  }
}

// The singletons are annotated with the INTERFACE type `MemoryManager<...>` (not the
// concrete `JsMemoryManager<...>`). This is load-bearing: the Vec/Mat/Quat default args
// below use `memoryManager as MemoryManager<V>`, and a plain single `as` compiles ONLY
// when the source is already the interface type. If these were left as the concrete class,
// tsc emits TS2352 ("neither type sufficiently overlaps") at ~14 sites.
/** The default (f64) {@link MemoryManager} for the pure-JS implementation. */
export const memoryManager: MemoryManager = new JsMemoryManager();

/** A ready-made `Float32Array`-backed {@link MemoryManager} for GPU-friendly (f32) storage. */
export const float32Manager: MemoryManager<Float32Array> = new JsMemoryManager(Float32Array);

/** Wraps a raw {@link Float32Array} (e.g. a GPU/glTF buffer) as a view provider. */
export function float32View(array: Float32Array): TypedArrayViewProvider<Float32Array> {
  return { view: array };
}

export type {
  Float64ArrayPointer,
  Float64ArrayViewProvider,
  MemoryManager,
  TypedArray,
  TypedArrayConstructor,
  TypedArrayPointer,
  TypedArrayViewProvider,
};
export {
  AbstractMemoryManager,
  BYTES_PER_FLOAT64,
  ManagedFloat64Array,
  ManagedTypedArray,
  externalPointer,
  float64View,
};
