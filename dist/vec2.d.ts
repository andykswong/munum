import { Float, ReadonlyMat2, ReadonlyMat3, ReadonlyVec2, Vec2 } from './types';
/**
 * Create a new {@link Vec2}.
 * @param x defaults to 0
 * @param y defaults to 0
 * @returns [x, y]
 */
export declare function create(x?: Float, y?: Float): Vec2;
/**
 * Set values of a {@link Vec2}.
 * @param v the vec
 * @param x defaults to 0
 * @param y defaults to 0
 * @returns v
 */
export declare function set(v: Vec2, x?: Float, y?: Float): Vec2;
/**
 * Copy a {@link Vec2}.
 * @returns out
 */
export declare function copy(v: ReadonlyVec2, out?: Vec2): Vec2;
/**
 * Sum 2 {@link Vec2}.
 * @returns out = a + b
 */
export declare function add(a: ReadonlyVec2, b: ReadonlyVec2, out?: Vec2): Vec2;
/**
 * Subtract 2 {@link Vec2}.
 * @returns out = a - b
 */
export declare function sub(a: ReadonlyVec2, b: ReadonlyVec2, out?: Vec2): Vec2;
/**
 * Multiply a {@link Vec2} by a constant.
 * @returns out = s * v
 */
export declare function scale(v: ReadonlyVec2, s: Float, out?: Vec2): Vec2;
/**
 * Multiply 2 {@link Vec2} element-wise.
 * @returns out = a * b
 */
export declare function mul(v: ReadonlyVec2, s: ReadonlyVec2, out?: Vec2): Vec2;
/**
 * Multiply a {@link ReadonlyMat2} with a {@link ReadonlyVec2}.
 * @returns out = m * x
 */
export declare function mmul(m: ReadonlyMat2, x: ReadonlyVec2, out?: Vec2): Vec2;
/**
 * Transform a {@link ReadonlyVec2} by a {@link ReadonlyMat3}.
 * @returns out = m * [x 1]
 */
export declare function mmul3(m: ReadonlyMat3, x: ReadonlyVec2, out?: Vec2): Vec2;
/**
 * Calculate the dot product of 2 {@link Vec2}.
 * @returns a * b
 */
export declare function dot(a: ReadonlyVec2, b: ReadonlyVec2): Float;
/**
 * Linear interpolate 2 {@link Vec2}.
 * @returns out = lerp(a, b, t)
 */
export declare function lerp(a: ReadonlyVec2, b: ReadonlyVec2, t: Float, out?: Vec2): Vec2;
/**
 * Calculate squared length of a {@link Vec2}.
 * @returns dot(v, v)
 */
export declare function len2(v: ReadonlyVec2): Float;
/**
 * Calculate length of a {@link Vec2}.
 * @returns |v|
 */
export declare function len(v: ReadonlyVec2): Float;
/**
 * Calculate Euclidean distance of 2 {@link Vec2}.
 * @returns |a - b|
 */
export declare function dist(a: ReadonlyVec2, b: ReadonlyVec2): Float;
/**
 * Normalize a {@link Vec2} and optionally stores result to the out param.
 * @returns v/|v|
 */
export declare function norm(v: ReadonlyVec2, out?: Vec2): Vec2;
//# sourceMappingURL=vec2.d.ts.map