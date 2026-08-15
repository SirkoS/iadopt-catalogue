import path from 'node:path';
import js from '@eslint/js';
import svelte from 'eslint-plugin-svelte';
import { defineConfig, includeIgnoreFile } from 'eslint/config';
import globals from 'globals';
import ts from 'typescript-eslint';

const gitignorePath = path.resolve(import.meta.dirname, '.gitignore');

const rules = {
  'svelte/indent': [
    'warn',
    {
      'indent': 2,
      'alignAttributesVertically': true
    }
  ],
  'indent': [
    'warn',
    2,
    {
      'VariableDeclarator': { 'var': 2, 'let': 2, 'const': 3 },
      'SwitchCase': 1,
      'MemberExpression': 1,
      'CallExpression': { 'arguments': 'first' },
      'ArrayExpression': 'first',
      'ObjectExpression': 'first',
      'ignoredNodes': ['ConditionalExpression']
    },
  ],
  'quotes': [
    'warn',
    'single'
  ],
  'semi': [
    'warn',
    'always'
  ],
  'no-console': [
    'warn',
    { allow: ['warn', 'error', 'log'] }
  ],
  'no-trailing-spaces': [
    'warn'
  ],
};

export default defineConfig(
  includeIgnoreFile(gitignorePath),
  js.configs.recommended,
  ts.configs.recommended,
  svelte.configs.recommended,
  {
    languageOptions: { globals: { ...globals.browser, ...globals.node } },
    rules: {
      // typescript-eslint strongly recommend that you do not use the no-undef lint rule on TypeScript projects.
      // see: https://typescript-eslint.io/troubleshooting/faqs/eslint/#i-get-errors-from-the-no-undef-rule-about-global-variables-not-being-defined-even-though-there-are-no-typescript-errors
      'no-undef': 'off',
      ...rules,
    }
  },
  {
    files: ['**/*.svelte', '**/*.svelte.ts', '**/*.svelte.js'],
    languageOptions: {
      parserOptions: {
        projectService: true,
        extraFileExtensions: ['.svelte'],
        parser: ts.parser
      }
    }
  },
  {
    // Override or add rule settings here, such as:
    // 'svelte/button-has-type': 'error'
    rules: rules
  },
);
