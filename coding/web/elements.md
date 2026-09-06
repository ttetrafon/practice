# Web Elements

## Predefined

## Web Components

### Autonomous

### Customised

- Predefined tags can be extended to create customised ones.

```js
window.customElements.define(
  "fancy-button", // The name
  class extends HTMLButtonElement {}, // The class definition
  { extends: "button" } // Only extend "button" elements
);
```

- Such elements are then created with 'is' and their name.

```html
<button is="fancy-button"></button>
```
