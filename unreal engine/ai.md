# AI

## Navigation

- [AI navigates](https://dev.epicgames.com/documentation/en-us/unreal-engine/navigation-system-in-unreal-engine) a level using a navigation mesh.
  - A navigation mesh is created by using all collision information in the level.
  - *Quickly add to project -> Volumes -> Nav Mesh Bounds Volume*, and expand it to cover the full level.
    - Clicking *P* with the nav volume selected will display the navigation mesh overlay on the level objects.
  - To use the navigation systems, add the module `"NavigationSystem"` in the `.Build.cs` file under the PublicDependencyModuleNames.

## AI Actors

- An AI actor's class is a child of `Character`.
- An AI actor requires the following properties usually:
  - `TObjectPtr<class UPawnSensingComponent> PawnSense;`: Controls how the actor senses pawns.
  - `TObjectPtr<class USphereComponent> Collision;`: Used as a trigger for actions when nearby to other actors.
