import { Float, ReadonlyMat4, ReadonlyVec3, ReadonlyVec4, Vec4 } from './types';
import * as mat from './mat';

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
 * Set values of a {@link Vec4}.
 * @param v the vec
 * @param x defaults to 0
 * @param y defaults to 0
 * @param z defaults to 0
 * @param w defaults to 0
 * @returns v
 */
 export function set(v: Vec4, x: Float = 0, y: Float = 0, z: Float = 0, w: Float = 0): Vec4 {
  unchecked(v[0] = x);
  unchecked(v[1] = y);
  unchecked(v[2] = z);
  unchecked(v[3] = w);
  return v;
}

/**
 * Create a {@link Vec4} from {@link ReadonlyVec3}.
 * @param v Vec3
 * @param out output Vec4
 * @returns [v[0], v[1], v[2], w]
 */
export function fromVec3(v: ReadonlyVec3, out: Vec4 = create()): Vec4 {
  unchecked(out[0] = v[0]);
  unchecked(out[1] = v[1]);
  unchecked(out[2] = v[2]);
  unchecked(out[3] = 0);
  return out;
}

/**
 * Copy a {@link Vec4}.
 * @returns out
 */
export function copy(v: ReadonlyVec4, out: Vec4 = create()): Vec4 {
  return mat.copy(v, out) as Vec4;
}

/**
 * Sum 2 {@link Vec4}.
 * @returns out = a + b
 */
export function add(a: ReadonlyVec4, b: ReadonlyVec4, out: Vec4 = create()): Vec4 {
  return mat.add(a, b, out) as Vec4;
}

/**
 * Subtract 2 {@link Vec4}.
 * @returns out = a - b
 */
export function sub(a: ReadonlyVec4, b: ReadonlyVec4, out: Vec4 = create()): Vec4 {
  return mat.sub(a, b, out) as Vec4;
}

/**
 * Multiply a {@link Vec4} by a constant.
 * @returns out = s * v
 */
export function scale(v: ReadonlyVec4, s: Float, out: Vec4 = create()): Vec4 {
  return mat.scale(v, s, out) as Vec4;
}

/**
 * Multiply a {@link ReadonlyMat4} with a {@link Vec4}.
 * @returns out = m * v
 */
export function mmul(a: ReadonlyMat4, b: ReadonlyVec4, out: Vec4 = create()): Vec4 {
  return mat.mul(4, a, b, out) as Vec4;
}

/**
 * Calculate the dot product of 2 {@link Vec4}.
 * @returns a * b
 */
export function dot(a: ReadonlyVec4, b: ReadonlyVec4): Float {
  return mat.dot(a, b);
}

/**
 * Linear interpolate 2 {@link Vec4}.
 * @returns out = lerp(a, b, t)
 */
export function lerp(a: ReadonlyVec4, b: ReadonlyVec4, t: Float, out: Vec4 = create()): Vec4 {
  return mat.lerp(a, b, t, out) as Vec4;
}

/**
 * Calculate squared length of a {@link Vec4}.
 * @returns dot(v, v)
 */
export function sqrLen(v: ReadonlyVec4): Float {
  return dot(v, v);
}

/**
 * Calculate length of a {@link Vec4}.
 * @returns |v|
 */
export function len(v: ReadonlyVec4): Float {
  return Math.sqrt(dot(v, v)) as Float;
}

/**
 * Normalize a {@link Vec4} and optionally stores result to the out param.
 * @returns v/|v|
 */
export function norm(v: ReadonlyVec4, out: Vec4 = create()): Vec4 {
  return mat.scale(v, 1 / (len(v) || 1), out) as Vec4;
}
