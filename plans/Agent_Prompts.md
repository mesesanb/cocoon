# Agent Prompts — Implementation Guide

**Reference**: [How I 10x'd My AI Coding Productivity](https://looking-ahead.hotmetalapp.com/how-i-10x-d-my-ai-coding-productivity-and-you-can-too)

Before each phase: **load context** (don’t dump the whole codebase). After each phase: **update TODOS.md** and **write docs/**.

---

## Context reset (start of each new phase)

Load these files first:
- `plans/Initial_Planning.md` — product, stack, architecture, constraints
- `plans/TODOS.md` — current progress
- `plans/Agent_Prompts.md` — this file
- `docs/phase-0-ui.md` — Phase 0 delivered (Next.js app, API routes, data)
- `docs/phase-X-*.md` — for all completed phases (if any)

### Hard constraints for agents (do not break these)

- **Docs as source of truth**
  - Treat `README.md`, `docs/README.md`, and `docs/phase-0-ui.md` as facts about the current stack and layout.
  - Do **not** assume we have a monorepo, Vite, or NestJS until the corresponding phase is actually implemented and documented in `docs/phase-N-*.md`.

- **File layout**
  - Do **not** move or rename files in `plans/` or `docs/` unless explicitly instructed in `plans/TODOS.md` or by the user.
  - Phase docs for completed phases must live in `docs/phase-{N}-{slug}.md` and be listed in `docs/README.md`.

- **Phase 0 baseline (current)**
  - Use Next.js 16 + React 19 in `apps/web`; API is via Next.js Route Handlers under `app/api/`.
  - Data comes from `apps/web/data/stays.json`; do **not** introduce a database.
  - Package manager is **pnpm** for `apps/web`; do **not** add a root Yarn workspace until Phase 1 is implemented.

- **Planning vs implementation**
  - `plans/phase-1-setup.md` and later phase docs are **plans**, not evidence that they’re implemented.
  - Before modifying architecture, check whether the corresponding `docs/phase-N-*.md` exists. If it does not, treat that phase as not implemented yet.

- **Prompts + docs stability**
  - When adding new docs or changing structure, always update `plans/TODOS.md`, `plans/Agent_Prompts.md`, and `docs/README.md` so links stay in sync.

---

## Phase 0: v0.app UI (complete)

Phase 0 is done. See [docs/phase-0-ui.md](../docs/phase-0-ui.md). Baseline: `apps/web` only; API via Next.js Route Handlers; data in `apps/web/data/stays.json`.

---

## Phase 1: Setup

**Context to load**: `plans/Initial_Planning.md`, `plans/TODOS.md`

**Prompt**:
```
Implement Phase 1 (Setup) from plans/TODOS.md. Create a monorepo for the Cocoon: Here, us. project:

- Yarn workspaces or Turborepo
- apps/web: Vite + React + TypeScript + Shadcn/ui + Tailwind
- apps/api: NestJS
- packages/shared: shared types (Stay, Review, Booking) from Initial_Planning.md data models
- Root script: yarn dev runs both apps with concurrently

Follow Initial_Planning.md for tech stack. Do not overengineer. When done:
1. Mark Phase 1 todos complete in plans/TODOS.md
2. Write docs/phase-1-setup.md explaining what was built and key decisions
```

---

## Phase 2: Data + API

**Context to load**: `plans/Initial_Planning.md`, `plans/TODOS.md`, `docs/phase-1-setup.md` (if exists), `packages/shared`

**Prompt**:
```
Implement Phase 2 (Data + API) from plans/TODOS.md. Add NestJS endpoints for the Cocoon API:

- Use data/stays.json as source (copy to apps/api/src/data/ or import). Add mock reviews and bookings.
- GET /stays (list, filters: type, location, dates, price; sort)
- GET /stays/:id (details)
- GET /stays/:id/availability
- GET/POST /stays/:id/reviews
- POST /bookings, GET /bookings/:id
- Enable CORS for frontend

Use class-validator DTOs. When done:
1. Mark Phase 2 todos complete in plans/TODOS.md
2. Write docs/phase-2-api.md
```

---

## Phase 3: Search + List

**Context to load**: `plans/Initial_Planning.md`, `plans/TODOS.md`, `docs/phase-1-setup.md`, `docs/phase-2-api.md`, `apps/web` structure

**Prompt**:
```
Implement Phase 3 (Search + List) from plans/TODOS.md. Build the frontend search experience:

- React Router, TanStack Query, typed API client pointing to backend
- Stays hooks: useStays (with filters), useStay
- Search page: search bar, type filters (CITY/FOREST/MOUNTAINS/SEA), sort
- StayCard: image (use `/images/${stay.images[0].path}` per Initial_Planning Image targeting), name, type, rating, price (¤ suffix)
- Results grid with loading and empty states

Follow Shadcn + Tailwind from Initial_Planning.md. When done:
1. Mark Phase 3 todos complete in plans/TODOS.md
2. Write docs/phase-3-search.md
```

---

## Phase 4: Stay Details

**Context to load**: `plans/Initial_Planning.md`, `plans/TODOS.md`, `docs/phase-3-search.md`, `apps/web`

**Prompt**:
```
Implement Phase 4 (Stay Details) from plans/TODOS.md. Build the stay details page:

- Route /stays/:id
- Hero image, title, type badge, rating, description, amenities
- OpenStreetMap + Leaflet + Esri World Imagery: stay location map with satellite imagery (minimalist map or marker; no API key). Coordinates in stays data match location names (secluded for forest/mountain/sea, city for CITY).
- Date picker (react-day-picker) + guests selector
- Live price display (¤)
- "Reserve" or "Book now" CTA linking to checkout

When done:
1. Mark Phase 4 todos complete in plans/TODOS.md
2. Write docs/phase-4-details.md
```

---

## Phase 5: Reviews

**Context to load**: `plans/Initial_Planning.md`, `plans/TODOS.md`, `docs/phase-4-details.md`, `apps/web`

**Prompt**:
```
Implement Phase 5 (Reviews) from plans/TODOS.md. Add reviews to the stay details page:

- List reviews (paginated or load more; sort by newest)
- Add review form: rating 1–5 stars, text field, validation (Valibot or Yup)
- POST to /stays/:id/reviews, invalidate query, show new review
- Basic moderation: min length

When done:
1. Mark Phase 5 todos complete in plans/TODOS.md
2. Write docs/phase-5-reviews.md
```

---

## Phase 6: Checkout

**Context to load**: `plans/Initial_Planning.md`, `plans/TODOS.md`, `docs/phase-5-reviews.md`, `apps/web`

**Prompt**:
```
Implement Phase 6 (Checkout) from plans/TODOS.md. Build the checkout flow:

- Summary: stay, dates, guests, total price
- Guest info: name, email, phone (React Hook Form + Valibot/Yup)
- Mock payment: "Pay with ¤" button → simulate success
- Confirmation page with confirmation ID and summary
- Link back to search / "Discover more"

When done:
1. Mark Phase 6 todos complete in plans/TODOS.md
2. Write docs/phase-6-checkout.md
```

---

## Phase 7: Polish

**Context to load**: `plans/Initial_Planning.md`, `plans/TODOS.md`, `docs/phase-6-checkout.md`, `apps/web`

**Prompt**:
```
Implement Phase 7 (Polish) from plans/TODOS.md. Add:

- Dark/Light theme toggle (Tailwind dark:)
- Loading states (Skeleton/spinner)
- Empty states (no results, etc.)
- Error states (retry, toast)
- Responsive layout (mobile filter drawer)
- Basic a11y: labels, keyboard nav, focus

When done:
1. Mark Phase 7 todos complete in plans/TODOS.md
2. Write docs/phase-7-polish.md
```

---

## Phase 8: Tests + CI

**Context to load**: `plans/Initial_Planning.md`, `plans/TODOS.md`, all `docs/phase-*.md`, full `apps/`

**Prompt**:
```
Implement Phase 8 (Tests + CI) from plans/TODOS.md. Add testing and CI:

- Unit tests (Vitest): utils, hooks
- Component tests (RTL + Vitest): forms, StayCard
- API tests (supertest): stays, reviews, bookings routes
- E2E (Playwright): search → details → add review → checkout
- GitHub Actions: lint, test, build on push/PR

When done:
1. Mark Phase 8 todos complete in plans/TODOS.md
2. Write docs/phase-8-tests.md
```

---

## General rules for the agent

1. **Before starting**: Load plans + completed phase docs. Do not load unrelated code.
2. **While coding**: Stay within scope. No extra features. See Scope & Constraints in Initial_Planning.md.
3. **After each phase**: Update TODOS.md (mark complete, add notes) and write docs/phase-X-*.md.
4. **Context reset**: Before the next phase, start a fresh context and load only what’s needed.
5. **Assumptions**: If you make any, document them in the phase doc.
