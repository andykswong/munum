import { AABB, Float, Int, ReadonlyAABB, ReadonlyMat4, ReadonlyVec3, Vec3 } from '@andykswong/munum-types';
import * as array from './array';
import * as vec3 from './vec3';

const v0: Vec3 = vec3.create();
const v1: Vec3 = vec3.create();

/**
 * Create a new {@link AABB}.
 */
export const create = (min: Vec3 = vec3.create(), max: Vec3 = vec3.create()): AABB => new AABB(min, max);

/**
 * Calculates the union of 2 {@link ReadonlyAABB}s.
 */
export function union(a: ReadonlyAABB, b: ReadonlyAABB, out: AABB = create()): AABB {
  out.min[0] = Math.min(a.min[0], b.min[0]) as Float;
  out.min[1] = Math.min(a.min[1], b.min[1]) as Float;
  out.min[2] = Math.min(a.min[2], b.min[2]) as Float;
  out.max[0] = Math.max(a.max[0], b.max[0]) as Float;
  out.max[1] = Math.max(a.max[1], b.max[1]) as Float;
  out.max[2] = Math.max(a.max[2], b.max[2]) as Float;
  return out;
}

/**
 * Efficient algorithm for transforming an {@link ReadonlyAABB}, taken from Graphics Gems.
 */
export function transform(a: ReadonlyAABB, m: ReadonlyMat4, out: AABB = create()): AABB {
  // min: v0, max: v1
  for (let i: Int = 0; i < 3; ++i) {
    v0[i] = m[3 * 4 + i];
    v1[i] = m[3 * 4 + i];

    for (let j: Int = 0; j < 3; ++j) {
      const x: Float = a.min[j] * m[j * 4 + i];
      const y: Float = a.max[j] * m[j * 4 + i];
      v0[i] += Math.min(x, y) as Float;
      v1[i] += Math.max(x, y) as Float;
    }
  }

  array.copy(v0, out.min);
  array.copy(v1, out.max);
  return out;
}

/**
 * Calculates the shortest signed displacement (vector distance) between the
 * {@link AABB} and the given point.
 */
export function displacement(box: ReadonlyAABB, point: ReadonlyVec3, out: Vec3 = vec3.create()): Vec3 {
  // center: v0, extent: v1
  vec3.add(box.min, box.max, v0);
  vec3.sub(box.max, box.min, v1);
  vec3.scale(v0, 0.5, v0);
  vec3.scale(v1, 0.5, v1);

  out[0] = Math.abs(point[0] - v0[0]) - v1[0] as Float;
  out[1] = Math.abs(point[1] - v0[1]) - v1[1] as Float;
  out[2] = Math.abs(point[2] - v0[2]) - v1[2] as Float;
  return out;
}

/**
 * Calculates the shortest signed distance between the {@link AABB} and the given point.
 */
export function dist(box: ReadonlyAABB, point: ReadonlyVec3): Float {
  displacement(box, point, v0);
  v0[0] = Math.max(0, v0[0]) as Float;
  v0[1] = Math.max(0, v0[1]) as Float;
  v0[2] = Math.max(0, v0[2]) as Float;
  return ((v0[0] <= 0 && v0[1] <= 0 && v0[2] <= 0) ? -1 : 1) * vec3.len(v0);
}

/**
 * Checks whether a given point is inside the {@link ReadonlyAABB}.
 */
export function contains(box: ReadonlyAABB, point: ReadonlyVec3): boolean {
  displacement(box, point, v0);
  return v0[0] <= 0 && v0[1] <= 0 && v0[2] <= 0;
}
