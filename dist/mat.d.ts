import { Float, Int, ReadonlyVec, Vec } from './types';
/**
 * Generic function to copy elements from any array-like object to another.
 * @returns dst
 */
export declare function copy<T, U>(src: T, dst: U, srcOffset?: Int, dstOffset?: Int, count?: Int): U;
/**
 * Checks if 2 number arrays have equal length and equal values within an epsilon.
 * @returns a == b
 */
export declare function fequal(a: ReadonlyVec, b: ReadonlyVec, epsilon?: Float): boolean;
/**
 * Sums 2 vectors.
 * @returns out = a + b
 */
export declare function add(a: ReadonlyVec, b: ReadonlyVec, out: Vec): Vec;
/**
 * Subtracts 2 vectors.
 * @returns out = a - b
 */
export declare function sub(a: ReadonlyVec, b: ReadonlyVec, out: Vec): Vec;
/**
 * Scales a vector by a constant.
 * @returns out = s * a
 */
export declare function scale(a: ReadonlyVec, s: Float, out: Vec): Vec;
/**
 * Calculates matrix multiplication of a * b, where size of a is (rr * n), and b is (n * rc).
 * @param n matrix order
 * @param a matrix of size rr * n
 * @param b matrix of size n * rc
 * @param out the output matrix of size rr * rc
 * @returns out = a * b
 */
export declare function mul(n: Int, a: ReadonlyVec, b: ReadonlyVec, out: Vec): Vec;
/**
 * Lerp 2 vectors.
 * @returns out = lerp(a, b, t)
 */
export declare function lerp(a: ReadonlyVec, b: ReadonlyVec, t: Float, out: Vec): Vec;
/**
 * Calculates the dot product of a 2 vectors.
 * @returns a * b
 */
export declare function dot(a: ReadonlyVec, b: ReadonlyVec): Float;
/**
 * Transposes a matrix.
 * @param n matrix order
 * @param m the matrix
 * @param out the output matrix
 * @returns out = [M]T
 */
export declare function transpose(n: Int, m: ReadonlyVec, out: Vec): Vec;
//# sourceMappingURL=mat.d.ts.map