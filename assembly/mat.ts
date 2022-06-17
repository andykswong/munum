import { Float, Int, ReadonlyVec, Vec } from './types';
import { EPSILON, fequal as fequalNum, lerp as lerpNum } from './scalar';

// Temp variables
const m = new Array<Float>(16);

/**
 * Generic function to copy elements from any array-like object to another.
 * @returns dst
 */
export function copy<T, U>(
  src: T, dst: U, srcOffset: Int = 0, dstOffset: Int = 0,
  // @ts-ignore: Skip type checking
  count: Int = src.length - srcOffset
): U {
  for (let i = 0; i < count; ++i) {
    // @ts-ignore: Skip type checking
    unchecked(dst[dstOffset + i] = src[srcOffset + i]);
  }
  return dst;
}

/**
 * Checks if 2 number arrays have equal length and equal values within an epsilon.
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
 * Sums 2 vectors.
 * @returns out = a + b
 */
export function add(a: ReadonlyVec, b: ReadonlyVec, out: Vec): Vec {
  for (let i = 0; i < a.length; ++i) {
    unchecked(out[i] = a[i] + b[i]);
  }
  return out;
}

/**
 * Subtracts 2 vectors.
 * @returns out = a - b
 */
export function sub(a: ReadonlyVec, b: ReadonlyVec, out: Vec): Vec {
  for (let i = 0; i < a.length; ++i) {
    unchecked(out[i] = a[i] - b[i]);
  }
  return out;
}

/**
 * Scales a vector by a constant.
 * @returns out = s * a
 */
export function scale(a: ReadonlyVec, s: Float, out: Vec): Vec {
  for (let i = 0; i < a.length; ++i) {
    unchecked(out[i] = a[i] * s);
  }
  return out;
}

/**
 * Calculates matrix multiplication of a * b, where size of a is (rr * n), and b is (n * rc).
 * @param n matrix order
 * @param a matrix of size rr * n
 * @param b matrix of size n * rc
 * @param out the output matrix of size rr * rc
 * @returns out = a * b
 */
 export function mul(n: Int, a: ReadonlyVec, b: ReadonlyVec, out: Vec): Vec {
  const rr = (a.length / n) as Int;
  const rc = (b.length / n) as Int;
  let f: Float = 0;
  m.length = rr * rc;

  for (let i = 0; i < rc; ++i) {
    for (let j = 0; j < rr; ++j) {
      f = 0;
      for (let k = 0; k < n; ++k) {
        f += unchecked(a[k * rr + j] * b[i * n + k]);
      }
      unchecked(m[i * rr + j] = f);
    }
  }
  copy(m, out, 0, 0, m.length);

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
 * Calculates the dot product of a 2 vectors.
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
 * Transposes a matrix.
 * @param n matrix order
 * @param m the matrix
 * @param out the output matrix
 * @returns out = [M]T
 */
export function transpose(n: Int, m: ReadonlyVec, out: Vec): Vec {
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
