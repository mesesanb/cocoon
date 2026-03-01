# Cocoon: Here, us.

**A psychological retreat for couples to reconnect in nature-based solitude.**

---

## What is this?

Cocoon is a full-stack travel booking web app focused on **unusual stays only** — treehouses, lighthouses, floating homes, beach houses — the kind of places that *are* the destination. Users discover stays by scenario (CITY, FOREST, MOUNTAINS, SEA), view details and reviews, and complete a checkout flow with mock crypto payment (ETH/BTC). The UI uses an ethereal glassmorphism theme, Framer Motion narrative flow, and a single reusable StayCard across listings, history, and upcoming bookings.

> Frontend calls a real backend API; data is served from JSON files (no database). Built to satisfy a Booking.com-style assignment with a memorable product angle and clear engineering choices.

**Assets**: The images and videos in `GENERATED_IMAGES/` (and served from `apps/web/public/images/`) were generated with **Gemini**.

---

## Features

| Capability | Description |
|------------|-------------|
| **Search / browse** | Stays list with filters (type, location, dates, guests, price) and sorting |
| **Stay details** | Hero, description, amenities, availability + price, **Google Maps** location, reviews |
| **Reviews** | List (paginated/sortable) + add review with basic moderation |
| **Checkout** | Guest info form, mock ETH/BTC payment, confirmation with confirmation ID |
| **Single-command run** | `yarn dev` runs frontend and backend (or documented two-step) |
| **Responsive** | Desktop + mobile; loading, empty, and error states |

---

## Tech stack

| Layer | Choice |
|-------|--------|
| **Frontend** | React 19, TypeScript, Vite, Shadcn/ui, Tailwind CSS, React Router v6, TanStack Query v5, Valibot, Framer Motion |
| **Backend** | NestJS, Node.js, JSON-file data (no DB), class-validator |
| **Shared** | `packages/shared` — types (Stay, Review, Booking) |
| **Testing** | Vitest, React Testing Library, Playwright, supertest |
| **Map** | Google Maps (Maps JavaScript API) for stay location |
| **Monorepo** | Yarn workspaces (or Turborepo); `apps/web` + `apps/api` + `packages/shared` |

---

## Project structure

```
cocoon/
├── apps/
│   ├── web/                 # React frontend (Vite)
│   │   ├── src/
│   │   │   ├── app/         # Router, providers, layouts
│   │   │   ├── features/    # stays, reviews, bookings, availability
│   │   │   ├── shared/      # api, components, hooks, utils
│   │   │   └── pages/
│   │   └── public/
│   └── api/                 # NestJS backend
│       └── src/
│           ├── stays/       # StaysModule
│           ├── reviews/     # ReviewsModule
│           ├── bookings/    # BookingsModule
│           └── data/        # stays.json, reviews.json, bookings.json
├── packages/
│   └── shared/              # Shared TypeScript types
├── data/                    # Source data (e.g. stays.json)
├── docs/                    # Phase-by-phase documentation
├── plans/                   # TODOS, Initial_Planning, v0_prompt, Agent_Prompts
├── package.json             # Workspace root
└── README.md
```

---

## Prerequisites

- **Node.js** (LTS, e.g. 20+)
- **Yarn** (package manager)
- **Google Maps API key** (for stay location map; optional until Phase 4)

---

## Quick start

**Clone and install:**

```bash
git clone <repo-url>
cd cocoon
yarn install
```

**Run (single command):**

```bash
yarn dev
```

This starts the frontend and the API (via `concurrently` or Turborepo). Frontend: typically `http://localhost:5173`. API: typically `http://localhost:3000`.

**Two-step (if not using root `yarn dev`):**

```bash
# Terminal 1 — API
yarn workspace api dev

# Terminal 2 — Web
yarn workspace web dev
```

---

## Scripts (root)

| Script | Description |
|--------|-------------|
| `yarn dev` | Run frontend + backend in development |
| `yarn build` | Production build (all apps) |
| `yarn test` | Run tests |
| `yarn lint` | Lint (enforced in CI) |

---

## API surface

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/stays?query=&location=&type=&checkIn=&checkOut=&guests=&minPrice=&maxPrice=&sort=` | List/search stays |
| GET | `/stays/:id` | Stay details |
| GET | `/stays/:id/availability?checkIn=&checkOut=&guests=` | Availability + price |
| GET | `/stays/:id/reviews` | Reviews (paginated) |
| POST | `/stays/:id/reviews` | Add review |
| POST | `/bookings` | Create booking (checkout) |
| GET | `/bookings/:confirmationId` | Booking confirmation |

JSON only; shared types in `packages/shared`. CORS enabled for the frontend origin.

---

## Environment variables

| Variable | Where | Description |
|----------|--------|-------------|
| `VITE_API_URL` | `apps/web` | Backend base URL (e.g. `http://localhost:3000`) |
| `VITE_GOOGLE_MAPS_API_KEY` | `apps/web` | Google Maps JavaScript API key (Phase 4 — stay location map) |

Use `.env.example` in each app and do not commit secrets.

---

## Documentation and planning

| Resource | Purpose |
|----------|---------|
| [docs/](docs/) | Phase-by-phase docs (`phase-X-*.md`) written after each phase |
| [plans/Initial_Planning.md](plans/Initial_Planning.md) | Product concept, stack, architecture, API, data models, tradeoffs |
| [plans/TODOS.md](plans/TODOS.md) | Implementation phases and checklist (assessment-aligned) |
| [plans/todo-phase1.md](plans/todo-phase1.md) | Phase 1 setup breakdown with explanations |
| [plans/v0_prompt](plans/v0_prompt) | v0.app UI spec (glassmorphism, narrative flow, StayCard) |
| [plans/Agent_Prompts.md](plans/Agent_Prompts.md) | Per-phase agent prompts and context to load |

---

## Architecture (high level)

- **Frontend**: Feature-based structure; TanStack Query for server state only; single API client; route-level code-splitting.
- **Backend**: NestJS modules (Stays, Reviews, Bookings); data from JSON in `apps/api/src/data/`; no database.
- **Shared**: `Stay`, `Review`, `Booking` (and scenario types CITY, FOREST, MOUNTAINS, SEA) in `packages/shared`.

Full diagram and principles → [plans/Initial_Planning.md §4–5](plans/Initial_Planning.md).

---

## Tradeoffs and what we’d do next

| Decision | Choice | Tradeoff |
|----------|--------|----------|
| State | TanStack Query only | Simpler; no Redux/Zustand |
| Data | JSON files | Fast MVP; no persistence — migrate to DB later |
| Map | Google Maps | Familiar, good docs; API key required |
| Validation | Valibot (frontend), class-validator (backend) | Lightweight; NestJS-native on API |

**Next steps (post–timebox):** Persist data (e.g. Supabase/SQLite), add auth for “My Bookings,” server-side favorites, image uploads (S3/Cloudinary), deploy (e.g. Vercel + Render), WCAG audit, error monitoring (e.g. Sentry). See [plans/Initial_Planning.md §14](plans/Initial_Planning.md).

---

## Commit convention

We use [Conventional Commits](https://www.conventionalcommits.org/): `type[(scope)]: description` (e.g. `feat(search): add type filters`). Enforced via commitlint + husky (Phase 1). Types: `feat`, `fix`, `chore`, `docs`, `style`, `refactor`, `perf`, `test`, `build`, `ci`.

---

