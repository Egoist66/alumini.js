const FOCUSABLE =
  'a[href], button:not([disabled]), textarea, input, select, [tabindex]:not([tabindex="-1"])';

const template = document.createElement('template');
template.innerHTML = `
  <style>
    :host {
      display: none;
      --al-modal-z: 1000;
      --al-modal-backdrop: rgba(15, 23, 42, 0.55);
      --al-modal-backdrop-blur: 6px;
      --al-modal-bg: var(--al-surface, #fff);
      --al-modal-text: var(--al-text, #0f172a);
      --al-modal-text-muted: var(--al-text-muted, #64748b);
      --al-modal-border: var(--al-border, #e2e8f0);
      --al-modal-radius: var(--al-radius, 0.75rem);
      --al-modal-shadow: 0 24px 48px -12px rgba(15, 23, 42, 0.25);
      --al-modal-width: 32rem;
      --al-modal-padding: 1.5rem;
      --al-modal-gap: 1rem;
    }

    :host([open]),
    :host([closing]) {
      display: block;
    }

    :host([contained]) {
      position: absolute;
      inset: 0;
      pointer-events: none;
    }

    :host([contained][open]),
    :host([contained][closing]) {
      pointer-events: auto;
    }

    .backdrop {
      position: fixed;
      inset: 0;
      z-index: var(--al-modal-z);
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 1.25rem;
      background: var(--al-modal-backdrop);
      backdrop-filter: blur(var(--al-modal-backdrop-blur));
      -webkit-backdrop-filter: blur(var(--al-modal-backdrop-blur));
      opacity: 0;
      transition: opacity 0.22s ease;
    }

    :host([open]) .backdrop {
      opacity: 1;
    }

    :host([closing]) .backdrop {
      opacity: 0;
    }

    :host([contained]) .backdrop {
      position: absolute;
      padding: 1rem;
    }

    .dialog {
      position: relative;
      display: flex;
      flex-direction: column;
      width: min(100%, var(--al-modal-width));
      max-height: min(88vh, 720px);
      background: var(--al-modal-bg);
      color: var(--al-modal-text);
      border: 1px solid var(--al-modal-border);
      border-radius: var(--al-modal-radius);
      box-shadow: var(--al-modal-shadow);
      font-family: inherit;
      outline: none;
      opacity: 0;
      transform: translateY(12px) scale(0.98);
      transition:
        opacity 0.24s cubic-bezier(0.22, 1, 0.36, 1),
        transform 0.24s cubic-bezier(0.22, 1, 0.36, 1);
    }

    :host([open]) .dialog {
      opacity: 1;
      transform: translateY(0) scale(1);
    }

    :host([closing]) .dialog {
      opacity: 0;
      transform: translateY(8px) scale(0.98);
    }

    :host([size="sm"]) {
      --al-modal-width: 24rem;
    }

    :host([size="lg"]) {
      --al-modal-width: 42rem;
    }

    :host([size="xl"]) {
      --al-modal-width: 56rem;
    }

    :host([size="full"]) .backdrop {
      padding: 0.75rem;
    }

    :host([size="full"]) .dialog {
      width: min(100%, calc(100vw - 1.5rem));
      max-height: calc(100vh - 1.5rem);
      height: calc(100vh - 1.5rem);
    }

    :host([contained]) .dialog {
      max-height: min(88%, 520px);
    }

    :host([contained][size="full"]) .backdrop {
      padding: 0;
    }

    :host([contained][size="full"]) .dialog {
      width: 100%;
      height: 100%;
      max-height: 100%;
    }

    .header {
      display: flex;
      align-items: flex-start;
      justify-content: space-between;
      gap: 0.75rem;
      padding: var(--al-modal-padding);
      padding-bottom: 0;
    }

    .header.hidden {
      display: none;
    }

    .title {
      flex: 1;
      min-width: 0;
      font-size: 1.125rem;
      font-weight: 650;
      line-height: 1.35;
      letter-spacing: -0.01em;
    }

    .title:empty {
      display: none;
    }

    .close {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      flex-shrink: 0;
      width: 2rem;
      height: 2rem;
      margin: -0.25rem -0.25rem 0 0;
      padding: 0;
      color: var(--al-modal-text-muted);
      background: transparent;
      border: none;
      border-radius: calc(var(--al-modal-radius) - 0.25rem);
      cursor: pointer;
      transition: color 0.15s ease, background 0.15s ease;
    }

    .close:hover {
      color: var(--al-modal-text);
      background: var(--al-surface-hover, rgba(148, 163, 184, 0.16));
    }

    .close:focus-visible {
      outline: none;
      box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.35);
    }

    .close.hidden {
      display: none;
    }

    .close svg {
      width: 1.125rem;
      height: 1.125rem;
    }

    .body {
      flex: 1;
      min-height: 0;
      overflow: auto;
      padding: var(--al-modal-padding);
      font-size: 0.9375rem;
      line-height: 1.6;
      color: var(--al-modal-text-muted);
    }

    .header:not(.hidden) + .body {
      padding-top: calc(var(--al-modal-gap) * 0.75);
    }

    .footer {
      display: flex;
      flex-wrap: wrap;
      align-items: center;
      justify-content: flex-end;
      gap: 0.625rem;
      padding: 0 var(--al-modal-padding) var(--al-modal-padding);
    }

    .footer:empty {
      display: none;
    }

    @media (max-width: 640px) {
      .backdrop {
        align-items: flex-end;
        padding: 0;
      }

      .dialog {
        width: 100%;
        max-height: 92vh;
        border-bottom-left-radius: 0;
        border-bottom-right-radius: 0;
        transform: translateY(100%);
      }

      :host([open]) .dialog {
        transform: translateY(0);
      }

      :host([closing]) .dialog {
        transform: translateY(100%);
      }

      :host([size="full"]) .dialog {
        height: 100vh;
        max-height: 100vh;
        border-radius: 0;
      }
    }

    @media (prefers-reduced-motion: reduce) {
      .backdrop,
      .dialog {
        transition: none;
      }
    }
  </style>

  <div class="backdrop" part="backdrop" tabindex="-1">
    <div
      class="dialog"
      part="dialog"
      role="dialog"
      aria-modal="true"
      tabindex="-1"
    >
      <header class="header" part="header">
        <div class="title" part="title">
          <slot name="title"></slot>
        </div>
        <button
          class="close"
          part="close"
          type="button"
          aria-label="Close dialog"
        >
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" aria-hidden="true">
            <line x1="18" y1="6" x2="6" y2="18"></line>
            <line x1="6" y1="6" x2="18" y2="18"></line>
          </svg>
        </button>
      </header>
      <div class="body" part="body">
        <slot></slot>
      </div>
      <footer class="footer" part="footer">
        <slot name="footer"></slot>
      </footer>
    </div>
  </div>
`;

