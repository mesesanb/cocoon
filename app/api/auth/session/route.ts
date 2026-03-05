import { type NextRequest, NextResponse } from "next/server";
import {
	type AuthCookiePayload,
	COOKIE_NAME,
	signCookieValue,
} from "@/lib/auth-cookie";

/** POST /api/auth/session — exchange user identity for a signed session cookie */
export async function POST(request: NextRequest) {
	let body: unknown;
	try {
		body = await request.json();
	} catch {
		return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
	}

	const { email, coupleName } = (body ?? {}) as Partial<AuthCookiePayload>;
	if (
		!email ||
		typeof email !== "string" ||
		!coupleName ||
		typeof coupleName !== "string" ||
		!coupleName.trim()
	) {
		return NextResponse.json(
			{ error: "email and coupleName are required" },
			{ status: 400 },
		);
	}

	const cookieValue = signCookieValue({ email, coupleName: coupleName.trim() });
	const response = NextResponse.json({ ok: true });
	response.cookies.set(COOKIE_NAME, cookieValue, {
		httpOnly: true,
		sameSite: "lax",
		path: "/",
		secure: process.env.NODE_ENV === "production",
	});
	return response;
}

/** DELETE /api/auth/session — clear the session cookie */
export async function DELETE() {
	const response = NextResponse.json({ ok: true });
	response.cookies.delete(COOKIE_NAME);
	return response;
}
