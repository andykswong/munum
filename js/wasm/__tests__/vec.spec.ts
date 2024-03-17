import { expectArrayEqual } from '../../__tests__/test-utils.ts';
import { Mat2, Mat3, Mat4 } from '../mat.ts';
import { getMemoryView } from '../memory.ts';
import { Vec2, Vec3, Vec4 } from '../vec.ts';

describe('Vec2', () => {
  test('constructor', () => {
    using v = new Vec2();
    expectArrayEqual(v, [0, 0]);
  });

  test('free', () => {
    const v2 = new Vec2(1, 2);
    expectArrayEqual(v2, [1, 2]);
    v2.free();
    expect(v2.valid).toBe(false);
    expectArrayEqual(v2, []);
  });

  test('ArrayBufferView', () => {
    const v = new Vec2(1, 2);
    expect(v.byteLength).toBe(16);
    expect(v.buffer).toBe(getMemoryView().buffer);
  });

  test('copy', () => {
    const v = new Vec2(3, 5);
    const v2 = new Vec2(7, 9);
    v.copy(v2);
    expectArrayEqual(v, v2);
  });

  test('at', () => {
    const v = new Vec2(3, 5);
    expect(v.at(0)).toBe(3);
    expect(v.at(1)).toBe(5);
    expect(v.at(2)).toBeUndefined();
  });

  test('set', () => {
    const v = new Vec2(3, 5);
    v.set([0, 0]);
    expectArrayEqual(v, [0, 0]);
    v.set([1, 2]);
    expectArrayEqual(v, [1, 2]);
  });

  test('add', () => {
    const v = new Vec2(1, 2);
    const v2 = new Vec2(3, 5);
    expectArrayEqual(v.add(v2), [4, 7]);
  });

  test('sub', () => {
    const v = new Vec2(1, 2);
    const v2 = new Vec2(3, 5);
    expectArrayEqual(v.sub(v2), [-2, -3]);
  });

  test('scale', () => {
    const v = new Vec2(1, 2);
    expectArrayEqual(v.scale(2), [2, 4]);
  });

  test('dot', () => {
    const v = new Vec2(1, 2);
    const v2 = new Vec2(3, 5);
    expect(v.dot(v2)).toBe(13);
  });

  test('lerp', () => {
    const v = new Vec2(1, 2);
    const v2 = new Vec2(3, 5);
    expectArrayEqual(v.lerp(v2, .5), [2, 3.5]);
  });

  test('mulMat3', () => {
    const v = new Vec2(7, 3);
    const m = Mat3.identity();
    m.set([2, 5, 0, 3, 11, 0, -4, 7, 1]);
    expectArrayEqual(v.mulMat3(m), [19, 75]);
  });

  test('mul', () => {
    const v = new Vec2(7, 3);
    const m = Mat2.identity();
    m.set([2, 5, 7, 3]);
    expectArrayEqual(v.mul(m), [35, 44]);
  });

  test('dot', () => {
    const v = new Vec2(3, 4);
    const v2 = new Vec2(5, 7);
    expect(v.dot(v2)).toBe(43);
  });

  test('norm', () => {
    const v = new Vec2(5, 12);
    expect(v.normalize()).toBe(true);
    expectArrayEqual(v, [5 / 13, 12 / 13]);

    v.set([0, 0]);
    expect(v.normalize()).toBe(false);
  });
});

