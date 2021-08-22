import { Vec2, vec2 } from '../index';
import { expectVecEqual } from './test-utils';

describe('vec2', () => {
  test('create()', () => {
    expectVecEqual(vec2.create(), [0, 0] as Vec2);
    expectVecEqual(vec2.create(1, 2), [1, 2] as Vec2);
  });

  test('set(v)', () => {
    const v = vec2.create(3, 5);
    expectVecEqual(vec2.set(v), [0, 0] as Vec2);
    expectVecEqual(vec2.set(v, 1, 2), [1, 2] as Vec2);
  });

  test('mmul3(m, v)', () => {
    const v = vec2.create(7, 3);
    expectVecEqual(vec2.mmul3([2, 5, 0, 3, 11, 0, -4, 7, 1], v), [19, 75] as Vec2);
  });

  test('len2(v)', () => {
    expect(vec2.len2([3, 4])).toBe(25);
  });

  test('len(v)', () => {
    expect(vec2.len([3, 4])).toBe(5);
  });

  test('dist(a, b)', () => {
    expect(vec2.dist([5, -1], [2, 3])).toBe(5);
  });

  test('norm(v)', () => {
    expectVecEqual(vec2.norm([5, 12]), [5 / 13, 12 / 13] as Vec2);
    expectVecEqual(vec2.norm([0, 0]), [0, 0] as Vec2);
  });
});
