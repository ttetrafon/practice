# Animation

## Skeletal

- Don't forget to name the bones, as their names are used in Unreal for direct access.

## Mesh Keys

### Export to Unreal Engine

- Make sure the animations are looping properly (if needed).
- Select **mesh** and **armature**.
  - Animations will appear in the _playback_, and should align properly with the frame count.
- **File -> Export -> FBX**:
  - **Include**
    - Limit to Selected Objects: true
    - Object types: armature, mesh
  - **Transform**
    - Apply Scaling: All Local
    - Forward: X Forward
    - Up: Z Up
    - Apply Unit: true
    - Use Space Transforms: true
  - **Armature**
    - Only Deform Bones: false
    - Add Leaf BoneS: false
  - **Bake Animation**: true
    - Key All Bones: true
    - NLA Strips: false
    - All Actions: false
    - Force Start/End Keys: true
