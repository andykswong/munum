import {
  Float, Mat4, ortho, perspective, Quat, ReadonlyMat4, rotate, rotateX, rotateY, rotateZ, rotateAxis, rotationOf,
  scale, scaleOf, transform, translate, translationOf, Vec3, direction, vec3
} from '../index';
import { inverseTransform, lookAt, targetTo } from '../transform';
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

  test('inverseTransform(m)', () => {
    const m: ReadonlyMat4 = [2, 2, -1, 0, -2, 4, 4, 0, 6, -3, 6, 0, 1, 2, 3, 1];
    const expected: ReadonlyMat4 = [2/9, -1/18, 2/27, 0, 2/9, 1/9, -1/27, 0, -1/9, 1/9, 2/27, 0, -1/3, -1/2, -2/9, 1];
    const actual = inverseTransform(m);
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

  test('ortho(l, r, b, t, n, f)', () => {
    expectVecEqual(
      ortho(-3, 3, -4, 4, -2, 5),
      [
        1 / 3, 0, 0, 0,
        0, 1 / 4, 0, 0,
        0, 0, -2 / 7, 0,
        0, 0, -3 / 7, 1
      ] as Mat4
    );

    expectVecEqual(
      ortho(-1, 3, -7, 4, -2, 5),
      [
        1 / 2, 0, 0, 0,
        0, 2 / 11, 0, 0,
        0, 0, -2 / 7, 0,
        -1 / 2, 3 / 11, -3 / 7, 1
      ] as Mat4
    );
  });

  test('perspective(a, y, n)', () => {
    expectVecEqual(
      perspective(2, Math.PI as Float / 2, 1),
      [
        .5, 0, 0, 0,
        0, 1, 0, 0,
        0, 0, -1, -1,
        0, 0, -2, 0
      ] as Mat4
    );
  });

  test('perspective(a, y, n, f)', () => {
    expectVecEqual(
      perspective(2, Math.PI as Float / 2, 1, 9),
      [
        .5, 0, 0, 0,
        0, 1, 0, 0,
        0, 0, -1.25, -1,
        0, 0, -2.25, 0
      ] as Mat4
    );
  });

  test('targetTo(e, c, u)', () => {
    const eye = [0, 2, 0] as Vec3;
    const center = [0, 0.6, 0] as Vec3;
    const up = [0, 0, -1] as Vec3;

    const view = targetTo(eye, center, up);
    expectVecEqual(vec3.mmul4(view, [0, 2, 0]), [0, 2, -2] as Vec3);
    expectVecEqual(vec3.mmul4(view, [0, 2, -1]), [0, 1, -2] as Vec3);
    expectVecEqual(vec3.mmul4(view, [1, 2, 0]), [1, 2, -2] as Vec3);
    expectVecEqual(vec3.mmul4(view, [0, 1, 0]), [0, 2, -1] as Vec3);
  });

  test('lookAt(e, c, u)', () => {
    const eye = [0, 2, 0] as Vec3;
    const center = [0, 0.6, 0] as Vec3;
    const up = [0, 0, -1] as Vec3;

    const view = lookAt(eye, center, up);
    expectVecEqual(vec3.mmul4(view, [0, 2, 0]), [0, 0, 0] as Vec3);
    expectVecEqual(vec3.mmul4(view, [0, 2, -1]), [0, 1, 0] as Vec3);
    expectVecEqual(vec3.mmul4(view, [1, 2, 0]), [1, 0, 0] as Vec3);
    expectVecEqual(vec3.mmul4(view, [0, 1, 0]), [0, 0, -1] as Vec3);
  });

  test('direction(p, y)', () => {
    expectVecEqual(direction(0, 0), [0, 0, -1] as Vec3);
    expectVecEqual(direction(Math.PI as Float, 0), [0, 0, 1] as Vec3);
    expectVecEqual(direction(0, Math.PI as Float), [0, 0, 1] as Vec3);
    expectVecEqual(direction(Math.PI / 2 as Float, 0), [0, 1, 0] as Vec3);
    expectVecEqual(direction(0, -Math.PI / 2 as Float), [1, 0, 0] as Vec3);
    expectVecEqual(direction(Math.PI / 4 as Float, -Math.PI / 2 as Float), [Math.cos(Math.PI / 4) as Float, Math.sin(Math.PI / 4) as Float, 0] as Vec3);
  });
});
