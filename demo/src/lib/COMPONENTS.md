# Alumini Components

## AlAccordion

Expandable content sections with smooth animations.

### Properties

| Property | Type | Default | Description |
|----------|------|---------|-------------|
| `multiple` | boolean | `false` | Allow multiple items open |

### Item Property

| Item Property | Type | Default | Description |
|----------|------|---------|-------------|
| `title` | string | `""` | Header text |
| `open` | boolean | `false` | Starts expanded |

### Usage

```html
<al-accordion>
  <al-accordion-item title="Section 1">
    <!-- content here -->
  </al-accordion-item>
  <al-accordion-item title="Section 2" open>
    <!-- content here -->
  </al-accordion-item>
</al-accordion>
```

---

## AlButton

A versatile button component with multiple variants and states.

### Properties

| Property | Type | Default | Description |
|----------|------|---------|-------------|
| `variant` | string | `primary` | Button color variant |
| `size` | string | `md` | Button size |
| `disabled` | boolean | `false` | Disables the button |
| `loading` | boolean | `false` | Shows a loading spinner |
| `full-width` | boolean | `false` | Stretches button to full width |

### Usage

```html
<al-button>Default</al-button>
<al-button variant="secondary">Secondary</al-button>
<al-button variant="ghost">Ghost</al-button>
<al-button variant="danger">Danger</al-button>
```

---

## AlModal

Accessible dialog overlay with backdrop blur, focus trap, keyboard support, and flexible header, body, and footer slots.

### Properties

| Property | Type | Default | Description |
|----------|------|---------|-------------|
| `open` | boolean | `false` | Whether the modal is visible |
| `contained` | boolean | `false` | Keep overlay inside the parent container instead of the viewport |
| `size` | string | `md` | Dialog width: sm, md, lg, xl, or full |
| `closable` | boolean | `true` | Show close button and allow Escape to dismiss |
| `backdrop-dismiss` | boolean | `true` | Close the modal when clicking the backdrop |

### Usage

```html
<al-button onclick="document.querySelector('#demo-modal').show()">Open modal</al-button>

<al-modal id="demo-modal">
  <span slot="title">Welcome back</span>
  <p>Sign in to continue to your dashboard and manage your projects.</p>
  <div slot="footer">
    <al-button variant="ghost" onclick="document.querySelector('#demo-modal').hide()">Cancel</al-button>
    <al-button onclick="document.querySelector('#demo-modal').hide()">Continue</al-button>
  </div>
</al-modal>
```

