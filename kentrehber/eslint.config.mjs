import js from '@eslint/js';
import ts from 'typescript-eslint';
import { FlatCompat } from '@eslint/eslintrc';
import { fileURLToPath } from 'node:url';
const compat = new FlatCompat({ baseDirectory: fileURLToPath(new URL('.', import.meta.url)) });
const config = [
  {
    ignores: [
      '**/node_modules/**',
      '.pnpm/**',
      '**/.next/**',
      '**/next-env.d.ts',
      '**/generated/**',
    ],
  },
  js.configs.recommended,
  ...ts.configs.recommended,
  ...compat.extends('next/core-web-vitals'),
  {
    settings: { next: { rootDir: fileURLToPath(new URL('apps/web/', import.meta.url)) } },
    rules: { '@typescript-eslint/no-unused-vars': ['error', { argsIgnorePattern: '^_' }] },
  },
];
export default config;

