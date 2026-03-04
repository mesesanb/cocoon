# TODOS — Cocoon: Here, us. Implementation

**Workflow reference**: [How I 10x'd My AI Coding Productivity](https://looking-ahead.hotmetalapp.com/how-i-10x-d-my-ai-coding-productivity-and-you-can-too)

**Rule**: After each todo, the agent updates this file — mark complete, add brief notes. Keep it current.

**Assessment alignment**: Todos below map to the **Original Assignment Brief** in `plans/Initial_Planning.md` — must-haves (search, stay details, reviews, availability+price, checkout, frontend→API), non-functional (single-command run, responsive, loading/empty/error, a11y, tests, observability), release (CI, build, release), and submission (README, LLM note, recording).

**Sync with Initial_Planning**: Stack (Next.js 16, React 19, TS, Shadcn, Tailwind; Next.js Route Handlers as backend; pnpm), API surface (§6), image targeting, and NFRs are reflected in these phases. **Architecture decision**: Next.js at root; no monorepo; no separate Express backend; package manager stays pnpm. Phase 0 breakdown → `docs/phase-0-ui.md`. Phase 1 plan → `plans/phase-1-setup.md`.

---

## Commit messages (Conventional Commits — 2026)

Use [Conventional Commits](https://www.conventionalcommits.org/) for every commit. Format: `type[(scope)]: description` (imperative, lowercase).

| Type | Use for |
|------|--------|
| **feat** | New feature (e.g. `feat(search): add type filters`) |
| **fix** | Bug fix |
| **chore** | Tooling, config, deps (no src/test change) |
| **docs** | Documentation only |
| **style** | Formatting, whitespace (no logic change) |
| **refactor** | Code change that is not fix or feat |
| **perf** | Performance improvement |
| **test** | Adding or updating tests |
| **build** | Build system or external deps |
| **ci** | CI config (e.g. GitHub Actions) |

- Optional **scope**: e.g. `feat(api):`, `fix(web):`.
- **Breaking changes**: `feat(api)!: remove legacy endpoint` or footer `BREAKING CHANGE: ...`.
- Keep description short; add body/footer if needed.
- **Guard**: Enforce with commitlint + husky (see Phase 1 todo 1.5).

---

## Phase 0: v0.app UI ✅

*Detailed breakdown: [docs/phase-0-ui.md](docs/phase-0-ui.md). Current state: Next.js app at root, API via Next.js Route Handlers. Architecture is final — no monorepo planned. Post-integration refinements (discovery toolbar, search bar, image/video optimisation) are documented in the same file.*

| # | Todo | Status | Notes |
|---|------|--------|-------|
| 0.1 | Paste `plans/v0_prompt.md` into v0.dev; generate Cocoon UI (glassmorphism, narrative phases, StayCard) | ✅ | v0 output integrated; app at root |
| 0.2 | Export/copy generated code for integration | ✅ | Next.js 16, React 19; run: `pnpm dev` from root → http://localhost:3000 |
| 0.3 | Stay location map (OpenStreetMap + Leaflet, Esri satellite imagery; coordinates in `stays.json` match location names) | ✅ | `StayMap` component; forest/mountain/sea → secluded areas; city → city centers |

---

## Phase 1: Setup

*Architecture settled: Next.js stays; BE solution remains as-is; no monorepo; no separate Express backend. Add root `yarn dev`; files will be moved/restructured. Detailed breakdown: [plans/phase-1-setup.md](phase-1-setup.md).*

| # | Todo | Status | Notes |
|---|------|--------|-------|
| 1.0 | Add root `package.json` with `yarn dev`; move/restructure files so root runs the app | ✅ | Root `pnpm dev` / `yarn dev` |
| 1.1 | Fix `typescript.ignoreBuildErrors: true` in `next.config.mjs`; resolve exposed TS errors | ✅ | Calendar CustomComponents type assertion |
| 1.2 | Align `lint` script: replace `eslint .` with `biome check .` in `package.json` | ✅ | Biome 2.4.5; @biomejs/biome added |
| 1.3 | Remove unused v0 artifacts from deps: `zod`, `recharts`, `input-otp`, `react-resizable-panels` | ✅ | Removed packages + chart, input-otp, resizable components |
| 1.4 | Pin `valibot` to a stable non-beta release; verify forms still work | ✅ | valibot ^1.2.0 |
| 1.5 | **Guard commit messages**: commitlint + husky to enforce Conventional Commits on commit | ✅ | .husky/commit-msg; commitlint.config.js |
| 1.6 | Document Phase 1 in `docs/phase-1-setup.md` | ✅ | docs/phase-1-setup.md |

---

## Phase 2: API Polish

*Assessment: Backend API surface (must-have). All 7 routes are already live as Next.js Route Handlers from Phase 0. Phase 2 polishes correctness, validation, and observability — no new routes needed.*

| # | Todo | Status | Notes |
|---|------|--------|-------|
| 2.1 | Input validation on `POST /bookings` — check required fields (`stayId`, `coupleName`, `checkIn`, `checkOut`); return 400 on missing/invalid | ⬜ | |
| 2.2 | Input validation on `POST /stays/:id/reviews` — check `coupleName`, `rating` (1–5), `text` (min length) | ⬜ | |
| 2.3 | Fix `GET /api/bookings` — accept `coupleName` query param; do not return all bookings unfiltered | ⬜ | |
| 2.4 | Align availability check in `GET /stays` list — add booking-conflict check (currently only checks availability windows, not existing bookings) | ⬜ | |
| 2.5 | Remove duplicate sort option — `sort=resonance` duplicates `sort=rating_desc`; consolidate | ⬜ | |
| 2.6 | Guard `calculateNights` against zero/negative — return 400 in routes if `checkOut <= checkIn` | ⬜ | |
| 2.7 | **Observability (assessment NFR)**: Add structured logging on route handlers (method, path, status, duration) | ⬜ | |
| 2.8 | Document Phase 2 in `docs/phase-2-api.md` | ⬜ | |

---

## Phase 3: Search + List (Frontend)

*Assessment must-have: Search or browse stays (filters and sorting); frontend calls backend API.*

| # | Todo | Status | Notes |
|---|------|--------|-------|
| 3.1 | Configure TanStack Query provider and typed API client (fetch wrappers for Next.js Route Handlers) | ⬜ | |
| 3.2 | Create stays API hooks (useStays, useStay) | ⬜ | |
| 3.3 | Build Search page: search bar, type filters (CITY/FOREST/MOUNTAINS/SEA), sort | ⬜ | |
| 3.4 | Build StayCard component (image, name, type, rating, price) | ⬜ | |
| 3.5 | Results grid with loading + empty states | ⬜ | |
| 3.6 | Document Phase 3 in `docs/phase-3-search.md` | ⬜ | |

---

## Phase 4: Stay Details

*Assessment must-have: Stay details page; availability + price display. Map implemented in Phase 0 (OpenStreetMap + Leaflet, Esri satellite imagery; no API key).*

| # | Todo | Status | Notes |
|---|------|--------|-------|
| 4.1 | Stay details page route and layout | ✅ | Done in Phase 0 |
| 4.2 | Hero image, title, type, rating, description, amenities | ✅ | Done in Phase 0 |
| 4.3 | Date picker + guests selector, live price display (availability + price) | ✅ | Done in Phase 0 |
| 4.4 | **OpenStreetMap + Leaflet**: Stay location map (satellite imagery; no API key) | ✅ | Done in Phase 0 (`StayMap`, Esri World Imagery) |
| 4.5 | "Reserve" / "Book now" CTA → checkout | ⬜ | |
| 4.6 | Document Phase 4 in `docs/phase-4-details.md` | ⬜ | |

---

## Phase 5: Reviews

*Assessment must-have: Reviews/comments — list + add review (moderation can be basic).*

| # | Todo | Status | Notes |
|---|------|--------|-------|
| 5.1 | Reviews section on stay details — list (paginated/sortable) | ⬜ | |
| 5.2 | Add review form: rating (1–5), text, basic validation/moderation | ⬜ | |
| 5.3 | POST review, invalidate query, show new review | ⬜ | |
| 5.4 | Document Phase 5 in `docs/phase-5-reviews.md` | ⬜ | |

---

## Phase 6: Checkout

*Assessment must-have: Checkout flow that results in a confirmed booking (payment can be mocked).*

| # | Todo | Status | Notes |
|---|------|--------|-------|
| 6.1 | Checkout page: summary (stay, dates, guests, price) | ⬜ | |
| 6.2 | Guest info form (name, email, phone) — React Hook Form + Valibot/Yup | ⬜ | |
| 6.3 | Mock payment step ("Pay with ¤" → simulate success) | ⬜ | |
| 6.4 | Confirmation page (confirmation ID, summary) | ⬜ | |
| 6.5 | Document Phase 6 in `docs/phase-6-checkout.md` | ⬜ | |

---

## Phase 7: Polish

*Assessment NFRs: Responsive (desktop + mobile); loading + empty + error states; basic accessibility.*

| # | Todo | Status | Notes |
|---|------|--------|-------|
| 7.1 | Dark/Light theme toggle | ⬜ | |
| 7.2 | Loading states (Skeleton, spinner) for async screens | ⬜ | |
| 7.3 | Empty states (no results, etc.) | ⬜ | |
| 7.4 | Error states (retry, toast) | ⬜ | |
| 7.5 | **Responsive (assessment NFR)**: Desktop + mobile; mobile drawer for filters | ⬜ | |
| 7.6 | **Basic a11y (assessment NFR)**: Labels, keyboard nav, sensible focus | ⬜ | |
| 7.7 | Document Phase 7 in `docs/phase-7-polish.md` | ⬜ | |

---

## Phase 8: Tests + CI

*Assessment NFRs: Meaningful tests (unit and/or integration/e2e); CI pipeline; build; release approach.*

| # | Todo | Status | Notes |
|---|------|--------|-------|
| 8.1 | Unit tests: key utils, hooks (Vitest) | ⬜ | |
| 8.2 | Component tests: forms, StayCard (RTL + Vitest) | ⬜ | |
| 8.3 | API tests: stays, reviews, bookings (supertest) | ⬜ | |
| 8.4 | E2E test: search → details → add review → checkout (Playwright) | ⬜ | |
| 8.5 | **CI (assessment)**: GitHub Actions — lint + test on PR/push; **build** step for production bundle | ⬜ | |
| 8.6 | **Release (assessment)**: Simple release (tags, changelog, version bump); optional deploy (Vercel/Netlify/Render) | ⬜ | |
| 8.7 | Document Phase 8 in `docs/phase-8-tests.md` | ⬜ | |

---

## Submission Checklist

*Assessment: What to submit.*

| # | Todo | Status | Notes |
|---|------|--------|-------|
| S1 | **README**: setup, scripts, architecture notes, tradeoffs, what you would do next | ⬜ | |
| S2 | **LLM usage note**: what you used it for, prompts/approach, guardrails | ⬜ | |
| S3 | **Recording** presenting the solution | ⬜ | |
| S4 | Git repo link with full source (frontend + backend) | ⬜ | |

---

**Legend**: ⬜ Pending | ✅ Done | ⏸ Skipped
