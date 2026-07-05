/// <reference types="vitest/config" />

import { readFileSync } from 'node:fs';
import { defineConfig } from 'vite';
import react, { reactCompilerPreset } from '@vitejs/plugin-react';
import babel from '@rolldown/plugin-babel';

const packageJson = JSON.parse(
  readFileSync(new URL('./package.json', import.meta.url), 'utf-8'),
) as { version?: string };

// https://vite.dev/config/
export default defineConfig({
  define: {
    __APP_VERSION__: JSON.stringify(packageJson.version ?? '0.0.0'),
  },
  plugins: [
    react(),
    babel({ presets: [reactCompilerPreset()] }),
  ],
  test: {
    environment: 'jsdom',
    globals: false,
    setupFiles: './src/test/setup.ts',
    css: true,
  },
});
