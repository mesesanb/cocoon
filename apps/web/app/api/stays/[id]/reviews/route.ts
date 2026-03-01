import { NextRequest, NextResponse } from "next/server";
import reviewsData from "@/data/reviews.json";
import type { Review } from "@/types";

const reviews = reviewsData as Review[];

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const { searchParams } = request.nextUrl;
  const page = parseInt(searchParams.get("page") || "1");
  const limit = parseInt(searchParams.get("limit") || "10");

  const stayReviews = reviews.filter((r) => r.stayId === id);
  const total = stayReviews.length;
  const start = (page - 1) * limit;
  const paginated = stayReviews.slice(start, start + limit);

  return NextResponse.json({
    reviews: paginated,
    total,
    page,
    totalPages: Math.ceil(total / limit),
  });
}

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const body = await request.json();

  const newReview: Review = {
    id: `rev-${Date.now()}`,
    stayId: id,
    coupleName: body.coupleName,
    rating: body.rating,
    text: body.text,
    date: new Date().toISOString().split("T")[0],
    resonanceScore: body.resonanceScore || Math.floor(Math.random() * 10) + 90,
  };

  reviews.push(newReview);

  return NextResponse.json(newReview, { status: 201 });
}
