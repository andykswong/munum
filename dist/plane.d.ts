import { Float, Plane, ReadonlyPlane, ReadonlyVec3 } from './types';
/**
 * Build a normalized {@link Plane} from a normal and a point on plane.
 * Normalized plane has len(a, b, c) = 1.
 */
export declare function fromPointNormal(normal: ReadonlyVec3, point: ReadonlyVec3, out?: Plane): Plane;
/**
 * Build a normalized {@link Plane} from 3 points on plane.
 * The counter-clockwise face of triangle formed by a, b, c is considered the front face of the plane.
 * Normalized plane has len(a, b, c) = 1.
 */
export declare function fromPoints(a: ReadonlyVec3, b: ReadonlyVec3, c: ReadonlyVec3, out?: Plane): Plane;
/**
 * Normalize a {@link Plane} equation for correct distance calculation.
 * Normalized plane has len(a, b, c) = 1.
 */
export declare function norm(p: ReadonlyPlane, out?: Plane): Plane;
/**
 * Calculates the shortest signed distance from the given point q to a normalized {@link Plane} p.
 * Positive if q is on the same side of the plane as the plane normal; negative if it is on the opposite side.
 * Normalized plane has len(a, b, c) = 1.
 */
export declare function dist(p: ReadonlyPlane, q: ReadonlyVec3): Float;
/**
 * Returns if the normal of a {@link Plane} p is front-facing given the direction vector d.
 */
export declare function frontFacing(p: ReadonlyPlane, d: ReadonlyVec3): boolean;
//# sourceMappingURL=plane.d.ts.map