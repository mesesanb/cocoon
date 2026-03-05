# Phase 8: Tests and CI

## Overview

Phase 8 adds **meaningful tests** (unit, component, and API route) and a **CI pipeline** so that lint, test, and build run on every push/PR. This satisfies the assessment NFRs for testing and CI.

---

## What Was Added

### 1. Test stack

| Tool | Purpose |
|------|--------|
| **Vitest** | Test runner (fast, Vite-native, TypeScript-friendly) |
| **@testing-library/react** | Component tests with user-centric queries |
| **@testing-library/jest-dom** | DOM matchers (`toBeInTheDocument`, etc.) |
| **jsdom** | Browser-like environment for component tests |
| **@vitejs/plugin-react** | JSX/React transform for Vitest |

- **Config**: `vitest.config.ts` at repo root — uses `jsdom`, path alias `@/` → root, and `tests/setup.ts` for jest-dom.
- **Scripts** (in `package.json`):
  - `pnpm test` — run tests once (used in CI).
  - `pnpm test:watch` — run tests in watch mode locally.

### 2. Unit tests

**`lib/validators.test.ts`**

- `validateBookingBody`: valid payload; non-object body; missing/empty `stayId` and `userId`; invalid date format; `checkOut <= checkIn`.
- `validateReviewBody`: valid payload; non-object body; missing/empty `coupleName` and `userId`; rating outside 1–5; text shorter than 10 characters; text exactly 10 characters.

**`utils/dates.test.ts`**

- `calculateNights`: 1 night, 2 nights, 0 for same day, multi-week.
- `datesOverlap`: overlapping ranges; non-overlapping; adjacent (end = start).
- `formatDate` / `formatDateRange`: basic formatting.

### 3. Component test

**`components/review-card.test.tsx`**

- Renders couple name, date, review text, and resonance score.
- Uses fallback **"Cocoon couple"** when `coupleName` is empty or whitespace.

### 4. API route test

**`tests/api/stays-route.test.ts`**

- Imports `GET` from `@/app/api/stays/route` and calls it with `NextRequest`.
- **GET /api/stays**: returns 200 and an array.
- **GET /api/stays?checkIn=…&checkOut=…** (same date): returns 400 and error message.
- **GET /api/stays?type=FOREST**: returns 200 and only stays with `scenario === "FOREST"`.

No server is started; the handler is invoked directly, so these are **handler-level** tests.

### 5. CI pipeline

**`.github/workflows/ci.yml`**

- **Triggers**: `push` and `pull_request` on `main` and `develop`.
- **Job**: single job `lint-build-test` on `ubuntu-latest`.
- **Steps**:
  1. Checkout.
  2. Install pnpm (v9).
  3. Setup Node.js 20 with pnpm cache.
  4. `pnpm install --frozen-lockfile`.
  5. **Lint**: `pnpm lint` (Biome).
  6. **Test**: `pnpm test` (Vitest).
  7. **Build**: `pnpm build` (Next.js production bundle).

If any step fails, the workflow fails. Commit an up-to-date `pnpm-lock.yaml` so CI can use `--frozen-lockfile`.

---

## Files Created or Modified

| Path | Change |
|------|--------|
| `package.json` | Added `test`, `test:watch` scripts; devDependencies: vitest, @testing-library/react, @testing-library/jest-dom, jsdom, @vitejs/plugin-react |
| `vitest.config.ts` | New — Vitest config with jsdom, path alias, setup file, include/exclude |
| `tests/setup.ts` | New — imports `@testing-library/jest-dom/vitest` |
| `lib/validators.test.ts` | New — 13 tests for booking and review validators |
| `utils/dates.test.ts` | New — 8 tests for date utils |
| `components/review-card.test.tsx` | New — 5 tests for ReviewCard |
| `tests/api/stays-route.test.ts` | New — 3 tests for GET /api/stays |
| `.github/workflows/ci.yml` | New — CI workflow |

---

## Running Tests Locally

```bash
pnpm install   # if you haven’t already
pnpm test      # run once (same as CI)
pnpm test:watch   # watch mode
```

---

## What’s Not Done (Future Work)

- **8.2** More component tests (e.g. forms, StayCard) can be added alongside ReviewCard.
- **8.3** Additional API route tests for POST bookings, POST reviews, GET availability, using the same “invoke handler + NextRequest” pattern (or supertest if preferred).
- **8.4** E2E with Playwright: full flow search → details → add review → checkout.
- **8.6** Release process: tags, changelog, version bump; optional deploy (e.g. Vercel).

Phase 8 documentation is complete for the tests and CI that were added in this branch.
