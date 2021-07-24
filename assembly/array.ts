import { Float, Int, ReadonlyVec, Vec } from './types';
import { EPSILON, fequal as fequalNum, lerp as lerpNum } from './scalar';

/**
 * Copy elements from one float vec to another, and returns the destination array.
 * @returns dst
 */
export function copy(
  src: ReadonlyVec, dst: Vec, srcOffset: Int = 0, dstOffset: Int = 0, count: Int = src.length - srcOffset
): Vec {
  for (let i = 0; i < count; ++i) {
    unchecked(dst[dstOffset + i] = src[srcOffset + i]);
  }
  return dst;
}

/**
 * Check if 2 number arrays have equal length and equal values within an epsilon.
 * @returns a == b
 */
export function fequal(a: ReadonlyVec, b: ReadonlyVec, epsilon: Float = EPSILON): boolean {
  if (a.length - b.length) {
    return false;
  }
  for (let i = 0; i < a.length; ++i) {
    if (!unchecked(fequalNum(a[i], b[i], epsilon))) {
      return false;
    }
  }
  return true;
}

/**
 * Sum 2 vectors.
 * @returns out = a + b
 */
export function add(a: ReadonlyVec, b: ReadonlyVec, out: Vec): Vec {
  for (let i = 0; i < a.length; ++i) {
    unchecked(out[i] = a[i] + b[i]);
  }
  return out;
}

/**
 * Subtract 2 vectors.
 * @returns out = a - b
 */
export function sub(a: ReadonlyVec, b: ReadonlyVec, out: Vec): Vec {
  for (let i = 0; i < a.length; ++i) {
    unchecked(out[i] = a[i] - b[i]);
  }
  return out;
}

/**
 * Scale a vector by a constant.
 * @returns out = s * a
 */
export function scale(a: ReadonlyVec, s: Float, out: Vec): Vec {
  for (let i = 0; i < a.length; ++i) {
    unchecked(out[i] = a[i] * s);
  }
  return out;
}

/**
 * Multiply 2 vectors component-wise.
 * @returns out = a * b
 */
export function mul(a: ReadonlyVec, b: ReadonlyVec, out: Vec): Vec {
  for (let i = 0; i < a.length; ++i) {
    unchecked(out[i] = a[i] * b[i]);
  }
  return out;
}

/**
 * Lerp 2 vectors.
 * @returns out = lerp(a, b, t)
 */
export function lerp(a: ReadonlyVec, b: ReadonlyVec, t: Float, out: Vec): Vec {
  for (let i = 0; i < a.length; ++i) {
    unchecked(out[i] = lerpNum(a[i], b[i], t));
  }
  return out;
}

/**
 * Calculate the dot product of a 2 vectors.
 * @returns a * b
 */
export function dot(a: ReadonlyVec, b: ReadonlyVec): Float {
  let f: Float = 0;
  for (let i = 0; i < a.length; ++i) {
    f += unchecked(a[i] * b[i]);
  }
  return f;
}

/**
 * Transpose a matrix.
 * @param n matrix order
 * @param m the matrix
 * @param out the output matrix
 * @returns out = [M]T
 */
export function tr(n: Int, m: ReadonlyVec, out: Vec): Vec {
  let f: Float = 0;
  for (let i = 0; i < n; ++i) {
    for (let j = i; j < n; ++j) {
      // Swap mij and mji
      f = unchecked(m[j * n + i]);
      unchecked(out[j * n + i] = m[i * n + j]);
      unchecked(out[i * n + j] = f);
    }
  }
  return out;
}

/**
 * Calculate matrix multiplication of a * b, where size of a is (rr * n), and b is (n * rc).
 * @param n matrix order
 * @param a matrix of size rr * n
 * @param b matrix of size n * rc
 * @param out the output matrix of size rr * rc, must not be the same object as a or b
 * @returns out = a * b
 */
export function mmul(n: Int, a: ReadonlyVec, b: ReadonlyVec, out: Vec): Vec {
  const rr = (a.length / n) as Int;
  const rc = (b.length / n) as Int;
  let f: Float = 0;

  for (let i = 0; i < rc; ++i) {
    for (let j = 0; j < rr; ++j) {
      f = 0;
      for (let k = 0; k < n; ++k) {
        f += unchecked(a[k * rr + j] * b[i * n + k]);
      }
      unchecked(out[i * rr + j] = f);
    }
  }

  return out;
}
