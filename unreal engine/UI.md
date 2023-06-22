# UI

A UI is crafted from **Widget Blueprints**.

A widget blueprint is a collection of UI objects and logic.

To display the UI, add it within any appropriate blueprint (level, player controller, character, camera, etc). This needs the following nodes in order:
1. **Create Widget**: Creates an instance of the UI element, which should usually be referenced as a variable also.
2. **Add to Viewport**: Appends the widget to the viewport so it is shown.
   - Can instead use **Add to Player Screen**, which is useful when creating a split screen interface.

It is usually better to create a UI screen on a persistent object, like the level blueprint or the player controller, but in some cases it could be tied to some other actor. For example, a single player game where you change between a human on foot, then drive a car, and then fly a spaceship may be better suited having a different UI for each of these modes, each one created with the object in question.

## Layout

The layout is described within a canvas by using anchors, distances, sizes, and alignments for each widget under the canvas.

## Widgets

### Canvas

- A canvas is required as the base for all other UI elements.
- *Fill Screen/Custom/...* determines how the canvas fits within the screen.

### Text

- Displays some text on the screen.

### Nodes

- **Formate Text**: Can be used to inject variables in a string. Variables are denoted with brackets in the string, and each one creates an input pin in the format text node so it can be connected to a variable.
  - For example, `(mana)/(manaMax)` will display 150/200 when you have spent 50 of your mana pool.

#### Nodes

- **Format Text**: Uses {} to create variables in a text line which can then be set from outside. For example, `You scored {number} points during round {roundNumber}!` will create two input nodes named _number_ and _roundNumber_ which can be used to set their values in the text line.

### Progress Bar

- A progress bar is filled from 0 to 100% depending on some variable (e.g.: a health bar).

## Widget Manipulation

- Widgets can be manipulated through blueprints in the graph.
- To affect a widget, expose it as a variable and use custom events for updates.
  - Can also use bindings to directly bind values on widgets with variables elsewhere. Bindings are updated on tick though.

