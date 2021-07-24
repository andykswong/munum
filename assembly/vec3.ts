import { Float, ReadonlyMat3, ReadonlyVec3, Vec3 } from './types';
import * as array from './array';

// Temp variables
const v: Vec3 = create();

/**
 * Create a new {@link Vec3}.
 * @param x defaults to 0
 * @param y defaults to 0
 * @param z defaults to 0
 * @returns [x, y, z]
 */
export function create(x: Float = 0, y: Float = 0, z: Float = 0): Vec3 {
  return [x, y, z];
}

/**
 * Copy a {@link Vec3}.
 * @returns out
 */
export function copy(v: ReadonlyVec3, out: Vec3 = create()): Vec3 {
  return array.copy(v, out) as Vec3;
}

/**
 * Sum 2 {@link Vec3}.
 * @returns out = a + b
 */
export function add(a: ReadonlyVec3, b: ReadonlyVec3, out: Vec3 = create()): Vec3 {
  return array.add(a, b, out) as Vec3;
}

/**
 * Subtract 2 {@link Vec3}.
 * @returns out = a - b
 */
export function sub(a: ReadonlyVec3, b: ReadonlyVec3, out: Vec3 = create()): Vec3 {
  return array.sub(a, b, out) as Vec3;
}

/**
 * Multiply a {@link Vec3} by a constant.
 * @returns out = s * v
 */
export function scale(v: ReadonlyVec3, s: Float, out: Vec3 = create()): Vec3 {
  return array.scale(v, s, out) as Vec3;
}

/**
 * Multiply 2 {@link Vec3} element-wise.
 * @returns out = a * b
 */
export function mul(v: ReadonlyVec3, s: ReadonlyVec3, out: Vec3 = create()): Vec3 {
  return array.mul(v, s, out) as Vec3;
}

/**
 * Multiply a {@link ReadonlyMat3} with a {@link Vec3}.
 * @returns out = m * v
 */
export function mmul(a: ReadonlyMat3, b: ReadonlyVec3, out: Vec3 = create()): Vec3 {
  return array.copy(array.mmul(3, a, b, v), out) as Vec3;
}

/**
 * Calculate the dot product of 2 {@link Vec3}.
 * @returns a * b
 */
export function dot(a: ReadonlyVec3, b: ReadonlyVec3): Float {
  return array.dot(a, b);
}

/**
 * Linear interpolate 2 {@link Vec3}.
 * @returns out = lerp(a, b, t)
 */
export function lerp(a: ReadonlyVec3, b: ReadonlyVec3, t: Float, out: Vec3 = create()): Vec3 {
  return array.lerp(a, b, t, out) as Vec3;
}

/**
 * Calculate squared length of a {@link Vec3}.
 * @returns dot(v, v)
 */
export function len2(v: ReadonlyVec3): Float {
  return dot(v, v);
}

/**
 * Calculate length of a {@link Vec3}.
 * @returns |v|
 */
export function len(v: ReadonlyVec3): Float {
  return Math.sqrt(dot(v, v)) as Float;
}

/**
 * Normalize a {@link Vec3} and optionally stores result to the out param.
 * @returns v/|v|
 */
export function norm(v: ReadonlyVec3, out: Vec3 = create()): Vec3 {
  return array.scale(v, 1 / (len(v) || 1), out) as Vec3;
}

/**
 * Calculate cross product of 2 {@link Vec3}.
 * @returns out = a x b
 */
export function cross(a: ReadonlyVec3, b: ReadonlyVec3, out: Vec3 = create()): Vec3 {
  const y: Float = unchecked(a[2] * b[0] - b[2] * a[0]);
  const z: Float = unchecked(a[0] * b[1] - b[0] * a[1]);
  unchecked(out[0] = a[1] * b[2] - b[1] * a[2]);
  unchecked(out[1] = y);
  unchecked(out[2] = z);
  return out;
}
