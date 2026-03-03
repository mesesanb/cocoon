import { NextResponse } from "next/server";
import staysData from "@/data/stays.json";
import reviewsData from "@/data/reviews.json";
import type { Review, Stay } from "@/types";

const stays = staysData as Stay[];
const reviews = reviewsData as Review[];

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const stay = stays.find((s) => s.id === id);

  if (!stay) {
    return NextResponse.json({ error: "Stay not found" }, { status: 404 });
  }

  const reviewCount = reviews.filter((r) => r.stayId === id).length;
  return NextResponse.json({ ...stay, reviewCount });
}
