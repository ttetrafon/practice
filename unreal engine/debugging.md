# Debugging

- Links:
  - [Unreal Debugging Tools I Wish I knew earlier!](https://www.youtube.com/watch?v=XC_ntVpHg80)

## Console

- Open the console by hitting **`**.

## Logging

- In **project root/Config/DefaultEngine.ini**, set the following line:

```ini
[Kismet]
ScriptStackOnWarnings=TRUE
```

- The **PrintScreen** node is useful when we want to track constantly changing values without looking at specific blueprint details.

## Commenting Out Blueprint Nodes

- **Editor Preferences -> Allow Explicit Impure Node Disabling = True** allows to comment out nodes (*Right Click ->  Disable (Do Not Compile)*).

## Breakpoints

- Useful when interested in a specific moment of execution and what happens after that moment.
- Set **Editor Preferences -> Blueprint Break on Exceptions = True**
- Blueprints:
  - The debugger can be found in *Tools -> Debug -> Blueprint Debugger*
  - To add breakpoints, select any node within a blueprint and *Right Click -> Toggle Breakpoint*

## Control State at Runtime

### Call In Editor

- In any blueprint, select/create a function for testing and mark it as **Call in Editor**.
- This allows the function to be called when selecting the details of any actor/blueprint that features that function.

### Cheat Manager

- Create a blueprint of type **Cheat Manager**.
- Select its use in the player controller, under **Cheat Class**.
- In the cheat manager, create functions to use during runtime, and mark them as **Exec**.

### Debug Camera

- While running in the editor, hit **;** or with the **ToggleDebugCamera** console command.
  - We can move the player character to where the debug camera is looking, with the **Teleport** console command.
- The debug camera blueprint can be extended to add custom functionality.
  - The new debug camera blueprint needs to be selected in the custom cheat manager blueprint, under **Debug Camera -> Debug Camera Controller Class**.

## Check State at Runtime

### Gameplay Debugger

- Can be enabled with **'** or the **enableGDT** console command.
- ...

### Visual Logger

- Can be used to record and analyse any running system.
