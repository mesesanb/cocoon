"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { addDays, format, parseISO, startOfDay } from "date-fns";
import { AnimatePresence, motion } from "framer-motion";
import { AlertCircle, Check, Loader2, X } from "lucide-react";
import { useEffect, useId, useState } from "react";
import { Calendar } from "@/components/ui/calendar";
import {
	Popover,
	PopoverContent,
	PopoverTrigger,
} from "@/components/ui/popover";
import {
	Tooltip,
	TooltipContent,
	TooltipTrigger,
} from "@/components/ui/tooltip";
import { logger } from "@/lib/logger";
import type { AvailabilityResponse, Booking, Stay } from "@/types";
import { calculateNights } from "@/utils/dates";
import { formatPrice } from "@/utils/price";
import { useAuth } from "./auth-context";

interface BookingFormProps {
	stay: Stay;
	onClose: () => void;
}

interface BookingErrorResponse {
	error: string;
	conflictDates?: Array<{ checkIn: string; checkOut: string }>;
	message?: string;
}

export function BookingForm({ stay, onClose }: BookingFormProps) {
	const baseId = useId();
	const { user } = useAuth();
	const [coupleName, setCoupleName] = useState("");
	const [checkIn, setCheckIn] = useState("");
	const [checkOut, setCheckOut] = useState("");
	const [step, setStep] = useState<"form" | "processing" | "confirmed">("form");
	const [booking, setBooking] = useState<Booking | null>(null);
	const [bookingError, setBookingError] = useState<BookingErrorResponse | null>(
		null,
	);
	const [checkInOpen, setCheckInOpen] = useState(false);
	const [checkOutOpen, setCheckOutOpen] = useState(false);
	const queryClient = useQueryClient();
	const userId = user?.userId;

	useEffect(() => {
		if (user?.coupleName) {
			setCoupleName(user.coupleName);
		}
	}, [user]);

	const nights = checkIn && checkOut ? calculateNights(checkIn, checkOut) : 0;
	const totalPrice = nights * stay.pricePerNight;

	// Fetch all bookings for this stay to show disabled dates
	const { data: allBookings } = useQuery<Booking[]>({
		queryKey: ["stay-bookings", stay.id],
		queryFn: async () => {
			const res = await fetch(`/api/bookings?stayId=${stay.id}`);
			if (!res.ok) return [];
			const data = await res.json();
			// Filter to only confirmed/pending bookings for this stay
			return Array.isArray(data)
				? data.filter(
						(b) =>
							b.stayId === stay.id &&
							(b.status === "confirmed" || b.status === "pending"),
					)
				: [];
		},
		retry: 1,
		retryDelay: 500,
	});

	// Calculate booked dates set for disabled calendar dates
	const bookedDates = new Set<string>();
	if (allBookings) {
		for (const booking of allBookings) {
			const current = new Date(booking.checkIn);
			const end = new Date(booking.checkOut);
			while (current < end) {
				bookedDates.add(format(current, "yyyy-MM-dd"));
				current.setDate(current.getDate() + 1);
			}
		}
	}

	// Check availability when dates change
	const { data: availability, isLoading: checkingAvailability } =
		useQuery<AvailabilityResponse>({
			queryKey: ["availability", stay.id, checkIn, checkOut],
			queryFn: async () => {
				const params = new URLSearchParams({
					checkIn,
					checkOut,
				});
				const res = await fetch(`/api/stays/${stay.id}/availability?${params}`);
				return res.json();
			},
			enabled: !!checkIn && !!checkOut && nights > 0,
		});

	const bookingMutation = useMutation({
		mutationFn: async () => {
			await new Promise((resolve) => setTimeout(resolve, 2000));
			const res = await fetch("/api/bookings", {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({
					stayId: stay.id,
					userId,
					checkIn,
					checkOut,
					guests: 2,
				}),
			});
			if (!res.ok) {
				const errorData = await res.json().catch(() => ({}));
				logger.error("Booking submission failed", {
					status: res.status,
					userId,
					stayId: stay.id,
					error: errorData,
				});
				throw { status: res.status, data: errorData };
			}
			return res.json();
		},
		onMutate: () => {
			setStep("processing");
			setBookingError(null);
		},
		onSuccess: (data: Booking) => {
			setBooking(data);
			setStep("confirmed");
			queryClient.invalidateQueries({ queryKey: ["bookings"] });
			queryClient.invalidateQueries({ queryKey: ["availability", stay.id] });
			queryClient.invalidateQueries({ queryKey: ["stay-bookings", stay.id] });
		},
		onError: (error: unknown) => {
			const err = error as { status: number; data: BookingErrorResponse };
			logger.error("Booking mutation error", {
				status: err.status,
				error: err.data,
			});
			setBookingError(
				err.data || { error: "Booking failed. Please try again." },
			);
			setStep("form");
		},
	});

	const handleSubmit = (e: React.FormEvent) => {
		e.preventDefault();

		if (!coupleName.trim() || !checkIn || !checkOut || nights <= 0) return;
		if (!availability?.available) return;

		bookingMutation.mutate();
	};

	const canBook =
		nights > 0 && availability?.available && !checkingAvailability;

	const hasBookingError = bookingError && bookingMutation.isError;
	const hasConflictError =
		bookingError?.conflictDates && bookingError.conflictDates.length > 0;

	return (
		<div className="flex flex-col gap-4">
			<div className="flex items-center justify-between">
				<h3 className="text-foreground text-xs font-semibold tracking-wider uppercase">
					Reserve Your Stay
				</h3>
				<Tooltip>
					<TooltipTrigger asChild>
						<button
							type="button"
							onClick={onClose}
							className="glass-button rounded-full p-1.5 cursor-pointer"
							aria-label="Close booking form"
						>
							<X className="h-3.5 w-3.5 text-muted-foreground" />
						</button>
					</TooltipTrigger>
					<TooltipContent side="bottom">Close</TooltipContent>
				</Tooltip>
			</div>

			<AnimatePresence mode="wait">
				{step === "form" && (
					<motion.form
						key="form"
						initial={{ opacity: 0 }}
						animate={{ opacity: 1 }}
						exit={{ opacity: 0 }}
						onSubmit={handleSubmit}
						className="flex flex-col gap-3"
					>
						<input
							type="text"
							value={coupleName}
							onChange={(e) => setCoupleName(e.target.value)}
							placeholder="Couple name"
							className="glass-input rounded-xl px-3.5 py-2.5 text-foreground text-sm placeholder:text-muted-foreground/40 outline-none"
							required
						/>
						<div className="flex gap-2">
							<div className="flex-1">
								<label
									htmlFor={`${baseId}-checkin`}
									className="text-muted-foreground/50 text-[10px] tracking-[0.1em] uppercase block mb-1"
								>
									Check in
								</label>
								<Popover open={checkInOpen} onOpenChange={setCheckInOpen}>
									<PopoverTrigger asChild>
										<button
											id={`${baseId}-checkin`}
											type="button"
											className="w-full glass-input rounded-xl px-3 py-2 text-foreground text-sm text-left font-normal border border-border h-[2.5rem]"
										>
											{checkIn
												? format(parseISO(checkIn), "MMM d, yyyy")
												: "dd.mm.yyyy"}
										</button>
									</PopoverTrigger>
									<PopoverContent
										className="glass-popover rounded-xl p-0 border-0 w-auto"
										align="start"
										sideOffset={6}
									>
										<Calendar
											mode="single"
											captionLayout="dropdown"
											selected={checkIn ? parseISO(checkIn) : undefined}
											onSelect={(date) => {
												setCheckIn(date ? format(date, "yyyy-MM-dd") : "");
												setCheckInOpen(false);
											}}
											disabled={(date) => {
												if (date < startOfDay(new Date())) return true;
												const dateStr = format(date, "yyyy-MM-dd");
												// Disable nights that are already booked
												return bookedDates.has(dateStr);
											}}
											fromYear={new Date().getFullYear()}
											toYear={new Date().getFullYear() + 2}
											className="rounded-xl [--cell-size:2.25rem] border-0 bg-transparent p-3 text-foreground [&_[data-selected-single=true]]:bg-sage-deep [&_[data-selected-single=true]]:text-primary-foreground"
											classNames={{
												button_previous:
													"text-foreground hover:bg-sage/20 hover:text-foreground",
												button_next:
													"text-foreground hover:bg-sage/20 hover:text-foreground",
												dropdown_root:
													"border-border bg-transparent text-foreground rounded-md",
												caption_label: "text-foreground",
											}}
										/>
									</PopoverContent>
								</Popover>
							</div>
							<div className="flex-1">
								<label
									htmlFor={`${baseId}-checkout`}
									className="text-muted-foreground/50 text-[10px] tracking-[0.1em] uppercase block mb-1"
								>
									Check out
								</label>
								<Popover open={checkOutOpen} onOpenChange={setCheckOutOpen}>
									<PopoverTrigger asChild>
										<button
											id={`${baseId}-checkout`}
											type="button"
											className="w-full glass-input rounded-xl px-3 py-2 text-foreground text-sm text-left font-normal border border-border h-[2.5rem]"
										>
											{checkOut
												? format(parseISO(checkOut), "MMM d, yyyy")
												: "dd.mm.yyyy"}
										</button>
									</PopoverTrigger>
									<PopoverContent
										className="glass-popover rounded-xl p-0 border-0 w-auto"
										align="start"
										sideOffset={6}
									>
										<Calendar
											mode="single"
											captionLayout="dropdown"
											selected={checkOut ? parseISO(checkOut) : undefined}
											onSelect={(date) => {
												setCheckOut(date ? format(date, "yyyy-MM-dd") : "");
												setCheckOutOpen(false);
											}}
											disabled={(date) => {
												// Check-out must be after check-in
												const min = checkIn
													? addDays(startOfDay(parseISO(checkIn)), 1)
													: startOfDay(new Date());
												if (date < min) return true;
												const dateStr = format(date, "yyyy-MM-dd");
												// Disable nights that are already booked
												return bookedDates.has(dateStr);
											}}
											fromYear={new Date().getFullYear()}
											toYear={new Date().getFullYear() + 2}
											className="rounded-xl [--cell-size:2.25rem] border-0 bg-transparent p-3 text-foreground [&_[data-selected-single=true]]:bg-sage-deep [&_[data-selected-single=true]]:text-primary-foreground"
											classNames={{
												button_previous:
													"text-foreground hover:bg-sage/20 hover:text-foreground",
												button_next:
													"text-foreground hover:bg-sage/20 hover:text-foreground",
												dropdown_root:
													"border-border bg-transparent text-foreground rounded-md",
												caption_label: "text-foreground",
											}}
										/>
									</PopoverContent>
								</Popover>
							</div>
						</div>

						{/* Show unavailable date ranges */}
						{allBookings && allBookings.length > 0 && (
							<motion.div
								initial={{ opacity: 0, height: 0 }}
								animate={{ opacity: 1, height: "auto" }}
								className="text-muted-foreground text-xs space-y-1 bg-muted/30 rounded-lg px-3 py-2"
							>
								<p className="font-medium text-foreground/70">
									Unavailable dates:
								</p>
								<div className="flex flex-col gap-1">
									{allBookings.map((booking) => (
										<span
											key={`${booking.confirmationId}`}
											className="text-[10px]"
										>
											{format(parseISO(booking.checkIn), "MMM d")} –{" "}
											{format(parseISO(booking.checkOut), "MMM d, yyyy")}
										</span>
									))}
								</div>
							</motion.div>
						)}

						{/* Availability status */}
						{nights > 0 && (
							<motion.div
								initial={{ opacity: 0, height: 0 }}
								animate={{ opacity: 1, height: "auto" }}
								className="flex flex-col gap-2"
							>
								{checkingAvailability ? (
									<div className="flex items-center gap-2 text-muted-foreground text-xs">
										<Loader2 className="h-3 w-3 animate-spin" />
										Checking availability...
									</div>
								) : availability && !availability.available ? (
									<div className="flex items-center gap-2 text-red-500/80 text-xs bg-red-500/10 rounded-lg px-3 py-2">
										<AlertCircle className="h-3.5 w-3.5 shrink-0" />
										{availability.conflictMessage ||
											"Not available for these dates"}
									</div>
								) : availability?.available ? (
									<div className="flex items-center gap-2 text-sage-deep text-xs">
										<Check className="h-3 w-3" />
										Available
									</div>
								) : null}

								{hasBookingError && (
									<div className="flex items-start gap-2 text-red-600/90 text-xs bg-red-500/10 border border-red-500/20 rounded-lg px-3 py-2 flex-col gap-2">
										<div className="flex items-start gap-2">
											<AlertCircle className="h-3.5 w-3.5 shrink-0 mt-0.5" />
											<div className="flex-1">
												<p className="font-medium">
													{bookingError.message ||
														bookingError.error ||
														"Booking failed. Please try again."}
												</p>
											</div>
										</div>
										{hasConflictError && (
											<div className="text-[10px] text-red-500/70 bg-red-500/5 rounded px-2 py-1 ml-5">
												<p className="font-medium mb-1">Conflicting dates:</p>
												{bookingError.conflictDates?.map((conflict) => (
													<p key={`${conflict.checkIn}-${conflict.checkOut}`}>
														{format(parseISO(conflict.checkIn), "MMM d")} –{" "}
														{format(parseISO(conflict.checkOut), "MMM d")}
													</p>
												))}
											</div>
										)}
									</div>
								)}

								{availability?.available && (
									<div className="border-t border-foreground/5 pt-3 flex flex-col gap-1">
										<div className="flex justify-between text-sm">
											<span className="text-muted-foreground text-xs">
												{formatPrice(stay.pricePerNight, stay.currency)} x{" "}
												{nights} nights
											</span>
											<span className="text-foreground font-semibold text-xs">
												{formatPrice(totalPrice, stay.currency)}
											</span>
										</div>
									</div>
								)}
							</motion.div>
						)}

						<button
							type="submit"
							disabled={!canBook}
							className="w-full bg-sage-deep text-primary-foreground py-3 rounded-2xl text-[11px] font-semibold tracking-[0.1em] uppercase hover:bg-sage-deep/90 transition-all disabled:opacity-30 disabled:cursor-not-allowed mt-1 shadow-sm"
						>
							Pay with {stay.currency}
						</button>
					</motion.form>
				)}

				{step === "processing" && (
					<motion.div
						key="processing"
						initial={{ opacity: 0 }}
						animate={{ opacity: 1 }}
						exit={{ opacity: 0 }}
						className="flex flex-col items-center gap-4 py-8"
					>
						<Loader2 className="h-6 w-6 text-sage-deep animate-spin" />
						<div className="text-center">
							<p className="text-foreground text-xs font-medium">
								Processing {stay.currency} payment...
							</p>
							<p className="text-muted-foreground/50 text-[10px] mt-1">
								Confirming on-chain
							</p>
						</div>
					</motion.div>
				)}

				{step === "confirmed" && booking && (
					<motion.div
						key="confirmed"
						initial={{ opacity: 0, scale: 0.97 }}
						animate={{ opacity: 1, scale: 1 }}
						className="flex flex-col items-center gap-4 py-6"
					>
						<div className="h-10 w-10 rounded-full bg-sage-deep/15 flex items-center justify-center">
							<Check className="h-5 w-5 text-sage-deep" />
						</div>
						<div className="text-center">
							<p className="text-foreground text-xs font-medium">
								Retreat Reserved
							</p>
							<p className="text-muted-foreground/50 text-[10px] mt-1">
								{booking.confirmationId}
							</p>
							<p className="text-foreground text-xs mt-2">
								{formatPrice(booking.totalPrice, booking.currency)}
							</p>
						</div>
						<a
							href="/our-cocoon"
							className="glass-button rounded-full px-5 py-2 text-sage-deep text-[10px] font-semibold tracking-[0.1em] uppercase"
						>
							View in Our Cocoon
						</a>
					</motion.div>
				)}
			</AnimatePresence>
		</div>
	);
}
