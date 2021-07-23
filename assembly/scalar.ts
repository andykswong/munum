import { Float } from './types';

/**
 * The float epsilon.
 */
export const EPSILON: Float = 0.000001;

/**
 * Check if 2 floats are equal within an epsilon.
 */
export function fequal(a: Float, b: Float, epsilon: Float = EPSILON): boolean {
  return Math.abs(a - b) < epsilon;
}

/**
 * Composes a float from the magnitude of a and the sign of b, i.e. copysign(a, b) = sgn(b)|a|.
 */
export function copysign(a: Float, b: Float): Float {
  return (Math.sign(b) * Math.abs(a)) as Float;
}

/**
 * Clamp a float to [min, max].
 */
export function clamp(x: Float, min: Float, max: Float): Float {
  return x < min ? min : x > max ? max : x;
}

/**
* Linear interpolates between 2 floats.
*/
export function lerp(a: Float, b: Float, t: Float): Float {
  return a * (1 - t) + b * t;
}
