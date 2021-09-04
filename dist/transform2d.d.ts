import { Float, Mat3, ReadonlyVec2 } from './types';
/**
 * Return a {@link Mat3} for a 2D point translated by (x, y).
 */
export declare function translate2d(x: Float, y: Float, out?: Mat3): Mat3;
/**
 * Returns a {@link Mat3} for a 2D point scaled by (x, y).
 */
export declare function scale2d(x: Float, y: Float, out?: Mat3): Mat3;
/**
 * Returns a {@link Mat3} for a 2D point rotated in couterclockwise direction.
 */
export declare function rotate2d(theta: Float, out?: Mat3): Mat3;
/**
 * Returns a {@link Mat3} for transformation in TRS order (= translation * rotation * scale).
 * @returns out = translation * rotation * scale
 */
export declare function transform2d(translation: ReadonlyVec2, rotation: Float, scaling: ReadonlyVec2, out?: Mat3): Mat3;
//# sourceMappingURL=transform2d.d.ts.map