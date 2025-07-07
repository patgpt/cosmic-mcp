import parser from '@typescript-eslint/parser';

export default [
  {
    ignores: [
      'dist/',
      'node_modules/',
      '**/*.d.ts',
      '**/.bun/',
      '**/~/',
      'coverage/',
      '.coverage/',
      'bun.lock',
      '*.config.js',
      '*.config.mjs',
      '.env*',
      '.git/',
      'LICENSE',
      'README.md',
      '*.md',
      'docs/.vitepress/cache/',
      'docs/.vitepress/dist/',
      'integration-test.js',
    ],
  },
  {
    files: ['**/*.{js,mjs}'],
    languageOptions: {
      ecmaVersion: 2022,
      sourceType: 'module',
    },
    rules: {
      'no-unused-vars': 'warn',
      'no-console': 'off',
      'prefer-const': 'error',
      'no-var': 'error',
    },
  },
  {
    files: ['**/*.ts'],
    languageOptions: {
      parser: parser,
      ecmaVersion: 2022,
      sourceType: 'module',
    },
    rules: {
      'no-unused-vars': 'off', // TypeScript handles this
      'no-console': 'off',
      'prefer-const': 'error',
      'no-var': 'error',
    },
  },
];
