import { Float, ReadonlyVec3, ReadonlyVec4, Vec4 } from './types';
import * as array from './array';

/**
 * Create a new {@link Vec4}.
 * @param x defaults to 0
 * @param y defaults to 0
 * @param z defaults to 0
 * @param w defaults to 0
 * @returns [x, y, z, w]
 */
export function create(x: Float = 0, y: Float = 0, z: Float = 0, w: Float = 0): Vec4 {
  return [x, y, z, w];
}

/**
 * Create a {@link Vec4} from {@link ReadonlyVec3}.
 * @param v Vec3
 * @param out output Vec4
 * @returns [v[0], v[1], v[2], w]
 */
export function fromVec3(v: ReadonlyVec3, out: Vec4 = create()): Vec4 {
  out[0] = v[0];
  out[1] = v[1];
  out[2] = v[2];
  out[3] = 0;
  return out;
}

/**
 * Copy a {@link Vec4}.
 * @returns out
 */
export const copy = (v: ReadonlyVec4, out: Vec4 = create()): Vec4 => array.copy(v, out) as Vec4;

/**
 * Sum 2 {@link Vec4}.
 * @returns out = a + b
 */
export const add = (a: ReadonlyVec4, b: ReadonlyVec4, out: Vec4 = create()): Vec4 => array.add(a, b, out) as Vec4;

/**
 * Subtract 2 {@link Vec4}.
 * @returns out = a - b
 */
export const sub = (a: ReadonlyVec4, b: ReadonlyVec4, out: Vec4 = create()): Vec4 => array.sub(a, b, out) as Vec4;

/**
 * Multiply a {@link Vec4} by a constant.
 * @returns out = s * v
 */
export const scale = (v: ReadonlyVec4, s: Float, out: Vec4 = create()): Vec4 => array.scale(v, s, out) as Vec4;

/**
 * Multiply 2 {@link Vec4} component-wise.
 * @returns out = a * b
 */
export const mul = (v: ReadonlyVec4, s: ReadonlyVec4, out: Vec4 = create()): Vec4 => array.mul(v, s, out) as Vec4;

/**
 * Calculate the dot product of 2 {@link Vec4}.
 * @returns a * b
 */
export const dot: (a: ReadonlyVec4, b: ReadonlyVec4) => Float = array.dot;

/**
 * Linear interpolate 2 {@link Vec4}.
 * @returns out = lerp(a, b, t)
 */
export const lerp = (a: ReadonlyVec4, b: ReadonlyVec4, t: Float, out: Vec4 = create()): Vec4 => array.lerp(a, b, t, out) as Vec4;

/**
 * Calculate squared length of a {@link Vec4}.
 * @returns dot(v, v)
 */
export const len2 = (v: ReadonlyVec4): Float => dot(v, v);

/**
 * Calculate length of a {@link Vec4}.
 * @returns |v|
 */
export const len = (v: ReadonlyVec4): Float => Math.sqrt(dot(v, v)) as Float;

/**
 * Normalize a {@link Vec4} and optionally stores result to the out param.
 * @returns v/|v|
 */
export const norm = (v: ReadonlyVec4, out: Vec4 = create()): Vec4 => array.scale(v, 1 / (len(v) || 1), out) as Vec4;
