import { expectArrayEqual } from '../../__tests__/test-utils.ts';
import { Mat2, Mat3, Mat4 } from '../mat.ts';

describe('Mat2', () => {
  test('identity', () => {
    expectArrayEqual(Mat2.identity(), [1, 0, 0, 1]);
  });

  test('fromMat3', () => {
    const m = Mat3.identity();
    m.set([1, 2, 0, 3, 4, 0, 5, 6, 1]);
    expectArrayEqual(Mat2.fromMat3(m), [1, 2, 3, 4]);
  });

  test('set', () => {
    const m = Mat2.identity();
    m.set([1, 2, 3, 4]);
    expectArrayEqual(m, [1, 2, 3, 4]);
  });

  test('add', () => {
    const m = Mat2.identity();
    const m2 = Mat2.identity();
    m.set([29, 31, 37, 41]);
    m2.set([43, 47, 53, 59]);
    expectArrayEqual(m.add(m2), [72, 78, 90, 100]);
  });

  test('sub', () => {
    const m = Mat2.identity();
    const m2 = Mat2.identity();
    m.set([29, 31, 37, 41]);
    m2.set([43, 47, 53, 59]);
    expectArrayEqual(m.sub(m2), [-14, -16, -16, -18]);
  });

  test('mul', () => {
    const m = Mat2.identity();
    const m2 = Mat2.identity();
    m.set([1, 2, 3, 4]);
    m2.set([5, 6, 7, 8]);
    expectArrayEqual(m.mul(m2), [23, 34, 31, 46]);
  });

  test('scale', () => {
    const m = Mat2.identity();
    m.set([1, 2, 3, 4]);
    expectArrayEqual(m.scale(2), [2, 4, 6, 8]);
  });

  test('transpose', () => {
    const m = Mat2.identity();
    m.set([1, 2, 3, 4]);
    m.transpose();
    expectArrayEqual(m, [1, 3, 2, 4]);
  });

  test('det', () => {
    const m = Mat2.identity();
    m.set([1, 2, 3, 4]);
    expect(m.det()).toBe(-2);
  });

  test('invert', () => {
    const m = Mat2.identity();
    m.set([1, 2, 3, 4]);
    expect(m.invert()).toBe(true);
    expectArrayEqual(m, [-2, 1, 1.5, -0.5]);
  });

  test('invert non-invertible', () => {
    const data = [1, 2, 2, 4];
    const m = Mat2.identity();
    m.set(data);
    expect(m.invert()).toBe(false);
    expectArrayEqual(m, data);
  });
});

describe('Mat3', () => {
  test('identity', () => {
    expectArrayEqual(Mat3.identity(), [1, 0, 0, 0, 1, 0, 0, 0, 1]);
  });

  test('fromMat2', () => {
    const m = Mat2.identity();
    m.set([1, 2, 3, 4]);
    expectArrayEqual(Mat3.fromMat2(m), [1, 2, 0, 3, 4, 0, 0, 0, 1]);
  });

  test('fromMat4', () => {
    const m = Mat4.identity();
    m.set([1, 2, 3, 10, 4, 5, 6, 11, 7, 8, 9, 12, 13, 14, 15, 16]);
    expectArrayEqual(Mat3.fromMat4(m), [1, 2, 3, 4, 5, 6, 7, 8, 9]);
  });

  test('set', () => {
    const m = Mat3.identity();
    m.set([1, 2, 3, 4, 5, 6, 7, 8, 9]);
    expectArrayEqual(m, [1, 2, 3, 4, 5, 6, 7, 8, 9]);
  });

  test('add', () => {
    const m = Mat3.identity();
    const m2 = Mat3.identity();
    m.set([1, 2, 3, 4, 5, 6, 7, 8, 9]);
    m2.set([0, 9, 7, 2, 1, 6, 3, 1, 8]);
    expectArrayEqual(m.add(m2), [1, 11, 10, 6, 6, 12, 10, 9, 17]);
  });

  test('sub', () => {
    const m = Mat3.identity();
    const m2 = Mat3.identity();
    m.set([1, 2, 3, 4, 5, 6, 7, 8, 9]);
    m2.set([0, 9, 7, 2, 1, 6, 3, 1, 8]);
    expectArrayEqual(m.sub(m2), [1, -7, -4, 2, 4, 0, 4, 7, 1]);
  });

  test('mul', () => {
    const m = Mat3.identity();
    const m2 = Mat3.identity();
    m.set([1, 2, 3, 4, 5, 6, 7, 8, 9]);
    m2.set([0, 9, 7, 2, 1, 6, 3, 1, 8]);
    expectArrayEqual(m.mul(m2), [85, 101, 117, 48, 57, 66, 63, 75, 87]);
  });

  test('scale', () => {
    const m = Mat3.identity();
    m.set([1, 2, 3, 4, 5, 6, 7, 8, 9]);
    expectArrayEqual(m.scale(2), [2, 4, 6, 8, 10, 12, 14, 16, 18]);
  });

  test('transpose', () => {
    const m = Mat3.identity();
    m.set([1, 2, 3, 4, 5, 6, 7, 8, 9]);
    m.transpose();
    expectArrayEqual(m, [1, 4, 7, 2, 5, 8, 3, 6, 9]);
  });

  test('det', () => {
    const m = Mat3.identity();
    m.set([1, 0, 5, 2, 1, 6, 3, 4, 0]);
    expect(m.det()).toBe(1);
  });

  test('invert', () => {
    const m = Mat3.identity();
    m.set([1, 0, 5, 2, 1, 6, 3, 4, 0]);
    expect(m.invert()).toBe(true);
    expectArrayEqual(m, [-24, 20, -5, 18, -15, 4, 5, -4, 1]);
  });

  test('invert non-invertible', () => {
    const data = [1, 0, 1, 0, 1, 0, 0, 0, 0];
    const m = Mat3.identity();
    m.set(data);
    expect(m.invert()).toBe(false);
    expectArrayEqual(m, data);
  });

  test('normalMat', () => {
    const m = Mat3.identity();
    m.set([0, 0, 1, 1, 0, 0, 0, 1, 0]);
    expect(m.normalMat()).toBe(true);
    expectArrayEqual(m, [0, 0, 1, 1, 0, 0, 0, 1, 0]);
  });

  test('normalMat for non-invertible', () => {
    const data = [1, 0, 1, 0, 1, 0, 0, 0, 0];
    const m = Mat3.identity();
    m.set(data);
    expect(m.normalMat()).toBe(false);
    expectArrayEqual(m, data);
  });
});

