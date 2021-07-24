import { Mat3, ReadonlyMat3, mat3 } from '../index';
import { expectVecEqual } from './test-utils';

describe('mat3', () => {
  test('create()', () => {
    const v = mat3.create();
    for (let i = 0; i < 3; ++i) {
      for (let j = 0; j < 3; ++j) {
        expect(v[i * 3 + j]).toBe(i == j ? 1 : 0);
      }
    }
  });

  test('id(m)', () => {
    const m: Mat3 = [2, 3, 4, 5, 6, 7, 8, 9, 0];
    const expected: ReadonlyMat3 = [1, 0, 0, 0, 1, 0, 0, 0, 1];
    expectVecEqual(mat3.id(m), expected);
  });

  test('det(m)', () => {
    const m: Mat3 = [1, 0, 5, 2, 1, 6, 3, 4, 0];
    expect(mat3.det(m)).toBe(1);
  });

  test('invert(m)', () => {
    const m: Mat3 = [1, 0, 5, 2, 1, 6, 3, 4, 0];
    const expected: ReadonlyMat3 = [-24, 20, -5, 18, -15, 4, 5, -4, 1];
    const actual = mat3.invert(m);
    expect(actual).not.toBeNull();
    if (actual) {
      expectVecEqual(actual, expected);
    }
  });

  test('invert(m) == null', () => {
    const m: Mat3 = [1, 0, 1, 0, 1, 0, 0, 0, 0];
    expect(mat3.invert(m)).toBeNull();
  });

  test('nmat(m)', () => {
    const m: Mat3 = [0, 0, 1, 1, 0, 0, 0, 1, 0];
    const expected: ReadonlyMat3 = [0, 0, 1, 1, 0, 0, 0, 1, 0];
    const actual = mat3.nmat(m);
    expect(actual).not.toBeNull();
    if (actual) {
      expectVecEqual(actual, expected);
    }
  });

  test('nmat(m) == null', () => {
    const m: Mat3 = [1, 0, 1, 0, 1, 0, 0, 0, 0];
    expect(mat3.nmat(m)).toBeNull();
  });
});
