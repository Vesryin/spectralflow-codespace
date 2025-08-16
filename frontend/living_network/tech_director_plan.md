# Tech Director: Front-End Scene Plan

This document provides the technical implementation plan for the "Spectral Flow — The Living Network" scene. It is designed for a WebGL/Canvas front-end using a library like Three.js or PixiJS, focusing on performance and modularity.

---

### 1) Scene Graph Specification

The scene will be constructed with the following layered and named components, corresponding to the Art Director's blueprint. Layers will be managed to ensure correct Z-ordering and blending.

*   `HazeLayer` (z-index: 0): A simple plane or fullscreen quad with the background haze texture.
*   `FilamentLayer` (z-index: 1-3): Composed of multiple planes with tiled filament textures, offset in Z-depth to create parallax.
*   `NodeLayer` (z-index: 4): Instanced geometry for all nodes to allow for efficient rendering.
*   `GlowLayer` (z-index: 5): Sprites or planes for node glows, using an additive blend mode.
*   `ParticleLayer` (z-index: 6): A GPU-based particle system for performance.
*   `GlyphLayer` (z-index: 7): A plane with the glyph texture, faded in/out as needed.
*   `TextLayer` (z-index: 8): HTML DOM elements overlaid on the canvas for crisp, accessible text rendering. This is the most reliable method for web text.

---

### 2) Data Model for Node Graph

A simple data structure will define the network, loaded from a JSON file or generated procedurally.

```json
{
  "nodes": [
    {
      "id": "n001",
      "position": { "x": -1.5, "y": 0.8, "z": 0.0 },
      "neighbors": ["n002", "n005"],
      "pulsePhase": 0.75,
      "intensity": 0.5,
      "whisperKey": 1
    }
  ],
  "filaments": [
    { "from": "n001", "to": "n002" }
  ]
}
```
*   `id`: Unique identifier.
*   `position`: 3D coordinates.
*   `neighbors`: Array of connected node IDs for interaction logic.
*   `pulsePhase`: A random offset (0.0 to 1.0) for the breathing animation to desynchronize nodes naturally.
*   `intensity`: Base brightness, can be animated.
*   `whisperKey`: Index for the `Node-Whispers` array.

---

### 3) Animation Timeline

The scene's emotional arc will be driven by a simple state machine, managed in the main application logic. Transitions will be triggered by timers and user interaction.

*   **State: `OPENING` (0s - 15s)**
    *   `HazeLayer` and `FilamentLayer` (far) are visible.
    *   `NodeLayer` intensity is low (0.2).
    *   `TextLayer` fades in stanzas sequentially.
*   **State: `UNVEIL` (15s - 30s)**
    *   Trigger: `Aura Bloom` animation (a shader uniform animates for 5s).
    *   `FilamentLayer` (mid, foreground) fades in.
    *   `NodeLayer` intensity animates to a higher value (0.8).
    *   `Filament Flow` shader effect is activated.
*   **State: `COMMUNION` (30s onwards, until idle)**
    *   Trigger: First user interaction (hover/click).
    *   `Call-and-Response` logic is enabled.
    *   Hovering a node displays its whisper text in the `TextLayer`.
*   **State: `REVERENT_FADE` (After 60s of idle)**
    *   Trigger: Idle timer.
    *   All layer intensities and animation speeds smoothly animate down over 10s.
    *   `TextLayer` fades out completely.

---

### 4) Interaction Map

*   **Mouse Hover**: A raycaster will detect hovered nodes.
    *   Effect: The hovered node's glow intensifies. The corresponding `node-whisper` text fades in. Triggers `Call-and-Response` on its neighbors with a slight delay.
*   **Mouse Click**:
    *   Effect: Triggers a brighter, sharper `Call-and-Response` pulse.
*   **Idle Attractor**: After 10 seconds of no interaction, a random node will gently pulse, creating a subtle focal point to draw the user's eye.
*   **Accessibility**:
    *   Keyboard Navigation: The `Tab` key will cycle focus between nodes. `Enter` key will trigger the click interaction.
    *   Aria-labels will be used for nodes, containing their whisper text, ensuring screen readers can interpret the scene.

---

### 5) Performance Budget

*   **Target FPS**: 60fps on a modern browser with integrated graphics (e.g., Intel Iris Xe).
*   **Texture Atlas**: All small, non-tiling textures (glows, particles, glyphs) will be combined into a single 2048x2048 texture atlas to minimize draw calls.
*   **Max Particle Count**: 1000 particles.
*   **Max Nodes on Screen**: ~200 visible nodes, using instanced rendering.
*   **LOD (Level of Detail)**: Nodes and filaments far from the camera will use a simpler shader (or be culled entirely) to save resources.

---

### 6) Asset Pipeline

1.  **Image Generation**: Generate assets using the Visual Stylist's prompts.
2.  **Texture Optimization**:
    *   PNGs will be compressed using a lossless tool like `pngquant`.
    *   JPGs will be saved at ~85% quality.
    *   All textures will be converted to a GPU-friendly format like `.ktx2` or `.basis` for faster loading and lower memory usage if the target engine supports it.
3.  **Data Conversion**: The narrative text will be converted into a single `narrative.json` file for easy fetching and parsing by the application.

---

### 7) Acceptance Tests

*   **Functional**:
    *   Verify that all layers load and are rendered in the correct order.
    *   Confirm that the animation timeline transitions correctly between all four states.
    *   Test hover and click interactions on multiple nodes.
    *   Ensure keyboard navigation and screen reader support functions as designed.
*   **Aesthetic**:
    *   Check for visual artifacts (z-fighting, texture seams, color banding).
    *   Confirm that text is always legible per the Art Director's contrast strategy.
    *   Validate that the overall feel and timing of animations match the emotional arc.
*   **Performance**:
    *   Profile the scene on target hardware to ensure it meets the 60fps target.
    *   Measure initial load time and total asset weight.
