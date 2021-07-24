import { vec2 } from '../index';
import { expectVecEqual } from './test-utils';

describe('vec2', () => {
  test('create()', () => {
    expectVecEqual(vec2.create(), [0, 0]);
    expectVecEqual(vec2.create(1, 2), [1, 2]);
  });

  test('len2(v)', () => {
    expect(vec2.len2([3, 4])).toBe(25);
  });
  
  test('len(v)', () => {
    expect(vec2.len([3, 4])).toBe(5);
  });
  
  test('norm(v)', () => {
    expectVecEqual(vec2.norm([5, 12]), [5/13, 12/13]);
    expectVecEqual(vec2.norm([0, 0]), [0, 0]);
  });
});
