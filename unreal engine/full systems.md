# Game Systems

## Building

- Links:
  - [Space Ship Builder Demo](https://www.youtube.com/watch?v=fMa5HHg09RE)
  - [How to Place Builds with a Preview in Unreal Engine 5](https://www.youtube.com/watch?v=b88Dj_k9b84) & [How to Make a Log Building System in Unreal Engine 5](https://www.youtube.com/watch?v=4XqSDc-pEEI)

### Process

#### Starting Building

- When starting the use of a building system (for example, when selecting an object to build from a menu), instantiate a preview mesh (and store it as a variable) that will be used in the next steps.

#### Positioning

First, a built object needs to be positioned. There are two useful things to do for positioning, line traces to find a suitable location and snapping on existing built objects.

##### Line Tracing

- Create a function (could be named Line Trace) in the character controller.
  - This function needs to be called on Tick when the building system is active.
- When called, the function should project a line trace (**Line Trace by #** node).
  - start: the player's camera world position
  - end: the player's camera forward vector multiplied by the maximum distance we would allow to place an object
    - the maximum distance can be a variable controlled by some input
- The line trace's collision, or lack thereof, can be used to determine the (outputs) *location* and *rotation* of the targeted building item.

#### Preview

- By using the positioning output, and if the preview mesh is a valid variable, we can place a mesh component there.
- Usually, the preview mesh is assigned a preview material.
- Controls can be used to snap/unsnap, rotate, and move the preview mesh.

#### Placement

- A button can be used to finalise the process.
- When triggered, the object is instantiated where the preview was at the moment.

### Materials

- A building system usually uses either materials, components, or premade objects.
- When having many different materials, it's a good practice to implement common functionality within an **Interface** (for example pickup, remove collected from the scene, etc).
