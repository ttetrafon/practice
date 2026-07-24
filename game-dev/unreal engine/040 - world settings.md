# World Settings

- Window -> World Settings

## World

- **Use External Actors -> True**
- **Use Actor Folder Objects -> True**: Useful for scenes worked by multiple people simultaneously.

### World Partition

- Existing map: _Tools -> (World Partition) Convert Level_.
- New map: ???
- Control the cells through _Window -> World Partition -> World Partition Editor_.
- In a map with world partition, **Data Layers** are used to stream parts of the level.
  - Controls can be found in _Window -> World Partition -> Data Layers Outliner_ and _Window -> Layers_.
  - Create data layers and actors as needed.
    - Each data layer has some options that apply only to the editor by default. Set **Is Runtime = True** for these to apply to the game itself.
- Blueprint Nodes:
  - `Data Layer Subsystem`
  - `Set Data Layer Running State` controls a layer's state (unloaded, loaded, activated) during runtime.
    - _In Data Layer_ can be changed into a variable and it will expose all available data layers.
    - _In Is Recursive_ controls ???
  - `Get Data Layer`
  - `Get Data Layer Running State` returns the layer's current state.

## Lightmass

- Advanced
  - **Force No Precomputed Lighting -> True** to keep only dynamic lighting effective. Useful when using Lumen (**post processing -> global illumination**).
