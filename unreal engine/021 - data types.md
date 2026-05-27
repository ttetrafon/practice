# Data Types

## Main Class Types

- The `UObject` is the base class that includes most of Unreal's main features (garbage collection, networking support, reflection, etc).
- An `AActor` is an object that can be added in a level either from the editor (built) or during runtime (spawned). Includes networking support and can be replicated.
- A `UActorComponent` is the basis for anything attached to an Actor, either directly or as an Actor's nth child.
- A `UStruct` contains plain data and does not extend any other class.
- A `UEnum` represents an abstract enumeration.

### Notation

- All C++ classes are customary defined with a prefix (not required, but a good practice defined by Unreal).
  - ***U*** for generic objects deriving from `UObject`.
  - ***A*** for objects deriving from `Actor`.
  - ***F*** for generic classes and structures.
  - ***T*** for templates.
  - ***I*** for interfaces.
  - ***E*** for enums.
  - ***B*** for *booleans* or *unit8*.
