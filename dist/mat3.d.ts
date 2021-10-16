import { Float, ReadonlyMat3, Mat3 } from './types';
/**
 * Create a new identity {@link Mat3}.
 * @returns identity mat3
 */
export declare function create(): Mat3;
/**
 * Set a {@link Mat3} to identity.
 * @returns out = I3
 */
export declare function id(out: Mat3): Mat3;
/**
 * Copy a {@link Mat3}.
 * @returns out
 */
export declare function copy(v: ReadonlyMat3, out?: Mat3): Mat3;
/**
 * Sum 2 {@link Mat3}.
 * @returns out = a + b
 */
export declare function add(a: ReadonlyMat3, b: ReadonlyMat3, out?: Mat3): Mat3;
/**
 * Subtract 2 {@link Mat3}.
 * @returns out = a - b
 */
export declare function sub(a: ReadonlyMat3, b: ReadonlyMat3, out?: Mat3): Mat3;
/**
 * Multiply a {@link Mat3} by a constant.
 * @returns out = s * M
 */
export declare function scale(m: ReadonlyMat3, s: Float, out?: Mat3): Mat3;
/**
 * Transpose a {@link Mat3}.
 * @returns [M]T
 */
export declare function transpose(m: ReadonlyMat3, out?: Mat3): Mat3;
/**
 * Multiply 2 {@link Mat3}.
 * @returns out = a * b
 */
export declare function mul(a: ReadonlyMat3, b: ReadonlyMat3, out?: Mat3): Mat3;
/**
 * Calculate the determinant of a {@link Mat3}.
 */
export declare function det(m: ReadonlyMat3): Float;
/**
 * Returns inverse of a {@link Mat3}, or null if matrix is not invertible.
 * @see https://en.wikipedia.org/wiki/Invertible_matrix#Inversion_of_3_%C3%97_3_matrices
 * @param a input matrix
 * @param out output matrix
 * @returns out = M^-1, or null if matrix is not invertible
 */
export declare function invert(a: ReadonlyMat3, out?: Mat3): Mat3 | null;
/**
 * Returns the normal matrix, which is the inverse transpose matrix, from a {@link ReadonlyMat3}.
 * @param a input matrix
 * @param out output matrix
 * @returns out = (M^-1)T, or null if matrix is not invertible
 */
export declare function nmat(a: ReadonlyMat3, out?: Mat3): Mat3 | null;
//# sourceMappingURL=mat3.d.ts.map