import { Float, Mat4, Quat, ReadonlyMat4, ReadonlyQuat, ReadonlyVec3, Vec3 } from './types';
import * as mat from './mat';
import * as mat4 from './mat4';
import * as quat from './quat';
import * as vec3 from './vec3';
import { copysign } from './scalar';

// Temp variables
const v0: Vec3 = vec3.create();
const v1: Vec3 = vec3.create();
const v2: Vec3 = vec3.create();

/**
 * Return a {@link Mat4} for a 3D point translated by (x, y, z).
 */
export function translate(v: ReadonlyVec3, out: Mat4 = mat4.create()): Mat4 {
  mat4.id(out);
  mat.copy(v, out, 0, 12, 3);
  return out;
}

/**
 * Return a {@link Mat4} for a 3D point scaled by (x, y, z).
 */
export function scale(s: ReadonlyVec3, out: Mat4 = mat4.create()): Mat4 {
  mat4.id(out);
  unchecked(out[0] = s[0]);
  unchecked(out[5] = s[1]);
  unchecked(out[10] = s[2]);
  return out;
}

/**
 * Returns a {@link Mat4} for a rotation by a {@link Quat}.
 */
export function rotate(q: ReadonlyQuat, out: Mat4 = mat4.create()): Mat4 {
  return quat.toMat4(q, out);
}

/**
 * Returns a {@link Mat4} for a 3D rotation about the x-axis in couterclockwise direction.
 * @see https://en.wikipedia.org/wiki/Rotation_matrix#Basic_rotations
 */
export function rotateX(theta: Float, out: Mat4 = mat4.create()): Mat4 {
  mat4.id(out);
  unchecked(out[5] = out[10] = Math.cos(theta) as Float);
  unchecked(out[6] = out[9] = Math.sin(theta) as Float);
  unchecked(out[9] *= -1);
  return out;
}

/**
 * Returns a {@link Mat4} for a 3D rotation about the y-axis in couterclockwise direction.
 * @see https://en.wikipedia.org/wiki/Rotation_matrix#Basic_rotations
 */
export function rotateY(theta: Float, out: Mat4 = mat4.create()): Mat4 {
  mat4.id(out);
  unchecked(out[0] = out[10] = Math.cos(theta) as Float);
  unchecked(out[2] = out[8] = Math.sin(theta) as Float);
  unchecked(out[2] *= -1);
  return out;
}

/**
 * Returns a {@link Mat4} for a 3D rotation about the z-axis in couterclockwise direction.
 * @see https://en.wikipedia.org/wiki/Rotation_matrix#Basic_rotations
 */
export function rotateZ(theta: Float, out: Mat4 = mat4.create()): Mat4 {
  mat4.id(out);
  unchecked(out[0] = out[5] = Math.cos(theta) as Float);
  unchecked(out[1] = out[4] = Math.sin(theta) as Float);
  unchecked(out[4] *= -1);
  return out;
}

/**
 * Returns a {@link Mat4} for a 3D rotation about a given unit axis in couterclockwise direction.
 * @see https://en.wikipedia.org/wiki/Rotation_matrix#Basic_rotations
 */
export function rotateAxis(axis: ReadonlyVec3, theta: Float, out: Mat4 = mat4.create()): Mat4 {
  const
    x: Float = unchecked(axis[0]),
    y: Float = unchecked(axis[1]),
    z: Float = unchecked(axis[2]);
  const s: Float = Math.sin(theta) as Float;
  const c: Float = Math.cos(theta) as Float;
  const omc: Float = 1 - c;

  unchecked(out[0] = x * x * omc + c);
  unchecked(out[1] = x * y * omc + z * s);
  unchecked(out[2] = x * z * omc - y * s);
  unchecked(out[4] = y * x * omc - z * s);
  unchecked(out[5] = y * y * omc + c);
  unchecked(out[6] = y * z * omc + x * s);
  unchecked(out[8] = z * x * omc + y * s);
  unchecked(out[9] = z * y * omc - x * s);
  unchecked(out[10] = z * z * omc + c);
  unchecked(out[3] = out[7] = out[11] = out[12] = out[13] = out[14] = 0);
  unchecked(out[15] = 1);
  return out;
}

/**
 * Returns a {@link Mat4} for transformation in TRS order (= translation * rotation * scale).
 * @returns out = translation * rotation * scale
 */
export function transform(translation: ReadonlyVec3, rotation: ReadonlyQuat, scaling: ReadonlyVec3, out: Mat4 = mat4.create()): Mat4 {
  // Apply rotation
  rotate(rotation, out);

  // Apply scaling
  for (let i = 0; i < 3; ++i) {
    for (let j = 0; j < 3; ++j) {
      unchecked(out[4 * i + j] *= scaling[i]);
    }
  }

  // Apply translation
  mat.copy(translation, out, 0, 12, 3);

  return out;
}

