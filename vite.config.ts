import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';
import { defineConfig } from 'vite';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const singleLinePlugin = () => ({
  name: 'single-line',
  generateBundle(_options: any, bundle: any) {
    for (const file of Object.values(bundle)) {
      if ((file as any).type === 'chunk' && (file as any).fileName.endsWith('.js')) {
        (file as any).code = String((file as any).code)
          .replace(/\r\n/g, '\n')
          .split('\n')
          .map((line: string) => line.trim())
          .filter((line: string) => line.length > 0)
          .join(' ');
      }
    }
  },
});

export default defineConfig({
  build: {
    lib: {
      entry: resolve(__dirname, 'src/index.ts'),
      name: 'Alumini',
      fileName: 'alumini',
      formats: ['es'],
    },
    outDir: 'src/lib',
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
  root: 'demo',
  resolve: {
    alias: {
      '@': resolve(__dirname, 'src'),
    },
  },
  plugins: [singleLinePlugin()],
});
