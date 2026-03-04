import { type NextRequest, NextResponse } from "next/server";
import bookingsData from "@/data/bookings.json";
import staysData from "@/data/stays.json";
import type { Booking, Stay } from "@/types";
import { calculateNights } from "@/utils/dates";

const bookings = bookingsData as Booking[];
const stays = staysData as Stay[];

export async function GET() {
	return NextResponse.json(bookings);
}

// create booking, append to in-memory list, return new booking
export async function POST(request: NextRequest) {
	const body = await request.json();
	const stay = stays.find((s) => s.id === body.stayId);

	if (!stay) {
		return NextResponse.json({ error: "Stay not found" }, { status: 404 });
	}

	const nights = calculateNights(body.checkIn, body.checkOut);
	const totalPrice = parseFloat((stay.pricePerNight * nights).toFixed(6));

	const newBooking: Booking = {
		confirmationId: `CCN-${Date.now()}`,
		stayId: body.stayId,
		coupleName: body.coupleName,
		checkIn: body.checkIn,
		checkOut: body.checkOut,
		guests: body.guests || 2,
		totalPrice,
		currency: stay.currency,
		status: "confirmed",
		createdAt: new Date().toISOString(),
	};

	bookings.push(newBooking);

	return NextResponse.json(newBooking, { status: 201 });
}
