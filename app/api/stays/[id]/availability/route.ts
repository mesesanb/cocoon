import { type NextRequest, NextResponse } from "next/server";
import bookingsData from "@/data/bookings.json";
import staysData from "@/data/stays.json";
import type { AvailabilityResponse, Booking, Stay } from "@/types";
import { calculateNights } from "@/utils/dates";

const stays = staysData as Stay[];
const bookings = bookingsData as Booking[];

// true when the two ranges overlap
function datesOverlap(
	start1: string,
	end1: string,
	start2: string,
	end2: string,
): boolean {
	return start1 < end2 && start2 < end1;
}

export async function GET(
	request: NextRequest,
	{ params }: { params: Promise<{ id: string }> },
) {
	const { id } = await params;
	const { searchParams } = request.nextUrl;
	const checkIn = searchParams.get("checkIn");
	const checkOut = searchParams.get("checkOut");

	const stay = stays.find((s) => s.id === id);

	if (!stay) {
		return NextResponse.json({ error: "Stay not found" }, { status: 404 });
	}

	if (!checkIn || !checkOut) {
		return NextResponse.json(
			{ error: "checkIn and checkOut are required" },
			{ status: 400 },
		);
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

	return NextResponse.json(response);
}
