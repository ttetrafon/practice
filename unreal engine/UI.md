# UI

- Links:
  - [Unreal Engine 5 Tutorial - Widgets Part 1: Canvas Panel](https://www.youtube.com/watch?v=u4tfL6UpRWE)
  - [How to create Modular and Scalable UI systems in Unreal Engine](https://www.youtube.com/watch?v=v9k-J2GeEKI)
  - [Mastering UI Panels and Pop-ups in Unreal Engine](https://www.youtube.com/watch?v=_0aNOo2JVSI)
- A UI is crafted from **Widget Blueprints (User Widget)**
- A widget blueprint is a collection of UI objects and logic.
- To display the UI, add it within any appropriate blueprint (level, player controller, character, camera, etc). This needs the following nodes in order:
  1. **Create Widget**: Creates an instance of the UI element, which should usually be referenced as a variable also.
  2. **Add to Viewport**: Appends the widget to the viewport so it is shown.
     - Can instead use **Add to Player Screen**, which is useful when creating a split screen interface.
- It is usually better to create a UI screen on a persistent object, like the level blueprint, the player controller, or the HUD, but in some cases it could be tied to some other actor.
  - For example, a single player game where you change between a human on foot, then drive a car, and then fly a spaceship may be better suited having a different UI for each of these modes, each one tied to a different actor or even better the HUD (see Layout below).

## Layout

- The layout is described within a canvas by using anchors, distances, sizes, and alignments for each widget under the canvas.
- A **HUD** blueprint can be used to organise stuff in the screen.
  - A HUD needs to be assigned in the Game Mode.
  - `Create Widget` nodes can go in the HUD class then instead of other gameplay classes, for better control.
  - `Client Set HUD` updates/changes the HUD during runtime, allowing for changes in the UI when needed.
  - A HUD can be accessed programmatically from through `Game Controller` -> `Get HUD`.
- The *ZOrder* property can be used to layout different widgets vertically, allowing for overlaps.
- Use layers for when many different UI widgets need to alternate quickly (like an inventory screen, a quests list, a map, and so on).
- When a widget needs to be hidden, change its visibility to *collapsed*, a state which does not consume any resources.
- For visible widgets that are not interactable, make their visibility to *not hit-testable (self & children)*.
- For screens that change a lot, use an overlay as a HUD, with appropriate areas for stacks of widgets (layers). Then create abstract methods that can push/pop widgets in/from these layers.

## Widgets

### Canvas

- A canvas is required as the base for all other UI elements.
- *Fill Screen/Custom/...* determines how the canvas fits within the screen.
- Nodes:
  - `Set Render Transform Angle` rotates the full canvas.
- Canvas panels should be used sparingly, as they consume a lot of system resources.

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

### Retainer Box

- Can be used to lower the render frequency of its child.

### [Invalidation Box](https://dev.epicgames.com/documentation/en-us/unreal-engine/using-the-invalidation-box-for-umg-in-unreal-engine)

- Wraps any widget that needs to be updated only some of its properties is changed.
- Invalidation boxes should be used to wrap any UI widgets that won't change much, or at all.
  - If used on a fast-changing component, they will worsen performance instead.

### [Named Slot](https://dev.epicgames.com/documentation/en-us/unreal-engine/using-named-slot-widgets-for-ui-templates-in-unreal-engine)

- A named slot keeps a place empty where another widget can be added later.

### Spacer

- Cheap widget to be used to add space between other widgets in boxes.

### Overlay

- Allows widgets to be stacked on top of each other.

## Common Properties

- **Cursor** can be used to define how the cursor looks when hovering about the specific UI element.

## Events

- UI components can react to events, with logic defined in the widget's blueprint graph.
  - *Event Pre-Construct* happens when compiling the widget.
  - *Event Construct* happens when the widget is drawn on the screen.
  - *Event Tick* happens at every physics tick.

## Animations

- Widget animations are controlled through the **animations drawer** (at the bottom of the screen).
- To create an animation:
  1. *Add Animation* and name it.
  2. On the *Tracks* panel, *Add* the component to be animated.
     1. On the track itself, click *+* to add the property(ies) to animate.
     2. Select the property and adjust it as needed in the graph.
     3. Add keys as needed for more complex transitions.
     4. Don't forget to adjust the starting properties in the details (when the animation is not selected).
  3. Finally, link appropriate events with to `Play Animation (Forward/Reverse)` nodes as needed.
- Animations on materials should be animated through the materials and not the sequencer for better performance.

## Icons

- For better performance, UI icons can be loaded from a *custom icon font* sheet and be used through their unicode values.
  - Can use [Font Forge](https://fontforge.org/en-US/) to create such fonts easily.

## Widget Manipulation

- Links:
  - [Unreal Engine 5 Tutorial - Widgets Part 2: Bindings](https://www.youtube.com/watch?v=wX11aU6mZYU)
- Widgets can be manipulated through blueprints in the graph.
- To affect a widget, expose it as a variable and use custom events for updates.
- Can also use bindings to directly bind values on widgets with variables elsewhere.
  - Bindings are updated on tick though. For optimisation purposes, bindings should be used only for widgets that need to be updated in realtime and not only on specific events.
- When creating & Destroying widgets make sure that references are not left behind; otherwise the garbage collector won't clean them up.

## Modular UI Elements

- Modular elements can be created by building small widgets (like a button with some text in it) and exposing its required properties, or by using inheritance.
  - To expose a property, use its *setter* in the graph, promote the input link to a variable, and set in the variable's properties **instance editable = true** and **expose on spawn = true**.
  - To expose events, create the appropriate event in the graph, create an event dispatcher, and then link the event to the *dispatcher's call*. If the widget is set as a variable, the event dispatchers will appear under the events details section.
- Display is usually set to **desired** or **custom**.
- These can then be added in other widgets through the *User Created Palette*.
  - Exposed properties can be found in *details -> default* when selecting such a widget.
  - Event dispatchers can be found in the *details -> events* where they can be manipulated in the parent's graph normally.
- Use the **View-Model** to update data in modular elements, as it completely decouples the code with the view.
- For multiple, similar widgets, use an **SMeshWidget**.
  - Art is passed to the widget through the **Slate Vector Art Data**.
  - In the mesh widget, use the `Draw Mesh` and `Enable Instancing` functions.
  - Parameters and position of the mesh widget are controlled through the `FVector4 Data` property.
    - X, Y: screen position
    - Z: Scale
    - W: Address

### Named Slots

- A *named slot* is a widget that allows extending a widget blueprint by adding additional widgets to their instances.
- A *named slot* is an element to be added in a widget from the palette.

## Useful Procedures

### Custom Cursor

- Use the **Set Show Mouse Cursor** node to make the cursor visible.
- Create a *png* image with the desired cursor shape.
- Create a new `User Widget` blueprint.
- Insert a **Canvas** and set its size to *custom*.
- Set the dimensions a typical cursor size (72px * 72px for example).
- In the UI canvas, create an **Image** and assign the cursor image to it.
  - Position the image in the canvas so that the pointer is exactly at the middle of the canvas.
- In **Project Settings -> Software Cursors** assign (type of cursor as needed) the widget from above.

### "Photograph" 3D Objects

- [How To Create An Icon Of Any Mesh In Unreal Engine 5](https://www.youtube.com/watch?v=EpthBJJ9S-o)
- In the project, create a folder to store the rendered targets.
  - Inside the folder, create a `Render Target` blueprint.
    - Set its resolution as needed (256 x 256 for example if creating icons)
- Create a material for the icons.
  - Set:
    - **Material Domain -> User Interface**.
    - **Blend Mode -> Translucent**
  - Import the render target as `Texture Sample`.
    - Connect:
      - *RGB* channel to the *Final Colour*.
      - *A* channel to `One Minus` and to *Opacity*.
- An actor can be used to capture 2D images of 3D objects, either in game or in the editor.
  - Add a `Scene Capture 2D` component to the actor.
    - Select the previously created render target as the component's **texture target**.
  - Add a static mesh component to the actor, and select the mesh to capture.
  - Add two planes, named *Icon* (for preview) and *Background* (if needed).
    - Add the icon material to the Icon plane.
- Finally **Render Target -> Create a Static Texture**.
  - Set:
    - **Min Alpha = 1**
    - **Max Alpha = 0**
