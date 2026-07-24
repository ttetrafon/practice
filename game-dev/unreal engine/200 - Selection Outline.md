# Selection Outline

## Material with Edge Detection

- [Outline Effect](http://www.michalorzelek.com/blog/tutorial-creating-outline-effect-around-objects/)
- On the target object, use: `Get Components by Tag` -> `Set Render Custom Depth (value = true)`.
- Create a material.
  - ...
- For the custom depth to work, we need a post-process volume.
  - Set it as **unbound**, so that it covers the full game area and not only its own geometry.
  - Add a post-processing material.
    - Set it to asset reference, and link the previsouly created material.
