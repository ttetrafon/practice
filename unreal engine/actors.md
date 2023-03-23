# Actors

## Types of Actors

### Actor

- The generic actor from which all other actor inherit their properties.

### Pawn

- A pawn is an entity assigned to a player.
- Pawns react to input events, and are always possessed by a player controller.

### Character

- A specific type of pawn.

#### Character Creation

1. _Add Blueprint -> Blueprint Class -> Character_.
   1. In the Viewport:
      1. Add an appropriate mesh under **Mesh**.
      2. If the camera will be following the player, also add a **Spring Arm** and a **Camera** underneath that.
         1. Set "use pawn control rotation" in the camera details.
2. In the current **Game Mode**, assign the new character blueprint as the _default pawn class_.

## Actor Properties

### Components

### Constructor Script

## Spawning Actors During Gameplay

Stored actors can be spawned during gameplay.

Use the `Spawn Actor/AI From Class` blueprint nodes to do so.

## Nodes

- **Attach Actor to Component**: Attaches an actor to the referenced component in the _parent_ input. Optionally, a _socket name_ can be used to identify the place where the actor will be attached.
