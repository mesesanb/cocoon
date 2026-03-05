import { type NextRequest, NextResponse } from "next/server";
import bookingsData from "@/data/bookings.json";
import { logRoute } from "@/lib/api-logger";
import type { Booking } from "@/types";

const bookings = bookingsData as Booking[];

export async function GET(
	request: NextRequest,
	{ params }: { params: Promise<{ confirmationId: string }> },
) {
	const start = Date.now();
	const path = request.nextUrl.pathname;
	const { confirmationId } = await params;
	const booking = bookings.find((b) => b.confirmationId === confirmationId);

	if (!booking) {
		const res = NextResponse.json(
			{ error: "Booking not found" },
			{ status: 404 },
		);
		logRoute("GET", path, 404, Date.now() - start);
		return res;
	}

	const res = NextResponse.json(booking);
	logRoute("GET", path, 200, Date.now() - start);
	return res;
}
