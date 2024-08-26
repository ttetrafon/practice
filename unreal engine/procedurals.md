# Procedural Generation

## Procedural Content Generation (PCG)

- Links:
  - [You Should Start Using Data Assets in PCG | UE 5.4](https://www.youtube.com/watch?v=QRxuq_aEptI&list=PLiYs34CsHngw0somZ229yyVkEF7HBXGBV&index=5&t=3s)
  - [Electric Dreams sample project](...)
- Can be used to procedurally generate content during runtime.
  - Async node based procedural general.
  - Can be handled at a macro level or for finer details.
  - Can be used with meshes, blueprints, particle systems, etc.
    - A level instance can be saved as a PCG Data Asset and to be used by the PCG system.
  - Custom nodes can be implemented through Blueprint, C++, or nested PCG Subgraphs.
- Based on `PCG Graph`. Then the following are required to set a PCG system up:
  - **Structure variables**: Create a structure to hold the variables the system will need to operate. For example:
    - Actor (Actor): To determine an actor to be used. Or instead, can use a mesh, a material, etc to determine what to distribute.
      - Static Mesh (Static Mesh): To determine which mesh will be used.
      - Material (Material): To define the material to be used for the mesh.
    - Weight (Float): For selection priority.
    - Scale (Vector)
    - Rotation (Rotator)
    - etc
  - **Primary data asset**
    - Create a `Primary Data Asset` blueprint.
    - Under variables, add one, and select the structure type from the previous step, convert it (*right click on type*) into an array, and expose it (*open eye symbol*).
  - **Data asset**:
    - Create a blueprint with type of the primary data asset created in the previous step.
