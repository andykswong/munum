import { Mat4, ReadonlyMat4, mat4, ReadonlyMat3, Mat3 } from '../index';
import { expectVecEqual } from './test-utils';

const out: Mat4 = mat4.create();

describe('mat4', () => {
  test('create()', () => {
    const v = mat4.create();
    for (let i = 0; i < 4; ++i) {
      for (let j = 0; j < 4; ++j) {
        expect(v[i * 4 + j]).toBe(i == j ? 1 : 0);
      }
    }
  });

  test('fromMat3(m)', () => {
    const m: Mat3 = [2, 3, 4, 5, 6, 7, 8, 9, 10];
    const expected: ReadonlyMat4 = [2, 3, 4, 0, 5, 6, 7, 0, 8, 9, 10, 0, 0, 0, 0, 1];
    expectVecEqual(mat4.fromMat3(m), expected);
  });

  test('id(m)', () => {
    const m: Mat4 = [2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 0];
    const expected: ReadonlyMat4 = [1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1];
    expectVecEqual(mat4.id(m), expected);
  });

  test('invert(m)', () => {
    const m: Mat4 = [1, 1, 1, -1, 1, 1, -1, 1, 1, -1, 1, 1, -1, 1, 1, 1];
    const expected: ReadonlyMat4 = [.25, .25, .25, -.25, .25, .25, -.25, .25, .25, -.25, .25, .25, -.25, .25, .25, .25];
    expect(mat4.invert(m, out)).toBe(out);
    expectVecEqual(out, expected)
  });

  test('invert(m) == null', () => {
    const m: Mat4 = [1, 2, 3, 4, 5, 6, 7, 8, 0, 0, 0, 0, 9, 10, 11, 12];
    expect(mat4.invert(m, out)).toBeNull();
  });

  test('nmat3(m)', () => {
    const m: Mat4 = [0, 0, 1, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 1];
    const expected: ReadonlyMat3 = [0, 0, 1, 1, 0, 0, 0, 1, 0];
    const actual = mat4.nmat3(m);
    expect(actual).not.toBeNull();
    if (actual) {
      expectVecEqual(actual, expected);
    }
  });

  test('nmat(m) == null', () => {
    const m: Mat4 = [1, 0, 1, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1];
    expect(mat4.nmat3(m)).toBeNull();
  });
});
