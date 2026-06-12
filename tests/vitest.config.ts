import { defineConfig } from 'vitest/config';
import { resolve } from 'path';

export default defineConfig({
  test: {
    environment: 'node',
    globals: true,
    include: ['tests/**/*.test.ts', 'tests/**/*.test.tsx'],
    setupFiles: [resolve(__dirname, './setup.ts')],
    coverage: {
      thresholds: {
        functions: 85,
        branches: 85,
        lines: 85,
        statements: 85,
      },
    },
  },
});