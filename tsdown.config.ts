import { defineConfig } from 'tsdown'

export default defineConfig({
  entry: {
    rewry: './src/main.ts',
  },
  format: ['esm', 'cjs'],
  platform: 'browser',
  outDir: 'dist',
  dts: {
    build: true,
  },
  deps: {
    onlyBundle: [],
    neverBundle: ['idb'],
  },
  sourcemap: true,
  minify: true,
  clean: true,
  globalName: 'rewry',
})
