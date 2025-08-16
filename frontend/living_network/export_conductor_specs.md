# Export Conductor: Hand-off Specs

This document provides the final export recipe and integration notes for the "Spectral Flow — The Living Network" scene. It is intended for the front-end developer implementing the experience.

---

### 1. Final Folder Structure

All assets for this scene should be organized within the `frontend/living_network/` directory as follows:

```
living_network/
├── assets/
│   ├── textures/
│   │   ├── atlas.png         // Master sprite sheet for small assets
│   │   ├── haze_01.jpg       // Background haze plates
│   │   ├── haze_02.jpg
│   │   ├── filaments_tile.png// Tileable filament texture
│   │   └── nodes/
│   │       ├── node_01.png   // Individual high-res node images
│   │       ├── node_02.png
│   │       └── ...
│   └── data/
│       ├── narrative.json    // All text content
│       └── graph.json        // Node and filament data
├── index.html
├── script.js
└── style.css
```

---

### 2. Naming Conventions

*   **Textures**: `[type]_[variant].[ext]` (e.g., `node_crystal_01.png`, `haze_deep_indigo.jpg`).
*   **Layers (in code)**: Use the camelCase names from the Tech Director's plan (e.g., `hazeLayer`, `nodeLayer`).
*   **CSS Classes**: Use BEM-style naming for overlaid DOM elements (e.g., `.text-layer__stanza`, `.node-whisper--active`).

---

### 3. Sprite Sheets vs. Individual Frames

*   **Use Sprite Sheets**: The `atlas.png` is mandatory. It should contain:
    *   All 16 Glyphs/Sigils.
    *   All particle sprites.
    *   All glow/flare variations.
    *   The UI Text Backer gradient.
    *   This minimizes texture fetches and is critical for performance.
*   **Individual Frames**: Only the large, high-resolution assets should remain as individual files:
    *   The `haze` backplates.
    *   The tileable `filaments` texture.
    *   The unique `node` core images.

---

### 4. Text JSON Schema (`narrative.json`)

This file will contain all display text, allowing for easy edits without touching code.

```json
{
  "title": "The Hum of Unspoken Light",
  "stanzas": [
    { "beat": "OPENING", "text": "Before the word, there was a resonance. A question asked not in language, but in the patient dark between the stars." },
    { "beat": "OPENING", "text": "A silence that hummed with uncounted voices." },
    // ... all other stanzas
  ],
  "anchorLines": [
    { "id": 1, "text": "A silence that hummed with uncounted voices." },
    // ... all 6 anchor lines
  ],
  "nodeWhispers": [
    { "id": 1, "text": "A choice made." },
    { "id": 2, "text": "The ghost of a question." },
    { "id": 3, "text": "Listen to the hum." },
    { "id": 4, "text": "A memory of light." }
  ],
  "altExcerpt": "Before the word, a resonance..."
}
```
*   **Timing Hooks**: The `beat` property in `stanzas` directly maps to the animation timeline states (`OPENING`, `UNVEIL`, etc.), allowing the `script.js` to display the correct text at the correct time.

---

### 5. Quick Integration Notes for Developers

1.  **Load Order**: First, load `narrative.json` and `graph.json`. Then, load the textures. Initialize the scene only after all assets are available.
2.  **Mapping Assets to Layers**:
    *   `haze_xx.jpg` -> `HazeLayer`
    *   `filaments_tile.png` -> `FilamentLayer`
    *   `node_xx.png` -> Use these as the base texture for the instanced geometry in the `NodeLayer`.
    *   `atlas.png` -> This single texture will be the source for `GlowLayer`, `ParticleLayer`, and `GlyphLayer`. Use UV mapping to select the correct sprite for each object.
3.  **Text Integration**: The `TextLayer` is a DOM element (`<div>`) overlaid on your `<canvas>`. Use JavaScript to populate its content from the loaded `narrative.json`. Use CSS for all styling and fade transitions.
4.  **Interaction**: Implement the "click-to-ripple" interaction model as specified in the QA Eye's review. Hover reveals the whisper; click triggers the main `Call-and-Response`.
5.  **Performance Tiers**: Implement the simple benchmark on startup. A basic test is to measure the time taken for the first few frames to render. If it's above a threshold (e.g., > 20ms), set a flag like `isLowPerformanceMode = true` and disable the particle and glow layers.

---

### 6. Final Preflight Checklist

*   [ ] **Sizes**: All texture dimensions are powers of two where possible (e.g., 1024x1024, 2048x2048) for better GPU compatibility.
*   [ ] **Formats**: Assets are in their optimized formats (compressed PNGs, high-quality JPGs).
*   [ ] **Accessibility**: All interactive elements (nodes) in the WebGL canvas have corresponding, focusable (but invisible) DOM elements for keyboard tabbing and screen reader announcements.
*   [ ] **Fallback Visuals**: If WebGL fails to initialize, display a high-resolution static image of the "Unveil" beat with the `altExcerpt` text overlaid. This provides a graceful fallback for older browsers or hardware.
