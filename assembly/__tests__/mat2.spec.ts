import { Mat2, ReadonlyMat2, ReadonlyMat3, mat2 } from '../index';
import { expectVecEqual } from './test-utils';

describe('mat2', () => {
  test('create()', () => {
    expectVecEqual(mat2.create(), [1, 0, 0, 1] as Mat2);
  });

  test('id(m)', () => {
    const m: Mat2 = [2, 3, 4, 5];
    const expected: ReadonlyMat2 = [1, 0, 0, 1];
    expectVecEqual(mat2.id(m), expected);
  });

  test('fromMat3(m)', () => {
    const m: ReadonlyMat3 = [2, 3, 4, 5, 6, 7, 8, 9, 10];
    const expected: ReadonlyMat2 = [2, 3, 5, 6];
    expectVecEqual(mat2.fromMat3(m), expected);
  });

  test('det(m)', () => {
    expect(mat2.det([1, 2, 3, 4])).toBe(-2);
  });

  test('invert(m)', () => {
    const m: Mat2 = [1, 2, 3, 4];
    const expected: ReadonlyMat2 = [-2, 1, 1.5, -0.5];
    const actual = mat2.invert(m);
    expect(actual).not.toBeNull();
    expectVecEqual(actual as Mat2, expected);
  });

  test('invert(m) == null', () => {
    expect(mat2.invert([1, 2, 2, 4])).toBeNull();
  });
});
