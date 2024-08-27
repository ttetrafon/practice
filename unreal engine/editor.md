# Editor Settings

- *Edit -> Editor Preferences*
  - **Invert Middle Mouse Pan** controls the direction of the pan while holding Mouse3 in the viewport.
- In **Viewport -> Snap**, can add/change the predefined grid snap distances.

## Shortcuts

- Anywhere in the viewport:
  - **Ctrl+#** marks the current camera's location as a bookmark. Can recall the location by pressing **#**.
  - **Q**/**W**/**E** selects translation/rotation/scale mode.
- With a game object selected:
  - **F** moves the camera to the object.
  - **Ctrl+B** opens the object's location in the content drawer.
  - **Ctrl+E** opens the object's blueprint.
  - **Alt+mouse move** duplicates the selected object.
  - **Shift+mouse move** moves the camera alongside the object in the world.
- **Ctrl + Right/Left Mouse Click**: Copy/Paste properties.
- In blueprint editor mode:
  - With selected nodes:
    - **Q** aligns their execution nodes.
    - **Shift+S** aligns them at the bottom.
    - **Shift+W** aligns them at the top.
    - **Shift+A** aligns them at the left.
    - **Shift+D** aligns them at the right.
- **Ctrl+P**: Open the lookup window to search all assets in the game.
- **Ctrl+Click** on a property selects all objects currently in the scene with that property and value.

## Useful Tools

- **Content Browser -> Other Filters -> Show Redirectors** can reveal all redirectors within the assets window.
- **Content Drawer -> Content (directory) -> Right Click -> Fix Up Redirectors in Folder** is useful when moving assets between folders, as links to the moved assets may break during the process.
- In the colour picker, colours can be saved in presets for later. These presets are shared with the game and can be accessed from any colour picker anywhere.

## Project Settings

### Collaboration

- **OFPA** can be enabled (`World Settings -> Use External Actors`) to unpack all actors in a level, so that multiple people can work simultaneously on the same level.
  - Note that this never applies to sublevels, the setting must be turned on individually to each of them.
  - Filenames of external actors are encoded. Use the `Changelists` windows to determine what has changed.
