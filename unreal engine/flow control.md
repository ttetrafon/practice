# Flow Control

Various nodes can be used to organise the flow of execution.
- **Branch**: A simple if-else statement, chooses the execution path depending on a boolean input.
- **Switch on**: Chooses an execution path by comparing a variable's value to specific values.
- **Flip Flop**: Executes two execution paths alternating between the two.
- **Sequence**: Executes all defined execution paths one after the other.
- **For Each Loop**: Executes specific commands for each and all items in an array. Then triggers the *completed- execution path.
- **Do Once**: Performs the output pin only once. If triggered again, it won't trigger the output. The node can be reset so it would allow the output to be executed again.
- **Do N**: As do once, but allows the execution to happen N times before blocking it.
- **While Loop**: Executes until the condition is false.
- **Gate**: A gate holds an internal state (open/closed) which allows or disallows execution of the output path. The following pins control the gate's use:
  - *Enter*: Execution trigger.
  - *Open*: Changes the state to open.
  - *Close*: Changes the state to closed.
  - *Toggle*: Changes the state to the opposite of the current state.
  - *Start Closed*: If selected, the gate starts closed, otherwise it starts open.
- **MultiGate**: When triggered, one of the output pins is executed.
  - *Reset*: Resets to allow new executions of the output pins.
  - *Is Random*: If selected, the output pins order of execution is random.
  - *Loop*: After all output pins have executed, reset automatically to start again.
  - *Start Index*: The first output pin to be executed on the first trigger.
- **Set Timer**: Used for polling, that is to call a certain functionality until a condition is met. Store the timer as a variable, and then use the **clear and invalidate timer by handle** to stop it when the condition is met.
