import { plane, Plane } from '../index';
import { expectVecEqual } from './test-utils';

describe('plane', () => {
  test('create()', () => {
    expectVecEqual(plane.create(), [0, 0, 0, 0] as Plane);
    expectVecEqual(plane.create(1, 2, 3, 6), [1, 2, 3, 6] as Plane);
  });

  test('copy(a, b)', () => {
    expectVecEqual(plane.copy([1, 2, 3, 4.5], [6, 7, 8, 9]), [1, 2, 3, 4.5] as Plane);
  });

  test('set(v)', () => {
    const v = plane.create(3, 5, 7, 11);
    expectVecEqual(plane.set(v), [0, 0, 0, 0] as Plane);
    expectVecEqual(plane.set(v, 1, 2, 3, 4), [1, 2, 3, 4] as Plane);
  });

  test('fromPointNormal(q, v)', () => {
    expectVecEqual(plane.fromPointNormal([1, -2, -.5], [3, 4, 12]), [3 / 13, 4 / 13, 12 / 13, 11 / 13] as Plane);
  });

  test('fromPoints(a, b, c)', () => {
    expectVecEqual(plane.fromPoints([1, -2, -.5], [-1, 1, -1], [-1, -5, 1]), [3 / 13, 4 / 13, 12 / 13, 11 / 13] as Plane);
  });

  test('norm(p)', () => {
    expectVecEqual(plane.norm([3, 4, 12, 11]), [3 / 13, 4 / 13, 12 / 13, 11 / 13] as Plane);
    expectVecEqual(plane.norm([0, 0, 0, 0]), [0, 0, 0, 0] as Plane);
  });

  test('dist(p, q)', () => {
    expect(plane.dist([3 / 13, 4 / 13, 12 / 13, 11 / 13], [-1, 1, -1])).toBeCloseTo(0);
    expect(plane.dist([3 / 13, 4 / 13, 12 / 13, 11 / 13], [3, 2, 1])).toBeCloseTo(40 / 13);
  });
});
