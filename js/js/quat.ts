import { EPSILON, fequal } from '../scalar.ts';
import { IQuat } from '../types.ts';
import { dot, normalize } from './helpers.ts';
import { BYTES_PER_FLOAT64, ManagedFloat64Array, memoryManager } from './memory.ts';
import { Vec3 } from './vec.ts';

const ID = [0, 0, 0, 1];

/** A quaternion. */
export class Quat extends ManagedFloat64Array<4> implements IQuat {
  /** Return an identity Quat. */
  public static identity(): Quat {
    const q = new Quat(memoryManager.create(4));
    q.set(ID);
    return q;
  }

  /** Return a Quat from unit vectors. */
  public static fromUnitVecs(from: Vec3, to: Vec3): Quat {
    const dot = from.dot(to);

    if (fequal(dot, -1)) { // vectors are in parallel but opposite direction
      // use arbitrary perpendicular vector = (0, z, -y)
      const [, y, z] = from;
      using v = new Vec3(0, z, -y);
      return Quat.fromAxisAngle(v, Math.PI);
    } else if (fequal(dot, 1)) { // vectors are in same direction
      return Quat.identity();
    }

    using v = new Vec3();
    v.copy(from, 0, 0, 3);
    v.cross(to);

    const q = new Quat(memoryManager.create(4));
    q.set([...v, 1 + dot]);
    q.normalize();
    return q;
  }

  /** Return a Quat from axis and angle */
  public static fromAxisAngle(axis: Vec3, angle: number): Quat {
    const view = memoryManager.view;
    const ptr = axis.byteOffset / BYTES_PER_FLOAT64;
    const sinHalf = Math.sin(angle / 2);
    const q = new Quat(memoryManager.create(4));
    q.set([view[ptr + 0] * sinHalf, view[ptr + 1] * sinHalf, view[ptr + 2] * sinHalf, Math.cos(angle / 2)]);
    return q;
  }

  /** Return a Quat from rotation around x-axis. */
  public static fromAngleX(angle: number): Quat {
    const q = new Quat(memoryManager.create(4));
    q.set([Math.sin(angle / 2), 0, 0, Math.cos(angle / 2)]);
    return q;
  }

  /** Return a Quat from rotation around y-axis. */
  public static fromAngleY(angle: number): Quat {
    const q = new Quat(memoryManager.create(4));
    q.set([0, Math.sin(angle / 2), 0, Math.cos(angle / 2)]);
    return q;
  }

  /** Return a Quat from rotation around z-axis. */
  public static fromAngleZ(angle: number): Quat {
    const q = new Quat(memoryManager.create(4));
    q.set([0, 0, Math.sin(angle / 2), Math.cos(angle / 2)]);
    return q;
  }

  private constructor(ptr: number) {
    super(ptr);
  }

  public override get length(): 4 {
    return 4;
  }

  public mul(rhs: Quat): this {
    const left = (this.byteOffset / BYTES_PER_FLOAT64) | 0;
    const right = (rhs.byteOffset / BYTES_PER_FLOAT64) | 0;
    const view = memoryManager.view;
    const x = view[left + 3] * view[right + 0] + view[left + 0] * view[right + 3]
      + view[left + 1] * view[right + 2] - view[left + 2] * view[right + 1];
    const y = view[left + 3] * view[right + 1] + view[left + 1] * view[right + 3]
      + view[left + 2] * view[right + 0] - view[left + 0] * view[right + 2];
    const z = view[left + 3] * view[right + 2] + view[left + 2] * view[right + 3]
      + view[left + 0] * view[right + 1] - view[left + 1] * view[right + 0];
    const w = view[left + 3] * view[right + 3] - view[left + 0] * view[right + 0]
      - view[left + 1] * view[right + 1] - view[left + 2] * view[right + 2];

    view[left + 0] = x;
    view[left + 1] = y;
    view[left + 2] = z;
    view[left + 3] = w;

    return this;
  }

  public rotate(v: Vec3): Vec3 {
    const view = memoryManager.view;
    using q1 = new Quat(memoryManager.create(4));
    using q2 = new Quat(memoryManager.create(4));

    // formula v' = q * v * q^-1
    q1.copy(this, 0, 0, 4);
    q2.copy(v, 0, 0, 3);
    view[(q2.byteOffset / BYTES_PER_FLOAT64 + 3) | 0] = 0;
    q1.mul(q2);
    q2.copy(this, 0, 0, 4);
    q2.invert();
    q1.mul(q2);
    v.copy(q1, 0, 0, 3);

    return v;
  }

  public dot(rhs: Quat): number {
    return dot(this, rhs);
  }

  public lerp(rhs: Quat, t: number): this {
    const left = (this.byteOffset / BYTES_PER_FLOAT64) | 0;
    const right = (rhs.byteOffset / BYTES_PER_FLOAT64) | 0;
    const view = memoryManager.view;
    const cosTheta = dot(this, rhs); // calculate cosine from dot product
    const magB = (cosTheta < 0) ? -1 : 1;

    for (let i = 0; i < this.length; ++i) {
      view[left + i] = view[left + i] * (1 - t) + view[right + i] * magB * t;
    }
    normalize(this);
    return this;
  }

  public slerp(rhs: Quat, t: number): this {
    const left = (this.byteOffset / BYTES_PER_FLOAT64) | 0;
    const right = (rhs.byteOffset / BYTES_PER_FLOAT64) | 0;
    const view = memoryManager.view;
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
      view[left + i] = view[left + i] * scale0 + view[right + i] * scale1;
    }
    return this;
  }

  public normalize(): boolean {
    return normalize(this);
  }

  public invert(): boolean {
    const sqrLen = dot(this, this);
    if (sqrLen === 0) { return false; }

    const left = (this.byteOffset / BYTES_PER_FLOAT64) | 0;
    const view = memoryManager.view;

    for (let i = 0; i < 3; ++i) {
      view[left + i] = -view[left + i] / sqrLen;
    }
    view[left + 3] /= sqrLen;
    return true;
  }
}
