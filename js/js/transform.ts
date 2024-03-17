import { copysign } from '../scalar.ts';
import { Mat3, Mat4 } from './mat.ts';
import { BYTES_PER_FLOAT64, memoryManager } from './memory.ts';
import { Quat } from './quat.ts';
import { Vec2, Vec3 } from './vec.ts';

const TEMP_VEC3 = new Float64Array(3);
const TEMP_MAT3 = new Float64Array(9);
const TEMP_MAT4 = new Float64Array(16);
const MAT3_ID = [1, 0, 0, 0, 1, 0, 0, 0, 1];
const MAT4_ID = [1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1];

/** Returns a {@link Mat3} for a 2D point translated by (x, y). */
export function translation2d(v: Vec2, out = Mat3.identity()): Mat3 {
  out.set(MAT3_ID);
  out.copy(v, 6, 0, 2);
  return out;
}

/** Returns a {@link Mat3} for a 2D point scaled by (x, y). */
export function scaling2d(v: Vec2, out = Mat3.identity()): Mat3 {
  const [x, y] = v;
  TEMP_MAT3.set(MAT3_ID);
  TEMP_MAT3[0] = x;
  TEMP_MAT3[4] = y;
  out.set(TEMP_MAT3);
  return out;
}

/** Returns a {@link Mat3} for a 2D point rotated in couterclockwise direction. */
export function rotation2d(angle: number, out = Mat3.identity()): Mat3 {
  TEMP_MAT3.set(MAT3_ID);
  TEMP_MAT3[0] = TEMP_MAT3[4] = Math.cos(angle);
  TEMP_MAT3[1] = TEMP_MAT3[3] = Math.sin(angle);
  TEMP_MAT3[3] *= -1;
  out.set(TEMP_MAT3);
  return out;
}

/**
 * Returns a {@link Mat3} for transformation in TRS order (= translation * rotation * scale).
 * @returns out = translation * rotation * scale
 */
export function transformation2d(translate: Vec2, rotateAngle: number, scale: Vec2, out = Mat3.identity()): Mat3 {
  // Apply rotation
  TEMP_MAT3.set(MAT3_ID);
  TEMP_MAT3[0] = TEMP_MAT3[4] = Math.cos(rotateAngle);
  TEMP_MAT3[1] = TEMP_MAT3[3] = Math.sin(rotateAngle);
  TEMP_MAT3[3] *= -1;

  // Apply scaling
  const scaling = [...scale];
  for (let i = 0; i < 2; ++i) {
    for (let j = 0; j < 2; ++j) {
      TEMP_MAT3[3 * i + j] *= scaling[i];
    }
  }

  // Apply translation
  out.set(TEMP_MAT3);
  out.copy(translate, 6, 0, 2);

  return out;
}

/** Return a {@link Mat4} for a 3D point translated by (x, y, z). */
export function translation(v: Vec3, out = Mat4.identity()): Mat4 {
  out.set(MAT4_ID);
  out.copy(v, 12, 0, 3);
  return out;
}

/** Return a {@link Mat4} for a 3D point scaled by (x, y, z). */
export function scaling(v: Vec3, out = Mat4.identity()): Mat4 {
  const [x, y, z] = v;
  out.set(MAT4_ID);
  out.setAt(0, x);
  out.setAt(5, y);
  out.setAt(10, z);
  return out;
}

/** Returns a {@link Mat4} for a rotation by a {@link Quat}. */
export function rotation(q: Quat, out = Mat4.identity()): Mat4 {
  const [x, y, z, w] = q;
  const xx = (x * x),
    xy = (x * y),
    xz = (x * z),
    yy = (y * y),
    yz = (y * z),
    zz = (z * z),
    wx = (w * x),
    wy = (w * y),
    wz = (w * z);

  (TEMP_MAT4[0] = 1 - 2 * (yy + zz));
  (TEMP_MAT4[1] = 2 * (xy + wz));
  (TEMP_MAT4[2] = 2 * (xz - wy));
  (TEMP_MAT4[4] = 2 * (xy - wz));
  (TEMP_MAT4[5] = 1 - 2 * (xx + zz));
  (TEMP_MAT4[6] = 2 * (yz + wx));
  (TEMP_MAT4[8] = 2 * (xz + wy));
  (TEMP_MAT4[9] = 2 * (yz - wx));
  (TEMP_MAT4[10] = 1 - 2 * (xx + yy));
  (TEMP_MAT4[3] = TEMP_MAT4[7] = TEMP_MAT4[11] = TEMP_MAT4[12] = TEMP_MAT4[13] = TEMP_MAT4[14] = 0);
  (TEMP_MAT4[15] = 1);

  out.set(TEMP_MAT4);
  return out;
}

/** Extract the {@link Vec3} translation component from a transformation matrix. */
export function translationOf(m: Mat4, out = new Vec3()): Vec3 {
  out.copy(m, 0, 12, 3);
  return out;
}

