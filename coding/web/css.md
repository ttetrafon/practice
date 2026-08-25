# CSS

## Programming

### Variables

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

#### _Private Properties_

- We can define variables with fallbacks in a way that each selector can have either define its own or use the fallback.
- When modifying the theme through data-classes we can then define the base variable so that applies instead of the default.

```css
:root {
  --primary: yellow;
  --accent: blue;
}

button {
  --_button-colour: var(--button-colour, white);
  --_button-colour-hover: var(--button-colour-hover, firebrick);

  background-color: var(--_button-colour);
  color: contrast-color(var(--_button-colour));

  &:hover, &:focus {
    background-color: var(--_button-colour-hover);
    color: contrast-color(var(--_button-colour-hover));
  }

  &[data-theme="primary"] {
    --button-surface: var(--primary);
  }

  &[data-theme="accent"] {
    --button-surface: var(--accent);
  }
}

```

### [Stacking Context](https://developer.mozilla.org/en-US/docs/Glossary/Stacking_context)

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

### Methods

- Colours can be defined by predetermined functions:
  - `rgb(#red #green #blue)`/`rgba(#red #green #blue / #alpha)` (legacy):
  - `hsl(#hue #saturation #light)`/`hsla(#hue #saturation #light / #alpha)` (legacy):
  - `oklch()`:

### CSS Reset

- Generally it is good practice to add a CSS Reset file (or include its contents) in a website, with the purpose of controlling properly any browser defaults that vary from browser to browser.

```css
:root {
  /*  */
  interpolate-size: allow-keywords;
}

html {
  /* Reserver the space for the scrollbar, so its appearance does not cause sideways movement. */
  scrollbar-gutter: stable;
}

body {
  margin: 0;

  /* For a body split into header, main, and footer */
  min-block-size: 100svh;
  display: grid;
  grid-template-rows: auto 1fr auto;

  font-family: var(--ff-base);
  background: var(--ff-background);
  color: var(--text-primary);
  font-size: var(-fs-0);
  line-height: 1.6;
}
```

## Styling

### Positioning

#### Scrolling

- Scrolling may affect the position of elements, especially when sticky or absolute elements get in the way. This can be mitigated with scrolling margins/paddings:
  - `scroll-margin: #`
  - `scroll-padding: #`
  - `scroll-behaviour: smooth`

### Sizing

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

### Typography

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

### Decoration

#### Borders

##### [Corner Shape](https://developer.mozilla.org/en-US/docs/Web/CSS/Reference/Properties/corner-shape)

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

##### Adjustable Border Radius

- A border-radius that gets smaller when it reaches the edge of the screen, but stays on when it is displayed with margins on the outside.

```css
html {
  overflow-y: scroll;
  scrollbar-gutter: stable;
}

.card {
  border-radius: clamp(0px, 100vw - 100%, 50px);
}
```

- If we need this relative to a parent, we make the parent a container and switch using container units.

```css
.parent {
  container-type: inline-size;
}

.card {
  border-radius: clamp(0px, 100cqi - 100%, 50px);
}
```


## Design

### Colours

- Use variables for base colours, and derive other colours from them.
  - `contrast-colour(#colour)`: returns a colour that has the best contrast with '#colour'.
    - e.g.: useful for making text show correctly due to changes in the background.
  - `oklch(from var(#base-color) #l #c #h)`: stars from the base colour and modifies any of its value(s).
    - To get the same value, use `h`, `s`, and/or `h` instead of defining a new value.
  - `hsl(from var(--base-toast-color) #h #s #l / #a)`: same as above, but worst in general due to calculations.
