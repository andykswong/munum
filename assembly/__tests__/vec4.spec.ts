import { vec4 } from '../index'; 
import { Vec4 } from '../types';
import { expectVecEqual } from './test-utils';

describe('vec4', () => {
  test('create()', () => {
    expectVecEqual(vec4.create(), [0, 0, 0, 0] as Vec4);
    expectVecEqual(vec4.create(1, 2, 3, 4), [1, 2, 3, 4] as Vec4);
  });

  test('set(v)', () => {
    const v = vec4.create(3, 5, 7, 11);
    expectVecEqual(vec4.set(v), [0, 0, 0, 0] as Vec4);
    expectVecEqual(vec4.set(v, 1, 2, 3, 4), [1, 2, 3, 4] as Vec4);
  });

  test('fromVec3(v)', () => {
    expectVecEqual(vec4.fromVec3([1, 2, 3]), [1, 2, 3, 0] as Vec4);
    const out = vec4.create();
    expect(vec4.fromVec3([1, 2, 3], out)).toBe(out);
    expectVecEqual(out, [1, 2, 3, 0] as Vec4);
  });

  test('len2(v)', () => {
    expect(vec4.len2([2, 5, 14, 8])).toBe(289);
  });
  
  test('len(v)', () => {
    expect(vec4.len([2, 5, 14, 8])).toBe(17);
  });
  
  test('norm(v)', () => {
    expectVecEqual(vec4.norm([2, 5, 14, 8]), [2/17, 5/17, 14/17, 8/17] as Vec4);
    expectVecEqual(vec4.norm([0, 0, 0, 0]), [0, 0, 0, 0] as Vec4);
  });
});
