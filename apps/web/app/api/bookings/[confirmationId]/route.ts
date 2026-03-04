import { NextResponse } from "next/server";
import bookingsData from "@/data/bookings.json";
import type { Booking } from "@/types";

const bookings = bookingsData as Booking[];

export async function GET(
	_request: Request,
	{ params }: { params: Promise<{ confirmationId: string }> },
) {
	const { confirmationId } = await params;
	const booking = bookings.find((b) => b.confirmationId === confirmationId);

	if (!booking) {
		return NextResponse.json({ error: "Booking not found" }, { status: 404 });
	}

	return NextResponse.json(booking);
}
