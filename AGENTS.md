# μNum (munum) — Agent Guidelines

## Project Overview

`munum` is a minimalistic **3D math library** with a single source of truth in `no_std` **Rust** that ships to three targets:

1. **A native Rust crate** (`munum` on crates.io) — generic over the scalar type, `no_std`, with optional `std`/`libm`/`jsmath`/`serde`/`wasm` features.
2. **A compact WebAssembly module** — the Rust math compiled for `wasm32-unknown-unknown` with a hand-written flat C-ABI export surface (one function per operation, pointer-based). Vectors and matrices live in the module's linear memory and are mutated **in place (zero-copy)**.
3. **Two JavaScript surfaces** on top:
   - `munum` / `munum/wasm` — a thin TypeScript class binding over the WebAssembly module (`Vec2/3/4`, `Quat`, `Mat2/3/4`, transform functions). This is the primary, high-performance path.
   - `munum/js` — a **dependency-free pure-JS** reimplementation with the *same* public API, for environments that don't want WebAssembly.

The npm package version is `0.3.0`; the Rust crate is `0.3.0`.

> The WebAssembly **Component** (`wasm/munum.component.wasm`) + WIT world (`wit/world.wit`) are a **work-in-progress** artifact built by `jco` for future component-model consumers. Nothing in the shipped JS binding consumes it — the binding uses the **core module** directly because the component ABI would lift/lower values across the boundary and destroy the zero-copy memory sharing that is munum's whole point. Keep it building, but don't route the JS binding through it.

## Repository Layout

```
src/                         Rust source (the single source of truth)
├── lib.rs                   crate root: no_std, module wiring, public re-exports
├── matrix.rs                Matrix<T, R, C> core type (column-major), indexing, conversions, serde
├── matrix_ops.rs            arithmetic ops, transpose, dot/len/normalize (vectors are Matrix<T, N, 1>)
├── matrix_special.rs        Vec2/3/4 + Mat2/3/4 aliases, ctors, conversions, cross, det, invert
├── quat.rs                  Quaternion<T>: from_axis_angle/angle_*, slerp, rotate_vec3, conversions
├── scalar.rs                scalar helpers: neg, sign, max, copysign, lerp
├── float.rs                 FloatOps / FloatEq traits, epsilon, assert_float_eq! macro
├── transform.rs             3D transforms + glTF ortho/perspective/lookAt projections
├── transform2d.rs           2D affine transforms (Mat3)
└── wasm/                    WebAssembly C-ABI export layer (cfg(target_arch = "wasm32"))
    ├── mod.rs               module wiring, panic handler, global allocator hookup
    ├── array.rs             create/free exports (the allocation entry points)
    ├── alloc.rs             FreeListAllocator (fixed-size free lists for vec/mat sizes)
    ├── ptr.rs               Load trait: read a Matrix/Quaternion from a raw pointer
    ├── jsmath.rs            libmath import: trig via the host's JS Math (jsmath feature)
    ├── vec.rs / mat.rs / quat.rs / transform.rs / transform2d.rs   the exported ops

js/                          TypeScript sources (compiled to dist/ by Vite)
├── index.ts                 default entry: re-exports the wasm binding + scalar/types/memory
├── memory.ts                pointer model: Float64ArrayViewProvider, Float64ArrayPointer (Managed/External), MemoryManager + AbstractMemoryManager (embedded registry), ManagedFloat64Array base + viewAs borrow helper, float64View/externalPointer
├── scalar.ts  types.ts      shared scalar helpers and Vec/Mat/IQuat interfaces
├── wasm/                    the WebAssembly binding (munum, munum/wasm)
│   ├── index.ts             barrel: mat/quat/transform/vec
│   ├── memory.ts            the wasm module's linear memory as a MemoryManager (default `memoryManager`)
│   └── mat.ts quat.ts transform.ts vec.ts   the binding classes/functions
└── js/                      the pure-JS implementation (munum/js)
    ├── index.ts memory.ts helpers.ts mat.ts quat.ts transform.ts vec.ts

wasm/                        published WebAssembly artifacts (committed)
├── munum.wasm               the wasm-opt'd core module
├── index.js                 AUTO-GENERATED portable loader (see below) — DO NOT EDIT
├── index.d.ts               hand-maintained typings for the loader's exports
└── munum.component.wasm     WIP component (jco output)
wit/world.wit                WIT world for the WIP component
scripts/gen-wasm-loader.mjs  generates wasm/index.js from the built module
```

