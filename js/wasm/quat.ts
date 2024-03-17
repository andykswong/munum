import {
  quatdot, quatfromanglex, quatfromangley, quatfromanglez, quatfromaxisangle, quatfromunitvecs, quatidentity,
  quatinvert, quatlerp, quatmul, quatnorm, quatslerp, quatvec3rotate
} from '../../wasm/index.js';
import { IQuat } from '../types.ts';
import { ManagedFloat64Array } from './memory.ts';
import { Vec3 } from './vec.ts';

/** A quaternion. */
export class Quat extends ManagedFloat64Array<4> implements IQuat {
  /** Return an identity Quat. */
  public static identity(): Quat {
    return new Quat(quatidentity());
  }

  /** Return a Quat from unit vectors. */
  public static fromUnitVecs(from: Vec3, to: Vec3): Quat {
    return new Quat(quatfromunitvecs(from.byteOffset, to.byteOffset));
  }

  /** Return a Quat from axis and angle */
  public static fromAxisAngle(axis: Vec3, angle: number): Quat {
    return new Quat(quatfromaxisangle(axis.byteOffset, angle));
  }

  /** Return a Quat from rotation around x-axis. */
  public static fromAngleX(angle: number): Quat {
    return new Quat(quatfromanglex(angle));
  }

  /** Return a Quat from rotation around y-axis. */
  public static fromAngleY(angle: number): Quat {
    return new Quat(quatfromangley(angle));
  }

  /** Return a Quat from rotation around z-axis. */
  public static fromAngleZ(angle: number): Quat {
    return new Quat(quatfromanglez(angle));
  }

  private constructor(ptr: number) {
    super(ptr);
  }

  public override get length(): 4 {
    return 4;
  }

  public mul(rhs: Quat): this {
    quatmul(this.byteOffset, this.byteOffset, rhs.byteOffset);
    return this;
  }

  public rotate(v: Vec3): Vec3 {
    quatvec3rotate(v.byteOffset, this.byteOffset, v.byteOffset);
    return v;
  }

  public dot(rhs: Quat): number {
    return quatdot(this.byteOffset, rhs.byteOffset);
  }

  public lerp(rhs: Quat, t: number): this {
    quatlerp(this.byteOffset, this.byteOffset, rhs.byteOffset, t);
    return this;
  }

  public slerp(rhs: Quat, t: number): this {
    quatslerp(this.byteOffset, this.byteOffset, rhs.byteOffset, t);
    return this;
  }

  public normalize(): boolean {
    return !!quatnorm(this.byteOffset, this.byteOffset);
  }

  public invert(): boolean {
    return !!quatinvert(this.byteOffset, this.byteOffset);
  }
}
