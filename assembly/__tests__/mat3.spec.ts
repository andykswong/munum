import { array, Int, Mat3, ReadonlyMat3, mat3 } from '../index';

const ORDER: Int = 3;
const out: Mat3 = mat3.create();

describe('mat3', () => {
  test('create()', () => {
    const v = mat3.create();
    for (let i: Int = 0; i < ORDER; ++i) {
      for (let j: Int = 0; j < ORDER; ++j) {
        expect(v[i * ORDER + j]).toBe(i == j ? 1 : 0);
      }
    }
  });

  test('det(m)', () => {
    const m: Mat3 = [1, 0, 5, 2, 1, 6, 3, 4, 0];
    expect(mat3.det(m)).toBe(1);
  });

  test('invert(m)', () => {
    const m: Mat3 = [1, 0, 5, 2, 1, 6, 3, 4, 0];
    const expected: ReadonlyMat3 = [-24, 20, -5, 18, -15, 4, 5, -4, 1];
    expect(mat3.invert(m, out)).toBe(out);
    expect(array.fequal(out, expected)).toBeTruthy();
  });

  test('invert(m) == null', () => {
    const m: Mat3 = [1, 0, 1, 0, 1, 0, 0, 0, 0];
    expect(mat3.invert(m, out)).toBeNull();
  });
});
