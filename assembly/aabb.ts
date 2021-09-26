import { AABB, Float, ReadonlyAABB, ReadonlyMat4, ReadonlyVec3, Vec3 } from './types';
import * as array from './array';
import * as vec3 from './vec3';

const v0: Vec3 = vec3.create();
const v1: Vec3 = vec3.create();

/**
 * Create a new {@link AABB}.
 */
export function create(min: Vec3 = vec3.create(), max: Vec3 = vec3.create()): AABB {
  return new AABB(min, max);
}

/**
 * Copy an {@link AABB}.
 */
export function copy(a: ReadonlyAABB, out: AABB = create()): AABB {
  array.copy(a.min, out.min);
  array.copy(a.max, out.max);
  return out;
}

/**
 * Set values of an {@link AABB}.
 */
export function set(a: AABB, min: Vec3 = vec3.create(), max: Vec3 = vec3.create()): AABB {
  array.copy(min, a.min);
  array.copy(max, a.max);
  return a;
}

/**
 * Calculate the union of 2 {@link ReadonlyAABB}s.
 */
export function union(a: ReadonlyAABB, b: ReadonlyAABB, out: AABB = create()): AABB {
  unchecked(out.min[0] = Math.min(a.min[0], b.min[0]) as Float);
  unchecked(out.min[1] = Math.min(a.min[1], b.min[1]) as Float);
  unchecked(out.min[2] = Math.min(a.min[2], b.min[2]) as Float);
  unchecked(out.max[0] = Math.max(a.max[0], b.max[0]) as Float);
  unchecked(out.max[1] = Math.max(a.max[1], b.max[1]) as Float);
  unchecked(out.max[2] = Math.max(a.max[2], b.max[2]) as Float);
  return out;
}

/**
 * Calculate the intersection of 2 {@link ReadonlyAABB}s.
 */
export function intersection(a: ReadonlyAABB, b: ReadonlyAABB, out: AABB = create()): AABB {
  unchecked(out.min[0] = Math.max(a.min[0], b.min[0]) as Float);
  unchecked(out.min[1] = Math.max(a.min[1], b.min[1]) as Float);
  unchecked(out.min[2] = Math.max(a.min[2], b.min[2]) as Float);
  unchecked(out.max[0] = Math.min(a.max[0], b.max[0]) as Float);
  unchecked(out.max[1] = Math.min(a.max[1], b.max[1]) as Float);
  unchecked(out.max[2] = Math.min(a.max[2], b.max[2]) as Float);

  // ensure max[i] >= min[i]
  unchecked(out.max[0] = Math.max(out.min[0], out.max[0]) as Float);
  unchecked(out.max[1] = Math.max(out.min[1], out.max[1]) as Float);
  unchecked(out.max[2] = Math.max(out.min[2], out.max[2]) as Float);

  return out;
}

/**
 * Efficient algorithm for transforming an {@link ReadonlyAABB}, taken from Graphics Gems.
 */
export function transform(a: ReadonlyAABB, m: ReadonlyMat4, out: AABB = create()): AABB {
  // min: v0, max: v1
  for (let i = 0; i < 3; ++i) {
    unchecked(v0[i] = m[3 * 4 + i]);
    unchecked(v1[i] = m[3 * 4 + i]);

    for (let j = 0; j < 3; ++j) {
      const x: Float = unchecked(a.min[j] * m[j * 4 + i]);
      const y: Float = unchecked(a.max[j] * m[j * 4 + i]);
      unchecked(v0[i] += Math.min(x, y) as Float);
      unchecked(v1[i] += Math.max(x, y) as Float);
    }
  }

  array.copy(v0, out.min);
  array.copy(v1, out.max);
  return out;
}

/**
 * Calculate the shortest signed displacement (vector distance) between the
 * {@link AABB} and the given point.
 */
export function displacement(box: ReadonlyAABB, point: ReadonlyVec3, out: Vec3 = vec3.create()): Vec3 {
  // center: v0, extent: v1
  vec3.add(box.min, box.max, v0);
  vec3.sub(box.max, box.min, v1);
  vec3.scale(v0, 0.5, v0);
  vec3.scale(v1, 0.5, v1);

  unchecked(out[0] = Math.abs(point[0] - v0[0]) - v1[0] as Float);
  unchecked(out[1] = Math.abs(point[1] - v0[1]) - v1[1] as Float);
  unchecked(out[2] = Math.abs(point[2] - v0[2]) - v1[2] as Float);
  return out;
}

/**
 * Calculate the shortest signed distance between the {@link AABB} and the given point.
 */
export function dist(box: ReadonlyAABB, point: ReadonlyVec3): Float {
  displacement(box, point, v0);

  // If point is inside of the AABB, the shortest distance is the distance to closest plane
  if (unchecked(v0[0] <= 0 && v0[1] <= 0 && v0[2] <= 0)) {
    const dxy = Math.max(v0[0], v0[1]);
    return Math.max(dxy, v0[2]) as Float;
  }

  unchecked(v0[0] = Math.max(0, v0[0]) as Float);
  unchecked(v0[1] = Math.max(0, v0[1]) as Float);
  unchecked(v0[2] = Math.max(0, v0[2]) as Float);
  return vec3.len(v0);
}

/**
 * Checks whether the given point / sphere defined by center and radius intersects with given {@link ReadonlyAABB}.
 */
export function containsPoint(box: ReadonlyAABB, center: ReadonlyVec3, radius: Float = 0): boolean {
  return dist(box, center) <= radius;
}

/**
 * Check whether 2 {@link ReadonlyAABB} intersect.
 */
export function intersect(a: ReadonlyAABB, b: ReadonlyAABB): boolean {
  for (let i = 0; i < 3; ++i) {
    if (unchecked(a.min[i] > b.max[i] || b.min[i] > a.max[i])) {
      return false;
    }
  }
  return true;
}