describe('Mat4', () => {
  test('identity', () => {
    expectArrayEqual(Mat4.identity(), [1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1]);
  });

  test('fromMat3', () => {
    const m = Mat3.identity();
    m.set([1, 2, 3, 4, 5, 6, 7, 8, 9]);
    expectArrayEqual(Mat4.fromMat3(m), [1, 2, 3, 0, 4, 5, 6, 0, 7, 8, 9, 0, 0, 0, 0, 1]);
  });

  test('set', () => {
    const m = Mat4.identity();
    m.set([1, 2, 3, 10, 4, 5, 6, 11, 7, 8, 9, 12, 13, 14, 15, 16]);
    expectArrayEqual(m, [1, 2, 3, 10, 4, 5, 6, 11, 7, 8, 9, 12, 13, 14, 15, 16]);
  });

  test('add', () => {
    const m = Mat4.identity();
    const m2 = Mat4.identity();
    m.set([1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16]);
    m2.set([0, 3, 2, 1, 7, 6, 5, 4, 9, 3, 2, 2, 0, 3, 3, 1]);
    expectArrayEqual(m.add(m2), [1, 5, 5, 5, 12, 12, 12, 12, 18, 13, 13, 14, 13, 17, 18, 17]);
  });

  test('sub', () => {
    const m = Mat4.identity();
    const m2 = Mat4.identity();
    m.set([1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16]);
    m2.set([0, 3, 2, 1, 7, 6, 5, 4, 9, 3, 2, 2, 0, 3, 3, 1]);
    expectArrayEqual(m.sub(m2), [1, -1, 1, 3, -2, 0, 2, 4, 0, 7, 9, 10, 13, 11, 12, 15]);
  });

  test('mul', () => {
    const m = Mat4.identity();
    const m2 = Mat4.identity();
    m.set([1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16]);
    m2.set([0, 3, 2, 1, 7, 6, 5, 4, 9, 3, 2, 2, 0, 3, 3, 1]);
    expectArrayEqual(m.mul(m2), [46, 52, 58, 64, 134, 156, 178, 200, 68, 84, 100, 116, 55, 62, 69, 76]);
  });

  test('scale', () => {
    const m = Mat4.identity();
    m.set([1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16]);
    expectArrayEqual(m.scale(2), [2, 4, 6, 8, 10, 12, 14, 16, 18, 20, 22, 24, 26, 28, 30, 32]);
  });

  test('transpose', () => {
    const m = Mat4.identity();
    m.set([1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16]);
    m.transpose();
    expectArrayEqual(m, [1, 5, 9, 13, 2, 6, 10, 14, 3, 7, 11, 15, 4, 8, 12, 16]);
  });

  test('det', () => {
    const m = Mat4.identity();
    m.set([1, 1, 1, -1, 1, 1, -1, 1, 1, -1, 1, 1, -1, 1, 1, 1]);
    expect(m.det()).toBe(-16);
  });

  test('invert', () => {
    const m = Mat4.identity();
    m.set([1, 1, 1, -1, 1, 1, -1, 1, 1, -1, 1, 1, -1, 1, 1, 1]);
    expect(m.invert()).toBe(true);
    expectArrayEqual(m, [.25, .25, .25, -.25, .25, .25, -.25, .25, .25, -.25, .25, .25, -.25, .25, .25, .25]);
  });

  test('invert non-invertible', () => {
    const data = [1, 2, 3, 4, 5, 6, 7, 8, 0, 0, 0, 0, 9, 10, 11, 12];
    const m = Mat4.identity();
    m.set(data);
    expect(m.invert()).toBe(false);
    expectArrayEqual(m, data);
  });
});
