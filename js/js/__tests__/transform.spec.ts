import { expectArrayEqual } from '../../__tests__/test-utils.ts';
import { Mat3, Mat4 } from '../mat.ts';
import { Quat } from '../quat.ts';
import {
  translation2d, rotation2d, scaling2d, transformation2d,
  translation, scaling, rotation, translationOf, scalingOf, rotationOf, transformation, inverseTRS,
  lookAt, lookAtDir, ortho, perspective, perspectiveViewport, targetTo
} from '../transform.ts';
import { Vec2, Vec3 } from '../vec.ts';

const PI_OVER_6 = Math.PI / 6;
const COS_PI_OVER_6 = Math.sqrt(3) / 2;
const SIN_PI_OVER_6 = 0.5;
const ONE_OVER_SQRT3 = 1 / Math.sqrt(3);

describe('transfrom2d', () => {
  test('translation2d', () => {
    const m = Mat3.identity();
    const v = new Vec2(2, 3);
    const actual = translation2d(v, m);
    expect(actual).toBe(m);
    expectArrayEqual(actual, [1, 0, 0, 0, 1, 0, 2, 3, 1]);
  });

  test('scaling2d', () => {
    const m = Mat3.identity();
    const v = new Vec2(2, 3);
    const actual = scaling2d(v, m);
    expect(actual).toBe(m);
    expectArrayEqual(actual, [2, 0, 0, 0, 3, 0, 0, 0, 1]);
  });

  test('rotation2d', () => {
    const m = Mat3.identity();
    const actual = rotation2d(PI_OVER_6, m);
    expect(actual).toBe(m);
    expectArrayEqual(actual, [COS_PI_OVER_6, SIN_PI_OVER_6, 0, -SIN_PI_OVER_6, COS_PI_OVER_6, 0, 0, 0, 1]);
  });

  test('transformation2d', () => {
    const m = Mat3.identity();
    const t = new Vec2(11, 13);
    const s = new Vec2(5, 7);
    const actual = transformation2d(t, PI_OVER_6, s, m);
    expect(actual).toBe(m);
    expectArrayEqual(actual, [5 * COS_PI_OVER_6, 5 * SIN_PI_OVER_6, 0, -7 * SIN_PI_OVER_6, 7 * COS_PI_OVER_6, 0, 11, 13, 1]);
  });
});

