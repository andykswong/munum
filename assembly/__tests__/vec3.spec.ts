import { vec3 } from '../index'; 
import { expectVecEqual } from './test-utils';

describe('vec3', () => {
  test('create()', () => {
    expectVecEqual(vec3.create(), [0, 0, 0]);
    expectVecEqual(vec3.create(1, 2, 3), [1, 2, 3]);
  });

  test('len2(v)', () => {
    expect(vec3.len2([3, 4, 12])).toBe(169);
  });
  
  test('len(v)', () => {
    expect(vec3.len([3, 4, 12])).toBe(13);
  });
  
  test('norm(v)', () => {
    expectVecEqual(vec3.norm([3, 4, 12]), [3/13, 4/13, 12/13]);
    expectVecEqual(vec3.norm([0, 0, 0]), [0, 0, 0]);
  });

  test('cross(a, b)', () => {
    const a = vec3.create(1, 2, 3);
    const b = vec3.create(11, 5, 7);
    const out = vec3.create();    
    expect(vec3.cross(a, b, out)).toBe(out);
    expectVecEqual(out, [-1, 26, -17]);
    expect(out[0]).toBe(-1);
    expect(out[1]).toBe(26);
    expect(out[2]).toBe(-17);
  });
});
