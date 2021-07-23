import { Float, Mat4, ReadonlyVec3, ReadonlyVec4, Vec, Vec3, Vec4 } from './types';
import * as array from './array';
import * as mat4 from './mat4';
import * as vec3 from './vec3';
import * as vec4 from './vec4';
import { EPSILON, fequal } from './scalar';

// Temp variables
const q1: Quat = create();
const q2: Quat = create();

/**
 * Quaternion of the form w + x * i + y * j + z * k, stored as {@link Vec4}.
 */
export type Quat = Vec4;

/**
 * A read-only quaternion.
 */
export type ReadonlyQuat = ReadonlyVec4;

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
  array.scale(axis, Math.sin(angle / 2) as Float, out);
  out[3] = Math.cos(angle / 2) as Float;
  return out;
}

/**
 * Convert a {@link Quat} to a {@link Mat4}.
 * @returns Mat4
 */
export function toMat4(q: ReadonlyQuat, out: Mat4 = mat4.create()): Mat4 {
  const
    xx: Float = q[0] * q[0],
    xy: Float = q[0] * q[1],
    xz: Float = q[0] * q[2],
    yy: Float = q[1] * q[1],
    yz: Float = q[1] * q[2],
    zz: Float = q[2] * q[2],
    wx: Float = q[3] * q[0],
    wy: Float = q[3] * q[1],
    wz: Float = q[3] * q[2];

  out[0] = 1 - 2 * (yy + zz);
  out[1] = 2 * (xy + wz);
  out[2] = 2 * (xz - wy);
  out[4] = 2 * (xy - wz);
  out[5] = 1 - 2 * (xx + zz);
  out[6] = 2 * (yz + wx);
  out[8] = 2 * (xz + wy);
  out[9] = 2 * (yz - wx);
  out[10] = 1 - 2 * (xx + yy);

  out[3] = out[7] = out[11] = out[12] = out[13] = out[14] = 0;
  out[15] = 1;
  return out;
}

/**
 * Copy a {@link Quat}.
 * @returns out
 */
export const copy = (q: ReadonlyQuat, out: Quat = create()): Quat => array.copy(q, out) as Quat;

/**
 * Calculate dot product between 2 {@link Quat}.
 * @returns a * b
 */
export const dot: (a: ReadonlyQuat, b: ReadonlyQuat) => Float = array.dot;

/**
 * Calculate squared length of a {@link ReadonlyQuat}.
 * @returns dot(v, v)
 */
export const len2: (v: ReadonlyQuat) => Float = vec4.len2;

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
  out[0] = -q[0];
  out[1] = -q[1];
  out[2] = -q[2];
  out[3] = q[3];
  return out;
}

/**
* Calculate the inverse of a {@link Quat}.
*/
export function invert(q: ReadonlyQuat, out: Quat = create()): Quat {
  const l: Float = 1 / (len(q) || 1);
  out[0] = -q[0] * l;
  out[1] = -q[1] * l;
  out[2] = -q[2] * l;
  out[3] = q[3] * l;
  return out;
}

/**
 * Multiply 2 {@link Quat}.
 * @returns out = a * b
 */
export function mul(a: ReadonlyQuat, b: ReadonlyQuat, out: Quat = create()): Quat {
  const
    ax: Float = a[0],
    ay: Float = a[1],
    az: Float = a[2],
    aw: Float = a[3],
    bx: Float = b[0],
    by: Float = b[1],
    bz: Float = b[2],
    bw: Float = b[3];
  out[0] = aw * bx + ax * bw + ay * bz - az * by;
  out[1] = aw * by + ay * bw + az * bx - ax * bz;
  out[2] = aw * bz + az * bw + ax * by - ay * bx;
  out[3] = aw * bw - ax * bx - ay * by - az * bz;
  return out;
}

/**
 * Rotate a {@link ReadonlyVec3} using a {@link ReadonlyQuat}, by the formula v' = q * v * q^-1
 * @see https://en.wikipedia.org/wiki/Quaternions_and_spatial_rotation#Using_quaternion_as_rotations
 * @returns out = q * v * q^-1
 */