type CloseReason = 'close-button' | 'backdrop' | 'escape' | 'programmatic';

let openModalCount = 0;

export class AlModal extends HTMLElement {
  static get observedAttributes() {
    return ['open', 'size', 'closable', 'backdrop-dismiss', 'contained'];
  }

  private previouslyFocused: HTMLElement | null = null;
  private closeTimer: ReturnType<typeof setTimeout> | null = null;
  private isActive = false;
  private boundKeydown = this.handleKeydown.bind(this);
  private boundBackdropClick = this.handleBackdropClick.bind(this);
  private boundCloseClick = this.handleCloseClick.bind(this);
  private boundSlotChange = this.updateUi.bind(this);

  constructor() {
    super();
    const shadow = this.attachShadow({ mode: 'open' });
    shadow.appendChild(template.content.cloneNode(true));
  }

  connectedCallback() {
    const root = this.shadowRoot!;
    root.querySelector('.close')!.addEventListener('click', this.boundCloseClick);
    root.querySelector('.backdrop')!.addEventListener('click', this.boundBackdropClick);
    root.querySelectorAll('slot').forEach((slot) => {
      slot.addEventListener('slotchange', this.boundSlotChange);
    });

    this.updateUi();
    if (this.open) {
      this.activate();
    }
  }

  disconnectedCallback() {
    const root = this.shadowRoot;
    root?.querySelector('.close')?.removeEventListener('click', this.boundCloseClick);
    root?.querySelector('.backdrop')?.removeEventListener('click', this.boundBackdropClick);
    root?.querySelectorAll('slot').forEach((slot) => {
      slot.removeEventListener('slotchange', this.boundSlotChange);
    });
    this.deactivate(true);
  }

