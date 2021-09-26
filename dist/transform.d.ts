import { Float, Mat4, Quat, ReadonlyMat4, ReadonlyQuat, ReadonlyVec3, Vec3 } from './types';
/**
 * Return a {@link Mat4} for a 3D point translated by (x, y, z).
 */
export declare function translate(v: ReadonlyVec3, out?: Mat4): Mat4;
/**
 * Return a {@link Mat4} for a 3D point scaled by (x, y, z).
 */
export declare function scale(s: ReadonlyVec3, out?: Mat4): Mat4;
/**
 * Returns a {@link Mat4} for a rotation by a {@link Quat}.
 */
export declare function rotate(q: ReadonlyQuat, out?: Mat4): Mat4;
/**
 * Returns a {@link Mat4} for a 3D rotation about the x-axis in couterclockwise direction.
 * see: https://en.wikipedia.org/wiki/Rotation_matrix#Basic_rotations
 */
export declare function rotateX(theta: Float, out?: Mat4): Mat4;
/**
 * Returns a {@link Mat4} for a 3D rotation about the y-axis in couterclockwise direction.
 * see: https://en.wikipedia.org/wiki/Rotation_matrix#Basic_rotations
 */
export declare function rotateY(theta: Float, out?: Mat4): Mat4;
/**
 * Returns a {@link Mat4} for a 3D rotation about the z-axis in couterclockwise direction.
 * see: https://en.wikipedia.org/wiki/Rotation_matrix#Basic_rotations
 */
export declare function rotateZ(theta: Float, out?: Mat4): Mat4;
/**
 * Returns a {@link Mat4} for a 3D rotation about a given unit axis in couterclockwise direction.
 * see: https://en.wikipedia.org/wiki/Rotation_matrix#Basic_rotations
 */
export declare function rotateAxis(axis: ReadonlyVec3, theta: Float, out?: Mat4): Mat4;
/**
 * Returns a {@link Mat4} for transformation in TRS order (= translation * rotation * scale).
 * @returns out = translation * rotation * scale
 */
export declare function transform(translation: ReadonlyVec3, rotation: ReadonlyQuat, scaling: ReadonlyVec3, out?: Mat4): Mat4;
/**
 * Extract the {@link Vec3} translation component from a transformation matrix.
 */
export declare function translationOf(m: ReadonlyMat4, out?: Vec3): Vec3;
/**
 * Extract the {@link Vec3} scaling components from an affine transformation matrix.
 */
export declare function scaleOf(m: ReadonlyMat4, out?: Vec3): Vec3;
/**
 * Extract the {@link Quat} rotation components from an affine transformation matrix.
 * @see https://en.wikipedia.org/wiki/Rotation_matrix#Quaternion
 */
export declare function rotationOf(m: ReadonlyMat4, out?: Quat): Quat;
/**
 * Calculate the {@link Mat4} orthographic projection matrix.
 * To apply a glTF orthographic camera, use: left = -xmag, right = xmag, bottom = -ymag, top = ymag.
 * @see https://en.wikipedia.org/wiki/Orthographic_projection
 * @see https://github.com/KhronosGroup/glTF/tree/master/specification/2.0
 */
export declare function ortho(left: Float, right: Float, bottom: Float, top: Float, znear: Float, zfar: Float, out?: Mat4): Mat4;
/**
 * Calculate the {@link Mat4} perspective projection using glTF's formula. Use infinite projection if zfar = Infinity.
 * @see https://github.com/KhronosGroup/glTF/tree/master/specification/2.0
 * @param zfar defaults to Infinity
 */
export declare function perspective(aspectRatio: Float, yfov: Float, znear: Float, zfar?: Float, out?: Mat4): Mat4;
/**
 * Calculate the {@link Mat4} model matrix for a camera at eye position looking at the center
 * position with a given up direction.
 */
export declare function targetTo(eye: ReadonlyVec3, center: ReadonlyVec3, up?: ReadonlyVec3, out?: Mat4): Mat4;
/**
 * Calculate the {@link Mat4} view matrix for a camera at eye position looking at the center
 * position with a given up direction.
 * @param center defaults to the origin, i.e. [0, 0, 0]
 * @param up defaults to the positive y-axis, i.e. [0, 1, 0]
 */
export declare function lookAt(eye: ReadonlyVec3, center?: ReadonlyVec3, up?: ReadonlyVec3, out?: Mat4): Mat4;
/**
 * Calculate the look-at direction {@link Vec3} vector from pitch (up/down) and yaw (left/right) angles in radians.
 * It looks towards -Z axis when pitch = 0 and yaw = 0.
 * This can be used with lookAt method to build an FPS camera view matrix by:
 * viewMatrix = lookAt(eye, add(eye, direction(yaw, pitch)), [0, 1, 0])
 */
export declare function direction(pitch: Float, yaw: Float, out?: Vec3): Vec3;
//# sourceMappingURL=transform.d.ts.map