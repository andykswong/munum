<h1 align="center">🅼🆄🅽🆄🅼</h1>
<h2 align="center">μNum - AssemblyScript Numerical Library</h2>
<br />
<p align="center">
  <a href="./LICENSE"><img src="https://img.shields.io/badge/License-MIT-yellow.svg" alt="License: MIT" /></a> 
  <a href="https://www.npmjs.com/package/munum"><img src="https://img.shields.io/npm/v/munum" alt="NPM" /></a> 
  <a href="https://bundlephobia.com/result?p=munum"><img src="https://badgen.net/bundlephobia/minzip/munum" alt="size" /></a> 
  <a href="https://github.com/andykswong/munum/actions/workflows/build.yaml"><img src="https://github.com/andykswong/munum/actions/workflows/build.yaml/badge.svg" alt="build" /></a>
</p>

## Overview
`munum` is a small, modular numerical library for high-performance 3D web applications. With munum, you can build isomorphic apps that targets both JavaScript via Babel/TypeScript, and WebAssembly via AssemblyScript with the same code base.

## Usage
Install via NPM for AssemblyScript or TypeScript projects: 

```shell
npm install --save munum
```

Or load directly from CDN without having to use any build system:
```html
<script type="module">
  import { vec4 } from 'https://unpkg.com/munum@latest';
  const v = vec4.create();
</script>
```

Sample usage to build a perspective camera view-projection matrix and frustum:

[(Try it yourself here)](https://codepen.io/andykswong/pen/yLbPzGy?editors=0011)
```javascript
import { frustum, lookAt, mat4, perspective, vec3 } from 'munum'; // Or load from CDN

const eye = vec3.create(1, 1, 1);
const target = vec3.create(0, 0, 0);
const view = lookAt(eye, target);

const aspectRatio = width / height;
const yfov = Math.PI / 4;
const znear = 0.01;
const zfar = 100;
const proj = perspective(aspectRatio, yfov, znear, zfar);

const vp = mat4.mul(proj, view);
const f = frustum.fromViewProj(vp);
```

## Learn More
See TSDoc: http://andykswong.github.io/munum

## License
This repository and the code inside it is licensed under the MIT License. Read [LICENSE](./LICENSE) for more information.
