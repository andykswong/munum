import { expectArrayEqual } from '../../__tests__/test-utils.ts';
import { externalPointer, memoryManager } from '../memory.ts';
import { Vec3 } from '../vec.ts';

describe('managed memory (wasm binding)', () => {
  test('at() returns values in range and undefined out of range', () => {
    using v = new Vec3(7, 8, 9);
    expect(v.at(0)).toBe(7);
    expect(v.at(2)).toBe(9);
    expect(v.at(-1)).toBeUndefined();
    expect(v.at(3)).toBeUndefined();
  });

  test('setAt() only writes in range', () => {
    using v = new Vec3(1, 2, 3);
    v.setAt(1, 42);
    expect(v.at(1)).toBe(42);
    v.setAt(9, 100); // out of range: ignored
    expectArrayEqual(v, [1, 42, 3]);
  });

  test('free() invalidates and is idempotent', () => {
    const v = new Vec3(1, 2, 3);
    expect(v.valid).toBe(true);
    v.free();
    expect(v.valid).toBe(false);
    expect(() => v.free()).not.toThrow();
    expectArrayEqual(v, []);
  });

  test('borrowed view into wasm memory shares storage and is not freed on dispose', () => {
    using owner = new Vec3(3, 4, 5);
    const borrowed = Vec3.view(externalPointer(memoryManager, owner.byteOffset, 3));
    expectArrayEqual(borrowed, [3, 4, 5]);
    borrowed.free();                    // no-op
    expect(borrowed.valid).toBe(true);
    expectArrayEqual(owner, [3, 4, 5]);  // owner untouched
  });

  test('.view(pointer) borrows (never frees the owner) — no accidental ownership share', () => {
    const owner = new Vec3(3, 4, 5);
    // Passing the owner's own pointer must NOT transfer/share ownership.
    const borrowed = Vec3.view(owner.ptr);
    expectArrayEqual(borrowed, [3, 4, 5]);
    borrowed.free();                    // no-op — does not free the owner
    expect(owner.valid).toBe(true);
    expectArrayEqual(owner, [3, 4, 5]);
    owner.free();                       // owner still owns and can free
    expect(owner.valid).toBe(false);
  });

  test('view getter tracks the live wasm memory buffer', () => {
    expect(memoryManager.view).toBeInstanceOf(Float64Array);
    expect(memoryManager.view.buffer).toBe(memoryManager.buffer);
  });
});
