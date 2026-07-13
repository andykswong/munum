import { expectArrayEqual } from '../../__tests__/test-utils.ts';
import {
  AbstractMemoryManager,
  BYTES_PER_FLOAT64,
  ManagedFloat64Array,
  ManagedTypedArray,
} from '../memory.ts';
import type { TypedArray, TypedArrayPointer } from '../memory.ts';
import { float32Manager, float32View, memoryManager } from '../memory.ts';
import { Vec3 } from '../vec.ts';

// A minimal bump-allocator arena over a chosen typed-array constructor, used to
// exercise the generic base class directly (independent of js/js/memory.ts).
function makeArena<V extends TypedArray>(Ctor: { new (b: ArrayBufferLike): V; readonly BYTES_PER_ELEMENT: number }) {
  return new (class extends AbstractMemoryManager<V> {
    private readonly mem = new WebAssembly.Memory({ initial: 1 });
    private cached: V = new Ctor(this.mem.buffer);
    private next = 0;
    public override get view(): V { return this.cached; }
    protected override createRaw(size: number): number {
      const offset = this.next; this.next += size; return offset * Ctor.BYTES_PER_ELEMENT;
    }
    protected override freeRaw(): void { /* bump: no reclaim */ }
  })();
}

describe('ManagedTypedArray base (Task 1)', () => {
  test('cross-view copy converts between f64 and f32 buffers', () => {
    const f64 = makeArena(Float64Array);
    const f32 = makeArena(Float32Array);

    // Two 3-element regions in different buffers.
    const src = f64.allocate(3);
    src.view[(src.byteOffset / 8) | 0] = 1.5;
    src.view[(src.byteOffset / 8 + 1) | 0] = 2.5;
    src.view[(src.byteOffset / 8 + 2) | 0] = 3.5;

    // Wrap both as minimal ManagedTypedArray instances via a tiny concrete subclass.
    class V3<T extends TypedArray> extends ManagedTypedArray<3, T> {
      public override get length(): 3 { return 3; }
    }
    const s = new V3(src);
    const d = new V3(f32.allocate(3));

    d.copy(s);
    expect(d.view).toBeInstanceOf(Float32Array);
    expectArrayEqual(d, [1.5, 2.5, 3.5]);
  });

  test('cross-view copy narrows f64 -> f32 (real precision conversion)', () => {
    const f64 = makeArena(Float64Array);
    const f32 = makeArena(Float32Array);
    class V1<T extends TypedArray> extends ManagedTypedArray<1, T> {
      public override get length(): 1 { return 1; }
    }
    // 0.1 is NOT exactly representable in f32, so copying it into an f32 view must
    // round to Math.fround(0.1). This proves the copy performs a genuine element-type
    // conversion (write through the f32 view), not just a bit-preserving move.
    const s = new V1(f64.allocate(1));
    s.setAt(0, 0.1);
    const d = new V1(f32.allocate(1));
    d.copy(s);
    expect(d.at(0)).toBe(Math.fround(0.1));
    expect(d.at(0)).not.toBe(0.1);
  });

  test('index getter and byteLength track the view element size', () => {
    const f32 = makeArena(Float32Array);
    class V2<T extends TypedArray> extends ManagedTypedArray<2, T> {
      public override get length(): 2 { return 2; }
    }
    const v = new V2(f32.allocate(2));
    v.set([7, 9]);
    expect(v.byteLength).toBe(8);         // 2 * 4 bytes (f32)
    expect(v.at(0)).toBe(7);
    expect(v.at(1)).toBe(9);
  });

  test('deprecated ManagedFloat64Array is still a usable subclass value', () => {
    class V2 extends ManagedFloat64Array<2> {
      public override get length(): 2 { return 2; }
    }
    const arena = makeArena(Float64Array);
    const v = new V2(arena.allocate(2) as TypedArrayPointer<Float64Array>);
    v.set([1, 2]);
    expectArrayEqual(v, [1, 2]);
    expect(BYTES_PER_FLOAT64).toBe(8);
  });
});

describe('float32Manager (Task 2)', () => {
  test('allocates Float32Array-backed regions with 4-byte stride', () => {
    const p = float32Manager.allocate(3);
    expect(p.view).toBeInstanceOf(Float32Array);
    expect(p.byteOffset % 4).toBe(0);
    expect(p.length).toBe(3);
    p.free();
  });

  test('is a different buffer from the f64 default manager', () => {
    expect(float32Manager.buffer).not.toBe(memoryManager.buffer);
    expect(float32Manager.view).toBeInstanceOf(Float32Array);
    expect(memoryManager.view).toBeInstanceOf(Float64Array);
  });

  test('freed same-size f32 block is reused', () => {
    const a = float32Manager.allocate(4);
    const off = a.byteOffset;
    a.free();
    const b = float32Manager.allocate(4);
    expect(b.byteOffset).toBe(off);
    b.free();
  });

  test('float32View wraps an external Float32Array (GPU buffer) zero-copy', () => {
    const gpu = new Float32Array([1, 2, 3, 4, 5, 6]);
    const v = Vec3.view(float32View(gpu), 3 * 4);   // second vec3, byteOffset = 12
    expect(v.view).toBeInstanceOf(Float32Array);
    expectArrayEqual(v, [4, 5, 6]);
    v.scale(2);
    expect(gpu[3]).toBe(8);
  });
});

