# World Settings

- Window -> World Settings

## Lightmass

- Advanced
  - **Force No Precomputed Lighting -> True** to keep only dynamic lighting effective. Useful when using Lumen (post processing -> global illumination).

## Packaging

- **OFPA** can be enabled (`World Settings -> Use External Actors`) to unpack all actors in a level, so that multiple people can work simultaneously on the same level.
  - Note that this never applies to sublevels, the setting must be turned on individually to each of them.
  - Filenames of external actors are encoded. Use the `Changelists` windows to determine what has changed.
