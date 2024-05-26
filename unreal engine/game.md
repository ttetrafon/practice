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

A level is a distinct game play entity encompassing gameplay. Each level is loaded when needed.

- Default maps can be set in _Project Settings -> Maps & Modes -> Default Maps_.

### Changing Levels

- The **Open Level** node can be used to load another level.
- **Load Level**
- **Stream Level**

## Gameplay Loop

- **_Running_**: The gameplay loop is running normally.
- **_Paused_**: A game can be paused by using the `Set Game Paused` Blueprint. During the paused state the gameplay loop stops running.
