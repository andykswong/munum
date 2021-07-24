import { fequal, copysign, clamp, lerp } from '../index';

describe('scalar', () => {
  test('fequal(a, b)', () => {
    expect(fequal(1, 1.00001)).toBeFalsy();
    expect(fequal(1, 1.000001, 0.0001)).toBeTruthy();
  });

  test('copysign(a, b)', () => {
    expect(copysign(-2, 0)).toBe(0);
    expect(copysign(2, 0)).toBe(0);
    expect(copysign(0, 3)).toBe(0);
    expect(copysign(0, -4)).toBe(-0);
    expect(copysign(0, 0)).toBe(0);
    expect(copysign(3, 4)).toBe(3);
    expect(copysign(4, -5)).toBe(-4);
    expect(copysign(-3, 4)).toBe(3);
    expect(copysign(-4, -5)).toBe(-4);
  });

  test('clamp(x, a, b)', () => {
    expect(clamp(1, 0, 2)).toBe(1);
    expect(clamp(3, 0, 2)).toBe(2);
    expect(clamp(-2, 0, 2)).toBe(0);
  });

  test('lerp(a, b, t)', () => {
    expect(lerp(3, 5, 0.5)).toBe(4);
    expect(lerp(3, 5, 0)).toBe(3);
    expect(lerp(3, 5, 1)).toBe(5);
  });
});
