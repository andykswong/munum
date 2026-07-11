import { expectArrayEqual } from '../../__tests__/test-utils.ts';
import { memory } from '../../../wasm/index.js';
import type { Mat4 } from '../mat.ts';
import { memoryManager } from '../memory.ts';
import { Quat } from '../quat.ts';
import { perspective } from '../transform.ts';
import { Vec3 } from '../vec.ts';

// Runs in real Chromium (Vitest browser project). Verifies the WebAssembly
// binding loads via the top-level-await loader in a browser — which exercises
// the `atob` byte-decoding fallback (no Node Buffer) — and that the zero-copy
// pointer path over shared linear memory produces correct results.
describe('wasm binding (browser)', () => {
  test('loads the module with a real WebAssembly.Memory', () => {
    expect(memory).toBeInstanceOf(WebAssembly.Memory);
    expect(memoryManager.buffer).toBe(memory.buffer);
  });

  test('zero-copy Vec3 math over shared memory', () => {
    const a = new Vec3(1, 2, 3);
    const b = new Vec3(10, 20, 30);
    expectArrayEqual(a.add(b), [11, 22, 33]);
    expect(a.buffer).toBe(memory.buffer);
  });

  test('normalize uses the libmath sqrt import', () => {
    const v = new Vec3(3, 4, 12);
    expect(v.normalize()).toBe(true);
    expectArrayEqual(v, [3 / 13, 4 / 13, 12 / 13]);
  });

  test('quaternion from angle uses libmath sin/cos imports', () => {
    using q = Quat.fromAngleZ(Math.PI / 2);
    expectArrayEqual(q, [0, 0, Math.SQRT1_2, Math.SQRT1_2]);
  });

  test('perspective projection produces a 4x4 matrix', () => {
    using m = perspective(1, Math.PI / 2, 1, 100) as Mat4;
    expectArrayEqual(m, [1, 0, 0, 0, 0, 1, 0, 0, 0, 0, -101 / 99, -1, 0, 0, -200 / 99, 0]);
  });
});
