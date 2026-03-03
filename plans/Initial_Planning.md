# Cocoon: Here, us. — Initial Planning Document

**Document**: Initial Planning  
**Focus**: Fullstack (Frontend-heavy)  
**Date**: February 2026  
**Package manager**: Yarn (planned); **Phase 0 uses pnpm in `apps/web`**  
**TO CONSIDER**: https://looking-ahead.hotmetalapp.com/how-i-10x-d-my-ai-coding-productivity-and-you-can-too — clear directions to follow while developing this project.

**Current state (Phase 0 complete)**: The repo has a single Next.js 16 app in `apps/web` (React 19, TypeScript, Tailwind, Shadcn, Framer Motion). Stays, availability, reviews, and bookings are served by Next.js Route Handlers; data from `apps/web/data/stays.json`. No monorepo yet; no `apps/api` or `packages/shared`. Run with `cd apps/web && pnpm dev`. See [TODOS.md](TODOS.md) Phase 0 and [phase-0-ui.md](../docs/phase-0-ui.md).

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
| **Framework** | React 19 + TypeScript | Modern, strong ecosystem and types |
| **Build** | Vite | Fast dev, simple config |
| **UI library** | Shadcn/ui | Copy-paste components, easy to modify, v0-native | tailwind
| **Routing** | React Router v6 | Standard for SPA routing |
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
| **Runtime** | Node.js | Shared with many frontend devs |
| **Framework** | **Express** | Minimal, familiar; plain routes and JSON; no DI or modules |
| **Data** | In-memory / JSON file | Mock data; easy to swap for DB later |
| **Validation** | Minimal (manual checks or Valibot) | Keep backend simple; no heavy validation framework |

### Validation: Alternatives to Zod

Backend uses **minimal validation** (manual checks or Valibot). For **frontend** forms, choose one:

| Library | Pros | Cons |
|---------|------|------|
| **Valibot** | <1kb, modular, Zod-like API, RHF resolver | Smaller ecosystem |


**Recommendation**: **Valibot** for frontend — lightweight, similar to Zod, RHF-compatible. Or **Yup** if you prefer battle-tested.

### Monorepo (optional but recommended)

- Single repo: `apps/web` (React) + `apps/api` (Node)
- Shared `packages/shared` for types and schemas
- Tool: **Turborepo** or **npm workspaces**

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
travel-booking-app/
├── apps/
│   ├── web/                    # React frontend
│   │   ├── src/
│   │   │   ├── app/            # Router, providers, layouts
│   │   │   ├── features/
│   │   │   │   ├── stays/
│   │   │   │   ├── reviews/
│   │   │   │   ├── bookings/
│   │   │   │   └── availability/
│   │   │   ├── shared/
│   │   │   │   ├── api/
│   │   │   │   ├── components/
│   │   │   │   ├── hooks/
│   │   │   │   └── utils/
│   │   │   └── pages/          # Route entry components
│   │   └── public/
│   │
│   └── api/                    # Express backend
│       ├── src/
│       │   ├── routes/         # stays, reviews, bookings
│       │   ├── data/           # Mock JSON
│       │   └── index.ts        # app entry
│       └── package.json
│
├── packages/
│   └── shared/
│       └── src/
│           ├── types.ts        # Shared TS interfaces
│           └── dto/            # Optional: DTOs if sharing validation
│
├── package.json                # Workspace root
├── turbo.json                  # Turborepo config
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

**Request/Response**: JSON. Shared types via `packages/shared`.

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
| **1. Setup** | 30 min | Monorepo (yarn), Vite+React+TS, Shadcn+Tailwind, Express API, shared types |
| **2. Data + API** | 45 min | Mock data, Express routes, all endpoints working |
| **3. Search + List** | 1h | Search page, filters, sort, card grid |
| **4. Stay Details** | 45 min | Details page, availability, price display |
| **5. Reviews** | 45 min | List + add review |
| **6. Checkout** | 1h | Multi-step flow, confirmation |
| **7. Polish** | 30 min | Loading/empty/error states, a11y basics |
| **8. Tests + CI** | 45 min | Key tests, GitHub Actions |
| **Buffer** | 30 min | Contingency |

---

## 13. Single-command Run

**Option A (monorepo)**: `yarn dev` runs both frontend and backend via Turborepo (or npm workspaces).

**Option B (separate)**: Document as:
```bash
# Terminal 1
yarn workspace api dev

# Terminal 2
yarn workspace web dev
```

Or use `concurrently` in root `package.json`:
```json
"dev": "concurrently \"yarn workspace api dev\" \"yarn workspace web dev\""
```

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
| Monorepo vs separate repos | Monorepo | Shared types, one clone; slightly more setup |
| Shadcn+Tailwind vs MUI | Shadcn+Tailwind | v0-native prompting, easy to modify, built-in themes; smaller bundle |
| TSQ-only state | No Zustand/Redux | Simpler mental model; URL + Query cache as source of truth |
| Backend framework | Express | Simple routes, minimal deps; no DI or modules |
| Valibot vs Yup vs Zod | Valibot | Lightweight frontend validation; Yup if prefer mature |
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
