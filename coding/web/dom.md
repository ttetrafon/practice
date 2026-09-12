# DOM

## Elements

### Semantic Elements

- Useful links:
  - [Semantic HTML](https://developer.mozilla.org/en-US/curriculum/core/semantic-html/)

- `header`: a container for introductory content or a set of navigation links within the document or a section
  - multiple headers may exist within a document
- `footer`: a footer for the document or a section
- `nav`: grouping the document's major navigation links
- `main`: defines the main content of the document
- `section`: a thematic grouping of content, usually with a header
- `article`: independent, self-contained content
- `aside`: a sidebar, usually indirectly related to the surrounding content
- `ul`/`ol`
  - `li`
- `table`
- `figure`: self-contained contents, like illustrations, diagrams, photos, code listings, etc
  - `figcation`: defines a caption for a figure element; placed as the first or last child of the figure
- `details`
  - `summary`
- `mark`
- `i`
- `b`
- `time`

### Web Components (Custom Elements)

- [What is the Shadow DOM?](https://web.dev/articles/shadowdom-v1#what_is_shadow_dom)

#### Form-Associated Elements

- An element can be associated with a form by:
  - adding a static `formAssociated` to its class,
  - calling the `attachInternals()` method to get access to form controls (e.g.: `setFormValue()`, `setValidity()`, etc)
  - adding the common properties and methods supported by form controls (`name`, `value`, and `validity`)

```js
// Form-associated custom elements must be autonomous custom elements.
// They must extend HTMLElement, not one of its subclasses.
class MyCounter extends HTMLElement {

  // Identify the element as a form-associated custom element
  static formAssociated = true;

  constructor() {
    super();
    // Get access to the internal form control APIs
    this.internals_ = this.attachInternals();
    // internal value for this control
    this.value_ = 0;
  }

  // Form controls usually expose a "value" property
  get value() { return this.value_; }
  set value(v) { this.value_ = v; }

  // The following properties and methods aren't strictly required,
  // but browser-level form controls provide them. Providing them helps
  // ensure consistency with browser-provided controls.
  get form() { return this.internals_.form; }
  get name() { return this.getAttribute('name'); }
  get type() { return this.localName; }
  get validity() {return this.internals_.validity; }
  get validationMessage() {return this.internals_.validationMessage; }
  get willValidate() {return this.internals_.willValidate; }

  checkValidity() { return this.internals_.checkValidity(); }
  reportValidity() {return this.internals_.reportValidity(); }

  // ...
}
customElements.define('my-counter', MyCounter);
```

- Such an element can have multiple values associated with it, and all of them submitted with the form.

```js
// Use the control's name as the base name for submitted data
const n = this.getAttribute('name');
const entries = new FormData();
entries.append(n + '-first-name', this.firstName_);
entries.append(n + '-last-name', this.lastName_);
this.internals_.setFormValue(entries);
```

- It can also feature automatic validation, like normal inputs.

```js
// Assume this is called whenever the internal value is updated
onUpdateValue() {
  if (!this.matches(':disabled') && this.hasAttribute('required') &&
      this.value_ < 0) {
    this.internals_.setValidity({customError: true}, 'Value cannot be negative.');
  }
  else {
    this.internals_.setValidity({});
  }
  this.internals.setFormValue(this.value_);
}
```

- Form associated elements feature a number of lifecycle events in addition to the normal web-component lifecycle events.
  - `formAssociatedCallback(form)`: Called when the browser associates the element with a form element, or disassociates the element from a form element.
  - `formDisabledCallback(disabled)`: Called after the disabled state of the element changes, either because the disabled attribute of this element was added or removed; or because the disabled state changed on a <fieldset> that's an ancestor of this element.
  - `formResetCallback()`: Called after the form is reset. The element should reset itself to some kind of default state. For <input> elements, this usually involves setting the value property to match the value attribute set in markup. With a checkbox, this is related to setting the checked property to match the checked attribute.
  - `formStateRestoreCallback(state, mode)`: Called in one of two circumstances:
    - When the browser restores the state of the element, such as after navigation or when the browser restarts. The mode argument is "restore".
    - When the browser's input-assist features such as form auto-filling sets a value. The mode argument is "autocomplete".

#### Styling Web Components

- Inherited properties go past the shadow-dom boundary.
  - This is the default, and needs to be stopped if required otherwise.

```css
:host {
  /* This blocks inherited properties within the web-component */
  all: initial;
}
```

- Variables defined in `:root{}` are accessible within the shadow-dom.
- Style hooks through CSS custom properties
  - Variables can be called within a web-component, if they have been defined in the document outside.

```css
/* In the document */
custom-component {
  --custom-bg: black;
}
```

```css
/* In the custom-component */
:host([background]) {
  background: var(--custom-bg, #9E9E9E);
  border-radius: 10px;
  padding: 10px;
}
```

- Elements within the shadow-dom can use `part="..."` to defer their styling to the outside.

```html
<!-- Within a web-component named 'my-element' -->
<p part="intro">...</p>
```

```css
/* In the document's stylesheet */
my-element::part(intro) {
  color: red;
}
```

- A stylesheet can be imported within a web-component.
  - As expected, the stylesheet won't leak to the outside.

```js
template.innerHTML = /*html*/`
<style>
  @import './styles.css';
</style>

<div id="an-id" title="">...</div>
`;
```

- **slots** within a web-component are considered light-dom, so they are styled directly by the document's stylesheet.

## Events

### Event Flow

![Event Flow](./event-flow.png)

- event flow stages:
  - Capture: starts from the window and moves in the dom tree towards the target
      - to trigger the event during capture set `addEventListener("event", callback, true)`
  - Target: reaches the target element
  - Bubbling: moves through the dom tree back from the target to the window
- event flow is affected by the `bubbles` and `composed` properties on the event
  - **Bubbling and non-composed events**: `slotchange`
  - **Non-bubbling and non-composed events**: `mouseenter`, `mouseleave`
  - **Bubbling and composed events**: `focusin`, `focusout`, `auxclick`, `click`, `dblclick`, `mousedown`, `mousemove`, `mouseout`, `mouseover`, `mouseup`, `wheel`, `input`, `keydown`, `keyup`, `keypress`, `touchstart`, `touchend`, `touchmove`, `pointerover`, `pointerdown`, `pointermove`, `pointerup`, `pointerout`
- event propagation can be stopped at any point with `event.stopPropagation()`
  - multiple similar events within the same element that stopped the event propagation will still fire though; stopping the event even in this case requires calling `event.stopImmediatePropagation()`

### Event Properties

- Events have properties, which are either predetermined for built-in events, or need to be set for custom events.
  - `bubbles`: _true_ allows the event to propagate in the parent hierarchy
  - `composed`: _true_ allows the event to pass through the shadow-dom boundary
    - Events passing through this boundary are _retargeted_; their `target` changes to host element of the shadow-dom boundary they just passed through

```js
new Event('my-event', {
  bubbles: true,
  composed: true
});
```

### Predefined Events

- A `formData` event triggers when a form is submitted, and exposes the actual formData collected in the form.
  - These can be be manipulated/changed/updated during this event and before they are sent over to their destination.

## States

- Elements can be in different states (`disabled`, `hover`, `active`, etc), which define how they operate at the moment.
  - States can also be used for styling.

### Custom States

- Custom states can be implemented for web-components.
  - [The Hidden Power of Custom States For Web Components](https://www.dannymoerkerke.com/blog/the-hidden-power-of-custom-states-for-web-components/)

```js
// attach the internals
this.#internals = this.attachInternals(); // The # makes the internals private, not allowing consumers of the web-component to access them at all.

// add states
this.internals.states.add('playing');

// iterate over states
this.internals.states.forEach(state => {
 console.log(state); // playing
});

// remove states
this.internals.states.delete('playing');

// check for existence of states
this.internals.states.has('playing'); // true
```

- Note that the old syntax required `--` before the state name, and some browsers only support the old syntax still.
  - Adding a custom state without `--` will result in an error in such cases.
  - To use custom states in all browsers, one could wrap the methods in a `try-catch` to add the `--` when needed and/or keep track of what is supported.

- Custom states can be used in css with `:state('custom-state-name')`.
  - The old syntax was `:--custom-state-name`.
