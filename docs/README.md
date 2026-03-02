# Documentation

**Start here** if you’re new: this folder describes what the project **actually is now**, phase by phase.

## What exists today

| File | Purpose |
|------|---------|
| [phase-0-ui.md](phase-0-ui.md) | Phase 0 (current state): Next.js app in `apps/web`, API routes, data, gateway, stay location map (Leaflet + satellite imagery), run instructions |

## Planning (not in this folder)

Planning and prompts live in `plans/`:

| File | Purpose |
|------|---------|
| [../plans/TODOS.md](../plans/TODOS.md) | Master checklist (phases 0–8 + submission) |
| [../plans/Initial_Planning.md](../plans/Initial_Planning.md) | Product concept, architecture, API, data models |
| [../plans/v0_prompt.md](../plans/v0_prompt.md) | v0.app UI spec used to generate the UI |
| [../plans/Agent_Prompts.md](../plans/Agent_Prompts.md) | Instructions for AI agents per phase |
| [../plans/phase-1-setup.md](../plans/phase-1-setup.md) | Phase 1 setup plan (monorepo, shared types, etc.) |

## Workflow

When a phase is **completed**, add a new `phase-{N}-{slug}.md` file here and link it in the table above. Always update [../plans/TODOS.md](../plans/TODOS.md) and this index together so the docs match the current codebase.
