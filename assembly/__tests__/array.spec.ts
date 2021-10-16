import { array, Float, mat2, mat3, mat4, quat, Vec, vec2, vec3, vec4 } from '../index';
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
      mat2.copy([8, 9, 7, 9.3], [6, 7, 8, 9]),
      mat3.copy([1, 2, 3, 4, 5, 6, 7, 8, 9], [0, 0, 0, 0, 0, 0, 0, 0, 0]),
      mat4.copy(
        [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
      ),
      quat.copy([8, 9, 7, 9.3], [6, 7, 8, 9]),
      array.copy([1, 2, 3], [0, 0, 0, 0, 0]),
    ];
    const expecteds: Vec[] = [
      [3.1, 4.15],
      [9.2, 6.5, 3.5],
      [8, 9, 7, 9.3],
      [8, 9, 7, 9.3],
      [1, 2, 3, 4, 5, 6, 7, 8, 9],
      [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16],
      [8, 9, 7, 9.3],
      [1, 2, 3, 0, 0]
    ];

    for (let i = 0; i < expecteds.length; ++i) {
      expectVecEqual(actuals[i], expecteds[i]);
    }
  });

  test('copyEx(a, b)', () => {
    const actual = array.copyEx([1, 2, 3, 4] as Vec, new Float32Array(5), 1, 2, 3);
    const expected: Vec = [0, 0, 2, 3, 4];
    expectVecEqual(actual, expected);
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
      mat2.add([29, 31, 37, 41], [43, 47, 53, 59]),
      mat3.add([1, 2, 3, 4, 5, 6, 7, 8, 9], [0, 9, 7, 2, 1, 6, 3, 1, 8]),
      mat4.add(
        [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16],
        [0, 3, 2, 1, 7, 6, 5, 4, 9, 3, 2, 2, 0, 3, 3, 1]
      ),
      array.add([1, 3, 3, 7], [9, 1, 1, 2, 6], [0, 0, 0, 0])
    ];

    const expecteds: Vec[] = [
      [4, 7],
      [24, 30, 36],
      [72, 78, 90, 100],
      [72, 78, 90, 100],
      [1, 11, 10, 6, 6, 12, 10, 9, 17],
      [1, 5, 5, 5, 12, 12, 12, 12, 18, 13, 13, 14, 13, 17, 18, 17],
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
      mat2.sub([29, 31, 37, 41], [43, 47, 53, 59]),
      mat3.sub([1, 2, 3, 4, 5, 6, 7, 8, 9], [0, 9, 7, 2, 1, 6, 3, 1, 8]),
      mat4.sub(
        [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16],
        [0, 3, 2, 1, 7, 6, 5, 4, 9, 3, 2, 2, 0, 3, 3, 1]
      ),
      array.sub([1, 3, 3, 7], [9, 1, 1, 2, 6], [0, 0, 0, 0])
    ];

    const expecteds: Vec[] = [
      [-2, -3],
      [-10, -8, -10],
      [-14, -16, -16, -18],
      [-14, -16, -16, -18],
      [1, -7, -4, 2, 4, 0, 4, 7, 1],
      [1, -1, 1, 3, -2, 0, 2, 4, 0, 7, 9, 10, 13, 11, 12, 15],
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
      mat2.scale([29, 31, 37, 41], 4),
      array.scale([1, 3, 3, 7, 6], 5, [0, 0, 0, 0, 0])
    ];

    const expecteds: Vec[] = [
      [2, 4],
      [21, 33, 39],
      [116, 124, 148, 164],
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

  test('lerp(a, b, t)', () => {
    const actuals: Vec[] = [
      vec2.lerp([1, 2], [3, 5], .5),
      vec3.lerp([7, 11, 13], [17, 19, 23], .5),
      vec4.lerp([29, 31, 37, 41], [43, 47, 53, 59], .5),
      array.lerp([1, 3, 3, 7], [9, 1, 1, 2, 6], .5, [0, 0, 0, 0, 0])
    ];

    const expecteds: Vec[] = [
      [2, 3.5],
      [12, 15, 18],
      [36, 39, 45, 50],
      [5, 2, 2, 4.5, 0]
    ];

    for (let i = 0; i < expecteds.length; ++i) {
      expectVecEqual(actuals[i], expecteds[i]);
    }
  });

  test('transpose(a)', () => {
    const actuals: Vec[] = [
      array.transpose(1, [1], [0]),
      mat2.transpose([1, 2, 3, 4]),
      mat3.transpose([1, 2, 3, 4, 5, 6, 7, 8, 9]),
      mat4.transpose([1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16]),
    ];

    const expecteds: Vec[] = [
      [1],
      [1, 3, 2, 4],
      [1, 4, 7, 2, 5, 8, 3, 6, 9],
      [1, 5, 9, 13, 2, 6, 10, 14, 3, 7, 11, 15, 4, 8, 12, 16],
    ];

    for (let i = 0; i < expecteds.length; ++i) {
      expectVecEqual(actuals[i], expecteds[i]);
    }
  });

  test('mmul(m1, m2)', () => {
    const actuals: Vec[] = [
      array.mmul(1, [2.5], [3.4], [0]),
      mat2.mul([1, 2, 3, 4], [5, 6, 7, 8]),
      mat3.mul([1, 2, 3, 4, 5, 6, 7, 8, 9], [0, 9, 7, 2, 1, 6, 3, 1, 8]),
      mat4.mul(
        [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16],
        [0, 3, 2, 1, 7, 6, 5, 4, 9, 3, 2, 2, 0, 3, 3, 1]
      ),
      vec2.mmul([1, 2, 3, 4], [5, 6]),
      vec3.mmul([1, 2, 3, 4, 5, 6, 7, 8, 9], [10, 11, 12]),
      vec4.mmul(
        [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16],
        [17, 18, 19, 20]
      )
    ];

    const expecteds: Vec[] = [
      [8.5],
      [23, 34, 31, 46],
      [85, 101, 117, 48, 57, 66, 63, 75, 87],
      [46, 52, 58, 64, 134, 156, 178, 200, 68, 84, 100, 116, 55, 62, 69, 76],
      [23, 34],
      [138, 171, 204],
      [538, 612, 686, 760]
    ];

    for (let i = 0; i < expecteds.length; ++i) {
      expectVecEqual(actuals[i], expecteds[i]);
    }
  });
});
