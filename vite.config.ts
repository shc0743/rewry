import { defineConfig } from 'vite'
import { fileURLToPath } from 'node:url';
import dts from 'vite-plugin-dts'

export default defineConfig({
  plugins: [
    dts({
      insertTypesEntry: false,
      copyDtsFiles: true,
      rollupTypes: true,
      tsconfigPath: "tsconfig.app.json",
    }),
  ],
  build: {
    lib: {
      entry: './src/main.ts',
      formats: ['es', 'umd'],
      name: 'rewry',
      fileName(format, entryName) {
        return entryName + ({
          'es': '.js',
          'cjs': '.cjs',
          'umd': '.umd.js',
        })[format];
      },
    },
    outDir: 'dist',
    sourcemap: true,
    minify: true,
    emptyOutDir: true,
    rolldownOptions: {
      input: {
        rewry: fileURLToPath(new URL('./src/main.ts', import.meta.url))
      }
    }
  },
  resolve: {
    tsconfigPaths: true,
  },
})
