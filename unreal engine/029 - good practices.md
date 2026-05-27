# Good Practices

## Coding

- Always create parent C++ classes for Blueprints, even if they will be left empty.

## Actor Setup

### Inheritance

- Create a base class that shares common logic among similar actors (like creatures, weapons, etc).
  - This base class should generally not be used anywhere on its own.
    - To avoid getting this class in menus when it's not going to be used, set it as **Class Settings -> Advanced -> Generate Abstract Class = true**
  - Always create base methods (like attack) to be used in behaviours/state centrally, and then extend them in children with their actual implementations.
- Then create children of the parent class, which should override and/or extend base functionality where appropriate.
  - When variance in the parent behaviour depends only on some variable (for example the death animation of each enemy type), then use the parent's functionality but have the child define its own variable value to feed to the parent's method.

### Data Driven Configuration

- For actors with similar functionality, driven by multiple, different values (like pickups in a game level).
- Define a class with all the required variables within an _instance editable_ & _exposed on spawn_ structure.
- Then create a `Data Table/Asset` for all the items, and use the structure's id as a variable in the class above.
  - This is to keep all data in the same place and avoid having to put populate each instance of the actor with the specific details for the structure.
