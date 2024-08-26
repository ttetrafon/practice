# Graphics

## Debugging

- An analysis of VRAM use in the scene can be found in *Tools -> Render Resource Viewer*.

## Lighting

- Lighting can be achieved through lights or emmisive materials.
- For real time lighting, use Lumen.
  - Project Settings:
    - **Dynamic Global Illumination: Lumen**
    - Reflection Method: Lumen
    - Software Tracing Mode: Global
    - Generate Mesh Distance Fields: True

### Light Sources

- All required lighting settings can be found in *Window -> Env. Light Mixer*.
- **Directional Light** is like sunlight, covers a whole area falling from a specific angle.
- **Point Light**
- **Spotlight**
- **Rectangle Light**
- **Sky Light** takes the sky and projects light on the scene depending on the sky texture.
  - It requires two other components to work (toggle *affects world* setting in case it does not take effect properly):
    - **Visual Effects -> Sky Atmosphere**
    - **Lights -> Directional Light**
  - **Light -> Realtime Capture -> On** when using with Lumen for realtime light conditions.
- **Project settings**
  - **Enable Virtual Texture Support -> True**
  - **Support Sky Atmosphere Affecting Height Fog -> True**

### Fog

- Use the following to hide the void of the world:
  - **Visual Effects -> Exponential Height Fog**
    - *Start Distance -> max (5000)*, so it does not affect the scene around the camera.
    - *Fog Inscaterring Color -> Black*
    - *Directional Inscaterring Color -> Black*
  - **Visual Effects -> Sky Atmosphere**

## Volumetrics

- Volumes can be used to create real clouds, fog clouds, explosions, etc.

## Post Processing

- Post processing settings in a scene are controlled through the *PostProcessingVolume* object.
- A camera is affected only while it is within the post-process volume; a post-process volume does not cover the entire scene but only parts of it, unless set as *infinite extend (unbound)*.

- Lens
  - Exposure
    - **Metering Mode**
      - **Auto Exposure** simulates the real life change of exposure of someone's eyes when lighting conditions change abruptly.
    - **Manual** is better for static scenes, where the intensity of light should not be adjusted.
    - Use the **Exposure Compensation** to adjust the light intensity in the scene.
    - Use **Min/Max Brightness** to better control the exposure's result.
- Global Illumination
  - **Method: Lumen** is realistic, bouncing illumination.
- Reflections
  - **Lumen Reflections: High Quality Translucency Reflections** should be turned on for glass and similar materials to properly reflect lumen bounced light.
- Lumen
  - **Software Ray Tracing Mode: Detail Tracing**
- Local Exposure
  - Local exposure can be used to fine-tune exposure settings on the scene.

## Shader Building
