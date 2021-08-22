import { Float, Mat3, ReadonlyVec2 } from './types';
import * as mat3 from './mat3';

/**
 * Return a {@link Mat3} for a 2D point translated by (x, y).
 */
export function translate2d(x: Float, y: Float, out: Mat3 = mat3.create()): Mat3 {
  mat3.id(out);
  unchecked(out[6] = x);
  unchecked(out[7] = y);
  return out;
}

/**
 * Returns a {@link Mat3} for a 2D point scaled by (x, y).
 */
export function scale2d(x: Float, y: Float, out: Mat3 = mat3.create()): Mat3 {
  mat3.id(out);
  unchecked(out[0] = x);
  unchecked(out[4] = y);
  return out;
}

/**
 * Returns a {@link Mat3} for a 2D point rotated in couterclockwise direction.
 */
export function rotate2d(theta: Float, out: Mat3 = mat3.create()): Mat3 {
  mat3.id(out);
  unchecked(out[0] = out[4] = Math.cos(theta) as Float);
  unchecked(out[1] = out[3] = Math.sin(theta) as Float);
  unchecked(out[3] *= -1);
  return out;
}

/**
 * Returns a {@link Mat3} for transformation in TRS order (= translation * rotation * scale).
 * @returns out = translation * rotation * scale
 */
 export function transform2d(translation: ReadonlyVec2, rotation: Float, scaling: ReadonlyVec2, out: Mat3 = mat3.create()): Mat3 {
  // Apply rotation
  rotate2d(rotation, out);

  // Apply scaling
  for (let i = 0; i < 2; ++i) {
    for (let j = 0; j < 2; ++j) {
      unchecked(out[3 * i + j] *= scaling[j]);
    }
  }

  // Apply translation
  unchecked(out[6] = translation[0]);
  unchecked(out[7] = translation[1]);

  return out;
}