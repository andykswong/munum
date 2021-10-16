import { Float, Int, ReadonlyVec, Vec } from './types';
/**
 * Copy elements from one float vec to another, and returns the destination array.
 * @returns dst
 */
export declare function copy(src: ReadonlyVec, dst: Vec, srcOffset?: Int, dstOffset?: Int, count?: Int): Vec;
/**
 * Generic function to copy elements from any array-like object to another.
 * This is only useful for use within AssemblyScript. For JS build, you can simply use {@link copy}.
 */
export declare function copyEx<T, U>(src: T, dst: U, srcOffset: Int, dstOffset: Int, count: Int): U;
/**
 * Check if 2 number arrays have equal length and equal values within an epsilon.
 * @returns a == b
 */
export declare function fequal(a: ReadonlyVec, b: ReadonlyVec, epsilon?: Float): boolean;
/**
 * Sum 2 vectors.
 * @returns out = a + b
 */
export declare function add(a: ReadonlyVec, b: ReadonlyVec, out: Vec): Vec;
/**
 * Subtract 2 vectors.
 * @returns out = a - b
 */
export declare function sub(a: ReadonlyVec, b: ReadonlyVec, out: Vec): Vec;
/**
 * Scale a vector by a constant.
 * @returns out = s * a
 */
export declare function scale(a: ReadonlyVec, s: Float, out: Vec): Vec;
/**
 * Multiply 2 vectors component-wise.
 * @returns out = a * b
 */
export declare function mul(a: ReadonlyVec, b: ReadonlyVec, out: Vec): Vec;
/**
 * Lerp 2 vectors.
 * @returns out = lerp(a, b, t)
 */
export declare function lerp(a: ReadonlyVec, b: ReadonlyVec, t: Float, out: Vec): Vec;
/**
 * Calculate the dot product of a 2 vectors.
 * @returns a * b
 */
export declare function dot(a: ReadonlyVec, b: ReadonlyVec): Float;
/**
 * Transpose a matrix.
 * @param n matrix order
 * @param m the matrix
 * @param out the output matrix
 * @returns out = [M]T
 */
export declare function transpose(n: Int, m: ReadonlyVec, out: Vec): Vec;
/**
 * Calculate matrix multiplication of a * b, where size of a is (rr * n), and b is (n * rc).
 * @param n matrix order
 * @param a matrix of size rr * n
 * @param b matrix of size n * rc
 * @param out the output matrix of size rr * rc, must not be the same object as a or b
 * @returns out = a * b
 */
export declare function mmul(n: Int, a: ReadonlyVec, b: ReadonlyVec, out: Vec): Vec;
//# sourceMappingURL=array.d.ts.map