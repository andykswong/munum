import { defineConfig } from 'vitest/config';
import { playwright } from '@vitest/browser-playwright';

// Two projects:
//  - node:    *.test.ts in Node (pure-JS impl + wasm binding via top-level-await loader)
//  - browser: *.browser.test.ts in real Chromium (verifies the wasm binding loads and
//             runs the zero-copy pointer path in a browser, using the atob fallback)
//
// Both run against source .ts (Vite resolves the `../../wasm/index.js` loader to the
// generated repo-root module), so `npm run build:wasm-loader` must run first — the
// root `build` script and CI do this before `test`.
export default defineConfig({
  test: {
    globals: true,
    coverage: {
      include: ['js/**/*.ts'],
      exclude: ['js/**/__tests__/**'],
    },
    projects: [
      {
        test: {
          name: 'node',
          globals: true,
          environment: 'node',
          include: ['js/**/*.test.ts'],
          exclude: ['js/**/*.browser.test.ts', '**/node_modules/**', '**/dist/**'],
        },
      },
      {
        test: {
          name: 'browser',
          globals: true,
          include: ['js/**/*.browser.test.ts'],
          exclude: ['**/node_modules/**', '**/dist/**'],
          browser: {
            enabled: true,
            provider: playwright(),
            headless: true,
            instances: [{ browser: 'chromium' }],
          },
        },
      },
    ],
  },
});
