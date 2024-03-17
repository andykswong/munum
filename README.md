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
`munum` is a minimalistic numerical library for high-performance 3D math with Rust, WebAssembly and JavaScript bindings.

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
- `std` - enables `std` support. enabled by default.
- `libm` - enables trigonometry related functions in `no_std` environment using `libm`.
- `jsmath` - enables trigonometry related functions in `no_std` WebAssembly environment using JS Math binding.
- `serde` - enables `serde` serialize/deserialize implementations
- `wasm` - produces WebAssembly module and WebAssembly component (WIP)

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

Note the use of `using` (which automatically calls `.free()` when out of scope). When using JavaScript binding, `munum` resources are allocated on WebAssembly memory which need to be deallocated later. `munum` uses `FinalizationRegistry` for automatic memory management, so explicit memory management with `using` or `.free()` is not required through recommended.

## Usage (Pure JavaScript)
Import from `munum/js` for pure JavaScript implementation.

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

## License
This repository and the code inside it is licensed under the MIT License. Read [LICENSE](./LICENSE) for more information.
