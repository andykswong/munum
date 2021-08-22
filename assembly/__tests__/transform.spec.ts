import { Mat4, ReadonlyMat4, transform, translate, scale, rotate, rotateX, rotateY, rotateZ, rotateAxis } from '../index';
import { rotationOf, scaleOf, translationOf } from '../transform';
import { Float, Quat, Vec3 } from '../types';
import { expectVecEqual } from './test-utils';

const PI_OVER_3 = Math.PI as Float / 3;
const PI_OVER_6 = Math.PI as Float / 6;
const COS_PI_OVER_6 = Math.sqrt(3) as Float / 2;
const SIN_PI_OVER_6 = 0.5 as Float;
const ONE_OVER_SQRT3 = 1 / Math.sqrt(3) as Float;

describe('transfrom', () => {
  test('translate(v)', () => {
    const m: Mat4 = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15];
    const expected: ReadonlyMat4 = [1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 2, 3, 5, 1];
    const actual = translate([2, 3, 5], m);
    expect(actual).toBe(m);
    expectVecEqual(actual, expected);
  });

  test('scale(v)', () => {
    const m: Mat4 = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15];
    const expected: ReadonlyMat4 = [2, 0, 0, 0, 0, 3, 0, 0, 0, 0, 5, 0, 0, 0, 0, 1];
    const actual = scale([2, 3, 5], m);
    expect(actual).toBe(m);
    expectVecEqual(actual, expected);
  });

  test('rotate(q)', () => {
    const m: Mat4 = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15];
    const expected: ReadonlyMat4 = [-1 / 3, 2 / 3, 2 / 3, 0, 2 / 3, -1 / 3, 2 / 3, 0, 2 / 3, 2 / 3, -1 / 3, 0, 0, 0, 0, 1];
    const actual = rotate([ONE_OVER_SQRT3, ONE_OVER_SQRT3, ONE_OVER_SQRT3, 0], m);
    expect(actual).toBe(m);
    expectVecEqual(actual, expected);
  });

  test('rotateX(a)', () => {
    const m: Mat4 = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15];
    const expected: ReadonlyMat4 = [1, 0, 0, 0, 0, COS_PI_OVER_6, SIN_PI_OVER_6, 0, 0, -SIN_PI_OVER_6, COS_PI_OVER_6, 0, 0, 0, 0, 1];
    const actual = rotateX(PI_OVER_6, m);
    expect(actual).toBe(m);
    expectVecEqual(actual, expected);
  });

  test('rotateY(a)', () => {
    const m: Mat4 = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15];
    const expected: ReadonlyMat4 = [COS_PI_OVER_6, 0, -SIN_PI_OVER_6, 0, 0, 1, 0, 0, SIN_PI_OVER_6, 0, COS_PI_OVER_6, 0, 0, 0, 0, 1];
    const actual = rotateY(PI_OVER_6, m);
    expect(actual).toBe(m);
    expectVecEqual(actual, expected);
  });

  test('rotateZ(a)', () => {
    const m: Mat4 = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15];
    const expected: ReadonlyMat4 = [COS_PI_OVER_6, SIN_PI_OVER_6, 0, 0, -SIN_PI_OVER_6, COS_PI_OVER_6, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1];
    const actual = rotateZ(PI_OVER_6, m);
    expect(actual).toBe(m);
    expectVecEqual(actual, expected);
  });

  test('rotateAxis(v, a)', () => {
    const m: Mat4 = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15];
    const expected: ReadonlyMat4 = [2 / 3, 2 / 3, -1 / 3, 0, -1 / 3, 2 / 3, 2 / 3, 0, 2 / 3, -1 / 3, 2 / 3, 0, 0, 0, 0, 1];
    const actual = rotateAxis([ONE_OVER_SQRT3, ONE_OVER_SQRT3, ONE_OVER_SQRT3], PI_OVER_3, m);
    expect(actual).toBe(m);
    expectVecEqual(actual, expected);
  });

  test('transform(t, r, s)', () => {
    const m: Mat4 = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15];
    const expected: ReadonlyMat4 = [2, 2, -1, 0, -2, 4, 4, 0, 6, -3, 6, 0, 1, 2, 3, 1];
    const actual = transform(
      [1, 2, 3],
      [ONE_OVER_SQRT3 * SIN_PI_OVER_6, ONE_OVER_SQRT3 * SIN_PI_OVER_6, ONE_OVER_SQRT3 * SIN_PI_OVER_6, COS_PI_OVER_6],
      [3, 6, 9],
      m
    );
    expect(actual).toBe(m);
    expectVecEqual(actual, expected);
  });

  test('translationOf(m)', () => {
    expectVecEqual(translationOf([2, 2, -1, 0, -2, 4, 4, 0, 6, -3, 6, 0, 1, 2, 3, 1]), [1, 2, 3] as Vec3);
  });

  test('scaleOf(m)', () => {
    expectVecEqual(scaleOf([2, 2, -1, 0, -2, 4, 4, 0, 6, -3, 6, 0, 1, 2, 3, 1]), [3, 6, 9] as Vec3);
  });

  test('rotationOf(m)', () => {
    expectVecEqual(
      rotationOf([2, 2, -1, 0, -2, 4, 4, 0, 6, -3, 6, 0, 1, 2, 3, 1]),
      [ONE_OVER_SQRT3 * SIN_PI_OVER_6, ONE_OVER_SQRT3 * SIN_PI_OVER_6, ONE_OVER_SQRT3 * SIN_PI_OVER_6, COS_PI_OVER_6] as Quat
    );
  });
});
