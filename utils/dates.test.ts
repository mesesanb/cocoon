import { describe, expect, it } from "vitest";
import {
	calculateNights,
	datesOverlap,
	formatDate,
	formatDateRange,
} from "./dates";

describe("calculateNights", () => {
	it("returns correct number of nights", () => {
		expect(calculateNights("2026-03-10", "2026-03-12")).toBe(2);
		expect(calculateNights("2026-03-10", "2026-03-11")).toBe(1);
	});

	it("returns 0 when checkIn and checkOut are the same", () => {
		expect(calculateNights("2026-03-10", "2026-03-10")).toBe(0);
	});

	it("handles multi-week stays", () => {
		expect(calculateNights("2026-03-01", "2026-03-15")).toBe(14);
	});
});

describe("datesOverlap", () => {
	it("returns true when ranges overlap", () => {
		expect(
			datesOverlap("2026-03-10", "2026-03-15", "2026-03-12", "2026-03-18"),
		).toBe(true);
		expect(
			datesOverlap("2026-03-12", "2026-03-18", "2026-03-10", "2026-03-15"),
		).toBe(true);
	});

	it("returns false when ranges do not overlap", () => {
		expect(
			datesOverlap("2026-03-10", "2026-03-12", "2026-03-13", "2026-03-15"),
		).toBe(false);
		expect(
			datesOverlap("2026-03-13", "2026-03-15", "2026-03-10", "2026-03-12"),
		).toBe(false);
	});

	it("returns false when one range ends exactly when the other starts", () => {
		expect(
			datesOverlap("2026-03-10", "2026-03-12", "2026-03-12", "2026-03-14"),
		).toBe(false);
	});
});

describe("formatDate", () => {
	it("formats ISO date string", () => {
		expect(formatDate("2026-03-05")).toMatch(/Mar 5, 2026/);
	});
});

describe("formatDateRange", () => {
	it("formats checkIn and checkOut range", () => {
		const result = formatDateRange("2026-03-05", "2026-03-10");
		expect(result).toContain("2026");
		expect(result).toMatch(/ - /);
	});
});
