# C++ Code

- Setup VS to work with Unreal Engine: [vs-tools-unreal-install](https://learn.microsoft.com/en-us/visualstudio/gamedev/unreal/get-started/vs-tools-unreal-install) and [visual studio extension](https://docs.unrealengine.com/5.3/en-US/using-the-unrealvs-extension-for-unreal-engine-cplusplus-projects/).
- To add a support for C++ code use _Tools -> New C++ Class_. This will create the class, plus all required files to use Visual Studio for coding.
- To work with C++ use _Tools -> Open Visual Studio_.
- To create a C++ file use _Tools -> New C++ Class_.
- A C++ class (as expected) is accompanied by a header class, where all definitions exist, and which is used by the engine to get information about the class.

## Basic Syntax

- Forward declaration (pointer to the class instead of linking the class itself) of properties/methods can be used with either raw pointers or **TObjectPtr**.

```cpp
// Normal declaration
UCameraComponent Camera;
// Forward declaration (raw pointer)
UCameraComponent* Camera;
// Forward declaration
TObjectPtr<class UCameraComponent> Camera;
```

## Macros

- Pre-specified C++ macros can be used for various purposes in an Unreal project.
- Unreal macros accept arguments (called **specifiers**), which modify how their children operate.

### Useful Macros

- `FORCEINLINE` can be used to force a method's code to be inlined, to avoid repeated function calls, which will result in a bit of performance gain.

## Reflection

- Unreal implements reflection.
- Properties and methods must be annotated with `UCLASS()`, `UFUNCTION()`, `UPROPERTY()`, or similar to be exposed to Unreal's reflection system.
- Markup elements accessible within reflection:
  - `UCLASS()`: Generates reflection data for classes deriving from `UObject`.
  - `USTRUCT()`: Generates reflection data for a `struct`.
  - `GENERATED_BODY()`: Creates all boilerplate code for the type.
  - `UPROPERTY()`: Provides the additional features an Unreal property has (Blueprint accessibility, replication, etc) [[docs](https://docs.unrealengine.com/4.27/en-US/ProgrammingAndScripting/GameplayArchitecture/Properties/Specifiers/)].
    - `VisibleAnywhere`: The properly can be inspected in all related Unreal windows, but not modified.
    - `BlueprintReadOnly`: The property can be read by blueprints but not modified.
    - `Category`: Specifies the category of the property when displayed in the blueprints details panel.
    - `meta`: Controls how the property interacts with other unreal systems.
      - `AllowPrivateAccess = "true"` allows a private member to be accessible from a blueprint.
  - `UFUNCTION()`: Provides the additional features an Unreal function/method has (extending in Blueprints, override Blueprint functions, etc).
    - `BlueprintNativeEvent`: The function can be overwritten in a blueprint, but it has a default C++ implementation. The method's default must must be named with the suffix `_Implementation` in this case.

## Garbage Collection

- Unreal has a garbage collection system in place.
- Valid references to objects must be maintained for the GC system to work.
- Objects are normally destroyed at a level's shutdown, unless **Destroy()** is called at any time. Destroyed objects are picked up by GC at its next cycle.

## Build-In Functions

- Unreal has many build-in functionality ready to be used in C++.
- The appropriate #includes need to be used each time.

### Useful Functions

- Cast<target_type> can be used to cast generic variable types (like the Actor returned from a ray tracing event) to a specific type.
  - Returns _true_ if it succeeded to cast the object.

## Functions and Parameters

- All input parameters with types relevant to Unreal must always be passed as references.
- This is done by using the **UPARAM(ref)** macro.

```cpp
void foo(UPARAM) (UPARAM(ref) AActor& actorRef)
```

- Functions can be assigned multiple outputs by setting the appropriate parameters as references.
- In the example below, param1 is copied as input, param2 is passed as input by reference, while param3 and param4 will be exposed as outputs on the blueprint.

```cpp
UFUNCTION(BlueprintCallable)
  void someFunction(int param1, UPARAM(ref) int& param2, int& param3, int& param4);
```
