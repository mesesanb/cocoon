# Cocoon: Here, us. — Initial Planning Document

**Document**: Initial Planning  
**Focus**: Fullstack (Frontend-heavy)  
**Date**: February 2026  
**Package manager**: pnpm (in `apps/web`; no monorepo)  
**TO CONSIDER**: https://looking-ahead.hotmetalapp.com/how-i-10x-d-my-ai-coding-productivity-and-you-can-too — clear directions to follow while developing this project.

**Current state (Phase 0 complete, architecture final)**: The repo has a single Next.js 16 app in `apps/web` (React 19, TypeScript, Tailwind, Shadcn, Framer Motion). Stays, availability, reviews, and bookings are served by Next.js Route Handlers in `app/api/`; data from `apps/web/data/stays.json`. **BE solution will remain as-is** — no monorepo, no separate `apps/api`, no `packages/shared`. Package manager is pnpm. Run with `pnpm dev` or `yarn dev` from root. **Phase 1 done**: App at root; commitlint + husky. Discovery toolbar (filters, date pickers, sticky glass bar), search bar behaviour, and image/video loading optimisation are described in [phase-0-ui.md](../docs/phase-0-ui.md). See [TODOS.md](TODOS.md).

---

## Original Assignment Brief — DO NOT MODIFY

> Build a small, Booking.com-like product focused on the frontend. **Creativity encouraged.**

### Quick facts

- **Domain**: Travel (hotels or similar stay products)
- **Complexity**: Mid+ (end-to-end flow, not just UI screens)
- **Stack**: React (TypeScript recommended)
- **Backend**: Small server that frontend talks to (required)
- **LLM usage**: Encouraged for coding
- **Timebox**: 4–6 hours. Stop when you hit it and document what you would do next

### What you are building

A travel booking web app where a user can **discover stays**, **view details and reviews**, and **complete a checkout flow**. We care more about product thinking and engineering quality than pixel-perfect design.

### Must-have capabilities (keep it simple)

- Search or browse a list of stays (filters and sorting are up to you)
- Stay details page
- Reviews/comments: list + add a review/comment (moderation can be basic)
- Availability + price display
- Checkout flow that results in a confirmed booking (payment can be mocked)
- Frontend calls a backend API you provide (even if the data is mocked)

### Where you can be creative

- Choose the exact product scope: hotels, apartments, hostels, experiences, etc.
- Pick your UX: map view, saved favorites, personalized feed, compare stays, etc.
- Decide what "availability" means (date range, rooms, guests) and how deep you go

### Backend expectations

Keep the backend small. It exists to support your frontend and prove you can design and consume APIs. Node (Express/Fastify/Nest), serverless functions, or a minimal mock server.

**Minimum API surface** (example, you can change it):

- `GET /stays?query=&filters=...` — list/search
- `GET /stays/:id` — details
- `GET /stays/:id/reviews` — reviews
- `POST /stays/:id/reviews` — add review
- `POST /bookings` — create booking / checkout

### Non-functional requirements

- Runs locally with a single command (or clearly documented two-step setup)
- Responsive layout (desktop + mobile)
- Loading + empty + error states for async screens
- Basic accessibility (labels, keyboard nav where it matters, sensible focus)
- Testing: at least a few meaningful tests (unit and/or integration/e2e)
- Observability basics: helpful logging, optionally a simple metrics/error tool

### Release process

- CI pipeline (e.g. GitHub Actions) that runs lint + tests on PR/push
- Build step that produces a production bundle
- Simple release approach (e.g. tags, changelog, version bump)
- *Optional but great*: deployment to Vercel/Netlify/Render and share the URL

### What to submit

- Git repository link with full source code (frontend + backend)
- README: setup, scripts, architecture notes, tradeoffs, what you would do next
- Short note on LLM usage: what you used it for, prompts/approach, guardrails
- Recording presenting the solution

### Notes

> We do not expect a huge project. We expect smart scope choices. If you cut features, say why. If you make assumptions, write them down.

---

## 1. Project Overview & Product Concept

**Goal**: Build a travel app that reviewers remember — not a generic Booking.com clone.

### The Memorable Angle

Instead of "book a hotel," we focus on **unusual stays only**: the kind of places that *are* the destination. No standard hotels.

