# Material Editor

* Materials are PBR (Physically Based Rendering) set.
* A material is defined by a shader graph.

## Textures
* A **normal map** needs *Compression -> Compression Setting -> NormalMap* and *Texture -> sRGB -> false*.
* A **roughness map** requires *Compression -> Compression Setting -> GrayScale* and *Texture -> sRGB -> false*.

## Shader Graph

### Controls
* **Alt+Mouse0** on a link breaks it.
* **Ctrl+Mouse0** drags a link to another slot.

### Output Node
* **Base Colour** accepts a Vector3 value (colour).
* **Metallic** accepts a Scalar value.
  * Value must be between 0 and 1.
  * Default value is 0.
* **Roughness** accepts a Scalar value.
  * Value must be between 0 and 1.
#### Properties
*Select the output node to display the material's properties.*
* **Material**
  * **Material Domain** controls where the material will be applied.
    * **Surface** defines a material that will be applied to a mesh's surface.
    * **Volume** defines a material that will be applied to a mesh's whole volume.

### Shader Usage
On the left panel, under the **usage** section, select the cases in which the material will be used.

### Constants
* **Constant** defines a scalar value.
* **Constant3Vector** defines a colour.

### Coordinates
* **TextureCoordinate** controls the scale of a texture.
  * Output feeds in the *UV* texture's input, but through some math function *For example, to scale up a texture use he **Math.Multiply** node and combine the **TextureCoordinate** with a Scalar [a value closer to 0 will scale the texture up].*

### Math
* **LinearInterpolate** results in the median between two values.
  * The *alpha* input can be used to determine a weighted interpolation.

### Misc
* **FlattenNormal** is used to change the effect of a normal map.
  * The multiplier (second input) is a Scalar; the higher the value, the more pronounced the effect of the normal map gets.

## Material Instances
* On the material, *Mouse1 -> Create Material Instance*.
* A material is created to change property values on a material without the need to rebuild it every time something changes.
* Parameters are set that can control the properties above.

### Process
1. In shader graph:
   1. Select property to expose as parameter.
   2. *Mouse1 -> Convert to Parameter*.