## The WebAssembly Loader (the load-bearing design detail)

`js/wasm/*` import the module's raw exports from `../../wasm/index.js`. Under the old toolchain that file was `export * from './munum.wasm'`, relying on **Node's WebAssembly-ESM integration** — which no bundler (Vite/Rollup/esbuild) implements and which forced `jest` to run under `--experimental-vm-modules`.

It is now a **generated portable loader** (`scripts/gen-wasm-loader.mjs`, run by `npm run build:wasm-loader`): the ~18 KB module is inlined as base64 and instantiated with `WebAssembly.instantiate` behind a **top-level await**. TLA blocks importers until instantiation finishes, so `memory`, `create`, `free`, and every op are available **synchronously** to the binding classes exactly as before — but now identically in Node, real browsers, Vitest (both projects), and any bundler, with no wasm-asset configuration. The `libmath` import (JS `Math` trig) resolves via the `libmath` workspace package. Browsers hit the `atob` byte-decode path (no `Buffer`).

The generator reads the export names straight from the compiled module's export section, so the loader can never drift from the artifact. **Never hand-edit `wasm/index.js`** — regenerate it. If you change the wasm export surface, also update `wasm/index.d.ts` (hand-maintained) and `wit/world.wit`.

## Build & Test

```shell
rustup target add wasm32-unknown-unknown
npm install
npx playwright install chromium   # one-time: browser test project

npm run build        # build:wasm -> build:wasm-opt -> build:wasm-loader -> build:component -> build:js
npm run lint         # eslint (flat config, eslint.config.mjs)
npm run typecheck    # tsc --noEmit
npm test             # vitest run: node + browser projects
npm run test:node    # vitest node project only
npm run test:browser # vitest browser project (Chromium via Playwright)
npm run test:rust    # cargo test --all-features
npm run doc          # typedoc -> docs/
```

The `build` pipeline is ordered and each step feeds the next:
1. `build:wasm` — `cargo rustc -r --target wasm32-unknown-unknown --crate-type cdylib -F jsmath,wasm --no-default-features`
2. `build:wasm-opt` — `wasm-opt -Oz` (binaryen, npm dep) → `wasm/munum.wasm`
3. `build:wasm-loader` — generate `wasm/index.js`
4. `build:component` — `jco embed` + `jco new` → `wasm/munum.component.wasm` (WIP)
5. `build:js` — `vite build` → `dist/` (per-module ES output + `.d.ts`)

**Tests run against source `.ts`** (Vite resolves the `../../wasm/index.js` loader to the generated file), so `wasm/index.js` must exist before `npm test` — `npm run build` (or at least `build:wasm` → `build:wasm-loader`) generates it. CI runs the full `build` first.

Vitest has two projects (`vitest.config.ts`):
- **node** — `js/**/*.test.ts` in the `node` environment (pure-JS impl + the wasm binding via the TLA loader + `Buffer`).
- **browser** — `js/**/*.browser.test.ts` in real Chromium (Playwright), verifying the binding loads and runs the zero-copy path in a browser (exercises the `atob` fallback).

## Toolchain

- **Rust** edition **2024** (`rustc >= 1.85`); `no_std` + `alloc`.
- **Node.js >= 26**, ESM-only (`"type": "module"`), native `using` (no down-transpile — Vite targets `esnext`; do not lower it back to an `@oxc-project/runtime` helper).
- **TypeScript 6**, **Vite 8** (library build), **Vitest 4** (node + browser), **ESLint 10** (flat config + `@stylistic` + `typescript-eslint`), **typedoc**, **jco** + **binaryen** for the wasm artifacts.

