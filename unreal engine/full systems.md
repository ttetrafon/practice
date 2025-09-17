# Game Systems

## Building

- Links:
  - [Space Ship Builder Demo](https://www.youtube.com/watch?v=fMa5HHg09RE)
  - [How to Place Builds with a Preview in Unreal Engine 5](https://www.youtube.com/watch?v=b88Dj_k9b84) & [How to Make a Log Building System in Unreal Engine 5](https://www.youtube.com/watch?v=4XqSDc-pEEI)

### Process

#### Starting Building

- When starting the use of a building system (for example, when selecting an object to build from a menu), instantiate a preview mesh (and store it as a variable) that will be used in the next steps.

#### Positioning

First, a built object needs to be positioned. There are two useful things to do for positioning, line traces to find a suitable location and snapping on existing built objects.

##### Line Tracing

- Create a function (could be named Line Trace) in the character controller.
  - This function needs to be called on Tick when the building system is active.
- When called, the function should project a line trace (**Line Trace by #** node).
  - start: the player's camera world position
  - end: the player's camera forward vector multiplied by the maximum distance we would allow to place an object
    - the maximum distance can be a variable controlled by some input
- The line trace's collision, or lack thereof, can be used to determine the (outputs) *location* and *rotation* of the targeted building item.

#### Preview

- By using the positioning output, and if the preview mesh is a valid variable, we can place a mesh component there.
- Usually, the preview mesh is assigned a preview material.
- Controls can be used to snap/unsnap, rotate, and move the preview mesh.

#### Placement

- A button can be used to finalise the process.
- When triggered, the object is instantiated where the preview was at the moment.

### Materials

- A building system usually uses either materials, components, or premade objects.
- When having many different materials, it's a good practice to implement common functionality within an **Interface** (for example pickup, remove collected from the scene, etc).

## Multiplayer Chat

- [How to make Multiplayer Chat | Replication Tutorial | Kekdot | Unreal Engine 5](https://www.youtube.com/watch?v=PcfJiD6RTmo)
- Base setup: **Game Mode**, **Player Controller**
- UI:
  - Two **User Widgets**, *chat panel* (the actual panel) and *chat message* (component for each message).
    - *Chat Message*: *horizontal box* (desired on screen), *text box* (for player name; as variable) + *text box* (for actual message; as variable)
      - `On construct`, set the two text boxes with `Set Text`, promote the text inputs to variables, and set *instance editable = true* and *expose both on spawn = true*, so that both texts are defined when the message widget is created.
    - *Chat Panel*: *canvas*, *border*, *scroll box* (as variable) + *input box* (as variable; can be placed inside a *size box*)
      - For sending messages, on the *Input* `On Text Committed event` -> `Switch on ETextCommit (Enter)`/`Equals Enter` -> `Branch (true)` -> `Cast to Player Chat (object = get owning player)` -> trigger `Submit Chat (target = output from Cast to Player Chat; chat message = output from On Text Committed event; player name = output from Cast to Player Chat -> Get Player State -> Get Player Name)` custom event (see below in player controller) -> `Set Text (target = Chat Input Box; text = "")`.
      - For receiving messages: `Custom Event (Update Chat; params: PlayerName *text*, ChatMessage *text*)` -> `Create *Message* Widget` (connect event's params to widget's inputs) -> `Add Child (target: chat scroll box, content: output from create widget)` -> `Scroll To End (target: chat scroll box)`.
  - In the **Player Controller**:
    - `Begin Play` -> `Branch (condition: Is Local Player Controller)` -> [true] -> `Create Chat Panel Widget (owning player: self)` -> `Set Variable` -> `Add to Viewport`.
    - `Custom Event (SubmitChat; params: PlayerName *text*, ChatMessage *text*; replicates = Run on Server; reliable = true)` -> `For Each Loop (array = Get Game State -> Get Player Array)` -> `Cast to Custom Player Controller (object = For Each Loop array element -> Get Player Controller)` -> `ClientUpdateChat (target = Cast output; player name / message = SubmitChat outputs)`.
    - `Custom Event (ClientUpdateChat; params: PlayerName *text*, ChatMessage *text*; replicates = Run on Owning Client; reliable = true)` -> `Get Chat Panel (validated)` -> `Update Chat event (target = Get Chat Panel's output; player name / message = ClientUpdateChat's outputs)`.

## Selection Outline

### Material with Edge Detection

- [Outline Effect](http://www.michalorzelek.com/blog/tutorial-creating-outline-effect-around-objects/)
- On the target object, use: `Get Components by Tag` -> `Set Render Custom Depth (value = true)`.
- Create a material.
  - ...
- For the custom depth to work, we need a post-process volume.
  - Set it as **unbound**, so that it covers the full game area and not only its own geometry.
  - Add a post-processing material.
    - Set it to asset reference, and link the previsouly created material.

## Selection through Click

- Implement a click event.
- In the character/pawn/player controller:
  - `On Click (finished)`, add a `Get Actor Under Cursor for Objects/?`, linked to the player controller.
  - Use the hit event to trigger an interface message as appropriate.

## Vision

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
