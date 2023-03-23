# C++ Code

To add a support for C++ code use _Tools -> New C++ Class_.
This will create the class, plus all required files to use Visual Studio for coding.

# Blueprints

Blueprints are complied to VM code, unlike C++ that is compiled to machine code directly. This adds an extra overhead, but it's unlikely to affect performance of functionality performed only a few time per frame.

Blueprints act as classes.

## Operation

### Functions

A function can be created within any blueprint, as a set of blueprints that will be reused.

Functions can have a number of inputs, any number of blueprints to execute, and outputs.

### Macros

Macros are like functions but can never be called from outside the specific macro.

### Variables

A blueprint can contain variables, as it is a class.

- *Expose on spawn*: Allows a blueprint variable to be modified in scripts on in the editor.

## Blueprint Use

### Instantiate

To instantiate a blueprint use the node **Construct Object from Class**.

## Blueprint Function/Macro Library

A collection of functions/macros that can be used in other blueprints - much like static functions.

# Blueprints & C++

A project can utilise both C++ code and Blueprints.

## Links

Blueprints need to be children of a C++ class to be connected with its functionality.

## Events

Events can be declared in a C++ function which can be captured by blueprints.

> UFUNCTION(BlueprintImplementationEvent, Category="Weapon")
>
> void PlayFireEffects()
