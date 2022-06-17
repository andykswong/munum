import { Float, ReadonlyMat3, Mat3 } from './types';
import * as mat from './mat';

// Temp variables
const m: Mat3 = create();

/**
 * Create a new identity {@link Mat3}.
 * @returns identity mat3
 */
export function create(): Mat3 {
  return [1, 0, 0, 0, 1, 0, 0, 0, 1];
}

/**
 * Set a {@link Mat3} to identity.
 * @returns out = I3
 */
export function id(out: Mat3): Mat3 {
  for (let i = 0; i < 9; ++i) {
    unchecked(out[i] = (i % 4) ? 0 : 1);
  }
  return out;
}

/**
 * Copy a {@link Mat3}.
 * @returns out
 */
export function copy(v: ReadonlyMat3, out: Mat3 = create()): Mat3 {
  return mat.copy(v, out) as Mat3;
}

/**
 * Sum 2 {@link Mat3}.
 * @returns out = a + b
 */
export function add(a: ReadonlyMat3, b: ReadonlyMat3, out: Mat3 = create()): Mat3 {
  return mat.add(a, b, out) as Mat3;
}

/**
 * Subtract 2 {@link Mat3}.
 * @returns out = a - b
 */
export function sub(a: ReadonlyMat3, b: ReadonlyMat3, out: Mat3 = create()): Mat3 {
  return mat.sub(a, b, out) as Mat3;
}

/**
 * Multiply a {@link Mat3} by a constant.
 * @returns out = s * M
 */
export function scale(m: ReadonlyMat3, s: Float, out: Mat3 = create()): Mat3 {
  return mat.scale(m, s, out) as Mat3;
}

/**
 * Transpose a {@link Mat3}.
 * @returns [M]T
 */
export function transpose(m: ReadonlyMat3, out: Mat3 = create()): Mat3 {
  return mat.transpose(3, m, out) as Mat3;
}

/**
 * Multiply 2 {@link Mat3}.
 * @returns out = a * b
 */
export function mul(a: ReadonlyMat3, b: ReadonlyMat3, out: Mat3 = create()): Mat3 {
  return mat.mul(3, a, b, out) as Mat3;
}

/**
 * Calculate the determinant of a {@link Mat3}.
 */
export function det(m: ReadonlyMat3): Float {
  return unchecked(
    m[0] * +(m[4] * m[8] - m[7] * m[5]) +
    m[3] * -(m[1] * m[8] - m[7] * m[2]) +
    m[6] * +(m[1] * m[5] - m[4] * m[2])
  );
}

/**
 * Returns inverse of a {@link Mat3}, or null if matrix is not invertible.
 * @see https://en.wikipedia.org/wiki/Invertible_matrix#Inversion_of_3_%C3%97_3_matrices
 * @param a input matrix
 * @param out output matrix
 * @returns out = M^-1, or null if matrix is not invertible
 */
export function invert(a: ReadonlyMat3, out: Mat3 = create()): Mat3 | null {
  const detA: Float = det(a);
  if (!detA) {
    return null;
  }

  unchecked(m[0] = +(a[4] * a[8] - a[7] * a[5]));
  unchecked(m[1] = -(a[1] * a[8] - a[7] * a[2]));
  unchecked(m[2] = +(a[1] * a[5] - a[4] * a[2]));
  unchecked(m[3] = -(a[3] * a[8] - a[6] * a[5]));
  unchecked(m[4] = +(a[0] * a[8] - a[6] * a[2]));
  unchecked(m[5] = -(a[0] * a[5] - a[3] * a[2]));
  unchecked(m[6] = +(a[3] * a[7] - a[6] * a[4]));
  unchecked(m[7] = -(a[0] * a[7] - a[6] * a[1]));
  unchecked(m[8] = +(a[0] * a[4] - a[3] * a[1]));

  return scale(m, 1 / detA, out);
}

/**
 * Returns the normal matrix, which is the inverse transpose matrix, from a {@link ReadonlyMat3}.
 * @param a input matrix
 * @param out output matrix
 * @returns out = (M^-1)T, or null if matrix is not invertible
 */
export function nmat(a: ReadonlyMat3, out: Mat3 = create()): Mat3 | null {
  if (!invert(a, out)) {
    return null;
  }
  return transpose(out, out);
}
