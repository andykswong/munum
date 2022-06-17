import { Float, ReadonlyMat3, ReadonlyMat4, ReadonlyVec3, Vec3 } from './types';
/**
 * Create a new {@link Vec3}.
 * @param x defaults to 0
 * @param y defaults to 0
 * @param z defaults to 0
 * @returns [x, y, z]
 */
export declare function create(x?: Float, y?: Float, z?: Float): Vec3;
/**
 * Set values of a {@link Vec3}.
 * @param v the vec
 * @param x defaults to 0
 * @param y defaults to 0
 * @param z defaults to 0
 * @returns v
 */
export declare function set(v: Vec3, x?: Float, y?: Float, z?: Float): Vec3;
/**
 * Copy a {@link Vec3}.
 * @returns out
 */
export declare function copy(v: ReadonlyVec3, out?: Vec3): Vec3;
/**
 * Sum 2 {@link Vec3}.
 * @returns out = a + b
 */
export declare function add(a: ReadonlyVec3, b: ReadonlyVec3, out?: Vec3): Vec3;
/**
 * Subtract 2 {@link Vec3}.
 * @returns out = a - b
 */
export declare function sub(a: ReadonlyVec3, b: ReadonlyVec3, out?: Vec3): Vec3;
/**
 * Multiply a {@link Vec3} by a constant.
 * @returns out = s * v
 */
export declare function scale(v: ReadonlyVec3, s: Float, out?: Vec3): Vec3;
/**
 * Multiply a {@link ReadonlyMat3} with a {@link Vec3}.
 * @returns out = m * v
 */
export declare function mmul(a: ReadonlyMat3, b: ReadonlyVec3, out?: Vec3): Vec3;
/**
 * Transform a {@link ReadonlyVec3} by a {@link ReadonlyMat4}.
 * @returns out = m * [x 1]
 */
export declare function mmul4(m: ReadonlyMat4, x: ReadonlyVec3, out?: Vec3): Vec3;
/**
 * Calculate the dot product of 2 {@link Vec3}.
 * @returns a * b
 */
export declare function dot(a: ReadonlyVec3, b: ReadonlyVec3): Float;
/**
 * Linear interpolate 2 {@link Vec3}.
 * @returns out = lerp(a, b, t)
 */
export declare function lerp(a: ReadonlyVec3, b: ReadonlyVec3, t: Float, out?: Vec3): Vec3;
/**
 * Calculate squared length of a {@link Vec3}.
 * @returns dot(v, v)
 */
export declare function sqrLen(v: ReadonlyVec3): Float;
/**
 * Calculate length of a {@link Vec3}.
 * @returns |v|
 */
export declare function len(v: ReadonlyVec3): Float;
/**
 * Calculate Euclidean distance of 2 {@link Vec3}.
 * @returns |a - b|
 */
export declare function dist(a: ReadonlyVec3, b: ReadonlyVec3): Float;
/**
 * Normalize a {@link Vec3} and optionally stores result to the out param.
 * @returns v/|v|
 */
export declare function norm(v: ReadonlyVec3, out?: Vec3): Vec3;
/**
 * Calculate cross product of 2 {@link Vec3}.
 * @returns out = a x b
 */
export declare function cross(a: ReadonlyVec3, b: ReadonlyVec3, out?: Vec3): Vec3;
//# sourceMappingURL=vec3.d.ts.map