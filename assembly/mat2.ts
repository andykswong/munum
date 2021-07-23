import { Float, ReadonlyMat2, Mat2, Int, ReadonlyVec2, Vec2, ReadonlyMat3 } from './types';
import * as vec2 from './vec2';
import * as array from './array';

const ORDER: Int = 2;

// Temp variables
const m: Mat2 = create();
const v: Vec2 = vec2.create();

/**
 * Create a new identity {@link Mat2}.
 * @returns identity Mat2
 */
export function create(): Mat2 {
  return [1, 0, 0, 1];
}

/**
 * Set a {@link Mat2} to identity.
 * @returns out = I2
 */
export function id(out: Mat2): Mat2 {
  out[0] = out[2] = 1;
  out[1] = out[3] = 0;
  return out;
}

/**
 * Create a {@link Mat2} from {@link ReadonlyMat3}.
 * @returns identity Mat2
 */
export function fromMat3(m: ReadonlyMat3, out: Mat2 = create()): Mat2 {
  out[0] = m[0];
  out[1] = m[1];
  out[2] = m[3];
  out[3] = m[4];
  return out;
}

/**
 * Copy a {@link Mat2}.
 * @returns out
 */
export const copy = (v: ReadonlyMat2, out: Mat2 = create()): Mat2 => array.copy(v, out) as Mat2;

/**
 * Sum 2 {@link Mat2}.
 * @returns out = a + b
 */
export const add = (a: ReadonlyMat2, b: ReadonlyMat2, out: Mat2 = create()): Mat2 => array.add(a, b, out) as Mat2;

/**
 * Subtract 2 {@link Mat2}.
 * @returns out = a - b
 */
export const sub = (a: ReadonlyMat2, b: ReadonlyMat2, out: Mat2 = create()): Mat2 => array.sub(a, b, out) as Mat2;

/**
 * Multiply a {@link Mat2} by a constant.
 * @returns out = s * M
 */
export const scale = (m: ReadonlyMat2, s: Float, out: Mat2 = create()): Mat2 => array.scale(m, s, out) as Mat2;

/**
 * Transpose a {@link Mat2}.
 * @returns [M]T
 */
export const tr = (m: ReadonlyMat2, out: Mat2 = create()): Mat2 => array.tr(ORDER, m, out) as Mat2;

/**
 * Multiply 2 {@link Mat2}.
 * @returns out = a * b
 */
export const mul = (a: ReadonlyMat2, b: ReadonlyMat2, out: Mat2 = create()): Mat2 =>
  array.copy(array.mmul(ORDER, a, b, m), out) as Mat2;

/**
 * Multiply a {@link Mat2} with a {@link Vec2}.
 * @returns out = m * v
 */
export const vmul = (a: ReadonlyMat2, b: ReadonlyVec2, out: Vec2 = vec2.create()): Vec2 =>
  array.copy(array.mmul(ORDER, a, b, v), out) as Vec2;

/**
 * Calculate the determinant of a {@link Mat2}.
 */
export function det(m: ReadonlyMat2): Float {
  return (m[0] * m[3] - m[2] * m[1]);
}

/**
 * Returns inverse of a {@link Mat2}, or null if matrix is not invertible.
 * @param a input matrix
 * @param out output matrix
 * @returns out = M^-1, or null if matrix is not invertible
 */
export function invert(a: ReadonlyMat2, out: Mat2 = create()): Mat2 | null {
  const detA: Float = det(a);
  if (!detA) {
    return null;
  }

  m[0] = a[3];
  m[1] = -a[1];
  m[2] = -a[2];
  m[3] = a[0];

  return scale(m, 1 / detA, out);
}
