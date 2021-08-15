export type Int = i32;

export type Float = f32;

export type Vec = StaticArray<Float>;

export type ReadonlyVec = Vec;

export type Vec2 = Vec;

export type Vec3 = Vec;

export type Vec4 = Vec;

export type ReadonlyVec2 = Vec;

export type ReadonlyVec3 = Vec;

export type ReadonlyVec4 = Vec;

export type Mat2 = Vec;

export type Mat3 = Vec;

export type Mat4 = Vec;

export type ReadonlyMat2 = Vec;

export type ReadonlyMat3 = Vec;

export type ReadonlyMat4 = Vec;

export type Quat = Vec4;

export type ReadonlyQuat = ReadonlyVec4;

export type Plane = Vec4;

export type ReadonlyPlane = ReadonlyVec4;

export type Frustum = StaticArray<Plane>;

export type ReadonlyFrustum = StaticArray<ReadonlyPlane>;

export class AABB {
  public constructor(
    public readonly min: Vec3,
    public readonly max: Vec3) {
  }
};

export type ReadonlyAABB = AABB;