  attributeChangedCallback(name: string, oldValue: string | null, newValue: string | null) {
    if (name === 'open') {
      if (newValue !== null && oldValue === null) {
        this.activate();
      } else if (newValue === null && oldValue !== null && !this.hasAttribute('closing')) {
        this.deactivate();
      }
      return;
    }

    this.updateUi();
  }

  get open(): boolean {
    return this.hasAttribute('open');
  }

  set open(value: boolean) {
    if (value) {
      this.show();
    } else {
      this.hide();
    }
  }

  get size(): string {
    return this.getAttribute('size') || 'md';
  }

  set size(value: string) {
    if (value && value !== 'md') {
      this.setAttribute('size', value);
    } else {
      this.removeAttribute('size');
    }
  }

  get closable(): boolean {
    return !this.hasAttribute('closable') || this.getAttribute('closable') !== 'false';
  }

  set closable(value: boolean) {
    if (value) {
      this.removeAttribute('closable');
    } else {
      this.setAttribute('closable', 'false');
    }
  }

  get backdropDismiss(): boolean {
    return !this.hasAttribute('backdrop-dismiss') || this.getAttribute('backdrop-dismiss') !== 'false';
  }

  set backdropDismiss(value: boolean) {
    if (value) {
      this.removeAttribute('backdrop-dismiss');
    } else {
      this.setAttribute('backdrop-dismiss', 'false');
    }
  }

  get contained(): boolean {
    return this.hasAttribute('contained');
  }

  set contained(value: boolean) {
    if (value) {
      this.setAttribute('contained', '');
    } else {
      this.removeAttribute('contained');
    }
  }

  show(): void {
    if (this.open) return;
    this.removeAttribute('closing');
    this.setAttribute('open', '');
  }

  hide(reason: CloseReason = 'programmatic'): void {
    if (!this.open || this.hasAttribute('closing')) return;

    this.setAttribute('closing', '');
    this.dispatchEvent(
      new CustomEvent('al_close', {
        bubbles: true,
        composed: true,
        detail: { reason },
      }),
    );

    if (this.closeTimer) {
      clearTimeout(this.closeTimer);
    }

    this.closeTimer = setTimeout(() => {
      this.closeTimer = null;
      if (!this.hasAttribute('closing')) return;
      this.removeAttribute('open');
      this.removeAttribute('closing');
      this.deactivate();
    }, 220);
  }

  private activate(): void {
    if (this.isActive) return;

    if (this.closeTimer) {
      clearTimeout(this.closeTimer);
      this.closeTimer = null;
      this.removeAttribute('closing');
    }

    this.isActive = true;
    this.previouslyFocused = document.activeElement as HTMLElement | null;
    this.updateUi();
    this.lockScroll(true);
    document.addEventListener('keydown', this.boundKeydown);

    requestAnimationFrame(() => {
      this.focusInitial();
    });

    this.dispatchEvent(
      new CustomEvent('al_open', {
        bubbles: true,
        composed: true,
      }),
    );
  }

  private deactivate(skipFocusRestore = false): void {
    if (!this.isActive) return;

    this.isActive = false;
    document.removeEventListener('keydown', this.boundKeydown);
    this.lockScroll(false);

    if (!skipFocusRestore && this.previouslyFocused?.focus) {
      this.previouslyFocused.focus();
    }

    this.previouslyFocused = null;
  }

