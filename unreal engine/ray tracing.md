# Ray Tracing
A trace is a projected vector from a point of origin towards a specified direction that looks for collisions with specific objects on its path.

The collision is controlled by the channel on which the trace belongs, while the specified types of objects are the only ones that will trigger a collision event.

## Trace Settings
The channels and object types can be changed in *Project Settings -> Engine -> Collision*

The default channels are **Visibility** and **Camera**.

The default object types are **World Static**, **World Dynamic**, **Pawn**, **Physics Body**, **Vehicle**, **Destructible**, and **Projectile**.

Actors and components need to define how they react to each trace channel and object type. The response can be *ignore*, *overlap*, or *block*.

## Nodes
* **Break Hit Result**: Destructures a trace hit result into the available variables.
* **Line Trace for Objects**: Tests for collisions along a specified line and returns a hit result for the first matching actor that it hits.
  * *Start*: Defines where the trace line starts.
    * If the camera is to be used, use the *get player camera manager* to access the current camera.
  * *End*: Defines where the trace line ends.
    * For a camera trace, go with *camera global position + camera forward vector x some multiplier*.
  * *Object Types*: Specifies the types of objects that collision events will be triggered if hit.
  * *Trace Complex*: If true the trace will test against the actual object mesh, otherwise it will test against simplified geometry.
  * *Actors to Ignore*: Array of specific actors to be ignored by the trace.
  * *Ignore Self*: If true the blueprint that invoked this function will ignore itself from the trace.
* **Multi Line Trace for Objects**: As above, but returns all actors it hit.
* **Line Trace by Channel**: As above, but instead of looking for actors of specific type will check every actor on the selected channel.
* **Multi Line Trace by Channel**: As above, but instead of a line it uses a sphere moving along the line to check for collisions. *The shape trace functions are much more calculation intensive than the line ones though.*
* **Sphere Trace for Objects**
* **Capsule Trace for Objects**
* **Box Trace for Objects**
