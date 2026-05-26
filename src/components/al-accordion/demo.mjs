/** @type {import('../../../demo/types.js').ComponentDemo} */
export default {
  id: 'al-accordion',
  tag: 'al-accordion',
  name: 'AlAccordion',
  description: 'Expandable content sections with smooth animations.',
  icon: `<svg class="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="3" width="18" height="4" rx="1" /><rect x="3" y="10" width="18" height="4" rx="1" /><rect x="3" y="17" width="18" height="4" rx="1" /></svg>`,
  playground: {
    tag: 'al-accordion',
    previewClass: 'playground-stage column',
    innerHTML: `
      <al-accordion-item title="What is Alumini?">
        <p style="padding: 0.5rem 0; color: var(--al-text-muted, #64748b);">
          Alumini is a lightweight web component library built with TypeScript and Shadow DOM.
        </p>
      </al-accordion-item>
      <al-accordion-item title="How to install?">
        <p style="padding: 0.5rem 0; color: var(--al-text-muted, #64748b);">
          Include the built script in your HTML and use custom elements like native tags.
        </p>
      </al-accordion-item>
      <al-accordion-item title="Can I customize styles?">
        <p style="padding: 0.5rem 0; color: var(--al-text-muted, #64748b);">
          Theme components with CSS custom properties like --al-primary and --al-radius.
        </p>
      </al-accordion-item>
    `,
    controls: [
      { name: 'multiple', type: 'boolean', default: false, description: 'Allow multiple open items' },
    ],
    events: ['al_toggle'],
  },
  examples: [
    {
      title: 'Accordion',
      description: 'Expandable content sections with smooth animations.',
      previewClass: 'card-preview column',
      preview: `
        <al-accordion style="width: 100%">
          <al-accordion-item title="What is Alumini?">
            <p style="padding: 0.5rem 0; color: var(--al-text-muted, #64748b);">
              Alumini is a lightweight web component library built with
              TypeScript and Shadow DOM for encapsulation.
            </p>
          </al-accordion-item>
          <al-accordion-item title="How to install?">
            <p style="padding: 0.5rem 0; color: var(--al-text-muted, #64748b);">
              Simply include the built script in your HTML and use the
              custom elements like any native HTML tag.
            </p>
          </al-accordion-item>
          <al-accordion-item title="Can I customize styles?">
            <p style="padding: 0.5rem 0; color: var(--al-text-muted, #64748b);">
              Yes! Use CSS custom properties like --al-primary,
              --al-radius, --al-border to theme the components.
            </p>
          </al-accordion-item>
        </al-accordion>
      `,
      code: `<al-accordion>
  <al-accordion-item title="Section 1">
    <!-- content here -->
  </al-accordion-item>
  <al-accordion-item title="Section 2" open>
    <!-- content here -->
  </al-accordion-item>
</al-accordion>`,
    },
    {
      title: 'Multiple Open',
      description: 'Allow multiple accordion items to be open simultaneously.',
      previewClass: 'card-preview column',
      preview: `
        <al-accordion multiple style="width: 100%">
          <al-accordion-item title="Item One" open>
            <p style="padding: 0.5rem 0; color: var(--al-text-muted, #64748b);">
              This item starts open.
            </p>
          </al-accordion-item>
          <al-accordion-item title="Item Two">
            <p style="padding: 0.5rem 0; color: var(--al-text-muted, #64748b);">
              You can open multiple items at once.
            </p>
          </al-accordion-item>
          <al-accordion-item title="Item Three">
            <p style="padding: 0.5rem 0; color: var(--al-text-muted, #64748b);">
              Click to expand and collapse independently.
            </p>
          </al-accordion-item>
        </al-accordion>
      `,
      code: `<al-accordion multiple>
  <al-accordion-item title="Item 1" open>...</al-accordion-item>
  <al-accordion-item title="Item 2">...</al-accordion-item>
</al-accordion>`,
    },
  ],
  propertyGroups: [
    {
      properties: [
        { name: 'multiple', type: 'boolean', default: 'false', description: 'Allow multiple items open' },
      ],
    },
    {
      labelColumn: 'Item Property',
      properties: [
        { name: 'title', type: 'string', default: '""', description: 'Header text' },
        { name: 'open', type: 'boolean', default: 'false', description: 'Starts expanded' },
      ],
    },
  ],
};
