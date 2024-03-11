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

WIP v0.2: unification of Rust and JS source

## Documentation
- Docs.rs: https://docs.rs/munum
- TSDoc: http://andykswong.github.io/munum

## Install
[Rust] Install as Cargo dependency:
```shell
cargo add munum
```
Features:
- `std` - enables `std` support. enabled by default.
- `libm` - enables trigonometry related functions in `no_std` environment using `libm`.
- `jsmath` - enables trigonometry related functions in `no_std` WebAssembly environment using JS Math binding.
- `serde` - enables `serde` serialize/deserialize implementations
- `wasm` - (WIP) enables WebAssembly export bindings

---

[JavaScript] Install via npm: 

```shell
npm install --save munum
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

## Usage (JavaScript)
Sample usage to build a perspective camera view-projection matrix and frustum:

[(Try it yourself here)](https://codepen.io/andykswong/pen/yLbPzGy?editors=0011)
```javascript
import { frustum, lookAt, mat4, perspective, vec3 } from 'munum'; // Or load from CDN

const eye = vec3.create(1, 1, 1);
const target = vec3.create(0, 0, 0);
const view = lookAt(eye, target);

const aspectRatio = width / height;
const yfov = Math.PI / 4;
const znear = 1;
const zfar = 100;
const proj = perspective(aspectRatio, yfov, znear, zfar);

const vp = mat4.mul(proj, view);
const f = frustum.fromViewProj(vp);
```

You can also load directly from CDN without having to use any build system:
```html
<script type="module">
  import { vec4 } from 'https://unpkg.com/munum@latest';
  const v = vec4.create();
</script>
```

## License
This repository and the code inside it is licensed under the MIT License. Read [LICENSE](./LICENSE) for more information.
