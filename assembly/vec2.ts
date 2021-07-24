import { Float, ReadonlyMat2, ReadonlyVec2, Vec2 } from './types';
import * as array from './array';

// Temp variables
const v: Vec2 = create();

/**
 * Create a new {@link Vec2}.
 * @param x defaults to 0
 * @param y defaults to 0
 * @returns [x, y]
 */
export function create(x: Float = 0, y: Float = 0): Vec2 {
  return [x, y];
}

/**
 * Copy a {@link Vec2}.
 * @returns out
 */
export function copy(v: ReadonlyVec2, out: Vec2 = create()): Vec2 {
  return array.copy(v, out) as Vec2;
}

/**
 * Sum 2 {@link Vec2}.
 * @returns out = a + b
 */
export function add(a: ReadonlyVec2, b: ReadonlyVec2, out: Vec2 = create()): Vec2 {
  return array.add(a, b, out) as Vec2;
}

/**
 * Subtract 2 {@link Vec2}.
 * @returns out = a - b
 */
export function sub(a: ReadonlyVec2, b: ReadonlyVec2, out: Vec2 = create()): Vec2 {
  return array.sub(a, b, out) as Vec2;
}

/**
 * Multiply a {@link Vec2} by a constant.
 * @returns out = s * v
 */
export function scale(v: ReadonlyVec2, s: Float, out: Vec2 = create()): Vec2 {
  return array.scale(v, s, out) as Vec2;
}

/**
 * Multiply 2 {@link Vec2} element-wise.
 * @returns out = a * b
 */
export function mul(v: ReadonlyVec2, s: ReadonlyVec2, out: Vec2 = create()): Vec2 {
  return array.mul(v, s, out) as Vec2;
}

/**
 * Multiply a {@link ReadonlyMat2} with a {@link Vec2}.
 * @returns out = m * v
 */
export function mmul(a: ReadonlyMat2, b: ReadonlyVec2, out: Vec2 = create()): Vec2 {
  return array.copy(array.mmul(2, a, b, v), out) as Vec2;
}

/**
 * Calculate the dot product of 2 {@link Vec2}.
 * @returns a * b
 */
export const dot: (a: ReadonlyVec2, b: ReadonlyVec2) => Float = array.dot;

/**
 * Linear interpolate 2 {@link Vec2}.
 * @returns out = lerp(a, b, t)
 */
export function lerp(a: ReadonlyVec2, b: ReadonlyVec2, t: Float, out: Vec2 = create()): Vec2 {
  return array.lerp(a, b, t, out) as Vec2;
}

/**
 * Calculate squared length of a {@link Vec2}.
 * @returns dot(v, v)
 */
export function len2(v: ReadonlyVec2): Float {
  return dot(v, v);
}

/**
 * Calculate length of a {@link Vec2}.
 * @returns |v|
 */
export function len(v: ReadonlyVec2): Float {
  return Math.hypot(v[0], v[1]) as Float;
}

/**
 * Normalize a {@link Vec2} and optionally stores result to the out param.
 * @returns v/|v|
 */
export function norm(v: ReadonlyVec2, out: Vec2 = create()): Vec2 {
  return array.scale(v, 1 / (len(v) || 1), out) as Vec2;
}
