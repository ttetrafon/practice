# Assets

## External Assets

- When using external assets (like from marketplace packs), install import them into a secondary project and migrate only what is needed from there.
- It's good practice to do that with the _starter content_ also.

### Migration

Assets can be moved between projects.

- Open the source project.
- Select a folder/asset you want to migrate.
- Put them within the _content_ folder of the target project.

## Level Instances / Assemblies

- A group of objects & actors can be combined into an assembly, which can then be inserted into other levels as a single actor.
- Level instances, when combined with nanite, can boost performance.
- Can be used in procedural generation workflows, especially with creating variants.
  - A good workflow with assemblies is to create a level with all all of a level instance's variants, so that they can be changed/adjusted in one place.