export function rotateVec3(v: ReadonlyVec3, q: ReadonlyQuat, out: Vec3 = vec3.create()): Vec3 {
  array.copy(v, q1, 0, 0, 3);
  q1[3] = 0;
  mul(mul(q, q1, q1), invert(q, q2), q1);
  return array.copy(q1, out, 0, 0, 3) as Vec3;
}

/**
 * Linear interpolate between 2 {@link Quat}.
 * @returns out = lerp(a, b, t)
 */
export function lerp(a: ReadonlyQuat, b: ReadonlyQuat, t: Float, out: Quat = create()): Quat {
  const cosTheta: Float = dot(a, b);  // calculate cosine from dot product
  const magB: Float = (cosTheta < 0) ? -1 : 1;

  // use the shortest path and interpolate linearly
  out[0] = a[0] * (1 - t) + b[0] * magB * t;
  out[1] = a[1] * (1 - t) + b[1] * magB * t;
  out[2] = a[2] * (1 - t) + b[2] * magB * t;
  out[3] = a[3] * (1 - t) + b[3] * magB * t;

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

  out[0] = a[0] * scale0 + b[0] * scale1;
  out[1] = a[1] * scale0 + b[1] * scale1;
  out[2] = a[2] * scale0 + b[2] * scale1;
  out[3] = a[3] * scale0 + b[3] * scale1;
  return out;
}

/**
 * Returns a {@link Quat} that represents the shortest arc rotation between 2 unit vectors.
 * @returns the quat representing the rotation
 */
 export function rotateTo(from: ReadonlyVec3, to: ReadonlyVec3, out: Quat = create()): Quat {
  const dot: Float = vec3.dot(from, to);

  if (fequal(dot, -1)) { // vectors are in parallel but opposite direction
    // use arbitrary perpendicular vector = (0, z, -y)
    out[0] = 0;
    out[1] = from[2];
    out[2] = -from[1];
    return fromAxisAngle(out as Vec as Vec3, Math.PI as Float, out);
  } else if (fequal(dot, 1)) { // vectors are in same direction
    out[0] = out[1] = out[2] = 0;
    out[3] = 1;
    return out;
  }

  // store perpendicular vector to the xyz of out.
  vec3.cross(from, to, out as Vec as Vec3);
  out[3] = 1 + dot;
  return norm(out, out);
}

/**
 * Returns a {@link Quat} from a rotation around x-axis in couterclockwise direction.
 * @returns the quat representing the rotation
 */
export function rotateX(angle: Float, out: Quat = create()): Quat {
  out[0] = Math.sin(angle / 2) as Float;
  out[3] = Math.cos(angle / 2) as Float;
  out[1] = out[2] = 0;
  return out;
}

/**
 * Returns a {@link Quat} from a rotation around y-axis in couterclockwise direction.
 * @returns the quat representing the rotation
 */
export function rotateY(angle: Float, out: Quat = create()): Quat {
  out[1] = Math.sin(angle / 2) as Float;
  out[3] = Math.cos(angle / 2) as Float;
  out[0] = out[2] = 0;
  return out;
}

/**
 * Returns a {@link Quat} from a rotation around z-axis in couterclockwise direction.
 * @returns the quat representing the rotation
 */
export function rotateZ(angle: Float, out: Quat = create()): Quat {
  out[2] = Math.sin(angle / 2) as Float;
  out[3] = Math.cos(angle / 2) as Float;
  out[0] = out[1] = 0;
  return out;
}

/**
 * Returns a {@link Quat} from euler rotation in yaw-pitch-roll sequence.
 * @see https://en.wikipedia.org/wiki/Conversion_between_quaternions_and_Euler_angles#Euler_angles_to_quaternion_conversion
 * @returns the quat representing the rotation
 */
 export function rotateEuler(euler: ReadonlyVec3, out: Quat = create()): Quat {
  return mul(rotateY(euler[1], q1), mul(rotateX(euler[0], q2), rotateZ(euler[2], out), out), out);
}