function _scalingOf(m: Mat4): Float64Array {
  const view = memoryManager.view;
  const start = (m.byteOffset / BYTES_PER_FLOAT64) | 0;
  for (let i = 0; i < 3; ++i) {
    TEMP_VEC3[i] = 0;
    for (let j = 0; j < 3; ++j) {
      TEMP_VEC3[i] += view[start + 4 * i + j] * view[start + 4 * i + j];
    }
    TEMP_VEC3[i] = Math.sqrt(TEMP_VEC3[i]);
  }
  return TEMP_VEC3;
}

/**
 * Extract the {@link Vec3} scaling components from a transformation matrix
 * in TRS order (= translation * rotation * scale).
 */
export function scalingOf(m: Mat4, out = new Vec3()): Vec3 {
  out.set(_scalingOf(m));
  return out;
}

/**
 * Extract the {@link Quat} rotation components from a transformation matrix
 * in TRS order (= translation * rotation * scale).
 * @see https://en.wikipedia.org/wiki/Rotation_matrix#Quaternion
 */
export function rotationOf(trs: Mat4, out = Quat.identity()): Quat {
  const m = [...trs];
  const [sx, sy, sz] = _scalingOf(trs);
  const m00 = m[0] / sx, m11 = m[5] / sy, m22 = m[10] / sz;

  out.set([
    copysign(Math.sqrt(Math.max(0, 1 + m00 - m11 - m22)) / 2, m[6] / sy - m[9] / sz),
    copysign(Math.sqrt(Math.max(0, 1 - m00 + m11 - m22)) / 2, m[8] / sz - m[2] / sx),
    copysign(Math.sqrt(Math.max(0, 1 - m00 - m11 + m22)) / 2, m[1] / sx - m[4] / sy),
    Math.sqrt(Math.max(0, 1 + m00 + m11 + m22)) / 2
  ]);
  return out;
}

/**
 * Returns a {@link Mat4} for transformation in TRS order (= translation * rotation * scale).
 * @returns out = translation * rotation * scale
 */
export function transformation(translate: Vec3, rotate: Quat, scale: Vec3, out = Mat4.identity()): Mat4 {
  // Apply rotation
  rotation(rotate, out);
  const m = [...out];

  // Apply scaling
  const scaling = [...scale];
  for (let i = 0; i < 3; ++i) {
    for (let j = 0; j < 3; ++j) {
      m[4 * i + j] *= scaling[i];
    }
  }

  // Apply translation
  out.set(m);
  out.copy(translate, 12, 0, 3);

  return out;
}

/**
 * Returns the inverse of a {@link Mat4} that is assumed to represent a valid transformation
 * in TRS order (= translation * rotation * scale).
 * This function is more efficient than {@link Mat4.invert} by using the properties of a TRS matrix.
 * @returns out = M^-1
 */
export function inverseTRS(trs: Mat4, out = Mat4.identity()): boolean {
  // Assume M is a TRS matrix:
  // M = T * R * S = [RS  t]
  //                 [0   1]
  // Then the inverse of M is:
  // M^-1 = [(RS)^-1  (RS)^-1 * -t]
  //        [   0           1     ]
  // Where: (RS)^-1 = S^-1 * R^-1 = S^-1 * RT = S^-1 * ((RS)(S^-1))T = S^-1 * (S^-1)T * (RS)T = S^-1 * S^-1 * (RS)T
  using t = new Vec3();
  t.copy(trs, 0, 12, 3);
  const scale = _scalingOf(trs);

  out.copy(trs);
  out.transpose();
  const m = [...out];
  m[3] = m[7] = m[11] = 0;

  // Extract S and premultiply S^-2 = 1/(S*S) to output
  for (let i = 0; i < 3; ++i) {
    for (let j = 0; j < 3; ++j) {
      const factor = scale[j] * scale[j];
      if (factor === 0) { return false; }
      m[4 * i + j] *= 1 / factor;
    }
  }
  out.set(m);

  // With output = (RS)^-1, apply translation = (output * -t) to output
  t.scale(-1).mulMat4(out);
  out.copy(t, 12, 0, 3);

  return true;
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
  const x = 1 / (right - left);
  const y = 1 / (top - bottom);
  const z = 1 / (znear - zfar);

  TEMP_MAT4.set(MAT4_ID);
  TEMP_MAT4[0] = 2 * x;
  TEMP_MAT4[5] = 2 * y;
  TEMP_MAT4[10] = 2 * z;
  TEMP_MAT4[12] = -(right + left) * x;
  TEMP_MAT4[13] = -(top + bottom) * y;
  TEMP_MAT4[14] = (znear + zfar) * z;
  out.set(TEMP_MAT4);

  return out;
}

/**
 * Calculate the {@link Mat4} perspective projection using glTF's formula. Use infinite projection if zfar = Infinity.
 * @see https://github.com/KhronosGroup/glTF/tree/master/specification/2.0
 */
