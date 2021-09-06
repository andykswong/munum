import { aabb, AABB } from '../index';
import { expectAABBEqual } from './test-utils';

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
});
