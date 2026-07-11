export const BYTES_PER_FLOAT64 = 8;

/**
 * Provides a live {@link Float64Array} view over some backing memory.
 * The view is a getter so it can be re-derived after `WebAssembly.Memory.grow()`
 * detaches the previous buffer. `buffer` is always `view.buffer`.
 */
export interface Float64ArrayViewProvider {
  /** The active float64 memory view. */
  readonly view: Float64Array;
}

/**
 * A disposable handle to a region of float64 memory — everything a
 * {@link ManagedFloat64Array} needs to read/write and to release its storage.
 */
export interface Float64ArrayPointer extends Float64ArrayViewProvider, Disposable {
  /** Byte offset of the region. Negative once freed (also encodes validity). */
  readonly byteOffset: number;

  /** Length of the region in number of float64. */
  readonly length: number;

  /** Whether the region is still valid (not freed). */
  readonly valid: boolean;

  /** Releases the region. Idempotent. No-op for borrowed (external) pointers. */
  free(): void;
}

/**
 * A linear memory manager that allocates float64 regions and produces owning
 * {@link Float64ArrayPointer}s. Owns an (optional) FinalizationRegistry so
 * dropped pointers are reclaimed automatically.
 */
export interface MemoryManager extends Float64ArrayViewProvider {
  /** The active memory buffer (== `view.buffer`). Retained for API compatibility. */
  readonly buffer: ArrayBufferLike;

  /** Allocates `size` float64 and returns an owning, GC-registered pointer. */
  allocate(size: number): Float64ArrayPointer;

  /** Releases a pointer previously produced by {@link allocate}. Idempotent. */
  free(ptr: Float64ArrayPointer): void;
}

const FREED = -Infinity;

/** An owning pointer produced by {@link MemoryManager.allocate}. */
class ManagedPointer implements Float64ArrayPointer {
  private readonly manager: MemoryManager;
  public byteOffset: number;
  public readonly length: number;

  public constructor(manager: MemoryManager, byteOffset: number, length: number) {
    this.manager = manager;
    this.byteOffset = byteOffset;
    this.length = length;
  }

