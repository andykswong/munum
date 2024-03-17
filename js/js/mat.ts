import { Mat } from '../types.ts';
import { add, sub, scale, mul, transpose } from './helpers.ts';
import { BYTES_PER_FLOAT64, ManagedFloat64Array, memoryManager } from './memory.ts';

const TEMP = Array(16);
const MAT2_ID = [1, 0, 0, 1];
const MAT3_ID = [1, 0, 0, 0, 1, 0, 0, 0, 1];
const MAT4_ID = [1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1];

/** A 2x2 matrix. */
export class Mat2 extends ManagedFloat64Array<4> implements Mat<2> {
  /** Return an identity Mat2. */
  public static identity(): Mat2 {
    const m = new Mat2(memoryManager.create(4));
    m.set(MAT2_ID);
    return m;
  }

  /** Return a Mat2 from Mat3. */
  public static fromMat3(m: Mat3): Mat2 {
    const ptr = memoryManager.create(4);
    const left = (ptr / BYTES_PER_FLOAT64) | 0;
    const right = (m.byteOffset / BYTES_PER_FLOAT64) | 0;
    const view = memoryManager.view;
    for (let c = 0; c < 2; ++c) {
      for (let r = 0; r < 2; ++r) {
        view[left + c * 2 + r] = view[right + c * 3 + r];
      }
    }
    return new Mat2(ptr);
  }

  private constructor(ptr: number) {
    super(ptr);
  }

  public override get length(): 4 {
    return 4;
  }

  public add(rhs: Mat2): this {
    add(this, rhs);
    return this;
  }

  public sub(rhs: Mat2): this {
    sub(this, rhs);
    return this;
  }

  public mul(rhs: Mat2): this {
    mul(this, rhs, 2);
    return this;
  }

  public scale(factor: number): this {
    scale(this, factor);
    return this;
  }

  public transpose(): this {
    transpose(this, 2);
    return this;
  }

  public invert(): boolean {
    const detA = this.det();
    if (!detA) {
      return false;
    }

    const ptr = (this.byteOffset / BYTES_PER_FLOAT64) | 0;
    const view = memoryManager.view;
    TEMP[0] = view[ptr + 3] / detA,
      TEMP[1] = -view[ptr + 1] / detA,
      TEMP[2] = -view[ptr + 2] / detA,
      TEMP[3] = view[ptr + 0] / detA;

    for (let i = 0; i < 4; ++i) {
      view[ptr + i] = TEMP[i];
    }

    return true;
  }

  public det(): number {
    const ptr = (this.byteOffset / BYTES_PER_FLOAT64) | 0;
    const view = memoryManager.view;

    return view[ptr + 0] * view[ptr + 3] - view[ptr + 2] * view[ptr + 1];
  }
}

/** A 3x3 matrix. */
export class Mat3 extends ManagedFloat64Array<9> implements Mat<3> {
  /** Return an identity Mat3. */
  public static identity(): Mat3 {
    const m = new Mat3(memoryManager.create(9));
    m.set(MAT3_ID);
    return m;
  }

  /** Return a Mat3 from Mat2. */
  public static fromMat2(m: Mat2): Mat3 {
    const ptr = memoryManager.create(9);
    const left = (ptr / BYTES_PER_FLOAT64) | 0;
    const right = (m.byteOffset / BYTES_PER_FLOAT64) | 0;
    const view = memoryManager.view;
    for (let c = 0; c < 2; ++c) {
      for (let r = 0; r < 2; ++r) {
        view[left + c * 3 + r] = view[right + c * 2 + r];
      }
      view[left + c * 3 + 2] = 0;
    }
    view[left + 6] = 0;
    view[left + 7] = 0;
    view[left + 8] = 1;
    return new Mat3(ptr);
  }

  /** Return a Mat3 from Mat4. */
  public static fromMat4(m: Mat4): Mat3 {
    const ptr = memoryManager.create(9);
    const left = (ptr / BYTES_PER_FLOAT64) | 0;
    const right = (m.byteOffset / BYTES_PER_FLOAT64) | 0;
    const view = memoryManager.view;
    for (let c = 0; c < 3; ++c) {
      for (let r = 0; r < 3; ++r) {
        view[left + c * 3 + r] = view[right + c * 4 + r];
      }
    }
    return new Mat3(ptr);
  }

  private constructor(ptr: number) {
    super(ptr);
  }

  public override get length(): 9 {
    return 9;
  }

  public add(rhs: Mat3): this {
    add(this, rhs);
    return this;
  }

  public sub(rhs: Mat3): this {
    sub(this, rhs);
    return this;
  }

  public mul(rhs: Mat3): this {
    mul(this, rhs, 3);
    return this;
  }

  public scale(factor: number): this {
    scale(this, factor);
    return this;
  }

  public transpose(): this {
    transpose(this, 3);
    return this;
  }

