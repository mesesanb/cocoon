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

## Tech stack (current — Phase 0)

| Layer | Choice |
|-------|--------|
| **Frontend** | Next.js 16, React 19, TypeScript, Shadcn/ui, Tailwind CSS 4, Framer Motion, TanStack Query, React Hook Form, Valibot |
| **API** | Next.js Route Handlers in `app/api/` (stays, availability, reviews, bookings) |
| **Data** | `data/stays.json`, `data/reviews.json`, `data/bookings.json`; in-memory in API (no DB) |
| **Lint / format** | Biome, TypeScript strict |
| **Package manager** | pnpm |

*Phase 1 done:* Root `pnpm dev`; TS/lint/deps hygiene; commitlint + husky. BE solution remains as-is. See [plans/TODOS.md](plans/TODOS.md) and [docs/phase-1-setup.md](docs/phase-1-setup.md).

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
├── docs/                      # Phase docs (phase-0-ui, phase-1-setup)
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

**Testing and CI**: Unit tests (validators, date utils), component tests (e.g. ReviewCard), and API route tests (GET /api/stays) run with Vitest. GitHub Actions runs lint, test, and build on push/PR to `main` and `develop`. See [docs/phase-8-tests.md](docs/phase-8-tests.md).

---

## API surface (Phase 0 — Next.js routes)

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/stays?query=&type=&checkIn=&checkOut=&minPrice=&maxPrice=&sort=` | List/search stays |
| GET | `/api/stays/[id]` | Stay details |
| GET | `/api/stays/[id]/availability?checkIn=&checkOut=` | Availability + price |
| GET | `/api/stays/[id]/reviews` | Reviews |
| POST | `/api/stays/[id]/reviews` | Add review (body: rating, text, author) |
| POST | `/api/bookings` | Create booking (checkout) |
| GET | `/api/bookings/[confirmationId]` | Booking confirmation |

JSON only. Types in `types/`.

---

## Environment variables

| Variable | Where | Description |
|----------|--------|-------------|
| `NEXT_PUBLIC_*` | root | Next.js public env (e.g. feature flags) |

Use `.env.local` for secrets; do not commit. No required env for Phase 0 run.

---

## Documentation and planning

| Resource | Purpose |
|----------|---------|
| [docs/README.md](docs/README.md) | **Start here**: index of all docs and where to look |
| [docs/phase-0-ui.md](docs/phase-0-ui.md) | Phase 0 breakdown (v0 UI, data, gateway, API, lint) |
| [docs/phase-1-setup.md](docs/phase-1-setup.md) | Phase 1 doc (root dev, hygiene, commitlint) |
| [docs/phase-2-api.md](docs/phase-2-api.md) | Phase 2: API polish (validation, observability) |
| [docs/phase-3-search.md](docs/phase-3-search.md) | Phase 3: Search, availability & reviews polishing |
| [docs/phase-8-tests.md](docs/phase-8-tests.md) | Phase 8: Tests (Vitest, RTL, API) and CI (GitHub Actions) |
| [plans/TODOS.md](plans/TODOS.md) | Implementation phases and checklist (assessment-aligned) |
| [plans/Initial_Planning.md](plans/Initial_Planning.md) | Product concept, stack, architecture, API, data models |
| [plans/v0_prompt.md](plans/v0_prompt.md) | v0.app UI spec (glassmorphism, narrative flow, StayCard) |
| [plans/Agent_Prompts.md](plans/Agent_Prompts.md) | Per-phase agent prompts and constraints |
| [plans/phase-1-setup.md](plans/phase-1-setup.md) | Phase 1 setup plan |

---

## Architecture (high level)

- **Phase 0**: Single Next.js app. App Router for pages; Route Handlers for API. Data from `data/stays.json`; TanStack Query on the client. No monorepo.
- **Phase 1**: Root `pnpm dev`; commitlint + husky. BE solution remains as-is (Next.js Route Handlers). See [docs/phase-1-setup.md](docs/phase-1-setup.md).

---

## Tradeoffs and what we’d do next

| Decision | Choice | Tradeoff |
|----------|--------|----------|
| Phase 0 API | Next.js Route Handlers | One app to run; BE solution will remain as-is (no separate Express) |
| Data | JSON files | Fast MVP; no persistence — migrate to DB later |
| Map | OpenStreetMap + Leaflet; Esri World Imagery (satellite) for stay location | No API key required |
| Validation | Valibot (frontend) | Lightweight; add minimal validation in Route Handlers (Phase 2) |

**Next steps (post–timebox):** Phase 2 API polish (validation, logging), persist data (e.g. Supabase/SQLite), auth for “Our Bookings,” deploy (e.g. Vercel), WCAG audit. See [plans/Initial_Planning.md](plans/Initial_Planning.md) §14.

---

## Commit convention

We use [Conventional Commits](https://www.conventionalcommits.org/): `type[(scope)]: description` (e.g. `feat(search): add type filters`). Enforced via commitlint + husky. Types: `feat`, `fix`, `chore`, `docs`, `style`, `refactor`, `perf`, `test`, `build`, `ci`.
