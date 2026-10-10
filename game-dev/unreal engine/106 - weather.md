# Weather

## Fog

### World Fog
- ...
- **Fog Screen Space Scattering**
  - `Exponential Height Fog -> Advanced -> Enable Fog Screen Space Scattering = true`

### Local Fog

- `Add -> Visual Effects -> Local Fog Volume`
- Settings:
  - **Details**
    - ...
  - **Console**
    - `r.LocalFogVolume.GlobalStartDistance: #`: controls how close the player will be when the fog disappears
      - set to `0` or `1` if the player will be moving inside the fog
