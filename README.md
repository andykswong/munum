# munum - μNum - AssemblyScript Numerical Library
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](./LICENSE) [![NPM](https://img.shields.io/npm/v/munum)](https://www.npmjs.com/package/munum) [![build](https://github.com/andykswong/munum/actions/workflows/build.yaml/badge.svg)](https://github.com/andykswong/munum/actions/workflows/build.yaml)

> A minimal numerical library for 3D graphics and physics simulation in JavaScript and WebAssembly via AssemblyScript.

## Overview
`munum` is a small, modular numerical library for high-performance 3D applications running on WebAssembly. Using munum with TypeScript/AssemblyScript, you can compile the same code to both JavaScript with `tsc` and WebAssembly with `asc` without any change.

## Usage
Install via NPM: 

```shell
npm install --save munum
```

Sample usage to build a perspective camera view-projection matrix and frustum:
```javascript
import { frustum, lookAt, mat4, perspective, vec3 } from 'munum';

const eye = vec3.create(1, 1, 1);
const target = vec3.create(0, 0, 0);
const view = lookAt(eye, target);

const aspectRatio = width / height;
const yfov = Math.PI / 4;
const znear = 0.01;
const zfar = 100;
const proj = perspective(aspectRatio, yfov, znear, zfar);

const viewProj = mat4.mul(proj, view);
const frustum = frustum.fromViewProj(viewProj);
```

## Learn More
See TSDoc: http://andykswong.github.io/munum

## License
This repository and the code inside it is licensed under the MIT License. Read [LICENSE](./LICENSE) for more information.
