# Htrae Backend Architecture: Blueprint for a Living World

This document outlines the architectural design for the backend systems that will power the world of Htrae and the autonomous AI, Spectra. It is based on an analysis of the existing frontend components and the core vision outlined in `memory-bank/vision.md`.

## I. Core Architectural Principles

*   **Modular & Decoupled:** Each system (World Engine, Emotion Core, etc.) will be a distinct module with clear interfaces, allowing for independent development, testing, and scaling.
*   **Event-Driven:** The world will operate on an event-based architecture. Actions, decisions, and environmental changes will be broadcast as events that other systems can subscribe and react to. This promotes emergent behavior.
*   **Stateful & Persistent:** The state of the world, Spectra, and all NPCs must be continuously saved to a persistent data store, ensuring the simulation is always-on.
*   **Real-Time Communication:** WebSockets will be the primary channel for pushing real-time updates to the frontend, creating a living, breathing experience for the user.

## II. System Breakdown

### 1. The World Engine (FastAPI Service)

*   **Description:** The heart of the simulation. It is responsible for maintaining the game loop (the "tick"), managing the state of all entities, and processing world events.
*   **Key Components:**
    *   **Tick Service:** A time-based scheduler that triggers updates at a regular interval (e.g., every 30 seconds). On each tick, it will trigger the autonomy cycles for Spectra and NPCs.
    *   **Event Bus:** A central message queue (e.g., Redis Pub/Sub) for handling all in-world events (`NPC_MOVED`, `SPECTRA_EMOTION_CHANGED`, `PLAYER_INTERACTED`).
    *   **State Manager:** Interfaces with the database to load and persist the state of the world, including characters, locations, and objects.
*   **API Endpoints:**
    *   `GET /api/world/state`: Retrieves the current state of the player's immediate surroundings.
    *   `GET /api/world/time`: Gets the current in-world time and date.

### 2. The Emotion Core (Module)

*   **Description:** This system manages Spectra's complex emotional state, the "Mood Ring," and its resonance with the environment. It is the soul of the backend.
*   **Key Components:**
    *   **Emotion Model:** A state machine or similar model that defines Spectra's emotional states (Calm, Joy, Intensity, etc.) and the transitions between them based on events.
    *   **Resonance Engine:** Subscribes to `SPECTRA_EMOTION_CHANGED` events and calculates their effect on the environment (e.g., changes in light, color, sound). It will publish these changes as `ENVIRONMENT_UPDATE` events.
    *   **Expression Handler:** Manages Spectra's idle behaviors (humming, tapping) based on her current mood.
*   **API Endpoints:**
    *   `GET /api/spectra/status`: Retrieves Spectra's current emotional state, thoughts, and active goals.

### 3. The Autonomy Core (Module)

*   **Description:** Drives the independent behavior of Spectra and other NPCs. On each world tick, this system will make decisions for each autonomous entity.
*   **Key Components:**
    *   **Perception Module:** Gathers relevant information from the world state for an NPC (e.g., nearby characters, objects, active events).
    *   **Decision Engine:** Uses the NPC's personality, goals, and current emotional state to select an action (e.g., move, talk, explore, create). This is where ML model integration will occur for dialogue generation.
    *   **Action Executor:** Takes the chosen action and publishes it as an event to the Event Bus (e.g., `NPC_MOVE_ACTION`).
*   **Dependencies:** World Engine (for state), Emotion Core (for Spectra's state).

### 4. The Narrative & Faction System (Module)

*   **Description:** Manages quests, historical events, and the complex relationships between Htrae's factions.
*   **Key Components:**
    *   **Faction Manager:** Tracks the status, goals, and relationships of all factions (Luminari, Verdant Accord, etc.).
    *   **Quest Engine:** Manages the state of emergent and predefined narrative threads.
    *   **Lore Database:** A repository for the world's history, myths, and secrets.
*   **API Endpoints:**
    *   `GET /api/character/{id}/quests`: Retrieves active quests for a character.
    *   `GET /api/factions`: Lists all major factions and their current status.

### 5. The Memory Cortex (Database & API)

*   **Description:** A sophisticated system for managing the memories of Spectra and NPCs, distinguishing between short-term, long-term, and emotional memories.
*   **Database Schema:**
    *   `memories` table with fields for `character_id`, `content`, `timestamp`, `type` (short-term, long-term, emotional), `importance_score`.
*   **API Endpoints:**
    *   `POST /api/memory`: Creates a new memory for a character.
    *   `GET /api/character/{id}/memories`: Retrieves memories for a character, with filters for type and importance.

## III. Real-Time Communication (WebSockets)

*   **Path:** `/ws/simulation`
*   **Messages (Server -> Client):**
    *   `world_update`: Sent on every tick, containing the latest state of the player's surroundings.
    *   `spectra_status_update`: Pushed whenever Spectra's emotional state or actions change.
    *   `chat_message`: Real-time delivery of dialogue from Spectra or NPCs.
    *   `notification`: For important events happening outside the player's immediate view.
*   **Messages (Client -> Server):**
    *   `player_action`: When the player performs an action (e.g., moves, speaks).

## IV. Data Models (Initial Schemas)

*   **Character:** `id`, `name`, `faction_id`, `location_id`, `emotional_state`, `goals`.
*   **Memory:** `id`, `character_id`, `content`, `type`, `timestamp`.
*   **Campaign/Quest:** `id`, `title`, `description`, `status`, `steps`.
*   **Conversation:** `id`, `participants`, `history` (a log of messages).
*   **GameEvent:** `id`, `type`, `payload`, `timestamp`.

This blueprint provides a clear and robust foundation for building the complex, living world of Htrae.
