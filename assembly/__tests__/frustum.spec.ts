import { aabb, Float, frustum, Frustum, ortho, perspective, plane } from '../index';
import { expectFrustumEqual } from './test-utils';

describe('frustum', () => {
  test('create()', () => {
    expectFrustumEqual(frustum.create(), [
      [0, 0, 0, 0], [0, 0, 0, 0],
      [0, 0, 0, 0], [0, 0, 0, 0],
      [0, 0, 0, 0], [0, 0, 0, 0],
    ] as Frustum);

    expectFrustumEqual(frustum.create(
      [1, 2, 3, 4], [5, 6, 7, 8],
      [9, 10, 11, 12], [13, 14, 15, 16],
      [17, 18, 19, 20], [21, 22, 23, 24],
    ), [
      [1, 2, 3, 4], [5, 6, 7, 8],
      [9, 10, 11, 12], [13, 14, 15, 16],
      [17, 18, 19, 20], [21, 22, 23, 24],
    ] as Frustum);
  });

  test('fromViewProj(ortho)', () => {
    expectFrustumEqual(
      frustum.fromViewProj(ortho(1, 2, 3, 4, 5, 6)),
      [
        [1, 0, 0, -1],
        [-1, 0, 0, 2],
        [0, 1, 0, -3],
        [0, -1, 0, 4],
        [0, 0, -1, -5],
        [0, 0, 1, 6]
      ]
    );
  });

  test('fromViewProj(perspective)', () => {
    const aspect = 2 as Float;
    const yfov = Math.PI as Float / 2;
    const halfYfov = Math.PI as Float / 4;

    const expectedLeft = plane.create(Math.cos(Math.atan(aspect * Math.tan(halfYfov))) as Float, 0, -Math.sin(Math.atan(aspect * Math.tan(halfYfov))) as Float, 0);
    const expectedRight = plane.create(-Math.cos(Math.atan(aspect * Math.tan(halfYfov))) as Float, 0, -Math.sin(Math.atan(aspect * Math.tan(halfYfov))) as Float, 0);
    const expectedBottom = plane.create(0, Math.sin(halfYfov) as Float, -Math.cos(halfYfov) as Float, 0);
    const expectedTop = plane.create(0, -Math.sin(halfYfov) as Float, -Math.cos(halfYfov) as Float, 0);

    expectFrustumEqual(
      frustum.fromViewProj(perspective(aspect, yfov, 1)),
      [
        expectedLeft, expectedRight, expectedBottom, expectedTop,
        [0, 0, -1, -1],
        [0, 0, 0, 2] // Plane at infinity
      ]
    );

    expectFrustumEqual(
      frustum.fromViewProj(perspective(aspect, yfov, 2, 10)),
      [
        expectedLeft, expectedRight, expectedBottom, expectedTop,
        [0, 0, -1, -2],
        [0, 0, 1, 10]
      ]
    );
  });

  test('containsPoint(f, p)', () => {
    const f = frustum.fromViewProj(ortho(1, 2, 3, 4, 5, 6));
    expect(frustum.containsPoint(f, [1, 3, -5])).toBeTruthy();
    expect(frustum.containsPoint(f, [2, 4, -6])).toBeTruthy();
    expect(frustum.containsPoint(f, [1.5, 3.5, -5.5])).toBeTruthy();

    expect(frustum.containsPoint(f, [0, 0, 0])).toBeFalsy();
    expect(frustum.containsPoint(f, [0, 3, -5])).toBeFalsy();
    expect(frustum.containsPoint(f, [1, 5, -5])).toBeFalsy();
    expect(frustum.containsPoint(f, [1, 3, -4])).toBeFalsy();
  });

  test('containsPoint(f, p, r)', () => {
    const f = frustum.fromViewProj(ortho(1, 2, 3, 4, 5, 6));
    expect(frustum.containsPoint(f, [0, 2, -3], 2)).toBeTruthy();
    expect(frustum.containsPoint(f, [5, 3, -5], 2)).toBeFalsy();
  });

  test('containsAABB(f, a)', () => {
    const f = frustum.fromViewProj(ortho(1, 2, 3, 4, 5, 6));
    expect(frustum.containsAABB(f, aabb.create([0, 0, -6], [1.5, 3.5, -4]))).toBeTruthy();
    expect(frustum.containsAABB(f, aabb.create([3, 2.5, -4], [4, 3.5, -6]))).toBeFalsy();
    expect(frustum.containsAABB(f, aabb.create([0, 0, -6], [1.5, 1, -4]))).toBeFalsy();
    expect(frustum.containsAABB(f, aabb.create([0, 0, -7], [1.5, 3.5, -6.5]))).toBeFalsy();
  });
});
