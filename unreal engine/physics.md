# Physics

- Actors (mesh components) must have **Simulate Physics = True** to be manipulated through the physics system.

## Movement

- Links:
  - [Unreal Engine 5 Tutorial - Physics Movement](https://www.youtube.com/watch?v=JV--qneCf0k)
- Physical movement happens through application of force on the actor.
- Useful Nodes:
  - **Add Force**
  - **Add Torque**
- Inside an actor blueprint, a **Physics Thruster** component can be used to apply force to the mesh itself at a specific point.
  - Related nodes: **Set Active (Physics Thruster)**, **Get/Set Thruster Strength**.

### Space

- Links:
  - [Physics Based Spaceship Movement](https://www.youtube.com/watch?v=sf_vesVOBIg)
  - ~~[Revealing the Secret to Flying the Millennium Falcon in Unreal Engine 5!](https://www.youtube.com/watch?v=jryE6dQV0Yw)~~
  - [Unlocking the Secret of Intergalactic Exploration: The Unreal Engine 5 spaceship Tutorial! [Part 1]](https://www.youtube.com/watch?v=QbW6LTW4_3Y)
  - [Unlocking the Secret of Intergalactic Exploration: The Unreal Engine 5 spaceship Tutorial! [Part 2]](https://www.youtube.com/watch?v=fIWiv_OjP2U)
  - [Unlocking the Secret of Intergalactic Exploration: The Unreal Engine 5 spaceship Tutorial! [Part 3]](https://www.youtube.com/watch?v=cGi31Tqs0Tw)

## Gravity

### Custom Gravity

- Links:
  - [Unreal Engine 5 Tutorial - Custom Gravity UE5.4 Preview](https://www.youtube.com/watch?v=CZK7QplEbJs)
  - [Well… CUSTOM GRAVITY in Unreal Engine 5.4 is 🤯](https://www.youtube.com/watch?v=Jw4Q27ZurO4)

- Blueprints
  - To define gravitational vectors, we can create a gravity field actor.
    - Create **Actor Blueprint** as a parent for different gravity fields.
      - In the parent blueprint, create a function **GetGravityDirection**.
        - Add an input in the function (type **Actor**), which will determine on which actor the gravity operates.
        - Add an output (type **Vector**) that gives of the gravity direction result.
    - Create a child to the parent blueprint.
      - Add a collision shape (sphere/plane/etc) in the blueprint, to act as the gravity field extend.
      - Override the **GetGravityDirection** function, and use the selected collision shape as its input.
        - *For example, if we use a sphere, we can use the **Get Actor Location** node for the actor input and the sphere collision, combined in a **Get Unit Direction (Vector)**, which will result in a gravity vector from the actor to the center of the sphere.*
  - Get the **Actor Blueprint -> Character Movement (CharMoveComp)** node.
    - Output the above to **Set Gravity Direction's target**.
    - On **Begin Overlap**, cast to the **gravity blueprint (parent)**, save the **Gravity Direction** output on a variable.
    - On **Tick**, apply the gravity direction variable (if valid) to the *gravity dir* in the **Set Gravity Direction** node.
    - On **End Overlap**, revert the gravity direction (set gravity field variable to null), if the gravity field has stopped overlapping (again, cast to the parent gravity field blueprint).
  - The above process can be improved by the following:
    - Output a gravity strength from the gravity field.
    - Use the **Get Overlapping Actors** in the actor blueprint, to get the total direction and strength of gravity if the actor is within multiple gravitational fields.
  - When using custom gravity, for movement, control rotation should be using the actor's rotation.

## Control

- Links:
  - [Physics Control, New UE5 Feature!!!](https://www.youtube.com/watch?v=7rlU2XaR-yo)
