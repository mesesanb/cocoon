# Phase 2: API Polish

Phase 2 polishes the existing Next.js Route Handler API: validation, correctness, and observability. No new routes were added.

**⚠️ FOLLOW-UP**: See [phase-2-5-frontend-errors.md](phase-2-5-frontend-errors.md) for critical frontend error handling fixes required before proceeding to Phase 3.

## Summary of Changes

| Task | Description |
|------|-------------|
| 2.1 | Input validation on `POST /api/bookings` — `stayId`, `coupleName`, `checkIn`, `checkOut` required; 400 on invalid |
| 2.2 | Input validation on `POST /api/stays/:id/reviews` — `coupleName`, `rating` (1–5), `text` (min 10 chars) |
| 2.3 | `GET /api/bookings` requires `coupleName` query param; returns only that couple's bookings |
| 2.4 | `GET /api/stays` with `checkIn`/`checkOut` now excludes stays with booking conflicts |
| 2.5 | Removed `sort=resonance` (duplicate of `sort=rating_desc`) |
| 2.6 | `checkOut <= checkIn` returns 400 in availability and stays routes |
| 2.7 | Structured logging (method, path, status, duration) on all route handlers |

## API Reference

### POST /api/bookings

**Request body** (JSON):

- `stayId` (string, required)
- `coupleName` (string, required, non-empty)
- `checkIn` (string, required, YYYY-MM-DD)
- `checkOut` (string, required, YYYY-MM-DD, must be after checkIn)
- `guests` (number, optional, default 2)

**Validation errors** (400):

- Missing or invalid fields
- `checkOut` not after `checkIn`
- Invalid date format

### GET /api/bookings

**Query params**:

- `coupleName` (required) — filters bookings by couple name (case-insensitive)

**Validation errors** (400):

- Missing `coupleName`

### POST /api/stays/:id/reviews

**Request body** (JSON):

- `coupleName` (string, required, non-empty)
- `rating` (number, required, integer 1–5)
- `text` (string, required, min 10 characters after trim)

**Validation errors** (400):

- Missing or invalid fields
- `rating` outside 1–5
- `text` shorter than 10 characters

### GET /api/stays

**Query params** (all optional):

- `query` — search in name, tagline, description, location
- `location` — filter by location
- `type` — scenario (CITY, FOREST, MOUNTAINS, SEA)
- `checkIn`, `checkOut` — filter by availability; excludes stays with conflicting bookings
- `amenities` — comma-separated; filter by amenities
- `amenitiesMode` — `any` (default) or `all`
- `minPrice`, `maxPrice` — price range
- `sort` — `price_asc`, `price_desc`, `rating_asc`, `rating_desc`, `reviews_desc`

**Validation errors** (400):

- `checkOut <= checkIn` when both dates provided

### GET /api/stays/:id/availability

**Query params**:

- `checkIn` (required)
- `checkOut` (required, must be after checkIn)

**Validation errors** (400):

- Missing `checkIn` or `checkOut`
- `checkOut <= checkIn`

## Structured Logging

All route handlers log JSON lines to stdout:

```json
{"level":"info","msg":"api_request","method":"GET","path":"/api/stays","status":200,"durationMs":12}
```

## New Files

- `lib/api-logger.ts` — structured logging helper
- `lib/validators.ts` — request body validation for bookings and reviews

## Updated Files

- `utils/dates.ts` — added `datesOverlap` helper
- `app/api/bookings/route.ts` — validation, coupleName filter, logging
- `app/api/stays/route.ts` — booking-conflict check, date guard, removed resonance sort, logging
- `app/api/stays/[id]/route.ts` — logging
- `app/api/stays/[id]/availability/route.ts` — date guard, logging
- `app/api/stays/[id]/reviews/route.ts` — validation, logging
- `app/api/bookings/[confirmationId]/route.ts` — logging
- `app/api/reviews/route.ts` — logging
- `components/our-cocoon-client.tsx` — pass `coupleName` when fetching bookings
