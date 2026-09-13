# Accessibility Object Tree (AOM) & Accessibility Tree (ACT)

- When the browsers parses the DOM with some assistive technology active, it also builds an ACT.

## Accessibility Attributes/Properties

- Native elements have properties that may be used assistive technologies.
  - e.g.: a checkbox knows if it is checked or not
- Such properties can be defined manually for other elements.
  - `role`: defines what the element does
  - `aria-pressed="false"`: defines the pressed state of an element (usually a button)

```js
class ToggleButton extends HTMLElement {
  var internals = null;
	constructor() {
    super();
    this.internals = customElements.createInternals(this);
    this.internals.ariaPressed = "false";
  }

  connectedCallback() {
    this.setAttribute("role", "button");
    this.setAttribute("tabindex", "0");
    this.setAttribute("aria-pressed", "false");

    this.addEventListener("click", togglePressed);
    this.addEventListener("keydown", function (event) {
        if (event.key === "Enter" || event.key === " ") {
            togglePressed();
        }
    });
  }
}
customElements.define("toggle-button", ToggleButton);
```
