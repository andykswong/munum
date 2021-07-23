/**
 * munum array type definitions that are dependent on platform (number array for TS; StaticArray<f32> for AS).
 * @packageDocumentation
 */

/**
 * The integer number type.
 */
export type Int = number;

/**
 * The floating point number type.
 */
export type Float = number;

/**
 * A vector of floats.
 */
export interface Vec {
  [key: number]: Float;
  readonly length: number;
}

/**
 * A readonly vector of floats.
 */
export interface ReadonlyVec {
  readonly [key: number]: Float;
  readonly length: number;
}

/**
 * A 2D vector.
 */
export type Vec2 = [x: Float, y: Float];

/**
 * A 3D vector.
 */
export type Vec3 = [x: Float, y: Float, z: Float];

/**
 * A 4D vector.
 */
export type Vec4 = [x: Float, y: Float, z: Float, w: Float];

/**
 * A read-only 2D vector.
 */
export type ReadonlyVec2 = Readonly<Vec2>;

/**
 * A read-only 3D vector.
 */
export type ReadonlyVec3 = Readonly<Vec3>;

/**
 * A read-only 4D vector.
 */
export type ReadonlyVec4 = Readonly<Vec4>;

/**
 * A column-major 2x2 Matrix.
 */
export type Mat2 = [
  m11: number, m21: number,
  m12: number, m22: number
];

/**
 * A column-major 3x3 Matrix.
 */
export type Mat3 = [
  m11: number, m21: number, m31: number,
  m12: number, m22: number, m32: number,
  m13: number, m23: number, m33: number
];

/**
 * Column-major 4x4 Matrix.
 */
export type Mat4 = [
  m11: number, m21: number, m31: number, m41: number,
  m12: number, m22: number, m32: number, m42: number,
  m13: number, m23: number, m33: number, m43: number,
  m14: number, m24: number, m34: number, m44: number,
];

/**
 * A read-only 2x2 matrix.
 */
export type ReadonlyMat2 = Readonly<Mat2>;

/**
 * A read-only 3x3 matrix.
 */
export type ReadonlyMat3 = Readonly<Mat3>;

/**
 * A read-only 4x4 matrix.
 */
export type ReadonlyMat4 = Readonly<Mat4>;

/**
 * Plane of the form ax + by + cz + d = 0, where (a, b, c) is the normal.
 */
export type Plane = Vec4;

/**
 * A read-only plane.
 */
export type ReadonlyPlane = ReadonlyVec4;

/**
 * A frustum defined by 6 normalized planes: left, right, bottom, top, near, far.
 * The normal of planes should point inside the frustum.
 */
export type Frustum = readonly [
  left: Plane,
  right: Plane,
  bottom: Plane,
  top: Plane,
  near: Plane,
  far: Plane,
];

/**
 * A read-only frustum.
 */
export type ReadonlyFrustum = readonly [
  left: ReadonlyPlane,
  right: ReadonlyPlane,
  bottom: ReadonlyPlane,
  top: ReadonlyPlane,
  near: ReadonlyPlane,
  far: ReadonlyPlane,
];

/**
 * A read-only axis-aligned bounding box.
 */
export interface ReadonlyAABB {
  /**
   * The minimum point.
   */
  readonly min: ReadonlyVec3;

  /**
   * The maximum point.
   */
  readonly max: ReadonlyVec3;
}

/**
 * An axis-aligned bounding box.
 */
export declare class AABB implements ReadonlyAABB {
  public readonly min: Vec3;
  public readonly max: Vec3;

  /**
   * Constructor.
   *
   * @param min The minimum point.
   * @param max The maximum point.
   */
  public constructor(min: Vec3, max: Vec3);
}
