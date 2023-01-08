# Input

https://docs.unrealengine.com/5.1/en-US/enhanced-input-in-unreal-engine/


## Create Input Actions

Two things are required, *input actions* and *input mapping context*.

Both are created as objects (*Content Browser -> Add -> Input -> ...*).

### Input Action

Create one for each input action.

* **Consume Input**: Determines if this input is usable.
* **Value Type**: Determines the type of values the input returns.
  * **Digital**: Simple keypress.
  * **Axis1D**: -1 & +1
  * **Axis2D**
  * **Axis3D**

### Input Mapping Context

A collection of mappings for input actions.

* **Mappings**: A map that connects *input actions* with specific keys.


## Declare the Use of an Input Mapping Context

* First create a **Player Controller**, if one does not exist, for the inputs to be used by.
* In the player controller blueprint:
  * Add an enhanced **input local player subsystem** node.
  * From the subsystem and the begin play node, create an **Add Mapping Context** node and select the context created above.

##### Notes

* Input contexts can be also removed at any time through the **Remove Mapping Context Node**, so controls can swapped as a whole when needed.


## Nodes
* ***Input Action Nodes***
  * **Input Action Node**: The trigger of a specific input action.
    * *Triggered*: Activates as long as the input action persists.
    * *Started*: Activates once when the input action is first used.
    * *Ongoing*:
    * *Canceled*:
    * *Completed*:
    * *Action Value* (can be split into individual axis):
    * *Elapsed Seconds*:
    * *Triggered Seconds*:
    * *Input Action*:
* ***General nodes***:
  * **Enable/Disable Input**: Defines if an actor accepts/rejects input events originating from the *player controller*.
  * **Set Input Mode Game Only**: Only the player controller receives input events.
  * **Set Input Mode UI Only**: Only the UI receives input events.
  * **Set Input Mode Game and UI**: Both player controller and UI receive input events, with UI enjoying priority.
