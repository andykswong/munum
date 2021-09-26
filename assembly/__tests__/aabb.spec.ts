import { aabb, AABB, Float, ReadonlyAABB, ReadonlyMat4, vec3, Vec3 } from '../index';
import { expectAABBEqual, expectVecEqual } from './test-utils';

describe('aabb', () => {
  test('create()', () => {
    expectAABBEqual(aabb.create(), new AABB([0, 0, 0], [0, 0, 0]));
    expectAABBEqual(aabb.create([1, 2, 3], [4, 5, 6]), new AABB([1, 2, 3], [4, 5, 6]));
  });

  test('copy(a, b)', () => {
    expectAABBEqual(aabb.copy(
      aabb.create([1, 2, 3], [4, 5, 6]),
      aabb.create([7, 8, 9], [10, 11, 12])
    ), aabb.create([1, 2, 3], [4, 5, 6]));
  });

  test('set(a, min, max)', () => {
    expectAABBEqual(aabb.set(
      aabb.create([1, 2, 3], [4, 5, 6]),
      [7, 8, 9], [10, 11, 12]
    ), aabb.create([7, 8, 9], [10, 11, 12]));
  });

  test('union(a, b)', () => {
    expectAABBEqual(aabb.union(
      aabb.create([1, 2, 3], [4, 5, 6]),
      aabb.create([7, 8, 9], [10, 11, 12]),
    ), aabb.create([1, 2, 3], [10, 11, 12]));
  });

  test('intersection(a, b)', () => {
    expectAABBEqual(aabb.intersection(
      aabb.create([1, 2, 3], [4, 5, 6]),
      aabb.create([7, 8, 9], [10, 11, 12]),
    ), aabb.create([7, 8, 9], [7, 8, 9]));

    expectAABBEqual(aabb.intersection(
      aabb.create([1, 2, 3], [7, 8, 9]),
      aabb.create([4, 5, 6], [10, 11, 12]),
    ), aabb.create([4, 5, 6], [7, 8, 9]));
  });

  test('intersect(a, b)', () => {
    expect(aabb.intersect(
      aabb.create([1, 2, 3], [4, 5, 6]),
      aabb.create([7, 8, 9], [10, 11, 12]),
    )).toBeFalsy();

    expect(aabb.intersect(
      aabb.create([1, 2, 3], [7, 8, 9]),
      aabb.create([4, 5, 6], [10, 11, 12]),
    )).toBeTruthy();
    
    expect(aabb.intersect(
      aabb.create([1, 2, 3], [7, 8, 9]),
      aabb.create([4, 8, 9], [10, 11, 12]),
    )).toBeTruthy();
  });

  test('transform(a, m)', () => {
    const a = aabb.create([1, 2, 3], [4, 5, 6]);

    const m1: ReadonlyMat4 = [2, 0, 0, 0, 0, 3, 0, 0, 0, 0, 5, 0, 7, 11, 13, 1];
    expectAABBEqual(transformAABB(a, m1), aabb.transform(a, m1));

    const m2: ReadonlyMat4 = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15];
    expectAABBEqual(transformAABB(a, m2), aabb.transform(a, m2));
  });

  test('displacement(a, p)', () => {
    expectVecEqual(aabb.displacement(
      aabb.create([0, 0, 0], [1, 2, 3]),
      [9, 8, 7]
    ), [8, 6, 4] as Vec3);

    expectVecEqual(aabb.displacement(
      aabb.create([0, 0, 0], [1, 2, 3]),
      [.5, 1, 2]
    ), [-.5, -1, -1] as Vec3);
  });

  test('dist(a, p)', () => {
    expect(aabb.dist(
      aabb.create([0, 0, 0], [1, 2, 3]),
      [-3, 6, 15]
    )).toBeCloseTo(13);

    expect(aabb.dist(
      aabb.create([0, 0, 0], [1, 2, 3]),
      [4, 1, -4]
    )).toBeCloseTo(5);

    expect(aabb.dist(
      aabb.create([0, 0, 0], [5, 7, 9]),
      [2, 3, 4]
    )).toBeCloseTo(-2);
  });

  test('containsPoint(a, p)', () => {
    expect(aabb.containsPoint(aabb.create([0, 0, 0], [1, 2, 3]), [1, 2, 3])).toBeTruthy();
    expect(aabb.containsPoint(aabb.create([0, 0, 0], [1, 2, 3]), [0.5, 1, 2])).toBeTruthy();
    expect(aabb.containsPoint(aabb.create([0, 0, 0], [1, 2, 3]), [2, 3, 4])).toBeFalsy();
    expect(aabb.containsPoint(aabb.create([0, 0, 0], [1, 2, 3]), [2, 1, 2])).toBeFalsy();
    expect(aabb.containsPoint(aabb.create([0, 0, 0], [1, 2, 3]), [-1, 3, 4])).toBeFalsy();
  });

  test('containsPoint(a, p, r)', () => {
    expect(aabb.containsPoint(aabb.create([0, 0, 0], [1, 2, 3]), [1, 2, 3], 1)).toBeTruthy();
    expect(aabb.containsPoint(aabb.create([0, 0, 0], [1, 2, 3]), [2, 1, 2], 1)).toBeTruthy();
    expect(aabb.containsPoint(aabb.create([0, 0, 0], [1, 2, 3]), [-1, 3, 2], 1)).toBeFalsy();
    expect(aabb.containsPoint(aabb.create([0, 0, 0], [1, 2, 3]), [-1, 3, 2], 2)).toBeTruthy();
  });
});

function transformAABB(a: ReadonlyAABB, m: ReadonlyMat4): AABB {
  const corners: Vec3[] = [
    vec3.copy(a.min), [a.max[0], a.min[1], a.min[2]], [a.max[0], a.max[1], a.min[2]], [a.min[0], a.max[1], a.min[2]],
    [a.min[0], a.min[1], a.max[2]], [a.max[0], a.min[1], a.max[2]], [a.max[0], a.max[1], a.max[2]], [a.min[0], a.max[1], a.max[2]], vec3.copy(a.max)
  ];
  for (let i = 0; i < corners.length; ++i) {
    vec3.mmul4(m, corners[i], corners[i]); 
  }

  const result = aabb.create(vec3.copy(corners[0]), vec3.copy(corners[0]));
  for (let i = 1; i < corners.length; ++i) {
    for (let j = 0; j < 3; ++j) {
      result.min[j] = Math.min(result.min[j], corners[i][j]) as Float;
      result.max[j] = Math.max(result.max[j], corners[i][j]) as Float;
    } 
  }

  return result;
}
