import { Float, Mat4, Quat, ReadonlyQuat, ReadonlyVec3, Vec, Vec3 } from './types';
import * as mat from './mat';
import * as mat4 from './mat4';
import * as vec3 from './vec3';
import * as vec4 from './vec4';
import { EPSILON, fequal } from './scalar';

// Temp variables
const q1: Quat = create();
const q2: Quat = create();

/**
 * Create a new identity {@link Quat}.
 * @returns [0, 0, 0, 1]
 */
export function create(): Quat {
  return [0, 0, 0, 1];
}

/**
 * Create a {@link Quat} from a unit axis vector and rotation angle in couterclockwise direction.
 */
export function fromAxisAngle(axis: ReadonlyVec3, angle: Float, out: Quat = create()): Quat {
  mat.scale(axis, Math.sin(angle / 2) as Float, out);
  unchecked(out[3] = Math.cos(angle / 2) as Float);
  return out;
}

/**
 * Returns a {@link Quat} from a rotation around x-axis in couterclockwise direction.
 * @returns the quat representing the rotation
 */
export function fromAngleX(angle: Float, out: Quat = create()): Quat {
  unchecked(out[0] = Math.sin(angle / 2) as Float);
  unchecked(out[3] = Math.cos(angle / 2) as Float);
  unchecked(out[1] = out[2] = 0);
  return out;
}

/**
 * Returns a {@link Quat} from a rotation around y-axis in couterclockwise direction.
 * @returns the quat representing the rotation
 */
export function fromAngleY(angle: Float, out: Quat = create()): Quat {
  unchecked(out[1] = Math.sin(angle / 2) as Float);
  unchecked(out[3] = Math.cos(angle / 2) as Float);
  unchecked(out[0] = out[2] = 0);
  return out;
}

/**
 * Returns a {@link Quat} from a rotation around z-axis in couterclockwise direction.
 * @returns the quat representing the rotation
 */
export function fromAngleZ(angle: Float, out: Quat = create()): Quat {
  unchecked(out[2] = Math.sin(angle / 2) as Float);
  unchecked(out[3] = Math.cos(angle / 2) as Float);
  unchecked(out[0] = out[1] = 0);
  return out;
}

/**
 * Returns a {@link Quat} that represents the shortest arc rotation between 2 unit vectors.
 * @returns the quat representing the rotation
 */
export function fromUnitVecs(from: ReadonlyVec3, to: ReadonlyVec3, out: Quat = create()): Quat {
  const dot: Float = vec3.dot(from, to);

  if (fequal(dot, -1)) { // vectors are in parallel but opposite direction
    // use arbitrary perpendicular vector = (0, z, -y)
    unchecked(out[0] = 0);
    unchecked(out[1] = from[2]);
    unchecked(out[2] = -from[1]);
    return fromAxisAngle(out as Vec as Vec3, Math.PI as Float, out);
  } else if (fequal(dot, 1)) { // vectors are in same direction
    unchecked(out[0] = out[1] = out[2] = 0);
    unchecked(out[3] = 1);
    return out;
  }

  // store perpendicular vector to the xyz of out.
  vec3.cross(from, to, out as Vec as Vec3);
  unchecked(out[3] = 1 + dot);
  return norm(out, out);
}

/**
 * Convert a {@link Quat} to a {@link Mat4}.
 * @returns Mat4
 */
export function toMat4(q: ReadonlyQuat, out: Mat4 = mat4.create()): Mat4 {
  const
    xx: Float = unchecked(q[0] * q[0]),
    xy: Float = unchecked(q[0] * q[1]),
    xz: Float = unchecked(q[0] * q[2]),
    yy: Float = unchecked(q[1] * q[1]),
    yz: Float = unchecked(q[1] * q[2]),
    zz: Float = unchecked(q[2] * q[2]),
    wx: Float = unchecked(q[3] * q[0]),
    wy: Float = unchecked(q[3] * q[1]),
    wz: Float = unchecked(q[3] * q[2]);

  unchecked(out[0] = 1 - 2 * (yy + zz));
  unchecked(out[1] = 2 * (xy + wz));
  unchecked(out[2] = 2 * (xz - wy));
  unchecked(out[4] = 2 * (xy - wz));
  unchecked(out[5] = 1 - 2 * (xx + zz));
  unchecked(out[6] = 2 * (yz + wx));
  unchecked(out[8] = 2 * (xz + wy));
  unchecked(out[9] = 2 * (yz - wx));
  unchecked(out[10] = 1 - 2 * (xx + yy));

  unchecked(out[3] = out[7] = out[11] = out[12] = out[13] = out[14] = 0);
  unchecked(out[15] = 1);
  return out;
}

/**
 * Copy a {@link Quat}.
 * @returns out
 */
export function copy(q: ReadonlyQuat, out: Quat = create()): Quat {
  return mat.copy(q, out) as Quat;
}

/**
 * Calculate dot product between 2 {@link Quat}.
 * @returns a * b
 */
export const dot: (a: ReadonlyQuat, b: ReadonlyQuat) => Float = mat.dot;