**Product scope**: Unusual accommodations — treehouses, lighthouses, floating homes, beach houses, lofts, converted warehouses, container homes. Short-term rentals.

**App name**: **Cocoon: Here, us.**

**Scenario types** (4 categories, from `/GENERATED_IMAGES`): **CITY**, **FOREST**, **MOUNTAINS**, **SEA**. Images are sorted into these folders for use in development.

---

### Scope & Constraints

- **Do not overengineer.** Ship what the assignment asks for. No premature abstractions.
- **Stay close to the brief.** Don't go meaningfully beyond must-haves unless it's trivial (e.g. a small UX polish).
- **Scalability in mind, not in code.** Choose patterns that *could* scale (clear modules, typed APIs) — but don't build for scale yet. Mock data, simple structure. Document what you'd change later.

---

## 2. Requirements Summary (Our Interpretation)

### Must-have

| Capability | Notes |
|------------|-------|
| Search / browse stays | Filters + sorting |
| Stay details page | Full information view |
| Reviews | List + add review (basic moderation) |
| Availability + price | Date range, rooms, guests |
| Checkout flow | Confirmed booking; payment mocked |
| Frontend → Backend API | Real API calls, data may be mocked |

### Non-functional

- Runs locally with 1 command (or clearly documented 2-step)
- Responsive (desktop + mobile)
- Loading, empty, error states for async screens
- Basic a11y (labels, keyboard nav, focus)
- Meaningful tests (unit and/or integration/e2e)
- Observability: logging, optional metrics

### Release / CI

- CI (e.g. GitHub Actions): lint + tests
- Production build
- Release process (tags, changelog, version bump)
- Optional: deploy to Vercel/Netlify/Render

---

## 3. Tech Stack (2026, Don’t Reinvent the Wheel)

### Frontend

| Layer | Choice | Rationale |
|-------|--------|-----------|
| **Framework** | Next.js 16 + React 19 + TypeScript | Fullstack; Route Handlers serve the API; no separate backend needed |
| **Build** | Next.js (App Router) | Already configured; file-based routing and server components |
| **UI library** | Shadcn/ui | Copy-paste components, easy to modify, v0-native | tailwind
| **Routing** | Next.js App Router | Already configured; file-based; no React Router needed |
| **State** | **TanStack Query v5 only** | Server state + cache as single source of truth; no Zustand/Redux |
| **Forms** | React Hook Form + validation lib (see below) | Performant validation, minimal re-renders |
| **Styling** | Tailwind CSS | Utility-first; `dark:` for themes; works with Shadcn |
| **Date handling** | date-fns | Lightweight, tree-shakeable |
| **HTTP client** | TanStack Query (fetch) | Simple, typed API layer |
| **Testing** | Vitest + React Testing Library + Playwright | Fast unit + e2e |
| **A11y** | Shadcn (Radix primitives) + eslint-plugin-jsx-a11y | Solid baseline |

### Backend

| Layer | Choice | Rationale |
|-------|--------|-----------|
| **Runtime** | Node.js (via Next.js) | Same process as the frontend |
| **Framework** | **Next.js Route Handlers** (`app/api/`) | Satisfies "small server that frontend talks to"; all 7 endpoints already live; no separate process or Express needed |
| **Data** | In-memory / JSON file | Mock data; easy to swap for DB later |
| **Validation** | Minimal (manual checks) | Keep backend simple; validate at route level in Phase 2 |

### Validation: Alternatives to Zod

Backend uses **minimal validation** (manual checks or Valibot). For **frontend** forms, choose one:

| Library | Pros | Cons |
|---------|------|------|
| **Valibot** | <1kb, modular, Zod-like API, RHF resolver | Smaller ecosystem |


**Recommendation**: **Valibot** for frontend — lightweight, similar to Zod, RHF-compatible. Or **Yup** if you prefer battle-tested.

### Monorepo

No monorepo. Single `apps/web` package; no `apps/api` or `packages/shared`. Types live in `apps/web/types/index.ts`.

---

## 4. Architecture Overview

