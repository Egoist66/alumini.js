import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';
import { defineConfig } from 'vite';

const __dirname = dirname(fileURLToPath(import.meta.url));

const singleLinePlugin = () => ({
  name: 'single-line',
  generateBundle(_options: unknown, bundle: Record<string, { type?: string; fileName?: string; code?: string }>) {
    for (const file of Object.values(bundle)) {
      if (file.type === 'chunk' && file.fileName?.endsWith('.js') && file.code) {
        file.code = file.code
          .replace(/\r\n/g, '\n')
          .split('\n')
          .map((line) => line.trim())
          .filter((line) => line.length > 0)
          .join(' ');
      }
    }
  },
});

export default defineConfig({
  root: 'demo',
  build: {
    lib: {
      entry: resolve(__dirname, 'src/index.ts'),
      name: 'Alumini',
      fileName: 'alumini',
      formats: ['es'],
    },
    outDir: 'src/lib',
    emptyOutDir: true,
    sourcemap: false,
    minify: 'terser',
    terserOptions: {
      compress: true,
      mangle: true,
      format: {
        comments: false,
      },
    },
    rollupOptions: {
      external: [],
      output: {
        globals: {},
      },
    },
  },
  plugins: [singleLinePlugin()],
});
