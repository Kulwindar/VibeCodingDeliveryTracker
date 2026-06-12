import { defineConfig } from 'vitest/config';
import { resolve } from 'path';

export default defineConfig({
  test: {
    environment: 'node',
    globals: true,
    include: ['tests/**/*.test.ts', 'tests/**/*.test.tsx'],
    setupFiles: [resolve(__dirname, './tests/setup.ts')],
  },
  resolve: {
    alias: {
      '@': resolve(__dirname, 'apps/web/src'),
    },
  },
});