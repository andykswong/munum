import { lerp as lerpNum } from '../scalar.ts';
import type { ManagedTypedArray, TypedArray } from './memory.ts';

const TEMP = Array(16);

export function add<N extends number>(
  lhs: ManagedTypedArray<N, TypedArray>, rhs: ManagedTypedArray<N, TypedArray>,
) {
  const lv = lhs.view, rv = rhs.view;
  const l = lhs.index, r = rhs.index;
  for (let i = 0; i < lhs.length; ++i) {
    lv[l + i] += rv[r + i];
  }
}

export function sub<N extends number>(
  lhs: ManagedTypedArray<N, TypedArray>, rhs: ManagedTypedArray<N, TypedArray>,
) {
  const lv = lhs.view, rv = rhs.view;
  const l = lhs.index, r = rhs.index;
  for (let i = 0; i < lhs.length; ++i) {
    lv[l + i] -= rv[r + i];
  }
}

export function scale<N extends number>(lhs: ManagedTypedArray<N, TypedArray>, factor: number) {
  const view = lhs.view;
  const l = lhs.index;
  for (let i = 0; i < lhs.length; ++i) {
    view[l + i] *= factor;
  }
}

export function dot<N extends number>(
  lhs: ManagedTypedArray<N, TypedArray>, rhs: ManagedTypedArray<N, TypedArray>,
): number {
  const lv = lhs.view, rv = rhs.view;
  const l = lhs.index, r = rhs.index;
  let result = 0;
  for (let i = 0; i < lhs.length; ++i) {
    result += lv[l + i] * rv[r + i];
  }
  return result;
}

export function normalize<N extends number>(v: ManagedTypedArray<N, TypedArray>): boolean {
  const sqrLen = dot(v, v);
  if (sqrLen === 0) {
    return false;
  }
  const len = Math.sqrt(sqrLen);

  const view = v.view;
  const p = v.index;
  for (let i = 0; i < v.length; ++i) {
    view[p + i] /= len;
  }
  return true;
}

export function lerp<N extends number>(
  lhs: ManagedTypedArray<N, TypedArray>, rhs: ManagedTypedArray<N, TypedArray>, t: number,
) {
  const lv = lhs.view, rv = rhs.view;
  const l = lhs.index, r = rhs.index;
  for (let i = 0; i < lhs.length; ++i) {
    lv[l + i] = lerpNum(lv[l + i], rv[r + i], t);
  }
}

export function mul<M extends number, R extends number>(
  lhs: ManagedTypedArray<M, TypedArray>, rhs: ManagedTypedArray<R, TypedArray>,
  n: number, assignRight = false,
) {
  const rr = (lhs.length / n);
  const rc = (rhs.length / n);
  const lv = lhs.view, rv = rhs.view;
  const l = lhs.index, r = rhs.index;

  for (let i = 0; i < rc; ++i) {
    for (let j = 0; j < rr; ++j) {
      let f = 0;
      for (let k = 0; k < n; ++k) {
        f += lv[l + k * rr + j] * rv[r + i * n + k];
      }
      TEMP[i * rr + j] = f;
    }
  }

  const target = assignRight ? rhs : lhs;
  const tv = target.view;
  const t = target.index;
  for (let i = 0; i < target.length; ++i) {
    tv[t + i] = TEMP[i];
  }
}

export function transpose<N extends number>(m: ManagedTypedArray<N, TypedArray>, n: number) {
  const view = m.view;
  const p = m.index;

  for (let i = 0; i < n; ++i) {
    for (let j = i; j < n; ++j) {
      const f = view[p + j * n + i];
      view[p + j * n + i] = view[p + i * n + j];
      view[p + i * n + j] = f;
    }
  }
}
