# Blueprints & C++

- A project can utilise both C++ code and Blueprints.

## Links

- Blueprints need to be children of a C++ class to be connected with its functionality.
- A C++ class can be made inheritable by blueprints by declaring thus in the UCLASS() macro.

```cpp
UCLASS(Blueprintable)
```

- Class properties can be accessed (get/set) in blueprints by making them public and defining the proper specifiers.
- The specifier _EditAnywhere_ allows the variable's default value to be accessed in the editor.

```cpp
public:
  UPROPERTY(BlueprintReadOnly/BlueprintWriteOnly/BlueprintReadWrite, EditAnywhere)
    int thisIsSomeVariable;
```

- Instead, they can be exposed by creating appropriate getters/setters.
  - A _BlueprintPure_ function does not feature execution triggers when used as a blueprint.
  - A _BlueprintCallable_ function features execution triggers when used as a blueprint.

```cpp
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

```cpp
// .h
UFUNCTION(BlueprintCallable, BlueprintImplementableEvent)
  void foo(int bar);
```

- Similarly, native events can be used to connect C++ and blueprints.
  - It can be added in a blueprint under _blueprint panel -> functions -> override -> foo_.
- A function using a native event needs a declaration and an implementation.
  - To call the C++ implementation, right click on the function node and hit _add call to parent function_.

```cpp
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

```cpp
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