describe('transform', () => {
  test('translation', () => {
    const m = Mat4.identity();
    const expected = [1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 2, 3, 5, 1];
    const actual = translation(new Vec3(2, 3, 5), m);
    expect(actual).toBe(m);
    expectArrayEqual(actual, expected);
  });

  test('scaling', () => {
    const m = Mat4.identity();
    const expected = [2, 0, 0, 0, 0, 3, 0, 0, 0, 0, 5, 0, 0, 0, 0, 1];
    const actual = scaling(new Vec3(2, 3, 5), m);
    expect(actual).toBe(m);
    expectArrayEqual(actual, expected);
  });

  test('rotation', () => {
    const m = Mat4.identity();
    const q = Quat.identity();
    q.set([ONE_OVER_SQRT3, ONE_OVER_SQRT3, ONE_OVER_SQRT3, 0]);
    const expected = [-1 / 3, 2 / 3, 2 / 3, 0, 2 / 3, -1 / 3, 2 / 3, 0, 2 / 3, 2 / 3, -1 / 3, 0, 0, 0, 0, 1];
    const actual = rotation(q, m);
    expect(actual).toBe(m);
    expectArrayEqual(actual, expected);
  });

  test('transformation', () => {
    const m = Mat4.identity();
    const r = Quat.identity();
    r.set([ONE_OVER_SQRT3 * SIN_PI_OVER_6, ONE_OVER_SQRT3 * SIN_PI_OVER_6, ONE_OVER_SQRT3 * SIN_PI_OVER_6, COS_PI_OVER_6]);
    const expected = [2, 2, -1, 0, -2, 4, 4, 0, 6, -3, 6, 0, 1, 2, 3, 1];
    const actual = transformation(
      new Vec3(1, 2, 3),
      r,
      new Vec3(3, 6, 9),
      m
    );
    expect(actual).toBe(m);
    expectArrayEqual(actual, expected);
  });

  test('inverseTRS', () => {
    const m = Mat4.identity();
    m.set([2, 2, -1, 0, -2, 4, 4, 0, 6, -3, 6, 0, 1, 2, 3, 1]);
    const expected = [2 / 9, -1 / 18, 2 / 27, 0, 2 / 9, 1 / 9, -1 / 27, 0, -1 / 9, 1 / 9, 2 / 27, 0, -1 / 3, -1 / 2, -2 / 9, 1];
    expect(inverseTRS(m, m)).toBe(true);
    expectArrayEqual(m, expected);
  });

  test('translationOf', () => {
    const m = Mat4.identity();
    m.set([2, 2, -1, 0, -2, 4, 4, 0, 6, -3, 6, 0, 1, 2, 3, 1]);
    expectArrayEqual(translationOf(m), [1, 2, 3]);
  });

  test('scalingOf', () => {
    const m = Mat4.identity();
    m.set([2, 2, -1, 0, -2, 4, 4, 0, 6, -3, 6, 0, 1, 2, 3, 1]);
    expectArrayEqual(scalingOf(m), [3, 6, 9]);
  });

  test('rotationOf', () => {
    const m = Mat4.identity();
    m.set([2, 2, -1, 0, -2, 4, 4, 0, 6, -3, 6, 0, 1, 2, 3, 1]);
    expectArrayEqual(
      rotationOf(m),
      [ONE_OVER_SQRT3 * SIN_PI_OVER_6, ONE_OVER_SQRT3 * SIN_PI_OVER_6, ONE_OVER_SQRT3 * SIN_PI_OVER_6, COS_PI_OVER_6]
    );
  });

  test('ortho', () => {
    expectArrayEqual(
      ortho(-3, 3, -4, 4, -2, 5),
      [
        1 / 3, 0, 0, 0,
        0, 1 / 4, 0, 0,
        0, 0, -2 / 7, 0,
        0, 0, -3 / 7, 1
      ]
    );

    expectArrayEqual(
      ortho(-1, 3, -7, 4, -2, 5),
      [
        1 / 2, 0, 0, 0,
        0, 2 / 11, 0, 0,
        0, 0, -2 / 7, 0,
        -1 / 2, 3 / 11, -3 / 7, 1
      ]
    );
  });

  test('perspective', () => {
    expectArrayEqual(
      perspective(2, Math.PI / 2, 1, Infinity),
      [
        .5, 0, 0, 0,
        0, 1, 0, 0,
        0, 0, -1, -1,
        0, 0, -2, 0
      ]
    );

    expectArrayEqual(
      perspective(2, Math.PI / 2, 1, 9),
      [
        .5, 0, 0, 0,
        0, 1, 0, 0,
        0, 0, -1.25, -1,
        0, 0, -2.25, 0
      ]
    );
  });

  test('perspectiveViewport', () => {
    expectArrayEqual(
      perspectiveViewport(-1.0, 3.0, -0.5, 1.5, 1., Infinity),
      [
        0.5, 0., 0., 0.,
        0., 1., 0., 0.,
        0.5, 0.5, -1., -1.,
        0., 0., -2., 0.
      ]
    );
  });

  test('targetTo', () => {
    const eye = new Vec3(0, 2, 0);
    const center = new Vec3(0, 0.6, 0);
    const up = new Vec3(0, 0, -1);

    const view = targetTo(eye, center, up);
    const v = new Vec3(0, 2, 0);
    expectArrayEqual(v.mulMat4(view), [0, 2, -2]);
    v.set([0, 2, -1]);
    expectArrayEqual(v.mulMat4(view), [0, 1, -2]);
    v.set([1, 2, 0]);
    expectArrayEqual(v.mulMat4(view), [1, 2, -2]);
    v.set([0, 1, 0]);
    expectArrayEqual(v.mulMat4(view), [0, 2, -1]);
  });

  test('lookAt', () => {
    const eye = new Vec3(0, 2, 0);
    const center = new Vec3(0, 0.6, 0);
    const up = new Vec3(0, 0, -1);

    const view = lookAt(eye, center, up);
    const v = new Vec3(0, 2, 0);
    expectArrayEqual(v.mulMat4(view), [0, 0, 0]);
    v.set([0, 2, -1]);
    expectArrayEqual(v.mulMat4(view), [0, 1, 0]);
    v.set([1, 2, 0]);
    expectArrayEqual(v.mulMat4(view), [1, 0, 0]);
    v.set([0, 1, 0]);
    expectArrayEqual(v.mulMat4(view), [0, 0, -1]);
  });

  test('lookAtDir', () => {
    expectArrayEqual(lookAtDir(0, 0), [0, 0, -1]);
    expectArrayEqual(lookAtDir(Math.PI, 0), [0, 0, 1]);
    expectArrayEqual(lookAtDir(0, Math.PI), [0, 0, 1]);
    expectArrayEqual(lookAtDir(Math.PI / 2, 0), [0, 1, 0]);
    expectArrayEqual(lookAtDir(0, -Math.PI / 2), [1, 0, 0]);
    expectArrayEqual(lookAtDir(Math.PI / 4, -Math.PI / 2), [Math.cos(Math.PI / 4), Math.sin(Math.PI / 4), 0]);
  });
});