## Key Conventions & Gotchas

- **Matrices are column-major.** `Matrix::new` takes an array of columns; flat slices (`from_slice`, `AsRef`) are column-major. Every expected value in a test must respect this.
- **Vectors are `Matrix<T, N, 1>`** in Rust; vector ops live in `matrix_ops.rs`.
- **Edition 2024 in the wasm layer:** exported functions use `#[unsafe(export_name = "…")]` / `#[unsafe(no_mangle)]` (the attributes are `unsafe` in 2024), and `unsafe fn` bodies wrap their unsafe operations in explicit `unsafe { … }` blocks. The `libmath` FFI is an `unsafe extern "C"` block. Keep the wasm build **warning-clean** (`cargo clippy --target wasm32-unknown-unknown -F jsmath,wasm --no-default-features -- -D warnings`).
- **Memory ownership is per-`MemoryManager`, pointer-based (no global).** `js/memory.ts` defines `MemoryManager` (`allocate(size) → Float64ArrayPointer`, `free(ptr)`, plus `wrap(offset, size)` to adopt a wasm-op-returned raw offset as an owning pointer), `AbstractMemoryManager` (the embedded per-manager `FinalizationRegistry`; impls provide `createRaw`/`freeRaw`/`view`), and the `ManagedFloat64Array` base (holds one `ptr`, delegates everything). Ownership lives in the pointer type: `ManagedPointer` frees + is GC-registered; `ExternalPointer` is a no-op on dispose and never registered. Each impl exports its own default `memoryManager` (plus `AbstractMemoryManager` for building custom arenas). There is **no** global manager and no `setMemoryManager`/`useFinalizationRegistry` (registry toggle is an `AbstractMemoryManager` constructor arg). In the **pure-JS** impl, `new Vec3(...)` and every static creator (`Mat4.identity`, `Mat3.fromMat4`, `Quat.fromAngleZ`, …) take an optional trailing `manager` arg (default the module `memoryManager`); the **wasm** binding cannot — its ops allocate inside the module's single linear memory, so those constructors/creators have no `manager` arg. `Vec3.view(...)` **always borrows** (dispose never frees). External glTF buffers are pure-JS-only via `float64View(f64array)`; the wasm binding's `.view()` is for offsets into wasm linear memory. The package is `sideEffects: false` — the memory model has no module-init side effect, so it tree-shakes cleanly.
- **Zero-copy means aliasing:** binding ops mutate operands in place and return `this`/`out`. Read the method before assuming it's pure.
- Prefer **exact integer/rational** expected values (`assert_eq!` in Rust, exact arrays in JS) wherever the operation allows; reserve float-tolerance comparisons (`assert_float_eq!`, `toBeCloseTo`) for genuinely irrational results (normalization, trig, slerp).

## When Editing

- **The Rust source is the source of truth.** A change to the math generally needs to land in Rust **and** the pure-JS mirror (`js/js/*`), and — if it touches the export surface — in the wasm layer (`src/wasm/*`), `wit/world.wit`, and `wasm/index.d.ts`, followed by a rebuild to regenerate `wasm/index.js`.
- **Every change needs tests** covering the new/modified behavior — happy path, edge cases (singular matrices, zero vectors, boundary params), and error conditions. Rust edge-case tests live in `tests/*.rs` (integration, public API); doctests document usage; JS tests live in `js/**/__tests__/*.test.ts`.
- Work is not done until this passes from the repo root:
  `npm run build && npm run lint && npm run typecheck && npm test && npm run test:rust`
- Prefer editing existing files over creating new ones. Match the surrounding style (2-space indent, single quotes, semicolons in TS; existing rustfmt-ish layout in Rust).
