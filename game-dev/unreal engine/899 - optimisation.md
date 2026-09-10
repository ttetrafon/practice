# Optimisation

## Event Tick vs Events

- When using **Actors** do not put too many calculations within the _event tick_.
  - Instead, use _events_ or _timer events_ for such stuff, especially for calculations that are not needed on every frame.

## Textures

- Reduce texture sizes based on need.
  - Set `Texture -> Details -> Compression -> Max Size` to what is really needed.

## Soft/Async Loading

- When referencing game objects in scripts/blueprints, make them variables and switch their type (`Details -> Variable -> Variable Type`) to **Soft Object Reference**.
  - A soft reference needs to be loaded beforehand; with `Async Load Asset`

## Class Dependencies

- Keep classes/blueprints focused and relative to one thing each, so each loads only the minimum required dependencies.
- Use interfaces for communication between classes/blueprints and avoid direct references where possible.

## Graphics

- Allow for graphic quality changes.

## Nanite

- Do not mix nanite with normal messes, use either one of the systems only.
