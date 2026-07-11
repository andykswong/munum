# libmath

A tiny ESM module that re-exports the JavaScript `Math` object's constants and functions as named exports (`sin`, `cos`, `sqrt`, `PI`, …).

Its purpose is to provide the **`libmath` import** that the `munum` WebAssembly module expects: the Rust math is compiled with the `jsmath` feature, which imports trigonometric functions (`acos`, `cos`, `sin`, `sqrt`, `tan`) from a host module named `libmath` rather than pulling in `libm`. Re-exporting `Math` as named ESM bindings lets the WebAssembly loader satisfy those imports directly, with no glue code:

```javascript
import * as libmath from 'libmath';
const { instance } = await WebAssembly.instantiate(bytes, { libmath });
```

This package is part of the [`munum`](../../README.md) workspace and is not intended for standalone use.

## License
This repository and the code inside it is licensed under the MIT License. Read [LICENSE](./LICENSE) for more information.