  /**
   * Inverts this Mat3.
   * @see https://en.wikipedia.org/wiki/Invertible_matrix#Inversion_of_3_%C3%97_3_matrices
   */
  public invert(): boolean {
    const detA = this.det();
    if (!detA) {
      return false;
    }

    const ptr = (this.byteOffset / BYTES_PER_FLOAT64) | 0;
    const view = memoryManager.view;
    TEMP[0] = +(view[ptr + 4] * view[ptr + 8] - view[ptr + 7] * view[ptr + 5]);
    TEMP[1] = -(view[ptr + 1] * view[ptr + 8] - view[ptr + 7] * view[ptr + 2]);
    TEMP[2] = +(view[ptr + 1] * view[ptr + 5] - view[ptr + 4] * view[ptr + 2]);
    TEMP[3] = -(view[ptr + 3] * view[ptr + 8] - view[ptr + 6] * view[ptr + 5]);
    TEMP[4] = +(view[ptr + 0] * view[ptr + 8] - view[ptr + 6] * view[ptr + 2]);
    TEMP[5] = -(view[ptr + 0] * view[ptr + 5] - view[ptr + 3] * view[ptr + 2]);
    TEMP[6] = +(view[ptr + 3] * view[ptr + 7] - view[ptr + 6] * view[ptr + 4]);
    TEMP[7] = -(view[ptr + 0] * view[ptr + 7] - view[ptr + 6] * view[ptr + 1]);
    TEMP[8] = +(view[ptr + 0] * view[ptr + 4] - view[ptr + 3] * view[ptr + 1]);

    for (let i = 0; i < 9; ++i) {
      view[ptr + i] = TEMP[i];
    }

    return true;
  }

  public det(): number {
    const ptr = (this.byteOffset / BYTES_PER_FLOAT64) | 0;
    const view = memoryManager.view;
    return (
      view[ptr + 0] * +(view[ptr + 4] * view[ptr + 8] - view[ptr + 7] * view[ptr + 5]) +
      view[ptr + 3] * -(view[ptr + 1] * view[ptr + 8] - view[ptr + 7] * view[ptr + 2]) +
      view[ptr + 6] * +(view[ptr + 1] * view[ptr + 5] - view[ptr + 4] * view[ptr + 2])
    )
  }

  /** Coverts this to a normal matrix, which is the inverse transpose matrix. */
  public normalMat(): boolean {
    if (!this.invert()) {
      return false;
    }
    this.transpose();
    return true;
  }
}

/** A 4x4 matrix. */
export class Mat4 extends ManagedFloat64Array<16> implements Mat<4> {
  /** Return an identity Mat4. */
  public static identity(): Mat4 {
    const m = new Mat4(memoryManager.create(16));
    m.set(MAT4_ID);
    return m;
  }

  /** Return a Mat4 from Mat3. */
  public static fromMat3(m: Mat3): Mat4 {
    const ptr = memoryManager.create(16);
    const left = (ptr / BYTES_PER_FLOAT64) | 0;
    const right = (m.byteOffset / BYTES_PER_FLOAT64) | 0;
    const view = memoryManager.view;
    for (let c = 0; c < 3; ++c) {
      for (let r = 0; r < 3; ++r) {
        view[left + c * 4 + r] = view[right + c * 3 + r];
      }
      view[left + c * 4 + 3] = 0;
    }
    view[left + 12] = 0;
    view[left + 13] = 0;
    view[left + 14] = 0;
    view[left + 15] = 1;
    return new Mat4(ptr);
  }

  private constructor(ptr: number) {
    super(ptr);
  }

  public override get length(): 16 {
    return 16;
  }

  public add(rhs: Mat4): this {
    add(this, rhs);
    return this;
  }

  public sub(rhs: Mat4): this {
    sub(this, rhs);
    return this;
  }

  public mul(rhs: Mat4): this {
    mul(this, rhs, 4);
    return this;
  }

  public scale(factor: number): this {
    scale(this, factor);
    return this;
  }

  public transpose(): this {
    transpose(this, 4);
    return this;
  }

