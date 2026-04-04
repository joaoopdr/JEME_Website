import { defineConfig } from 'vitest/config';
import path from 'path';

export default defineConfig({
  test: {
    globals: true,
    // 'node' environment is enough for pure logic/config tests.
    // Switch to 'jsdom' if DOM-dependent component tests are added later.
    environment: 'node',
  },
  resolve: {
    alias: {
      // Mirror the '@/*' path alias from tsconfig.json so imports work.
      '@': path.resolve(__dirname, './src'),
    },
  },
});
