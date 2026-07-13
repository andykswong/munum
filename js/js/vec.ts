import type { Vec } from '../types.ts';
import { add, dot, lerp, mul, normalize, scale, sub } from './helpers.ts';
import type { Mat2, Mat3, Mat4 } from './mat.ts';
import { ManagedTypedArray, memoryManager } from './memory.ts';
import type { MemoryManager, TypedArray, TypedArrayPointer, TypedArrayViewProvider } from './memory.ts';

const TEMP = Array(4);

/** A 2D vector. */
export class Vec2<V extends TypedArray = Float64Array> extends ManagedTypedArray<2, V> implements Vec<2> {
  public constructor(x = 0, y = 0, manager: MemoryManager<V> = memoryManager as MemoryManager<V>) {
    super(manager.allocate(2));
    this.set([x, y]);
  }

  /** Wraps an existing memory region as a borrowed (non-owning) Vec2. */
  public static view<W extends TypedArray = Float64Array>(
    source: TypedArrayPointer<W> | TypedArrayViewProvider<W>, byteOffset?: number,
  ): Vec2<W> {
    return ManagedTypedArray.viewAs(Vec2, 2, source, byteOffset);
  }

  public override get length(): 2 {
    return 2;
  }

  public add(rhs: Vec2<TypedArray>): this {
    add(this, rhs);
    return this;
  }

  public sub(rhs: Vec2<TypedArray>): this {
    sub(this, rhs);
    return this;
  }

  public mul(m: Mat2<TypedArray>): this {
    mul(m, this, 2, true);
    return this;
  }

  /** Premultiplies 3x3 matrix to this. */
  public mulMat3(m: Mat3<TypedArray>): this {
    const mv = m.view;
    const tv = this.view;
    const left = m.index;
    const right = this.index;

    for (let i = 0; i < 2; ++i) {
      let f = 0;
      for (let j = 0; j < 2; ++j) {
        f += mv[left + j * 3 + i] * tv[right + j];
      }
      f += mv[left + 2 * 3 + i];
      TEMP[i] = f;
    }

    tv[right + 0] = TEMP[0];
    tv[right + 1] = TEMP[1];
    return this;
  }

  public dot(rhs: Vec2<TypedArray>): number {
    return dot(this, rhs);
  }

  public lerp(rhs: Vec2<TypedArray>, t: number): this {
    lerp(this, rhs, t);
    return this;
  }

  public scale(factor: number): this {
    scale(this, factor);
    return this;
  }

  public normalize(): boolean {
    return normalize(this);
  }
}

/** A 3D vector. */
export class Vec3<V extends TypedArray = Float64Array> extends ManagedTypedArray<3, V> implements Vec<3> {
  public constructor(x = 0, y = 0, z = 0, manager: MemoryManager<V> = memoryManager as MemoryManager<V>) {
    super(manager.allocate(3));
    this.set([x, y, z]);
  }

  /** Wraps an existing memory region as a borrowed (non-owning) Vec3. */
  public static view<W extends TypedArray = Float64Array>(
    source: TypedArrayPointer<W> | TypedArrayViewProvider<W>, byteOffset?: number,
  ): Vec3<W> {
    return ManagedTypedArray.viewAs(Vec3, 3, source, byteOffset);
  }

  public override get length(): 3 {
    return 3;
  }

  public add(rhs: Vec3<TypedArray>): this {
    add(this, rhs);
    return this;
  }

  public sub(rhs: Vec3<TypedArray>): this {
    sub(this, rhs);
    return this;
  }

  public mul(m: Mat3<TypedArray>): this {
    mul(m, this, 3, true);
    return this;
  }

  /** Premultiplies 4x4 matrix to this. */
  public mulMat4(m: Mat4<TypedArray>): this {
    const mv = m.view;
    const tv = this.view;
    const left = m.index;
    const right = this.index;

    for (let i = 0; i < 3; ++i) {
      let f = 0;
      for (let j = 0; j < 3; ++j) {
        f += mv[left + j * 4 + i] * tv[right + j];
      }
      f += mv[left + 3 * 4 + i];
      TEMP[i] = f;
    }

    tv[right + 0] = TEMP[0];
    tv[right + 1] = TEMP[1];
    tv[right + 2] = TEMP[2];
    return this;
  }

  /** Assign cross product of this with RHS to this. */
  public cross(rhs: Vec3<TypedArray>): this {
    const lv = this.view;
    const rv = rhs.view;
    const left = this.index;
    const right = rhs.index;
    const y = lv[left + 2] * rv[right + 0] - rv[right + 2] * lv[left + 0];
    const z = lv[left + 0] * rv[right + 1] - rv[right + 0] * lv[left + 1];
    lv[left + 0] = lv[left + 1] * rv[right + 2] - rv[right + 1] * lv[left + 2];
    lv[left + 1] = y;
    lv[left + 2] = z;
    return this;
  }

  public dot(rhs: Vec3<TypedArray>): number {
    return dot(this, rhs);
  }

  public lerp(rhs: Vec3<TypedArray>, t: number): this {
    lerp(this, rhs, t);
    return this;
  }

  public scale(factor: number): this {
    scale(this, factor);
    return this;
  }

  public normalize(): boolean {
    return normalize(this);
  }
}

/** A 4D vector. */
export class Vec4<V extends TypedArray = Float64Array> extends ManagedTypedArray<4, V> implements Vec<4> {
  public constructor(x = 0, y = 0, z = 0, w = 0, manager: MemoryManager<V> = memoryManager as MemoryManager<V>) {
    super(manager.allocate(4));
    this.set([x, y, z, w]);
  }

  /** Wraps an existing memory region as a borrowed (non-owning) Vec4. */
  public static view<W extends TypedArray = Float64Array>(
    source: TypedArrayPointer<W> | TypedArrayViewProvider<W>, byteOffset?: number,
  ): Vec4<W> {
    return ManagedTypedArray.viewAs(Vec4, 4, source, byteOffset);
  }

  public override get length(): 4 {
    return 4;
  }

  public add(rhs: Vec4<TypedArray>): this {
    add(this, rhs);
    return this;
  }

  public sub(rhs: Vec4<TypedArray>): this {
    sub(this, rhs);
    return this;
  }

  public mul(m: Mat4<TypedArray>): this {
    mul(m, this, 4, true);
    return this;
  }

  public dot(rhs: Vec4<TypedArray>): number {
    return dot(this, rhs);
  }

  public lerp(rhs: Vec4<TypedArray>, t: number): this {
    lerp(this, rhs, t);
    return this;
  }

  public scale(factor: number): this {
    scale(this, factor);
    return this;
  }

  public normalize(): boolean {
    return normalize(this);
  }
}
