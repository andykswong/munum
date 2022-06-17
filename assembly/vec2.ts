import { Float, ReadonlyMat2, ReadonlyMat3, ReadonlyVec2, Vec2, Vec3 } from './types';
import * as mat from './mat';
import * as vec3 from './vec3';

// Temp variables
const v: Vec2 = create();
const v3a: Vec3 = vec3.create();
const v3b: Vec3 = vec3.create();

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
 * Set values of a {@link Vec2}.
 * @param v the vec
 * @param x defaults to 0
 * @param y defaults to 0
 * @returns v
 */
export function set(v: Vec2, x: Float = 0, y: Float = 0): Vec2 {
  unchecked(v[0] = x);
  unchecked(v[1] = y);
  return v;
}

/**
 * Copy a {@link Vec2}.
 * @returns out
 */
export function copy(v: ReadonlyVec2, out: Vec2 = create()): Vec2 {
  return mat.copy(v, out) as Vec2;
}

/**
 * Sum 2 {@link Vec2}.
 * @returns out = a + b
 */
export function add(a: ReadonlyVec2, b: ReadonlyVec2, out: Vec2 = create()): Vec2 {
  return mat.add(a, b, out) as Vec2;
}

/**
 * Subtract 2 {@link Vec2}.
 * @returns out = a - b
 */
export function sub(a: ReadonlyVec2, b: ReadonlyVec2, out: Vec2 = create()): Vec2 {
  return mat.sub(a, b, out) as Vec2;
}

/**
 * Multiply a {@link Vec2} by a constant.
 * @returns out = s * v
 */
export function scale(v: ReadonlyVec2, s: Float, out: Vec2 = create()): Vec2 {
  return mat.scale(v, s, out) as Vec2;
}

/**
 * Multiply a {@link ReadonlyMat2} with a {@link ReadonlyVec2}.
 * @returns out = m * x
 */
export function mul(m: ReadonlyMat2, x: ReadonlyVec2, out: Vec2 = create()): Vec2 {
  return mat.mul(2, m, x, out) as Vec2;
}

/**
 * Transform a {@link ReadonlyVec2} by a {@link ReadonlyMat3}.
 * @returns out = m * [x 1]
 */
export function mmul3(m: ReadonlyMat3, x: ReadonlyVec2, out: Vec2 = create()): Vec2 {
  unchecked(vec3.set(v3a, x[0], x[1], 1));
  return mat.copy(mat.mul(3, m, v3a, v3b), out, 0, 0, 2) as Vec2;
}

/**
 * Calculate the dot product of 2 {@link Vec2}.
 * @returns a * b
 */
export function dot(a: ReadonlyVec2, b: ReadonlyVec2): Float {
  return mat.dot(a, b);
}

/**
 * Linear interpolate 2 {@link Vec2}.
 * @returns out = lerp(a, b, t)
 */
export function lerp(a: ReadonlyVec2, b: ReadonlyVec2, t: Float, out: Vec2 = create()): Vec2 {
  return mat.lerp(a, b, t, out) as Vec2;
}

/**
 * Calculate squared length of a {@link Vec2}.
 * @returns dot(v, v)
 */
export function sqrLen(v: ReadonlyVec2): Float {
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
 * Calculate Euclidean distance of 2 {@link Vec2}.
 * @returns |a - b|
 */
export function dist(a: ReadonlyVec2, b: ReadonlyVec2): Float {
  return len(sub(a, b, v));
}

/**
 * Normalize a {@link Vec2} and optionally stores result to the out param.
 * @returns v/|v|
 */
export function norm(v: ReadonlyVec2, out: Vec2 = create()): Vec2 {
  return mat.scale(v, 1 / (len(v) || 1), out) as Vec2;
}
