import { Float, Mat4, Quat, ReadonlyQuat, ReadonlyVec3, Vec3 } from './types';
/**
 * Create a new identity {@link Quat}.
 * @returns [0, 0, 0, 1]
 */
export declare function create(): Quat;
/**
 * Create a {@link Quat} from a unit axis vector and rotation angle in couterclockwise direction.
 */
export declare function fromAxisAngle(axis: ReadonlyVec3, angle: Float, out?: Quat): Quat;
/**
 * Returns a {@link Quat} from a rotation around x-axis in couterclockwise direction.
 * @returns the quat representing the rotation
 */
export declare function fromAngleX(angle: Float, out?: Quat): Quat;
/**
 * Returns a {@link Quat} from a rotation around y-axis in couterclockwise direction.
 * @returns the quat representing the rotation
 */
export declare function fromAngleY(angle: Float, out?: Quat): Quat;
/**
 * Returns a {@link Quat} from a rotation around z-axis in couterclockwise direction.
 * @returns the quat representing the rotation
 */
export declare function fromAngleZ(angle: Float, out?: Quat): Quat;
/**
 * Returns a {@link Quat} that represents the shortest arc rotation between 2 unit vectors.
 * @returns the quat representing the rotation
 */
export declare function fromUnitVecs(from: ReadonlyVec3, to: ReadonlyVec3, out?: Quat): Quat;
/**
 * Convert a {@link Quat} to a {@link Mat4}.
 * @returns Mat4
 */
export declare function toMat4(q: ReadonlyQuat, out?: Mat4): Mat4;
/**
 * Copy a {@link Quat}.
 * @returns out
 */
export declare function copy(q: ReadonlyQuat, out?: Quat): Quat;
/**
 * Calculate dot product between 2 {@link Quat}.
 * @returns a * b
 */
export declare const dot: (a: ReadonlyQuat, b: ReadonlyQuat) => Float;
/**
 * Calculate squared length of a {@link ReadonlyQuat}.
 * @returns dot(v, v)
 */
export declare const sqrLen: (v: ReadonlyQuat) => Float;
/**
 * Calculate length of a {@link Quat}.
 * @returns |v|
 */
export declare const len: (v: ReadonlyQuat) => Float;
/**
* Normalize a {@link Quat}.
*/
export declare const norm: (q: ReadonlyQuat, out?: Quat) => Quat;
/**
* Calculates the conjugate of a {@link Quat}.
*/
export declare function conj(q: ReadonlyQuat, out?: Quat): Quat;
/**
* Calculate the inverse of a {@link Quat}.
*/
export declare function invert(q: ReadonlyQuat, out?: Quat): Quat;
/**
 * Calculate the Hamilton product of 2 {@link Quat}.
 * @returns out = a * b
 */
export declare function mul(a: ReadonlyQuat, b: ReadonlyQuat, out?: Quat): Quat;
/**
 * Rotate a {@link ReadonlyVec3} using a {@link ReadonlyQuat}, by the formula v' = q * v * q^-1
 * @see https://en.wikipedia.org/wiki/Quaternions_and_spatial_rotation#Using_quaternion_as_rotations
 * @returns out = q * v * q^-1
 */
export declare function rotateVec3(q: ReadonlyQuat, v: ReadonlyVec3, out?: Vec3): Vec3;
/**
 * Linear interpolate between 2 {@link Quat}.
 * @returns out = lerp(a, b, t)
 */
export declare function lerp(a: ReadonlyQuat, b: ReadonlyQuat, t: Float, out?: Quat): Quat;
/**
 * Spherical linear interpolate between 2 {@link Quat}.
 */
export declare function slerp(a: ReadonlyQuat, b: ReadonlyQuat, t: Float, out?: Quat): Quat;
//# sourceMappingURL=quat.d.ts.map