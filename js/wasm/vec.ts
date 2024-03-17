import {
  create, mat3vec2mul, mat4vec3mul,
  vec2add, vec2dot, vec2lerp, vec2mul, vec2norm, vec2scale, vec2sub,
  vec3add, vec3cross, vec3dot, vec3lerp, vec3mul, vec3norm, vec3scale, vec3sub,
  vec4add, vec4dot, vec4lerp, vec4mul, vec4norm, vec4scale, vec4sub,
} from '../../wasm/index.js';
import { Vec } from '../types.ts';
import { Mat2, Mat3, Mat4 } from './mat.ts';
import { ManagedFloat64Array } from './memory.ts';

/** A 2D vector. */
export class Vec2 extends ManagedFloat64Array<2> implements Vec<2> {
  public constructor(x = 0, y = 0) {
    super(create(2));
    this.set([x, y]);
  }

  public override get length(): 2 {
    return 2;
  }

  public add(rhs: Vec2): this {
    vec2add(this.byteOffset, this.byteOffset, rhs.byteOffset);
    return this;
  }

  public sub(rhs: Vec2): this {
    vec2sub(this.byteOffset, this.byteOffset, rhs.byteOffset);
    return this;
  }

  public mul(m: Mat2): this {
    vec2mul(this.byteOffset, m.byteOffset, this.byteOffset);
    return this;
  }

  /** Premultiplies 3x3 matrix to this. */
  public mulMat3(m: Mat3): this {
    mat3vec2mul(this.byteOffset, m.byteOffset, this.byteOffset);
    return this;
  }

  public dot(rhs: Vec2): number {
    return vec2dot(this.byteOffset, rhs.byteOffset);
  }

  public lerp(rhs: Vec2, t: number): this {
    vec2lerp(this.byteOffset, this.byteOffset, rhs.byteOffset, t);
    return this;
  }

  public scale(factor: number): this {
    vec2scale(this.byteOffset, this.byteOffset, factor);
    return this;
  }

  public normalize(): boolean {
    return !!vec2norm(this.byteOffset, this.byteOffset);
  }
}

/** A 3D vector. */
export class Vec3 extends ManagedFloat64Array<3> implements Vec<3> {
  public constructor(x = 0, y = 0, z = 0) {
    super(create(3));
    this.set([x, y, z]);
  }

  public override get length(): 3 {
    return 3;
  }

  public add(rhs: Vec3): this {
    vec3add(this.byteOffset, this.byteOffset, rhs.byteOffset);
    return this;
  }

  public sub(rhs: Vec3): this {
    vec3sub(this.byteOffset, this.byteOffset, rhs.byteOffset);
    return this;
  }

  public mul(m: Mat3): this {
    vec3mul(this.byteOffset, m.byteOffset, this.byteOffset);
    return this;
  }

  /** Premultiplies 4x4 matrix to this. */
  public mulMat4(m: Mat4): this {
    mat4vec3mul(this.byteOffset, m.byteOffset, this.byteOffset);
    return this;
  }

  /** Assign cross product of this with RHS to this. */
  public cross(rhs: Vec3): this {
    vec3cross(this.byteOffset, this.byteOffset, rhs.byteOffset);
    return this;
  }

  public dot(rhs: Vec3): number {
    return vec3dot(this.byteOffset, rhs.byteOffset);
  }

  public lerp(rhs: Vec3, t: number): this {
    vec3lerp(this.byteOffset, this.byteOffset, rhs.byteOffset, t);
    return this;
  }

  public scale(factor: number): this {
    vec3scale(this.byteOffset, this.byteOffset, factor);
    return this;
  }

  public normalize(): boolean {
    return !!vec3norm(this.byteOffset, this.byteOffset);
  }
}

/** A 4D vector. */
export class Vec4 extends ManagedFloat64Array<4> implements Vec<4> {
  public constructor(x = 0, y = 0, z = 0, w = 0) {
    super(create(4));
    this.set([x, y, z, w]);
  }

  public override get length(): 4 {
    return 4;
  }

  public add(rhs: Vec4): this {
    vec4add(this.byteOffset, this.byteOffset, rhs.byteOffset);
    return this;
  }

  public sub(rhs: Vec4): this {
    vec4sub(this.byteOffset, this.byteOffset, rhs.byteOffset);
    return this;
  }

  public mul(m: Mat4): this {
    vec4mul(this.byteOffset, m.byteOffset, this.byteOffset);
    return this;
  }

  public dot(rhs: Vec4): number {
    return vec4dot(this.byteOffset, rhs.byteOffset);
  }

  public lerp(rhs: Vec4, t: number): this {
    vec4lerp(this.byteOffset, this.byteOffset, rhs.byteOffset, t);
    return this;
  }

  public scale(factor: number): this {
    vec4scale(this.byteOffset, this.byteOffset, factor);
    return this;
  }

  public normalize(): boolean {
    return !!vec4norm(this.byteOffset, this.byteOffset);
  }
}
