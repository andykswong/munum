import { Float, Mat4, quat, Quat, Vec3 } from '../index';
import { expectVecEqual } from './test-utils';

const PI_OVER_3 = Math.PI as Float / 3;
const COS_PI_OVER_6 = Math.sqrt(3) as Float / 2;
const SIN_PI_OVER_6 = 0.5 as Float;
const SIN_PI_OVER_2 = 1 / Math.sqrt(2) as Float;
const ONE_OVER_SQRT3 = 1 / Math.sqrt(3) as Float;

describe('quat', () => {
  test('create()', () => {
    expectVecEqual(quat.create(), [0, 0, 0, 1] as Quat);
  });

  test('rotateAxis(v, a)', () => {
    expectVecEqual(
      quat.rotateAxis([3, 5, 7], PI_OVER_3),
      [3 * SIN_PI_OVER_6, 5 * SIN_PI_OVER_6, 7 * SIN_PI_OVER_6, COS_PI_OVER_6] as Quat
    );
  });

  test('rotateX(a)', () => {
    expectVecEqual(quat.rotateX(PI_OVER_3), [SIN_PI_OVER_6, 0, 0, COS_PI_OVER_6] as Quat);
  });

  test('rotateY(a)', () => {
    expectVecEqual(quat.rotateY(PI_OVER_3), [0, SIN_PI_OVER_6, 0, COS_PI_OVER_6] as Quat);
  });

  test('rotateZ(a)', () => {
    expectVecEqual(quat.rotateZ(PI_OVER_3), [0, 0, SIN_PI_OVER_6, COS_PI_OVER_6] as Quat);
  });

  test('rotateTo(v1, v2)', () => {
    expectVecEqual(quat.rotateTo([0, 0, 1], [1, 0, 0]), [0, SIN_PI_OVER_2, 0, SIN_PI_OVER_2] as Quat);
    expectVecEqual(quat.rotateTo([0, 0, 1], [0, 0, -1]), [0, 1, 0, 0] as Quat);
    expectVecEqual(quat.rotateTo([1, 0, 0], [1, 0, 0]), [0, 0, 0, 1] as Quat);
  });

  test('toMat4(q)', () => {
    expectVecEqual(
      quat.toMat4([ONE_OVER_SQRT3, ONE_OVER_SQRT3, ONE_OVER_SQRT3, 0]),
      [-1/3, 2/3, 2/3, 0, 2/3, -1/3, 2/3, 0, 2/3, 2/3, -1/3, 0, 0, 0, 0, 1] as Mat4
    );
  });

  test('conj(q)', () => {
    expectVecEqual(quat.conj([2, 3, 5, 7]), [-2, -3, -5, 7] as Quat);
  });

  test('invert(q)', () => {
    expectVecEqual(quat.invert([2, 5, 14, 8]), [-2 / 289, -5 / 289, -14 / 289, 8 / 289] as Quat);
  });

  test('mul(q1, q2)', () => {
    expectVecEqual(quat.mul([2, 3, 5, -7], [11, 13, -17, 19]), [-155, 55, 207, -109] as Quat);
  });

  test('rotateVec3(q, v)', () => {
    expectVecEqual(quat.rotateVec3([0, SIN_PI_OVER_2, 0, SIN_PI_OVER_2], [1, 1, 1]), [1, 1, -1] as Vec3);
  });

  test('lerp(q1, q2)', () => {
    expectVecEqual(quat.lerp([SIN_PI_OVER_2, 0, 0, SIN_PI_OVER_2], [SIN_PI_OVER_2, 0, 0, -SIN_PI_OVER_2], 0.5), [1, 0, 0, 0] as Quat);
  });

  test('slerp(q1, q2)', () => {
    expectVecEqual(quat.slerp([SIN_PI_OVER_2, 0, 0, SIN_PI_OVER_2], [SIN_PI_OVER_2, 0, 0, -SIN_PI_OVER_2], 0.5), [1, 0, 0, 0] as Quat);
    expectVecEqual(quat.slerp([SIN_PI_OVER_6, 0, 0, COS_PI_OVER_6], [-COS_PI_OVER_6, 0, 0, -SIN_PI_OVER_6], 0.5), [SIN_PI_OVER_2, 0, 0, SIN_PI_OVER_2] as Quat);
  });
});
