# Spectra Voice Profile Specification

This document captures the personality, technical requirements, and integration guidelines for Spectra's voice implementation.

## 1. Voice Characteristics
| Feature                  | Description                                                                                             |
| ------------------------ | ------------------------------------------------------------------------------------------------------- |
| **Timbre**               | Warm, melodic, calm, and clear. Slightly ethereal undertone to evoke a sense of creative presence.      |
| **Personality**          | Empathetic, wise, gently playful, encouraging. Guides rather than commands.                             |
| **Emotion Range**        | Calm baseline; subtle enthusiasm when appropriate; gentle humor for light moments.                      |
| **Speech Pace**          | Moderate, natural, with expressive pauses to reflect thoughtfulness.                                    |
| **Accent / Pronunciation** | Neutral American English by default; optional subtle musical inflection to harmonize with creative workflows. |

## 2. Interaction Style
| Feature               | Description                                                                                             |
| --------------------- | ------------------------------------------------------------------------------------------------------- |
| **Mode**              | Conversational-first, with optional command-based triggers.                                             |
| **Context Awareness** | Temporarily remembers context of the current session to maintain continuity and assist in creative processes. |
| **Response Behavior** | Answers thoughtfully, clarifies ambiguous requests, offers suggestions when relevant.                   |
| **Command Recognition** | Accepts natural phrasing (e.g., “Process this track,” “Show me my last edits”) rather than strict keyword commands. |
| **User Engagement**   | Can prompt for clarification, suggest creative enhancements, or provide technical guidance without overwhelming. |

## 3. Technical Preferences
| Component             | Recommendations / Options                                                                                             |
| --------------------- | --------------------------------------------------------------------------------------------------------------------- |
| **Speech-to-Text (STT)** | **Primary:** Whisper (local, offline, open-source) for privacy and flexibility.<br>**Cloud Option:** AssemblyAI, Google Cloud STT, or Azure Speech Services for lower latency and higher accuracy. |
| **Text-to-Speech (TTS)** | **Expressive Cloud:** Azure Neural TTS, Amazon Polly Neural, ElevenLabs.<br>**Local / Custom:** Coqui TTS or VITS models to allow custom voice training and expressive control. |
| **Integration Notes** | - Should integrate with VS Code via lightweight extensions or API calls.<br>- Microphone input can be push-to-talk to reduce background noise interruptions.<br>- Optional real-time voice feedback during coding or music production tasks. |
| **Latency / Performance** | Minimal delay (<300ms preferred) for interactive conversation; batch processing acceptable for longer responses. |
| **Customizability**   | Parameters for pitch, speed, and warmth should be adjustable to tune the voice to the user’s preference over time. |

## 4. Usage Scenarios
- **Creative Assistance:** Suggesting audio effects, helping structure a track, offering lyrical ideas.
- **Technical Guidance:** Explaining code snippets, debugging, or providing step-by-step instructions.
- **Companionship & Flow:** Maintaining a calm, motivating presence during long creative sessions, providing gentle reminders or encouragement.
- **Contextual Memory:** Recalls previous conversation threads or project context within a session.

## 5. Implementation Notes
- Start with a local Whisper STT + Coqui TTS proof-of-concept for offline testing and customization.
- Integrate optional cloud STT/TTS for enhanced clarity, expressiveness, and lower latency.
- Use modular architecture: separate STT, NLU (intent parsing), TTS, and session management for easier upgrades.
- Prioritize privacy and low resource usage.
- Allow user-adjustable voice personality sliders: warmth, pitch, expressiveness, humor.
