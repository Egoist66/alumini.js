/** @type {import('../../../demo/types.js').ComponentDemo} */
export default {
  id: 'al-button',
  tag: 'al-button',
  name: 'AlButton',
  description: 'A versatile button component with multiple variants and states.',
  icon: `<svg class="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="8" width="18" height="8" rx="4" /></svg>`,
  playground: {
    tag: 'al-button',
    controls: [
      { name: 'label', label: 'Label', type: 'text', target: 'slot', default: 'Click me' },
      {
        name: 'variant',
        type: 'select',
        options: ['primary', 'secondary', 'ghost', 'danger'],
        default: 'primary',
      },
      { name: 'size', type: 'select', options: ['sm', 'md', 'lg'], default: 'md' },
      { name: 'disabled', type: 'boolean', default: false, description: 'Disable interaction' },
      { name: 'loading', type: 'boolean', default: false, description: 'Show loading spinner' },
      { name: 'full-width', type: 'boolean', default: false, description: 'Stretch to container width' },
    ],
    events: ['click'],
  },
  examples: [
    {
      title: 'Button',
      description: 'A versatile button component with multiple variants and states.',
      preview: `
        <al-button>Default</al-button>
        <al-button variant="secondary">Secondary</al-button>
        <al-button variant="ghost">Ghost</al-button>
        <al-button variant="danger">Danger</al-button>
      `,
      code: `<al-button>Default</al-button>
<al-button variant="secondary">Secondary</al-button>
<al-button variant="ghost">Ghost</al-button>
<al-button variant="danger">Danger</al-button>`,
    },
    {
      title: 'Sizes',
      description: 'Small, medium, and large button variants.',
      preview: `
        <al-button size="sm">Small</al-button>
        <al-button size="md">Medium</al-button>
        <al-button size="lg">Large</al-button>
      `,
      code: `<al-button size="sm">Small</al-button>
<al-button size="md">Medium</al-button>
<al-button size="lg">Large</al-button>`,
    },
    {
      title: 'States',
      description: 'Disabled and loading states.',
      preview: `
        <al-button disabled>Disabled</al-button>
        <al-button loading>Loading</al-button>
        <al-button full-width style="max-width: 300px">Full Width</al-button>
      `,
      code: `<al-button disabled>Disabled</al-button>
<al-button loading>Loading</al-button>
<al-button full-width>Full Width</al-button>`,
    },
  ],
  properties: [
    { name: 'variant', type: 'string', default: 'primary', description: 'Button color variant' },
    { name: 'size', type: 'string', default: 'md', description: 'Button size' },
    { name: 'disabled', type: 'boolean', default: 'false', description: 'Disables the button' },
    { name: 'loading', type: 'boolean', default: 'false', description: 'Shows a loading spinner' },
    { name: 'full-width', type: 'boolean', default: 'false', description: 'Stretches button to full width' },
  ],
};
