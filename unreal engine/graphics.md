# Lighting

Lighting can be achieved through lights or emmisive materials.

## Light Sources
* **Directional Light** is like sunlight, covers a whole area falling from a specific angle.
* **Point Light**
* **Spotlight**
* **Rectangle Light**
* **Sky Light** takes the sky and projects light on the scene depending on the sky texture.
  * It requires two other components to work (toggle *affects world* setting in case it does not take effect properly):
    * **Visual Effects -> Sky Atmosphere**
    * **Lights -> Directional Light**

## Global Illumination

### Controls
* **Ctrl+L** allows to manipulate the sunlight.

# Post Processing

* Post processing settings in a scene are controlled through the *PostProcessingVolume* object.
* A camera is affected only while it is within the post-process volume; a post-process volume does not cover the entire scene but only parts of it.

## Lens
### Exposure
* **Metering Mode**
  * **Auto Exposure** simulates the real life change of exposure of someone's eyes when lighting conditions change abruptly.

## Global Illumination
* **Method**
  * **Lumen** is realistic, bouncing illumination.

## Post Process Volume Settings
* **Infinite Extend (Unbound)** extends the volume so it can encompass the full scene at once, regardless of its size.
