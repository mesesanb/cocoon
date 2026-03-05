# Phase 3: Search, Availability & Reviews Polishing

## Overview

Phase 3 closes the loop between **search**, **booking availability**, and **reviews** so that all three flows agree on what is bookable and who said what.
This phase is intentionally narrow: it documents only the code changes made in this branch, building on top of the earlier Phase 2.x work.

High‑level outcomes:

1. **Search ↔ booking availability stay in sync** — the same date and booking rules are now applied consistently across the discovery list, availability checks, and the booking form.
2. **Booking date pickers behave correctly** — users cannot select already‑booked nights or invalid end dates, which removes the confusing “already booked” errors for seemingly free dates.
3. **Reviews always show a couple name with clear validation** — the UI enforces minimum review length, surfaces backend validation errors, and ensures every review renders with a readable name.

---

## 1. Availability & Booking Date Picker Fixes

### 1.1 `GET /api/bookings` supports both `userId` and `stayId`

**Problem**

- The booking form’s “smart date picker” fetched `/api/bookings?stayId=...`, but the API only accepted a `userId` query param.
- This mismatch meant the date picker sometimes failed silently, causing the UI to allow ranges that would later conflict at booking time.

**Changes** (`app/api/bookings/route.ts`)

- Extended `GET /api/bookings` to support **either**:
  - `userId` — return bookings for a specific user (used by “Our Cocoon” history).
  - `stayId` — return **confirmed/pending** bookings for a specific stay (used by the booking form and availability logic).
- If neither `userId` nor `stayId` is provided, the route still returns a 400, but the real‑world flows now call it with supported parameters.

Effect:

- The booking form can reliably fetch all active bookings for a stay and compute unavailable nights.
- User booking history still works by passing `userId`.

### 1.2 Booking form date pickers correctly block invalid dates

**Problem**

- The booking form was already fetching bookings and computing `bookedDates`, but the calendars did **not** actually disable those dates.
- It was also possible to pick an “end stay” date that was the same as the “begin stay” date, which later caused server‑side validation errors.

**Changes** (`components/booking-form.tsx`)

- **Begin stay calendar**
  - Disables:
    - Any date before today.
    - Any date whose `yyyy-MM-dd` is present in the `bookedDates` set.
- **End stay calendar**
  - Enforces `checkOut > checkIn` by:
    - Computing a minimum end date of `addDays(startOfDay(checkIn), 1)`.
    - Disabling any date before that minimum.
  - Also disables nights already present in `bookedDates`.

Effect:

- Users cannot even select nights that are already booked or an invalid same‑day checkout, so **search results, availability checks, and booking conflicts are aligned**.

---

## 2. Review Flow: Names, Validation & Error UX

### 2.1 Review API always stores a non‑empty couple name

**Problem**

- New reviews were being created with an empty `coupleName` string, even when the UI appeared to show a name.
- This led to blank author lines in the “Resonance Reviews” list.

**Changes**

- `lib/validators.ts`:
  - `validateReviewBody` now requires `coupleName` to be a **non‑empty string**, alongside the existing `userId`, `rating`, and `text` rules.
- `app/api/stays/[id]/reviews/route.ts`:
  - Treats `coupleName` as required in the payload.
  - Trims the value and saves the trimmed name on the `Review`.
  - As a safety net, if `coupleName` somehow arrives empty:
    - Reuses the couple name from an existing review for the same `userId`, or
    - Falls back to `"Cocoon couple"` so the UI never sees a blank string.

Effect:

- Every review now has a meaningful `coupleName` at the data layer, making the frontend display simple and reliable.

### 2.2 Review form: client‑side validation and inline errors

**Problem**

- Backend validation enforced a minimum review length but the UI didn’t show a clear message, leading to confusing failures.
- The couple name field wasn’t validated on the client, so empty or missing names could slip through.

**Changes** (`components/stay-detail-client.tsx` — `ReviewForm`)

- Added **client‑side validation** before hitting the API:
  - If the couple name is blank → show **“Please enter your couple name.”**
  - If the review text is blank → show **“Please share a few words about your resonance.”**
  - If the review text is under 10 characters → show **“Please write at least 10 characters.”**
  - In all of these cases, the form does **not** submit and no network call is made.
- The validation message is rendered directly under the textarea in subtle red text.
- As the user types:
  - Once the trimmed text reaches 10+ characters, the length error clears.
  - Editing the couple name clears the “Please enter your couple name.” error.

Effect:

- Users get immediate, local feedback about why a review can’t be submitted, mirroring the backend rules without having to inspect the network tab.

### 2.3 Review mutation & cache updates

**Problem**

- After a successful POST, the new review name wasn’t always reflected at the top of the list, and race conditions around `coupleName` could still result in blank display.

**Changes** (`components/stay-detail-client.tsx` — `addReviewMutation`)

- On success:
  - Clears any previous `reviewError`.
  - Builds a **hydrated review** object that prefers:
    - `data.coupleName` from the API, but falls back to the submitted `variables.coupleName` if needed.
  - Updates the React Query cache for `["reviews", stayId]` by **prepending** the hydrated review and bumping the total count.
- On error:
  - Extracts the backend error message (e.g. `"text must be at least 10 characters"`) and stores it in `reviewError`.
  - `ReviewForm` displays this server‑side error under the textarea when present.

Effect:

- New reviews appear instantly at the top of the list with a proper name, and any backend validation message is surfaced clearly in the UI.

### 2.4 Review cards always show a readable name

**Problem**

- Historical or malformed reviews could still have an empty `coupleName`, which would render as a visually blank header even after the API fixes.

**Changes** (`components/review-card.tsx`)

- Introduced a `displayName` computed as:
  - The trimmed `review.coupleName` when present, otherwise
  - `"Cocoon couple"`.
- The card header renders `displayName` rather than the raw `coupleName`.

Effect:

- Every review card has a visible author label, even for legacy data.

---

## 3. Files Touched in Phase 3

- `app/api/bookings/route.ts`
  - `GET /api/bookings` now supports both `userId` and `stayId` query parameters and correctly filters by confirmed/pending bookings for stays.
- `app/api/stays/[id]/reviews/route.ts`
  - Requires and trims `coupleName`, with a defensive fallback when missing.
- `lib/validators.ts`
  - Strengthened `validateReviewBody` to enforce a non‑empty `coupleName` and maintain the 10‑character minimum for `text`.
- `components/booking-form.tsx`
  - Hooked `bookedDates` into both calendars and enforced `checkOut > checkIn`.
- `components/stay-detail-client.tsx`
  - Added robust review form validation, better error messaging, and a safer review mutation that keeps the cache and names in sync.
- `components/review-card.tsx`
  - Added `displayName` with a fallback to ensure the UI never shows a blank reviewer name.

These changes collectively bring Phase 3’s search, availability, and review experiences in line with the underlying API rules and earlier Phase 2.x work.

