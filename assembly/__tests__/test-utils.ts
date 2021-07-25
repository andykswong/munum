import { Vec } from '../index';

export function expectVecEqual<T = Vec, U = Vec>(actual: T, expected: U): void {
  // @ts-ignore: Skip type checking
  for (let i = 0; i < expected.length; ++i) {
    // @ts-ignore: Skip type checking
    expect(actual[i]).toBeCloseTo(expected[i]);
  }
}
