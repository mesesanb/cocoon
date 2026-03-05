/**
 * API request validation helpers.
 * Returns error message or null if valid.
 */

const ISO_DATE_REGEX = /^\d{4}-\d{2}-\d{2}$/;

export function validateBookingBody(body: unknown): string | null {
	if (!body || typeof body !== "object") {
		return "Request body must be a JSON object";
	}
	const b = body as Record<string, unknown>;

	if (!b.stayId || typeof b.stayId !== "string" || !b.stayId.trim()) {
		return "stayId is required and must be a non-empty string";
	}
	if (!b.userId || typeof b.userId !== "string" || !b.userId.trim()) {
		return "userId is required and must be a non-empty string";
	}
	if (!b.checkIn || typeof b.checkIn !== "string") {
		return "checkIn is required and must be a string (YYYY-MM-DD)";
	}
	if (!b.checkOut || typeof b.checkOut !== "string") {
		return "checkOut is required and must be a string (YYYY-MM-DD)";
	}

	const checkIn = b.checkIn as string;
	const checkOut = b.checkOut as string;

	if (!ISO_DATE_REGEX.test(checkIn)) {
		return "checkIn must be in YYYY-MM-DD format";
	}
	if (!ISO_DATE_REGEX.test(checkOut)) {
		return "checkOut must be in YYYY-MM-DD format";
	}
	if (checkOut <= checkIn) {
		return "checkOut must be after checkIn";
	}

	return null;
}

export function validateReviewBody(body: unknown): string | null {
	if (!body || typeof body !== "object") {
		return "Request body must be a JSON object";
	}
	const b = body as Record<string, unknown>;

	if (!b.coupleName || typeof b.coupleName !== "string" || !b.coupleName.trim()) {
		return "coupleName is required and must be a non-empty string";
	}
	if (!b.userId || typeof b.userId !== "string" || !b.userId.trim()) {
		return "userId is required and must be a non-empty string";
	}
	if (b.rating === undefined || b.rating === null) {
		return "rating is required";
	}
	const rating = Number(b.rating);
	if (!Number.isInteger(rating) || rating < 1 || rating > 5) {
		return "rating must be an integer between 1 and 5";
	}
	if (!b.text || typeof b.text !== "string") {
		return "text is required and must be a string";
	}
	const text = b.text.trim();
	if (text.length < 10) {
		return "text must be at least 10 characters";
	}

	return null;
}
