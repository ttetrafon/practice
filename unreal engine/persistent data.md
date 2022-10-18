# Persistent Data

Gameplay data can be saved on the disk so a player can continue their game at a later time, after restarting the application.


## Saving Data
* Create the data structures to be saved within the `SaveGame` blueprint.
* In a controller, create a variable to hold a reference to the `SaveGame` blueprint (object reference) created above.
  * If a reference is not stored, use the `Create Save Game Object` to create an instance, and then store it in the reference above.
* Create a variable (string) to hold the saved game's slot name.
* Set the variable values from the game state into the save game object.
* Use the `Save Game to Slot` node to save the data.

## Loading Data
* Check if the save game exists by using the `Does Save Game Exist` node with the appropriate slot name.
* If it exists, use `Load Game from Slot`.
* Cast the result into the appropriate `SaveGame` blueprint by using the `Cast to` node.
* Store the resulting blueprint in the reference slot created before.
* Use the data from the blueprint to update state variables.

## Deleting Data
* Check if the save game exists by using the `Does Save Game Exist` node with the appropriate slot name.
* Use the `Delete Game in Slot` node to remove the specific save game.
