# Meshes

## Creating a Mesh

- Meshes can be created either in Unreal with the modelling tools (limited functionality) or in separate, dedicated application (like Blender).

### Modelling

#### Basic Principles (Blender)

- Form (general shape)
  - Block-out the overall shape with basic shapes initially, to use as a template.
- Details
  - Start building the actual mesh, by identifying the most defining features of the mesh, and then filling in the gaps.
  - First add as less detail as possible, by building only the primary (largest) shapes present in the mesh.
  - Add the secondary shapes present in the mesh.
  - Add details on the primary features and shapes where needed.
  - Then add tertiary shapes and detail out the medium parts of the mesh.
  - Finally add the smallest details.
  - By making shape and detail passes (large, medium, small), consistency can be achieved.
  - Useful tools (and commands) while editing meshes:
    - add mesh: `shift+a`
    - grab: `g`, followed by `x`/`y`/`z` for specific axes
    - rotate: `r`, followed by `x`/`y`/`z` for specific axes
    - scale: `s`, followed by `x`/`y`/`z` for specific axes
    - apply transforms: `ctrl+a` (useful especially for uneven scale which affects editing)
    - auto-mirror (plugin)
    - inset: `i`
    - duplicate: `shift+d`
    - extrude: `e`/`alt+e`
    - select similar area: `shift+g`
    - bevel edges: `ctrl+b`
    - loop cut: `ctrl+r`
- Scale
  - Try to scale the meshes in real-size, and then adjust as needed within the game engine.
- Adaptation
  - Keep the model as easy to modify later as possible.
  - Can create a basis with non-destructive modelling, and apply stuff only before exporting.
  - Make sure the mesh can transform as needed by the rig it will be using.
- Reuse
  - Create minimal basic meshes and use modifiers to allow for easy duplication/creation of meshes.
  - Use Al+D to duplicate, so that duplicated meshes remain linked to each other, and changes in their geometry propagate to the duplicated ones.
- Surface Quality
  - Make loops to define sharp-edges in a mesh.
  - Properly align normals.
  - Keep odd shaped shapes to a minimum.
  - Lookout for pinches and bumps that negatively affect lighting.

### Preparing a Mesh for Use

- After building a mesh, assign to its whole a single shiny material to check if there are any reflection or lighting issues.

### AI Concept Art to Model

- Start with an AI generator for concept art.
  - [Leonardo AI](https://app.leonardo.ai)
    - Find an appropriate art style and note down the _seed_ and _element_ values.
- Feed that image to a 3D generation tool.
  - [NeROIC](https://zfkuang.github.io/NeROIC/)
  - [Sloyd](https://www.sloyd.ai/)
  - [Hyperhuman Rodin](https://hyperhuman.deemos.com/rodin)
    - Play with the tags that result in the best geometry, and note them down.
    - Before confirming, select the target _number of polygons_ and _hyper_ if needed.
  - [Meshy](https://www.meshy.ai/)
  - [Masterpiece X](https://www.masterpiecex.com/)
  - [Rokoko Vision](https://www.rokoko.com/products/vision)
  - [Spline](https://spline.design/)
  - [Dream Machine](https://lumalabs.ai/dream-machine)

## Importing a Mesh

- Drag and drop a mesh (fbx) into the _Content Drawer_ to import a mesh.
  - Select **Material -> Input Textures -> False** and **Material -> Material Input Method -> Do not create material**, as we will usually use materials already created in the project.
- Select the object and assign the default material(s).

### Normalisation

- Meshes should be scaled to fit the game's scale when imported.

## Static Meshes

- Rigid objects that do not change shape/form.

### Nanite

- The nanite system is dynamically changing the polygons of a static mesh for better visualisation depending on the distance from the camera.
- To enable nanites on a static mesh, open its details, set **Nanite Settings -> Enable Nanite Support -> True**, and click **Apply Changes**.
- Alternatively, right click on the static mesh within the content drawer, and select **Static Mesh Actions -> Nanite -> Enable**.
- To check problems with nanite in a scene, change it to display in _Nanite Visualisation -> Pixel Programmable / Overdraw_.
- `(Material) Nanite Pass Switch` returns true if the mesh has nanite enabled.

#### Nanite Settings

- **Nanite Displacement/Tessellation** is off by default and needs to be enabled.
- **Nanite Vertex** can be used to store information, like curvature, ambient occlusion, and normals, reducing texture overhead.
- **Nanite Splines**... and **Spline Mesh Actor**... (**Nanite Settings -> Max Edge Length Factor** can be used to smooth out issues with low-poly nanite splines)
- **Preserve Area** can be set to true so that really small details are not removed when the camera gets too far away (important with foliage for example, when tree leaves will disappear when the camera moves away).

### Collision

- In the mesh's details, change **Collision -> Collision Preset & Complexity** to what is required for the specific mesh.
- Can also replace the collision, either the simple or the complex one, with custom volumes as needed.

## Skeletal Meshes

- Meshes with movable components that physics can be applied to them.
- Support animations.

## Modelling Tools

- Plugins: **Modelling Tools Editor Mode**, **Static Mesh Modelling Tools**
- Accessed through **Modelling Mode** (top left in main viewport).
- Drag a mesh in the level and edit it.
  - Modelling tools are destructive, they apply to all the mesh's instances.
- When creating new objects, define _New Asset Location_ and _New Mesh Settings_ to the desired combination.
