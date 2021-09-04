import { AABB, Float, ReadonlyAABB, ReadonlyMat4, ReadonlyVec3, Vec3 } from './types';
/**
 * Create a new {@link AABB}.
 */
export declare const create: (min?: Vec3, max?: Vec3) => AABB;
/**
 * Calculates the union of 2 {@link ReadonlyAABB}s.
 */
export declare function union(a: ReadonlyAABB, b: ReadonlyAABB, out?: AABB): AABB;
/**
 * Efficient algorithm for transforming an {@link ReadonlyAABB}, taken from Graphics Gems.
 */
export declare function transform(a: ReadonlyAABB, m: ReadonlyMat4, out?: AABB): AABB;
/**
 * Calculates the shortest signed displacement (vector distance) between the
 * {@link AABB} and the given point.
 */
export declare function displacement(box: ReadonlyAABB, point: ReadonlyVec3, out?: Vec3): Vec3;
/**
 * Calculates the shortest signed distance between the {@link AABB} and the given point.
 */
export declare function dist(box: ReadonlyAABB, point: ReadonlyVec3): Float;
/**
 * Checks whether a given point is inside the {@link ReadonlyAABB}.
 */
export declare function contains(box: ReadonlyAABB, point: ReadonlyVec3): boolean;
/**
 * Checks whether 2 {@link ReadonlyAABB} intersect.
 */
export declare function intersect(a: ReadonlyAABB, b: ReadonlyAABB): boolean;
//# sourceMappingURL=aabb.d.ts.map