/** @deprecated f64-specific; element size now comes from the view's `BYTES_PER_ELEMENT`. */
export const BYTES_PER_FLOAT64 = 8;

/** Element-storage typed arrays munum supports. */
export type TypedArray = Float32Array | Float64Array;

/** Constructor for a {@link TypedArray}, used by managers to build views generically. */
export type TypedArrayConstructor<V extends TypedArray = Float64Array> = {
  new (buffer: ArrayBufferLike): V;
  readonly BYTES_PER_ELEMENT: number;
};

/**
 * Provides a live typed-array view over some backing memory.
 * The view is a getter so it can be re-derived after `WebAssembly.Memory.grow()`
 * detaches the previous buffer. `buffer` is always `view.buffer`.
 */
export interface TypedArrayViewProvider<V extends TypedArray = Float64Array> {
  /** The active typed-array memory view. */
  readonly view: V;
}

/**
 * A disposable handle to a region of typed-array memory — everything a
 * {@link ManagedTypedArray} needs to read/write and to release its storage.
 */
export interface TypedArrayPointer<V extends TypedArray = Float64Array>
  extends TypedArrayViewProvider<V>, Disposable {
  /** Byte offset of the region. Negative once freed (also encodes validity). */
  readonly byteOffset: number;

  /** Length of the region in number of elements. */
  readonly length: number;

  /** Whether the region is still valid (not freed). */
  readonly valid: boolean;

  /** Releases the region. Idempotent. No-op for borrowed (external) pointers. */
  free(): void;
}

/**
 * A linear memory manager that allocates element regions and produces owning
 * {@link TypedArrayPointer}s. Owns an (optional) FinalizationRegistry so
 * dropped pointers are reclaimed automatically.
 */
export interface MemoryManager<V extends TypedArray = Float64Array>
  extends TypedArrayViewProvider<V> {
  /** The active memory buffer (== `view.buffer`). Retained for API compatibility. */
  readonly buffer: ArrayBufferLike;

  /** Allocates `size` elements and returns an owning, GC-registered pointer. */
  allocate(size: number): TypedArrayPointer<V>;

  /** Releases a pointer previously produced by {@link allocate}. Idempotent. */
  free(ptr: TypedArrayPointer<V>): void;
}

const FREED = -Infinity;

/** An owning pointer produced by {@link MemoryManager.allocate}. */
class ManagedPointer<V extends TypedArray> implements TypedArrayPointer<V> {
  private readonly manager: MemoryManager<V>;
  public byteOffset: number;
  public readonly length: number;

  public constructor(manager: MemoryManager<V>, byteOffset: number, length: number) {
    this.manager = manager;
    this.byteOffset = byteOffset;
    this.length = length;
  }

  public get view(): V {
    return this.manager.view;
  }

  public get valid(): boolean {
    return this.byteOffset >= 0;
  }

  public free(): void {
    if (this.byteOffset >= 0) {
      this.manager.free(this);
      this.byteOffset = FREED;
    }
  }

  public [Symbol.dispose](): void {
    this.free();
  }
}

/**
 * A borrowed pointer over existing memory. Disposing it does NOT free the
 * underlying storage — the region is owned by someone else (another allocation,
 * or an external buffer such as a glTF accessor).
 */
class ExternalPointer<V extends TypedArray> implements TypedArrayPointer<V> {
  private readonly provider: TypedArrayViewProvider<V>;
  public readonly byteOffset: number;
  public readonly length: number;

  public constructor(provider: TypedArrayViewProvider<V>, byteOffset: number, length: number) {
    this.provider = provider;
    this.byteOffset = byteOffset;
    this.length = length;
  }

  public get view(): V {
    return this.provider.view;
  }

  public get valid(): boolean {
    return true;
  }

  public free(): void {
    // borrowed: intentional no-op
  }

  public [Symbol.dispose](): void {
    // borrowed: intentional no-op
  }
}

