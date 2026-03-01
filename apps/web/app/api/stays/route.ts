import { NextRequest, NextResponse } from "next/server";
import staysData from "@/data/stays.json";
import type { Stay, ScenarioType } from "@/types";

const stays = staysData as Stay[];

// list stays with optional query, type, dates, price, sort
export async function GET(request: NextRequest) {
  const { searchParams } = request.nextUrl;
  const query = searchParams.get("query")?.toLowerCase();
  const location = searchParams.get("location")?.toLowerCase();
  const type = searchParams.get("type")?.toUpperCase() as ScenarioType | null;
  const checkIn = searchParams.get("checkIn");
  const checkOut = searchParams.get("checkOut");
  const minPrice = searchParams.get("minPrice")
    ? parseFloat(searchParams.get("minPrice")!)
    : null;
  const maxPrice = searchParams.get("maxPrice")
    ? parseFloat(searchParams.get("maxPrice")!)
    : null;
  const sort = searchParams.get("sort");

  let filtered = [...stays];

  if (query) {
    filtered = filtered.filter(
      (s) =>
        s.name.toLowerCase().includes(query) ||
        s.tagline.toLowerCase().includes(query) ||
        s.description.toLowerCase().includes(query) ||
        s.location.toLowerCase().includes(query)
    );
  }

  if (location) {
    filtered = filtered.filter((s) =>
      s.location.toLowerCase().includes(location)
    );
  }

  if (type) {
    filtered = filtered.filter((s) => s.scenario === type);
  }

  if (checkIn && checkOut) {
    filtered = filtered.filter((s) =>
      s.availability.some((a) => a.checkIn <= checkIn && a.checkOut >= checkOut)
    );
  }

  if (minPrice !== null) {
    filtered = filtered.filter((s) => s.pricePerNight >= minPrice);
  }

  if (maxPrice !== null) {
    filtered = filtered.filter((s) => s.pricePerNight <= maxPrice);
  }

  if (sort === "price_asc") {
    filtered.sort((a, b) => a.pricePerNight - b.pricePerNight);
  } else if (sort === "price_desc") {
    filtered.sort((a, b) => b.pricePerNight - a.pricePerNight);
  } else if (sort === "resonance") {
    filtered.sort((a, b) => b.resonanceScore - a.resonanceScore);
  }

  return NextResponse.json(filtered);
}
