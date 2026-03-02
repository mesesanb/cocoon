Build a high-fidelity, full-stack React 19 application called **Cocoon: Here, us.** — a 2026-era psychological retreat for couples to reconnect in nature-based solitude.

---

## Aesthetic & Visual Identity

- **Theme**: "Ethereal Glassmorphism." Palette: Warm Linen (#F5F2EE) and Misted Sage (#DDE2D5). No dark mode; no pure black (#000).
- **Typography**: Pinaud (headlines) and Schibsted Grotesk (UI) from Google Fonts. Use Schibsted Grotesk variable font weights: 300 for body text, 600 for labels — "Quiet Luxury" legibility.
- **Glass**: "Stacked Glass" — backdrop-blur-3xl, bg-white/10, border-white/20.

---

## Assets & Media

- **Paths**: `/public/images/` and `/public/videos/` (or equivalent in your setup).
- **Logic**: One helper only — e.g. `resolveMedia(path)` — if a video exists at the same base path (e.g. `forest/01_vid.mp4`), return the video URL for a muted Boomerang loop; otherwise return the image URL (e.g. JPG). Reuse this helper everywhere media is shown; do not duplicate this logic.

---

## Narrative Flow (Framer Motion)

1. **Phase 1 — Narrative Intro**: Full-screen random Boomerang video loop. Text: "Hello [Couple Name]... welcome to Cocoon. Here, us." After 7s or on click, liquid ripple transition to next phase.
2. **Phase 2 — Gateway**: Four vertical glass panels: **CITY**, **FOREST**, **MOUNTAINS**, **SEA**. On hover, panel flex-expands and background video cross-fades; UI color-shifts (Monochromatic Immersion).
3. **Phase 3 — Sanctuary Discovery**: Heavy backdrop-blur-3xl over background video. Voice mock: search bar with minimalist pulsing Microphone icon (2026 AI voice mock). Listings: 2-guest-only retreats with "Resonance Scores" and prices in ETH/BTC.

---

## DRY & Component Reuse (Mandatory)

- **Single StayCard**: One component used for (1) listing grid, (2) "Past Echoes" (history), (3) "Upcoming Moments" (bookings). Pass a `mode` prop (e.g. `"listing"` | `"history"` | `"upcoming"`) to vary layout/copy only; no separate card components.
- **User page**: Title "[Couple Name]'s Sanctuary" — past and future bookings, both using the same StayCard.
- **Stay details**: Split hero (Media left / Glass sidebar right). Organic minimalist map (Google Maps for location) + "Resonance Review" panel.
- **About**: One glass-pane manifesto — "Architecture of Us".

---

## Helpers & Utils (Single Responsibility)

- **One function, one job.** Put each in its own small helper or clearly named export (e.g. in `utils/media.ts`, `utils/price.ts`).
- **Examples**: `resolveMedia(imagePath)` → returns video URL if video exists, else image URL; `formatPrice(amount, currency)` → returns formatted string (e.g. "0.05 ETH"); `buildImageUrl(path)` → returns full asset URL. No function should do two unrelated things; this keeps code testable and reusable.

---

## Backend (JSON Only — No Database)

- **Stack**: NestJS. Data from **JSON files only** (e.g. `stays.json`, `reviews.json`, `bookings.json`) in `apps/api/src/data/` or equivalent. No DB, no ORM. Read/write in memory or by reading and writing JSON files.
- **Implement exactly these endpoints** (same surface as in the project’s Initial_Planning.md):

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/stays?query=&location=&type=&checkIn=&checkOut=&guests=&minPrice=&maxPrice=&sort=` | List/search stays |
| GET | `/stays/:id` | Stay details |
| GET | `/stays/:id/availability?checkIn=&checkOut=&guests=` | Availability + price |
| GET | `/stays/:id/reviews` | Reviews (paginated) |
| POST | `/stays/:id/reviews` | Add review |
| POST | `/bookings` | Create booking (checkout) |
| GET | `/bookings/:confirmationId` | Booking confirmation |

- **Stay type**: Use exactly four scenario types — **CITY**, **FOREST**, **MOUNTAINS**, **SEA** (shared types between frontend and backend).

---

## Frontend Tech

- **State**: TanStack Query v5 only for server state; invalidate `['bookings']` after checkout so "Upcoming Moments" updates immediately.
- **Validation**: Valibot for forms (e.g. checkout, add review).
- **Checkout**: Mock crypto payment (ETH/BTC) success with a 2-second simulated delay so the flow feels authentic during demos.
- **Types**: Strict TypeScript; shared interfaces (e.g. Stay, Review, Booking) via a shared package or duplicated types — zero `any`.

---

## Summary for v0

- **App name**: Cocoon: Here, us.
- **Scenarios**: CITY, FOREST, MOUNTAINS, SEA (four only).
- **DRY**: One StayCard with `mode`; one `resolveMedia` (and similar) helper; no duplicated media/price logic.
- **Helpers**: One function = one responsibility; small, testable utils.
- **Backend**: JSON files only; NestJS; implement the seven endpoints above; no database.
- **UI**: Glassmorphism, Pinaud + Schibsted Grotesk, Framer Motion for narrative phases and transitions.

