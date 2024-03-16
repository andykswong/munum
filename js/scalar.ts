/** The float epsilon. */
export const EPSILON: number = 0.000001;

/** Check if 2 floats are equal within an epsilon. */
export function fequal(a: number, b: number, epsilon: number = EPSILON): boolean {
  return Math.abs(a - b) < epsilon;
}

/** Composes a float from the magnitude of a and the sign of b, i.e. copysign(a, b) = sgn(b)|a|. */
export function copysign(a: number, b: number): number {
  return (Math.sign(b) * Math.abs(a)) as number;
}

/** Clamp a float to [min, max]. */
export function clamp(x: number, min: number, max: number): number {
  return x < min ? min : x > max ? max : x;
}

/** Linear interpolates between 2 floats. */
export function lerp(a: number, b: number, t: number): number {
  return a * (1 - t) + b * t;
}