```
┌─────────────────────────────────────────────────────────────────┐
│                         FRONTEND (React)                         │
├─────────────────────────────────────────────────────────────────┤
│  Pages          │  Features           │  Shared                  │
│  - Search       │  - stays            │  - api client           │
│  - StayDetails  │  - reviews          │  - hooks                │
│  - Checkout     │  - bookings         │  - components            │
│  - MyBookings   │  - availability     │  - layouts              │
└─────────────────────────────────────────────────────────────────┘
                              │
                              │ REST API
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│                    BACKEND (Express)                             │
├─────────────────────────────────────────────────────────────────┤
│  Routes (stays, reviews, bookings)  │  Data (JSON / in-memory)  │
│  GET/POST handlers only             │  mock-stays.json, etc.     │
└─────────────────────────────────────────────────────────────────┘
```

### Frontend architecture principles

1. **Feature-based structure** – group by feature, not by type.
2. **Colocation** – components, hooks, utils for a feature live together.
3. **API layer** – single typed client; **TanStack Query only** for server + client state (no separate store).
4. **Route-level code-splitting** – lazy load pages.
5. **Shared primitives** – API client, hooks, generic components.

---

## 5. Project Structure

```
cocoon/
├── apps/
│   └── web/                    # Next.js fullstack app (frontend + Route Handler backend)
│       ├── app/
│       │   ├── api/            # Route Handlers (backend)
│       │   │   ├── stays/
│       │   │   ├── stays/[id]/
│       │   │   ├── stays/[id]/availability/
│       │   │   ├── stays/[id]/reviews/
│       │   │   ├── bookings/
│       │   │   └── bookings/[confirmationId]/
│       │   ├── stay/[id]/      # Stay detail page
│       │   ├── our-cocoon/     # User's bookings page
│       │   ├── about/
│       │   ├── layout.tsx
│       │   └── page.tsx        # Home / gateway
│       ├── components/         # React components (UI + feature)
│       ├── data/               # Mock JSON (stays, reviews, bookings)
│       ├── hooks/
│       ├── lib/
│       ├── public/
│       │   ├── images/         # city, forest, mountains, sea
│       │   └── videos/
│       ├── types/              # TypeScript interfaces (Stay, Review, Booking, …)
│       └── utils/              # media, price, dates helpers
│
├── data/                       # Source stays data (root copy; API data lives in apps/web/data/)
├── GENERATED_IMAGES/           # AI-generated assets (images + videos by scenario)
├── docs/                       # Phase completion docs
├── plans/                      # Planning and prompts
└── README.md
```

---

## 6. API Design (Minimum Surface)

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/stays?query=&location=&type=&checkIn=&checkOut=&guests=&minPrice=&maxPrice=&sort=` | List/search stays |
| GET | `/stays/:id` | Stay details |
| GET | `/stays/:id/availability?checkIn=&checkOut=&guests=` | Availability + price |
| GET | `/stays/:id/reviews` | Reviews (paginated) |
| POST | `/stays/:id/reviews` | Add review |
| POST | `/bookings` | Create booking (checkout) |
| GET | `/bookings/:confirmationId` | Booking confirmation (optional) |

**Request/Response**: JSON. Types defined in `apps/web/types/index.ts`.

---

### Image assets (GENERATED_IMAGES)

```
GENERATED_IMAGES/
├── city/      # High views, city skyline, penthouses, rooftop domes (13 images)
├── forest/    # Treehouses, cabins, nature retreats (8 images)
├── mountains/ # Cliff dwellings, converted industrial, desert (12 images)
└── sea/       # Floating, lighthouse, underwater, boats (9 images)
```

**Asset source**: Images and videos in these folders were generated with **Gemini**; they are used as static assets by the frontend.

**Stays data**: `data/stays.json` — single source of truth. Each stay has: id, name, type, location, tagline, description, images[{path, alt}], pricePerNight, rating, reviewCount, maxGuests, rooms, amenities. Copy or import into `apps/api/src/data/` when building the backend.

---

### Image targeting (how to serve and reference)

**Setup**: Copy or symlink `GENERATED_IMAGES/` into `apps/web/public/images/` so the frontend serves them as static assets.

**Paths in data**: Each stay's `images[].path` is relative (e.g. `forest/01.jpg`, `sea/10.jpg`).

**Base URL**: `const STAY_IMAGES_BASE = '/images'`

**Videos**: `GENERATED_IMAGES/` - and the naming is 'forest/01_vid.mp4' 

**Usage in frontend**:
```ts
// Full image URL for a stay
const imageSrc = `${STAY_IMAGES_BASE}/${stay.images[0].path}`;  // → /images/forest/01.jpg

