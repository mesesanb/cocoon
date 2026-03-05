import { type NextRequest, NextResponse } from "next/server";
import bookingsData from "@/data/bookings.json";
import staysData from "@/data/stays.json";
import { logRoute } from "@/lib/api-logger";
import { validateBookingBody } from "@/lib/validators";
import type { Booking, Stay } from "@/types";
import { calculateNights } from "@/utils/dates";

const bookings = bookingsData as Booking[];
const stays = staysData as Stay[];

export async function GET(request: NextRequest) {
	const start = Date.now();
	const path = request.nextUrl.pathname;

	const userId = request.nextUrl.searchParams.get("userId");
	if (!userId || !userId.trim()) {
		const res = NextResponse.json(
			{ error: "userId query parameter is required" },
			{ status: 400 },
		);
		logRoute("GET", path, 400, Date.now() - start);
		return res;
	}

	const filtered = bookings.filter(
		(b) => b.userId.toLowerCase() === userId.trim().toLowerCase(),
	);
	const res = NextResponse.json(filtered);
	logRoute("GET", path, 200, Date.now() - start);
	return res;
}

// create booking, append to in-memory list, return new booking
export async function POST(request: NextRequest) {
	const start = Date.now();
	const path = request.nextUrl.pathname;

	let body: unknown;
	try {
		body = await request.json();
	} catch {
		const res = NextResponse.json(
			{ error: "Invalid JSON body" },
			{ status: 400 },
		);
		logRoute("POST", path, 400, Date.now() - start);
		return res;
	}

	const validationError = validateBookingBody(body);
	if (validationError) {
		const res = NextResponse.json({ error: validationError }, { status: 400 });
		logRoute("POST", path, 400, Date.now() - start);
		return res;
	}

	const { stayId, userId, coupleName, checkIn, checkOut } = body as {
		stayId: string;
		userId: string;
		coupleName?: string;
		checkIn: string;
		checkOut: string;
	};

	const stay = stays.find((s) => s.id === stayId);

	if (!stay) {
		const res = NextResponse.json({ error: "Stay not found" }, { status: 404 });
		logRoute("POST", path, 404, Date.now() - start);
		return res;
	}

	const nights = calculateNights(checkIn, checkOut);
	const totalPrice = parseFloat((stay.pricePerNight * nights).toFixed(6));

	const newBooking: Booking = {
		confirmationId: `CCN-${Date.now()}`,
		stayId,
		userId,
		coupleName: coupleName?.trim() || "",
		checkIn,
		checkOut,
		guests: (body as { guests?: number }).guests || 2,
		totalPrice,
		currency: stay.currency,
		status: "confirmed",
		createdAt: new Date().toISOString(),
	};

	bookings.push(newBooking);

	const res = NextResponse.json(newBooking, { status: 201 });
	logRoute("POST", path, 201, Date.now() - start);
	return res;
}