/**
 * Calculate squared length of a {@link ReadonlyQuat}.
 * @returns dot(v, v)
 */
export const sqrLen: (v: ReadonlyQuat) => Float = vec4.sqrLen;

/**
 * Calculate length of a {@link Quat}.
 * @returns |v|
 */
export const len: (v: ReadonlyQuat) => Float = vec4.len;

/**
* Normalize a {@link Quat}.
*/
export const norm: (q: ReadonlyQuat, out?: Quat) => Quat = vec4.norm;

/**
* Calculates the conjugate of a {@link Quat}.
*/
export function conj(q: ReadonlyQuat, out: Quat = create()): Quat {
  unchecked(out[0] = -q[0]);
  unchecked(out[1] = -q[1]);
  unchecked(out[2] = -q[2]);
  unchecked(out[3] = q[3]);
  return out;
}

/**
* Calculate the inverse of a {@link Quat}.
*/
export function invert(q: ReadonlyQuat, out: Quat = create()): Quat {
  const l: Float = 1 / (sqrLen(q) || 1);
  unchecked(out[0] = -q[0] * l);
  unchecked(out[1] = -q[1] * l);
  unchecked(out[2] = -q[2] * l);
  unchecked(out[3] = q[3] * l);
  return out;
}

/**
 * Calculate the Hamilton product of 2 {@link Quat}.
 * @returns out = a * b
 */
export function mul(a: ReadonlyQuat, b: ReadonlyQuat, out: Quat = create()): Quat {
  const
    ax: Float = unchecked(a[0]),
    ay: Float = unchecked(a[1]),
    az: Float = unchecked(a[2]),
    aw: Float = unchecked(a[3]),
    bx: Float = unchecked(b[0]),
    by: Float = unchecked(b[1]),
    bz: Float = unchecked(b[2]),
    bw: Float = unchecked(b[3]);
  unchecked(out[0] = aw * bx + ax * bw + ay * bz - az * by);
  unchecked(out[1] = aw * by + ay * bw + az * bx - ax * bz);
  unchecked(out[2] = aw * bz + az * bw + ax * by - ay * bx);
  unchecked(out[3] = aw * bw - ax * bx - ay * by - az * bz);
  return out;
}

/**
 * Rotate a {@link ReadonlyVec3} using a {@link ReadonlyQuat}, by the formula v' = q * v * q^-1
 * @see https://en.wikipedia.org/wiki/Quaternions_and_spatial_rotation#Using_quaternion_as_rotations
 * @returns out = q * v * q^-1
 */
export function rotateVec3(q: ReadonlyQuat, v: ReadonlyVec3, out: Vec3 = vec3.create()): Vec3 {
  mat.copy(v, q1, 0, 0, 3);
  unchecked(q1[3] = 0);
  mul(mul(q, q1, q1), invert(q, q2), q1);
  return mat.copy(q1, out, 0, 0, 3) as Vec3;
}

/**
 * Linear interpolate between 2 {@link Quat}.
 * @returns out = lerp(a, b, t)
 */
export function lerp(a: ReadonlyQuat, b: ReadonlyQuat, t: Float, out: Quat = create()): Quat {
  const cosTheta: Float = dot(a, b);  // calculate cosine from dot product
  const magB: Float = (cosTheta < 0) ? -1 : 1;

  // use the shortest path and interpolate linearly
  unchecked(out[0] = a[0] * (1 - t) + b[0] * magB * t);
  unchecked(out[1] = a[1] * (1 - t) + b[1] * magB * t);
  unchecked(out[2] = a[2] * (1 - t) + b[2] * magB * t);
  unchecked(out[3] = a[3] * (1 - t) + b[3] * magB * t);

  return norm(out);
}

/**
 * Spherical linear interpolate between 2 {@link Quat}.
 */
export function slerp(a: ReadonlyQuat, b: ReadonlyQuat, t: Float, out: Quat = create()): Quat {
  let cosTheta: Float = dot(a, b);  // calculate cosine from dot product
  let magB: Float = 1;
  // use the shortest path
  if (cosTheta < 0) {
    cosTheta *= -1;
    magB = -1;
  }

  // initialize with linear interpolation
  let scale0: Float = 1 - t;
  let scale1: Float = t;

  // use spherical interpolation only if the quaternions are not very close
  if (1 - cosTheta > EPSILON) {
    const theta: Float = Math.acos(cosTheta) as Float;
    const sinTheta: Float = Math.sin(theta) as Float;
    scale0 = (Math.sin((1 - t) * theta) as Float) / sinTheta;
    scale1 = (Math.sin(t * theta) as Float) / sinTheta;
  }
  scale1 *= magB;

  unchecked(out[0] = a[0] * scale0 + b[0] * scale1);
  unchecked(out[1] = a[1] * scale0 + b[1] * scale1);
  unchecked(out[2] = a[2] * scale0 + b[2] * scale1);
  unchecked(out[3] = a[3] * scale0 + b[3] * scale1);
  return out;
}
