import {
  Float, Frustum, Plane, ReadonlyAABB, ReadonlyFrustum, ReadonlyMat4, ReadonlyVec3, Vec3
} from './types';
import * as vec3 from './vec3';
import * as plane from './plane';

const FRUSTUM_PLANES = 6;

// Temp variables
const v0: Vec3 = vec3.create();

/**
 * Create a new {@link Frustum} from the 6 normalized planes: left, right, bottom, top, near, far.
 */
export function create(
  left: Plane = plane.create(), right: Plane = plane.create(),
  bottom: Plane = plane.create(), top: Plane = plane.create(),
  near: Plane = plane.create(), far: Plane = plane.create()
): Frustum {
  return [left, right, bottom, top, near, far];
}

/**
 * Build a {@link Frustum} in world space from a view-projection matrix (viewProj = proj * view) using Gribb/Hartmann method.
 * @see http://www8.cs.umu.se/kurser/5DV051/HT12/lab/plane_extraction.pdf
 */
export function fromViewProj(m: ReadonlyMat4, out: Frustum = create()): Frustum {
  unchecked(plane.set(out[0], m[3] + m[0], m[7] + m[4], m[11] + m[8], m[15] + m[12])); // left
  unchecked(plane.set(out[1], m[3] - m[0], m[7] - m[4], m[11] - m[8], m[15] - m[12])); // right

  unchecked(plane.set(out[2], m[3] + m[1], m[7] + m[5], m[11] + m[9], m[15] + m[13])); // bottom
  unchecked(plane.set(out[3], m[3] - m[1], m[7] - m[5], m[11] - m[9], m[15] - m[13])); // top

  unchecked(plane.set(out[4], m[3] + m[2], m[7] + m[6], m[11] + m[10], m[15] + m[14])); // near
  unchecked(plane.set(out[5], m[3] - m[2], m[7] - m[6], m[11] - m[10], m[15] - m[14])); // far

  for (let i = 0; i < FRUSTUM_PLANES; ++i) {  // normalize all planes
    plane.norm(out[i], out[i]);
  }

  return out;
}

/**
 * Checks whether the given point / sphere defined by center and radius intersects with given {@link ReadonlyFrustum}.
 */
export function containsPoint(f: ReadonlyFrustum, center: ReadonlyVec3, radius: Float = 0): boolean {
  // Check the distance of the center to the planes
  // Point is outside frustum if it falls into the negative half-space of any plane
  for (let i = 0; i < FRUSTUM_PLANES; ++i) {
    if (plane.dist(f[i], center) < -radius) {
      return false;
    }
  }
  return true;
}

/**
 * Checks whether the given {@link AABB} intersects with given {@link ReadonlyFrustum}.
 */
export function containsAABB(f: ReadonlyFrustum, box: ReadonlyAABB): boolean {
  for (let i = 0; i < FRUSTUM_PLANES; ++i) {
    // Find the corner at max distance
    unchecked(v0[0] = (f[i][0] > 0) ? box.max[0] : box.min[0]);
    unchecked(v0[1] = (f[i][1] > 0) ? box.max[1] : box.min[1]);
    unchecked(v0[2] = (f[i][2] > 0) ? box.max[2] : box.min[2]);
    if (plane.dist(f[i], v0) < 0) { // max point is still outside the plane
      return false;
    }
  }
  return true;
}
