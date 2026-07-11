import { readdirSync, statSync } from 'node:fs';
import { resolve } from 'node:path';
import { defineConfig } from 'vite';
import dts from 'vite-plugin-dts';

// Collect every non-test TypeScript module under js/ as a library entry so the
// output mirrors the source tree (dist/index.js, dist/js/*, dist/wasm/*).
function findEntries(dir: string, base = ''): Record<string, string> {
  const entries: Record<string, string> = {};
  for (const file of readdirSync(dir)) {
    const fullPath = resolve(dir, file);
    if (statSync(fullPath).isDirectory()) {
      if (file === '__tests__') continue;
      Object.assign(entries, findEntries(fullPath, `${base}${file}/`));
    } else if (file.endsWith('.ts') && !file.endsWith('.d.ts')) {
      entries[`${base}${file.replace(/\.ts$/, '')}`] = fullPath;
    }
  }
  return entries;
}

export default defineConfig({
  plugins: [
    dts({
      tsconfigPath: './tsconfig.json',
      include: ['js'],
      exclude: ['**/__tests__/**'],
    }),
  ],
  build: {
    // esnext so native `using` (explicit resource management) is emitted as-is
    // rather than lowered to an `@oxc-project/runtime` helper import. Node >= 26
    // and current browsers support it natively.
    target: 'esnext',
    lib: {
      entry: findEntries(resolve(process.cwd(), 'js')),
      formats: ['es'],
    },
    outDir: 'dist',
    sourcemap: true,
    minify: true,
    rollupOptions: {
      // Externalize bare specifiers (e.g. `libmath`) and the generated
      // WebAssembly loader at the repo root. The loader ships alongside dist/
      // (package export `./wasm`) and holds the single shared wasm memory
      // instance, so it must stay a runtime import rather than be inlined.
      external: (id) =>
        (!id.startsWith('.') && !id.startsWith('/') && !id.startsWith('\0')) ||
        id === '../../wasm/index.js' ||
        /[\\/]wasm[\\/]index\.js$/.test(id),
      output: {
        preserveModules: true,
        preserveModulesRoot: 'js',
        entryFileNames: '[name].js',
      },
    },
  },
});
