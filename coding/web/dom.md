# DOM

## Events

### Event Flow

![Event Flow](./event-flow.png)

- event flow stages:
  - Capture: starts from the window and moves in the dom tree towards the target
      - to trigger the event during capture set `addEventListener("event", callback, true)`
  - Target: reaches the target element
  - Bubbling: moves through the dom tree back from the target to the window

- event propagation can be stopped at any point with `event.stopPropagation()`
  - multiple similar events within the same element that stopped the event propagation will still fire though; stopping the event even in this case requires calling `event.stopImmediatePropagation()`

## Shadow DOM

- [What is the Shadow DOM?](https://web.dev/articles/shadowdom-v1#what_is_shadow_dom)

### Styling Web Components

- ...
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
