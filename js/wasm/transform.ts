import * as wasm from '../../wasm/index.js';
import { Mat3, Mat4 } from './mat.ts';
import { Quat } from './quat.ts';
import { Vec2, Vec3 } from './vec.ts';

/** Returns a {@link Mat3} for a 2D point translated by (x, y). */
export function translation2d(v: Vec2, out = Mat3.identity()): Mat3 {
  wasm.translation2d(out.byteOffset, v.byteOffset);
  return out;
}

/** Returns a {@link Mat3} for a 2D point scaled by (x, y). */
export function scaling2d(v: Vec2, out = Mat3.identity()): Mat3 {
  wasm.scaling2d(out.byteOffset, v.byteOffset);
  return out;
}

/** Returns a {@link Mat3} for a 2D point rotated in couterclockwise direction. */
export function rotation2d(angle: number, out = Mat3.identity()): Mat3 {
  wasm.rotation2d(out.byteOffset, angle);
  return out;
}

/**
 * Returns a {@link Mat3} for transformation in TRS order (= translation * rotation * scale).
 * @returns out = translation * rotation * scale
 */
export function transformation2d(translate: Vec2, rotateAngle: number, scale: Vec2, out = Mat3.identity()): Mat3 {
  wasm.transformation2d(out.byteOffset, translate.byteOffset, rotateAngle, scale.byteOffset);
  return out;
}

/** Return a {@link Mat4} for a 3D point translated by (x, y, z). */
export function translation(v: Vec3, out = Mat4.identity()): Mat4 {
  wasm.translation(out.byteOffset, v.byteOffset);
  return out;
}

/** Return a {@link Mat4} for a 3D point scaled by (x, y, z). */
export function scaling(v: Vec3, out = Mat4.identity()): Mat4 {
  wasm.scaling(out.byteOffset, v.byteOffset);
  return out;
}

/** Returns a {@link Mat4} for a rotation by a {@link Quat}. */
export function rotation(q: Quat, out = Mat4.identity()): Mat4 {
  wasm.rotation(out.byteOffset, q.byteOffset);
  return out;
}

/** Extract the {@link Vec3} translation component from a transformation matrix. */
export function translationOf(m: Mat4, out = new Vec3()): Vec3 {
  wasm.translationof(out.byteOffset, m.byteOffset);
  return out;
}

/**
 * Extract the {@link Vec3} scaling components from a transformation matrix
 * in TRS order (= translation * rotation * scale).
 */
export function scalingOf(m: Mat4, out = new Vec3()): Vec3 {
  wasm.scalingof(out.byteOffset, m.byteOffset);
  return out;
}

/**
 * Extract the {@link Quat} rotation components from a transformation matrix
 * in TRS order (= translation * rotation * scale).
 * @see https://en.wikipedia.org/wiki/Rotation_matrix#Quaternion
 */
export function rotationOf(m: Mat4, out = Quat.identity()): Quat {
  wasm.rotationof(out.byteOffset, m.byteOffset);
  return out;
}

/**
 * Returns a {@link Mat4} for transformation in TRS order (= translation * rotation * scale).
 * @returns out = translation * rotation * scale
 */
export function transformation(translate: Vec3, rotate: Quat, scale: Vec3, out = Mat4.identity()): Mat4 {
  wasm.transformation(out.byteOffset, translate.byteOffset, rotate.byteOffset, scale.byteOffset);
  return out;
}

/**
 * Returns the inverse of a {@link Mat4} that is assumed to represent a valid transformation
 * in TRS order (= translation * rotation * scale).
 * This function is more efficient than {@link Mat4.invert} by using the properties of a TRS matrix.
 * @returns out = M^-1
 */
export function inverseTRS(trs: Mat4, out = Mat4.identity()): boolean {
  return !!wasm.inverttrs(out.byteOffset, trs.byteOffset);
}

/**
 * Calculate the {@link Mat4} orthographic projection matrix.
 * To apply a glTF orthographic camera, use: left = -xmag, right = xmag, bottom = -ymag, top = ymag.
 * @see https://en.wikipedia.org/wiki/Orthographic_projection
 * @see https://github.com/KhronosGroup/glTF/tree/master/specification/2.0
 */
export function ortho(
  left: number, right: number, bottom: number, top: number, znear: number, zfar: number, out = Mat4.identity()
): Mat4 {
  wasm.ortho(out.byteOffset, left, right, bottom, top, znear, zfar);
  return out;
}

/**
 * Calculate the {@link Mat4} perspective projection using glTF's formula. Use infinite projection if zfar = Infinity.
 * @see https://github.com/KhronosGroup/glTF/tree/master/specification/2.0
 */
export function perspective(aspect: number, yfov: number, znear: number, zfar: number, out = Mat4.identity()): Mat4 {
  wasm.perspective(out.byteOffset, aspect, yfov, znear, zfar);
  return out;
}

/** Calculate the {@link Mat4} perspective projection from a viewport. Use infinite projection if zfar = Infinity. */
export function perspectiveViewport(
  left: number, right: number, bottom: number, top: number, znear: number, zfar: number, out = Mat4.identity()
): Mat4 {
  wasm.perspectiveviewport(out.byteOffset, left, right, bottom, top, znear, zfar);
  return out;
}

/**
 * Calculate the {@link Mat4} model matrix for a camera at eye position looking at the center
 * position with a given up direction.
 */
export function targetTo(eye: Vec3, center: Vec3, up: Vec3, out = Mat4.identity()): Mat4 {
  wasm.targetto(out.byteOffset, eye.byteOffset, center.byteOffset, up.byteOffset);
  return out;
}

/**
 * Calculate the {@link Mat4} view matrix for a camera at eye position looking at the center
 * position with a given up direction.
 */
export function lookAt(eye: Vec3, center: Vec3, up: Vec3, out = Mat4.identity()): Mat4 {
  wasm.lookat(out.byteOffset, eye.byteOffset, center.byteOffset, up.byteOffset);
  return out;
}

/**
 * Calculate the look-at direction {@link Vec3} vector from pitch (up/down) and yaw (left/right) angles in radians.
 * It looks towards -Z axis when pitch = 0 and yaw = 0.
 * This can be used with lookAt method to build an FPS camera view matrix by:
 * viewMatrix = lookAt(eye, lookAtDir(yaw, pitch).add(eye), new Vec3(0, 1, 0));
 */
export function lookAtDir(pitch: number, yaw: number, out = new Vec3()): Vec3 {
  wasm.lookatdir(out.byteOffset, pitch, yaw);
  return out;
}
