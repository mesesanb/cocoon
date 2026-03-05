# Cocoon: Here, us.

**A psychological retreat for couples to reconnect in nature-based solitude.**

---

## What is this?

Cocoon is a full-stack travel booking web app focused on **unusual stays only** — treehouses, lighthouses, floating homes, beach houses — the kind of places that *are* the destination. Users discover stays by scenario (CITY, FOREST, MOUNTAINS, SEA), view details and reviews, and complete a checkout flow with mock payment (¤). The UI uses an ethereal glassmorphism theme, Framer Motion narrative flow, and a single reusable StayCard across listings, history, and upcoming bookings.

> Frontend and API live in one Next.js app at the repo root. Data is served from JSON files (no database). Built to satisfy a Booking.com-style assignment with a memorable product angle and clear engineering choices.

**Assets**: Images and videos in `public/images/` and `public/videos/` were generated with **Gemini**.

---

## Features

| Capability | Description |
|------------|-------------|
| **Search / browse** | Stays list with filters (type, location, dates, guests, price) and sorting |
| **Stay details** | Hero, description, amenities, availability + price, reviews, location map (OpenStreetMap + Leaflet, satellite imagery, no API key) |
| **Reviews** | List + add review with basic moderation |
| **Checkout** | Guest info form, mock payment (¤), confirmation with confirmation ID |
| **Single-command run** | From root: `pnpm dev` or `yarn dev` |
| **Responsive** | Desktop + mobile; loading, empty, and error states |

---

## Tech stack (current)

| Layer | Choice |
|-------|--------|
| **Frontend** | Next.js 16, React 19, TypeScript, Shadcn/ui, Tailwind CSS 4, Framer Motion, TanStack Query, React Hook Form, Valibot |
| **API** | Next.js Route Handlers in `app/api/` (stays, availability, reviews, bookings) |
| **Data** | `data/stays.json`, `data/reviews.json`, `data/bookings.json`; in-memory in API (no DB) |
| **Lint / format** | Biome, TypeScript strict |
| **Tests** | Vitest, Testing Library, API route tests; CI via GitHub Actions |
| **Package manager** | pnpm |

Phases 0–8 in progress: see [plans/TODOS.md](plans/TODOS.md) and [docs/README.md](docs/README.md).

---

## Project structure

```
cocoon/
├── app/                       # Next.js App Router
│   ├── api/                   # Route Handlers (stays, bookings, reviews)
│   │   ├── bookings/
│   │   ├── reviews/
│   │   └── stays/
│   ├── about/
│   ├── our-cocoon/
│   ├── stay/[id]/
│   ├── layout.tsx
│   └── page.tsx
├── components/                # React components
│   └── ui/                    # Shadcn/ui primitives
├── data/                      # stays.json, reviews.json, bookings.json
├── docs/                      # Phase docs (see docs/README.md)
├── tests/                     # Vitest setup + API route tests
├── hooks/
├── lib/                       # utils (cn, etc.)
├── plans/                     # TODOS, Initial_Planning, Agent_Prompts
├── public/
│   ├── images/                # city, forest, mountains, sea
│   └── videos/                # forest, city, mountains, sea
├── styles/
├── types/                     # Stay, Booking, Review, etc.
├── utils/                     # dates, media, price
├── .husky/                    # commit-msg hook (commitlint)
├── biome.json
├── commitlint.config.js
├── components.json            # Shadcn config
├── next.config.mjs
├── package.json
├── postcss.config.mjs
├── tsconfig.json
└── README.md
```

---

## Prerequisites

- **Node.js** (LTS, e.g. 20+)
- **pnpm** (e.g. `npm install -g pnpm`)
- Stay location map uses **OpenStreetMap + Leaflet** (no API key required).

---

## Quick start

**Clone and install:**

```bash
git clone <repo-url>
cd cocoon
pnpm install
```

**Run:**

```bash
pnpm dev
```

App: **http://localhost:3000** (or 3001 if 3000 is in use). No separate API process; API is served by the same Next.js app.

---

## Scripts

| Script | Description |
|--------|-------------|
| `pnpm dev` | Next.js dev server (frontend + API) |
| `pnpm build` | Production build |
| `pnpm start` | Run production build |
| `pnpm lint` | Lint (Biome) |
| `pnpm test` | Run tests once (Vitest) — used in CI |
| `pnpm test:watch` | Run tests in watch mode |

**Testing and CI**: Unit tests (validators, date utils), component tests (e.g. ReviewCard, ReviewForm), and API route tests (GET /api/stays) run with Vitest. GitHub Actions runs lint, test, and build on every push and pull request. See [docs/phase-8-tests.md](docs/phase-8-tests.md).

---

