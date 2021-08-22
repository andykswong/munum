import { Mat3, ReadonlyMat3, transform2d, translate2d, scale2d, rotate2d } from '../index';
import { Float } from '../types';
import { expectVecEqual } from './test-utils';

const PI_OVER_6 = Math.PI as Float / 6;
const COS_PI_OVER_6 = Math.sqrt(3) as Float / 2;
const SIN_PI_OVER_6 = 0.5 as Float;

describe('transfrom2d', () => {
  test('translate2d(x, y)', () => {
    const m: Mat3 = [0, 1, 2, 3, 4, 5, 6, 7, 8];
    const expected: ReadonlyMat3 = [1, 0, 0, 0, 1, 0, 2, 3, 1];
    const actual = translate2d(2, 3, m);
    expect(actual).toBe(m);
    expectVecEqual(actual, expected);
  });

  test('scale(x, y)', () => {
    const m: Mat3 = [0, 1, 2, 3, 4, 5, 6, 7, 8];
    const expected: ReadonlyMat3 = [2, 0, 0, 0, 3, 0, 0, 0, 1];
    const actual = scale2d(2, 3, m);
    expect(actual).toBe(m);
    expectVecEqual(actual, expected);
  });

  test('rotate2d(x, y)', () => {
    const m: Mat3 = [0, 1, 2, 3, 4, 5, 6, 7, 8];
    const expected: ReadonlyMat3 = [COS_PI_OVER_6, SIN_PI_OVER_6, 0, -SIN_PI_OVER_6, COS_PI_OVER_6, 0, 0, 0, 1];
    const actual = rotate2d(PI_OVER_6, m);
    expect(actual).toBe(m);
    expectVecEqual(actual, expected);
  });

  test('transform2d(t, r, s)', () => {
    const m: Mat3 = [0, 1, 2, 3, 4, 5, 6, 7, 8];
    const expected: ReadonlyMat3 = [5 * COS_PI_OVER_6, 7 * SIN_PI_OVER_6, 0, -5 * SIN_PI_OVER_6, 7 * COS_PI_OVER_6, 0, 11, 13, 1];
    const actual = transform2d([11, 13], PI_OVER_6, [5, 7], m);
    expect(actual).toBe(m);
    expectVecEqual(actual, expected);
  });
});