/** Wraps a raw {@link Float64Array} (e.g. a glTF buffer) as a view provider. */
export function float64View(array: Float64Array): TypedArrayViewProvider<Float64Array> {
  return { view: array };
}

/**
 * Creates a borrowed {@link TypedArrayPointer} over an existing region.
 * The pointer's `free()`/dispose is a no-op; the caller retains ownership.
 * @param source a live view provider (a MemoryManager, another pointer, or `float64View(array)`)
 * @param byteOffset byte offset into the provider's view (default 0)
 * @param length length in elements
 */
export function externalPointer<V extends TypedArray = Float64Array>(
  source: TypedArrayViewProvider<V>,
  byteOffset: number,
  length: number,
): TypedArrayPointer<V> {
  return new ExternalPointer(source, byteOffset, length);
}

/**
 * Base class for {@link MemoryManager}s. Implements `allocate`/`free` plus the
 * embedded {@link FinalizationRegistry} that reclaims dropped pointers. Concrete
 * managers implement {@link createRaw}/{@link freeRaw} and the `view` getter.
 */
export abstract class AbstractMemoryManager<V extends TypedArray = Float64Array>
implements MemoryManager<V> {
  private readonly registry?: FinalizationRegistry<[number, number]>;

  /**
   * @param useFinalizationRegistry when true (default) dropped pointers are
   *   reclaimed automatically via a FinalizationRegistry (when available).
   */
  public constructor(useFinalizationRegistry = true) {
    if (useFinalizationRegistry && globalThis.FinalizationRegistry) {
      this.registry = new FinalizationRegistry(
        ([byteOffset, length]: [number, number]) => this.freeRaw(byteOffset, length),
      );
    }
  }

  public abstract get view(): V;

  public get buffer(): ArrayBufferLike {
    return this.view.buffer;
  }

  /** Allocates `size` elements and returns its byte offset. */
  protected abstract createRaw(size: number): number;

  /** Frees the region at `byteOffset` of `size` elements. */
  protected abstract freeRaw(byteOffset: number, size: number): void;

  public allocate(size: number): TypedArrayPointer<V> {
    return this.wrap(this.createRaw(size), size);
  }

  /**
   * Wraps an already-allocated raw offset as an owning, GC-registered pointer.
   * Used by {@link allocate} and by the wasm binding, whose math ops allocate
   * their result region inside wasm memory and hand back the raw offset.
   */
  public wrap(byteOffset: number, size: number): TypedArrayPointer<V> {
    const ptr = new ManagedPointer<V>(this, byteOffset, size);
    this.registry?.register(ptr, [byteOffset, size], ptr);
    return ptr;
  }

  public free(ptr: TypedArrayPointer<V>): void {
    if (ptr.byteOffset >= 0) {
      this.registry?.unregister(ptr);
      this.freeRaw(ptr.byteOffset, ptr.length);
    }
  }
}

/** A wrapped typed-array-backed value that requires explicit memory management. */
export abstract class ManagedTypedArray<
  N extends number = number,
  V extends TypedArray = Float64Array,
