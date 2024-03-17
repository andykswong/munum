import { expectArrayEqual } from '../../__tests__/test-utils.ts';
import { Quat } from '../quat.ts';
import { Vec3 } from '../vec.ts';

const PI_OVER_3 = Math.PI / 3;
const COS_PI_OVER_6 = Math.sqrt(3) / 2;
const SIN_PI_OVER_6 = 0.5;
const SIN_PI_OVER_2 = 1 / Math.sqrt(2);

describe('Quat', () => {
  test('identity', () => {
    expectArrayEqual(Quat.identity(), [0, 0, 0, 1]);
  });

  test('fromUnitVecs(v1, v2)', () => {
    expectArrayEqual(Quat.fromUnitVecs(new Vec3(0, 0, 1), new Vec3(1, 0, 0)), [0, SIN_PI_OVER_2, 0, SIN_PI_OVER_2]);
    expectArrayEqual(Quat.fromUnitVecs(new Vec3(0, 0, 1), new Vec3(0, 0, -1)), [0, 1, 0, 0]);
    expectArrayEqual(Quat.fromUnitVecs(new Vec3(1, 0, 0), new Vec3(1, 0, 0)), [0, 0, 0, 1]);
  });

  test('fromAxisAngle', () => {
    expectArrayEqual(
      Quat.fromAxisAngle(new Vec3(3, 5, 7), PI_OVER_3),
      [3 * SIN_PI_OVER_6, 5 * SIN_PI_OVER_6, 7 * SIN_PI_OVER_6, COS_PI_OVER_6]
    );
  });

  test('fromAngleX', () => {
    expectArrayEqual(Quat.fromAngleX(PI_OVER_3), [SIN_PI_OVER_6, 0, 0, COS_PI_OVER_6]);
  });

  test('fromAngleY', () => {
    expectArrayEqual(Quat.fromAngleY(PI_OVER_3), [0, SIN_PI_OVER_6, 0, COS_PI_OVER_6]);
  });

  test('fromAngleZ', () => {
    expectArrayEqual(Quat.fromAngleZ(PI_OVER_3), [0, 0, SIN_PI_OVER_6, COS_PI_OVER_6]);
  });

  test('set', () => {
    const q = Quat.identity();
    q.set([1, 2, 3, 4]);
    expectArrayEqual(q, [1, 2, 3, 4]);
  });

  test('invert', () => {
    const q = Quat.identity();
    q.set([2, 5, 14, 8]);
    expect(q.invert()).toBe(true);
    expectArrayEqual(q, [-2 / 289, -5 / 289, -14 / 289, 8 / 289]);
  });

  test('mul', () => {
    const q = Quat.identity();
    q.set([2, 3, 5, -7]);
    const q2 = Quat.identity();
    q2.set([11, 13, -17, 19]);
    expectArrayEqual(q.mul(q2), [-155, 55, 207, -109]);
  });

  test('dot', () => {
    const q = Quat.identity();
    q.set([29, 31, 37, 41]);
    const q2 = Quat.identity();
    q2.set([43, 47, 53, 59]);
    expect(q.dot(q2)).toBe(7084);
  });

  test('rotate', () => {
    const q = Quat.identity();
    q.set([0, SIN_PI_OVER_2, 0, SIN_PI_OVER_2]);
    const v = new Vec3(1, 1, 1);
    expectArrayEqual(q.rotate(v), [1, 1, -1]);
  });

  test('lerp', () => {
    const q = Quat.identity();
    q.set([SIN_PI_OVER_2, 0, 0, SIN_PI_OVER_2]);
    const q2 = Quat.identity();
    q2.set([SIN_PI_OVER_2, 0, 0, -SIN_PI_OVER_2]);

    expectArrayEqual(q.lerp(q2, 0.5), [1, 0, 0, 0]);
  });

  test('slerp', () => {
    const q = Quat.identity();
    q.set([SIN_PI_OVER_2, 0, 0, SIN_PI_OVER_2]);
    const q2 = Quat.identity();
    q2.set([SIN_PI_OVER_2, 0, 0, -SIN_PI_OVER_2]);

    expectArrayEqual(q.slerp(q2, 0.5), [1, 0, 0, 0]);

    q.set([SIN_PI_OVER_6, 0, 0, COS_PI_OVER_6]);
    q2.set([-COS_PI_OVER_6, 0, 0, -SIN_PI_OVER_6]);
    expectArrayEqual(q.slerp(q2, 0.5), [SIN_PI_OVER_2, 0, 0, SIN_PI_OVER_2]);
  });

  test('normalize', () => {
    const q = Quat.identity();
    q.set([2, 5, 14, 8]);
    expect(q.normalize()).toBe(true);
    expectArrayEqual(q, [2 / 17, 5 / 17, 14 / 17, 8 / 17]);

    q.set([0, 0, 0, 0]);
    expect(q.normalize()).toBe(false);
  });
});
