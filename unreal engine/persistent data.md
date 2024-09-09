# Persistent Data

Gameplay data can be saved on the disk so a player can continue their game at a later time, after restarting the application.

## Saving Data

* Create the data structures (or any other serialisable variable) to be saved within the `SaveGame` blueprint; all variables must be marked as **serialisable**.
  * When storing complex objects, references must be set as *class references*.
* In a controller (usually the Game Instance, Game State, or Player Controller), create a variable to hold a reference to the `SaveGame` blueprint (object reference) created above.
  * If a reference is not stored, use the `Create Save Game Object` to create an instance, and then store it in the reference above.
* Create a variable (string) to hold the saved game's slot name.
* Set the variable values from the game state into the save game object.
* Use the `(Async) Save Game to Slot` node to save the data.
  * Use async when doing save operations during gameplay.
  * In the slot name, paths can be used to create subfolders in the save game folder. For example, *slot = player1/settings/general_settings* will create the path **./player1/settings/general_settings.sav**.
* Regardless of the save system employed in the game (player's choice, checkpoints, autosaves, continuous, etc), because the data that need to be saved are all over the place, a good practice is to use interfaces and hold the data to be saved in the Game Instance until the time they will be saved.

## Loading Data

* Check if the save game exists by using the `Does Save Game Exist` node with the appropriate slot name.
* If it exists, use `(Async) Load Game from Slot`.
  * Async loading is useful during level streaming or similar situations.
* Cast the result into the appropriate `SaveGame` blueprint by using the `Cast to` node.
  * When loading a class reference, check it with `Is Valid Class` before using it.
* Store the resulting blueprint in the reference slot created before.
* Use the data from the blueprint to update state variables.

## Deleting Data

* Check if the save game exists by using the `Does Save Game Exist` node with the appropriate slot name.
* Use the `Delete Game in Slot` node to remove the specific save game.
