import { Vec } from '../types.ts';
import { add, dot, lerp, mul, normalize, scale, sub } from './helpers.ts';
import { Mat2, Mat3, Mat4 } from './mat.ts';
import { BYTES_PER_FLOAT64, ManagedFloat64Array, memoryManager } from './memory.ts';

const TEMP = Array(4);

/** A 2D vector. */
export class Vec2 extends ManagedFloat64Array<2> implements Vec<2> {
  public constructor(x = 0, y = 0) {
    super(memoryManager.create(2));
    this.set([x, y]);
  }

  public override get length(): 2 {
    return 2;
  }

  public add(rhs: Vec2): this {
    add(this, rhs);
    return this;
  }

  public sub(rhs: Vec2): this {
    sub(this, rhs);
    return this;
  }

  public mul(m: Mat2): this {
    mul(m, this, 2, true);
    return this;
  }

  /** Premultiplies 3x3 matrix to this. */
  public mulMat3(m: Mat3): this {
    const left = (m.byteOffset / BYTES_PER_FLOAT64) | 0;
    const right = (this.byteOffset / BYTES_PER_FLOAT64) | 0;
    const view = memoryManager.view;

    for (let i = 0; i < 2; ++i) {
      let f = 0;
      for (let j = 0; j < 2; ++j) {
        f += view[left + j * 3 + i] * view[right + j];
      }
      f += view[left + 2 * 3 + i];
      TEMP[i] = f;
    }

    view[right + 0] = TEMP[0];
    view[right + 1] = TEMP[1];
    return this;
  }

  public dot(rhs: Vec2): number {
    return dot(this, rhs);
  }

  public lerp(rhs: Vec2, t: number): this {
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
export class Vec3 extends ManagedFloat64Array<3> implements Vec<3> {
  public constructor(x = 0, y = 0, z = 0) {
    super(memoryManager.create(3));
    this.set([x, y, z]);
  }

  public override get length(): 3 {
    return 3;
  }

  public add(rhs: Vec3): this {
    add(this, rhs);
    return this;
  }

  public sub(rhs: Vec3): this {
    sub(this, rhs);
    return this;
  }

  public mul(m: Mat3): this {
    mul(m, this, 3, true);
    return this;
  }

  /** Premultiplies 4x4 matrix to this. */
  public mulMat4(m: Mat4): this {
    const left = (m.byteOffset / BYTES_PER_FLOAT64) | 0;
    const right = (this.byteOffset / BYTES_PER_FLOAT64) | 0;
    const view = memoryManager.view;

    for (let i = 0; i < 3; ++i) {
      let f = 0;
      for (let j = 0; j < 3; ++j) {
        f += view[left + j * 4 + i] * view[right + j];
      }
      f += view[left + 3 * 4 + i];
      TEMP[i] = f;
    }

    view[right + 0] = TEMP[0];
    view[right + 1] = TEMP[1];
    view[right + 2] = TEMP[2];
    return this;
  }

  /** Assign cross product of this with RHS to this. */
  public cross(rhs: Vec3): this {
    const left = (this.byteOffset / BYTES_PER_FLOAT64) | 0;
    const right = (rhs.byteOffset / BYTES_PER_FLOAT64) | 0;
    const view = memoryManager.view;
    const y = view[left + 2] * view[right + 0] - view[right + 2] * view[left + 0];
    const z = view[left + 0] * view[right + 1] - view[right + 0] * view[left + 1];
    view[left + 0] = view[left + 1] * view[right + 2] - view[right + 1] * view[left + 2];
    view[left + 1] = y;
    view[left + 2] = z;
    return this;
  }

  public dot(rhs: Vec3): number {
    return dot(this, rhs);
  }

  public lerp(rhs: Vec3, t: number): this {
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
export class Vec4 extends ManagedFloat64Array<4> implements Vec<4> {
  public constructor(x = 0, y = 0, z = 0, w = 0) {
    super(memoryManager.create(4));
    this.set([x, y, z, w]);
  }

  public override get length(): 4 {
    return 4;
  }

  public add(rhs: Vec4): this {
    add(this, rhs);
    return this;
  }

  public sub(rhs: Vec4): this {
    sub(this, rhs);
    return this;
  }

  public mul(m: Mat4): this {
    mul(m, this, 4, true);
    return this;
  }

  public dot(rhs: Vec4): number {
    return dot(this, rhs);
  }

  public lerp(rhs: Vec4, t: number): this {
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
