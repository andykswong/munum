import { expectArrayEqual } from '../../__tests__/test-utils.ts';
import { externalPointer, float64View } from '../memory.ts';
import { Vec3 } from '../vec.ts';

describe('external (borrowed) views — pure JS', () => {
  test('Vec3.view over an external Float64Array is zero-copy read/write', () => {
    // Simulate a glTF buffer: 2 vec3s packed contiguously.
    const buffer = new Float64Array([1, 2, 3, 4, 5, 6]);
    const provider = float64View(buffer);

    const v0 = Vec3.view(provider, 0);         // elements 0..2
    const v1 = Vec3.view(provider, 3 * 8);     // byteOffset of element 3

    expectArrayEqual(v0, [1, 2, 3]);
    expectArrayEqual(v1, [4, 5, 6]);

    // Writing through the view mutates the backing buffer in place (zero-copy).
    v0.scale(2);
    expectArrayEqual(v0, [2, 4, 6]);
    expect(buffer[0]).toBe(2);
    expect(buffer[2]).toBe(6);
    // The second vector is untouched.
    expectArrayEqual(v1, [4, 5, 6]);
  });

  test('disposing a borrowed view does NOT free the backing memory', () => {
    const buffer = new Float64Array([7, 8, 9]);
    const v = Vec3.view(float64View(buffer), 0);
    expect(v.valid).toBe(true);
    v.free();                        // no-op for a borrowed pointer
    expect(v.valid).toBe(true);
    expectArrayEqual(v, [7, 8, 9]);  // still readable, memory intact
  });

  test('using-scoped borrowed view leaves the buffer intact after dispose', () => {
    const buffer = new Float64Array([1, 0, 0]);
    {
      using v = Vec3.view(float64View(buffer), 0);
      v.setAt(1, 5);
    }
    expect(buffer[1]).toBe(5); // written; not freed/cleared on dispose
  });

  test('externalPointer wraps an offset with no-op dispose', () => {
    const buffer = new Float64Array([1, 1, 1]);
    const ptr = externalPointer(float64View(buffer), 0, 3);
    expect(ptr.valid).toBe(true);
    ptr.free();
    expect(ptr.valid).toBe(true);
  });
});
