import { Float } from './types';
/**
 * The float epsilon.
 */
export declare const EPSILON: Float;
/**
 * Check if 2 floats are equal within an epsilon.
 */
export declare function fequal(a: Float, b: Float, epsilon?: Float): boolean;
/**
 * Composes a float from the magnitude of a and the sign of b, i.e. copysign(a, b) = sgn(b)|a|.
 */
export declare function copysign(a: Float, b: Float): Float;
/**
 * Clamp a float to [min, max].
 */
export declare function clamp(x: Float, min: Float, max: Float): Float;
/**
* Linear interpolates between 2 floats.
*/
export declare function lerp(a: Float, b: Float, t: Float): Float;
//# sourceMappingURL=scalar.d.ts.map