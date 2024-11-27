# Game Systems & Persistence

The game's mode and state are held in specific blueprint classes.

## Game State

- Global state is held within the **Game Instance** and **Game State** classes.
- The **Game Instance** is initiated when the game starts and is destroyed only when the game is closed.
  - It can be selected in _Edit -> Project Settings -> Maps & Modes -> Game Instance_.
  - Is responsible for handling all the high level data that persists across level changes or game sessions.
  - Should be the landing point for logic that always needs to work, even when a level is not loaded properly (networking, saving, file handling, etc).
  - `Event Init` and `Event Shutdown` are the first and last things triggered during the game's lifetime.
  - Each game instance in a multiplayer game is individual and not connected to other game instances, meaning that data on it are never replicated.
- A **game state** is similar, but is attached to the level instead of the full game and exists in every running instance of the game in a multiplayer game.

## Game Mode

- The **GameModeBase** is the parent class responsible for creating the game mode. The **Game Mode** class is used to define the rules of the game and specifies the default classes used for the creation of **Pawn**, **Player Controller**, **Game State Base**, **HUD**, etc. Define these (custom) classes in the _class defaults_ of **Game Mode**.
  - The **Game Mode** is better used in multiplayer games, as it has more features than the **Game Mode Base**.
  - In C++, the default subclasses can declared like this:

`MyCharacter.h`

`MyCharacter.cpp`

`MyGameInstance.h`

`MyGameInstance.cpp`

`MyGameMode.h`

```c++
#include "CoreMinimal.h"
#include "GameFramework/GameMode.h"
#include "MyGameMode.generated.h"

UCLASS()
class SHADOWSOFTHELICHLORD_API AMyGameMode : public AGameMode
{
  GENERATED_BODY()
public:
  AMyGameMode();
};
```

`MyGameMode.cpp`

```c++
#include "MyGameMode.h"
#include "MyGameState.h"
#include "MyPlayerController.h"
#include "MyPlayerState.h"
#include "MyCharacter.h"
#include "UObject/ConstructorHelpers.h"

AMyGameMode::AMyGameMode() {
  GameStateClass = AMyGameState::StaticClass();
  PlayerStateClass = AMyPlayerState::StaticClass();
  PlayerControllerClass = AMyPlayerController::StaticClass();

  static ConstructorHelpers::FClassFinder<APawn> PlayerPawnBPClass(TEXT("/Game/Blueprints/BP_Character"));
  if (PlayerPawnBPClass.Class != nullptr) {
    DefaultPawnClass = PlayerPawnBPClass.Class;
  }
}

```

`MyGameState.h`

`MyGameState.cpp`

`MyPlayerState.h`

`MyPlayerState.cpp`

- Specify the default game mode for a project in project editor in _Edit -> Project Settings -> Default Game Mode_.
- Each level can have its own game mode. This is selected in _Project Settings -> Game Mode Override_.
- The **game mode** class, and all associated subclasses, can be chosen for each level independently.
  With the level open, select the required game mode in _Window -> World Settings -> Game Mode -> Game Mode Override_.
- The **game mode** exists only on the server of the game when running a multiplayer game (`Possess`).
- Subclasses can be swapped in runtime - mostly used when the player needs to change the character they are controlling.

### Player Controller

- Handles input and controls the player's character (`Pawn`/`Character`).
- An AI controller exists, which does the same for computer controlled pawns.
- In a multiplayer game, each connection (including the server) owns its own player controller.
  - To access the player controller in a multiplayer game, the following should be used:
    - AActor::GetOwner(): Returns the owner of the actor's instance.
    - APawn::GetController(): Returns the controller of the pawn/character instance.
    - AController::GetPawn(): Returns the pawn possessed by the controller.
    - APlayerState::GetPlayerController(): Returns the controller that created the player state instance. Remote clients will return _null_.

### Player State

- Belongs to each individual player, but is replicated to all running game instances in multiplayer.
- Used to hold all information that every player needs to know about their own character and other players.

## Levels

- A level is a distinct game play entity encompassing gameplay. Each level is loaded when needed.
- Default maps can be set in _Project Settings -> Maps & Modes -> Default Maps_.

### Persistent Levels

- Create a new level and instantiate all objects again (like the player character).
  - The `Open Level` node loads another level, either by name or reference.
  - `Load Level`
  - `Stream Level`

### Streaming Levels

- Streaming levels are usually set under a persistent level (**Window -> Levels**).
  - Load a level without unloading level-irrelevant classes (music, player character, etc).
  - Can set loading screens so that the level is loaded fully before gameplay resumes.
