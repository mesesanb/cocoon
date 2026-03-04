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
  - **BE solution remains as-is**: Do **not** assume monorepo, Vite, or separate Express API. Next.js Route Handlers are the backend; no `apps/api` or `packages/shared` planned.

- **File layout**
  - Do **not** move or rename files in `plans/` or `docs/` unless explicitly instructed in `plans/TODOS.md` or by the user.
  - Phase docs for completed phases must live in `docs/phase-{N}-{slug}.md` and be listed in `docs/README.md`.

- **Phase 0 baseline (current)**
  - Use Next.js 16 + React 19 in `apps/web`; API is via Next.js Route Handlers under `app/api/`.
  - Data comes from `apps/web/data/stays.json`; do **not** introduce a database.
  - Package manager is **pnpm** for `apps/web`. Phase 1 will add root `package.json` with `yarn dev` (no full monorepo).

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

**Context to load**: `plans/Initial_Planning.md`, `plans/TODOS.md`, `plans/phase-1-setup.md`

**Prompt**:
```
Implement Phase 1 (Setup) from plans/TODOS.md and plans/phase-1-setup.md. BE solution remains as-is — no monorepo, no apps/api, no packages/shared.

- 1.0: Add root package.json with yarn dev; move/restructure files so root runs the app
- 1.1: Fix typescript.ignoreBuildErrors: true in next.config.mjs; resolve exposed TS errors
- 1.2: Align lint script: replace "eslint ." with "biome check ." in apps/web/package.json
- 1.3: Remove unused v0 artifacts from deps: zod, recharts, input-otp, react-resizable-panels
- 1.4: Pin valibot to a stable non-beta release; verify forms still work
- 1.5: Guard commit messages: commitlint + husky to enforce Conventional Commits
- 1.6: Document Phase 1 in docs/phase-1-setup.md

When done:
1. Mark Phase 1 todos complete in plans/TODOS.md
2. Write docs/phase-1-setup.md explaining what was built and key decisions
```

---

## Phase 2: API Polish

**Context to load**: `plans/Initial_Planning.md`, `plans/TODOS.md`, `docs/phase-1-setup.md` (if exists), `apps/web/app/api/`

**Prompt**:
```
Implement Phase 2 (API Polish) from plans/TODOS.md. All 7 routes already exist as Next.js Route Handlers. Polish correctness, validation, and observability — no new routes.

- 2.1: Input validation on POST /api/bookings — check stayId, coupleName, checkIn, checkOut; return 400 on missing/invalid
- 2.2: Input validation on POST /api/stays/:id/reviews — check coupleName, rating (1–5), text (min length)
- 2.3: Fix GET /api/bookings — accept coupleName query param; do not return all bookings unfiltered
- 2.4: Align availability check in GET /api/stays list — add booking-conflict check (not just availability windows)
- 2.5: Remove duplicate sort option — sort=resonance duplicates sort=rating_desc; consolidate
- 2.6: Guard calculateNights against zero/negative — return 400 if checkOut <= checkIn
- 2.7: Add structured logging on route handlers (method, path, status, duration)

When done:
1. Mark Phase 2 todos complete in plans/TODOS.md
2. Write docs/phase-2-api.md
```

---

## Phase 3: Search + List

**Context to load**: `plans/Initial_Planning.md`, `plans/TODOS.md`, `docs/phase-0-ui.md`, `docs/phase-2-api.md` (if exists), `apps/web` structure

**Prompt**:
```
Implement Phase 3 (Search + List) from plans/TODOS.md. Search UI, filters, StayCard, and discovery toolbar already exist from Phase 0. Focus on:

- Configure TanStack Query provider and typed API client (fetch wrappers for Next.js Route Handlers)
- Stays hooks: useStays (with filters), useStay
- Ensure search page uses API client; results grid has loading and empty states

API is Next.js Route Handlers in apps/web/app/api/ (not Express). Follow Shadcn + Tailwind from Initial_Planning.md. When done:
1. Mark Phase 3 todos complete in plans/TODOS.md
2. Write docs/phase-3-search.md
```

---

## Phase 4: Stay Details

**Context to load**: `plans/Initial_Planning.md`, `plans/TODOS.md`, `docs/phase-0-ui.md`, `docs/phase-3-search.md`, `apps/web`

**Prompt**:
```
Implement Phase 4 (Stay Details) from plans/TODOS.md. Stay details page, hero, map (OpenStreetMap + Leaflet + Esri), date picker, guests selector, and live price already exist from Phase 0. Focus on:

- 4.5: "Reserve" / "Book now" CTA → checkout flow
- Document Phase 4 in docs/phase-4-details.md

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

- Reviews section: list (paginated/sortable)
- Add review form: rating 1–5, text, basic validation/moderation
- POST to /api/stays/:id/reviews (Next.js Route Handler), invalidate query, show new review

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

**Context to load**: `plans/Initial_Planning.md`, `plans/TODOS.md`, all `docs/phase-*.md`, full `apps/web`

**Prompt**:
```
Implement Phase 8 (Tests + CI) from plans/TODOS.md. Add testing and CI:

- Unit tests (Vitest): utils, hooks
- Component tests (RTL + Vitest): forms, StayCard
- API tests (supertest or fetch): Next.js Route Handlers (stays, reviews, bookings)
- E2E (Playwright): search → details → add review → checkout
- GitHub Actions: lint, test, build on push/PR

API is Next.js Route Handlers in apps/web/app/api/. When done:
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
