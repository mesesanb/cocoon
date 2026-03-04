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

## Phase 0 refinements (post-integration)

These updates were applied after the initial Phase 0 integration; they are part of the current “Phase 0 complete” state.

### Discovery page (search + toolbar)

- **Toolbar**: One row with scenario chips (All, City, Forest, Mountains, Sea), Begin stay / End stay date pickers (same style as booking form), “X retreats found”, sort dropdown, and grid/list view toggle. Same height and glass effect as the header; sticky under the header on scroll; rounded bottom corners; full viewport width.
- **Narrow viewports**: Toolbar uses horizontal scroll (single row, no wrap) with a glass-styled scrollbar so controls don’t overlap.
- **Search**: Submitting search resets the category filter to “All” so results aren’t limited by the current chip. Clearing the search (X) clears the query and updates results immediately (via `onClear` on the search bar).

### Search bar

- Wider (`max-w-3xl`). When there is text, a clear (X) button is shown; mic icon and arrow button remain. Optional `onClear` callback so the parent can clear the active query and refresh results.

### Image and video optimisation

- **Images**: Next.js image optimisation is **enabled** in `next.config.mjs` (no `unoptimized`). Formats: AVIF and WebP. Responsive `deviceSizes` and `imageSizes` so the right resolution is served per viewport. All `<Image>` usage benefits from lazy loading (except where `priority` is set), responsive `srcset`, and modern formats.
- **Videos on listing cards**: `LazyVideo` (`components/lazy-video.tsx`) only sets the video `src` when the card enters the viewport (IntersectionObserver). Until then, a **poster** (first stay image) is shown and no video is downloaded. When in view: `preload="metadata"`, then autoplay. Used in `StayCard` and `StayCardList`.
- **Stay detail hero video**: `poster` set to the first stay image; `preload="metadata"` so the full file isn’t fetched until playback.
- **Media URLs**: `utils/media.ts` exposes `buildImageUrl(path)` and `buildVideoUrl(path)` for consistent `/images/` and `/videos/` paths; used in stay-detail and `resolveMedia`.

---

## Code review (current state)

*Supplementary findings from code review. Phase 1–2 tasks in [TODOS.md](../plans/TODOS.md) and [phase-1-setup.md](../plans/phase-1-setup.md) remain the source of truth; this section adds observations, does not replace them.*

### Strengths

- **API structure**: Route handlers organized by resource (`/api/stays`, `/api/bookings`, `/api/reviews`).
- **Next.js usage**: `next/image` and `next/link` used correctly in StayCard, Gateway, StayDetailClient, CocoonDiscovery.
- **TypeScript**: `types/index.ts` defines Stay, Booking, Review, AvailabilityResponse.
- **Data flow**: TanStack Query for fetching, caching, invalidation.
- **Image config**: `next.config.mjs` sets image formats and sizes.
- **Accessibility**: Many components use `aria-label`, `aria-hidden`, `focus-visible:ring`, nav labels.
- **Availability**: `GET /api/stays/:id/availability` checks both availability windows and existing bookings.

### Issues observed (reference Phase 1–2 tasks)

| Area | Issue | Maps to | Status |
|------|-------|---------|--------|
| **API** | `GET /api/bookings` returns all bookings; no `coupleName` filter | Phase 2.3 | ⬜ |
| **API** | `POST /api/bookings` — no validation for `stayId`, `coupleName`, `checkIn`, `checkOut` | Phase 2.1 | ⬜ |
| **API** | `POST /api/bookings` — no check for `checkOut <= checkIn` | Phase 2.6 | ⬜ |
| **API** | `POST /api/stays/:id/reviews` — no validation for `coupleName`, `rating`, `text` | Phase 2.2 | ⬜ |
| **API** | `GET /api/stays` date filter checks availability windows only, not existing bookings | Phase 2.4 | ⬜ |
| **API** | `sort=resonance` duplicates `sort=rating_desc` | Phase 2.5 | ⬜ |
| **API** | No structured logging on route handlers | Phase 2.7 | ⬜ |
| **Config** | `typescript.ignoreBuildErrors: true` in `next.config.mjs` | Phase 1.1 | ✅ |
| **Config** | `lint` uses `eslint .`; no ESLint config; Biome is configured | Phase 1.2 | ✅ |
| **Deps** | Unused: `zod`, `recharts`, `input-otp`, `react-resizable-panels` | Phase 1.3 | ✅ |
| **Deps** | Valibot on beta (`^1.0.0-beta.0`) | Phase 1.4 | ✅ |

### Additional findings (not yet in Phase 1–2)

| Area | Issue |
|------|-------|
| **Components** | `<a>` instead of `<Link>` in `booking-form.tsx` (internal link to `/our-cocoon`) |
| **Components** | Review form: inputs lack labels; star rating buttons lack `aria-label` |

### Data layer notes

- In-memory mutation: `bookings.push()` and `reviews.push()` mutate imported JSON; changes are not persisted.
- JSON imports create a mutable copy; runtime changes are lost on restart. Acceptable for Phase 0 mock.

---

## What Phase 1 changed (done)

- **BE solution remains as-is** — Next.js Route Handlers stay; no separate Express API.
- **1.0** ✅ Root `package.json` with `dev` and `lint` scripts; run from root: `pnpm dev` or `yarn dev`.
- **1.1** ✅ Removed `typescript.ignoreBuildErrors`; fixed Calendar CustomComponents type assertion.
- **1.2** ✅ Aligned `lint` to `biome check .`; added `@biomejs/biome`.
- **1.3** ✅ Removed unused deps: `zod`, `recharts`, `input-otp`, `react-resizable-panels`; removed chart, input-otp, resizable components.
- **1.4** ✅ Pinned `valibot` to `^1.2.0`.
- **1.5** ✅ commitlint + husky for Conventional Commits.
- **1.6** ✅ Documented in [docs/phase-1-setup.md](phase-1-setup.md).

See [../plans/TODOS.md](../plans/TODOS.md) Phase 1 and [docs/phase-1-setup.md](phase-1-setup.md).

