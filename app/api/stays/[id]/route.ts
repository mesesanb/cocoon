import { type NextRequest, NextResponse } from "next/server";
import reviewsData from "@/data/reviews.json";
import staysData from "@/data/stays.json";
import { logRoute } from "@/lib/api-logger";
import type { Review, Stay } from "@/types";

const stays = staysData as Stay[];
const reviews = reviewsData as Review[];

export async function GET(
	request: NextRequest,
	{ params }: { params: Promise<{ id: string }> },
) {
	const start = Date.now();
	const path = request.nextUrl.pathname;
	const { id } = await params;
	const stay = stays.find((s) => s.id === id);

	if (!stay) {
		const res = NextResponse.json({ error: "Stay not found" }, { status: 404 });
		logRoute("GET", path, 404, Date.now() - start);
		return res;
	}

	const reviewCount = reviews.filter((r) => r.stayId === id).length;
	const res = NextResponse.json({ ...stay, reviewCount });
	logRoute("GET", path, 200, Date.now() - start);
	return res;
}
