import type { ComponentDemo, DemoExample, DemoProperty, DemoPropertyGroup } from '../types';
import { escapeHtml, highlightHtml } from './html-utils';
import { createPlayground, type PlaygroundInstance } from './playground';
import { initTheme, toggleTheme } from './theme';

const ADDON_OPEN_KEY = 'alumini-demo-addon-open';
const ADDON_TAB_KEY = 'alumini-demo-addon-tab';
const SIDEBAR_OPEN_KEY = 'alumini-demo-sidebar-open';

type AddonTab = 'controls' | 'actions' | 'code';

function createPropsTable(properties: DemoProperty[], labelColumn = 'Property'): HTMLElement {
  const table = document.createElement('table');
  table.className = 'props-table';
  table.innerHTML = `
    <thead>
      <tr>
        <th>${escapeHtml(labelColumn)}</th>
        <th>Type</th>
        <th>Default</th>
        <th>Description</th>
      </tr>
    </thead>
    <tbody></tbody>
  `;

  const tbody = table.querySelector('tbody')!;
  for (const prop of properties) {
    const row = document.createElement('tr');
    row.innerHTML = `
      <td>${escapeHtml(prop.name)}</td>
      <td>${escapeHtml(prop.type)}</td>
      <td><span class="badge">${escapeHtml(prop.default)}</span></td>
      <td>${escapeHtml(prop.description)}</td>
    `;
    tbody.appendChild(row);
  }

  return table;
}

function createCodeBlock(code: string): HTMLElement {
  const wrapper = document.createElement('div');
  wrapper.className = 'card-code';

  const toggle = document.createElement('button');
  toggle.type = 'button';
  toggle.className = 'code-toggle';
  toggle.innerHTML = `
    <span>Show code</span>
    <svg class="arrow" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
      <polyline points="6 9 12 15 18 9" />
    </svg>
  `;

  const content = document.createElement('div');
  content.className = 'code-content';

  const pre = document.createElement('pre');
  pre.innerHTML = highlightHtml(code);
  content.appendChild(pre);

  toggle.addEventListener('click', () => {
    toggle.classList.toggle('open');
    content.classList.toggle('open');
    const label = toggle.querySelector('span');
    if (label) {
      label.textContent = content.classList.contains('open') ? 'Hide code' : 'Show code';
    }
  });

  wrapper.append(toggle, content);
  return wrapper;
}

function createExampleCard(example: DemoExample): HTMLElement {
  const card = document.createElement('article');
  card.className = 'docs-card';

  const header = document.createElement('div');
  header.className = 'docs-card-header';
  header.innerHTML = `
    <h3>${escapeHtml(example.title)}</h3>
    ${example.description ? `<p>${escapeHtml(example.description)}</p>` : ''}
  `;

  const preview = document.createElement('div');
  preview.className = example.previewClass ?? 'docs-preview';
  preview.innerHTML = example.preview.trim();

  card.append(header, preview, createCodeBlock(example.code));
  return card;
}

function appendPropertyTables(card: HTMLElement, groups: DemoPropertyGroup[]): void {
  groups.forEach((group, index) => {
    const table = createPropsTable(group.properties, group.labelColumn ?? 'Property');
    if (index > 0) {
      table.classList.add('props-table-spaced');
    }
    card.appendChild(table);
  });
}

function createDocsView(demo: ComponentDemo): HTMLElement {
  const docs = document.createElement('div');
  docs.className = 'story-docs';

  for (const example of demo.examples) {
    docs.appendChild(createExampleCard(example));
  }

  const propsCard = document.createElement('article');
  propsCard.className = 'docs-card';
  propsCard.innerHTML = '<div class="docs-card-header"><h3>Properties</h3></div>';

  if (demo.properties?.length) {
    propsCard.appendChild(createPropsTable(demo.properties));
  }
  if (demo.propertyGroups?.length) {
    appendPropertyTables(propsCard, demo.propertyGroups);
  }

  docs.appendChild(propsCard);
  return docs;
}

