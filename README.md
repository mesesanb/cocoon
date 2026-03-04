# Cocoon: Here, us.

**A psychological retreat for couples to reconnect in nature-based solitude.**

---

## What is this?

Cocoon is a full-stack travel booking web app focused on **unusual stays only** — treehouses, lighthouses, floating homes, beach houses — the kind of places that *are* the destination. Users discover stays by scenario (CITY, FOREST, MOUNTAINS, SEA), view details and reviews, and complete a checkout flow with mock payment (¤). The UI uses an ethereal glassmorphism theme, Framer Motion narrative flow, and a single reusable StayCard across listings, history, and upcoming bookings.

> Frontend and API currently live in one Next.js app (`apps/web`). Data is served from JSON files (no database). Built to satisfy a Booking.com-style assignment with a memorable product angle and clear engineering choices.

**Assets**: Images and videos in `apps/web/public/images/` and `apps/web/public/videos/` were generated with **Gemini**.

---

## Features

| Capability | Description |
|------------|-------------|
| **Search / browse** | Stays list with filters (type, location, dates, guests, price) and sorting |
| **Stay details** | Hero, description, amenities, availability + price, reviews, location map (OpenStreetMap + Leaflet, satellite imagery, no API key) |
| **Reviews** | List + add review with basic moderation |
| **Checkout** | Guest info form, mock payment (¤), confirmation with confirmation ID |
| **Single-command run** | From root: `pnpm dev` or `yarn dev`; from `apps/web`: `pnpm dev` |
| **Responsive** | Desktop + mobile; loading, empty, and error states |

---

## Tech stack (current — Phase 0)

| Layer | Choice |
|-------|--------|
| **Frontend** | Next.js 16, React 19, TypeScript, Shadcn/ui, Tailwind CSS 4, Framer Motion, TanStack Query, React Hook Form, Valibot |
| **API** | Next.js Route Handlers in `apps/web/app/api/` (stays, availability, reviews, bookings) |
| **Data** | `apps/web/data/stays.json`; in-memory in API (no DB) |
| **Lint / format** | Biome, TypeScript strict |
| **Package manager** | pnpm (in `apps/web`) |

*Phase 1 done:* Root `pnpm dev`; TS/lint/deps hygiene; commitlint + husky. BE solution remains as-is. See [plans/TODOS.md](plans/TODOS.md) and [docs/phase-1-setup.md](docs/phase-1-setup.md).

---

## Project structure

```
cocoon/
├── apps/
│   └── web/                    # Next.js frontend + API (Phase 0)
│       ├── app/
│       │   ├── api/            # Route Handlers (stays, bookings, reviews)
│       │   ├── about/
│       │   ├── our-cocoon/
│       │   ├── stay/[id]/
│       │   ├── layout.tsx
│       │   └── page.tsx
│       ├── components/
│       ├── data/              # stays.json (web shape)
│       ├── public/
│       │   ├── images/        # city, forest, mountains, sea
│       │   └── videos/        # forest, rock, water
│       ├── types/
│       ├── utils/
│       └── package.json
├── data/                      # Source stays.json (root)
├── docs/                      # Phase docs (when written)
├── plans/                     # TODOS, Initial_Planning, v0_prompt.md, Agent_Prompts, phase-1-setup
├── README.md
```

*Phase 1 done:* Root `package.json` with `dev` and `lint` scripts; run from root: `pnpm dev` or `yarn dev`.

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
cd apps/web && pnpm install
```

**Run (from root):**

```bash
pnpm dev
```

Or from `apps/web`: `pnpm dev`

App: **http://localhost:3000** (or 3001 if 3000 is in use). No separate API process; API is served by the same Next.js app.

---

## Scripts (apps/web)

| Script | Description |
|--------|-------------|
| `pnpm dev` | Next.js dev server (frontend + API) |
| `pnpm build` | Production build |
| `pnpm start` | Run production build |
| `pnpm lint` | Lint (Biome) |

Lint: `pnpm lint` from `apps/web` (Biome).

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

JSON only. Types in `apps/web/types`.

---

## Environment variables

| Variable | Where | Description |
|----------|--------|-------------|
| `NEXT_PUBLIC_*` | apps/web | Next.js public env (e.g. feature flags) |

Use `.env.local` for secrets; do not commit. No required env for Phase 0 run.

---

## Documentation and planning

| Resource | Purpose |
|----------|---------|
| [docs/README.md](docs/README.md) | **Start here**: index of all docs and where to look |
| [docs/phase-0-ui.md](docs/phase-0-ui.md) | Phase 0 breakdown (v0 UI, data, gateway, API, lint) |
| [plans/TODOS.md](plans/TODOS.md) | Implementation phases and checklist (assessment-aligned) |
| [plans/Initial_Planning.md](plans/Initial_Planning.md) | Product concept, stack, architecture, API, data models |
| [plans/v0_prompt.md](plans/v0_prompt.md) | v0.app UI spec (glassmorphism, narrative flow, StayCard) |
| [plans/Agent_Prompts.md](plans/Agent_Prompts.md) | Per-phase agent prompts and constraints |
| [plans/phase-1-setup.md](plans/phase-1-setup.md) | Phase 1 setup plan |
| [docs/phase-1-setup.md](docs/phase-1-setup.md) | Phase 1 doc (root dev, hygiene, commitlint) |

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
