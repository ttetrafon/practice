# C++ Code

- To add a support for C++ code use _Tools -> New C++ Class_. This will create the class, plus all required files to use Visual Studio for coding.
- To work with C++ use _Tools -> Open Visual Studio_.
- To create a C++ file use _Tools -> New C++ Class_.

## Macros

- Pre-specified C++ macros can be used for various purposes in an Unreal project.
- Unreal macros accept arguments (called **specifiers**), which modify how their children operate.

## Build-In Functions

- Unreal has many build-in functionality ready to be used in C++.
- The appropriate #includes need to be used each time.

### Useful Functions

- Cast<target_type> can be used to cast generic variable types (like the Actor returned from a ray tracing event) to a specific type.
  - Returns _true_ if it succeeded to cast the object.

## Functions and Parameters

- All input parameters with types relevant to Unreal must always be passed as references.
- This is done by using the **UPARAM(ref)** macro.

```
void foo(UPARAM) (UPARAM(ref) AActor& actorRef)
```

- Functions can be assigned multiple outputs by setting the appropriate parameters as references.
- In the example below, param1 is copied as input, param2 is passed as input by reference, while param3 and param4 will be exposed as outputs on the blueprint.

```
UFUNCTION(BlueprintCallable)
  void someFunction(int param1, UPARAM(ref) int& param2, int& param3, int& param4);
```

# Blueprints

- Blueprints are complied to VM code, unlike C++ that is compiled to machine code directly. This adds an extra overhead, but it's unlikely to affect performance of functionality performed only a few time per frame.
- Blueprints act as classes.
  lll

## Operation

### Functions

- A function can be created within any blueprint, as a set of blueprints that will be reused.
- Functions can have a number of inputs, any number of blueprints to execute, and outputs.

### Macros

- Macros are like functions but can never be called from outside the specific macro.

### Variables

- A blueprint can contain variables, as it is a class.
- _Expose on spawn_: Allows a blueprint variable to be modified in scripts on in the editor.

## Blueprint Use

### Instantiate

- To instantiate a blueprint use the node **Construct Object from Class**.

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

#### Blueprints

- To create an interface: _Add -> Blueprint -> Blueprint Interface_.
- Inside an interface blueprint, create functions. These functions do not contain any logic, they have only their inputs and outputs defined.
- An interface is added in other blueprints through the _class settings panel -> interfaces tab_, and each function is then implemented separately.
  - The functions available from the interface will be listed in the blueprint panel.
  - To add functionality to these functions, _right click on them -> implement event_.
- The functions of an interface can be called from anywhere, and the appropriate object functionality will be triggered.
  - The function always requires an actor input, which is the object on which the interface function will be triggered.

#### C++

- In C++, to create an interface go to _tools -> new c++ class -> common classes -> unreal interface_.
- An interface contains only function definitions (usually `virtual`), like in blueprints.
- The class needs to be #included in the target actors, and then added as an implementation.

```
#include "MyInterface.h"

UCLASS()
class ACPP_TARGET : public AActor, public IMyInterface {}
```

# Blueprints & C++

- A project can utilise both C++ code and Blueprints.

## Links

- Blueprints need to be children of a C++ class to be connected with its functionality.
- A C++ class can be made inheritable by blueprints by declaring thus in the UCLASS() macro.

```
UCLASS(Blueprintable)
```

- Class properties can be accessed (get/set) in blueprints by making them public and defining the proper specifiers.
- The specifier _EditAnywhere_ allows the variable's default value to be accessed in the editor.

```
public:
  UPROPERTY(BlueprintReadOnly/BlueprintWriteOnly/BlueprintReadWrite, EditAnywhere)
    int thisIsSomeVariable;
```

- Instead, they can be exposed by creating appropriate getters/setters.
  - A _BlueprintPure_ function does not feature execution triggers when used as a blueprint.
  - A _BlueprintCallable_ function features execution triggers when used as a blueprint.

```
private:
  int thisIsSomeVariable;
public:
  UFUNCTION(BlueprintPure)
    int getSomeVariable();
  UFUNCTION(BlueprintCallable)
    void setSomeVariable(int value);
  UFUNCTION(BlueprintCallable)
    void setSomeVariableByReference(UPARAM(ref) int& value);
```

- C++ functions can also be implemented in blueprints.
- Such functions can be found in the _blueprint panel -> functions -> override -> foo_, and then implemented in the blueprint graph.

```
// .h
UFUNCTION(BlueprintCallable, BlueprintImplementableEvent)
  void foo(int bar);
```

- Similarly, native events can be used to connect C++ and blueprints.
  - It can be added in a blueprint under _blueprint panel -> functions -> override -> foo_.
- A function using a native event needs a declaration and an implementation.
  - To call the C++ implementation, right click on the function node and hit _add call to parent function_.

```
// .h
UFUNCTION(BlueprintCallable, BlueprintNativeEvent)
  void foo(string bar);
void foo_Implementation (string bar);
// -----------------------------------------------
// .cpp
void foo_Implementation (string bar) {
  // do stuff here...
}
```

## Events

- Events can be declared in a C++ function, and then captured by blueprints.

```
UFUNCTION(BlueprintImplementationEvent, Category="Weapon")
void PlayFireEffects()
```

## Move Blueprints to C++

- Blueprints should eventually be translated to C++ code for optimisation purposes.
- For each blueprint to be translated:
  - Create a base C++ parent class and assign it as the blueprint's parent (details panel).
    - Also do this for each blueprint referenced within this blueprint's functionality.
  - Recreate structures and enums used in the blueprint on their own.
  - Recreate functionality of the blueprint in the C++ code; all nodes are available within various Unreal header files.
  - Replace the functional nodes in the blueprint with the functions created in C++.