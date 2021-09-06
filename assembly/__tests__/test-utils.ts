import { ReadonlyFrustum, Vec } from '../index';
import { ReadonlyAABB } from '../types';

export function expectAABBEqual(actual: ReadonlyAABB, expected: ReadonlyAABB): void {
  expectVecEqual(actual.min, expected.min);
  expectVecEqual(actual.max, expected.max);
}

export function expectFrustumEqual(actual: ReadonlyFrustum, expected: ReadonlyFrustum): void {
  for (let i = 0; i < 6; ++i) {
    for (let j = 0; j < 4; ++j) {
      expect(actual[i][j]).toBeCloseTo(expected[i][j]);
    }
  }
}

export function expectVecEqual<T = Vec, U = Vec>(actual: T, expected: U): void {
  // @ts-ignore: Skip type checking
  for (let i = 0; i < expected.length; ++i) {
    // @ts-ignore: Skip type checking
    expect(actual[i]).toBeCloseTo(expected[i]);
  }
}
