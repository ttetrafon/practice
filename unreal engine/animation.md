# Animation

- Animations are usually applied to skeletal meshes.
- Animation logic is defined in animation blueprints.

## Creating Animations

- Create the asset through *New Blueprint -> Animation -> Animation Blueprint*.
  - Select the skeleton that will be used; the skeletal mesh used on the game object to be animated.
  - In the AnimGraph create the logic of the animation.

### Animation Graph

- A **State Machine** is used to determine how animations are changed.
- Inside the state machine, create states (animations) and rules (arrows) that connect the different states.
- Blend spaces can be used to transitions between animations.
