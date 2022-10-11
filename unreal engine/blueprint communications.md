# Blueprint Communication

Blueprints can access information from and call functions and events of other blueprints.

## Direct Communication
Direct communication is achieved by keeping a reference of an actor in the actor that initiates the communication event.

## Casting
An actor can store a reference of some type, and can then cast the reference to a child class to be able to use the child's functionality.

This is usually useful when we are using nodes to reference game classes (like player controller, game mode, game instance, etc). These nodes provide the generic class, so casting is needed to access their functionality/properties.

## Level Blueprint Communication
Actions and events that happen in a specific level are usually created within the level blueprint.

Within the level blueprint, references to actors in the level can be easily created and used.

## Event Dispatchers
An event dispatcher allows a blueprint to inform other blueprints that an event has happened.

## Binding Events
A *bind event* node can bind one event to another event or to an event dispatcher. When an event between these is triggered, all bound events are also triggered.