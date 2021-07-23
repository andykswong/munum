import { Float, Mat3, Mat4, Int, ReadonlyMat3, ReadonlyMat4, ReadonlyVec4, Vec4 } from './types';
import * as mat3 from './mat3';
import * as vec4 from './vec4';
import * as array from './array';

const ORDER: Int = 4;

// Temp variables
const m: Mat4 = create();
const v: Vec4 = vec4.create();

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
  for (let i: Int = 0; i < 16; ++i) {
    out[i] = (i % 5) ? 0 : 1;
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
  for (let i: Int = 0; i < 3; ++i) {
    for (let j: Int = 0; j < 3; ++j) {
      out[i * 4 + j] = m[i * 3 + j];
    }
    out[i * 4 + 3] = 0;
  }
  out[12] = out[13] = out[14] = 0;
  out[15] = 1;
  return out;
}

/**
 * Create a {@link Mat3} from upper-left 3x3 of a {@link ReadonlyMat4}.
 * @param m input mat4
 * @param out output mat3
 * @returns out = mat3(M)
 */
export function toMat3(m: ReadonlyMat4, out: Mat3 = mat3.create()): Mat3 {
  for (let i: Int = 0; i < 3; ++i) {
    for (let j: Int = 0; j < 3; ++j) {
      out[i * 3 + j] = m[i * 4 + j];
    }
  }
  return out;
}

/**
 * Copy a {@link Mat4}.
 * @returns out
 */
export const copy = (v: ReadonlyMat4, out: Mat4 = create()): Mat4 => array.copy(v, out) as Mat4;

/**
 * Sum 2 {@link Mat4}.
 * @returns out = a + b
 */
export const add = (a: ReadonlyMat4, b: ReadonlyMat4, out: Mat4 = create()): Mat4 => array.add(a, b, out) as Mat4;

/**
 * Subtract 2 {@link Mat4}.
 * @returns out = a - b
 */
export const sub = (a: ReadonlyMat4, b: ReadonlyMat4, out: Mat4 = create()): Mat4 => array.sub(a, b, out) as Mat4;

/**
 * Multiply a {@link Mat4} by a constant.
 * @returns out = s * M
 */
export const scale = (m: ReadonlyMat4, s: Float, out: Mat4 = create()): Mat4 => array.scale(m, s, out) as Mat4;

/**
 * Transpose a {@link Mat4}.
 * @returns [M]T
 */
export const tr = (m: ReadonlyMat4, out: Mat4 = create()): Mat4 => array.tr(ORDER, m, out) as Mat4;

/**
 * Multiply 2 {@link Mat4}.
 * @returns out = a * b
 */
export const mul = (a: ReadonlyMat4, b: ReadonlyMat4, out: Mat4 = create()): Mat4 =>
  array.copy(array.mmul(ORDER, a, b, m), out) as Mat4;

/**
 * Multiply a {@link Mat4} with a {@link Vec4}.
 * @returns out = m * v
 */
export const vmul = (a: ReadonlyMat4, b: ReadonlyVec4, out: Vec4 = vec4.create()): Vec4 =>
  array.copy(array.mmul(ORDER, a, b, v), out) as Vec4;

/**
 * Returns inverse of a {@link Mat4}, or null if matrix is not invertible.
 * @param a input matrix
 * @param out output matrix
 * @returns out = M^-1, or null if matrix is not invertible
 */
export function invert(a: ReadonlyMat4, out: Mat4 = create()): Mat4 | null {
  const fA0: Float = a[0] * a[5] - a[4] * a[1];
  const fA1: Float = a[0] * a[9] - a[8] * a[1];
  const fA2: Float = a[0] * a[13] - a[12] * a[1];
  const fA3: Float = a[4] * a[9] - a[8] * a[5];
  const fA4: Float = a[4] * a[13] - a[12] * a[5];
  const fA5: Float = a[8] * a[13] - a[12] * a[9];
  const fB0: Float = a[2] * a[7] - a[6] * a[3];
  const fB1: Float = a[2] * a[11] - a[10] * a[3];
  const fB2: Float = a[2] * a[15] - a[14] * a[3];
  const fB3: Float = a[6] * a[11] - a[10] * a[7];
  const fB4: Float = a[6] * a[15] - a[14] * a[7];
  const fB5: Float = a[10] * a[15] - a[14] * a[11];

  const detA: Float = fA0 * fB5 - fA1 * fB4 + fA2 * fB3 + fA3 * fB2 - fA4 * fB1 + fA5 * fB0;

  if (!detA) {
    return null;
  }

  m[0] = +a[5] * fB5 - a[9] * fB4 + a[13] * fB3;
  m[1] = -a[1] * fB5 + a[9] * fB2 - a[13] * fB1;
  m[2] = +a[1] * fB4 - a[5] * fB2 + a[13] * fB0;
  m[3] = -a[1] * fB3 + a[5] * fB1 - a[9] * fB0;
  m[4] = -a[4] * fB5 + a[8] * fB4 - a[12] * fB3;
  m[5] = +a[0] * fB5 - a[8] * fB2 + a[12] * fB1;
  m[6] = -a[0] * fB4 + a[4] * fB2 - a[12] * fB0;
  m[7] = +a[0] * fB3 - a[4] * fB1 + a[8] * fB0;
  m[8] = +a[7] * fA5 - a[11] * fA4 + a[15] * fA3;
  m[9] = -a[3] * fA5 + a[11] * fA2 - a[15] * fA1;
  m[10] = +a[3] * fA4 - a[7] * fA2 + a[15] * fA0;
  m[11] = -a[3] * fA3 + a[7] * fA1 - a[11] * fA0;
  m[12] = -a[6] * fA5 + a[10] * fA4 - a[14] * fA3;
  m[13] = +a[2] * fA5 - a[10] * fA2 + a[14] * fA1;
  m[14] = -a[2] * fA4 + a[6] * fA2 - a[14] * fA0;
  m[15] = +a[2] * fA3 - a[6] * fA1 + a[10] * fA0;

  return scale(m, 1 / detA, out);
}

/**
 * Returns the 3x3 normal matrix, which is the inverse transpose matrix, from a {@link ReadonlyMat4}.
 * Returns null if original matrix is not invertible.
 * @param a input matrix
 * @param out output matrix
 * @returns out = (mat3(M)^-1)T, or null if matrix is not invertible
 */
export function normMat3(a: ReadonlyMat4, out: Mat3 = mat3.create()): Mat3 | null {
  return mat3.normMat(toMat3(a, out), out)
}
