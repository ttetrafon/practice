# Flow Control

Various nodes can be used to organise the flow of execution.

## Branching

- **Branch**: A simple if-else statement, chooses the execution path depending on a boolean input.
- **Switch on**: Chooses an execution path by comparing a variable's value to specific values.
- **Flip Flop**: Executes two execution paths alternating between the two.
- **Sequence**: Executes all defined execution paths one after the other.
- **For Each Loop**: Executes specific commands for each and all items in an array. Then triggers the *completed- execution path.
- **Do Once**: Performs the output pin only once. If triggered again, it won't trigger the output. The node can be reset so it would allow the output to be executed again.
- **Do N**: As do once, but allows the execution to happen N times before blocking it.
- **While Loop**: Executes until the condition is false.
- **Gate**: A gate holds an internal state (open/closed) which allows or disallows execution of the output path. The following pins control the gate's use:
  - _Enter_: Execution trigger.
  - _Open_: Changes the state to open.
  - _Close_: Changes the state to closed.
  - _Toggle_: Changes the state to the opposite of the current state.
  - _Start Closed_: If selected, the gate starts closed, otherwise it starts open.
- **MultiGate**: When triggered, one of the output pins is executed.
  - _Reset_: Resets to allow new executions of the output pins.
  - _Is Random_: If selected, the output pins order of execution is random.
  - _Loop_: After all output pins have executed, reset automatically to start again.
  - _Start Index_: The first output pin to be executed on the first trigger.
- **Set Timer**: Used for polling, that is to call a certain functionality until a condition is met. Store the timer as a variable, and then use the **clear and invalidate timer by handle** to stop it when the condition is met.

## Events

- Built-in and custom events can be used to control flow.
- Each event can trigger functionality on these conditions:
  - _Triggered_: Fires as long as the event persists.
  - _Started_: Fires once, when the event initially triggered.
  - _Ongoing_:
  - _Cancelled_:
  - _Completed_: Fires once, when the event stopped.
