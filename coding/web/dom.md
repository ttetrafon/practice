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
