import { lerp as lerpNum } from '../scalar.ts';
import { BYTES_PER_FLOAT64, ManagedFloat64Array, memoryManager } from './memory.ts';

const TEMP = Array(16);

export function add<N extends number>(lhs: ManagedFloat64Array<N>, rhs: ManagedFloat64Array<N>) {
  const left = (lhs.byteOffset / BYTES_PER_FLOAT64) | 0;
  const right = (rhs.byteOffset / BYTES_PER_FLOAT64) | 0;
  const view = memoryManager.view;
  for (let i = 0; i < lhs.length; ++i) {
    view[left + i] += view[right + i];
  }
}

export function sub<N extends number>(lhs: ManagedFloat64Array<N>, rhs: ManagedFloat64Array<N>) {
  const left = (lhs.byteOffset / BYTES_PER_FLOAT64) | 0;
  const right = (rhs.byteOffset / BYTES_PER_FLOAT64) | 0;
  const view = memoryManager.view;
  for (let i = 0; i < lhs.length; ++i) {
    view[left + i] -= view[right + i];
  }
}

export function scale<N extends number>(lhs: ManagedFloat64Array<N>, factor: number) {
  const left = (lhs.byteOffset / BYTES_PER_FLOAT64) | 0;
  const view = memoryManager.view;
  for (let i = 0; i < lhs.length; ++i) {
    view[left + i] *= factor;
  }
}

export function dot<N extends number>(lhs: ManagedFloat64Array<N>, rhs: ManagedFloat64Array<N>): number {
  const left = (lhs.byteOffset / BYTES_PER_FLOAT64) | 0;
  const right = (rhs.byteOffset / BYTES_PER_FLOAT64) | 0;
  const view = memoryManager.view;
  let result = 0;
  for (let i = 0; i < lhs.length; ++i) {
    result += view[left + i] * view[right + i];
  }
  return result;
}

export function normalize<N extends number>(v: ManagedFloat64Array<N>): boolean {
  const sqrLen = dot(v, v);
  if (sqrLen === 0) {
    return false;
  }
  const len = Math.sqrt(sqrLen);

  const ptr = (v.byteOffset / BYTES_PER_FLOAT64) | 0;
  const view = memoryManager.view;
  for (let i = 0; i < v.length; ++i) {
    view[ptr + i] /= len;
  }
  return true;
}

export function lerp<N extends number>(lhs: ManagedFloat64Array<N>, rhs: ManagedFloat64Array<N>, t: number) {
  const left = (lhs.byteOffset / BYTES_PER_FLOAT64) | 0;
  const right = (rhs.byteOffset / BYTES_PER_FLOAT64) | 0;
  const view = memoryManager.view;
  for (let i = 0; i < lhs.length; ++i) {
    view[left + i] = lerpNum(view[left + i], view[right + i], t);
  }
}

export function mul<M extends number, R extends number>(
  lhs: ManagedFloat64Array<M>, rhs: ManagedFloat64Array<R>, n: number, assignRight = false
) {
  const rr = (lhs.length / n);
  const rc = (rhs.length / n);
  const left = (lhs.byteOffset / BYTES_PER_FLOAT64) | 0;
  const right = (rhs.byteOffset / BYTES_PER_FLOAT64) | 0;
  const view = memoryManager.view;

  for (let i = 0; i < rc; ++i) {
    for (let j = 0; j < rr; ++j) {
      let f = 0;
      for (let k = 0; k < n; ++k) {
        f += view[left + k * rr + j] * view[right + i * n + k];
      }
      TEMP[i * rr + j] = f;
    }
  }

  const target = assignRight ? rhs : lhs;
  const targetPtr = assignRight ? right : left;
  for (let i = 0; i < target.length; ++i) {
    view[targetPtr + i] = TEMP[i];
  }
}

export function transpose<N extends number>(m: ManagedFloat64Array<N>, n: number) {
  const ptr = (m.byteOffset / BYTES_PER_FLOAT64) | 0;
  const view = memoryManager.view;

  for (let i = 0; i < n; ++i) {
    for (let j = i; j < n; ++j) {
      // Swap mij and mji
      const f = view[ptr + j * n + i];
      view[ptr + j * n + i] = view[ptr + i * n + j];
      view[ptr + i * n + j] = f;
    }
  }
}