  public get view(): Float64Array {
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
class ExternalPointer implements Float64ArrayPointer {
  private readonly provider: Float64ArrayViewProvider;
  public readonly byteOffset: number;
  public readonly length: number;

  public constructor(provider: Float64ArrayViewProvider, byteOffset: number, length: number) {
    this.provider = provider;
    this.byteOffset = byteOffset;
    this.length = length;
  }

  public get view(): Float64Array {
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
export function float64View(array: Float64Array): Float64ArrayViewProvider {
  return { view: array };
}

/**
 * Creates a borrowed {@link Float64ArrayPointer} over an existing region.
 * The pointer's `free()`/dispose is a no-op; the caller retains ownership.
 * @param source a live view provider (a MemoryManager, another pointer, or `float64View(array)`)
 * @param byteOffset byte offset into the provider's view (default 0)
 * @param length length in float64
 */
export function externalPointer(
  source: Float64ArrayViewProvider,
  byteOffset: number,
  length: number,
): Float64ArrayPointer {
  return new ExternalPointer(source, byteOffset, length);
}

/**
 * Base class for {@link MemoryManager}s. Implements `allocate`/`free` plus the
 * embedded {@link FinalizationRegistry} that reclaims dropped pointers. Concrete
 * managers implement {@link createRaw}/{@link freeRaw} and the `view` getter.
 */
export abstract class AbstractMemoryManager implements MemoryManager {
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

  public abstract get view(): Float64Array;

  public get buffer(): ArrayBufferLike {
    return this.view.buffer;
  }

  /** Allocates `size` float64 and returns its byte offset. */
  protected abstract createRaw(size: number): number;

  /** Frees the region at `byteOffset` of `size` float64. */
  protected abstract freeRaw(byteOffset: number, size: number): void;

  public allocate(size: number): Float64ArrayPointer {
    return this.wrap(this.createRaw(size), size);
  }

  /**
   * Wraps an already-allocated raw offset as an owning, GC-registered pointer.
   * Used by {@link allocate} and by the wasm binding, whose math ops allocate
   * their result region inside wasm memory and hand back the raw offset.
   */
  public wrap(byteOffset: number, size: number): Float64ArrayPointer {
    const ptr = new ManagedPointer(this, byteOffset, size);
    this.registry?.register(ptr, [byteOffset, size], ptr);
    return ptr;
  }

  public free(ptr: Float64ArrayPointer): void {
    if (ptr.byteOffset >= 0) {
      this.registry?.unregister(ptr);
      this.freeRaw(ptr.byteOffset, ptr.length);
    }
  }
}

/** A wrapped Float64Array-backed value that requires explicit memory management. */
export abstract class ManagedFloat64Array<N extends number = number>
implements Float64ArrayViewProvider, Disposable, Iterable<number> {

  /** The pointer backing this value (owning or borrowed). */
  public readonly ptr: Float64ArrayPointer;

  /** @param ptr the pointer backing this value (owning or borrowed). */
  public constructor(ptr: Float64ArrayPointer) {
    this.ptr = ptr;
  }

  public abstract readonly length: N;

  /**
   * Single-sourced borrow helper. Wraps existing memory as a NON-owning instance
   * of the concrete class `ctor`: its `free()`/dispose is always a no-op and the
   * underlying storage is never freed through it. Subclasses expose a thin typed
   * `static view(...)` that forwards here.
   * @param ctor the concrete subclass constructor (used only for its prototype)
   * @param size length of the region in float64
   * @param source a pointer, or a view provider (a MemoryManager, or `float64View(array)`)
   * @param byteOffset byte offset into the region; defaults to a passed pointer's own offset
   */
  protected static viewAs<T extends ManagedFloat64Array>(
    ctor: { readonly prototype: T },
    size: number,
    source: Float64ArrayPointer | Float64ArrayViewProvider,
    byteOffset?: number,
  ): T {
    // Always borrow: even when given a pointer, wrap it in a non-owning
    // ExternalPointer so disposing the view never frees someone else's storage.
    const offset = byteOffset ?? ('byteOffset' in source ? (source as Float64ArrayPointer).byteOffset : 0);
    const instance = Object.create(ctor.prototype) as T;
    (instance as { ptr: Float64ArrayPointer }).ptr = externalPointer(source, offset, size);
    return instance;
  }

  public get byteOffset(): number {
    return this.ptr.byteOffset;
  }

  public get view(): Float64Array {
    return this.ptr.view;
  }

  public get buffer(): ArrayBufferLike {
    return this.ptr.view.buffer;
  }

  public get byteLength(): number {
    return this.length * BYTES_PER_FLOAT64;
  }

  public get valid(): boolean {
    return this.ptr.valid;
  }

  public *[Symbol.iterator](): Iterator<number> {
    if (!this.valid) { return; }
    const view = this.ptr.view;
    const offset = (this.ptr.byteOffset / BYTES_PER_FLOAT64) | 0;
    for (let i = 0; i < this.length && offset + i < view.length; i++) {
      yield view[offset + i];
    }
  }

  /** Gets the value at given index. */
  public at(index: number): number | undefined {
    if (index < 0 || index >= this.length) { return; }
    return this.ptr.view[(this.ptr.byteOffset / BYTES_PER_FLOAT64 + index) | 0];
  }

  /** Sets the value at given index. */
  public setAt(index: number, value: number): void {
    if (index < 0 || index >= this.length) { return; }
    this.ptr.view[(this.ptr.byteOffset / BYTES_PER_FLOAT64 + index) | 0] = value;
  }

  /** Copies a managed array to this. */
  public copy(
    from: ManagedFloat64Array, dstOffset = 0, srcOffset = 0,
    length = Math.min(from.length - srcOffset, this.length - dstOffset),
  ): void {
    const view = this.ptr.view;
    const start = (from.byteOffset / BYTES_PER_FLOAT64 + srcOffset) | 0;
    view.copyWithin((this.byteOffset / BYTES_PER_FLOAT64 + dstOffset) | 0, start, start + length);
  }

  /** Copies an array to this. */
  public set(array: ArrayLike<number>, offset = 0): void {
    this.ptr.view.set(array, (this.byteOffset / BYTES_PER_FLOAT64 + offset) | 0);
  }

  /** Frees the backing pointer (no-op if borrowed). */
  public free(): void {
    this.ptr.free();
  }

  public [Symbol.dispose](): void {
    this.ptr.free();
  }
}
