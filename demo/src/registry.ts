import type { ComponentDemo } from '../types';

function componentNameFromTag(tag: string): string {
  return tag
    .split('-')
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join('');
}

function inferDemoFromId(id: string): ComponentDemo {
  const tag = id;
  const preview = `<${tag}></${tag}>`;

  return {
    id,
    tag,
    name: componentNameFromTag(tag),
    description: 'Work in progress — customize this demo.',
    icon: `<svg class="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="4" y="4" width="16" height="16" rx="2"/></svg>`,
    playground: {
      tag,
      controls: [],
      events: [],
    },
    examples: [
      {
        title: 'Default',
        description: 'Starter example — customize in demo.mjs or demo.js.',
        preview,
        code: preview,
      },
    ],
    properties: [],
  };
}

function inferDemoFromPath(modulePath: string): ComponentDemo {
  const match = modulePath.match(/components\/([^/]+)\/(?:demo\.(?:mjs|js)|index\.ts)$/);
  const id = match?.[1] ?? 'unknown';
  return inferDemoFromId(id);
}

function normalizeDemo(modulePath: string, module: { default?: ComponentDemo }): ComponentDemo {
  const demo = module.default;
  if (demo?.id && demo?.tag && demo?.name && Array.isArray(demo.examples)) {
    return demo;
  }

  return inferDemoFromPath(modulePath);
}

const demoModules = {
  ...import.meta.glob('../../src/components/**/demo.mjs', { eager: true }),
  ...import.meta.glob('../../src/components/**/demo.js', { eager: true }),
} as Record<string, { default?: ComponentDemo }>;

const indexModules = import.meta.glob('../../src/components/*/index.ts', {
  eager: true,
});

const demosById = new Map<string, ComponentDemo>();

for (const [modulePath, module] of Object.entries(demoModules)) {
  const demo = normalizeDemo(modulePath, module);
  demosById.set(demo.id, demo);
}

for (const modulePath of Object.keys(indexModules)) {
  const demo = inferDemoFromPath(modulePath);
  if (!demosById.has(demo.id)) {
    demosById.set(demo.id, demo);
  }
}

export const componentDemos: ComponentDemo[] = [...demosById.values()].sort((a, b) =>
  a.name.localeCompare(b.name),
);