  public invert(): boolean {
    const ptr = (this.byteOffset / BYTES_PER_FLOAT64) | 0;
    const view = memoryManager.view;
    const fA0 = (view[ptr + 0] * view[ptr + 5] - view[ptr + 4] * view[ptr + 1]);
    const fA1 = (view[ptr + 0] * view[ptr + 9] - view[ptr + 8] * view[ptr + 1]);
    const fA2 = (view[ptr + 0] * view[ptr + 13] - view[ptr + 12] * view[ptr + 1]);
    const fA3 = (view[ptr + 4] * view[ptr + 9] - view[ptr + 8] * view[ptr + 5]);
    const fA4 = (view[ptr + 4] * view[ptr + 13] - view[ptr + 12] * view[ptr + 5]);
    const fA5 = (view[ptr + 8] * view[ptr + 13] - view[ptr + 12] * view[ptr + 9]);
    const fB0 = (view[ptr + 2] * view[ptr + 7] - view[ptr + 6] * view[ptr + 3]);
    const fB1 = (view[ptr + 2] * view[ptr + 11] - view[ptr + 10] * view[ptr + 3]);
    const fB2 = (view[ptr + 2] * view[ptr + 15] - view[ptr + 14] * view[ptr + 3]);
    const fB3 = (view[ptr + 6] * view[ptr + 11] - view[ptr + 10] * view[ptr + 7]);
    const fB4 = (view[ptr + 6] * view[ptr + 15] - view[ptr + 14] * view[ptr + 7]);
    const fB5 = (view[ptr + 10] * view[ptr + 15] - view[ptr + 14] * view[ptr + 11]);

    const detA = fA0 * fB5 - fA1 * fB4 + fA2 * fB3 + fA3 * fB2 - fA4 * fB1 + fA5 * fB0;
    if (!detA) {
      return false;
    }

    TEMP[0] = +view[ptr + 5] * fB5 - view[ptr + 9] * fB4 + view[ptr + 13] * fB3;
    TEMP[1] = -view[ptr + 1] * fB5 + view[ptr + 9] * fB2 - view[ptr + 13] * fB1;
    TEMP[2] = +view[ptr + 1] * fB4 - view[ptr + 5] * fB2 + view[ptr + 13] * fB0;
    TEMP[3] = -view[ptr + 1] * fB3 + view[ptr + 5] * fB1 - view[ptr + 9] * fB0;
    TEMP[4] = -view[ptr + 4] * fB5 + view[ptr + 8] * fB4 - view[ptr + 12] * fB3;
    TEMP[5] = +view[ptr + 0] * fB5 - view[ptr + 8] * fB2 + view[ptr + 12] * fB1;
    TEMP[6] = -view[ptr + 0] * fB4 + view[ptr + 4] * fB2 - view[ptr + 12] * fB0;
    TEMP[7] = +view[ptr + 0] * fB3 - view[ptr + 4] * fB1 + view[ptr + 8] * fB0;
    TEMP[8] = +view[ptr + 7] * fA5 - view[ptr + 11] * fA4 + view[ptr + 15] * fA3;
    TEMP[9] = -view[ptr + 3] * fA5 + view[ptr + 11] * fA2 - view[ptr + 15] * fA1;
    TEMP[10] = +view[ptr + 3] * fA4 - view[ptr + 7] * fA2 + view[ptr + 15] * fA0;
    TEMP[11] = -view[ptr + 3] * fA3 + view[ptr + 7] * fA1 - view[ptr + 11] * fA0;
    TEMP[12] = -view[ptr + 6] * fA5 + view[ptr + 10] * fA4 - view[ptr + 14] * fA3;
    TEMP[13] = +view[ptr + 2] * fA5 - view[ptr + 10] * fA2 + view[ptr + 14] * fA1;
    TEMP[14] = -view[ptr + 2] * fA4 + view[ptr + 6] * fA2 - view[ptr + 14] * fA0;
    TEMP[15] = +view[ptr + 2] * fA3 - view[ptr + 6] * fA1 + view[ptr + 10] * fA0;

    for (let i = 0; i < 16; ++i) {
      view[ptr + i] = TEMP[i] / detA;
    }

    return true;
  }

  public det(): number {
    const ptr = (this.byteOffset / BYTES_PER_FLOAT64) | 0;
    const view = memoryManager.view;
    const fA0 = (view[ptr + 0] * view[ptr + 5] - view[ptr + 4] * view[ptr + 1]);
    const fA1 = (view[ptr + 0] * view[ptr + 9] - view[ptr + 8] * view[ptr + 1]);
    const fA2 = (view[ptr + 0] * view[ptr + 13] - view[ptr + 12] * view[ptr + 1]);
    const fA3 = (view[ptr + 4] * view[ptr + 9] - view[ptr + 8] * view[ptr + 5]);
    const fA4 = (view[ptr + 4] * view[ptr + 13] - view[ptr + 12] * view[ptr + 5]);
    const fA5 = (view[ptr + 8] * view[ptr + 13] - view[ptr + 12] * view[ptr + 9]);
    const fB0 = (view[ptr + 2] * view[ptr + 7] - view[ptr + 6] * view[ptr + 3]);
    const fB1 = (view[ptr + 2] * view[ptr + 11] - view[ptr + 10] * view[ptr + 3]);
    const fB2 = (view[ptr + 2] * view[ptr + 15] - view[ptr + 14] * view[ptr + 3]);
    const fB3 = (view[ptr + 6] * view[ptr + 11] - view[ptr + 10] * view[ptr + 7]);
    const fB4 = (view[ptr + 6] * view[ptr + 15] - view[ptr + 14] * view[ptr + 7]);
    const fB5 = (view[ptr + 10] * view[ptr + 15] - view[ptr + 14] * view[ptr + 11]);

    return fA0 * fB5 - fA1 * fB4 + fA2 * fB3 + fA3 * fB2 - fA4 * fB1 + fA5 * fB0;
  }
}
