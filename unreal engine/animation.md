# Animation

- Animations are usually applied to skeletal meshes.
- Animation logic is defined in animation blueprints.

## Creating Animations

- Create the asset through _New Blueprint -> Animation -> Animation Blueprint_.
  - Select the skeleton that will be used; the skeletal mesh used on the game object to be animated.
  - In the AnimGraph create the logic of the animation.
- Animations can be build inside Unreal, in _modelling -> weight paint bones_ and _animating using sequencer_.
- Cloth simulations can be created in the _Cloth Editor_.

### Animation Graph

- A **State Machine** is used to determine how animations are changed.
- Inside the state machine, create states (animations) and rules (arrows) that connect the different states.
- Blend spaces can be used to transitions between animations.

### Curve Atlas

- Can be used to create a list of graphs (curves) for animation.
- Useful because it can be applied to multiple objects (like UI widgets), and each one selects which curve it will use for animation.

- **Add -> Miscellaneous -> Curve Atlas** to create the atlas.
  - **Add -> Miscellaneous -> Curve** to create a curve.
  - In the atlas, add the curve in the details panel.
- In the widget, the values of the curve (each curve is a vector3) can be applied to any property that we want animated (e.g.: the blue value can animate an icon on the vertical axis).

### Material Properties

- Animation can be achieved within a material graph. This way it is all done in the GPU.
- A way to do this is to create macros that can be used in the material graph to cause specific effects.
