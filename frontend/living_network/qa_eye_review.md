# QA Eye: Brutal Review

This document provides a critical review of the "Spectral Flow — The Living Network" plans, identifying risks and suggesting improvements to tighten the execution.

---

### Top 10 Risks (Ranked)

1.  **Performance on Integrated Graphics**: The 60fps target is ambitious. The combination of parallax layers, a GPU particle system, and potentially complex shaders for glows and filament flow could easily cause stutter on non-dedicated GPUs.
2.  **Text Legibility in `COMMUNION` Beat**: During the most interactive phase, node glows and `Call-and-Response` effects could create high-contrast, busy backgrounds that overwhelm the text backers, making anchor lines and whispers difficult to read.
3.  **Asset Generation Consistency**: The visual quality is entirely dependent on the output of image generation models. Achieving a perfectly consistent style, especially in lighting and texture, across all assets (nodes, filaments, glyphs) will be challenging.
4.  **"Seamless" Loops**: Achieving truly seamless loops for filament flow and particle drift requires careful artistic and technical execution. A noticeable "jump" or "reset" will break immersion instantly.
5.  **Interaction Overload**: The `Call-and-Response` on hover could become visually noisy or distracting, especially if the user moves the pointer quickly across the screen, turning the serene experience into a chaotic light show.
6.  **Mobile Experience Compromise**: The "Alt Excerpt" is a good start, but the full visual experience will be difficult to translate to a small, portrait-orientation screen. Performance is an even greater risk on mobile GPUs.
7.  **Accessibility Implementation**: While planned, keyboard navigation and ARIA labels for a dynamic WebGL scene are non-trivial to implement correctly. A poorly implemented solution can be worse than none at all.
8.  **Asset Pipeline Complexity**: The suggestion to use `.ktx2` or `.basis` adds a significant step to the pipeline. This requires extra tooling and testing, which could slow down development.
9.  **Emotional Pacing**: The animation timeline is well-defined, but the actual *feel* of the transitions is subjective. If the fades and blooms are too fast or too slow, the intended emotional arc will be lost.
10. **Scope Creep**: The plan is solid but detailed. The temptation to add "just one more" effect (e.g., more complex particle behaviors, procedural filaments) is high and could jeopardize the core performance budget.

---

### 6 Tightening Moves

1.  **Decouple Hover from `Call-and-Response`**: Change the interaction map. Hovering should *only* cause the local node to glow and reveal its whisper. A `click` is required to trigger the network-wide `Call-and-Response`. This prevents visual noise and makes the user's "touch" on the network more deliberate and impactful.
2.  **Prioritize Shader-Based Animation**: For `Node Pulse` and `Filament Flow`, commit to a shader-only implementation. Avoid pre-rendered image sequences entirely for these core elements. This guarantees the smoothest loops and best performance.
3.  **Simplify the `TextLayer`**: Instead of having text float over the busiest parts of the network, anchor the main stanzas to a specific, calmer region of the screen (e.g., bottom-center). Only the ephemeral `node-whispers` should appear directly over the graph.
4.  **Implement a "Performance Tier" System**: On load, do a quick benchmark. On lower-end systems, automatically disable the most expensive layers (`ParticleLayer`, `GlowLayer`) and reduce parallax depth. This is better than a stuttering experience.
5.  **Generate a Master Style Guide Image**: Before generating all assets, create one "golden master" image that contains a node, a filament, and a glyph in the same scene. Use this image as a visual reference in the prompts for all subsequent asset generation to enforce style consistency.
6.  **Hard-Code the Animation Timeline**: Avoid a complex state machine. For this linear experience, a simple, hard-coded timeline using a library like GSAP or even just `requestAnimationFrame` with elapsed time checks is more robust and easier to debug.

---

### Legibility Audit

*   **Primary Risk**: `Ember-Gold` accent color for glows is very bright and has a similar value to the `Luminescent White` text.
*   **Solution**: The `UI Text Backer` gradient is critical. Its opacity must be dynamically increased when a bright node glow is active behind it. A simple check of the background brightness in the text area can trigger this.
*   **Motion Interference**: The `Particle Drift` on the top-most layer could pass in front of text, causing distraction.
*   **Solution**: Ensure the `TextLayer` (as a DOM element) has the highest `z-index` and is not part of the WebGL canvas. This guarantees text is always rendered on top of all visual effects.

---

### Performance Audit

*   **Largest Win**: Using instanced rendering for the `NodeLayer` is the single most important optimization. This is non-negotiable.
*   **Texture Memory**: The 3840x2160 `HazeLayer` is the largest single asset. Ensure it is compressed effectively. A subtle, procedural shader-based haze could be even cheaper if the visual quality is acceptable.
*   **Draw Calls**: The texture atlas is the best way to reduce draw calls. Be disciplined about including all small static assets in it.

---

### Green-Light Checklist

1.  [ ] Has the "Master Style Guide Image" been generated and approved?
2.  [ ] Is the decision to use DOM vs. Canvas for text finalized? (Recommend DOM).
3.  [ ] Has the interaction model been updated to the "click-to-ripple" design?
4.  [ ] Is there a clear plan for the "Performance Tier" fallback?
5.  [ ] Are the developers comfortable with the chosen WebGL library's instancing and shader capabilities?