// In JSX
<img src={`/images/${stay.images[0].path}`} alt={stay.images[0].alt} />
```

**Rule**: `STAY_IMAGES_BASE` + `image.path` = browser-requestable URL.

---

## 7. Feature Breakdown & UX Ideas

### 7.1 Search / Browse

- **Layout**: Search bar + **type filters** (CITY, FOREST, MOUNTAINS, SEA) + location, dates, guests, price range.
- **Results**: Card grid with imagery, name, type, rating, price, one-line hook.
- **Creative touch**: Dark/editorial theme, "Claim your escape" CTA; toggle grid/list; favorites (localStorage).

### 7.2 Stay Details

- **Sections**: Hero image(s), title, type (CITY/FOREST/MOUNTAINS/SEA), rating, price, description, amenities, **OpenStreetMap + Leaflet** with **Esri World Imagery** (satellite) for stay location (minimalist map/marker), reviews.
- **Availability**: Date picker (e.g. react-day-picker + Shadcn) + guests selector; live price.
- **CTA**: "Claim this stay" (or "Reserve") → Checkout. Avoid generic "Book now."

### 7.3 Reviews

- **List**: Paginated, sortable (newest, highest rated).
- **Add**: Form with rating (1–5), text, basic moderation (min length, profanity filter stub).
- **Display**: Author name (or "Anonymous"), date, rating stars, text. Consider "What made it special?" prompt.

### 7.4 Checkout Flow

1. **Summary**: Stay, dates, guests, price.
2. **Guest info**: Name, email, phone (React Hook Form + Valibot/Yup).
3. **Payment**: Mock ("Pay with ¤" → simulate success).
4. **Confirmation**: Confirmation ID, aspirational summary ("Your escape is confirmed"), "Discover more" CTA.

---

## 8. Data Models (Simplified)

```ts
// Stay
interface Stay {
  id: string;
  name: string;
  location: string;
  type: 'CITY' | 'FOREST' | 'MOUNTAINS' | 'SEA';  // Categories; images in GENERATED_IMAGES/{type}/
  description: string;
  images: string[];
  amenities: string[];
  pricePerNight: number;
  rating: number;
  reviewCount: number;
  maxGuests: number;
  rooms: number;
}

// Review
interface Review {
  id: string;
  stayId: string;
  authorName: string;
  rating: number;
  comment: string;
  createdAt: string;
}

// Booking
interface Booking {
  id: string;
  confirmationId: string;
  stayId: string;
  checkIn: string;
  checkOut: string;
  guests: number;
  guestName: string;
  guestEmail: string;
  totalPrice: number;
  status: 'confirmed' | 'cancelled';
  createdAt: string;
}
```

---

## 9. UI/UX Notes (Shadcn + Tailwind)

- **Themes**: Dark + Light via Tailwind `dark:` variant. Toggle `class="dark"` on `<html>`. Shadcn uses CSS variables; switching theme = change root class.
  - **Which default?** Dark or Light — pick one when building. Both supported via toggle.
- **Responsive**: Tailwind breakpoints (`md:`, `lg:`), grid, drawer/collapsible for mobile filters.
- **Loading**: Shadcn `Skeleton`, or simple spinner.
- **Empty**: Custom component with illustration + CTA.
- **Errors**: Shadcn `Toast` or inline with retry.
- **Forms**: Shadcn `Input`, `Select`, `Button`; react-day-picker for dates; React Hook Form + Valibot (or Yup).
- **Currency**: Prices as numbers. Display with ¤ suffix (e.g. `0.05 ¤`). Mock payment: "Pay with ¤" → simulate success.

---

## 10. Testing Strategy

| Type | Tool | Targets |
|------|------|---------|
| Unit | Vitest | utils, hooks, small components |
| Component | RTL + Vitest | forms, cards, filters |
| E2E | Playwright | search → details → add review → checkout |
| API | Vitest + supertest | backend routes |

---

## 11. CI/CD Pipeline (GitHub Actions)

```yaml
# .github/workflows/ci.yml
on: [push, pull_request]
jobs:
  lint:
    - yarn lint
  test:
    - yarn test
  build:
    - yarn build
