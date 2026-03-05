import path from "node:path";
<<<<<<< HEAD
import react from "@vitejs/plugin-react";
import { defineConfig } from "vitest/config";
=======
import { defineConfig } from "vitest/config";
import react from "@vitejs/plugin-react";
>>>>>>> main

export default defineConfig({
	plugins: [react()],
	test: {
		environment: "jsdom",
		globals: true,
		setupFiles: ["./tests/setup.ts"],
		include: ["**/*.test.{ts,tsx}"],
		exclude: ["node_modules", ".next"],
	},
	resolve: {
		alias: {
			"@": path.resolve(__dirname, "./"),
		},
	},
});
