import { Vec } from '../index';

export function expectVecEqual(actual: Vec, expected: Vec): void {
  for (let i = 0; i < expected.length; ++i) {
    expect(actual[i]).toBeCloseTo(expected[i]);
  }
}
