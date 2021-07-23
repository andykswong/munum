import { Float, Frustum, Int, ReadonlyAABB, ReadonlyFrustum, ReadonlyMat4, ReadonlyVec3, Vec3 } from '@andykswong/munum-types';
import * as vec3 from './vec3';
import * as plane from './plane';

// Temp variables
const v0: Vec3 = vec3.create();

/**
 * Build a {@link Frustum} in world space from a view-projection matrix (viewProj = proj * view) using Gribb/Hartmann method.
 * @see http://www8.cs.umu.se/kurser/5DV051/HT12/lab/plane_extraction.pdf
 */
export function fromViewProj(m: ReadonlyMat4): Frustum {
  const f: Frustum = [
    [m[3] + m[0], m[7] + m[4], m[11] + m[8], m[15] + m[12]], // left
    [m[3] - m[0], m[7] - m[4], m[11] - m[8], m[15] - m[12]], // right
    [m[3] + m[1], m[7] + m[5], m[11] + m[9], m[15] + m[13]], // bottom
    [m[3] - m[1], m[7] - m[5], m[11] - m[9], m[15] - m[13]], // top
    [m[3] + m[2], m[7] + m[6], m[11] + m[10], m[15] + m[14]], // near
    [m[3] - m[2], m[7] - m[6], m[11] - m[10], m[15] - m[14]] // far
  ];

  for (let i: Int = 0; i < f.length; ++i) {  // normalize all planes
    plane.norm(f[i], f[i]);
  }

  return f;
}

/**
 * Checks whether the given point / sphere defined by center and radius is inside a {@link ReadonlyFrustum}.
 */
export function containsPoint(f: ReadonlyFrustum, center: ReadonlyVec3, radius: Float = 0): boolean {
  // Check the distance of the center to the planes
  // Point is outside frustum if it falls into the negative half-space of any plane
  for (let i: Int = 0; i < f.length; ++i) {
    if (plane.dist(f[i], center) < radius) {
      return false;
    }
  }
  return true;
}

/**
 * Checks whether the given {@link AABB} is inside given {@link ReadonlyFrustum}.
 */
export function containsAABB(f: ReadonlyFrustum, box: ReadonlyAABB): boolean {
  for (let i: Int = 0; i < f.length; ++i) {
    // Find the corner at max distance
    v0[0] = (f[i][0] > 0) ? box.max[0] : box.min[0];
    v0[1] = (f[i][1] > 0) ? box.max[1] : box.min[1];
    v0[2] = (f[i][2] > 0) ? box.max[2] : box.min[2];
    if(plane.dist(f[i], v0) < 0) { // max point is still outside the plane
      return false;
    }
  }
  return true;
}
