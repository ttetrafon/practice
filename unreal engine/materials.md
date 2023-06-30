# Material Editor

- Materials are PBR (Physically Based Rendering) set.
- A material is defined by a shader graph.

## Textures

- A **normal map** needs _Compression -> Compression Setting -> NormalMap_ and _Texture -> sRGB -> false_.
- A **roughness map** requires _Compression -> Compression Setting -> GrayScale_ and _Texture -> sRGB -> false_.

## Shader Graph

### Controls

- **Alt+Mouse0** on a link breaks it.
- **Ctrl+Mouse0** drags a link to another slot.

### Output Node

- **Base Colour** accepts a Vector3 value (colour).
- **Metallic** accepts a Scalar value.
  - Value must be between 0 and 1.
  - Default value is 0.
- **Roughness** accepts a Scalar value.
  - Value must be between 0 and 1.
- **Emmisive Colour** accepts a Constant (1 or 3) value.
  - Must be greater than 1 to have any effect, so usually need to multiply a colour texture with a scalar.

#### Properties

_Select the output node to display the material's properties._

- **Material**
  - **Material Domain** controls where the material will be applied.
    - **Surface** defines a material that will be applied to a mesh's surface.
    - **Volume** defines a material that will be applied to a mesh's whole volume.

### Shader Usage

On the left panel, under the **usage** section, select the cases in which the material will be used.

### Constants

- **Constant** defines a scalar value.
- **Constant3Vector** defines a colour.

### Coordinates

- **TextureCoordinate** controls the scale of a texture.
  - Output feeds in the _UV_ texture's input, but through some math function.
    - _To tile a texture, use the UTiling and VTiling properties of **TextureCoordinate**._
    - To scale up a texture use the **Math.Multiply** node and combine the **TextureCoordinate** with a Scalar [a value closer to 0 will scale the texture up]._

### Math

- **LinearInterpolate** results in the median between two values.
  - The _alpha_ input can be used to determine a weighted interpolation.

### Misc

- **FlattenNormal** is used to change the effect of a normal map.
  - The multiplier (second input) is a Scalar; the higher the value, the more pronounced the effect of the normal map gets.

## Material Instances

- On the material, _Mouse1 -> Create Material Instance_.
- A material is created to change property values on a material without the need to rebuild it every time something changes.
- Parameters are set that can control the properties above.
- In shader graph:
   - Select property to expose as parameter.
   - _Mouse1 -> Convert to Parameter_.

## Material Interfaces

- The standardised set of material properties within a *material function* can be called a *material interface*. The parameters have default names that will be the same across all materials.

