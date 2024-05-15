# Blueprints

- Blueprints are complied to VM code, unlike C++ that is compiled to machine code directly. This adds an extra overhead, but it's unlikely to affect performance of functionality performed only a few time per frame.
- Blueprints act as classes. A blueprint's underlying C++ class can be inspected through `Tools -> C++ Header Preview`.

## Operation

### Functions

- A function can be created within any blueprint, as a set of blueprints that will be reused.
- Functions can have a number of inputs, any number of blueprints to execute, and outputs.

### Macros

- Macros are like functions but can never be called from outside the specific macro.

### Variables

- A blueprint can contain variables, as it is a class.
- _Expose on spawn_: Allows a blueprint variable to be modified in scripts on in the editor.

### Pure vs Impure Nodes

- Pure (green, with execution pin) nodes always run when encountered.
- Impure (blue, no execution pin) nodes cache their output after first encountered.

## Blueprint Use

### Instantiate

- To instantiate a blueprint use the node **Construct Object from Class**.

### Notes

- Many blueprints (like _Destroy Actor_) accept arrays of objects, although that is not indicated in the UI.

## Blueprint Function/Macro Library

- Blueprint: _Blueprint Function Library_.
- A collection of functions/macros that can be used in other blueprints (static functions).
- These functions can be called by any other blueprint; nodes with the function names are added automatically in the nodes list.

## Blueprint Inheritance

- Inheritance is done through _child blueprints_ or by adding a new blueprint and selecting the parent blueprint as its type.
  - In the parent, we create functions/events that will be shared between all children.
  - In a child blueprint, we can override the parent's events & functions if needed.
  - To extend functionality of a parent's function, use the **add call parent function** (from the context menu of the overridden item).

## Blueprint Communication

- Blueprints can access information from and call functions and events of other blueprints.

### Direct Communication

- Direct communication is achieved by keeping a reference of an actor in the actor that initiates the communication event.

### Casting

- An actor can store a reference of some type, and can then cast the reference to a child class to be able to use the child's functionality.
- This is usually useful when we are using nodes to reference game classes (like player controller, game mode, game instance, etc). These nodes provide the generic class, so casting is needed to access their functionality/properties.

### Level Blueprint Communication

- Actions and events that happen in a specific level are usually created within the level blueprint.
- Within the level blueprint, references to actors in the level can be easily created and used.

### Event Dispatchers

- An event dispatcher allows a blueprint to inform other blueprints that an event has happened.

### Binding Events

- A _bind event_ node can bind one event to another event or to an event dispatcher. When an event between these is triggered, all bound events are also triggered.

### Interfaces

- Interfaces are abstract classes which contain functions that can be triggered or implemented by other blueprints, creating links between them.

- To create an interface: _Add -> Blueprint -> Blueprint Interface_.
- Inside an interface blueprint, create functions. These functions do not contain any logic, they have only their inputs and outputs defined.
- An interface is added in other blueprints through the _class settings panel -> interfaces tab_, and each function is then implemented separately.
  - The functions available from the interface will be listed in the blueprint panel.
  - To add functionality to these functions, _right click on them -> implement event_.
- The functions of an interface can be called from anywhere, and the appropriate object functionality will be triggered.
  - The function always requires an actor input, which is the object on which the interface function will be triggered.

- In C++, to create an interface go to _tools -> new c++ class -> common classes -> unreal interface_.
- An interface contains only function definitions (usually `virtual`), like in blueprints.
- The class needs to be #included in the target actors, and then added as an implementation.

```cpp
#include "MyInterface.h"

UCLASS()
class ACPP_TARGET : public AActor, public IMyInterface {}
```
