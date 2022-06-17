import { Float, ReadonlyMat4, ReadonlyVec3, ReadonlyVec4, Vec4 } from './types';
/**
 * Create a new {@link Vec4}.
 * @param x defaults to 0
 * @param y defaults to 0
 * @param z defaults to 0
 * @param w defaults to 0
 * @returns [x, y, z, w]
 */
export declare function create(x?: Float, y?: Float, z?: Float, w?: Float): Vec4;
/**
 * Set values of a {@link Vec4}.
 * @param v the vec
 * @param x defaults to 0
 * @param y defaults to 0
 * @param z defaults to 0
 * @param w defaults to 0
 * @returns v
 */
export declare function set(v: Vec4, x?: Float, y?: Float, z?: Float, w?: Float): Vec4;
/**
 * Create a {@link Vec4} from {@link ReadonlyVec3}.
 * @param v Vec3
 * @param out output Vec4
 * @returns [v[0], v[1], v[2], w]
 */
export declare function fromVec3(v: ReadonlyVec3, out?: Vec4): Vec4;
/**
 * Copy a {@link Vec4}.
 * @returns out
 */
export declare function copy(v: ReadonlyVec4, out?: Vec4): Vec4;
/**
 * Sum 2 {@link Vec4}.
 * @returns out = a + b
 */
export declare function add(a: ReadonlyVec4, b: ReadonlyVec4, out?: Vec4): Vec4;
/**
 * Subtract 2 {@link Vec4}.
 * @returns out = a - b
 */
export declare function sub(a: ReadonlyVec4, b: ReadonlyVec4, out?: Vec4): Vec4;
/**
 * Multiply a {@link Vec4} by a constant.
 * @returns out = s * v
 */
export declare function scale(v: ReadonlyVec4, s: Float, out?: Vec4): Vec4;
/**
 * Multiply a {@link ReadonlyMat4} with a {@link Vec4}.
 * @returns out = m * v
 */
export declare function mmul(a: ReadonlyMat4, b: ReadonlyVec4, out?: Vec4): Vec4;
/**
 * Calculate the dot product of 2 {@link Vec4}.
 * @returns a * b
 */
export declare function dot(a: ReadonlyVec4, b: ReadonlyVec4): Float;
/**
 * Linear interpolate 2 {@link Vec4}.
 * @returns out = lerp(a, b, t)
 */
export declare function lerp(a: ReadonlyVec4, b: ReadonlyVec4, t: Float, out?: Vec4): Vec4;
/**
 * Calculate squared length of a {@link Vec4}.
 * @returns dot(v, v)
 */
export declare function sqrLen(v: ReadonlyVec4): Float;
/**
 * Calculate length of a {@link Vec4}.
 * @returns |v|
 */
export declare function len(v: ReadonlyVec4): Float;
/**
 * Normalize a {@link Vec4} and optionally stores result to the out param.
 * @returns v/|v|
 */
export declare function norm(v: ReadonlyVec4, out?: Vec4): Vec4;
//# sourceMappingURL=vec4.d.ts.map