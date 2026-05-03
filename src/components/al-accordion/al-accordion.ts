import { AlAccordionItem } from './al-accordion-item';

const accordionTemplate = document.createElement('template');
accordionTemplate.innerHTML = `
  <style>
    :host {
      display: block;
      background: var(--al-surface, #fff);
      border-radius: var(--al-radius, 0.5rem);
      border: 1px solid var(--al-border, #e2e8f0);
      overflow: hidden;
    }

    ::slotted(al-accordion-item) {
      display: block;
    }
  </style>
  <div role="region" aria-roledescription="accordion">
    <slot></slot>
  </div>
`;

export class AlAccordion extends HTMLElement {
  static get observedAttributes() {
    return ['multiple'];
  }

  constructor() {
    super();
    const shadow = this.attachShadow({ mode: 'open' });
    shadow.appendChild(accordionTemplate.content.cloneNode(true));
  }

  connectedCallback() {
    this.addEventListener('al_toggle', this.handleToggle.bind(this));
  }

  disconnectedCallback() {
    this.removeEventListener('al_toggle', this.handleToggle.bind(this));
  }

  get multiple(): boolean {
    return this.hasAttribute('multiple');
  }

  set multiple(value: boolean) {
    if (value) {
      this.setAttribute('multiple', '');
    } else {
      this.removeAttribute('multiple');
    }
  }

  attributeChangedCallback() {
    this.updateItems();
  }

  private handleToggle(event: Event) {
    const customEvent = event as CustomEvent;
    const item = customEvent.target as AlAccordionItem;
    if (!(item instanceof AlAccordionItem)) return;
    if (this.multiple) {
      item.setOpen(!item.open);
    } else {
      const items = this.querySelectorAll('al-accordion-item') as NodeListOf<AlAccordionItem>;
      items.forEach((other) => {
        if (other !== item && other.open) {
          other.setOpen(false);
        }
      });
      item.setOpen(!item.open);
    }
  }

  private updateItems() {
    const items = this.querySelectorAll('al-accordion-item') as NodeListOf<AlAccordionItem>;
    if (!this.multiple) {
      let firstOpen = false;
      items.forEach((item) => {
        if (item.open && !firstOpen) {
          firstOpen = true;
        } else if (item.open) {
          item.setOpen(false);
        }
      });
    }
  }
}

customElements.define('al-accordion', AlAccordion);
