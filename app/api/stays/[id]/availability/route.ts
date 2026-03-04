import { type NextRequest, NextResponse } from "next/server";
import bookingsData from "@/data/bookings.json";
import staysData from "@/data/stays.json";
import { logRoute } from "@/lib/api-logger";
import type { AvailabilityResponse, Booking, Stay } from "@/types";
import { calculateNights, datesOverlap } from "@/utils/dates";

const stays = staysData as Stay[];
const bookings = bookingsData as Booking[];

export async function GET(
	request: NextRequest,
	{ params }: { params: Promise<{ id: string }> },
) {
	const start = Date.now();
	const path = request.nextUrl.pathname;
	const { id } = await params;
	const { searchParams } = request.nextUrl;
	const checkIn = searchParams.get("checkIn");
	const checkOut = searchParams.get("checkOut");

	const stay = stays.find((s) => s.id === id);

	if (!stay) {
		const res = NextResponse.json({ error: "Stay not found" }, { status: 404 });
		logRoute("GET", path, 404, Date.now() - start);
		return res;
	}

	if (!checkIn || !checkOut) {
		const res = NextResponse.json(
			{ error: "checkIn and checkOut are required" },
			{ status: 400 },
		);
		logRoute("GET", path, 400, Date.now() - start);
		return res;
	}

	if (checkOut <= checkIn) {
		const res = NextResponse.json(
			{ error: "checkOut must be after checkIn" },
			{ status: 400 },
		);
		logRoute("GET", path, 400, Date.now() - start);
		return res;
	}

	// Check if dates are within stay's availability windows
	const withinAvailability = stay.availability.some(
		(a) => a.checkIn <= checkIn && a.checkOut >= checkOut,
	);

	// Check for existing booking conflicts
	const existingBookings = bookings.filter(
		(b) =>
			b.stayId === id && (b.status === "confirmed" || b.status === "pending"),
	);

	const hasConflict = existingBookings.some((b) =>
		datesOverlap(checkIn, checkOut, b.checkIn, b.checkOut),
	);

	const available = withinAvailability && !hasConflict;

	const nights = calculateNights(checkIn, checkOut);
	const totalPrice = stay.pricePerNight * nights;

	const response: AvailabilityResponse = {
		available,
		totalPrice: parseFloat(totalPrice.toFixed(6)),
		currency: stay.currency,
		nights,
		conflictMessage: hasConflict
			? "These dates overlap with an existing booking"
			: !withinAvailability
				? "This retreat is not available during these dates"
				: undefined,
	};

	const res = NextResponse.json(response);
	logRoute("GET", path, 200, Date.now() - start);
	return res;
}
