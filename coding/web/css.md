# CSS

## Variables

- A variable is defined with `--var_name: var_value;`.
  - Usually done in `:root`, but can be put anywhere.
  - Note that where the variable is defined defines its scope.
- Access a variable's value with `var(--var_name, fallback_value)`.
  - The actual variable declaration may be omitted though, and then defined only within any context it is needed.

```css
.stack {
  display: flex;
  flex-direction: column;
  gap: var(--stack-gap, 1rem);
}

.card {
  --stack-gap: 1.5rem;
}

.tile {
  --stack-gap: 0.5rem;
}
```

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
  isolation: isolate
  /* will fix the blur being hidden because the ::before & ::after selectors
  are behind on the stack, even when there is no position defined on the element */
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

## Positioning

### Scrolling

- Scrolling may affect the position of elements, especially when sticky or absolute elements get in the way. This can be mitigated with scrolling margins/paddings:
  - `scroll-margin: #`
  - `scroll-padding: #`
  - `scroll-behaviour: smooth`

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
- **_Prose_ spacing**: It is generally good to adapt spacings based on the size of the text.

```css
.prose > * + * {
  margin-block-start: var(--prose-flow, 1em);
}
```

- In tailwind: [Tailwind typography plugin](https://v1.tailwindcss.com/docs/typography-plugin).

## Decoration

### Borders

#### [Corner Shape](https://developer.mozilla.org/en-US/docs/Web/CSS/Reference/Properties/corner-shape)

- **values**:
  - round,
  - scoop,
  - square,
  - notch
  - superellipse(#)
    - #: (-infinity, infinity)

```css
.box {
  width: 200px;
  height: 200px;
  background-colour: red;
  border: 10px solid black;
  border-radius: 50px;
  corner-shape: scoop
}
```
