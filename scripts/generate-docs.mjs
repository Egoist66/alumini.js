import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const projectRoot = path.resolve(__dirname, '..');
const componentsDir = path.join(projectRoot, 'src/components');
const outDir = path.resolve(projectRoot, 'demo/src/lib');

function findDemoFiles(dir) {
  const results = [];

  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      results.push(...findDemoFiles(fullPath));
    } else if (entry.name === 'demo.mjs' || entry.name === 'demo.js') {
      results.push(fullPath);
    }
  }

  return results;
}

function formatPropertiesTable(properties, labelColumn = 'Property') {
  const rows = properties
    .map(
      (prop) =>
        `| \`${prop.name}\` | ${prop.type} | \`${prop.default}\` | ${prop.description} |`,
    )
    .join('\n');

  return `| ${labelColumn} | Type | Default | Description |
|----------|------|---------|-------------|
${rows}`;
}

function formatDemoSection(demo) {
  const sections = [`## ${demo.name}`, '', demo.description, ''];

  if (demo.properties?.length) {
    sections.push('### Properties', '', formatPropertiesTable(demo.properties), '');
  }

  if (demo.propertyGroups?.length) {
    for (const group of demo.propertyGroups) {
      const heading = group.title ?? group.labelColumn ?? 'Properties';
      sections.push(
        `### ${heading}`,
        '',
        formatPropertiesTable(group.properties, group.labelColumn ?? 'Property'),
        '',
      );
    }
  }

  const usageExample = demo.examples.find((example) => example.code)?.code;
  if (usageExample) {
    sections.push('### Usage', '', '```html', usageExample.trim(), '```', '');
  }

  return sections.join('\n');
}

async function loadDemos() {
  const demoFiles = findDemoFiles(componentsDir);
  const demos = [];

  for (const file of demoFiles) {
    const module = await import(pathToFileUrl(file));
    demos.push(module.default);
  }

  return demos.sort((a, b) => a.name.localeCompare(b.name));
}

function pathToFileUrl(filePath) {
  return new URL(`file:///${filePath.replace(/\\/g, '/')}`).href;
}

const demos = await loadDemos();
const content = `# Alumini Components

${demos.map(formatDemoSection).join('\n---\n\n')}
`;

if (!fs.existsSync(outDir)) {
  fs.mkdirSync(outDir, { recursive: true });
}

fs.writeFileSync(path.join(outDir, 'COMPONENTS.md'), content);
console.log(`Generated COMPONENTS.md (${demos.length} components)`);