describe('cross-view (mixed f32/f64) vector ops (Task 3)', () => {
  test('f32.add(f64) accumulates into f32 destination', () => {
    const a = new Vec3(1, 2, 3, float32Manager);
    const b = new Vec3(3, 5, 7);                 // f64 default
    a.add(b);
    expect(a.view).toBeInstanceOf(Float32Array);
    expectArrayEqual(a, [4, 7, 10]);
  });

  test('f64.add(f32) accumulates into f64 destination', () => {
    const a = new Vec3(1, 2, 3);                 // f64
    const b = new Vec3(3, 5, 7, float32Manager); // f32
    a.add(b);
    expect(a.view).toBeInstanceOf(Float64Array);
    expectArrayEqual(a, [4, 7, 10]);
  });

  test('mixed dot returns correct number', () => {
    const a = new Vec3(1, 2, 3, float32Manager);
    const b = new Vec3(3, 5, 7);
    expect(a.dot(b)).toBeCloseTo(34);
  });

  test('mixed lerp writes into destination precision', () => {
    const a = new Vec3(7, 11, 13, float32Manager);
    const b = new Vec3(17, 19, 23);
    a.lerp(b, 0.5);
    expect(a.view).toBeInstanceOf(Float32Array);
    expectArrayEqual(a, [12, 15, 18]);
  });
});

import { Mat2, Mat3, Mat4 } from '../mat.ts';

describe('generic Vec typing + mixed ops (Task 4)', () => {
  test('f32 Vec3 .view is exactly Float32Array (no cast needed for GPU)', () => {
    const v = new Vec3(1, 2, 3, float32Manager);
    const gpuReady: Float32Array = v.view;   // must type-check as Float32Array
    expect(gpuReady).toBeInstanceOf(Float32Array);
  });

  test('mixed cross product writes into destination (f32)', () => {
    const a = new Vec3(1, 2, 3, float32Manager);
    const b = new Vec3(11, 5, 7);            // f64
    a.cross(b);
    expect(a.view).toBeInstanceOf(Float32Array);
    expectArrayEqual(a, [-1, 26, -17]);
  });

  test('f32 vec * f64 mat', () => {
    const v = new Vec3(10, 11, 12, float32Manager);
    const m = Mat3.identity();
    m.set([1, 2, 3, 4, 5, 6, 7, 8, 9]);
    v.mul(m);
    expect(v.view).toBeInstanceOf(Float32Array);
    expectArrayEqual(v, [138, 171, 204]);
  });

  test('f32 vec3 mulMat4 with f64 matrix', () => {
    const v = new Vec3(7, 3, 5, float32Manager);
    const m = Mat4.identity();
    m.set([2, 7, -19, 0, 3, -11, 23, 0, -4, 13, 31, 0, 5, 17, -29, 1]);
    v.mulMat4(m);
    expectArrayEqual(v, [8, 98, 62]);
  });
});

describe('generic Mat typing + mixed ops (Task 5)', () => {
  test('f32 Mat4.identity .view is Float32Array', () => {
    const m = Mat4.identity(float32Manager);
    const gpuReady: Float32Array = m.view;
    expect(gpuReady).toBeInstanceOf(Float32Array);
    expectArrayEqual(m, [1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1]);
  });

  test('f32 mat * f64 mat writes into f32 destination', () => {
    const a = Mat2.identity(float32Manager);
    a.set([1, 2, 3, 4]);
    const b = Mat2.identity();
    b.set([5, 6, 7, 8]);
    a.mul(b);
    expect(a.view).toBeInstanceOf(Float32Array);
    // column-major: a=[[1,2],[3,4]], b=[[5,6],[7,8]] -> a*b
    expectArrayEqual(a, [23, 34, 31, 46]);
  });

  test('Mat3.fromMat4 across element types (f32 dst from f64 src)', () => {
    const m4 = Mat4.identity();
    m4.set([1, 2, 3, 0, 4, 5, 6, 0, 7, 8, 9, 0, 0, 0, 0, 1]);
    const m3 = Mat3.fromMat4(m4, float32Manager);
    expect(m3.view).toBeInstanceOf(Float32Array);
    expectArrayEqual(m3, [1, 2, 3, 4, 5, 6, 7, 8, 9]);
  });

  test('f32 mat invert/det', () => {
    const m = Mat2.identity(float32Manager);
    m.set([4, 2, 7, 6]);
    expect(m.det()).toBeCloseTo(4 * 6 - 7 * 2);
    expect(m.invert()).toBe(true);
  });
});