/**
 * Returns the inverse of a {@link ReadonlyMat4} that represents a valid transformation in TRS order (= translation * rotation * scale).
 * This function is more efficient than {@link mat4.invert} by using the properties of a TRS matrix.
 * @returns out = M^-1
 */
export function inverseTransform(m: ReadonlyMat4, out: Mat4 = mat4.create()): Mat4 {
  // Assume M is a TRS matrix:
  // M = T * R * S = [RS  t]
  //                 [0   1]
  // Then the inverse of M is:
  // M^-1 = [(RS)^-1  (RS)^-1 * -t]
  //        [   0           1     ]
  // Where: (RS)^-1 = S^-1 * R^-1 = S^-1 * RT = S^-1 * ((RS)(S^-1))T = S^-1 * (S^-1)T * (RS)T = S^-1 * S^-1 * (RS)T

  // Calculate output = (RS)T
  mat4.transpose(m, out);
  unchecked(out[3] = out[7] = out[11] = 0);

  // Extract S and premultiply S^-2 = 1/(S*S) to output
  scaleOf(m, v1);
  for (let i = 0; i < 3; ++i) {
    for (let j = 0; j < 3; ++j) {
      unchecked(out[4 * i + j] *= 1 / (v1[j] * v1[j]));
    }
  }

  // With output = (RS)^-1, apply translation = (output * -t) to output
  mat.copy(
    vec3.mmul4(out, vec3.scale(mat.copy(m, v0, 12, 0, 3) as Vec3, -1)),
    out,
    0, 12, 3
  );

  return out;
}

// -- Transformation matrix decomposition --

/**
 * Extract the {@link Vec3} translation component from a transformation matrix.
 */
export function translationOf(m: ReadonlyMat4, out: Vec3 = vec3.create()): Vec3 {
  return mat.copy(m, out, 12, 0, 3) as Vec3;
}

/**
 * Extract the {@link Vec3} scaling components from a transformation matrix in TRS order (= translation * rotation * scale).
 */
export function scaleOf(m: ReadonlyMat4, out: Vec3 = vec3.create()): Vec3 {
  for (let i = 0; i < 3; ++i) {
    for (let j = 0; j < 3; ++j) {
      unchecked(v0[j] = m[4 * i + j]);
    }
    unchecked(out[i] = vec3.len(v0));
  }
  return out;
}

/**
 * Extract the {@link Quat} rotation components from a transformation matrix in TRS order (= translation * rotation * scale).
 * @see https://en.wikipedia.org/wiki/Rotation_matrix#Quaternion
 */
export function rotationOf(m: ReadonlyMat4, out: Quat = quat.create()): Quat {
  scaleOf(m, v1);
  const
    m00: Float = unchecked(m[0] / v1[0]),
    m11: Float = unchecked(m[5] / v1[1]),
    m22: Float = unchecked(m[10] / v1[2]);

  unchecked(out[3] = (Math.sqrt(Math.max(0, 1 + m00 + m11 + m22)) as Float) / 2);
  unchecked(out[0] = copysign((Math.sqrt(Math.max(0, 1 + m00 - m11 - m22)) as Float) / 2, m[6] / v1[1] - m[9] / v1[2]));
  unchecked(out[1] = copysign((Math.sqrt(Math.max(0, 1 - m00 + m11 - m22)) as Float) / 2, m[8] / v1[2] - m[2] / v1[0]));
  unchecked(out[2] = copysign((Math.sqrt(Math.max(0, 1 - m00 - m11 + m22)) as Float) / 2, m[1] / v1[0] - m[4] / v1[1]));

  return out;
}

// -- Camera matrices --

/**
 * Calculate the {@link Mat4} orthographic projection matrix.
 * To apply a glTF orthographic camera, use: left = -xmag, right = xmag, bottom = -ymag, top = ymag.
 * @see https://en.wikipedia.org/wiki/Orthographic_projection
 * @see https://github.com/KhronosGroup/glTF/tree/master/specification/2.0
 */
export function ortho(
  left: Float, right: Float, bottom: Float, top: Float, znear: Float, zfar: Float,
  out: Mat4 = mat4.create()
): Mat4 {
  const x: Float = 1 / (right - left);
  const y: Float = 1 / (top - bottom);
  const z: Float = 1 / (znear - zfar);

  mat4.id(out);
  unchecked(out[0] = 2 * x);
  unchecked(out[5] = 2 * y);
  unchecked(out[10] = 2 * z);
  unchecked(out[12] = -(right + left) * x);
  unchecked(out[13] = -(top + bottom) * y);
  unchecked(out[14] = (znear + zfar) * z);
  return out;
}

