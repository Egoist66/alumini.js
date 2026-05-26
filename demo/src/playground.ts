import type { DemoControl, DemoPlayground } from '../types';
import { escapeHtml, highlightHtml } from './html-utils';

type ControlValues = Record<string, string | boolean | number>;

export interface PlaygroundInstance {
  canvas: HTMLElement;
  panels: {
    controls: HTMLElement;
    actions: HTMLElement;
    code: HTMLElement;
  };
  reset: () => void;
  refreshControls: () => void;
}

function coerceBoolean(value: unknown): boolean {
  if (value === true || value === 1) return true;
  if (value === false || value === 0) return false;
  if (typeof value === 'string') {
    const normalized = value.trim().toLowerCase();
    if (normalized === 'true' || normalized === '1') return true;
    if (normalized === 'false' || normalized === '0' || normalized === '') return false;
  }
  return Boolean(value);
}

function getBooleanControlValue(control: DemoControl, values: ControlValues): boolean {
  const raw = values[control.name];
  if (raw !== undefined && raw !== null && raw !== '') {
    return coerceBoolean(raw);
  }
  if (control.default !== undefined) {
    return coerceBoolean(control.default);
  }
  return control.defaultTrue ?? false;
}

function initControlValues(controls: DemoControl[]): ControlValues {
  const values: ControlValues = {};
  for (const control of controls) {
    if (control.type === 'boolean') {
      values[control.name] =
        control.default !== undefined
          ? coerceBoolean(control.default)
          : (control.defaultTrue ?? false);
      continue;
    }
    values[control.name] = control.default ?? '';
  }
  return values;
}

function formatBooleanAttr(name: string, value: boolean, defaultTrue = false): string {
  if (defaultTrue) {
    return value ? '' : `${name}="false"`;
  }
  return value ? name : '';
}

function formatControlAttr(control: DemoControl, value: string | boolean | number): string {
  if (control.type === 'boolean') {
    return formatBooleanAttr(control.name, coerceBoolean(value), control.defaultTrue);
  }
  return formatAttr(control.name, value);
}

function formatAttr(name: string, value: string | boolean | number): string {
  if (typeof value === 'boolean') {
    return value ? name : '';
  }
  if (value === '' || value === undefined) {
    return '';
  }
  return `${name}="${String(value)}"`;
}

export function generatePlaygroundCode(config: DemoPlayground, values: ControlValues): string {
  const slotControl = config.controls.find((c) => c.target === 'slot');
  const attrs = config.controls
    .filter((c) => c.target !== 'slot')
    .map((c) => formatControlAttr(c, values[c.name]))
    .filter(Boolean)
    .join(' ');

  const staticAttrs = config.contained ? 'contained' : '';
  const allAttrs = [staticAttrs, attrs].filter(Boolean).join(' ');
  const openTag = allAttrs ? `<${config.tag} ${allAttrs}>` : `<${config.tag}>`;

  const bodyLines: string[] = [];
  if (config.innerHTML) {
    bodyLines.push(...config.innerHTML.trim().split('\n'));
  } else {
    const slotText = slotControl ? String(values[slotControl.name]) : (config.slotDefault ?? '');
    bodyLines.push(slotText);
  }

  const modalBlock = [openTag, ...bodyLines, `</${config.tag}>`].join('\n');

  if (config.trigger && config.tag === 'al-modal') {
    const openLabel = config.trigger.openLabel ?? 'Open modal';
    return `<div class="playground-modal-shell">
  <al-button onclick="this.nextElementSibling.show()">${openLabel}</al-button>
  ${modalBlock}
</div>`;
  }

  return modalBlock;
}

function applyValuesToElement(
  element: HTMLElement,
  config: DemoPlayground,
  values: ControlValues,
): void {
  if (config.contained) {
    element.setAttribute('contained', '');
  }

  for (const control of config.controls) {
    if (control.target === 'slot') {
      element.textContent = String(values[control.name]);
      continue;
    }

    const value = values[control.name];
    if (typeof value === 'boolean' || control.type === 'boolean') {
      const enabled = coerceBoolean(value);
      if (control.defaultTrue) {
        if (enabled) {
          element.removeAttribute(control.name);
        } else {
          element.setAttribute(control.name, 'false');
        }
      } else if (enabled) {
        element.setAttribute(control.name, '');
      } else {
        element.removeAttribute(control.name);
      }
      continue;
    }

    if (value === '' || value === undefined) {
      element.removeAttribute(control.name);
      continue;
    }

    element.setAttribute(control.name, String(value));
  }
}

function setBooleanControlUi(field: HTMLElement, enabled: boolean): void {
  field.classList.remove('is-enabled', 'is-disabled');
  field.classList.add(enabled ? 'is-enabled' : 'is-disabled');

  const status = field.querySelector('.addon-control-status');
  const toggle = field.querySelector<HTMLButtonElement>('.addon-switch');

  if (status) {
    status.textContent = enabled ? 'Enabled' : 'Disabled';
    status.classList.remove('is-on', 'is-off');
    status.classList.add(enabled ? 'is-on' : 'is-off');
  }

  if (toggle) {
    toggle.setAttribute('aria-checked', String(enabled));
    toggle.classList.toggle('is-on', enabled);
  }
}

