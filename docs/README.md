# Documentation

**Start here** if you’re new: this folder describes what the project **actually is now**, phase by phase.

## Current state (brief)

- **Backend**: Next.js Route Handlers in `apps/web/app/api/` — stays, availability, reviews, bookings. **BE solution will remain as-is.**
- **Frontend**: Next.js 16, React 19, TypeScript, Tailwind, Shadcn in `apps/web`.
- **Run**: From root: `pnpm dev` or `yarn dev`. From `apps/web`: `pnpm dev`. Root `package.json` has `dev` and `lint` scripts.

## What exists today

| File | Purpose |
|------|---------|
| [phase-0-ui.md](phase-0-ui.md) | Phase 0 (current state): Next.js app in `apps/web`, API routes, data, gateway, discovery toolbar (filters, dates, sticky glass bar), search bar behaviour, stay location map (Leaflet + satellite imagery), image/video loading optimisation, run instructions |
| [phase-1-setup.md](phase-1-setup.md) | Phase 1: Root `dev` script, TS/lint/deps hygiene, commitlint + husky |

## Planning (not in this folder)

Planning and prompts live in `plans/`:

| File | Purpose |
|------|---------|
| [../plans/TODOS.md](../plans/TODOS.md) | Master checklist (phases 0–8 + submission) |
| [../plans/Initial_Planning.md](../plans/Initial_Planning.md) | Product concept, architecture, API, data models |
| [../plans/v0_prompt.md](../plans/v0_prompt.md) | v0.app UI spec used to generate the UI |
| [../plans/Agent_Prompts.md](../plans/Agent_Prompts.md) | Instructions for AI agents per phase |
| [../plans/phase-1-setup.md](../plans/phase-1-setup.md) | Phase 1 setup plan (root yarn dev, developer hygiene) |

## Workflow

When a phase is **completed**, add a new `phase-{N}-{slug}.md` file here and link it in the table above. Always update [../plans/TODOS.md](../plans/TODOS.md) and this index together so the docs match the current codebase.
