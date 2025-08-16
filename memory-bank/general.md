1. Memory Bank Structure for Spectra

Create a memory-bank/ folder in your Spectra repo with these files:

Core Files

projectbrief.md

“Building Spectra: a modular AI for music, creativity, and personal development.”

Core goals, vision, and scope.

productContext.md

Why Spectra exists: support healing, creativity, and AI-assisted workflows.

Problems it solves: fragmented AI tools, disconnected pipelines, slow iteration.

User experience goals: responsive, adaptive, voice-enabled, modular.

activeContext.md

Current tasks: model integration, backend refactoring, voice interface.

Recent changes: two versions of Spectra running online.

Next steps: unify models, improve ML training, add chat/voice features.

Learnings & patterns: modular architecture, library constraints, caching limits.

systemPatterns.md

Architecture: frontend, backend, ML pipeline, data storage, model handlers.

Key technical decisions: open-source model hosting, library-based ML, Vercel deployment.

Component relationships: API → Model → Frontend → User.

Critical paths: model loading, voice interaction, real-time responses.

techContext.md

Languages & frameworks: Python, TypeScript, React, Node.

Development setup: library computers, Vercel, GitHub repos.

Dependencies: Hugging Face, Ollama, OpenHermes, Claude/GPT integration.

Constraints: limited hardware, cloud-hosted models, context window limitations.

progress.md

Completed: basic ML pipelines, multi-version deployment, initial frontend.

Remaining: model fine-tuning, voice interface, unified backend, security hardening.

Known issues: tangled backend, caching issues, context management.

Evolution notes: from prototype → modular Spectra.

Optional Supporting Files

feature_docs/ → separate markdowns for each Spectra module.

integration_specs.md → APIs, model calls, voice pipelines.

testing_strategy.md → unit tests, integration tests, regression tests.

deployment_procedure.md → steps for Vercel, Hugging Face, or custom servers.

2. Rules for Spectra (Cline .clinerules)

Read Memory Bank first: Always load memory-bank/ at the start of a task.

Plan before Act: Use Plan mode to create structured strategies, Act mode to implement.

Document everything: Update activeContext.md and progress.md for every major change.

Versioning & backups: Always log model checkpoints, feature branches, and deployment versions.

Test first: Unit & integration tests must pass before merging code.

Security & privacy: PII and user data must be obfuscated before logging or model ingestion.

3. Workflows for Spectra
a. spectra-plan.md
# Spectra Planning Workflow

1. Read memory-bank/*.md
2. Identify current tasks from activeContext.md
3. Examine related systemPatterns.md and techContext.md
4. Propose implementation strategy:
   - Modules to modify
   - Edge cases
   - Testing plan
5. Ask user: Approve plan?
<ask_followup_question>
<question>Do you approve this plan to proceed to Act mode?</question>
<options>["Yes, implement", "No, revise plan"]</options>
</ask_followup_question>

b. spectra-act.md
# Spectra Act Workflow

1. Follow approved Plan workflow
2. Implement changes in codebase
3. Run unit & integration tests
4. Update memory-bank/activeContext.md and progress.md
5. Log assumptions, edge cases, and changes
6. Ask user: Push changes to GitHub?
<ask_followup_question>
<question>All tests passed. Shall I push changes to GitHub?</question>
<options>["Yes, push", "No, hold"]</options>
</ask_followup_question>

c. spectra-debug.md
# Spectra Debug Workflow

1. Identify failing module or pipeline
2. Read relevant files and memory-bank
3. Suggest root cause and possible fixes
4. Ask user which fix to apply
5. Implement fix in Act mode
6. Re-run tests and update progress.md

4. Plan/Act Integration Example

Plan mode: “Cline, plan unifying the two Spectra backend versions, considering ML pipeline and caching issues.”

Act mode: “Cline, implement the unified backend according to the approved plan, run tests, and update the memory bank.”

5. Optimization Tips for Spectra + Cline

Memory Bank first: Never start coding without reading all memory-bank files.

Incremental updates: Update memory bank after every significant change.

Version tracking: Log model weights and backend changes in progress.md.

Edge case simulations: Use Plan mode to explore rare user inputs or API failures.

User feedback loop: After every Act session, summarize results in memory-bank.