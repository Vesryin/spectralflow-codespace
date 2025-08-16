Current tasks: Persistent context handling, basic voice interaction.

Recent changes: Implemented initial MCP server integration with simulated model calls and fallback logic. Added a `/chat` endpoint to the backend for handling user prompts.

Next steps: Implementing Phase 1 of the persistent context handling plan. This involves creating a `ConversationManager` to handle short-term (in-memory) and long-term (JSON file) memory.

Learnings & patterns: The service-oriented architecture is proving effective. The `mcp_service` provides a clean abstraction for interacting with different AI models.
