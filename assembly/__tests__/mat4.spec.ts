import { array, Int, Mat4, ReadonlyMat4, mat4 } from '../index';

const ORDER: Int = 4;
const out: Mat4 = mat4.create();

describe('mat4', () => {
  test('create()', () => {
    const v = mat4.create();
    for (let i: Int = 0; i < ORDER; ++i) {
      for (let j: Int = 0; j < ORDER; ++j) {
        expect(v[i * ORDER + j]).toBe(i == j ? 1 : 0);
      }
    }
  });

  test('invert(m)', () => {
    const m: Mat4 = [1, 1, 1, -1, 1, 1, -1, 1, 1, -1, 1, 1, -1, 1, 1, 1];
    const expected: ReadonlyMat4 = [.25, .25, .25, -.25, .25, .25, -.25, .25, .25, -.25, .25, .25, -.25, .25, .25, .25];
    expect(mat4.invert(m, out)).toBe(out);
    expect(array.fequal(out, expected)).toBeTruthy();
  });

  test('invert(m) == null', () => {
    const m: Mat4 = [1, 2, 3, 4, 5, 6, 7, 8, 0, 0, 0, 0, 9, 10, 11, 12];
    expect(mat4.invert(m, out)).toBeNull();
  });
});
