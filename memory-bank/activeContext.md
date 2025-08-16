Current tasks: "The Living Network" Scene Implementation.

Recent changes: Completed a major update to "The Living Network" scene. This involved creating custom GLSL shaders (`.vert` and `.frag` files) for both the network nodes and the connecting filaments, adding dynamic, time-based animations. User interaction was implemented using Three.js's Raycaster to detect mouse hovers and clicks on nodes, which now triggers the display of narrative content from `narrative.json` in a dedicated UI panel. The scene has transitioned from a static proof-of-concept to a dynamic, interactive visualization.

Next steps: Refine the user interaction, possibly adding more complex animations or transitions for the narrative panel.

Learnings & patterns: The service-oriented architecture is proving effective. The `mcp_service` provides a clean abstraction for interacting with different AI models.
