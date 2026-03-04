# Phase 1: Setup — Todo breakdown

**Source**: [TODOS.md](../plans/TODOS.md) Phase 1.  
**Reference**: [Initial_Planning.md](../plans/Initial_Planning.md) §3 Tech Stack, §13 Single-command Run.

Phase 1 adds **root `yarn dev`** (or `pnpm dev`) and developer hygiene. The core architecture is settled: **BE solution remains as-is** — `apps/web` stays Next.js 16; Next.js Route Handlers remain the backend; no monorepo, no Vite migration, no separate `apps/api`. All must-have API endpoints are already live from Phase 0.

---

## Architecture decisions (recorded)

| Question | Decision | Rationale |
|----------|----------|-----------|
| Keep Next.js or migrate to Vite? | **Keep Next.js** | Phase 0 is deeply Next.js-specific. Migration would be pure churn with no product value. |
| Add separate Express `apps/api`? | **No — use Route Handlers** | Next.js Route Handlers satisfy the assignment. All 7 required endpoints are implemented. |
| Yarn workspaces / monorepo? | **Minimal — root `dev` only** | Root `package.json` with `dev` script; runs `cd apps/web && pnpm dev`. No full monorepo. |
| Package manager | **pnpm** | Already working; root uses pnpm for husky/commitlint. |

---

## What was changed

### 1.0 — Root `package.json` with `dev` script

- Added root `package.json` with `"dev": "cd apps/web && pnpm dev"`.
- Run from repo root: `pnpm dev` or `yarn dev` (if yarn is installed).
- App starts at http://localhost:3000.

### 1.1 — Removed `typescript.ignoreBuildErrors`

- Removed `typescript: { ignoreBuildErrors: true }` from `apps/web/next.config.mjs`.
- Fixed exposed TypeScript error: `Calendar` component `CustomComponents` type mismatch with react-day-picker (resolved via type assertion).

### 1.2 — Lint script aligned to Biome

- Replaced `"lint": "eslint ."` with `"lint": "biome check ."` in `apps/web/package.json`.
- Added `@biomejs/biome` as dev dependency.
- Migrated `biome.json` to schema 2.4.5; excluded `app/globals.css` and `styles/globals.css` (Tailwind directives).
- Fixed lint issues: `parseInt` radix, import types, format, `noArrayIndexKey` (with targeted ignores where appropriate).

### 1.3 — Removed unused v0 artifacts

- **Packages removed**: `zod`, `recharts`, `input-otp`, `react-resizable-panels`.
- **Components removed**: `chart.tsx`, `input-otp.tsx`, `resizable.tsx` (unused in Cocoon).

### 1.4 — Pinned Valibot to stable

- Replaced `"valibot": "^1.0.0-beta.0"` with `"valibot": "^1.2.0"`.
- Forms using Valibot schemas verified working.

### 1.5 — Commit message guard (commitlint + husky)

- Installed `husky`, `@commitlint/cli`, `@commitlint/config-conventional` at root.
- Added `.husky/commit-msg` hook running `commitlint --edit $1`.
- Added `commitlint.config.js` extending `@commitlint/config-conventional`.
- Commits must follow [Conventional Commits](https://www.conventionalcommits.org/) (e.g. `feat(search): add filters`, `fix(api): validate booking body`).

---

## How to run

```bash
# From repo root
pnpm dev
# or
yarn dev
```

Or from `apps/web`:

```bash
cd apps/web
pnpm dev
```

---

## Phase 2: API polish — what to know

The existing Route Handler surface (Phase 0) is unchanged. Phase 2 will add:

- Input validation on `POST /bookings` and `POST /stays/:id/reviews`
- Fix `GET /api/bookings` to accept `coupleName` query param
- Booking-conflict check in availability
- Consolidate sort options (remove `resonance` duplicate)
- Guard `calculateNights` against zero/negative
- Structured logging on route handlers

All 7 routes remain in `apps/web/app/api/`:

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/stays?query=&type=&checkIn=&checkOut=&minPrice=&maxPrice=&sort=` | List/search stays |
| GET | `/api/stays/[id]` | Stay details |
| GET | `/api/stays/[id]/availability?checkIn=&checkOut=` | Availability + price |
| GET | `/api/stays/[id]/reviews` | Reviews |
| POST | `/api/stays/[id]/reviews` | Add review |
| POST | `/api/bookings` | Create booking |
| GET | `/api/bookings/[confirmationId]` | Booking confirmation |
