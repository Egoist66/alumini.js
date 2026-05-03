import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const outDir = path.resolve(__dirname, '../demo/src/lib');

const content = `# Alumini Components

## AlButton

A versatile button component with multiple variants and states.

### Properties

| Property     | Type    | Default   | Description               |
|--------------|---------|-----------|---------------------------|
| \`variant\`    | string  | \`primary\` | Button style variant      |
| \`size\`       | string  | \`md\`      | Button size               |
| \`disabled\`   | boolean | \`false\`   | Disables interaction      |
| \`loading\`    | boolean | \`false\`   | Shows loading spinner     |
| \`full-width\` | boolean | \`false\`   | Stretches to full width   |

### Usage

\`\`\`html
<al-button variant="primary" size="md">Click me</al-button>
<al-button variant="danger" loading>Loading</al-button>
\`\`\`

---

## AlAccordion

Expandable content sections with smooth animations.

### Properties

| Property  | Type    | Default | Description                  |
|-----------|---------|---------|------------------------------|
| \`multiple\`| boolean | \`false\` | Allow multiple open items    |

---

## AlAccordionItem

Individual sections inside AlAccordion.

### Properties

| Property | Type    | Default | Description          |
|----------|---------|---------|----------------------|
| \`title\`  | string  | \`""\`    | Header text          |
| \`open\`   | boolean | \`false\` | Starts expanded      |

### Usage

\`\`\`html
<al-accordion multiple>
  <al-accordion-item title="Section 1" open>
    <p>Content here</p>
  </al-accordion-item>
  <al-accordion-item title="Section 2">
    <p>Content here</p>
  </al-accordion-item>
</al-accordion>
\`\`\`
`;

if (!fs.existsSync(outDir)) {
  fs.mkdirSync(outDir, { recursive: true });
}

fs.writeFileSync(path.join(outDir, 'COMPONENTS.md'), content);
console.log('Generated COMPONENTS.md');