function createBooleanControl(
  control: DemoControl,
  values: ControlValues,
  onChange: () => void,
): HTMLElement {
  const field = document.createElement('div');
  field.className = 'addon-control addon-control--boolean';
  field.dataset.control = control.name;

  const enabled = getBooleanControlValue(control, values);
  values[control.name] = enabled;

  const label = document.createElement('span');
  label.className = 'addon-control-label';
  label.textContent = control.label ?? control.name;

  const inputWrap = document.createElement('div');
  inputWrap.className = 'addon-control-input';

  const row = document.createElement('div');
  row.className = 'addon-boolean-row';

  const toggle = document.createElement('button');
  toggle.type = 'button';
  toggle.className = enabled ? 'addon-switch is-on' : 'addon-switch';
  toggle.setAttribute('role', 'switch');
  toggle.setAttribute('aria-checked', String(enabled));
  toggle.setAttribute('aria-label', `${control.label ?? control.name} toggle`);
  toggle.innerHTML = '<span class="addon-switch-track"><span class="addon-switch-thumb"></span></span>';

  const status = document.createElement('span');
  status.className = enabled ? 'addon-control-status is-on' : 'addon-control-status is-off';
  status.textContent = enabled ? 'Enabled' : 'Disabled';

  toggle.addEventListener('click', () => {
    const next = !getBooleanControlValue(control, values);
    values[control.name] = next;
    setBooleanControlUi(field, next);
    onChange();
  });

  row.append(toggle, status);
  inputWrap.appendChild(row);
  setBooleanControlUi(field, enabled);

  if (control.description) {
    const hint = document.createElement('small');
    hint.className = 'addon-control-hint';
    hint.textContent = control.description;
    inputWrap.appendChild(hint);
  }

  field.append(label, inputWrap);
  return field;
}

function createControlField(
  control: DemoControl,
  values: ControlValues,
  onChange: () => void,
): HTMLElement {
  if (control.type === 'boolean') {
    return createBooleanControl(control, values, onChange);
  }

  const field = document.createElement('div');
  field.className = 'addon-control';
  field.dataset.control = control.name;

  const label = document.createElement('span');
  label.className = 'addon-control-label';
  label.textContent = control.label ?? control.name;

  const inputWrap = document.createElement('div');
  inputWrap.className = 'addon-control-input';

  if (control.type === 'select') {
    const select = document.createElement('select');
    for (const option of control.options ?? []) {
      const opt = document.createElement('option');
      opt.value = option;
      opt.textContent = option;
      select.appendChild(opt);
    }
    select.value = String(values[control.name]);
    select.addEventListener('change', () => {
      values[control.name] = select.value;
      onChange();
    });
    inputWrap.appendChild(select);
  } else if (control.type === 'number') {
    const input = document.createElement('input');
    input.type = 'number';
    input.value = String(values[control.name]);
    input.addEventListener('input', () => {
      values[control.name] = input.value === '' ? 0 : Number(input.value);
      onChange();
    });
    inputWrap.appendChild(input);
  } else {
    const input = document.createElement('input');
    input.type = 'text';
    input.value = String(values[control.name]);
    input.addEventListener('input', () => {
      values[control.name] = input.value;
      onChange();
    });
    inputWrap.appendChild(input);
  }

  if (control.description) {
    const hint = document.createElement('small');
    hint.className = 'addon-control-hint';
    hint.textContent = control.description;
    inputWrap.appendChild(hint);
  }

  field.append(label, inputWrap);
  return field;
}

interface ModalElement extends HTMLElement {
  show?: () => void;
  hide?: () => void;
}

function closeModalElement(element: HTMLElement): void {
  const modal = element as ModalElement;
  if (modal.hide && (element.hasAttribute('open') || element.hasAttribute('closing'))) {
    modal.hide();
    return;
  }
  element.removeAttribute('open');
  element.removeAttribute('closing');
}

function mountContainedModalPlayground(
  shell: HTMLElement,
  element: HTMLElement,
  config: DemoPlayground,
): { trigger: HTMLElement; updateTrigger: () => void } {
  element.setAttribute('contained', '');

  const trigger = document.createElement('al-button');
  trigger.setAttribute('type', 'button');

  const updateTrigger = () => {
    const isOpen = element.hasAttribute('open') && !element.hasAttribute('closing');
    trigger.textContent = isOpen
      ? (config.trigger?.closeLabel ?? 'Close modal')
      : (config.trigger?.openLabel ?? 'Open modal');
    if (isOpen) {
      trigger.setAttribute('variant', 'secondary');
    } else {
      trigger.removeAttribute('variant');
    }
  };

  trigger.addEventListener('click', () => {
    const modal = element as ModalElement;
    if (element.hasAttribute('open')) {
      modal.hide?.();
    } else {
      modal.show?.();
    }
  });

  element.addEventListener('al_open', updateTrigger);
  element.addEventListener('al_close', updateTrigger);

  shell.append(trigger, element);
  updateTrigger();

  return { trigger, updateTrigger };
}

