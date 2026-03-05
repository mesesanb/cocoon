import { type NextRequest, NextResponse } from "next/server";
import reviewsData from "@/data/reviews.json";
import { logRoute } from "@/lib/api-logger";
import { validateReviewBody } from "@/lib/validators";
import type { Review } from "@/types";

const reviews = reviewsData as Review[];

interface ReviewPayload {
	userId: string;
	coupleName: string;
	rating: number;
	text: string;
	resonanceScore?: number;
}

export async function GET(
	request: NextRequest,
	{ params }: { params: Promise<{ id: string }> },
) {
	const start = Date.now();
	const path = request.nextUrl.pathname;
	const { id } = await params;
	const { searchParams } = request.nextUrl;
	const page = parseInt(searchParams.get("page") || "1", 10);
	const limit = parseInt(searchParams.get("limit") || "10", 10);

	const stayReviews = reviews
		.filter((r) => r.stayId === id)
		// Newest reviews first so freshly added reviews appear at the top
		.sort((a, b) => (a.date < b.date ? 1 : a.date > b.date ? -1 : 0));
	const total = stayReviews.length;
	const startIdx = (page - 1) * limit;
	const paginated = stayReviews.slice(startIdx, startIdx + limit);

	const res = NextResponse.json({
		reviews: paginated,
		total,
		page,
		totalPages: Math.ceil(total / limit),
	});
	logRoute("GET", path, 200, Date.now() - start);
	return res;
}

export async function POST(
	request: NextRequest,
	{ params }: { params: Promise<{ id: string }> },
) {
	const start = Date.now();
	const path = request.nextUrl.pathname;
	const { id } = await params;

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

	const validationError = validateReviewBody(body);
	if (validationError) {
		const res = NextResponse.json({ error: validationError }, { status: 400 });
		logRoute("POST", path, 400, Date.now() - start);
		return res;
	}

	const payload = body as ReviewPayload;
	const { userId, coupleName, rating, text, resonanceScore } = payload;

	let trimmedCoupleName = coupleName.trim();
	// Fallback: if coupleName somehow arrives empty, try to infer it from
	// existing reviews for this user, so the UI always has a displayable name.
	if (!trimmedCoupleName) {
		const existingForUser = reviews.find((r) => r.userId === userId.trim());
		if (existingForUser?.coupleName?.trim()) {
			trimmedCoupleName = existingForUser.coupleName.trim();
		} else {
			trimmedCoupleName = "Cocoon couple";
		}
	}

	const newReview: Review = {
		id: `rev-${Date.now()}`,
		stayId: id,
		userId: userId.trim(),
		coupleName: trimmedCoupleName,
		rating,
		text: text.trim(),
		date: new Date().toISOString().split("T")[0],
		resonanceScore: resonanceScore ?? Math.floor(Math.random() * 10) + 90,
	};

	reviews.push(newReview);

	const res = NextResponse.json(newReview, { status: 201 });
	logRoute("POST", path, 201, Date.now() - start);
	return res;
}
