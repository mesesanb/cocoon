import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { ReviewCard } from "./review-card";

const baseReview = {
	id: "rev-1",
	stayId: "stay-1",
	userId: "user-1",
	coupleName: "Kai and Luna",
	rating: 5,
	text: "We had an amazing time in the forest.",
	date: "2026-03-05",
	resonanceScore: 98,
};

describe("ReviewCard", () => {
	it("renders couple name and date", () => {
		render(<ReviewCard review={baseReview} />);
		expect(screen.getByText("Kai and Luna")).toBeInTheDocument();
		expect(screen.getByText(/Mar 5, 2026/)).toBeInTheDocument();
	});

	it("renders review text in quotes", () => {
		render(<ReviewCard review={baseReview} />);
		expect(
			screen.getByText(/We had an amazing time in the forest./),
		).toBeInTheDocument();
	});

	it("renders resonance score", () => {
		render(<ReviewCard review={baseReview} />);
		expect(screen.getByText("98")).toBeInTheDocument();
	});

	it("shows fallback name when coupleName is empty", () => {
		render(<ReviewCard review={{ ...baseReview, coupleName: "" }} />);
		expect(screen.getByText("Cocoon couple")).toBeInTheDocument();
	});

	it("shows fallback name when coupleName is whitespace", () => {
		render(<ReviewCard review={{ ...baseReview, coupleName: "   " }} />);
		expect(screen.getByText("Cocoon couple")).toBeInTheDocument();
	});
});