```

- **Release**: Conventional Commits + semantic-release (optional) or manual version bump + changelog.

---

## 12. Timebox Strategy (4–6 hours)

| Phase | Time | Deliverables |
|-------|------|--------------|
| **1. Setup** | 30 min | Dev hygiene: fix TS errors, align lint script, remove unused deps, commitlint |
| **2. Data + API** | 45 min | API polish: input validation, booking filter, availability consistency, observability |
| **3. Search + List** | 1h | Search page, filters, sort, card grid |
| **4. Stay Details** | 45 min | Details page, availability, price display |
| **5. Reviews** | 45 min | List + add review |
| **6. Checkout** | 1h | Multi-step flow, confirmation |
| **7. Polish** | 30 min | Loading/empty/error states, a11y basics |
| **8. Tests + CI** | 45 min | Key tests, GitHub Actions |
| **Buffer** | 30 min | Contingency |

---

## 13. Single-command Run

Single command — already working:

```bash
cd apps/web && pnpm dev
```

This starts the Next.js development server which serves both the UI and all Route Handler endpoints. No second process needed.

---

## 14. What We Would Do Next (Post–Timebox)

1. **Data**: Persist bookings/reviews (SQLite, Supabase, or similar).
2. **Auth**: Simple auth (e.g. Supabase Auth or NextAuth) for “Our Bookings”.
3. **Favorites**: Server-side favorites with auth.
4. **Map**: **OpenStreetMap + Leaflet** with **Esri World Imagery** (satellite/aerial tiles) for stay location display (no API key; integrated in Stay Details). Coordinates in data aligned to location names (secluded areas for nature stays, city centers for CITY).
5. **Image uploads**: For stay images and reviews (S3, Cloudinary).
6. **Deployment**: Frontend → Vercel, API → Render/Railway; env vars.
7. **Performance**: Image optimization, bundle analysis, lazy loading.
8. **A11y**: Full WCAG audit and improvements.
9. **Monitoring**: Sentry or similar for errors.

---

## 15. Tradeoffs & Decisions

| Decision | Choice | Tradeoff |
|----------|--------|----------|
| Monorepo vs single app | Single Next.js app | No separate backend means no need for workspace tooling; simpler, less churn |
| Next.js vs Vite | Next.js | Phase 0 UI is deeply Next.js-specific; migration would be pure churn with no product value |
| Express vs Route Handlers | Next.js Route Handlers | Same process, no CORS needed, satisfies "small server" requirement, all 7 endpoints already live |
| Yarn vs pnpm | pnpm (keep) | Already working; no migration needed |
| Shadcn+Tailwind vs MUI | Shadcn+Tailwind | v0-native prompting, easy to modify, built-in themes; smaller bundle |
| TSQ-only state | No Zustand/Redux | Simpler mental model; URL + Query cache as source of truth |
| Valibot vs Yup vs Zod | Valibot (stable) | Lightweight frontend validation; drop Zod (unused v0 artifact) |
| Mock data vs DB | Mock | Fast MVP; no persistence, must migrate later |

---

## 16. References

- [Shadcn/ui](https://ui.shadcn.com/)
- [Tailwind CSS](https://tailwindcss.com/)
- [v0 by Vercel](https://v0.dev) — prompt → Shadcn/Tailwind code for faster iteration
- [TanStack Query](https://tanstack.com/query/latest)
- [React Router](https://reactrouter.com/)
- [Vite](https://vitejs.dev/)
- [Vitest](https://vitest.dev/)
- [Playwright](https://playwright.dev/)
- [Express](https://expressjs.com/)
- [Valibot](https://valibot.dev/)
- [Framer Motion](https://www.framer.com/motion/)
- OpenStreetMap + Leaflet + Esri World Imagery — stay location map with satellite imagery (no API key; [Leaflet](https://leafletjs.com/), [Esri](https://www.esri.com/))

---

*Document ready for implementation. Next step: scaffold monorepo and implement Phase 1.*
