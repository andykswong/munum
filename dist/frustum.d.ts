import { Float, Frustum, Plane, ReadonlyAABB, ReadonlyFrustum, ReadonlyMat4, ReadonlyVec3 } from './types';
/**
 * Create a new {@link Frustum} from the 6 normalized planes: left, right, bottom, top, near, far.
 */
export declare function create(left?: Plane, right?: Plane, bottom?: Plane, top?: Plane, near?: Plane, far?: Plane): Frustum;
/**
 * Build a {@link Frustum} in world space from a view-projection matrix (viewProj = proj * view) using Gribb/Hartmann method.
 * @see http://www8.cs.umu.se/kurser/5DV051/HT12/lab/plane_extraction.pdf
 */
export declare function fromViewProj(m: ReadonlyMat4, out?: Frustum): Frustum;
/**
 * Checks whether the given point / sphere defined by center and radius intersects with given {@link ReadonlyFrustum}.
 */
export declare function containsPoint(f: ReadonlyFrustum, center: ReadonlyVec3, radius?: Float): boolean;
/**
 * Checks whether the given {@link AABB} intersects with given {@link ReadonlyFrustum}.
 */
export declare function containsAABB(f: ReadonlyFrustum, box: ReadonlyAABB): boolean;
//# sourceMappingURL=frustum.d.ts.map