> implements TypedArrayViewProvider<V>, Disposable, Iterable<number> {

  /** The pointer backing this value (owning or borrowed). */
  public readonly ptr: TypedArrayPointer<V>;

  /** @param ptr the pointer backing this value (owning or borrowed). */
  public constructor(ptr: TypedArrayPointer<V>) {
    this.ptr = ptr;
  }

  public abstract readonly length: N;

  /**
   * Single-sourced borrow helper. Wraps existing memory as a NON-owning instance
   * of the concrete class `ctor`: its `free()`/dispose is always a no-op and the
   * underlying storage is never freed through it. Subclasses expose a thin typed
   * `static view(...)` that forwards here.
   * @param ctor the concrete subclass constructor (used only for its prototype)
   * @param size length of the region in elements
   * @param source a pointer, or a view provider (a MemoryManager, or `float64View(array)`)
   * @param byteOffset byte offset into the region; defaults to a passed pointer's own offset
   */
  protected static viewAs<T extends ManagedTypedArray, W extends TypedArray = Float64Array>(
    ctor: { readonly prototype: T },
    size: number,
    source: TypedArrayPointer<W> | TypedArrayViewProvider<W>,
    byteOffset?: number,
  ): T {
    // Always borrow: even when given a pointer, wrap it in a non-owning
    // ExternalPointer so disposing the view never frees someone else's storage.
    const offset = byteOffset ?? ('byteOffset' in source ? (source as TypedArrayPointer<W>).byteOffset : 0);
    const instance = Object.create(ctor.prototype) as T;
    // `as unknown as`: T defaults to ManagedTypedArray<_, Float64Array>, whose `ptr` field
    // type does not overlap TypedArrayPointer<W> for an arbitrary W, so a single `as` here
    // fails tsc with TS2352. This seam is inherently untyped (Object.create bypasses the ctor).
    (instance as unknown as { ptr: TypedArrayPointer<W> }).ptr = externalPointer(source, offset, size);
    return instance;
  }

  /** Element index of this value's first element within its view. */
  public get index(): number {
    return (this.ptr.byteOffset / this.view.BYTES_PER_ELEMENT) | 0;
  }

  public get byteOffset(): number {
    return this.ptr.byteOffset;
  }

  public get view(): V {
    return this.ptr.view;
  }

  public get buffer(): ArrayBufferLike {
    return this.ptr.view.buffer;
  }

  public get byteLength(): number {
    return this.length * this.view.BYTES_PER_ELEMENT;
  }

  public get valid(): boolean {
    return this.ptr.valid;
  }

  public *[Symbol.iterator](): Iterator<number> {
    if (!this.valid) { return; }
    const view = this.view;
    const offset = this.index;
    for (let i = 0; i < this.length && offset + i < view.length; i++) {
      yield view[offset + i];
    }
  }

  /** Gets the value at given index. */
  public at(index: number): number | undefined {
    if (index < 0 || index >= this.length) { return; }
    return this.view[this.index + index];
  }

  /** Sets the value at given index. */
  public setAt(index: number, value: number): void {
    if (index < 0 || index >= this.length) { return; }
    this.view[this.index + index] = value;
  }

  /**
   * Copies a managed array to this. Reads `from` from ITS OWN view and writes into
   * this value's view, so the operands may live in different managers / element
   * types (e.g. copying an f64 source into an f32 destination performs the
   * numeric conversion). Assumes non-overlapping regions (true for all munum uses).
   */
  public copy(
    from: ManagedTypedArray<number, TypedArray>, dstOffset = 0, srcOffset = 0,
    length = Math.min(from.length - srcOffset, this.length - dstOffset),
  ): void {
    const dst = this.view;
    const src = from.view;
    const d = this.index + dstOffset;
    const s = from.index + srcOffset;
    for (let i = 0; i < length; ++i) {
      dst[d + i] = src[s + i];
    }
  }

  /** Copies an array to this. */
  public set(array: ArrayLike<number>, offset = 0): void {
    this.view.set(array, this.index + offset);
  }

  /** Frees the backing pointer (no-op if borrowed). */
  public free(): void {
    this.ptr.free();
  }

  public [Symbol.dispose](): void {
    this.ptr.free();
  }
}

/**
 * @deprecated Use {@link TypedArrayViewProvider} (defaults to `Float64Array`).
 */
export type Float64ArrayViewProvider = TypedArrayViewProvider<Float64Array>;

/**
 * @deprecated Use {@link TypedArrayPointer} (defaults to `Float64Array`).
 */
export type Float64ArrayPointer = TypedArrayPointer<Float64Array>;

/**
 * @deprecated Use {@link ManagedTypedArray} (defaults to `Float64Array`).
 * Kept as a real subclass so existing subclasses (e.g. the wasm binding) that
 * `extends ManagedFloat64Array<N>` and call its inherited `static viewAs` keep working.
 */
export abstract class ManagedFloat64Array<N extends number = number>
  extends ManagedTypedArray<N, Float64Array> {}
