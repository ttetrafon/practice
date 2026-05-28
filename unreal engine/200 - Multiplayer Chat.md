# Multiplayer Chat

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
