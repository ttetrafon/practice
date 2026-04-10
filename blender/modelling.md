# Modelling

## Useful Addons/Extensions

- Extra Curve Objects
- Extra Mesh Objects
- Loop tools
- Bool Tool

## Creating Meshes

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
    - mirror (modifier) and/or auto-mirror (plugin)
    - inset: `i`
    - duplicate: `shift+d`
    - extrude: `e`/`alt+e`
    - select similar area: `shift+g`
    - bevel edges: `ctrl+b`
    - loop cut: `ctrl+r`
    - recalculate normals: `shift+n`
    - select similar: `shift+g`
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

### Easy Shapes

- **Cables** (or similar) can be created by adding (`shift+a`) a bezier curve, and then *curve data -> geometry -> bevel -> depth > 0*.

### Tips & Tricks

- When building smooth-shaded, curved models, loop cuts used to smooth the shape should be done perpendicular to the curvature of the model.
- Keep density of lines in both directions similar, and enough to define the required details.
- Use separate meshes to define smaller much smaller details or more detailed objects, and join them afterwards in a single object; do not join the meshes though.
- To create creases, do not use Blender crease tools, as these are not exported - instead, use bevels when needed.

### Preparing a Mesh for Use

- After building a mesh, assign to its whole a single shiny material to check if there are any reflection or lighting issues.

## AI Concept Art to Model

- Start with an AI generator for concept art.
  - [Leonardo AI](https://app.leonardo.ai)
    - Find an appropriate art style and note down the *seed* and *element* values.
- Feed that image to a 3D generation tool.
  - [NeROIC](https://zfkuang.github.io/NeROIC/)
  - [Sloyd](https://www.sloyd.ai/)
  - [Hyperhuman Rodin](https://hyperhuman.deemos.com/rodin)
    - Play with the tags that result in the best geometry, and note them down.
    - Before confirming, select the target *number of polygons* and *hyper* if needed.
  - [Meshy](https://www.meshy.ai/)
  - [Masterpiece X](https://www.masterpiecex.com/)
  - [Rokoko Vision](https://www.rokoko.com/products/vision)
  - [Spline](https://spline.design/)
  - [Dream Machine](https://lumalabs.ai/dream-machine)
