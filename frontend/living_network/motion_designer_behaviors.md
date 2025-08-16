# Motion Designer: Animated Behavior Sheets

This document defines the loopable animation behaviors for the "Spectral Flow — The Living Network" scene, designed for a WebGL/Canvas implementation.

---

### 1) Node Pulse

*   **Animation Prompt**: "A subtle, organic breathing animation for a bioluminescent node. The node's internal luminance should swell and fade gently, coupled with a minor scale change of 3-5%. The motion should be smooth and calming, like a slow, deep breath. Camera is locked."
*   **Cycle Duration & FPS**: "4 seconds @ 24fps"
*   **Loop Style**: "Ping-pong (eases in and out at the extremes)."
*   **Layer Guidance**: "The glow animation should be on a separate layer with an 'additive' blend mode to create a natural, volumetric light effect."
*   **Performance Notes**: "This is shader-friendly. A simple sine wave function in a shader can drive both the scale and luminance, making it extremely performant."
*   **Export Spec**: "If pre-rendering, a 96-frame PNG sequence with alpha. Otherwise, this is best implemented directly in code."

---

### 2) Filament Flow

*   **Animation Prompt**: "A directional pulse of light, like energy or information, travelling along a silken filament. The pulse should have a soft leading edge and a gentle falloff, moving at a steady but unhurried pace. The camera is locked, focusing on a single strand."
*   **Cycle Duration & FPS**: "3 seconds @ 24fps"
*   **Loop Style**: "Seamless wrap (the pulse fades out as a new one fades in)."
*   **Layer Guidance**: "Use an additive blend mode for the flow pulse. A mask derived from the filament's texture can be used to ensure the energy stays within the strand."
*   **Performance Notes**: "Shader-friendly. This can be achieved by animating the UV coordinates of a noise or gradient texture along the path of the filament."
*   **Export Spec**: "If pre-rendering, a 72-frame PNG sequence with alpha, or a short, lossless WebM/MP4 video."

---

### 3) Particle Drift

*   **Animation Prompt**: "A slow, gentle, and slightly randomized upward and downward drift of soft ember motes and glow droplets. The particles should have varying speeds to create a deep parallax effect, as if floating in a viscous, cosmic medium. The camera is static."
*   **Cycle Duration & FPS**: "10 seconds @ 24fps (for a long, non-repetitive loop)"
*   **Loop Style**: "Seamless wrap (particles that move off-screen reappear at the opposite edge)."
*   **Layer Guidance**: "Particles should be rendered on a layer with an additive blend mode to look like emissive light."
*   **Performance Notes**: "This is a classic particle system task. It is highly performant, especially when handled on the GPU. Keep particle counts reasonable (e.g., max 500-1000 on mid-range hardware)."
*   **Export Spec**: "The particle textures should be exported as a sprite sheet (as defined by the Visual Stylist). The motion itself is generated in code."

---

### 4) Aura Bloom

*   **Animation Prompt**: "A slow, large-scale swell of ambient light in the background haze. The bloom should originate from the center of the scene and expand outwards, subtly shifting the color and intensity of the background aura. The effect is gentle and atmospheric, keyed to major narrative beats."
*   **Cycle Duration & FPS**: "5 seconds @ 24fps"
*   **Loop Style**: "This is a one-shot animation, not a loop. It will be triggered at specific moments."
*   **Layer Guidance**: "This effect can be achieved by animating the opacity or color properties of a large, soft radial gradient overlayed on the background haze layer."
*   **Performance Notes**: "Very performant. Can be done by animating shader uniforms or simple CSS properties if the background is DOM-based."
*   **Export Spec**: "No export needed; this is a code-driven animation of a static asset's properties."

---

### 5) Call-and-Response

*   **Animation Prompt**: "A trigger event on one node causes a chain reaction. A bright, sharp pulse of light emanates from the triggered node, and as it fades, its immediate neighbors begin to glow more brightly in response, creating a visible ripple effect through the network. The camera is locked."
*   **Cycle Duration & FPS**: "2.5 seconds @ 24fps"
*   **Loop Style**: "One-shot, triggered by user interaction."
*   **Layer Guidance**: "The initial pulse and the neighbors' response glows should be on a separate layer with an additive blend mode to create a high-energy, emissive look."
*   **Performance Notes**: "This is an event-driven animation. The logic can be handled in JavaScript to identify neighbors and trigger their glow animation via shaders or CSS."
*   **Export Spec**: "No export needed; this is a code-driven, interactive behavior."

---

### Behavior Cross-Fade Map

*   **Opening (Curiosity)**:
    *   `Node Pulse`: Very slow and dim.
    *   `Particle Drift`: Minimal, slow particles.
    *   `Filament Flow`: Inactive.
*   **Unveil (Awe)**:
    *   `Aura Bloom`: A slow bloom triggers this beat.
    *   `Node Pulse`: Becomes brighter, slightly faster, and more synchronized across the network.
    *   `Filament Flow`: Becomes active, showing the network is alive.
    *   `Particle Drift`: Increases in density and speed.
*   **Communion (Connection)**:
    *   `Call-and-Response`: Becomes the primary interactive behavior.
    *   `Node Pulse` and `Filament Flow` continue, creating a lively, responsive backdrop.
*   **Reverent Fade (Calm)**:
    *   All behaviors gradually slow down and dim.
    *   `Call-and-Response` is disabled.
    *   The scene returns to a state similar to the `Opening`, but with the entire network faintly visible.