function createComponentSection(
  demo: ComponentDemo,
  mountPlayground: (instance: PlaygroundInstance | null) => void,
): HTMLElement {
  const section = document.createElement('section');
  section.id = demo.id;
  section.className = 'story-section';
  section.dataset.hasPlayground = demo.playground ? 'true' : 'false';

  let playground: PlaygroundInstance | null = null;
  if (demo.playground) {
    playground = createPlayground(demo.playground);
  }

  const header = document.createElement('div');
  header.className = 'story-intro';
  header.innerHTML = `
    <h2>${escapeHtml(demo.name)}</h2>
    <p>${escapeHtml(demo.description)}</p>
  `;

  const subToolbar = document.createElement('div');
  subToolbar.className = 'story-subtoolbar';

  const tabs = document.createElement('div');
  tabs.className = 'story-tabs';

  const canvasTab = document.createElement('button');
  canvasTab.type = 'button';
  canvasTab.className = 'story-tab';
  canvasTab.dataset.view = 'canvas';
  canvasTab.textContent = 'Canvas';
  canvasTab.disabled = !demo.playground;

  const docsTab = document.createElement('button');
  docsTab.type = 'button';
  docsTab.className = 'story-tab active';
  docsTab.dataset.view = 'docs';
  docsTab.textContent = 'Docs';

  tabs.append(canvasTab, docsTab);

  const subActions = document.createElement('div');
  subActions.className = 'story-subactions';

  const openAddonsBtn = document.createElement('button');
  openAddonsBtn.type = 'button';
  openAddonsBtn.className = 'sb-btn sb-btn-ghost story-open-addons';
  openAddonsBtn.textContent = 'Addons';
  openAddonsBtn.hidden = !demo.playground;

  const resetBtn = document.createElement('button');
  resetBtn.type = 'button';
  resetBtn.className = 'sb-btn sb-btn-ghost';
  resetBtn.textContent = 'Reset controls';
  resetBtn.hidden = !demo.playground;

  subActions.append(openAddonsBtn, resetBtn);
  subToolbar.append(tabs, subActions);

  const canvasView = document.createElement('div');
  canvasView.className = 'story-canvas';
  if (playground) {
    canvasView.appendChild(playground.canvas);
  } else {
    canvasView.innerHTML = '<p class="addon-empty">No playground configured for this component.</p>';
  }

  const docsView = createDocsView(demo);
  docsView.hidden = true;

  section.append(header, subToolbar, canvasView, docsView);

  const setView = (view: 'canvas' | 'docs') => {
    const isCanvas = view === 'canvas' && demo.playground != null;
    canvasTab.classList.toggle('active', isCanvas);
    docsTab.classList.toggle('active', !isCanvas);
    canvasView.hidden = !isCanvas;
    docsView.hidden = isCanvas;
    section.dataset.view = isCanvas ? 'canvas' : 'docs';

    if (isCanvas) {
      mountPlayground(playground);
    } else {
      mountPlayground(null);
    }
  };

  canvasTab.addEventListener('click', () => {
    section.dataset.view = 'canvas';
    setView('canvas');
  });
  docsTab.addEventListener('click', () => {
    section.dataset.view = 'docs';
    setView('docs');
  });

  openAddonsBtn.addEventListener('click', () => {
    section.dataset.view = 'canvas';
    setView('canvas');
    document.getElementById('app')?.dispatchEvent(new CustomEvent('alumini:open-addons'));
  });

  resetBtn.addEventListener('click', () => playground?.reset());

  section.addEventListener('alumini:activate', () => {
    const view =
      section.dataset.view === 'docs' || !demo.playground ? 'docs' : 'canvas';
    setView(view);
  });

  if (demo.playground) {
    section.dataset.view = 'canvas';
    canvasTab.classList.add('active');
    docsTab.classList.remove('active');
    canvasView.hidden = false;
    docsView.hidden = true;
  } else {
    section.dataset.view = 'docs';
    setView('docs');
  }

  return section;
}

function createWelcomeSection(demos: ComponentDemo[]): HTMLElement {
  const section = document.createElement('section');
  section.id = 'welcome';
  section.className = 'story-section active';
  section.dataset.hasPlayground = 'false';

  const list = demos
    .map((demo) => `<li><strong>${escapeHtml(demo.name)}</strong> — ${escapeHtml(demo.description)}</li>`)
    .join('');

  section.innerHTML = `
    <div class="welcome">
      <h2>Alumini Components</h2>
      <p>
        Storybook-style docs for web components. Press <kbd>S</kbd> to toggle sidebar,
        <kbd>A</kbd> for addons panel on Canvas view.
      </p>
      <ul class="welcome-list">${list}</ul>
    </div>
  `;
  return section;
}

function createNavLink(id: string, label: string, icon: string, active = false): HTMLButtonElement {
  const button = document.createElement('button');
  button.type = 'button';
  button.className = `nav-link${active ? ' active' : ''}`;
  button.dataset.section = id;
  button.innerHTML = `${icon}${escapeHtml(label)}`;
  return button;
}

function iconSun(): string {
  return `<svg class="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M4.93 19.07l1.41-1.41M17.66 6.34l1.41-1.41"/></svg>`;
}

function iconMoon(): string {
  return `<svg class="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 12.79A9 9 0 1111.21 3 7 7 0 0021 12.79z"/></svg>`;
}

