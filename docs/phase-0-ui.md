# Phase 0: v0.app UI — Todo breakdown

**Source**: [TODOS.md](../plans/TODOS.md) Phase 0.  
**Reference**: [v0_prompt.md](../plans/v0_prompt.md), [Initial_Planning.md](../plans/Initial_Planning.md) Image targeting.

Phase 0 delivers the Cocoon UI from v0.dev (glassmorphism, narrative intro → gateway → discovery), integrated into the repo so the app runs locally. No monorepo yet; a single Next.js app in `apps/web` serves both the UI and mock API via Next.js API routes.

---

## 0.1 — Paste v0_prompt into v0.dev; generate Cocoon UI

**What**: Use the spec in `plans/v0_prompt.md` in v0.dev to generate the Cocoon UI (glassmorphism, narrative phases, StayCard, gateway with scenario cards).

**Why**: Establishes the design and component set before wiring to a real backend.

**How**: Copy v0_prompt.md into v0.dev; export the generated project (ZIP). Generated output includes Next.js, Tailwind, Shadcn-style components, Framer Motion.

**Status**: ✅ Done. v0 output integrated into `apps/web`.

---

## 0.2 — Export/copy generated code for integration into apps/web

**What**: Place the v0-generated app in `apps/web` so it runs from the repo with a single command.

**Why**: Enables "clone and run" for the demo; keeps UI in the same repo as plans and future backend.

**How**: Unzip v0 export into `apps/web` (or merge into existing). Copy/symlink images to `apps/web/public/images/` (city, forest, mountains, sea). Move videos to `apps/web/public/videos/` by category. Set package name to `web`. Run `pnpm install` and `pnpm dev` from `apps/web`.

**Status**: ✅ Done. App runs at http://localhost:3000 (or 3001 if 3000 in use).

---

## Phase 0 follow-ups (completed with UI integration)

| # | Item | Status | Notes |
|---|------|--------|-------|
| 0.3 | Transform root `data/stays.json` → `apps/web/data/stays.json` (web shape: scenario, images as full paths, video, coordinates, currency, resonanceScore, availability) | ✅ | 43 stays; video set when file exists under `public/videos/` |
| 0.4 | Media utils: `resolveMedia(imagePath, videoUrl)` and optional `<video>` in StayCard | ✅ | `utils/media.ts`; StayCard uses video or image |
| 0.5 | Logo "cocoon – here, us" in header links to search (home `/`); remove About from header nav | ✅ | Gateway, discovery, stay-detail, our-cocoon, about: logo → `/`; About only in footer |
| 0.6 | Gateway cards: fixed images per scenario (no random) — City: Tokyo Sky Dome, Forest: Redwood Sphere, Mountains: Wadi Gorge Cabin, Sea: Beacon Suite | ✅ | `CARD_IMAGES` in gateway.tsx |
| 0.7 | Next.js API routes for stays, availability, reviews, bookings (mock data from `apps/web/data/stays.json`) | ✅ | `app/api/stays`, `app/api/stays/[id]`, `app/api/stays/[id]/availability`, `app/api/stays/[id]/reviews`, `app/api/bookings`, `app/api/bookings/[confirmationId]` |
| 0.8 | Lint: Biome + TypeScript clean in `apps/web/components` (labels, button types, Next/Image, useId where needed) | ✅ | Biome check passes; a11y and correctness fixes applied |
| 0.9 | Stay location map: OpenStreetMap + Leaflet; Esri World Imagery (satellite) tiles; coordinates in `stays.json` aligned to location names (secluded areas for forest/mountain/sea, city centers for CITY) | ✅ | `StayMap` in `components/stay-map.tsx`; "Open in OpenStreetMap" link |

---

## Current stack (Phase 0)

- **Runtime**: Node.js (LTS)
- **Package manager**: pnpm (in `apps/web`)
- **Frontend**: Next.js 16, React 19, TypeScript, Tailwind CSS 4, Shadcn/ui (Radix), Framer Motion, TanStack Query, React Hook Form, Valibot
- **API**: Next.js Route Handlers in `apps/web/app/api/` (no separate backend yet)
- **Data**: `apps/web/data/stays.json`; in-memory for API (no DB). Each stay has `location` and `coordinates` (lat/lng) aligned so forest/mountain/sea stays point to secluded areas; city stays to city centers.
- **Map**: Stay location on detail page uses Leaflet with **Esri World Imagery** (satellite/aerial tiles; no API key). Component: `components/stay-map.tsx`; link to open in OpenStreetMap.
- **Assets**: `apps/web/public/images/` (city, forest, mountains, sea), `apps/web/public/videos/` (forest, rock, water)

---

## What Phase 1 will change

- Add monorepo root (`package.json`, workspaces or Turborepo).
- Optionally migrate `apps/web` to Vite + React Router if the plan stays Vite-based; or keep Next.js and add `apps/api` (simple Express) and `packages/shared`.
- Single-command run from root (`pnpm dev` or `yarn dev` running web + api).
- Commit message guard (commitlint + husky).

See [../plans/TODOS.md](../plans/TODOS.md) Phase 1 and [../plans/phase-1-setup.md](../plans/phase-1-setup.md).

