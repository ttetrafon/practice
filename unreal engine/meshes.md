# Meshes

## Importing a Mesh

- Drag and drop a mesh (fbx) into the _Content Drawer_ to import a mesh.
  - Select **Input Textures -> False** and **Material -> Material Input Method -> Do not create material**, as we will usually use materials already created in the project.
- Select the object and assign the default material(s).

## Static Meshes

- Rigid objects that do not change shape/form.

### Nanite

The nanite system is dynamically changing the polygons of a static mesh for better visualisation depending on the distance from the camera.

To enable nanites on a static mesh, open its details, set **Nanite Settings -> Enable Nanite Support -> True**, and click **Apply Changes**.

Alternatively, right click on the static mesh within the content drawer, and select **Static Mesh Actions -> Nanite -> Enable**.

#### Nanite Settings

- ...

## Skeletal Meshes

- Meshes with movable components that physics can be applied to them.
- Support animations.

## Modelling Tools

- Plugins: **Modelling Tools Editor Mode**, **Static Mesh Modelling Tools**
- Accessed through **Modelling Mode** (top left in main viewport).
- Drag a mesh in the level and edit it.
  - Modelling tools are destructive, they apply to all the mesh's instances.
- When creating new objects, define _New Asset Location_ and _New Mesh Settings_ to the desired combination.