export function renderDemoApp(root: HTMLElement, demos: ComponentDemo[], version: string): void {
  initTheme();

  root.id = 'app';
  root.innerHTML = `
    <aside class="sidebar">
      <div class="sidebar-header">
        <h1>Alumini</h1>
        <p>v${escapeHtml(version)}</p>
      </div>
      <nav class="sidebar-nav"></nav>
    </aside>
    <div class="workspace">
      <header class="toolbar">
        <div class="toolbar-start">
          <button type="button" class="sb-btn sb-btn-icon" id="toggle-sidebar" title="Toggle sidebar (S)" aria-label="Toggle sidebar">
            <svg class="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <rect x="3" y="4" width="7" height="16" rx="1.5" />
              <rect x="13" y="4" width="8" height="16" rx="1.5" />
            </svg>
          </button>
          <div class="breadcrumb">Components / <span id="current-section">Welcome</span></div>
        </div>
        <div class="toolbar-end">
          <button type="button" class="sb-btn sb-btn-icon" id="toggle-addons" title="Toggle addons panel (A)" aria-label="Toggle addons" disabled>
            <svg class="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="3" width="18" height="14" rx="2"/><path d="M3 17h18"/></svg>
          </button>
          <button type="button" class="sb-btn sb-btn-icon" id="toggle-theme" title="Toggle theme" aria-label="Toggle theme"></button>
        </div>
      </header>
      <div class="story-shell">
        <div class="story-scroll"></div>
        <aside class="addon-dock" id="addon-dock">
          <div class="addon-dock-header">
            <div class="addon-tabs" role="tablist">
              <button type="button" class="addon-tab active" data-tab="controls">Controls</button>
              <button type="button" class="addon-tab" data-tab="actions">Actions</button>
              <button type="button" class="addon-tab" data-tab="code">Code</button>
            </div>
            <button type="button" class="sb-btn sb-btn-icon addon-close" id="close-addons" aria-label="Close addons">
              <svg class="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M18 6L6 18M6 6l12 12"/></svg>
            </button>
          </div>
          <div class="addon-dock-body">
            <div class="addon-panel active" data-panel="controls"></div>
            <div class="addon-panel" data-panel="actions"></div>
            <div class="addon-panel" data-panel="code"></div>
          </div>
        </aside>
      </div>
    </div>
  `;

  const themeBtn = root.querySelector<HTMLButtonElement>('#toggle-theme')!;
  const updateThemeIcon = () => {
    const isDark = document.documentElement.dataset.theme === 'dark';
    themeBtn.innerHTML = isDark ? iconSun() : iconMoon();
    themeBtn.title = isDark ? 'Switch to light theme' : 'Switch to dark theme';
  };
  updateThemeIcon();
  themeBtn.addEventListener('click', () => {
    toggleTheme();
    updateThemeIcon();
  });

  const addonDock = root.querySelector('#addon-dock') as HTMLElement;
  const toggleSidebarBtn = root.querySelector<HTMLButtonElement>('#toggle-sidebar')!;
  const toggleAddonsBtn = root.querySelector<HTMLButtonElement>('#toggle-addons')!;
  const closeAddonsBtn = root.querySelector<HTMLButtonElement>('#close-addons')!;
  const addonPanels = {
    controls: root.querySelector('[data-panel="controls"]')!,
    actions: root.querySelector('[data-panel="actions"]')!,
    code: root.querySelector('[data-panel="code"]')!,
  };

  let activePlayground: PlaygroundInstance | null = null;
  let sidebarOpen = localStorage.getItem(SIDEBAR_OPEN_KEY) !== 'false';
  let addonOpen = localStorage.getItem(ADDON_OPEN_KEY) === 'true';
  let addonTab = (localStorage.getItem(ADDON_TAB_KEY) as AddonTab) || 'controls';

  const updateSidebarVisibility = () => {
    root.classList.toggle('sidebar-collapsed', !sidebarOpen);
    toggleSidebarBtn.classList.toggle('sb-btn-active', sidebarOpen);
    toggleSidebarBtn.title = sidebarOpen ? 'Hide sidebar (S)' : 'Show sidebar (S)';
  };

  const toggleSidebar = () => {
    sidebarOpen = !sidebarOpen;
    localStorage.setItem(SIDEBAR_OPEN_KEY, String(sidebarOpen));
    updateSidebarVisibility();
  };

  toggleSidebarBtn.addEventListener('click', toggleSidebar);
  updateSidebarVisibility();

  const mountPlayground = (instance: PlaygroundInstance | null) => {
    activePlayground = instance;
    addonPanels.controls.replaceChildren();
    addonPanels.actions.replaceChildren();
    addonPanels.code.replaceChildren();

    if (!instance) {
      addonPanels.controls.innerHTML = '<p class="addon-empty">Switch to Canvas view to use controls.</p>';
      addonPanels.actions.innerHTML = '<p class="addon-empty">No actions for this view.</p>';
      addonPanels.code.innerHTML = '<p class="addon-empty">No live code for this view.</p>';
      updateAddonVisibility();
      return;
    }

    addonPanels.controls.appendChild(instance.panels.controls);
    addonPanels.actions.appendChild(instance.panels.actions);
    addonPanels.code.appendChild(instance.panels.code);
    instance.refreshControls();
    updateAddonVisibility();
  };

  const setAddonTab = (tab: AddonTab) => {
    addonTab = tab;
    localStorage.setItem(ADDON_TAB_KEY, tab);
    root.querySelectorAll<HTMLButtonElement>('.addon-tab').forEach((btn) => {
      btn.classList.toggle('active', btn.dataset.tab === tab);
    });
    root.querySelectorAll<HTMLElement>('.addon-panel').forEach((panel) => {
      panel.classList.toggle('active', panel.dataset.panel === tab);
    });
  };

  const updateAddonVisibility = () => {
    const canShow = Boolean(activePlayground);
    const shouldShow = canShow && addonOpen;

    toggleAddonsBtn.disabled = !canShow;
    toggleAddonsBtn.classList.toggle('sb-btn-active', shouldShow);
    toggleAddonsBtn.title = shouldShow ? 'Hide addons panel (A)' : 'Show addons panel (A)';
    addonDock.classList.toggle('is-open', shouldShow);
    root.classList.toggle('addons-open', shouldShow);

    if (!shouldShow) {
      return;
    }

    setAddonTab(addonTab);
  };

  const openAddons = () => {
    if (!activePlayground) return;
    addonOpen = true;
    localStorage.setItem(ADDON_OPEN_KEY, 'true');
    updateAddonVisibility();
  };

  const closeAddons = () => {
    addonOpen = false;
    localStorage.setItem(ADDON_OPEN_KEY, 'false');
    updateAddonVisibility();
  };

  const toggleAddons = () => {
    if (!activePlayground) return;
    addonOpen = !addonOpen;
    localStorage.setItem(ADDON_OPEN_KEY, String(addonOpen));
    updateAddonVisibility();
  };

  toggleAddonsBtn.addEventListener('click', toggleAddons);
  closeAddonsBtn.addEventListener('click', (event) => {
    event.preventDefault();
    event.stopPropagation();
    closeAddons();
  });
  root.addEventListener('alumini:open-addons', openAddons);

  root.querySelectorAll<HTMLButtonElement>('.addon-tab').forEach((tab) => {
    tab.addEventListener('click', () => setAddonTab(tab.dataset.tab as AddonTab));
  });

  document.addEventListener('keydown', (event) => {
    if (event.target instanceof HTMLInputElement || event.target instanceof HTMLTextAreaElement || event.target instanceof HTMLSelectElement) {
      return;
    }

    const key = event.key.toLowerCase();

    if (key === 's' && !event.metaKey && !event.ctrlKey && !event.altKey) {
      event.preventDefault();
      toggleSidebar();
      return;
    }

    if (key === 'a' && activePlayground && !event.metaKey && !event.ctrlKey && !event.altKey) {
      event.preventDefault();
      toggleAddons();
    }
  });

  const nav = root.querySelector('.sidebar-nav')!;
  const overview = document.createElement('div');
  overview.className = 'nav-section';
  overview.innerHTML = '<div class="nav-section-title">Overview</div>';
  overview.appendChild(
    createNavLink(
      'welcome',
      'Welcome',
      `<svg class="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z" /></svg>`,
      true,
    ),
  );
  nav.appendChild(overview);

  const componentsNav = document.createElement('div');
  componentsNav.className = 'nav-section';
  componentsNav.innerHTML = '<div class="nav-section-title">Components</div>';
  for (const demo of demos) {
    componentsNav.appendChild(createNavLink(demo.id, demo.name, demo.icon));
  }
  nav.appendChild(componentsNav);

  const storyScroll = root.querySelector('.story-scroll')!;
  storyScroll.appendChild(createWelcomeSection(demos));
  for (const demo of demos) {
    storyScroll.appendChild(createComponentSection(demo, mountPlayground));
  }

  const links = root.querySelectorAll<HTMLButtonElement>('.nav-link');
  const sections = root.querySelectorAll<HTMLElement>('.story-section');
  const breadcrumb = root.querySelector('#current-section')!;

  links.forEach((link) => {
    link.addEventListener('click', () => {
      const target = link.dataset.section!;
      links.forEach((item) => item.classList.remove('active'));
      sections.forEach((section) => section.classList.remove('active'));
      link.classList.add('active');

      const activeSection = document.getElementById(target);
      activeSection?.classList.add('active');
      activeSection?.dispatchEvent(new CustomEvent('alumini:activate'));
      breadcrumb.textContent = link.textContent?.trim() ?? target;

      if (target === 'welcome') {
        mountPlayground(null);
      }
    });
  });

  mountPlayground(null);
  updateAddonVisibility();
}
