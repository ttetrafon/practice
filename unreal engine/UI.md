# UI

A UI is crafted from **Widget Blueprints (User Widget)**.

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
- Text can be formatted in various ways, depending on where the input comes from.
  - **Formate Text**: Can be used to inject variables in a string. Variables are denoted with brackets in the string, and each one creates an input pin in the format text node so it can be connected to a variable.
    - For example, `(mana)/(manaMax)` will display 150/200 when you have spent 50 of your mana pool.
  - `To Text` nodes allow for fine manipulation of the output text.
    - e.g.: `Float to Text` has a *minimum integer digits* input that can be set at 2 when displaying times so that they are always written as XX:XX:XX (for example 02:14:41).

- **Format Text**: Uses {} to create variables in a text line which can then be set from outside. For example, `You scored {number} points during round {roundNumber}!` will create two input nodes named *number* and *roundNumber* which can be used to set their values in the text line.

### Progress Bar

- A progress bar is filled from 0 to 100% depending on some variable (e.g.: a health bar).

### Size Box

- Useful as a base when there is need to define specific sizes.
  - By parametrising its properties, it can be used to adapt the widget wherever it is used.

## Events

- UI components can react to events, with logic defined in the widget's blueprint graph.
  - *Event Pre-Construct* happens when compiling the widget.
  - *Event Construct* happens when the widget is drawn on the screen.
  - *Event Tick* happens at every physics tick.

## Widget Manipulation

- Widgets can be manipulated through blueprints in the graph.
- To affect a widget, expose it as a variable and use custom events for updates.
- Can also use bindings to directly bind values on widgets with variables elsewhere.
  - Bindings are updated on tick though. For optimisation purposes, bindings should be used only for widgets that need to be updated in realtime and not only on specific events.

## Modular UI Elements

- Modular elements can be created by building small widgets (like a button with some text in it) and exposing its required properties, or by using inheritance.
  - To expose a property, use its *setter* in the graph, promote the input link to a variable, and set in the variable's properties **instance editable = true** and **expose on spawn = true**.
  - To expose events, create the appropriate event in the graph, create an event dispatcher, and then link the event to the *dispatcher's call*.
- Display is usually set to **desired** or **custom**.
- These can then be added in other widgets through the *User Created Palette*.
  - Exposed properties can be found in *details -> default* when selecting such a widget.
  - Event dispatchers can be found in the *details -> events* where they can be manipulated in the parent's graph normally.

### Named Slots

- A *named slot* is a widget that allows extending a widget blueprint by adding additional widgets to their instances.
- A *named slot* is an element to be added in a widget from the palette.
