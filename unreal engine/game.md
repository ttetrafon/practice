# Game Systems & Persistence

The game's mode and state are held in specific blueprint classes.

## Game Mode

The `GameModeBase` is the parent class responsible for creating the game mode. The `Game Mode` class is used to define the rules of the game and specifies the default classes used for the creation of `Pawn`, `Player Controller`, `Game State Base`, `HUD`, etc.
Define these (custom) classes in the _class defaults_ of `Game Mode`.

Specify the default game mode for a project in project editor in _Edit -> Project Settings -> Default Game Mode_.

Each level can have its own game mode. This is selected in _Project Settings -> Game Mode Override_.

The game mode class, and all associated subclasses, can be chosen for each level independently.
With the level open, select the required game mode in _Window -> World Settings -> Game Mode -> Game Mode Override_.

## Game State

Global state is held within the `Game Instance` and `Game State` classes. A game instance is initiated when the game starts and is destroyed only when the game is closed.

The game instance can be selected in _Edit -> Project Settings -> Maps & Modes -> Game Instance_.

A game state is similar, but is attached to the level instead of the full game.

## Levels

A level is a distinct game play entity encompassing gameplay. Each level is loaded when needed.

- Default maps can be set in *Project Settings -> Maps & Modes -> Default Maps*.

### Changing Levels

- The **Open Level** node can be used to load another level.
- **Load Level**
- **Stream Level**

