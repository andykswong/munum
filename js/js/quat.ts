import { EPSILON, fequal } from '../scalar.ts';
import type { IQuat } from '../types.ts';
import { dot, normalize } from './helpers.ts';
import { ManagedTypedArray, memoryManager } from './memory.ts';
import type { MemoryManager, TypedArray, TypedArrayPointer, TypedArrayViewProvider } from './memory.ts';
import { Vec3 } from './vec.ts';

const ID = [0, 0, 0, 1];

/** A quaternion. */
export class Quat<V extends TypedArray = Float64Array> extends ManagedTypedArray<4, V> implements IQuat {
  /** Return an identity Quat. */
  public static identity<W extends TypedArray = Float64Array>(
    manager: MemoryManager<W> = memoryManager as MemoryManager<W>,
  ): Quat<W> {
    const q = new Quat(manager.allocate(4));
    q.set(ID);
    return q;
  }

  /** Wraps an existing memory region as a borrowed (non-owning) Quat. */
  public static view<W extends TypedArray = Float64Array>(
    source: TypedArrayPointer<W> | TypedArrayViewProvider<W>, byteOffset?: number,
  ): Quat<W> {
    return ManagedTypedArray.viewAs(Quat, 4, source, byteOffset);
  }

  /** Return a Quat from unit vectors. */
  public static fromUnitVecs<W extends TypedArray = Float64Array>(
    from: Vec3<TypedArray>, to: Vec3<TypedArray>,
    manager: MemoryManager<W> = memoryManager as MemoryManager<W>,
  ): Quat<W> {
    const dotFT = from.dot(to);

    if (fequal(dotFT, -1)) { // vectors are in parallel but opposite direction
      // use arbitrary perpendicular vector = (0, z, -y)
      const [, y, z] = from;
      using v = new Vec3(0, z, -y);
      return Quat.fromAxisAngle(v, Math.PI, manager);
    } else if (fequal(dotFT, 1)) { // vectors are in same direction
      return Quat.identity(manager);
    }

    using v = new Vec3();
    v.copy(from, 0, 0, 3);
    v.cross(to);

    const q = new Quat(manager.allocate(4));
    q.set([...v, 1 + dotFT]);
    q.normalize();
    return q;
  }

  /** Return a Quat from axis and angle */
  public static fromAxisAngle<W extends TypedArray = Float64Array>(
    axis: Vec3<TypedArray>, angle: number,
    manager: MemoryManager<W> = memoryManager as MemoryManager<W>,
  ): Quat<W> {
    const sinHalf = Math.sin(angle / 2);
    // Read axis after allocating, in case allocation grows and detaches the view.
    const q = new Quat(manager.allocate(4));
    const view = axis.view;
    const p = axis.index;
    q.set([view[p + 0] * sinHalf, view[p + 1] * sinHalf, view[p + 2] * sinHalf, Math.cos(angle / 2)]);
    return q;
  }

  /** Return a Quat from rotation around x-axis. */
  public static fromAngleX<W extends TypedArray = Float64Array>(
    angle: number, manager: MemoryManager<W> = memoryManager as MemoryManager<W>,
  ): Quat<W> {
    const q = new Quat(manager.allocate(4));
    q.set([Math.sin(angle / 2), 0, 0, Math.cos(angle / 2)]);
    return q;
  }

  /** Return a Quat from rotation around y-axis. */
  public static fromAngleY<W extends TypedArray = Float64Array>(
    angle: number, manager: MemoryManager<W> = memoryManager as MemoryManager<W>,
  ): Quat<W> {
    const q = new Quat(manager.allocate(4));
    q.set([0, Math.sin(angle / 2), 0, Math.cos(angle / 2)]);
    return q;
  }

  /** Return a Quat from rotation around z-axis. */
  public static fromAngleZ<W extends TypedArray = Float64Array>(
    angle: number, manager: MemoryManager<W> = memoryManager as MemoryManager<W>,
  ): Quat<W> {
    const q = new Quat(manager.allocate(4));
    q.set([0, 0, Math.sin(angle / 2), Math.cos(angle / 2)]);
    return q;
  }

