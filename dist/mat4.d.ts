import { Float, Mat3, Mat4, ReadonlyMat3, ReadonlyMat4 } from './types';
/**
 * Create a new identity {@link Mat4}.
 * @returns identity mat4
 */
export declare function create(): Mat4;
/**
 * Set a {@link Mat4} to identity.
 * @returns out = I4
 */
export declare function id(out: Mat4): Mat4;
/**
 * Create a {@link Mat4} from {@link ReadonlyMat3}.
 * @param m input mat3
 * @param out output mat4
 * @returns out = [M 0 0 1]
 */
export declare function fromMat3(m: ReadonlyMat3, out?: Mat4): Mat4;
/**
 * Create a {@link Mat3} from upper-left 3x3 of a {@link ReadonlyMat4}.
 * @param m input mat4
 * @param out output mat3
 * @returns out = mat3(M)
 */
export declare function toMat3(m: ReadonlyMat4, out?: Mat3): Mat3;
/**
 * Copy a {@link Mat4}.
 * @returns out
 */
export declare function copy(v: ReadonlyMat4, out?: Mat4): Mat4;
/**
 * Sum 2 {@link Mat4}.
 * @returns out = a + b
 */
export declare function add(a: ReadonlyMat4, b: ReadonlyMat4, out?: Mat4): Mat4;
/**
 * Subtract 2 {@link Mat4}.
 * @returns out = a - b
 */
export declare function sub(a: ReadonlyMat4, b: ReadonlyMat4, out?: Mat4): Mat4;
/**
 * Multiply a {@link Mat4} by a constant.
 * @returns out = s * M
 */
export declare function scale(m: ReadonlyMat4, s: Float, out?: Mat4): Mat4;
/**
 * Transpose a {@link Mat4}.
 * @returns [M]T
 */
export declare function tr(m: ReadonlyMat4, out?: Mat4): Mat4;
/**
 * Multiply 2 {@link Mat4}.
 * @returns out = a * b
 */
export declare function mul(a: ReadonlyMat4, b: ReadonlyMat4, out?: Mat4): Mat4;
/**
 * Returns inverse of a {@link Mat4}, or null if matrix is not invertible.
 * @param a input matrix
 * @param out output matrix
 * @returns out = M^-1, or null if matrix is not invertible
 */
export declare function invert(a: ReadonlyMat4, out?: Mat4): Mat4 | null;
/**
 * Returns the 3x3 normal matrix, which is the inverse transpose matrix, from a {@link ReadonlyMat4}.
 * Returns null if original matrix is not invertible.
 * @param a input matrix
 * @param out output matrix
 * @returns out = (mat3(M)^-1)T, or null if matrix is not invertible
 */
export declare function nmat3(a: ReadonlyMat4, out?: Mat3): Mat3 | null;
//# sourceMappingURL=mat4.d.ts.map