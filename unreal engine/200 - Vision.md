# Vision

- Links:
  - [Thinking Modular: Character Visibility with Components & Blueprint Interfaces](https://www.youtube.com/watch?v=VX98R3zNKxU)
- Vision systems determine what an actor can see/hear/sense around them.
- For players, it even determines what gets to be drawn in the screen, as what is not visible should not be drawn at all.

- Use `Actor Components` to manage visibility. The component will keep track of a *visibility stack*, which in turn determines the visibility status of the actor.
  - Create a variable (array) to keep track of the current stack value.
    - The stack is usually a *structure* with information required to compute the current visibility (e.g.: instigator (reference), priority, visibility change).
  - Create two events (add & remove) to manage the stack.
- Then use a `Blueprint Interface` to trigger the event when needed.
  - Events should be triggered on overlap (start/stop).
  - If the actor teleports or spawns, will need to check for overlapping actors to trigger a similar event.
  - Similarly, if the instigator is destroyed, then the event to clean up needs to be triggered.
