import { createHmac, timingSafeEqual } from "node:crypto";

export const COOKIE_NAME = "cocoon_auth";

// In production, AUTH_COOKIE_SECRET must be set to a long random string.
if (process.env.NODE_ENV === "production" && !process.env.AUTH_COOKIE_SECRET) {
	throw new Error(
		"AUTH_COOKIE_SECRET environment variable must be set in production",
	);
}
const SECRET =
	process.env.AUTH_COOKIE_SECRET ?? "dev-only-insecure-secret-change-me";

export interface AuthCookiePayload {
	email: string;
	coupleName: string;
}

/** Produces a tamper-evident cookie value: base64url(json) + "." + HMAC */
export function signCookieValue(payload: AuthCookiePayload): string {
	const data = Buffer.from(JSON.stringify(payload)).toString("base64url");
	const sig = createHmac("sha256", SECRET).update(data).digest("base64url");
	return `${data}.${sig}`;
}

/** Returns the parsed payload if the signature is valid, otherwise null. */
export function verifyCookieValue(value: string): AuthCookiePayload | null {
	const dot = value.lastIndexOf(".");
	if (dot === -1) return null;
	const data = value.slice(0, dot);
	const sig = value.slice(dot + 1);
	const expected = createHmac("sha256", SECRET)
		.update(data)
		.digest("base64url");
	try {
		if (
			!timingSafeEqual(
				Buffer.from(sig, "base64url"),
				Buffer.from(expected, "base64url"),
			)
		) {
			return null;
		}
	} catch {
		return null;
	}
	try {
		return JSON.parse(
			Buffer.from(data, "base64url").toString("utf8"),
		) as AuthCookiePayload;
	} catch {
		return null;
	}
}
