# Actors

- Anything placed in a _scene_ is an _actor_.

## Types of Actors

- Actor: The generic actor from which all other actors inherit their properties.
- Pawn: A pawn is an entity assigned to a player.
- Character: A specific type of pawn. Has extra functionality required to be used by a player.

## Ownership

- Each actor has an owner, which determines how each connection (in a multiplayer game) handles the actor's replication and updates.
- Children of an actor usually have the same owner as their parent.
- Components look at the outer (highest parent) component's parent actor to determine ownership.

## Actor Properties

### Class Defaults

### Creation & Spawning

- Blueprints need to inherit from `Actor`.
- C++ inherits from `AActor`.

```C++
class AMyActor : public AActor {}
```

- Stored actors can be spawned during gameplay.
  - Blueprints use the `Spawn Actor/AI From Class` blueprint nodes to do so.
  - C++ uses the `SpawnActor<>`, `SpawnActorDeferred<> & FinishSpawning<>`, ... functions.
- `Attach Actor to Component`: Attaches an actor to the referenced component in the _parent_ input.
  - Optionally, a _socket name_ can be used to identify the place where the actor will be attached.

### Constructor Script

- The constructor script is run at spawn time, or in the editor any time an actor is placed or updated.
  - _Class Settings -> Blueprint Options -> Run Constructor Script ..._.
- Construction parameters
  - In blueprints, they are created as variables, and then exposed by setting to true the _Instance Editable_ and _Expose on Spawn_ options.
  - In C++ constructor parameters cannot be created. Instead variables can be assigned immediately after their spawning.

### Structure

- An actor is composed of many different components, separated in **Scene Components** and **Actor Components**.
  - Scene components are the ones that are placed in the scene and define the actor in the 3D space.
  - Actor components are the ones that encapsulate the actor's functionality.

```C++
class USceneComponent : public UActorComponent {}
class UActorComponent {}
```

- Components in an actor can be added programmatically with `Add Component by Class`.
- Useful components:
  - A **widget** is a placeholder for an actual **User Widget** to be used in 3D space.
    - A widget's render properties are defined through `Set Draw Size`, `Set Widget Space`, and `Set Collision Enabled`.
    - The **User Widget** is then attached to the **Widget** through `Create Widget` and `Set Widget`.

### Hit Events

- Hit events are triggered from collision (`Event Hit`).
- Hit events are called every frame.

### Damage Events

- All actors have some basic functionality implemented concerning damage events.
  - Receiver nodes:
    - `Event AnyDamage`: Called on any damage event.
    - `Event PointDamage`: Called on point effects.
    - `Event RadialDamage`: Called on area effects.
  - Trigger nodes:
    - `Apply Damage`:
    - `Apply PointDamage`:
    - `Apply RadialDamage`:
    - `Apply RadialDamage with Falloff`:

## Hierarchies

- Actors can be attached to other actors directly (**Attach Actor to Actor** node).
  - This makes the child actor follow the parent at all times.
  - A **Mesh Socket** is required for attachment, as the child will be put on the specific socket when being attached.

## Pawns

- Pawns react to input events, and are always possessed by a controller (Player or AI).
  - A pawn can be possessed by a different entity at any time, giving control of the pawn to that entity (**Possess** and **Un-Possess** nodes).

## Characters

### Character Creation

- (BP) _Add Blueprint -> Blueprint Class -> Character_.
  - In the Viewport:
    - Add an appropriate mesh under **Mesh**.
    - If the camera will be following the player, also add a **Spring Arm** and a **Camera** underneath that.
      - Set "use pawn control rotation" in the camera details.
    - Can also enable **camera lag** and/or **camera rotation lag** for a more realistic approach (useful mostly in vehicle cameras).
- (C++) _Tools -> New C++ Class -> All Classes tab -> Character_
- In the current **Game Mode**, assign the new character blueprint as the _default pawn class_.

### Movement

- There are a few movement modes already implemented for characters (`Set Movement Mode`):
  - Walking
  - Flying
  - Swimming
  - Falling
