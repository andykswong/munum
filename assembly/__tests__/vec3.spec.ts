import { Float, Int, Vec3, vec3 } from '../index'; 

const ORDER: Int = 3;
const out: Vec3 = vec3.create();

describe('vec3', () => {
  test('create()', () => {
    const v = vec3.create();
    for (let i: Int = 0; i < ORDER; ++i) {
      expect(v[i]).toBe(0);
    }
  });

  test('create(x, y, z)', () => {
    const v = vec3.create(1, 2, 3);
    for (let i: Int = 0; i < ORDER; ++i) {
      expect(v[i]).toBe((i + 1) as Float);
    }
  });

  test('cross(a, b)', () => {
    const a = vec3.create(1, 2, 3);
    const b = vec3.create(11, 5, 7);
    expect(vec3.cross(a, b, out)).toBe(out);
    expect(out[0]).toBe(-1);
    expect(out[1]).toBe(26);
    expect(out[2]).toBe(-17);
  });

  test('copy(a, b)', () => {
    const v = vec3.create(1, 2, 3);
    expect(vec3.copy(v, out)).toBe(out);
    for (let i: Int = 0; i < ORDER; ++i) {
      expect(out[i]).toBe(v[i]);
    }
  });

  test('dot(a, b)', () => {
    const v1 = vec3.create(1, 2, 3);
    const v2 = vec3.create(5, 7, 11);
    expect(vec3.dot(v1, v2)).toBe(52);
  });
});
