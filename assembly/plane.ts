import { Float, Plane, ReadonlyPlane, ReadonlyVec3, Vec3 } from './types';
import * as array from './array';
import * as vec3 from './vec3';
import * as vec4 from './vec4';

// Temp variables
const v1: Vec3 = vec3.create();
const v2: Vec3 = vec3.create();

/**
 * Build a normalized {@link Plane} from a normal and a point on plane.
 * Normalized plane has len(a, b, c) = 1.
 */
export function fromPointNormal(normal: ReadonlyVec3, point: ReadonlyVec3, out: Plane = vec4.create()): Plane {
  vec3.norm(normal, v1);
  unchecked(out[3] = -vec3.dot(v1, point));
  return array.copy(v1, out) as Plane;
}

/**
 * Build a normalized {@link Plane} from 3 points on plane.
 * The counter-clockwise face of triangle formed by a, b, c is considered the front face of the plane.
 * Normalized plane has len(a, b, c) = 1.
 */
export function fromPoints(a: ReadonlyVec3, b: ReadonlyVec3, c: ReadonlyVec3, out: Plane = vec4.create()): Plane {
  return fromPointNormal(vec3.cross(vec3.sub(b, a, v1), vec3.sub(c, a, v2), v2), a, out);
}

/**
 * Normalize a {@link Plane} equation for correct distance calculation.
 * Normalized plane has len(a, b, c) = 1.
 */
export function norm(p: ReadonlyPlane, out: Plane = vec4.create()): Plane {
  return unchecked(vec4.scale(p, 1 / ((Math.sqrt(p[0] * p[0] + p[1] * p[1] + p[2] * p[2]) as Float) || 1), out));
}

/**
 * Calculates the shortest signed distance from the given point q to a normalized {@link Plane} p.
 * Positive if q is on the same side of the plane as the plane normal; negative if it is on the opposite side.
 * Normalized plane has len(a, b, c) = 1.
 */
export function dist(p: ReadonlyPlane, q: ReadonlyVec3): Float {
  return unchecked(p[0] * q[0] + p[1] * q[1] + p[2] * q[2] + p[3]);
}

/**
 * Returns if the normal of a {@link Plane} p is front-facing given the direction vector d.
 */
export function frontFacing(p: ReadonlyPlane, d: ReadonlyVec3): boolean {
  return unchecked(p[0] * d[0] + p[1] * d[1] + p[2] * d[2] <= 0);
}
