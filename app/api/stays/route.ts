import { type NextRequest, NextResponse } from "next/server";
import bookingsData from "@/data/bookings.json";
import reviewsData from "@/data/reviews.json";
import staysData from "@/data/stays.json";
import { logRoute } from "@/lib/api-logger";
import type { Booking, Review, ScenarioType, Stay } from "@/types";
import { datesOverlap } from "@/utils/dates";

const stays = staysData as Stay[];
const reviews = reviewsData as Review[];
const bookings = bookingsData as Booking[];

interface StayWithReviewCount extends Stay {
	reviewCount: number;
}

function attachReviewCounts(stayList: Stay[]): StayWithReviewCount[] {
	const countByStay: Record<string, number> = {};
	reviews.forEach((r) => {
		countByStay[r.stayId] = (countByStay[r.stayId] ?? 0) + 1;
	});
	return stayList.map((s) => ({
		...s,
		reviewCount: countByStay[s.id] ?? 0,
	}));
}

// list stays with optional query, type, dates, price, sort
export async function GET(request: NextRequest) {
	const start = Date.now();
	const path = request.nextUrl.pathname;
	const { searchParams } = request.nextUrl;
	const query = searchParams.get("query")?.toLowerCase();
	const location = searchParams.get("location")?.toLowerCase();
	const type = searchParams.get("type")?.toUpperCase() as ScenarioType | null;
	const checkIn = searchParams.get("checkIn");
	const checkOut = searchParams.get("checkOut");
	const amenitiesParam = searchParams.get("amenities");
	const amenitiesMode = (
		searchParams.get("amenitiesMode") ?? "any"
	).toLowerCase();
	const minPriceRaw = searchParams.get("minPrice");
	const minPrice = minPriceRaw ? parseFloat(minPriceRaw) : null;
	const maxPriceRaw = searchParams.get("maxPrice");
	const maxPrice = maxPriceRaw ? parseFloat(maxPriceRaw) : null;
	const sort = searchParams.get("sort");

	let filtered: StayWithReviewCount[] = attachReviewCounts([...stays]);

	if (query) {
		filtered = filtered.filter(
			(s) =>
				s.name.toLowerCase().includes(query) ||
				s.tagline.toLowerCase().includes(query) ||
				s.description.toLowerCase().includes(query) ||
				s.location.toLowerCase().includes(query),
		);
	}

	if (location) {
		filtered = filtered.filter((s) =>
			s.location.toLowerCase().includes(location),
		);
	}

	if (type) {
		filtered = filtered.filter((s) => s.scenario === type);
	}

	if (checkIn && checkOut) {
		if (checkOut <= checkIn) {
			const res = NextResponse.json(
				{ error: "checkOut must be after checkIn" },
				{ status: 400 },
			);
			logRoute("GET", path, 400, Date.now() - start);
			return res;
		}
		filtered = filtered.filter((s) => {
			const withinAvailability = s.availability.some(
				(a) => a.checkIn <= checkIn && a.checkOut >= checkOut,
			);
			if (!withinAvailability) return false;
			const stayBookings = bookings.filter(
				(b) =>
					b.stayId === s.id &&
					(b.status === "confirmed" || b.status === "pending"),
			);
			const hasConflict = stayBookings.some((b) =>
				datesOverlap(checkIn, checkOut, b.checkIn, b.checkOut),
			);
			return !hasConflict;
		});
	}

	if (amenitiesParam) {
		const requested = amenitiesParam
			.split(",")
			.map((a) => a.trim())
			.filter(Boolean)
			.map((a) => a.toLowerCase());

		if (requested.length > 0) {
			filtered = filtered.filter((s) => {
				const stayAmenities = (s.amenities ?? []).map((a) => a.toLowerCase());
				if (amenitiesMode === "all") {
					return requested.every((a) => stayAmenities.includes(a));
				}
				// default: any
				return requested.some((a) => stayAmenities.includes(a));
			});
		}
	}

	if (minPrice !== null) {
		filtered = filtered.filter((s) => s.pricePerNight >= minPrice);
	}

	if (maxPrice !== null) {
		filtered = filtered.filter((s) => s.pricePerNight <= maxPrice);
	}

	if (sort === "price_asc") {
		filtered.sort((a, b) => a.pricePerNight - b.pricePerNight);
	} else if (sort === "price_desc") {
		filtered.sort((a, b) => b.pricePerNight - a.pricePerNight);
	} else if (sort === "rating_asc") {
		filtered.sort((a, b) => a.resonanceScore - b.resonanceScore);
	} else if (sort === "rating_desc") {
		filtered.sort((a, b) => b.resonanceScore - a.resonanceScore);
	} else if (sort === "reviews_desc") {
		filtered.sort((a, b) => (b.reviewCount ?? 0) - (a.reviewCount ?? 0));
	}
	// sort=resonance removed — use sort=rating_desc instead

	const res = NextResponse.json(filtered);
	logRoute("GET", path, 200, Date.now() - start);
	return res;
}
