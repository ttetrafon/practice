# Math

## Transform (position, rotation, scale)

An actor class holds a *Transform* structure which contains three variables (3D vectors), location, rotation, and scale.

When a blueprint has actor components, the transforms of these components are known as *relative transforms* because they are relative to the parent's transform.

### Nodes

* **Get Actor Location**
* **Set Actor Location**: Places the actor to the specified position in the world.
* **Add Actor Offset**: Moves the actor relatively to their current position.
* **Teleport**: Teleports the actor to the specified location. If another actor occupies that place, the moving actor will be instead left nearby, just outside of the collision area.
* **Get Actor Rotation**
* **Set Actor Rotation**
* **Add Actor World Rotation**
* **Get Actor Scale 3D**
* **Set Actor Scale 3D**
* **Get Relative Location**
* **Set Relative Location**

## Math Nodes

* **Vector Length**
* **Normalize**
* **Dot Product**
* **Get Actor Forward Vector**
* **Get Actor Right Vector**
* **Get Actor Up Vector**
* **Math Expression**: Creates automatically a collapsed macro from the expression typed in the name of the node. For example `(PlayerLuck / 5) * (EnemyHp / 30)` will create the structure, input, and output nodes in a macro to perform the calculation.
