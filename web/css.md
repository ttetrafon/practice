# CSS

## [Stacking Context](https://developer.mozilla.org/en-US/docs/Glossary/Stacking_context)

- [Isolation](https://developer.mozilla.org/en-US/docs/Web/CSS/Reference/Properties/isolation)

```css
.gradient-shadow {
  background: linear-gradient(
    45deg,
    hsl(var(--clr-orange)),
    hsl(var(--clr-blue))
  );
  position: relative;
  isolation: isolate /* will fix the blur being hidden because the ::before & ::after selectors are behind on the stack, even when there is no position defined on the element */
  /* `isolation` can also be applied to the elements with the negative z-index directly */
}

.gradient-shadow::before {
  filter: blur(0.75em);
}

.gradient-shadow::after {
  opacity: 0.5;
  filter: blur(2em);
}

.gradient-shadow::before,
.gradient-shadow::after {
  content: "";
  position: absolute;
  inset: 0;
  z-index: -1;
  background: inherit;
}
```

## Sizing

- [Width](https://developer.mozilla.org/en-US/docs/Web/CSS/Reference/Properties/width)
- [Inline Size](https://developer.mozilla.org/en-US/docs/Web/CSS/Reference/Properties/inline-size)
  - `min-inline-size` can replace `text-wrap` when resizing causes an text overflow.
- [Aspect Ratio](https://developer.mozilla.org/en-US/docs/Web/CSS/Reference/Properties/aspect-ratio)
  - When used for images, also use `content-fit` to fix stretching.

```css
img.profile-pic {
  aspect-ratio: 1;
  object-fit: cover;
}
```

## Typography

- [Text Wrap](https://developer.mozilla.org/en-US/docs/Web/CSS/Reference/Properties/text-wrap)
  - **balance**: distributes the text among available lines - useful for headers and/or annotations
  - **pretty**: avoids typographic [runt](https://en.wikipedia.org/wiki/Widows_and_orphans)
