import { NextRequest } from "next/server";
import { describe, expect, it } from "vitest";
import { GET } from "@/app/api/stays/route";

describe("GET /api/stays", () => {
	it("returns 200 and an array of stays", async () => {
		const req = new NextRequest("http://localhost:3000/api/stays");
		const res = await GET(req);
		expect(res.status).toBe(200);
		const data = await res.json();
		expect(Array.isArray(data)).toBe(true);
	});

	it("returns 400 when checkOut <= checkIn", async () => {
		const req = new NextRequest(
			"http://localhost:3000/api/stays?checkIn=2026-06-10&checkOut=2026-06-10",
		);
		const res = await GET(req);
		expect(res.status).toBe(400);
		const data = await res.json();
		expect(data.error).toMatch(/checkOut must be after checkIn/i);
	});

	it("filters by type when type param is provided", async () => {
		const req = new NextRequest("http://localhost:3000/api/stays?type=FOREST");
		const res = await GET(req);
		expect(res.status).toBe(200);
		const data = await res.json();
		expect(Array.isArray(data)).toBe(true);
		for (const stay of data) {
			expect(stay.scenario).toBe("FOREST");
		}
	});
});
