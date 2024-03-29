import {
  mat2identity, mat2add, mat2det, mat2frommat3, mat2invert, mat2mul, mat2scale, mat2sub, mat2transpose,
  mat3identity, mat3add, mat3det, mat3frommat2, mat3frommat4, mat3invert, mat3mul, mat3scale, mat3sub, mat3transpose,
  mat4identity, mat4add, mat4det, mat4frommat3, mat4invert, mat4mul, mat4scale, mat4sub, mat4transpose, normalmat3,
} from '../../wasm/index.js';
import { Mat } from '../types.ts';
import { ManagedFloat64Array } from './memory.ts';

/** A 2x2 matrix. */
export class Mat2 extends ManagedFloat64Array<4> implements Mat<2> {
  /** Return an identity Mat2. */
  public static identity(): Mat2 {
    return new Mat2(mat2identity());
  }

  /** Return a Mat2 from Mat3. */
  public static fromMat3(m: Mat3): Mat2 {
    return new Mat2(mat2frommat3(m.byteOffset));
  }

  private constructor(ptr: number) {
    super(ptr);
  }

  public override get length(): 4 {
    return 4;
  }

  public add(rhs: Mat2): this {
    mat2add(this.byteOffset, this.byteOffset, rhs.byteOffset);
    return this;
  }

  public sub(rhs: Mat2): this {
    mat2sub(this.byteOffset, this.byteOffset, rhs.byteOffset);
    return this;
  }

  public mul(rhs: Mat2): this {
    mat2mul(this.byteOffset, this.byteOffset, rhs.byteOffset);
    return this;
  }

  public scale(factor: number): this {
    mat2scale(this.byteOffset, this.byteOffset, factor);
    return this;
  }

  public transpose(): this {
    mat2transpose(this.byteOffset, this.byteOffset);
    return this;
  }

  public invert(): boolean {
    return !!mat2invert(this.byteOffset, this.byteOffset);
  }

  public det(): number {
    return mat2det(this.byteOffset);
  }
}

/** A 3x3 matrix. */
export class Mat3 extends ManagedFloat64Array<9> implements Mat<3> {
  /** Return an identity Mat3. */
  public static identity(): Mat3 {
    return new Mat3(mat3identity());
  }

  /** Return a Mat3 from Mat2. */
  public static fromMat2(m: Mat2): Mat3 {
    return new Mat3(mat3frommat2(m.byteOffset));
  }

  /** Return a Mat3 from Mat4. */
  public static fromMat4(m: Mat4): Mat3 {
    return new Mat3(mat3frommat4(m.byteOffset));
  }

  private constructor(ptr: number) {
    super(ptr);
  }

  public override get length(): 9 {
    return 9;
  }

  public add(rhs: Mat3): this {
    mat3add(this.byteOffset, this.byteOffset, rhs.byteOffset);
    return this;
  }

  public sub(rhs: Mat3): this {
    mat3sub(this.byteOffset, this.byteOffset, rhs.byteOffset);
    return this;
  }

  public mul(rhs: Mat3): this {
    mat3mul(this.byteOffset, this.byteOffset, rhs.byteOffset);
    return this;
  }

  public scale(factor: number): this {
    mat3scale(this.byteOffset, this.byteOffset, factor);
    return this;
  }

  public transpose(): this {
    mat3transpose(this.byteOffset, this.byteOffset);
    return this;
  }

  public invert(): boolean {
    return !!mat3invert(this.byteOffset, this.byteOffset);
  }

  public det(): number {
    return mat3det(this.byteOffset);
  }

  /** Coverts this to a normal matrix, which is the inverse transpose matrix. */
  public normalMat(): boolean {
    return !!normalmat3(this.byteOffset, this.byteOffset);
  }
}

/** A 4x4 matrix. */
export class Mat4 extends ManagedFloat64Array<16> implements Mat<4> {
  /** Return an identity Mat4. */
  public static identity(): Mat4 {
    return new Mat4(mat4identity());
  }

  /** Return a Mat4 from Mat3. */
  public static fromMat3(m: Mat3): Mat4 {
    return new Mat4(mat4frommat3(m.byteOffset));
  }

  private constructor(ptr: number) {
    super(ptr);
  }

  public override get length(): 16 {
    return 16;
  }

  public add(rhs: Mat4): this {
    mat4add(this.byteOffset, this.byteOffset, rhs.byteOffset);
    return this;
  }

  public sub(rhs: Mat4): this {
    mat4sub(this.byteOffset, this.byteOffset, rhs.byteOffset);
    return this;
  }

  public mul(rhs: Mat4): this {
    mat4mul(this.byteOffset, this.byteOffset, rhs.byteOffset);
    return this;
  }

  public scale(factor: number): this {
    mat4scale(this.byteOffset, this.byteOffset, factor);
    return this;
  }

  public transpose(): this {
    mat4transpose(this.byteOffset, this.byteOffset);
    return this;
  }

  public invert(): boolean {
    return !!mat4invert(this.byteOffset, this.byteOffset);
  }

  public det(): number {
    return mat4det(this.byteOffset);
  }
}
