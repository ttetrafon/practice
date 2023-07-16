# Game Systems & Persistence

The game's mode and state are held in specific blueprint classes.

## Game Mode

- The **GameModeBase** is the parent class responsible for creating the game mode. The **Game Mode** class is used to define the rules of the game and specifies the default classes used for the creation of **Pawn**, **Player Controller**, **Game State Base**, **HUD**, etc.
  Define these (custom) classes in the _class defaults_ of **Game Mode**.
- Specify the default game mode for a project in project editor in _Edit -> Project Settings -> Default Game Mode_.
- Each level can have its own game mode. This is selected in _Project Settings -> Game Mode Override_.
- The **game mode** class, and all associated subclasses, can be chosen for each level independently.
  With the level open, select the required game mode in _Window -> World Settings -> Game Mode -> Game Mode Override_.
- The **game mode** exists only on the server of the game when running a multiplayer game (`Possess`).
- Subclasses can be swapped in runtime - mostly used when the player needs to change the character they are controlling.

## Game State

- Global state is held within the **Game Instance** and **Game State** classes.
- The **game instance** is initiated when the game starts and is destroyed only when the game is closed.
  - It can be selected in _Edit -> Project Settings -> Maps & Modes -> Game Instance_.
- A **game state** is similar, but is attached to the level instead of the full game and exists in every running instance of the game in a multiplayer game.

## Player State

- Belongs to each individual player, but is replicated to all running game instances in multiplayer.
- Used to hold all information that every player needs to know about other players.

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

## (Player) Controller

- The controller is attached on pawns and handles input.
- An AI controller exists, which does the same for computer controlled pawns.
