const template = document.createElement('template');
template.innerHTML = `
  <style>
    :host {
      display: inline-block;
      --al-btn-bg: var(--al-primary, #3b82f6);
      --al-btn-color: #fff;
      --al-btn-border: transparent;
      --al-btn-padding-y: 0.625rem;
      --al-btn-padding-x: 1.25rem;
      --al-btn-font-size: 0.875rem;
      --al-btn-radius: var(--al-radius, 0.5rem);
      --al-btn-height: 2.5rem;
    }

    :host([variant="secondary"]) {
      --al-btn-bg: transparent;
      --al-btn-color: var(--al-primary, #3b82f6);
      --al-btn-border: var(--al-primary, #3b82f6);
    }

    :host([variant="ghost"]) {
      --al-btn-bg: transparent;
      --al-btn-color: var(--al-text, #334155);
      --al-btn-border: transparent;
    }

    :host([variant="danger"]) {
      --al-btn-bg: var(--al-danger, #ef4444);
      --al-btn-color: #fff;
    }

    :host([size="sm"]) {
      --al-btn-padding-y: 0.375rem;
      --al-btn-padding-x: 0.875rem;
      --al-btn-font-size: 0.75rem;
      --al-btn-height: 2rem;
    }

    :host([size="lg"]) {
      --al-btn-padding-y: 0.875rem;
      --al-btn-padding-x: 1.75rem;
      --al-btn-font-size: 1rem;
      --al-btn-height: 3rem;
    }

    :host([full-width]) {
      display: block;
      width: 100%;
    }

    button {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      gap: 0.5rem;
      width: var(--al-btn-width, 100%);
      height: var(--al-btn-height);
      padding: var(--al-btn-padding-y) var(--al-btn-padding-x);
      font-size: var(--al-btn-font-size);
      font-weight: 600;
      font-family: inherit;
      color: var(--al-btn-color);
      background: var(--al-btn-bg);
      border: 1px solid var(--al-btn-border);
      border-radius: var(--al-btn-radius);
      cursor: pointer;
      transition: all 0.2s ease;
      outline: none;
    }

    :host(:not([variant="secondary"])) button:hover {
      filter: brightness(1.1);
    }

    :host([variant="secondary"]) button:hover {
      background: var(--al-primary, #3b82f6);
      color: #fff;
    }

    :host([variant="ghost"]) button:hover {
      background: var(--al-surface-hover, #f1f5f9);
    }

    button:focus-visible {
      box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.4);
    }

    button:disabled,
    :host([disabled]) button,
    :host([loading]) button {
      opacity: 0.6;
      cursor: not-allowed;
    }

    .spinner {
      width: 1em;
      height: 1em;
      border: 2px solid currentColor;
      border-right-color: transparent;
      border-radius: 50%;
      animation: spin 0.6s linear infinite;
    }

    @keyframes spin {
      to { transform: rotate(360deg); }
    }

    .hidden {
      display: none;
    }
  </style>
  <button part="button" aria-live="polite">
    <slot></slot>
    
    <span class="spinner hidden" aria-hidden="true"></span>
  </button>
`;

export class AlButton extends HTMLElement {
  static get observedAttributes() {
    return ['variant', 'size', 'disabled', 'loading', 'full-width'];
  }

  constructor() {
    super();
    const shadow = this.attachShadow({ mode: 'open' });
    shadow.appendChild(template.content.cloneNode(true));
  }

  get variant(): string {
    return this.getAttribute('variant') || 'primary';
  }

  set variant(value: string) {
    if (value) {
      this.setAttribute('variant', value);
    } else {
      this.removeAttribute('variant');
    }
  }

  get size(): string {
    return this.getAttribute('size') || 'md';
  }

  set size(value: string) {
    if (value) {
      this.setAttribute('size', value);
    } else {
      this.removeAttribute('size');
    }
  }

  get disabled(): boolean {
    return this.hasAttribute('disabled');
  }

  set disabled(value: boolean) {
    if (value) {
      this.setAttribute('disabled', '');
    } else {
      this.removeAttribute('disabled');
    }
  }

  get loading(): boolean {
    return this.hasAttribute('loading');
  }

  set loading(value: boolean) {
    if (value) {
      this.setAttribute('loading', '');
    } else {
      this.removeAttribute('loading');
    }
  }

  get fullWidth(): boolean {
    return this.hasAttribute('full-width');
  }

  set fullWidth(value: boolean) {
    if (value) {
      this.setAttribute('full-width', '');
    } else {
      this.removeAttribute('full-width');
    }
  }

  connectedCallback() {
    this.render();
  }

  attributeChangedCallback() {
    this.render();
  }

  private render() {
    const button = this.shadowRoot!.querySelector('button');
    const spinner = this.shadowRoot!.querySelector('.spinner');
    button!.disabled = this.disabled || this.loading;
    button!.setAttribute('aria-busy', String(this.loading));
    if (this.loading) {
      spinner!.classList.remove('hidden');
    } else {
      spinner!.classList.add('hidden');
    }
  }
}

customElements.define('al-button', AlButton);
