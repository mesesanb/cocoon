import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { ReviewForm } from "./stay-detail-client";

const defaultProps = {
	onSubmit: vi.fn(),
	isSubmitting: false,
	defaultCoupleName: "Kai and Luna",
	userId: "user-1",
	errorMessage: undefined as string | undefined,
};

function renderForm(overrides: Partial<typeof defaultProps> = {}) {
	const props = { ...defaultProps, ...overrides };
	return render(<ReviewForm {...props} />);
}

describe("ReviewForm UI validation", () => {
	it("shows an error when the review text is empty", () => {
		const onSubmit = vi.fn();
		renderForm({ onSubmit });

		const button = screen.getByRole("button", { name: /share review/i });
		fireEvent.click(button);

		expect(onSubmit).not.toHaveBeenCalled();
		expect(
			screen.getByText("Please share a few words about your resonance."),
		).toBeInTheDocument();
	});

	it("shows an error when the review text is shorter than 10 characters", () => {
		const onSubmit = vi.fn();
		renderForm({ onSubmit });

		const textarea = screen.getByPlaceholderText("Share your resonance...");
		fireEvent.change(textarea, { target: { value: "too short" } });

		const button = screen.getByRole("button", { name: /share review/i });
		fireEvent.click(button);

		expect(onSubmit).not.toHaveBeenCalled();
		expect(
			screen.getByText("Please write at least 10 characters."),
		).toBeInTheDocument();
	});

	it("calls onSubmit with trimmed values when the form is valid", () => {
		const onSubmit = vi.fn();
		renderForm({ onSubmit, defaultCoupleName: "  Kai and Luna  " });

		const textarea = screen.getByPlaceholderText("Share your resonance...");
		fireEvent.change(textarea, {
			target: { value: "  This is a valid review.  " },
		});

		const button = screen.getByRole("button", { name: /share review/i });
		fireEvent.click(button);

		expect(onSubmit).toHaveBeenCalledTimes(1);
		expect(onSubmit).toHaveBeenCalledWith({
			userId: "user-1",
			coupleName: "Kai and Luna",
			rating: 5,
			text: "This is a valid review.",
		});
	});

	it("shows server-side error message when provided", () => {
		renderForm({ errorMessage: "text must be at least 10 characters" });

		expect(
			screen.getByText("text must be at least 10 characters"),
		).toBeInTheDocument();
	});
});
<<<<<<< HEAD
=======

>>>>>>> main
