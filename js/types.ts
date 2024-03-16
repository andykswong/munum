/** Index range. */
export type IndexRange<N extends number, Result extends number[] = []> =
  Result['length'] extends N ? Result[number] : IndexRange<N, [...Result, Result['length']]>;

/** Indexable object. */
export type Indexable<N extends number> = {
  [index in IndexRange<N>]: number;
};

/** A N x N matrix. */
export interface Mat<N extends 2 | 3 | 4> {
  /** Adds RHS to this matrix. */
  add(rhs: Mat<N>): this;

  /** Subtracts RHS from this matrix. */
  sub(rhs: Mat<N>): this;

  /** Multiplies RHS to this. */
  mul(rhs: Mat<N>): this;

  /** Scales this matrix by given factor. */
  scale(factor: number): this;

  /** Transposes this matrix. */
  transpose(): void;

  /** Inverts this matrix. */
  invert(): boolean;

  /** Calculates the determinant of this matrix. */
  det(): number;
}

/** A N-d vector. */
export interface Vec<N extends 2 | 3 | 4> {
  /** Returns the length of Vec. */
  readonly length: N;

  /** Adds RHS to this vector. */
  add(rhs: Vec<N>): this;

  /** Subtracts RHS from this vector. */
  sub(rhs: Vec<N>): this;

  /** Premultiplies matrix to this vector. */
  mul(m: Mat<N>): this;

  /** Computes the dot product of this vector with RHS. */
  dot(rhs: Vec<N>): number;

  /** Computes the linear interpolation between this vector and RHS. */
  lerp(rhs: Vec<N>, t: number): this;

  /** Scales this vector by given factor. */
  scale(factor: number): this;

  /** Normalizes this vector. */
  normalize(): boolean;
}

/** Quaternion interface. */
export interface IQuat {
  /** Returns the length of Quat. */
  readonly length: 4;

  /** Assigns the Hamilton product with RHS to this. */
  mul(rhs: IQuat): this;

  /** Rotates given 3D vector mutably using this. */
  rotate(v: Vec<3>): Vec<3>;

  /** Computes the dot product of this with RHS. */
  dot(rhs: IQuat): number;

  /** Computes the linear interpolation between this and RHS. */
  lerp(rhs: IQuat, t: number): this;

  /** Computes the shperic interpolation between this and RHS. */
  slerp(rhs: IQuat, t: number): this;

  /** Normalizes this. */
  normalize(): boolean;

  /** Inverts this. */
  invert(): boolean;
}
