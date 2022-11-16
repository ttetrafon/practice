# Game Systems & Persistence

The game's mode and state are held in specific blueprint classes.

## Game Mode
The `GameModeBase` is the parent class responsible for creating the game mode. The `Game Mode` class is used to define the rules of the game and specifies the default classes used for the creation of `Pawn`, `Player Controller`, `Game State Base`, `HUD`, etc.
Define these (custom) classes in the *class defaults* of `Game Mode`.

Specify the default game mode for a project in project editor in *Edit -> Project Settings -> Default Game Mode*.

Each level can have its own game mode. This is selected in *Project Settings -> Game Mode Override*.

The game mode class, and all associated subclasses, can be chosen for each level independently.
With the level open, select the required game mode in *Window -> World Settings -> Game Mode -> Game Mode Override*.

## Game State
Global state is held within the `Game Instance` class. A game instance is initiated when the game starts and is destroyed only when the game is closed.

The game instance can be selected in *Edit -> Project Settings -> Maps & Modes -> Game Instance*.
