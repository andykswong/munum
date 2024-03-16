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
});
