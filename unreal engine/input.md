# Input

[Input Docs](https://docs.unrealengine.com/5.1/en-US/enhanced-input-in-unreal-engine/)

- To use the EnhancedInput system in C++, import the system in the build file (**ShadowsOfTheLichLord.Build.cs**).

```c++
PublicDependencyModuleNames.AddRange(new string[] { ..., "EnhancedInput" });
```

## Create Input Actions

- Two things are required, _input actions_ and _input mapping context_.
- Both are created as objects (_Content Browser -> Add -> Input -> ..._).

### Input Action

- Create one for each input action.
  - **Consume Input**: Determines if this input is usable.
  - **Value Type**: Determines the type of values the input returns.
    - **Digital**: Simple keypress.
    - **Axis1D**: -1 & +1
    - **Axis2D**
    - **Axis3D**

### Input Mapping Context

A collection of mappings for input actions.

- **Mappings**: A map that connects _input actions_ with specific keys.

## Declare the Use of an Input Mapping Context

- First create a **Player Controller**, if one does not exist, for the inputs to be used by.
- In the player controller blueprint:
  - Add an enhanced **input local player subsystem** node.
  - From the subsystem and the begin play node, create an **Add Mapping Context** node and select the context created above.
- Input contexts can be also removed at any time through the **Remove Mapping Context Node**, so controls can swapped as a whole when needed.

## Nodes

- **_Input Action Nodes_**
  - **Input Action Node**: The trigger of a specific input action.
    - _Triggered_: Activates as long as the input action persists.
    - _Started_: Activates once when the input action is first used.
    - _Ongoing_:
    - _Canceled_:
    - _Completed_:
    - _Action Value_ (can be split into individual axis):
    - _Elapsed Seconds_:
    - _Triggered Seconds_:
    - _Input Action_:
- **_General nodes_**:
  - **Enable/Disable Input**: Defines if an actor accepts/rejects input events originating from the _player controller_.
  - **Set Input Mode Game Only**: Only the player controller receives input events.
  - **Set Input Mode UI Only**: Only the UI receives input events.
  - **Set Input Mode Game and UI**: Both player controller and UI receive input events, with UI enjoying priority.

### Useful Procedures

#### Get Mouse Position from Center of Screen

- **Get Mouse Position on Viewport** -> split output to X (1) and Y (2)
- **Get Viewport Size** -> **Multiply** by 0.5 -> split output to X (3) and Y (4)
- Subtract (3) from (1) -> (5)
- Subtract (4) from (2) -> (6)
- Combine (5) and (6) to a vector or output them individually as needed.

#### Create an Input Dead Zone at the Center of the Screen

- **Get Mouse Position on Viewport** -> split output to X (1) and Y (2)
- **Get Viewport Size** -> **Multiply** by 0.5 -> split output to X (3) and Y (4)
- Subtract (3) from (1) -> (5)
- Subtract (4) from (2) -> (6)
- (5) **Less Than** a value (in px) -> (7)
- (6) **Less Than** a value (in px) -> (8)
- (7|8): true means we are in the dead zone, so input should not execute

#### Create an Input Dead Zone at the Edge of the Screen

- ...