/**
 * Calculate the {@link Mat4} perspective projection using glTF's formula. Use infinite projection if zfar = Infinity.
 * @see https://github.com/KhronosGroup/glTF/tree/master/specification/2.0
 * @param zfar defaults to Infinity
 */
export function perspective(
  aspectRatio: Float, yfov: Float, znear: Float, zfar: Float = Infinity,
  out: Mat4 = mat4.create()
): Mat4 {
  const f: Float = 1 / (Math.tan(yfov / 2) as Float);

  mat4.id(out);
  unchecked(out[0] = f / aspectRatio);
  unchecked(out[5] = f);
  unchecked(out[11] = -1);
  unchecked(out[15] = 0);

  if (isFinite(zfar)) {
    const rangeInv: Float = 1 / (znear - zfar);
    unchecked(out[10] = (znear + zfar) * rangeInv);
    unchecked(out[14] = 2 * znear * zfar * rangeInv);
  } else {
    unchecked(out[10] = -1);
    unchecked(out[14] = -2 * znear);
  }

  return out;
}

/**
 * Calculate the {@link Mat4} model matrix for a camera at eye position looking at the center
 * position with a given up direction.
 */
export function targetTo(
  eye: ReadonlyVec3, center: ReadonlyVec3, up: ReadonlyVec3 = vec3.create(0, 1, 0),
  out: Mat4 = mat4.create()
): Mat4 {
  const v: Vec3 = vec3.sub(eye, center, v0); // front
  vec3.norm(v, v);
  const n: Vec3 = vec3.cross(up, v, v1); // right
  vec3.norm(n, n);
  const u: Vec3 = vec3.cross(v, n, v2); // up
  vec3.norm(u, u);

  mat.copy(n, out, 0, 0, 3);
  mat.copy(u, out, 0, 4, 3);
  mat.copy(v, out, 0, 8, 3);
  mat.copy(eye, out, 0, 12, 3);
  unchecked(out[3] = out[7] = out[11] = 0);
  unchecked(out[15] = 1);
  return out;
}

/**
 * Calculate the {@link Mat4} view matrix for a camera at eye position looking at the center
 * position with a given up direction.
 * @param center defaults to the origin, i.e. [0, 0, 0]
 * @param up defaults to the positive y-axis, i.e. [0, 1, 0]
 */
export function lookAt(
  eye: ReadonlyVec3,
  center: ReadonlyVec3 = vec3.create(),
  up: ReadonlyVec3 = vec3.create(0, 1, 0),
  out: Mat4 = mat4.create()
): Mat4 {
  const v: Vec3 = vec3.sub(center, eye, v0); // front
  vec3.norm(v, v);
  const n: Vec3 = vec3.cross(v, up, v1); // right
  vec3.norm(n, n);
  const u: Vec3 = vec3.cross(n, v, v2); // up
  vec3.norm(u, u);

  unchecked(out[0] = n[0]);
  unchecked(out[1] = u[0]);
  unchecked(out[2] = -v[0]);
  unchecked(out[4] = n[1]);
  unchecked(out[5] = u[1]);
  unchecked(out[6] = -v[1]);
  unchecked(out[8] = n[2]);
  unchecked(out[9] = u[2]);
  unchecked(out[10] = -v[2]);
  unchecked(out[12] = -vec3.dot(n, eye));
  unchecked(out[13] = -vec3.dot(u, eye));
  unchecked(out[14] = vec3.dot(v, eye));
  unchecked(out[3] = out[7] = out[11] = 0);
  unchecked(out[15] = 1);
  return out;
}

/**
 * Calculate the look-at direction {@link Vec3} vector from pitch (up/down) and yaw (left/right) angles in radians.
 * It looks towards -Z axis when pitch = 0 and yaw = 0.
 * This can be used with lookAt method to build an FPS camera view matrix by:
 * viewMatrix = lookAt(eye, add(eye, direction(yaw, pitch)), [0, 1, 0])
 */
export function direction(pitch: Float, yaw: Float, out: Vec3 = vec3.create()): Vec3 {
  const negCosPitch: Float = -Math.cos(pitch) as Float;
  unchecked(out[0] = negCosPitch * Math.sin(yaw) as Float);
  unchecked(out[1] = Math.sin(pitch) as Float);
  unchecked(out[2] = negCosPitch * Math.cos(yaw) as Float);
  return out;
}
