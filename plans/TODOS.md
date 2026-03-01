# TODOS — Cocoon: Here, us. Implementation

**Workflow reference**: [How I 10x'd My AI Coding Productivity](https://looking-ahead.hotmetalapp.com/how-i-10x-d-my-ai-coding-productivity-and-you-can-too)

**Rule**: After each todo, the agent updates this file — mark complete, add brief notes. Keep it current.

---

## Phase 1: Setup

| # | Todo | Status | Notes |
|---|------|--------|-------|
| 1.1 | Create monorepo (yarn workspaces or Turborepo) with `apps/web` and `apps/api` | ⬜ | |
| 1.2 | Scaffold `apps/web` — Vite + React + TypeScript | ⬜ | |
| 1.3 | Add Shadcn/ui + Tailwind to `apps/web` | ⬜ | |
| 1.3b | Copy `GENERATED_IMAGES/` to `apps/web/public/images/` (see Initial_Planning: Image targeting) | ⬜ | |
| 1.4 | Scaffold `apps/api` — NestJS | ⬜ | |
| 1.5 | Create `packages/shared` with shared types (Stay, Review, Booking) | ⬜ | |
| 1.6 | Root `package.json`: `yarn dev` runs both apps (concurrently) | ⬜ | |
| 1.7 | Document Phase 1 in `docs/phase-1-setup.md` | ⬜ | |

---

## Phase 2: Data + API

| # | Todo | Status | Notes |
|---|------|--------|-------|
| 2.1 | Copy `data/stays.json` to `apps/api/src/data/` (or import); add mock reviews + bookings | ⬜ | |
| 2.2 | Create `StaysModule`, `StaysController`, `StaysService` — GET /stays (list with filters) | ⬜ | |
| 2.3 | Add GET /stays/:id (details) | ⬜ | |
| 2.4 | Add GET /stays/:id/availability | ⬜ | |
| 2.5 | Create mock reviews, `ReviewsModule` — GET/POST /stays/:id/reviews | ⬜ | |
| 2.6 | Create mock bookings, `BookingsModule` — POST /bookings, GET /bookings/:id | ⬜ | |
| 2.7 | Enable CORS for frontend origin | ⬜ | |
| 2.8 | Document Phase 2 in `docs/phase-2-api.md` | ⬜ | |

---

## Phase 3: Search + List (Frontend)

| # | Todo | Status | Notes |
|---|------|--------|-------|
| 3.1 | Set up React Router, TanStack Query, API client | ⬜ | |
| 3.2 | Create stays API hooks (useStays, useStay) | ⬜ | |
| 3.3 | Build Search page: search bar, type filters (CITY/FOREST/MOUNTAINS/SEA), sort | ⬜ | |
| 3.4 | Build StayCard component (image, name, type, rating, price) | ⬜ | |
| 3.5 | Results grid with loading + empty states | ⬜ | |
| 3.6 | Document Phase 3 in `docs/phase-3-search.md` | ⬜ | |

---

## Phase 4: Stay Details

| # | Todo | Status | Notes |
|---|------|--------|-------|
| 4.1 | Stay details page route and layout | ⬜ | |
| 4.2 | Hero image, title, type, rating, description, amenities | ⬜ | |
| 4.3 | Date picker + guests selector, live price display | ⬜ | |
| 4.4 | "Reserve" / "Book now" CTA → checkout | ⬜ | |
| 4.5 | Document Phase 4 in `docs/phase-4-details.md` | ⬜ | |

---

## Phase 5: Reviews

| # | Todo | Status | Notes |
|---|------|--------|-------|
| 5.1 | Reviews section on stay details — list (paginated/sortable) | ⬜ | |
| 5.2 | Add review form: rating (1–5), text, basic validation | ⬜ | |
| 5.3 | POST review, invalidate query, show new review | ⬜ | |
| 5.4 | Document Phase 5 in `docs/phase-5-reviews.md` | ⬜ | |

---

## Phase 6: Checkout

| # | Todo | Status | Notes |
|---|------|--------|-------|
| 6.1 | Checkout page: summary (stay, dates, guests, price) | ⬜ | |
| 6.2 | Guest info form (name, email, phone) — React Hook Form + Valibot/Yup | ⬜ | |
| 6.3 | Mock payment step ("Pay with ETH/BTC" → simulate success) | ⬜ | |
| 6.4 | Confirmation page (confirmation ID, summary) | ⬜ | |
| 6.5 | Document Phase 6 in `docs/phase-6-checkout.md` | ⬜ | |

---

## Phase 7: Polish

| # | Todo | Status | Notes |
|---|------|--------|-------|
| 7.1 | Dark/Light theme toggle | ⬜ | |
| 7.2 | Loading states (Skeleton, spinner) | ⬜ | |
| 7.3 | Empty states (no results, etc.) | ⬜ | |
| 7.4 | Error states (retry, toast) | ⬜ | |
| 7.5 | Responsive (mobile drawer for filters) | ⬜ | |
| 7.6 | Basic a11y (labels, keyboard, focus) | ⬜ | |
| 7.7 | Document Phase 7 in `docs/phase-7-polish.md` | ⬜ | |

---

## Phase 8: Tests + CI

| # | Todo | Status | Notes |
|---|------|--------|-------|
| 8.1 | Unit tests: key utils, hooks (Vitest) | ⬜ | |
| 8.2 | Component tests: forms, StayCard (RTL + Vitest) | ⬜ | |
| 8.3 | API tests: stays, reviews, bookings (supertest) | ⬜ | |
| 8.4 | E2E test: search → details → add review → checkout (Playwright) | ⬜ | |
| 8.5 | GitHub Actions: lint + test + build | ⬜ | |
| 8.6 | Document Phase 8 in `docs/phase-8-tests.md` | ⬜ | |

---

## Submission Checklist

| # | Todo | Status | Notes |
|---|------|--------|-------|
| S1 | README: setup, scripts, architecture, tradeoffs, what's next | ⬜ | |
| S2 | LLM usage note (what you used it for, approach) | ⬜ | |
| S3 | Recording presenting the solution | ⬜ | |

---

**Legend**: ⬜ Pending | ✅ Done | ⏸ Skipped
