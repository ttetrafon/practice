# UI

A UI is crafted from **Widget Blueprints**.

A widget blueprint is a collection of UI objects and logic.

To display the UI, add it within any appropriate blueprint (level, player, camera, etc).

## Text

### Nodes
* **Format Text**: Uses {} to create variables in a text line which can then be set from outside. For example, `You scored {number} points during round {roundNumber}!` will create two input nodes named *number* and *roundNumber* which can be used to set their values in the text line.