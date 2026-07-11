<h1 align="center">🅼🆄🅽🆄🅼</h1>
<h2 align="center">μNum - Micro 3D Math Library</h2>
<br />

[![license: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](./LICENSE)
[![Docs.rs](https://docs.rs/munum/badge.svg)](https://docs.rs/munum)
[![Crates.io](https://img.shields.io/crates/v/munum.svg)](https://crates.io/crates/munum)
[![npm](https://img.shields.io/npm/v/munum.svg)](https://www.npmjs.com/package/munum)
[![codecov](https://codecov.io/gh/andykswong/munum/branch/main/graph/badge.svg?token=68JPTUD7GZ)](https://codecov.io/gh/andykswong/munum)
[![build](https://github.com/andykswong/munum/actions/workflows/build.yaml/badge.svg)](https://github.com/andykswong/munum/actions/workflows/build.yaml)

## Overview
`munum` is a minimalistic numerical library for high-performance 3D math with **Rust**, **WebAssembly**, and **JavaScript** bindings. The math is written once in `no_std` Rust; the same source powers a native crate, a compact WebAssembly module, and two JavaScript surfaces — a zero-copy WebAssembly binding and a dependency-free pure-JS implementation with the same API.

## Documentation
- Docs.rs: https://docs.rs/munum
- TSDoc: http://andykswong.github.io/munum

## Install
[JavaScript] Install via npm:
```shell
npm install --save munum
```

---

[Rust] Install as Cargo dependency:
```shell
cargo add munum
```
Features:
- `std` - enables `std` support. Enabled by default.
- `libm` - enables trigonometry related functions in `no_std` environment using `libm`.
- `jsmath` - enables trigonometry related functions in `no_std` WebAssembly environment using the JS `Math` binding.
- `serde` - enables `serde` serialize/deserialize implementations.
- `wasm` - produces the WebAssembly module and WebAssembly component (WIP).

## Usage (JavaScript WebAssembly binding)
Sample usage to build a perspective camera view-projection matrix below:

[(Try it yourself here)](https://codepen.io/andykswong/pen/yLbPzGy?editors=0011)
```javascript
import { lookAt, perspective, Mat4, Vec3 } from 'munum'; // Or load from CDN, e.g. 'https://unpkg.com/munum@latest'

using eye = new Vec3(1, 1, 1);
using target = new Vec3(0, 0, 0);
using up = new Vec3(0, 1, 0);
const view = lookAt(eye, target, up);

const aspectRatio = width / height;
const yfov = Math.PI / 4;
const znear = 1;
const zfar = 100;

using viewProj = perspective(aspectRatio, yfov, znear, zfar).mul(view);
```

The WebAssembly binding stores `munum` values directly in the WebAssembly module's linear memory and operates on them in place (zero-copy), so vectors and matrices need to be deallocated after use. Memory is managed per-`MemoryManager`: each value captures a manager (the module default unless one is passed) and is auto-reclaimed by that manager's embedded `FinalizationRegistry`, so explicit cleanup via `using` (which calls `.free()` when the value goes out of scope) or a manual `.free()` is recommended but not required.

To wrap **existing** memory without owning it, use the `view` factory — disposing a borrowed view never frees the underlying storage:

```javascript
import { Vec3, float64View } from 'munum/js';

// Zero-copy view over a raw glTF Float64Array (pure-JS build):
const positions = new Float64Array(gltfBuffer);   // e.g. accessor data, packed vec3s
const p1 = Vec3.view(float64View(positions), 3 * 3 * 8);  // 2nd vertex (byteOffset)
p1.scale(2);                                       // mutates `positions` in place
// p1.free() is a no-op — `positions` is owned by the caller.
```

The module is loaded through a portable top-level-await loader (`munum/wasm`) that inlines the WebAssembly module — it works unchanged in Node, browsers, and any bundler, with no WebAssembly-ESM integration or asset-loader configuration required.

## Usage (Pure JavaScript)
Import from `munum/js` for the pure-JavaScript implementation, which mirrors the WebAssembly binding's API but has no WebAssembly dependency:
```javascript
import { lookAt, perspective, Mat4, Vec3 } from 'munum/js';
```

## Usage (Rust)
Sample usage to build a perspective camera view-projection matrix:

```rust
use core::f32::{consts::PI, INFINITY};
use munum::{transform, vec3};

let eye = vec3(0_f32, 2., 0.);
let target = vec3(0., 0.6, 0.);
let up = vec3(0., 0., -1.);
let view = transform::look_at(eye, target, up);

let proj = transform::perspective(2., PI/2., 1., INFINITY);

let view_proj = proj * view;
```

## Development
Requires **Node.js >= 26** and a **Rust** toolchain (edition 2024, `rustc >= 1.85`) with the `wasm32-unknown-unknown` target.

```shell
rustup target add wasm32-unknown-unknown
npm install
npx playwright install chromium   # one-time: the browser test project needs Chromium

npm run build        # cargo -> wasm-opt -> loader gen -> jco component -> vite (dist/)
npm run lint         # eslint (flat config)
npm run typecheck    # tsc --noEmit
npm test             # vitest: node + browser (Chromium) projects
npm run test:rust    # cargo test --all-features
npm run doc          # typedoc -> docs/
```

See [AGENTS.md](./AGENTS.md) for the full architecture, build pipeline, and contributor guidelines.

## License
This repository and the code inside it is licensed under the MIT License. Read [LICENSE](./LICENSE) for more information.
