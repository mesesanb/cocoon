import { describe, expect, it } from "vitest";
import { validateBookingBody, validateReviewBody } from "./validators";

describe("validateBookingBody", () => {
	it("returns null for valid booking", () => {
		expect(
			validateBookingBody({
				stayId: "stay-1",
				userId: "user-1",
				checkIn: "2026-03-10",
				checkOut: "2026-03-12",
			}),
		).toBeNull();
	});

	it("rejects non-object body", () => {
		expect(validateBookingBody(null)).toContain("JSON object");
		expect(validateBookingBody("string")).toContain("JSON object");
	});

	it("rejects missing or empty stayId", () => {
		expect(
			validateBookingBody({
				userId: "user-1",
				checkIn: "2026-03-10",
				checkOut: "2026-03-12",
			}),
		).toContain("stayId");
		expect(
			validateBookingBody({
				stayId: "   ",
				userId: "user-1",
				checkIn: "2026-03-10",
				checkOut: "2026-03-12",
			}),
		).toContain("stayId");
	});

	it("rejects missing or empty userId", () => {
		expect(
			validateBookingBody({
				stayId: "stay-1",
				checkIn: "2026-03-10",
				checkOut: "2026-03-12",
			}),
		).toContain("userId");
	});

	it("rejects invalid date format", () => {
		expect(
			validateBookingBody({
				stayId: "stay-1",
				userId: "user-1",
				checkIn: "03-10-2026",
				checkOut: "2026-03-12",
			}),
		).toContain("YYYY-MM-DD");
	});

	it("rejects checkOut <= checkIn", () => {
		expect(
			validateBookingBody({
				stayId: "stay-1",
				userId: "user-1",
				checkIn: "2026-03-12",
				checkOut: "2026-03-12",
			}),
		).toContain("after");
		expect(
			validateBookingBody({
				stayId: "stay-1",
				userId: "user-1",
				checkIn: "2026-03-15",
				checkOut: "2026-03-10",
			}),
		).toContain("after");
	});
});

describe("validateReviewBody", () => {
	it("returns null for valid review", () => {
		expect(
			validateReviewBody({
				userId: "user-1",
				coupleName: "Kai and Luna",
				rating: 5,
				text: "This is a wonderful retreat for two.",
			}),
		).toBeNull();
	});

	it("rejects non-object body", () => {
		expect(validateReviewBody(null)).toContain("JSON object");
	});

	it("rejects missing or empty coupleName", () => {
		expect(
			validateReviewBody({
				userId: "user-1",
				rating: 5,
				text: "This is a wonderful retreat for two.",
			}),
		).toContain("coupleName");
		expect(
			validateReviewBody({
				userId: "user-1",
				coupleName: "   ",
				rating: 5,
				text: "This is a wonderful retreat for two.",
			}),
		).toContain("coupleName");
	});

	it("rejects missing or empty userId", () => {
		expect(
			validateReviewBody({
				coupleName: "Kai and Luna",
				rating: 5,
				text: "This is a wonderful retreat for two.",
			}),
		).toContain("userId");
	});

	it("rejects rating outside 1-5", () => {
		expect(
			validateReviewBody({
				userId: "user-1",
				coupleName: "Kai and Luna",
				rating: 0,
				text: "This is a wonderful retreat for two.",
			}),
		).toContain("between 1 and 5");
		expect(
			validateReviewBody({
				userId: "user-1",
				coupleName: "Kai and Luna",
				rating: 6,
				text: "This is a wonderful retreat for two.",
			}),
		).toContain("between 1 and 5");
	});

	it("rejects text shorter than 10 characters", () => {
		expect(
			validateReviewBody({
				userId: "user-1",
				coupleName: "Kai and Luna",
				rating: 5,
				text: "Short",
			}),
		).toContain("at least 10");
		expect(
			validateReviewBody({
				userId: "user-1",
				coupleName: "Kai and Luna",
				rating: 5,
				text: "123456789",
			}),
		).toContain("at least 10");
	});

	it("accepts text with exactly 10 characters", () => {
		expect(
			validateReviewBody({
				userId: "user-1",
				coupleName: "Kai and Luna",
				rating: 5,
				text: "1234567890",
			}),
		).toBeNull();
	});
});
