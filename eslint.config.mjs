import eslint from '@eslint/js';
import globals from 'globals';
import stylistic from '@stylistic/eslint-plugin';
import tseslint from 'typescript-eslint';

/** @type {import('eslint').Linter.Config[]} */
export default tseslint.config(
  {
    ignores: [
      '**/dist/*',
      '**/coverage/*',
      '**/target/*',
      '**/docs/*',
      'wasm/index.js',
      'wasm/*.d.ts',
    ],
  },
  eslint.configs.recommended,
  ...tseslint.configs.recommended,
  {
    files: ['**/*.js', '**/*.mjs', '**/*.ts', '**/*.tsx'],
    plugins: {
      '@stylistic': stylistic,
      '@typescript-eslint': tseslint.plugin,
    },
    languageOptions: {
      globals: {
        ...globals.browser,
        ...globals.node,
      },
      parser: tseslint.parser,
      ecmaVersion: 'latest',
      sourceType: 'module',
    },
    rules: {
      '@stylistic/indent': ['error', 2],
      '@stylistic/no-tabs': 'error',
      '@stylistic/no-trailing-spaces': 'error',
      '@stylistic/quotes': ['error', 'single'],
      '@stylistic/semi': ['error', 'always'],
      '@typescript-eslint/no-unused-vars': ['warn', {
        argsIgnorePattern: '^_',
        varsIgnorePattern: '^_',
        caughtErrorsIgnorePattern: '^_',
      }],
      '@typescript-eslint/consistent-type-imports': ['error', {
        fixStyle: 'separate-type-imports',
        prefer: 'type-imports',
      }],
      '@typescript-eslint/no-import-type-side-effects': 'error',
      'no-unused-vars': 'off',
      'no-useless-assignment': 'off',
    },
  },
);
