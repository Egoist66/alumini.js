import { spawn, spawnSync } from 'node:child_process';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { defineConfig, type Plugin, type ViteDevServer } from 'vite';

const __dirname = dirname(fileURLToPath(import.meta.url));
const projectRoot = __dirname;
const libPath = resolve(projectRoot, 'demo/src/lib/alumini.js');
const srcEntry = resolve(projectRoot, 'src/index.ts');
const componentsDir = resolve(projectRoot, 'src');
const demoSrcDir = resolve(projectRoot, 'demo/src');
const demoIndex = resolve(projectRoot, 'demo/index.html');
const libOutDir = resolve(projectRoot, 'demo/src/lib');
const distOutDir = resolve(projectRoot, 'demo/dist');

const ignoredWatchPaths = [libOutDir, distOutDir].map((dir) =>
  dir.replace(/\\/g, '/'),
);

function isIgnoredWatchPath(file: string): boolean {
  const normalized = file.replace(/\\/g, '/');
  return ignoredWatchPaths.some((ignored) => normalized.startsWith(`${ignored}/`) || normalized === ignored);
}

function syncComponentsPlugin(): Plugin {
  const runSync = () => {
    spawnSync('node scripts/sync-components.mjs', {
      cwd: projectRoot,
      stdio: 'inherit',
      shell: true,
    });
  };

  return {
    name: 'sync-components',
    buildStart() {
      runSync();
    },
    configureServer(server) {
      runSync();

      const onComponentTreeChange = (file: string) => {
        const normalized = file.replace(/\\/g, '/');
        const componentsRoot = `${componentsDir.replace(/\\/g, '/')}/components/`;
        if (!normalized.startsWith(componentsRoot)) {
          return;
        }

        runSync();
        server.ws.send({ type: 'full-reload' });
      };

      server.watcher.on('add', onComponentTreeChange);
      server.watcher.on('unlink', onComponentTreeChange);
    },
  };
}

function watchDistRebuildPlugin(): Plugin {
  let server: ViteDevServer | undefined;
  let debounceTimer: ReturnType<typeof setTimeout> | undefined;
  let building = false;
  let queued = false;
  let ignoreUntil = 0;

  const runStep = (command: string) =>
    new Promise<number>((resolveExit) => {
      const child = spawn(command, {
        cwd: projectRoot,
        shell: true,
        stdio: 'inherit',
      });
      child.on('close', (code) => resolveExit(code ?? 1));
    });

  const runRebuild = async () => {
    if (building) {
      queued = true;
      return;
    }

    building = true;
    console.log('\n[dev] rebuilding demo/dist...\n');

    const demoCode = await runStep('yarn build:demo');
    if (demoCode !== 0) {
      console.error('[dev] build:demo failed');
      building = false;
      return;
    }

    console.log('\n[dev] demo/dist updated\n');
    server?.ws.send({ type: 'full-reload' });
    ignoreUntil = Date.now() + 1500;
    building = false;

    if (queued) {
      queued = false;
      void runRebuild();
    }
  };

  const scheduleRebuild = () => {
    clearTimeout(debounceTimer);
    debounceTimer = setTimeout(() => {
      void runRebuild();
    }, 300);
  };

  const attachWatcher = () => {
    if (!server) return;

    server.watcher.add([componentsDir, demoSrcDir, demoIndex]);

    const onSourceChange = (file: string) => {
      if (building || Date.now() < ignoreUntil) return;
      if (isIgnoredWatchPath(file)) return;

      const normalized = file.replace(/\\/g, '/');
      const componentsRoot = componentsDir.replace(/\\/g, '/');
      const demoRoot = demoSrcDir.replace(/\\/g, '/');
      if (
        normalized.startsWith(`${componentsRoot}/`) ||
        normalized.startsWith(`${demoRoot}/`) ||
        normalized === demoIndex.replace(/\\/g, '/')
      ) {
        scheduleRebuild();
      }
    };

    server.watcher.on('change', onSourceChange);
    server.watcher.on('add', onSourceChange);
    server.watcher.on('unlink', onSourceChange);
  };

  return {
    name: 'watch-dist-rebuild',
    configureServer(devServer) {
      server = devServer;
      attachWatcher();
      scheduleRebuild();
    },
  };
}

export default defineConfig(({ command }) => ({
  root: 'demo',
  server: {
    fs: {
      allow: [projectRoot],
    },
    watch: {
      ignored: ['**/dist/**', '**/src/lib/**'],
    },
  },
  resolve: {
    alias: {
      [libPath]: srcEntry,
    },
  },
  plugins: [
    syncComponentsPlugin(),
    ...(command === 'serve' ? [watchDistRebuildPlugin()] : []),
  ],
  build: {
    outDir: 'dist',
    emptyOutDir: true,
  },
}));
