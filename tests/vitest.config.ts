import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    environment: 'node',
    globals: true,
    include: ['tests/**/*.test.ts', 'tests/**/*.test.tsx'],
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