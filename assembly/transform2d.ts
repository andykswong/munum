import { Float, Mat3 } from './types';
import * as mat3 from './mat3';

/**
 * Return a {@link Mat3} for a 2D point translated by (x, y).
 */
export function translate2d(x: Float, y: Float, out: Mat3 = mat3.create()): Mat3 {
  mat3.id(out);
  out[6] = x;
  out[7] = y;
  return out;
}

/**
 * Returns a {@link Mat3} for a 2D point scaled by (x, y).
 */
export function scale2d(x: Float, y: Float, out: Mat3 = mat3.create()): Mat3 {
  mat3.id(out);
  out[0] = x;
  out[4] = y;
  return out;
}

/**
 * Returns a {@link Mat3} for a 2D point rotated in couterclockwise direction.
 */
export function rotate2d(theta: Float, out: Mat3 = mat3.create()): Mat3 {
  mat3.id(out);
  out[0] = out[4] = Math.cos(theta) as Float;
  out[1] = out[3] = Math.sin(theta) as Float;
  out[3] *= -1;
  return out;
}
