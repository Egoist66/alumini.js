const itemTemplate = document.createElement('template');
itemTemplate.innerHTML = `
  <style>
    :host {
      display: block;
      border-bottom: 1px solid var(--al-border, #e2e8f0);
    }

    :host(:first-child) {
      border-top: 1px solid var(--al-border, #e2e8f0);
    }

    .header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      width: 100%;
      padding: 1rem 1.25rem;
      font-size: 1rem;
      font-weight: 600;
      font-family: inherit;
      color: var(--al-text, #1e293b);
      background: transparent;
      border: none;
      cursor: pointer;
      transition: color 0.2s ease;
      outline: none;
      text-align: left;
    }

    .header:hover {
      color: var(--al-primary, #3b82f6);
    }

    .header:focus-visible {
      color: var(--al-primary, #3b82f6);
      box-shadow: 0 0 0 2px rgba(59, 130, 246, 0.4);
      border-radius: var(--al-radius, 0.5rem);
    }

    .icon {
      width: 1.25rem;
      height: 1.25rem;
      transition: transform 0.3s ease;
      flex-shrink: 0;
    }

    :host([open]) .icon {
      transform: rotate(180deg);
    }

    .content {
      overflow: hidden;
      max-height: 0;
      opacity: 0;
      transition: max-height 0.3s ease, opacity 0.3s ease;
    }

    :host([open]) .content {
      max-height: 1000px;
      opacity: 1;
    }

    .inner {
      padding: 0 1.25rem 1rem;
      color: var(--al-text-muted, #64748b);
    }
  </style>
  <button class="header" part="header" aria-expanded="false">
    <span><slot name="title"></slot></span>
    <svg class="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
      <polyline points="6 9 12 15 18 9"></polyline>
    </svg>
  </button>
  <div class="content" role="region">
    <div class="inner">
      <slot></slot>
    </div>
  </div>
`;

export class AlAccordionItem extends HTMLElement {
  static get observedAttributes() {
    return ['title', 'open'];
  }

  private headerButton: HTMLButtonElement | null = null;

  constructor() {
    super();
    const shadow = this.attachShadow({ mode: 'open' });
    shadow.appendChild(itemTemplate.content.cloneNode(true));
  }

  connectedCallback() {
    this.headerButton = this.shadowRoot!.querySelector('.header');
    const titleSlot = this.shadowRoot!.querySelector('[name="title"]');
    if (titleSlot && titleSlot.parentElement) {
      const span = document.createElement('span');
      span.textContent = this.title;
      titleSlot.parentElement.appendChild(span);
    }
    if (this.headerButton) {
      this.headerButton.setAttribute('aria-expanded', String(this.open));
      this.headerButton.addEventListener('click', () => this.toggle());
    }
  }

  disconnectedCallback() {
    if (this.headerButton) {
      this.headerButton.removeEventListener('click', () => this.toggle());
    }
  }

  get title(): string {
    return this.getAttribute('title') || '';
  }

  set title(value: string) {
    if (value) {
      this.setAttribute('title', value);
    } else {
      this.removeAttribute('title');
    }
  }

  get open(): boolean {
    return this.hasAttribute('open');
  }

  set open(value: boolean) {
    if (value) {
      this.setAttribute('open', '');
    } else {
      this.removeAttribute('open');
    }
  }

  attributeChangedCallback(name: string) {
    if (name === 'title') {
      const titleSpan = this.shadowRoot!.querySelector('[name="title"] + span, [name="title"] ~ span');
      if (titleSpan) {
        titleSpan.textContent = this.title;
      }
    }
    if (name === 'open' && this.headerButton) {
      this.headerButton.setAttribute('aria-expanded', String(this.open));
    }
  }

  toggle() {
    const event = new CustomEvent('al_toggle', {
      bubbles: true,
      composed: true,
      detail: { open: !this.open }
    });
    this.dispatchEvent(event);
  }

  setOpen(open: boolean) {
    this.open = open;
  }
}

customElements.define('al-accordion-item', AlAccordionItem);
