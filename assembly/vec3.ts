import { Float, ReadonlyVec3, Vec3 } from './types';
import * as array from './array';

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
export const copy = (v: ReadonlyVec3, out: Vec3 = create()): Vec3 => array.copy(v, out) as Vec3;

/**
 * Sum 2 {@link Vec3}.
 * @returns out = a + b
 */
export const add = (a: ReadonlyVec3, b: ReadonlyVec3, out: Vec3 = create()): Vec3 => array.add(a, b, out) as Vec3;

/**
 * Subtract 2 {@link Vec3}.
 * @returns out = a - b
 */
export const sub = (a: ReadonlyVec3, b: ReadonlyVec3, out: Vec3 = create()): Vec3 => array.sub(a, b, out) as Vec3;

/**
 * Multiply a {@link Vec3} by a constant.
 * @returns out = s * v
 */
export const scale = (v: ReadonlyVec3, s: Float, out: Vec3 = create()): Vec3 => array.scale(v, s, out) as Vec3;

/**
 * Multiply 2 {@link Vec3} component-wise.
 * @returns out = a * b
 */
export const mul = (v: ReadonlyVec3, s: ReadonlyVec3, out: Vec3 = create()): Vec3 => array.mul(v, s, out) as Vec3;

/**
 * Calculate the dot product of 2 {@link Vec3}.
 * @returns a * b
 */
export const dot: (a: ReadonlyVec3, b: ReadonlyVec3) => Float = array.dot;

/**
 * Linear interpolate 2 {@link Vec3}.
 * @returns out = lerp(a, b, t)
 */
export const lerp = (a: ReadonlyVec3, b: ReadonlyVec3, t: Float, out: Vec3 = create()): Vec3 => array.lerp(a, b, t, out) as Vec3;

/**
 * Calculate squared length of a {@link Vec3}.
 * @returns dot(v, v)
 */
export const len2 = (v: ReadonlyVec3): Float => dot(v, v);

/**
 * Calculate length of a {@link Vec3}.
 * @returns |v|
 */
export const len = (v: ReadonlyVec3): Float => Math.sqrt(dot(v, v)) as Float;

/**
 * Normalize a {@link Vec3} and optionally stores result to the out param.
 * @returns v/|v|
 */
export const norm = (v: ReadonlyVec3, out: Vec3 = create()): Vec3 => array.scale(v, 1 / (len(v) || 1), out) as Vec3;

/**
 * Calculate cross product of 2 {@link Vec3}.
 * @returns out = a x b
 */
 export function cross(a: ReadonlyVec3, b: ReadonlyVec3, out: Vec3 = create()): Vec3 {
  const y: Float = a[2] * b[0] - b[2] * a[0];
  const z: Float = a[0] * b[1] - b[0] * a[1];
  out[0] = a[1] * b[2] - b[1] * a[2];
  out[1] = y;
  out[2] = z;
  return out;
}
