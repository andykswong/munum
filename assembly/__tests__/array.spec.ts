import { array, Float, Vec, vec2, vec3, vec4 } from '../index';
import { expectVecEqual } from './test-utils';

describe('array', () => {
  test('copy(a, b, i, j, c)', () => {
    const out: Vec = [0, 0, 0, 0];
    const actual = array.copy([1, 2, 3, 4, 5, 6], out, 2, 1, 3);
    const expected: Vec = [0, 3, 4, 5];

    expect(actual).toBe(out);
    expectVecEqual(actual, expected);
  });

  test('copy(a, b)', () => {
    const actuals: Vec[] = [
      vec2.copy([3.1, 4.15], [1, 2]),
      vec3.copy([9.2, 6.5, 3.5], [3, 4, 5]),
      vec4.copy([8, 9, 7, 9.3], [6, 7, 8, 9]),
      array.copy([1, 2, 3], [0, 0, 0, 0, 0]),
    ];
    const expecteds: Vec[] = [
      [3.1, 4.15],
      [9.2, 6.5, 3.5],
      [8, 9, 7, 9.3],
      [1, 2, 3, 0, 0]
    ];

    for (let i = 0; i < expecteds.length; ++i) {
      expectVecEqual(actuals[i], expecteds[i]);
    }
  });

  test('fequal(a, b)', () => {
    expect(array.fequal([0, 1], [2, 3, 4])).toBeFalsy();
    expect(array.fequal([2, 3, 5], [2, 3, 4])).toBeFalsy();
    expect(array.fequal([1, 2, 3, 4], [1, 2, 3, 4])).toBeTruthy();
  });

  test('fequal(a, b, e)', () => {
    expect(array.fequal([1, 2], [1.099, 2.099], 0.1)).toBeTruthy();
    expect(array.fequal([1, 2], [2.1, 3.1], 0.1)).toBeFalsy();
  });

  test('add(a, b)', () => {
    const actuals: Vec[] = [
      vec2.add([1, 2], [3, 5]),
      vec3.add([7, 11, 13], [17, 19, 23]),
      vec4.add([29, 31, 37, 41], [43, 47, 53, 59]),
      array.add([1, 3, 3, 7], [9, 1, 1, 2, 6], [0, 0, 0, 0])
    ];

    const expecteds: Vec[] = [
      [4, 7],
      [24, 30, 36],
      [72, 78, 90, 100],
      [10, 4, 4, 9]
    ];

    for (let i = 0; i < expecteds.length; ++i) {
      expectVecEqual(actuals[i], expecteds[i]);
    }
  });

  test('sub(a, b)', () => {
    const actuals: Vec[] = [
      vec2.sub([1, 2], [3, 5]),
      vec3.sub([7, 11, 13], [17, 19, 23]),
      vec4.sub([29, 31, 37, 41], [43, 47, 53, 59]),
      array.sub([1, 3, 3, 7], [9, 1, 1, 2, 6], [0, 0, 0, 0])
    ];

    const expecteds: Vec[] = [
      [-2, -3],
      [-10, -8, -10],
      [-14, -16, -16, -18],
      [-8, 2, 2, 5]
    ];

    for (let i = 0; i < expecteds.length; ++i) {
      expectVecEqual(actuals[i], expecteds[i]);
    }
  });
      
  test('scale(v, s)', () => {
    const actuals: Vec[] = [
      vec2.scale([1, 2], 2),
      vec3.scale([7, 11, 13], 3),
      vec4.scale([29, 31, 37, 41], 4),
      array.scale([1, 3, 3, 7, 6], 5, [0, 0, 0, 0, 0])
    ];

    const expecteds: Vec[] = [
      [2, 4],
      [21, 33, 39],
      [116, 124, 148, 164],
      [5, 15, 15, 35, 30]
    ];

    for (let i = 0; i < expecteds.length; ++i) {
      expectVecEqual(actuals[i], expecteds[i]);
    }
  });
  
  test('mul(a, b)', () => {
    const actuals: Vec[] = [
      vec2.mul([1, 2], [3, 5]),
      vec3.mul([7, 11, 13], [17, 19, 23]),
      vec4.mul([29, 31, 37, 41], [43, 47, 53, 59]),
      array.mul([1, 3, 3, 7], [9, 1, 1, 2, 6], [0, 0, 0, 0])
    ];

    const expecteds: Vec[] = [
      [3, 10],
      [119, 209, 299],
      [1247, 1457, 1961, 2419],
      [9, 3, 3, 14]
    ];

    for (let i = 0; i < expecteds.length; ++i) {
      expectVecEqual(actuals[i], expecteds[i]);
    }
  });
    
  test('dot(a, b)', () => {
    const actuals: Float[] = [
      vec2.dot([1, 2], [3, 5]),
      vec3.dot([7, 11, 13], [17, 19, 23]),
      vec4.dot([29, 31, 37, 41], [43, 47, 53, 59]),
      array.dot([1, 3, 3, 7], [9, 1, 1, 2, 6])
    ];
    const expecteds: Float[] = [13, 627, 7084, 29];

    for (let i = 0; i < expecteds.length; ++i) {
      expect(actuals[i]).toBeCloseTo(expecteds[i]);
    }
  });
});
