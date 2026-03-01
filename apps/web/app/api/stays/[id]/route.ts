import { NextResponse } from "next/server";
import staysData from "@/data/stays.json";
import type { Stay } from "@/types";

const stays = staysData as Stay[];

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const stay = stays.find((s) => s.id === id);

  if (!stay) {
    return NextResponse.json({ error: "Stay not found" }, { status: 404 });
  }

  return NextResponse.json(stay);
}
