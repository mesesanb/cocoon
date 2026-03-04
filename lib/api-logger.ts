/**
 * Structured logging for API route handlers.
 * Logs method, path, status, and duration.
 */
export function logRoute(
	method: string,
	path: string,
	status: number,
	durationMs: number,
) {
	console.log(
		JSON.stringify({
			level: "info",
			msg: "api_request",
			method,
			path,
			status,
			durationMs,
		}),
	);
}