## API surface (Next.js Route Handlers)

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/stays?query=&location=&type=&checkIn=&checkOut=&amenities=&amenitiesMode=&minPrice=&maxPrice=&sort=&userId=` | List/search stays; excludes stays with booking conflicts for given dates; optional `userId` excludes that user’s booked stays |
| GET | `/api/stays/[id]` | Stay details |
| GET | `/api/stays/[id]/availability?checkIn=&checkOut=` | Availability + price; 400 if checkOut ≤ checkIn |
| GET | `/api/stays/[id]/reviews?page=&limit=` | Reviews (newest first); paginated |
| POST | `/api/stays/[id]/reviews` | Add review. Body: `userId`, `coupleName`, `rating` (1–5), `text` (min 10 chars). 400 on invalid. |
| POST | `/api/bookings` | Create booking. Body: `stayId`, `userId`, `checkIn`, `checkOut` (YYYY-MM-DD, checkOut &gt; checkIn), optional `coupleName`, `guests`. 400 invalid; 409 if dates conflict. |
| GET | `/api/bookings?userId=` or `?stayId=` | Bookings for a user (`userId`) or for a stay (`stayId`; confirmed/pending only). One of the params required. |
| GET | `/api/bookings/[confirmationId]` | Booking confirmation |

JSON only. Types in `types/`. See [docs/phase-2-api.md](docs/phase-2-api.md) for validation and errors.

---


## Documentation and planning

| Resource | Purpose |
|----------|---------|
| [docs/README.md](docs/README.md) | **Start here**: index of phase docs |
| [docs/phase-0-ui.md](docs/phase-0-ui.md) | Phase 0: v0 UI, data, API, discovery toolbar, map |
| [docs/phase-1-setup.md](docs/phase-1-setup.md) | Phase 1: root dev, TS/lint/deps, commitlint + husky |
| [docs/phase-2-api.md](docs/phase-2-api.md) | Phase 2: API validation, observability, booking conflicts |
| [docs/phase-2-5-frontend-errors.md](docs/phase-2-5-frontend-errors.md) | Phase 2.5: frontend error handling, type safety |
| [docs/phase-2-6-error-handling-and-date-picker.md](docs/phase-2-6-error-handling-and-date-picker.md) | Phase 2.6: 404/409 UX, smart date picker |
| [docs/phase-3-search.md](docs/phase-3-search.md) | Phase 3: search, availability & review flow polish |
| [docs/phase-8-tests.md](docs/phase-8-tests.md) | Phase 8: Vitest, RTL, API tests, GitHub Actions CI |
| [plans/TODOS.md](plans/TODOS.md) | Implementation checklist (phases 0–8 + submission) |
| [plans/Initial_Planning.md](plans/Initial_Planning.md) | Product concept, architecture, API, data models |
| [plans/v0_prompt.md](plans/v0_prompt.md) | v0.app UI spec (glassmorphism, StayCard) |
| [plans/Agent_Prompts.md](plans/Agent_Prompts.md) | Per-phase agent prompts |
| [plans/phase-1-setup.md](plans/phase-1-setup.md) | Phase 1 setup plan |

---

## Architecture (high level)

- **Single Next.js app**: App Router for pages; Route Handlers for API. Data from JSON files; TanStack Query on the client. No monorepo.
- **Phases 0–1**: v0 UI, root `pnpm dev`, commitlint + husky. [docs/phase-0-ui.md](docs/phase-0-ui.md), [docs/phase-1-setup.md](docs/phase-1-setup.md).
- **Phase 2**: API validation (bookings, reviews), structured logging, booking-conflict checks, date guards. [docs/phase-2-api.md](docs/phase-2-api.md).
- **Phase 2.5–2.6**: Frontend error handling, 404/409 UX, smart date picker. [docs/phase-2-5-frontend-errors.md](docs/phase-2-5-frontend-errors.md), [docs/phase-2-6-error-handling-and-date-picker.md](docs/phase-2-6-error-handling-and-date-picker.md).
- **Phase 3**: Search/availability/reviews in sync; booking date picker; review names and validation. [docs/phase-3-search.md](docs/phase-3-search.md).
- **Phase 8**: Vitest + Testing Library + API route tests; GitHub Actions CI (lint, test, build). [docs/phase-8-tests.md](docs/phase-8-tests.md).

---

## Tradeoffs and what we’d do next

| Decision | Choice | Tradeoff |
|----------|--------|----------|
| API | Next.js Route Handlers | One app to run; no separate backend |
| Data | JSON files | Fast MVP; in-memory — persist to DB later |
| Map | OpenStreetMap + Leaflet; Esri World Imagery (satellite) | No API key required |
| Validation | `lib/validators.ts` in Route Handlers + client-side in forms | Consistent 400/409 and UI errors |

**Next steps:** Persist data (e.g. Supabase/SQLite), E2E tests (Playwright), release/deploy (e.g. Vercel), WCAG audit. See [plans/TODOS.md](plans/TODOS.md) and [plans/Initial_Planning.md](plans/Initial_Planning.md).

---

## Commit convention

We use [Conventional Commits](https://www.conventionalcommits.org/): `type[(scope)]: description` (e.g. `feat(search): add type filters`). Enforced via commitlint + husky. Types: `feat`, `fix`, `chore`, `docs`, `style`, `refactor`, `perf`, `test`, `build`, `ci`.
