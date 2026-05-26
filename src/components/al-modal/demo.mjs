/** @type {import('../../../demo/types.js').ComponentDemo} */
export default {
  id: 'al-modal',
  tag: 'al-modal',
  name: 'AlModal',
  description:
    'Accessible dialog overlay with backdrop blur, focus trap, keyboard support, and flexible header, body, and footer slots.',
  icon: `<svg class="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="5" width="18" height="14" rx="2"/><path d="M7 9h10M7 13h6"/></svg>`,
  playground: {
    tag: 'al-modal',
    contained: true,
    shellClass: 'playground-modal-shell',
    previewClass: 'story-stage story-stage-modal',
    trigger: {
      openLabel: 'Open modal',
      closeLabel: 'Close modal',
    },
    innerHTML: `
  <span slot="title">Playground modal</span>
  <p style="margin: 0;">Use the canvas button to open the dialog. Controls below only change size and dismiss behavior.</p>
  <div slot="footer" style="display: flex; gap: 0.5rem; justify-content: flex-end; width: 100%;">
    <al-button variant="ghost" onclick="this.closest('al-modal').hide()">Cancel</al-button>
    <al-button onclick="this.closest('al-modal').hide()">Confirm</al-button>
  </div>`,
    controls: [
      {
        name: 'size',
        type: 'select',
        options: ['sm', 'md', 'lg', 'xl', 'full'],
        default: 'md',
      },
      {
        name: 'closable',
        type: 'boolean',
        default: true,
        defaultTrue: true,
        description: 'Show close button and allow Escape',
      },
      {
        name: 'backdrop-dismiss',
        type: 'boolean',
        default: true,
        defaultTrue: true,
        description: 'Close when clicking the backdrop',
      },
    ],
    events: ['al_open', 'al_close'],
  },
  examples: [
    {
      title: 'Basic dialog',
      description: 'Open a modal with a title, body content, and action buttons.',
      previewClass: 'docs-preview docs-preview-modal',
      preview: `
        <al-button onclick="this.nextElementSibling.show()">Open modal</al-button>
        <al-modal>
          <span slot="title">Welcome back</span>
          <p style="margin: 0;">Sign in to continue to your dashboard and manage your projects.</p>
          <div slot="footer" style="display: flex; gap: 0.5rem; justify-content: flex-end; width: 100%;">
            <al-button variant="ghost" onclick="this.closest('al-modal').hide()">Cancel</al-button>
            <al-button onclick="this.closest('al-modal').hide()">Continue</al-button>
          </div>
        </al-modal>
      `,
      code: `<al-button onclick="document.querySelector('#demo-modal').show()">Open modal</al-button>

<al-modal id="demo-modal">
  <span slot="title">Welcome back</span>
  <p>Sign in to continue to your dashboard and manage your projects.</p>
  <div slot="footer">
    <al-button variant="ghost" onclick="document.querySelector('#demo-modal').hide()">Cancel</al-button>
    <al-button onclick="document.querySelector('#demo-modal').hide()">Continue</al-button>
  </div>
</al-modal>`,
    },
    {
      title: 'Sizes',
      description: 'Small, large, and full-screen modal layouts.',
      previewClass: 'docs-preview docs-preview-modal',
      preview: `
        <div style="display: flex; flex-wrap: wrap; gap: 0.5rem;">
          <al-button size="sm" onclick="this.parentElement.nextElementSibling.setAttribute('size','sm'); this.parentElement.nextElementSibling.show();">Small</al-button>
          <al-button size="sm" variant="secondary" onclick="this.parentElement.nextElementSibling.setAttribute('size','lg'); this.parentElement.nextElementSibling.show();">Large</al-button>
          <al-button size="sm" variant="ghost" onclick="this.parentElement.nextElementSibling.setAttribute('size','full'); this.parentElement.nextElementSibling.show();">Full</al-button>
        </div>
        <al-modal>
          <span slot="title">Responsive modal</span>
          <p style="margin: 0;">Resize the preview or switch sizes to see how the dialog adapts on mobile and desktop.</p>
          <div slot="footer" style="display: flex; justify-content: flex-end; width: 100%;">
            <al-button onclick="this.closest('al-modal').hide()">Done</al-button>
          </div>
        </al-modal>
      `,
      code: `<al-modal size="sm" open>
  <span slot="title">Compact</span>
  <p>Ideal for quick confirmations.</p>
</al-modal>

<al-modal size="lg" open>
  <span slot="title">Detailed view</span>
  <p>More room for forms and rich content.</p>
</al-modal>

<al-modal size="full" open>
  <span slot="title">Full screen</span>
  <p>Best for immersive workflows.</p>
</al-modal>`,
    },
    {
      title: 'Confirmation',
      description: 'Destructive action pattern with a focused message and primary danger button.',
      previewClass: 'docs-preview docs-preview-modal',
      preview: `
        <al-button variant="danger" onclick="this.nextElementSibling.show()">Delete project</al-button>
        <al-modal size="sm">
          <span slot="title">Delete project?</span>
          <p style="margin: 0;">This action permanently removes the project and cannot be undone.</p>
          <div slot="footer" style="display: flex; gap: 0.5rem; justify-content: flex-end; width: 100%;">
            <al-button variant="ghost" onclick="this.closest('al-modal').hide()">Keep project</al-button>
            <al-button variant="danger" onclick="this.closest('al-modal').hide()">Delete</al-button>
          </div>
        </al-modal>
      `,
      code: `<al-modal size="sm" id="confirm-delete">
  <span slot="title">Delete project?</span>
  <p>This action permanently removes the project and cannot be undone.</p>
  <div slot="footer">
    <al-button variant="ghost" onclick="document.querySelector('#confirm-delete').hide()">
      Keep project
    </al-button>
    <al-button variant="danger" onclick="document.querySelector('#confirm-delete').hide()">
      Delete
    </al-button>
  </div>
</al-modal>`,
    },
  ],
  properties: [
    { name: 'open', type: 'boolean', default: 'false', description: 'Whether the modal is visible' },
    { name: 'contained', type: 'boolean', default: 'false', description: 'Keep overlay inside the parent container instead of the viewport' },
    { name: 'size', type: 'string', default: 'md', description: 'Dialog width: sm, md, lg, xl, or full' },
    { name: 'closable', type: 'boolean', default: 'true', description: 'Show close button and allow Escape to dismiss' },
    {
      name: 'backdrop-dismiss',
      type: 'boolean',
      default: 'true',
      description: 'Close the modal when clicking the backdrop',
    },
  ],
};