import { Quat } from '../quat.ts';

describe('generic Quat typing + mixed ops (Task 6)', () => {
  test('f32 Quat.fromAngleZ .view is Float32Array', () => {
    const q = Quat.fromAngleZ(Math.PI / 2, float32Manager);
    const gpuReady: Float32Array = q.view;
    expect(gpuReady).toBeInstanceOf(Float32Array);
    expectArrayEqual(q, [0, 0, Math.SQRT1_2, Math.SQRT1_2]);
  });

  test('f32 quat * f64 quat', () => {
    const a = Quat.fromAngleZ(Math.PI / 2, float32Manager);
    const b = Quat.fromAngleX(Math.PI / 2);       // f64
    a.mul(b);
    expect(a.view).toBeInstanceOf(Float32Array);
    // (0,0,s,s) * (s,0,0,s) with s=√½ -> (0.5, 0.5, 0.5, 0.5)
    expectArrayEqual(a, [0.5, 0.5, 0.5, 0.5]);
  });

  test('f32 quat rotates an f64 vec3 (cross-view rotate)', () => {
    const q = Quat.fromAngleZ(Math.PI / 2, float32Manager); // +90° about Z
    const v = new Vec3(1, 0, 0);                            // f64
    q.rotate(v);
    expectArrayEqual(v, [0, 1, 0]);
  });

  test('f32 fromAxisAngle reads an f64 axis', () => {
    const axis = new Vec3(0, 0, 1);                          // f64
    const q = Quat.fromAxisAngle(axis, Math.PI / 2, float32Manager);
    expect(q.view).toBeInstanceOf(Float32Array);
    expectArrayEqual(q, [0, 0, Math.SQRT1_2, Math.SQRT1_2]);
  });
});

import { scaling, scalingOf, translation, translationOf } from '../transform.ts';

describe('transforms with f32 output (Task 7)', () => {
  test('translation writes into an f32 Mat4 out', () => {
    const out = Mat4.identity(float32Manager);
    const t = new Vec3(3, 4, 5);           // f64 input
    translation(t, out);
    expect(out.view).toBeInstanceOf(Float32Array);
    expectArrayEqual(out, [1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 3, 4, 5, 1]);
  });

  test('scalingOf reads an f32 matrix correctly', () => {
    const m = Mat4.identity(float32Manager);
    scaling(new Vec3(2, 3, 4), m);         // m becomes scale matrix (f32)
    const out = scalingOf(m, new Vec3(0, 0, 0, float32Manager));
    expectArrayEqual(out, [2, 3, 4]);
  });

  test('translationOf into an f32 Vec3', () => {
    const m = Mat4.identity();
    translation(new Vec3(7, 8, 9), m);
    const out = translationOf(m, new Vec3(0, 0, 0, float32Manager));
    expect(out.view).toBeInstanceOf(Float32Array);
    expectArrayEqual(out, [7, 8, 9]);
  });
});

// Backward-compat: the deprecated f64 names must still be importable and usable.
import {
  ManagedFloat64Array as DeprManaged,
  BYTES_PER_FLOAT64 as DEPR_BYTES,
} from '../index.ts';
import type {
  Float64ArrayPointer as DeprPointer,
  Float64ArrayViewProvider as DeprProvider,
} from '../index.ts';
import { JsMemoryManager } from '../index.ts';
// `TypedArray` is a type: import type-only (verbatimModuleSyntax → TS1484). Aliased to
// `BarrelTypedArray` because the top-of-file `TypedArray` import from '../memory.ts' already
// binds that name (a second unaliased import would be a duplicate identifier, TS2300). The
// alias still guards that `TypedArray` surfaces through the '../index.ts' barrel.
import type { TypedArray as BarrelTypedArray } from '../index.ts';

describe('public exports + backward compatibility (Task 8)', () => {
  test('deprecated names are re-exported from the js barrel', () => {
    expect(DEPR_BYTES).toBe(8);
    expect(typeof DeprManaged).toBe('function'); // the shim class value
  });

  test('generic new names are re-exported', () => {
    expect(typeof JsMemoryManager).toBe('function');
    const custom = new JsMemoryManager(Float32Array);
    const p: DeprPointer | ReturnType<typeof custom.allocate> = custom.allocate(2);
    expect(p.view).toBeInstanceOf(Float32Array);
    p.free();
    // type-only references to keep the deprecated type aliases exercised
    const _provider: DeprProvider = { view: new Float64Array(1) };
    expect(_provider.view.length).toBe(1);
    // the generic element-type union also surfaces through the barrel
    const _elem: BarrelTypedArray = new Float32Array(1);
    expect(_elem.length).toBe(1);
  });
});
