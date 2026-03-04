import { type NextRequest, NextResponse } from "next/server";
import reviews from "@/data/reviews.json";
import { logRoute } from "@/lib/api-logger";

export async function GET(request: NextRequest) {
	const start = Date.now();
	const path = request.nextUrl.pathname;
	const res = NextResponse.json(reviews);
	logRoute("GET", path, 200, Date.now() - start);
	return res;
}