  private updateUi(): void {
    const root = this.shadowRoot;
    if (!root) return;

    const dialog = root.querySelector('.dialog') as HTMLElement;
    const closeButton = root.querySelector('.close') as HTMLButtonElement;
    const header = root.querySelector('.header') as HTMLElement;
    const title = root.querySelector('.title') as HTMLElement;

    closeButton.classList.toggle('hidden', !this.closable);

    const hasTitle = this.hasAssignedNodes('title');
    header.classList.toggle('hidden', !hasTitle && !this.closable);
    title.toggleAttribute('hidden', !hasTitle);

    const titleId = hasTitle ? `${this.modalId}-title` : undefined;
    if (titleId) {
      title.id = titleId;
      dialog.setAttribute('aria-labelledby', titleId);
    } else {
      title.removeAttribute('id');
      dialog.removeAttribute('aria-labelledby');
    }
  }

  private get modalId(): string {
    if (!this.id) {
      this.id = `al-modal-${Math.random().toString(36).slice(2, 9)}`;
    }
    return this.id;
  }

  private hasAssignedNodes(slotName?: string): boolean {
    const selector = slotName ? `slot[name="${slotName}"]` : 'slot:not([name])';
    const slot = this.shadowRoot?.querySelector(selector) as HTMLSlotElement | null;
    if (!slot) return false;

    return slot.assignedNodes({ flatten: true }).some((node) => {
      if (node.nodeType === Node.TEXT_NODE) {
        return Boolean(node.textContent?.trim());
      }
      return node.nodeType === Node.ELEMENT_NODE;
    });
  }

  private handleCloseClick(): void {
    this.hide('close-button');
  }

  private handleBackdropClick(event: Event): void {
    if (!this.backdropDismiss) return;
    if (event.target !== event.currentTarget) return;
    this.hide('backdrop');
  }

  private handleKeydown(event: KeyboardEvent): void {
    if (!this.open) return;

    if (event.key === 'Escape' && this.closable) {
      event.preventDefault();
      this.hide('escape');
      return;
    }

    if (event.key === 'Tab') {
      this.trapFocus(event);
    }
  }

  private getFocusableElements(): HTMLElement[] {
    const dialog = this.shadowRoot?.querySelector('.dialog') as HTMLElement | null;
    if (!dialog) return [];

    const assigned = [
      ...this.querySelectorAll<HTMLElement>(FOCUSABLE),
      ...Array.from(dialog.querySelectorAll<HTMLElement>(FOCUSABLE)),
    ].filter((element) => !element.hasAttribute('disabled') && element.tabIndex !== -1);

    return assigned;
  }

  private focusInitial(): void {
    const focusable = this.getFocusableElements();
    if (focusable.length > 0) {
      focusable[0].focus();
      return;
    }

    const dialog = this.shadowRoot?.querySelector('.dialog') as HTMLElement | null;
    dialog?.focus();
  }

  private trapFocus(event: KeyboardEvent): void {
    const focusable = this.getFocusableElements();
    if (focusable.length === 0) {
      event.preventDefault();
      return;
    }

    const first = focusable[0];
    const last = focusable[focusable.length - 1];
    const active = document.activeElement as HTMLElement | null;

    if (event.shiftKey) {
      if (active === first || !this.isNodeInsideModal(active)) {
        event.preventDefault();
        last.focus();
      }
      return;
    }

    if (active === last || !this.isNodeInsideModal(active)) {
      event.preventDefault();
      first.focus();
    }
  }

  private isNodeInsideModal(node: Node | null): boolean {
    if (!node) return false;
    if (node === this || this.contains(node)) return true;
    return Boolean(this.shadowRoot?.contains(node));
  }

  private lockScroll(lock: boolean): void {
    if (this.contained) return;

    if (lock) {
      openModalCount += 1;
      if (openModalCount === 1) {
        document.documentElement.style.overflow = 'hidden';
      }
      return;
    }

    openModalCount = Math.max(0, openModalCount - 1);
    if (openModalCount === 0) {
      document.documentElement.style.overflow = '';
    }
  }
}

customElements.define('al-modal', AlModal);