describe('Vec3', () => {
  test('constructor', () => {
    using v = new Vec3();
    using v2 = new Vec3(1, 2, 3);
    expectArrayEqual(v, [0, 0, 0]);
    expectArrayEqual(v2, [1, 2, 3]);
  });

  test('set', () => {
    const v = new Vec3(3, 4, 5);
    v.set([0, 0, 0]);
    expectArrayEqual(v, [0, 0, 0]);
    v.set([1, 2, 3]);
    expectArrayEqual(v, [1, 2, 3]);
  });

  test('add', () => {
    const v = new Vec3(1, 2, 3);
    const v2 = new Vec3(3, 5, 7);
    expectArrayEqual(v.add(v2), [4, 7, 10]);
  });

  test('sub', () => {
    const v = new Vec3(1, 2, 3);
    const v2 = new Vec3(3, 5, 7);
    expectArrayEqual(v.sub(v2), [-2, -3, -4]);
  });

  test('scale', () => {
    const v = new Vec3(1, 2, 3);
    expectArrayEqual(v.scale(2), [2, 4, 6]);
  });

  test('dot', () => {
    const v = new Vec3(1, 2, 3);
    const v2 = new Vec3(3, 5, 7);
    expect(v.dot(v2)).toBe(34);
  });

  test('lerp', () => {
    const v = new Vec3(7, 11, 13);
    const v2 = new Vec3(17, 19, 23);
    expectArrayEqual(v.lerp(v2, .5), [12, 15, 18]);
  });

  test('mulMat4', () => {
    const v = new Vec3(7, 3, 5);
    const m = Mat4.identity();
    m.set([2, 7, -19, 0, 3, -11, 23, 0, -4, 13, 31, 0, 5, 17, -29, 1]);
    expectArrayEqual(v.mulMat4(m), [8, 98, 62]);
  });

  test('mul', () => {
    const v = new Vec3(10, 11, 12);
    const m = Mat3.identity();
    m.set([1, 2, 3, 4, 5, 6, 7, 8, 9]);
    expectArrayEqual(v.mul(m), [138, 171, 204]);
  });

  test('dot', () => {
    const v = new Vec3(7, 11, 13);
    const v2 = new Vec3(17, 19, 23);
    expect(v.dot(v2)).toBe(627);
  });

  test('norm', () => {
    const v = new Vec3(3, 4, 12);
    expect(v.normalize()).toBe(true);
    expectArrayEqual(v, [3 / 13, 4 / 13, 12 / 13]);

    v.set([0, 0, 0]);
    expect(v.normalize()).toBe(false);
  });

  test('cross', () => {
    const v = new Vec3(1, 2, 3);
    const v2 = new Vec3(11, 5, 7);
    expectArrayEqual(v.cross(v2), [-1, 26, -17]);
  });
});

describe('Vec4', () => {
  test('constructor', () => {
    using v = new Vec4();
    using v2 = new Vec4(1, 2, 3, 4);
    expectArrayEqual(v, [0, 0, 0, 0]);
    expectArrayEqual(v2, [1, 2, 3, 4]);
  });

  test('set', () => {
    const v = new Vec4(3, 4, 5, 7);
    v.set([0, 0, 0, 0]);
    expectArrayEqual(v, [0, 0, 0, 0]);
    v.set([1, 2, 3, 4]);
    expectArrayEqual(v, [1, 2, 3, 4]);
  });

  test('add', () => {
    const v = new Vec4(1, 2, 3, 4);
    const v2 = new Vec4(3, 5, 7, 9);
    expectArrayEqual(v.add(v2), [4, 7, 10, 13]);
  });

  test('sub', () => {
    const v = new Vec4(1, 2, 3, 4);
    const v2 = new Vec4(3, 5, 7, 9);
    expectArrayEqual(v.sub(v2), [-2, -3, -4, -5]);
  });

  test('scale', () => {
    const v = new Vec4(1, 2, 3, 4);
    expectArrayEqual(v.scale(2), [2, 4, 6, 8]);
  });

  test('dot', () => {
    const v = new Vec4(1, 2, 3, 4);
    const v2 = new Vec4(3, 5, 7, 9);
    expect(v.dot(v2)).toBe(70);
  });

  test('lerp', () => {
    const v = new Vec4(29, 31, 37, 41);
    const v2 = new Vec4(43, 47, 53, 59);
    expectArrayEqual(v.lerp(v2, .5), [36, 39, 45, 50]);
  });

  test('mul', () => {
    const v = new Vec4(17, 18, 19, 20);
    const m = Mat4.identity();
    m.set([1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16]);
    expectArrayEqual(v.mul(m), [538, 612, 686, 760]);
  });

  test('dot', () => {
    const v = new Vec4(29, 31, 37, 41);
    const v2 = new Vec4(43, 47, 53, 59);
    expect(v.dot(v2)).toBe(7084);
  });

  test('norm', () => {
    const v = new Vec4(2, 5, 14, 8);
    expect(v.normalize()).toBe(true);
    expectArrayEqual(v, [2 / 17, 5 / 17, 14 / 17, 8 / 17]);

    v.set([0, 0, 0, 0]);
    expect(v.normalize()).toBe(false);
  });
});
