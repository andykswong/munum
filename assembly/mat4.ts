import { Float, Mat3, Mat4, ReadonlyMat3, ReadonlyMat4 } from './types';
import * as mat3 from './mat3';
import * as mat from './mat';

// Temp variables
const m: Mat4 = create();

/**
 * Create a new identity {@link Mat4}.
 * @returns identity mat4
 */
export function create(): Mat4 {
  return [1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1];
}

/**
 * Set a {@link Mat4} to identity.
 * @returns out = I4
 */
export function id(out: Mat4): Mat4 {
  for (let i = 0; i < 16; ++i) {
    unchecked(out[i] = (i % 5) ? 0 : 1);
  }
  return out;
}

/**
 * Create a {@link Mat4} from {@link ReadonlyMat3}.
 * @param m input mat3
 * @param out output mat4
 * @returns out = [M 0 0 1]
 */
export function fromMat3(m: ReadonlyMat3, out: Mat4 = create()): Mat4 {
  for (let i = 0; i < 3; ++i) {
    for (let j = 0; j < 3; ++j) {
      unchecked(out[i * 4 + j] = m[i * 3 + j]);
    }
    unchecked(out[i * 4 + 3] = 0);
  }
  unchecked(out[12] = out[13] = out[14] = 0);
  unchecked(out[15] = 1);
  return out;
}

/**
 * Create a {@link Mat3} from upper-left 3x3 of a {@link ReadonlyMat4}.
 * @param m input mat4
 * @param out output mat3
 * @returns out = mat3(M)
 */
export function toMat3(m: ReadonlyMat4, out: Mat3 = mat3.create()): Mat3 {
  for (let i = 0; i < 3; ++i) {
    for (let j = 0; j < 3; ++j) {
      unchecked(out[i * 3 + j] = m[i * 4 + j]);
    }
  }
  return out;
}

/**
 * Copy a {@link Mat4}.
 * @returns out
 */
export function copy(v: ReadonlyMat4, out: Mat4 = create()): Mat4 {
  return mat.copy(v, out) as Mat4;
}

/**
 * Sum 2 {@link Mat4}.
 * @returns out = a + b
 */
export function add(a: ReadonlyMat4, b: ReadonlyMat4, out: Mat4 = create()): Mat4 {
  return mat.add(a, b, out) as Mat4;
}

/**
 * Subtract 2 {@link Mat4}.
 * @returns out = a - b
 */
export function sub(a: ReadonlyMat4, b: ReadonlyMat4, out: Mat4 = create()): Mat4 {
  return mat.sub(a, b, out) as Mat4;
}

/**
 * Multiply a {@link Mat4} by a constant.
 * @returns out = s * M
 */
export function scale(m: ReadonlyMat4, s: Float, out: Mat4 = create()): Mat4 {
  return mat.scale(m, s, out) as Mat4;
}

/**
 * Transpose a {@link Mat4}.
 * @returns [M]T
 */
export function transpose(m: ReadonlyMat4, out: Mat4 = create()): Mat4 {
  return mat.transpose(4, m, out) as Mat4;
}

/**
 * Multiply 2 {@link Mat4}.
 * @returns out = a * b
 */
export function mul(a: ReadonlyMat4, b: ReadonlyMat4, out: Mat4 = create()): Mat4 {
  return mat.mul(4, a, b, out) as Mat4;
}

/**
 * Returns inverse of a {@link Mat4}, or null if matrix is not invertible.
 * @param a input matrix
 * @param out output matrix
 * @returns out = M^-1, or null if matrix is not invertible
 */
export function invert(a: ReadonlyMat4, out: Mat4 = create()): Mat4 | null {
  const fA0: Float = unchecked(a[0] * a[5] - a[4] * a[1]);
  const fA1: Float = unchecked(a[0] * a[9] - a[8] * a[1]);
  const fA2: Float = unchecked(a[0] * a[13] - a[12] * a[1]);
  const fA3: Float = unchecked(a[4] * a[9] - a[8] * a[5]);
  const fA4: Float = unchecked(a[4] * a[13] - a[12] * a[5]);
  const fA5: Float = unchecked(a[8] * a[13] - a[12] * a[9]);
  const fB0: Float = unchecked(a[2] * a[7] - a[6] * a[3]);
  const fB1: Float = unchecked(a[2] * a[11] - a[10] * a[3]);
  const fB2: Float = unchecked(a[2] * a[15] - a[14] * a[3]);
  const fB3: Float = unchecked(a[6] * a[11] - a[10] * a[7]);
  const fB4: Float = unchecked(a[6] * a[15] - a[14] * a[7]);
  const fB5: Float = unchecked(a[10] * a[15] - a[14] * a[11]);

  const detA: Float = fA0 * fB5 - fA1 * fB4 + fA2 * fB3 + fA3 * fB2 - fA4 * fB1 + fA5 * fB0;

  if (!detA) {
    return null;
  }

  unchecked(m[0] = +a[5] * fB5 - a[9] * fB4 + a[13] * fB3);
  unchecked(m[1] = -a[1] * fB5 + a[9] * fB2 - a[13] * fB1);
  unchecked(m[2] = +a[1] * fB4 - a[5] * fB2 + a[13] * fB0);
  unchecked(m[3] = -a[1] * fB3 + a[5] * fB1 - a[9] * fB0);
  unchecked(m[4] = -a[4] * fB5 + a[8] * fB4 - a[12] * fB3);
  unchecked(m[5] = +a[0] * fB5 - a[8] * fB2 + a[12] * fB1);
  unchecked(m[6] = -a[0] * fB4 + a[4] * fB2 - a[12] * fB0);
  unchecked(m[7] = +a[0] * fB3 - a[4] * fB1 + a[8] * fB0);
  unchecked(m[8] = +a[7] * fA5 - a[11] * fA4 + a[15] * fA3);
  unchecked(m[9] = -a[3] * fA5 + a[11] * fA2 - a[15] * fA1);
  unchecked(m[10] = +a[3] * fA4 - a[7] * fA2 + a[15] * fA0);
  unchecked(m[11] = -a[3] * fA3 + a[7] * fA1 - a[11] * fA0);
  unchecked(m[12] = -a[6] * fA5 + a[10] * fA4 - a[14] * fA3);
  unchecked(m[13] = +a[2] * fA5 - a[10] * fA2 + a[14] * fA1);
  unchecked(m[14] = -a[2] * fA4 + a[6] * fA2 - a[14] * fA0);
  unchecked(m[15] = +a[2] * fA3 - a[6] * fA1 + a[10] * fA0);

  return scale(m, 1 / detA, out);
}

/**
 * Returns the 3x3 normal matrix, which is the inverse transpose matrix, from a {@link ReadonlyMat4}.
 * Returns null if original matrix is not invertible.
 * @param a input matrix
 * @param out output matrix
 * @returns out = (mat3(M)^-1)T, or null if matrix is not invertible
 */
export function nmat3(a: ReadonlyMat4, out: Mat3 = mat3.create()): Mat3 | null {
  return mat3.nmat(toMat3(a, out), out)
}
