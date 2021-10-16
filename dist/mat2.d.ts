import { Float, ReadonlyMat2, Mat2, ReadonlyMat3 } from './types';
/**
 * Create a new identity {@link Mat2}.
 * @returns identity Mat2
 */
export declare function create(): Mat2;
/**
 * Set a {@link Mat2} to identity.
 * @returns out = I2
 */
export declare function id(out: Mat2): Mat2;
/**
 * Create a {@link Mat2} from {@link ReadonlyMat3}.
 * @returns identity Mat2
 */
export declare function fromMat3(m: ReadonlyMat3, out?: Mat2): Mat2;
/**
 * Copy a {@link Mat2}.
 * @returns out
 */
export declare function copy(v: ReadonlyMat2, out?: Mat2): Mat2;
/**
 * Sum 2 {@link Mat2}.
 * @returns out = a + b
 */
export declare function add(a: ReadonlyMat2, b: ReadonlyMat2, out?: Mat2): Mat2;
/**
 * Subtract 2 {@link Mat2}.
 * @returns out = a - b
 */
export declare function sub(a: ReadonlyMat2, b: ReadonlyMat2, out?: Mat2): Mat2;
/**
 * Multiply a {@link Mat2} by a constant.
 * @returns out = s * M
 */
export declare function scale(m: ReadonlyMat2, s: Float, out?: Mat2): Mat2;
/**
 * Transpose a {@link Mat2}.
 * @returns [M]T
 */
export declare function transpose(m: ReadonlyMat2, out?: Mat2): Mat2;
/**
 * Multiply 2 {@link Mat2}.
 * @returns out = a * b
 */
export declare function mul(a: ReadonlyMat2, b: ReadonlyMat2, out?: Mat2): Mat2;
/**
 * Calculate the determinant of a {@link Mat2}.
 */
export declare function det(m: ReadonlyMat2): Float;
/**
 * Returns inverse of a {@link Mat2}, or null if matrix is not invertible.
 * @param a input matrix
 * @param out output matrix
 * @returns out = M^-1, or null if matrix is not invertible
 */
export declare function invert(a: ReadonlyMat2, out?: Mat2): Mat2 | null;
//# sourceMappingURL=mat2.d.ts.map