  private constructor(ptr: TypedArrayPointer<V>) {
    super(ptr);
  }

  public override get length(): 4 {
    return 4;
  }

  public mul(rhs: Quat<TypedArray>): this {
    const lv = this.view, rv = rhs.view;
    const left = this.index;
    const right = rhs.index;
    const x = lv[left + 3] * rv[right + 0] + lv[left + 0] * rv[right + 3]
      + lv[left + 1] * rv[right + 2] - lv[left + 2] * rv[right + 1];
    const y = lv[left + 3] * rv[right + 1] + lv[left + 1] * rv[right + 3]
      + lv[left + 2] * rv[right + 0] - lv[left + 0] * rv[right + 2];
    const z = lv[left + 3] * rv[right + 2] + lv[left + 2] * rv[right + 3]
      + lv[left + 0] * rv[right + 1] - lv[left + 1] * rv[right + 0];
    const w = lv[left + 3] * rv[right + 3] - lv[left + 0] * rv[right + 0]
      - lv[left + 1] * rv[right + 1] - lv[left + 2] * rv[right + 2];

    lv[left + 0] = x;
    lv[left + 1] = y;
    lv[left + 2] = z;
    lv[left + 3] = w;

    return this;
  }

  public rotate(v: Vec3<TypedArray>): Vec3<TypedArray> {
    using q1 = new Quat(memoryManager.allocate(4));
    using q2 = new Quat(memoryManager.allocate(4));

    // formula v' = q * v * q^-1
    q1.copy(this, 0, 0, 4);
    q2.copy(v, 0, 0, 3);
    q2.setAt(3, 0);
    q1.mul(q2);
    q2.copy(this, 0, 0, 4);
    q2.invert();
    q1.mul(q2);
    v.copy(q1, 0, 0, 3);

    return v;
  }

  public dot(rhs: Quat<TypedArray>): number {
    return dot(this, rhs);
  }

  public lerp(rhs: Quat<TypedArray>, t: number): this {
    const lv = this.view, rv = rhs.view;
    const left = this.index;
    const right = rhs.index;
    const cosTheta = dot(this, rhs); // calculate cosine from dot product
    const magB = (cosTheta < 0) ? -1 : 1;

    for (let i = 0; i < this.length; ++i) {
      lv[left + i] = lv[left + i] * (1 - t) + rv[right + i] * magB * t;
    }
    normalize(this);
    return this;
  }

  public slerp(rhs: Quat<TypedArray>, t: number): this {
    const lv = this.view, rv = rhs.view;
    const left = this.index;
    const right = rhs.index;
    let cosTheta = dot(this, rhs); // calculate cosine from dot product
    let magB = 1;
    // use the shortest path
    if (cosTheta < 0) {
      cosTheta *= -1;
      magB = -1;
    }

    // initialize with linear interpolation
    let scale0 = 1 - t;
    let scale1 = t;

    // use spherical interpolation only if the quaternions are not very close
    if (1 - cosTheta > EPSILON) {
      const theta = Math.acos(cosTheta);
      const sinTheta = Math.sin(theta);
      scale0 = Math.sin((1 - t) * theta) / sinTheta;
      scale1 = Math.sin(t * theta) / sinTheta;
    }
    scale1 *= magB;

    for (let i = 0; i < this.length; ++i) {
      lv[left + i] = lv[left + i] * scale0 + rv[right + i] * scale1;
    }
    return this;
  }

  public normalize(): boolean {
    return normalize(this);
  }

  public invert(): boolean {
    const sqrLen = dot(this, this);
    if (sqrLen === 0) { return false; }

    const left = this.index;
    const view = this.view;

    for (let i = 0; i < 3; ++i) {
      view[left + i] = -view[left + i] / sqrLen;
    }
    view[left + 3] /= sqrLen;
    return true;
  }
}