- **World Partition** can be used to streamline and automatically handle streaming levels that are part of a huge world.
  - For interconnected, but not on the same _level_ levels, streaming needs to be handled manually.
  - Children level properties:
    - **Change Streaming Method =**
      - _Blueprint_: loads the level only when needed; usually triggered through code
        - Need to also manually trigger the first level to appear as soon as the persistent level parent starts.
      - _Always Loaded_: keeps the level always loaded
        - Needed for a _loading volumes (**level streaming volume** actor)_ setup used with world partition.
        - If no streaming volume is associated to the level, it will always remain loaded.
  - **Level streaming volumes** can be used to automatically load relevant streaming levels/actors when the player actor is within them.
    - To associate a streaming level with a volume select the level and then add the appropriate streaming volume(s) to the _Level Details -> Streaming Volumes_ array.
- Nodes:
  - `Load Stream Level` starts loading the specified level asynchronously.
    - _Make visible after load_
    - _Should block on load_
  - Immediately before the `Load Stream Level`, we can have a `Create UI Widget` to display the loading screen. After the level has loaded, this can be hidden/destroyed.
  - Also change/disable the control scheme during this time.
  - `Set Actor Location` can be used to move the player character to the desired position on the newly loaded level.
  - `Unload Stream Level` unloads a level from memory asynchronously.

## Gameplay Loop

- **_Running_**: The gameplay loop is running normally.
- **_Paused_**: A game can be paused by using the `Set Game Paused` Blueprint. During the paused state the gameplay loop stops running.
- The gameplay loop is divided into **event ticks**.
  - How many event ticks (**framerate**) happen in the unit of time depends on how the game's performance is.
  - The `Event Tick` blueprint outputs the _delta seconds_, which is the actual time that the previous tick took to complete. This can be used to normalise actions happening on the tick, as not all event ticks have the same duration.
  - Event ticks can be enabled/disabled on specific actors with the use of `Set Actor Tick Enabled`.
    - If used on the level blueprint, they control all actors???
  - Custom event ticks can be created by using a `Custom Event` connected to a `Set Timer by Event` (with _looping = true_).
    - The `Clear and Invalidate Timer by Handle` can be used to stop the custom tick.
      - This can even be hooked to a `Delay` (`Set Timer by Event -> Delay -> Clear and Invalidate Timer by Handle`) to automatically stop it after a certain period of time.

### [Gameplay Tags](https://dev.epicgames.com/documentation/en-us/unreal-engine/using-gameplay-tags-in-unreal-engine)

- Tags can be used to mark actors for specific reasons.
- Tags live in the project settings and can be edited within _Project Settings -> Project -> Gameplay Tags_.
- Each tag can be used to derive allowed/disallowed functionality and interactions.
- Single tags can be used to easily compare variables with values.
  - A variable can be set as a query for a tag, automatic the logic that hides behind that lookup.
  - `Tag.MatchesTag(Tag)`, `Tag.MatchesAny(Tags)`, `TagMatchesAll(Tags)` can be used for comparisons of single tags.
- A **gameplay tag container** public variable is required to contain the tags on an actor.
  - `Container.HasTag(Tag)`, `Container.HasAny(Tags)`, and `Container.HasAll(Tags)` can be used to check if a tag container includes a specific tags.
- A container's tags can be added (`Add Gameplay Tag`) or removed (`Remove Gameplay Tag`) during gameplay.
- A good practice is to:
  - Create an Interface with a function to get a target's tag container.
  - Attach an actor component to all actors with basic tag functionality.
  - Use a tag container to store tags that change during gameplay.
- More complex tag lookups can be achieved with `FGameplayTagQuery`.

### [Gameplay Ability System (GAS)](https://dev.epicgames.com/documentation/en-us/unreal-engine/gameplay-ability-system-for-unreal-engine?application_version=5.2)

- A system to create reusable abilities for characters and/or pawns.
- Ability blueprints can be used as components in actors, where they can be triggered/executed as needed.
  - Abilities can be added with `Give Ability` where applicable. _For example, a specific sword attack can be given to the actor when they equip the sword in question_.
  - An ability can be activated with `Try Activate Ability by Class` or `Try Activate Ability by Tag`

#### [Gameplay Attributes & Effects](https://dev.epicgames.com/documentation/en-us/unreal-engine/gameplay-attributes-and-gameplay-effects?application_version=4.27)

- Attributes and Effects complete GAS.
