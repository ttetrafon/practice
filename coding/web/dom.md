# DOM

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

## Shadow DOM

- [What is the Shadow DOM?](https://web.dev/articles/shadowdom-v1#what_is_shadow_dom)

### Styling Web Components

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
