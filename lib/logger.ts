type LogLevel = "info" | "warn" | "error" | "debug";

interface LogEntry {
	timestamp: string;
	level: LogLevel;
	message: string;
	data?: unknown;
}

class Logger {
	private isDev = process.env.NODE_ENV === "development";

	private log(level: LogLevel, message: string, data?: unknown) {
		const entry: LogEntry = {
			timestamp: new Date().toISOString(),
			level,
			message,
			data,
		};

		// Log to console in development
		if (this.isDev) {
			const style = {
				info: "color: #0ea5e9",
				warn: "color: #eab308",
				error: "color: #ef4444",
				debug: "color: #8b5cf6",
			};
			console.log(
				`%c[${entry.level.toUpperCase()}] ${message}`,
				style[level],
				data,
			);
		}

		// Log to external service in production (optional)
		if (level === "error" && !this.isDev) {
			// TODO: Integrate with error tracking service (Sentry, LogRocket, etc.)
			// if (window.Sentry) {
			//   window.Sentry.captureMessage(entry.message, {
			//     level: entry.level,
			//     extra: entry.data,
			//   });
			// }
		}
	}

	info(message: string, data?: unknown) {
		this.log("info", message, data);
	}

	warn(message: string, data?: unknown) {
		this.log("warn", message, data);
	}

	error(message: string, data?: unknown) {
		this.log("error", message, data);
	}

	debug(message: string, data?: unknown) {
		this.log("debug", message, data);
	}
}

export const logger = new Logger();
