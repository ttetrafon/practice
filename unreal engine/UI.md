# UI

A UI is crafted from **Widget Blueprints**.

A widget blueprint is a collection of UI objects and logic.

To display the UI, add it within any appropriate blueprint (level, player controller, character, camera, etc). This needs the following nodes in order:
1. **Create Widget**: Creates an instance of the UI element, which should usually be referenced as a variable also.
2. **Add to Viewport**: Appends the widget to the viewport so it is shown.
   - Can instead use **Add to Player Screen**, which is useful when creating a split screen interface.

## Canvas

- A canvas is required as the base for all other UI elements.
- *Fill Screen/Custom/...* determines how the canvas

## Text

### Nodes

- **Format Text**: Uses {} to create variables in a text line which can then be set from outside. For example, `You scored {number} points during round {roundNumber}!` will create two input nodes named _number_ and _roundNumber_ which can be used to set their values in the text line.
