# Blueprints

Blueprints are complied to VM code, unlike C++ that is compiled to machine code directly. This adds an extra overhead, but it's unlikely to affect performance of functionality performed only a few time per frame.

# Blueprints & C++

## Links
Blueprints need to be children of a C++ class to be connected with its functionality.

## Events
Events can be declared in a C++ function which can be captured by blueprints.
> UFUNCTION(BlueprintImplementationEvent, Category="Weapon")
> void PlayFireEffects()