export function createPlayground(config: DemoPlayground): PlaygroundInstance {
  const values = initControlValues(config.controls);

  const canvas = document.createElement('div');
  canvas.className = 'story-canvas-inner';

  const stage = document.createElement('div');
  stage.className = config.previewClass ?? 'story-stage';

  const element = document.createElement(config.tag);
  if (config.innerHTML) {
    element.innerHTML = config.innerHTML.trim();
  }

  let updateTrigger: (() => void) | null = null;

  if (config.contained && config.tag === 'al-modal') {
    const shell = document.createElement('div');
    shell.className = config.shellClass ?? 'playground-modal-shell';
    ({ updateTrigger } = mountContainedModalPlayground(shell, element, config));
    stage.appendChild(shell);
  } else {
    stage.appendChild(element);
  }

  canvas.appendChild(stage);

  const controlsPanel = document.createElement('div');
  controlsPanel.className = 'addon-controls-grid';

  const actionsPanel = document.createElement('div');
  actionsPanel.className = 'addon-actions';

  const actionsToolbar = document.createElement('div');
  actionsToolbar.className = 'addon-actions-toolbar';

  const clearBtn = document.createElement('button');
  clearBtn.type = 'button';
  clearBtn.className = 'sb-btn sb-btn-ghost';
  clearBtn.textContent = 'Clear log';

  const eventList = document.createElement('div');
  eventList.className = 'addon-event-list';
  eventList.innerHTML = '<p class="addon-empty">Interact with the canvas to log events</p>';

  actionsToolbar.appendChild(clearBtn);
  actionsPanel.append(actionsToolbar, eventList);

  const codePanel = document.createElement('div');
  codePanel.className = 'addon-code';

  const codeToolbar = document.createElement('div');
  codeToolbar.className = 'addon-code-toolbar';

  const copyBtn = document.createElement('button');
  copyBtn.type = 'button';
  copyBtn.className = 'sb-btn sb-btn-ghost';
  copyBtn.textContent = 'Copy';

  const codePre = document.createElement('pre');
  codePre.className = 'addon-code-content';

  codeToolbar.appendChild(copyBtn);
  codePanel.append(codeToolbar, codePre);

  const logEvent = (name: string, detail: unknown, target: EventTarget | null) => {
    eventList.querySelector('.addon-empty')?.remove();

    const entry = document.createElement('div');
    entry.className = 'addon-event-entry';

    const time = new Date().toLocaleTimeString();
    const targetName =
      target instanceof HTMLElement ? target.tagName.toLowerCase() : 'unknown';
    const detailText =
      detail && typeof detail === 'object' && Object.keys(detail as object).length > 0
        ? JSON.stringify(detail)
        : '';

    entry.innerHTML = `
      <span class="addon-event-time">${escapeHtml(time)}</span>
      <span class="addon-event-name">${escapeHtml(name)}</span>
      <span class="addon-event-target">${escapeHtml(targetName)}</span>
      <code class="addon-event-detail">${escapeHtml(detailText)}</code>
    `;

    eventList.prepend(entry);
    while (eventList.children.length > 30) {
      eventList.lastElementChild?.remove();
    }
  };

  const clearEvents = () => {
    eventList.innerHTML = '<p class="addon-empty">Interact with the canvas to log events</p>';
  };

  clearBtn.addEventListener('click', clearEvents);

  const updateCode = () => {
    codePre.innerHTML = highlightHtml(generatePlaygroundCode(config, values));
  };

  const sync = () => {
    applyValuesToElement(element, config, values);
    updateCode();
  };

  for (const control of config.controls) {
    controlsPanel.appendChild(createControlField(control, values, sync));
  }

  copyBtn.addEventListener('click', async () => {
    await navigator.clipboard.writeText(generatePlaygroundCode(config, values));
    copyBtn.textContent = 'Copied!';
    setTimeout(() => {
      copyBtn.textContent = 'Copy';
    }, 1200);
  });

  const events = config.events ?? ['click'];
  for (const eventName of events) {
    stage.addEventListener(
      eventName,
      (event) => {
        const custom = event as CustomEvent;
        logEvent(eventName, custom.detail ?? {}, event.target);
      },
      true,
    );
  }

  const resetInputs = () => {
    for (const control of config.controls) {
      const field = controlsPanel.querySelector<HTMLElement>(`[data-control="${control.name}"]`);
      if (!field) continue;

      if (control.type === 'boolean') {
        const enabled = getBooleanControlValue(control, values);
        values[control.name] = enabled;
        setBooleanControlUi(field, enabled);
        continue;
      }

      const input = field.querySelector<HTMLInputElement | HTMLSelectElement>('input, select');
      if (input) {
        input.value = String(values[control.name]);
      }
    }
  };

  const reset = () => {
    Object.assign(values, initControlValues(config.controls));
    resetInputs();
    clearEvents();
    closeModalElement(element);
    sync();
    updateTrigger?.();
  };

  sync();

  const refreshControls = () => {
    resetInputs();
  };

  return {
    canvas,
    panels: {
      controls: controlsPanel,
      actions: actionsPanel,
      code: codePanel,
    },
    reset,
    refreshControls,
  };
}
