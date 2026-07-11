import { expectArrayEqual } from '../../__tests__/test-utils.ts';
import { AbstractMemoryManager, BYTES_PER_FLOAT64, memoryManager } from '../memory.ts';
import { Mat3, Mat4 } from '../mat.ts';
import { Quat } from '../quat.ts';
import { Vec3 } from '../vec.ts';

describe('memoryManager (pure JS)', () => {
  test('allocate returns an owning pointer with a live view', () => {
    const p = memoryManager.allocate(3);
    expect(p.byteOffset % BYTES_PER_FLOAT64).toBe(0);
    expect(p.length).toBe(3);
    expect(p.valid).toBe(true);
    expect(p.view).toBeInstanceOf(Float64Array);
    p.free();
    expect(p.valid).toBe(false);
  });

  test('free is idempotent', () => {
    const p = memoryManager.allocate(4);
    p.free();
    expect(() => p.free()).not.toThrow();
    expect(p.valid).toBe(false);
  });

  test('freed same-size block is reused', () => {
    const a = memoryManager.allocate(4);
    const off = a.byteOffset;
    a.free();
    const b = memoryManager.allocate(4);
    expect(b.byteOffset).toBe(off);
    b.free();
  });

  test('Symbol.dispose frees an owning pointer', () => {
    let offset = -1;
    {
      using p = memoryManager.allocate(3);
      offset = p.byteOffset;
      expect(p.valid).toBe(true);
    }
    // After the block, the pointer has been disposed; its slot is reusable.
    const next = memoryManager.allocate(3);
    expect(next.byteOffset).toBe(offset);
    next.free();
  });

  test('Vec3 writes land in the shared buffer', () => {
    const v = new Vec3(1, 2, 3);
    expect(v.buffer).toBe(memoryManager.view.buffer);
    expect(v.buffer).toBe(memoryManager.buffer);
    expectArrayEqual(v, [1, 2, 3]);
    v.free();
  });
});

describe('static creators accept an explicit MemoryManager', () => {
  test('Vec/Mat/Quat creators allocate in the passed arena', () => {
    const arena = new (class extends AbstractMemoryManager {
      private readonly memory = new WebAssembly.Memory({ initial: 1 });
      private cached = new Float64Array(this.memory.buffer);
      private next = 0;
      public override get view() { return this.cached; }
      protected override createRaw(size: number) {
        const offset = this.next;
        this.next += size;
        return offset * BYTES_PER_FLOAT64;
      }
      protected override freeRaw() { /* bump allocator: no reclaim needed for the test */ }
    })();

    const v = new Vec3(1, 2, 3, arena);
    expect(v.buffer).toBe(arena.buffer);
    expect(v.buffer).not.toBe(memoryManager.buffer);
    expectArrayEqual(v, [1, 2, 3]);

    const m = Mat4.identity(arena);
    expect(m.buffer).toBe(arena.buffer);
    expectArrayEqual(m, [1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1]);

    const q = Quat.fromAngleZ(Math.PI / 2, arena);
    expect(q.buffer).toBe(arena.buffer);
    expectArrayEqual(q, [0, 0, Math.SQRT1_2, Math.SQRT1_2]);

    // A conversion into the arena reads the (default-arena) source correctly.
    const m3 = Mat3.fromMat4(m, arena);
    expect(m3.buffer).toBe(arena.buffer);
    expectArrayEqual(m3, [1, 0, 0, 0, 1, 0, 0, 0, 1]);
  });
});