export function perspective(aspect: number, yfov: number, znear: number, zfar: number, out = Mat4.identity()): Mat4 {
  const f = 1 / Math.tan(yfov / 2);

  TEMP_MAT4.set(MAT4_ID);
  TEMP_MAT4[0] = f / aspect;
  TEMP_MAT4[5] = f;
  TEMP_MAT4[11] = -1;
  TEMP_MAT4[15] = 0;

  if (isFinite(zfar)) {
    const rangeInv = 1 / (znear - zfar);
    TEMP_MAT4[10] = (znear + zfar) * rangeInv;
    TEMP_MAT4[14] = 2 * znear * zfar * rangeInv;
  } else {
    TEMP_MAT4[10] = -1;
    TEMP_MAT4[14] = -2 * znear;
  }

  out.set(TEMP_MAT4);
  return out;
}

/** Calculate the {@link Mat4} perspective projection from a viewport. Use infinite projection if zfar = Infinity. */
export function perspectiveViewport(
  left: number, right: number, bottom: number, top: number, znear: number, zfar: number, out = Mat4.identity()
): Mat4 {
  const x = 1 / (right - left);
  const y = 1 / (top - bottom);

  TEMP_MAT4.set(MAT4_ID);
  TEMP_MAT4[0] = 2 * znear * x;
  TEMP_MAT4[5] = 2 * znear * y;
  TEMP_MAT4[8] = (right + left) * x;
  TEMP_MAT4[9] = (top + bottom) * y;
  TEMP_MAT4[11] = -1;
  TEMP_MAT4[15] = 0;

  if (isFinite(zfar)) {
    const rangeInv = 1 / (znear - zfar);
    TEMP_MAT4[10] = (znear + zfar) * rangeInv;
    TEMP_MAT4[14] = 2 * znear * zfar * rangeInv;
  } else {
    TEMP_MAT4[10] = -1;
    TEMP_MAT4[14] = -2 * znear;
  }

  out.set(TEMP_MAT4);
  return out;
}

/**
 * Calculate the {@link Mat4} model matrix for a camera at eye position looking at the center
 * position with a given up direction.
 */
export function targetTo(eye: Vec3, center: Vec3, up: Vec3, out = Mat4.identity()): Mat4 {
  using v = new Vec3(), n = new Vec3(), u = new Vec3();
  v.copy(eye);
  v.sub(center).normalize();
  n.copy(up);
  n.cross(v).normalize();
  u.copy(v);
  u.cross(n).normalize();

  out.set(MAT4_ID);
  out.copy(n, 0, 0, 3);
  out.copy(u, 4, 0, 3);
  out.copy(v, 8, 0, 3);
  out.copy(eye, 12, 0, 3);
  return out;
}

/**
 * Calculate the {@link Mat4} view matrix for a camera at eye position looking at the center
 * position with a given up direction.
 */
export function lookAt(eye: Vec3, center: Vec3, up: Vec3, out = Mat4.identity()): Mat4 {
  using v = new Vec3(), n = new Vec3(), u = new Vec3();
  v.copy(center);
  v.sub(eye).normalize();
  n.copy(v);
  n.cross(up).normalize();
  u.copy(n);
  u.cross(v).normalize();

  const m = [...v, ...n, ...u];
  TEMP_MAT4[0] = m[3];
  TEMP_MAT4[1] = m[6];
  TEMP_MAT4[2] = -m[0];
  TEMP_MAT4[4] = m[4];
  TEMP_MAT4[5] = m[7];
  TEMP_MAT4[6] = -m[1];
  TEMP_MAT4[8] = m[5];
  TEMP_MAT4[9] = m[8];
  TEMP_MAT4[10] = -m[2];
  TEMP_MAT4[12] = -n.dot(eye);
  TEMP_MAT4[13] = -u.dot(eye);
  TEMP_MAT4[14] = v.dot(eye);
  TEMP_MAT4[3] = TEMP_MAT4[7] = TEMP_MAT4[11] = 0;
  TEMP_MAT4[15] = 1;
  out.set(TEMP_MAT4);
  return out;
}

/**
 * Calculate the look-at direction {@link Vec3} vector from pitch (up/down) and yaw (left/right) angles in radians.
 * It looks towards -Z axis when pitch = 0 and yaw = 0.
 * This can be used with lookAt method to build an FPS camera view matrix by:
 * viewMatrix = lookAt(eye, lookAtDir(yaw, pitch).add(eye), new Vec3(0, 1, 0));
 */
export function lookAtDir(pitch: number, yaw: number, out = new Vec3()): Vec3 {
  const negCosPitch = -Math.cos(pitch);
  TEMP_VEC3[0] = negCosPitch * Math.sin(yaw);
  TEMP_VEC3[1] = Math.sin(pitch);
  TEMP_VEC3[2] = negCosPitch * Math.cos(yaw);
  out.set(TEMP_VEC3);
  return out;
}
