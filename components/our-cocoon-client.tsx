"use client";

import { useQuery } from "@tanstack/react-query";
import { motion } from "framer-motion";
import {
	ArrowLeft,
	Calendar,
	Heart,
	LogIn,
	LogOut,
	MapPin,
	Star,
} from "lucide-react";
import dynamic from "next/dynamic";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useMemo, useState } from "react";
import {
	Tooltip,
	TooltipContent,
	TooltipTrigger,
} from "@/components/ui/tooltip";
import type { Booking, Review, Stay } from "@/types";
import { useAuth } from "./auth-context";
import { AuthModal } from "./auth-modal";
import { CocoonFooter } from "./cocoon-footer";
import { StayCard } from "./stay-card";

const BookingsMap = dynamic(
	() => import("./bookings-map").then((m) => m.BookingsMap),
	{
		ssr: false,
	},
);

export function OurCocoonClient() {
	const router = useRouter();
	const { user, signOut } = useAuth();
	const [showAuthModal, setShowAuthModal] = useState(false);

	const userId = user?.userId;
	const coupleName = user?.coupleName || "Guest";

	const { data: bookings = [] } = useQuery<Booking[], Error>({
		queryKey: ["bookings", userId],
		queryFn: async () => {
			const res = await fetch(
				`/api/bookings?userId=${encodeURIComponent(userId || "")}`,
			);
			if (!res.ok) throw new Error(`Failed to fetch bookings: ${res.status}`);
			return res.json();
		},
		enabled: !!userId,
		retry: 2,
		retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
	});

	const { data: stays = [] } = useQuery<Stay[], Error>({
		queryKey: ["stays"],
		queryFn: async () => {
			const res = await fetch("/api/stays");
			if (!res.ok) throw new Error(`Failed to fetch stays: ${res.status}`);
			return res.json();
		},
		retry: 2,
		retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
	});

	const { data: allReviews = [] } = useQuery<Review[], Error>({
		queryKey: ["all-reviews"],
		queryFn: async () => {
			const res = await fetch("/api/reviews");
			if (!res.ok) throw new Error(`Failed to fetch reviews: ${res.status}`);
			return res.json();
		},
		retry: 2,
		retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
	});

	const now = new Date().toISOString().split("T")[0];

	// Filter user's reviews - use userId for verification
	const userReviews = allReviews.filter((r) => r.userId === userId);

	const pastBookings = bookings
		.filter((b) => b.userId === userId && b.checkOut < now)
		.sort((a, b) => b.checkOut.localeCompare(a.checkOut));

	const upcomingBookings = bookings
		.filter(
			(b) =>
				b.userId === userId && b.checkIn >= now && b.status === "confirmed",
		)
		.sort((a, b) => a.checkIn.localeCompare(b.checkIn));

	const getStay = (stayId: string) => stays.find((s) => s.id === stayId);

	// Pins for past bookings map (unique stays by coordinates)
	const bookingMapPins = useMemo(() => {
		const seen = new Set<string>();
		return pastBookings
			.map((b) => {
				const stay = stays.find((s) => s.id === b.stayId);
				if (!stay?.coordinates) return null;
				const key = `${stay.coordinates.lat},${stay.coordinates.lng}`;
				if (seen.has(key)) return null;
				seen.add(key);
				return {
					lat: stay.coordinates.lat,
					lng: stay.coordinates.lng,
					label: stay.location,
					stayName: stay.name,
				};
			})
			.filter(Boolean) as {
			lat: number;
			lng: number;
			label: string;
			stayName?: string;
		}[];
	}, [pastBookings, stays]);

	// Calculate journey stats
	const totalNights = pastBookings.reduce((acc, b) => {
		const checkIn = new Date(b.checkIn);
		const checkOut = new Date(b.checkOut);
		return (
			acc +
			Math.ceil(
				(checkOut.getTime() - checkIn.getTime()) / (1000 * 60 * 60 * 24),
			)
		);
	}, 0);

	const uniqueDestinations = new Set(
		pastBookings.map((b) => getStay(b.stayId)?.scenario),
	).size;

	return (
		<div className="min-h-screen bg-linen">
			{/* Background */}
			<div className="fixed inset-0 -z-10 relative">
				<Image
					src="/images/hero.jpg"
					alt=""
					fill
					className="object-cover"
					priority
				/>
				<div className="absolute inset-0 backdrop-blur-3xl bg-[#F5F2EE]/80" />
			</div>

			{/* Navigation */}
			<header className="sticky top-0 z-30 glass-header">
				<div className="mx-auto max-w-7xl flex items-center justify-between px-6 py-4">
					<div className="flex items-center gap-3">
						<Tooltip>
							<TooltipTrigger asChild>
								<button
									type="button"
									onClick={() => router.back()}
									className="glass-button rounded-full p-2 cursor-pointer"
									aria-label="Go back"
								>
									<ArrowLeft className="h-4 w-4 text-foreground" />
								</button>
							</TooltipTrigger>
							<TooltipContent side="bottom">Back</TooltipContent>
						</Tooltip>
						<Tooltip>
							<TooltipTrigger asChild>
								<Link
									href="/"
									className="text-foreground text-base font-medium tracking-[-0.02em] hover:text-sage-deep transition-colors cursor-pointer"
								>
									cocoon
								</Link>
							</TooltipTrigger>
							<TooltipContent side="bottom">Home</TooltipContent>
						</Tooltip>
					</div>
					<nav className="flex items-center gap-1" aria-label="Main navigation">
						{user ? (
							<Tooltip>
								<TooltipTrigger asChild>
									<button
										type="button"
										onClick={signOut}
										className="glass-button rounded-full px-4 py-2 text-foreground text-xs tracking-wider flex items-center gap-1.5 cursor-pointer"
									>
										<LogOut className="h-3 w-3" />
										Sign Out
									</button>
								</TooltipTrigger>
								<TooltipContent side="bottom">Sign out</TooltipContent>
							</Tooltip>
						) : (
							<Tooltip>
								<TooltipTrigger asChild>
									<button
										type="button"
										onClick={() => setShowAuthModal(true)}
										className="glass-button rounded-full px-4 py-2 text-foreground text-xs tracking-wider flex items-center gap-1.5 cursor-pointer"
									>
										<LogIn className="h-3 w-3" />
										Sign In
									</button>
								</TooltipTrigger>
								<TooltipContent side="bottom">Sign in</TooltipContent>
							</Tooltip>
						)}
					</nav>
				</div>
			</header>

			<main className="relative z-10 mx-auto max-w-7xl px-6 py-10 md:py-14">
				<motion.div
					initial={{ opacity: 0, y: 12 }}
					animate={{ opacity: 1, y: 0 }}
					className="mb-14"
				>
					<h1 className="text-foreground text-3xl md:text-5xl font-light tracking-[-0.03em] text-balance">
						{coupleName}&apos;s <span className="font-medium">Cocoon</span>
					</h1>
					<p className="text-muted-foreground text-sm mt-2">
						Our journey through solitude, together.
					</p>
				</motion.div>

				{/* Two column layout */}
				<div className="flex flex-col lg:flex-row gap-8">
					{/* Left: Main content */}
					<div className="flex-1 min-w-0">
						{/* Upcoming */}
						<section className="mb-14">
							<motion.h2
								initial={{ opacity: 0 }}
								animate={{ opacity: 1 }}
								transition={{ delay: 0.2 }}
								className="text-foreground text-sm font-semibold tracking-wider uppercase mb-6"
							>
								Upcoming Moments
							</motion.h2>
							{upcomingBookings.length === 0 ? (
								<motion.div
									initial={{ opacity: 0 }}
									animate={{ opacity: 1 }}
									transition={{ delay: 0.3 }}
									className="glass rounded-2xl p-10 text-center"
								>
									<p className="text-muted-foreground text-sm">
										No upcoming retreats. Your next chapter awaits.
									</p>
									<a
										href="/"
										className="inline-block mt-4 glass-button rounded-full px-5 py-2 text-sage-deep text-[10px] font-semibold tracking-[0.1em] uppercase"
									>
										Discover Retreats
									</a>
								</motion.div>
							) : (
								<div className="grid grid-cols-1 md:grid-cols-2 gap-5">
									{upcomingBookings.map((booking, i) => {
										const stay = getStay(booking.stayId);
										if (!stay) return null;
										return (
											<StayCard
												key={booking.confirmationId}
												stay={stay}
												mode="upcoming"
												booking={booking}
												index={i}
											/>
										);
									})}
								</div>
							)}
						</section>

						{/* Past */}
						<section>
							<motion.h2
								initial={{ opacity: 0 }}
								animate={{ opacity: 1 }}
								transition={{ delay: 0.4 }}
								className="text-foreground text-sm font-semibold tracking-wider uppercase mb-6"
							>
								Past Echoes
							</motion.h2>
							{pastBookings.length === 0 ? (
								<motion.div
									initial={{ opacity: 0 }}
									animate={{ opacity: 1 }}
									transition={{ delay: 0.5 }}
									className="glass rounded-2xl p-10 text-center"
								>
									<p className="text-muted-foreground text-sm">
										No echoes yet. Your first memory is waiting to be made.
									</p>
								</motion.div>
							) : (
								<div className="grid grid-cols-1 md:grid-cols-2 gap-5">
									{pastBookings.map((booking, i) => {
										const stay = getStay(booking.stayId);
										if (!stay) return null;
										return (
											<StayCard
												key={booking.confirmationId}
												stay={stay}
												mode="history"
												booking={booking}
												index={i}
											/>
										);
									})}
								</div>
							)}
						</section>
					</div>

					{/* Right: Sidebar */}
					<motion.aside
						initial={{ opacity: 0, x: 20 }}
						animate={{ opacity: 1, x: 0 }}
						transition={{ delay: 0.3 }}
						className="w-full lg:w-80 flex-shrink-0 space-y-6"
					>
						{/* Journey Stats */}
						<div className="glass rounded-2xl p-6">
							<h3 className="text-foreground text-xs font-semibold tracking-wider uppercase mb-5">
								Our Journey
							</h3>
							<div className="grid grid-cols-3 gap-4">
								<div className="text-center">
									<div className="flex items-center justify-center w-10 h-10 rounded-full bg-sage/10 mx-auto mb-2">
										<Calendar className="h-4 w-4 text-sage-deep" />
									</div>
									<p className="text-foreground text-xl font-medium">
										{totalNights}
									</p>
									<p className="text-muted-foreground text-[10px] tracking-wide uppercase">
										Nights
									</p>
								</div>
								<div className="text-center">
									<div className="flex items-center justify-center w-10 h-10 rounded-full bg-sage/10 mx-auto mb-2">
										<MapPin className="h-4 w-4 text-sage-deep" />
									</div>
									<p className="text-foreground text-xl font-medium">
										{uniqueDestinations}
									</p>
									<p className="text-muted-foreground text-[10px] tracking-wide uppercase">
										Landscapes
									</p>
								</div>
								<div className="text-center">
									<div className="flex items-center justify-center w-10 h-10 rounded-full bg-sage/10 mx-auto mb-2">
										<Heart className="h-4 w-4 text-sage-deep" />
									</div>
									<p className="text-foreground text-xl font-medium">
										{userReviews.length}
									</p>
									<p className="text-muted-foreground text-[10px] tracking-wide uppercase">
										Resonances
									</p>
								</div>
							</div>
						</div>
						{/* Map: past booking locations */}
						<div className="glass rounded-2xl p-4">
							<h3 className="text-foreground text-xs font-semibold tracking-wider uppercase mb-4">
								Our Landscapes
							</h3>
							<BookingsMap pins={bookingMapPins} className="w-full" />
						</div>

						{/* User Reviews */}
						<div className="glass rounded-2xl p-6">
							<h3 className="text-foreground text-xs font-semibold tracking-wider uppercase mb-5">
								Our Resonances
							</h3>
							{userReviews.length === 0 ? (
								<p className="text-muted-foreground text-sm text-center py-4">
									Share your first resonance after a stay.
								</p>
							) : (
								<div className="space-y-4">
									{userReviews.map((review) => {
										const stay = getStay(review.stayId);
										return (
											<div
												key={review.id}
												className="border-b border-soft-charcoal/5 pb-4 last:border-0 last:pb-0"
											>
												<div className="flex items-center gap-2 mb-2">
													<div className="flex gap-0.5">
														{[1, 2, 3, 4, 5].map((star) => (
															<Star
																key={star}
																className={`h-3 w-3 ${star <= review.rating ? "text-sage-deep fill-sage-deep" : "text-soft-charcoal/20"}`}
															/>
														))}
													</div>
													<span className="text-muted-foreground text-[10px]">
														{new Date(review.date).toLocaleDateString("en-US", {
															month: "short",
															year: "numeric",
														})}
													</span>
												</div>
												<p className="text-foreground text-xs leading-relaxed line-clamp-3 mb-2">
													&ldquo;{review.text}&rdquo;
												</p>
												{stay && (
													<Link
														href={`/stay/${stay.id}`}
														className="text-sage-deep text-[10px] font-medium tracking-wide hover:underline"
													>
														{stay.name}
													</Link>
												)}
											</div>
										);
									})}
								</div>
							)}
						</div>

						{/* Discover CTA */}
						<div className="glass rounded-2xl p-6 text-center">
							<p className="text-muted-foreground text-xs mb-4">
								Ready for your next chapter?
							</p>
							<Link
								href="/"
								className="inline-block w-full bg-sage-deep text-primary-foreground py-3 rounded-xl text-[10px] font-semibold tracking-[0.1em] uppercase hover:bg-sage-deep/90 transition-all"
							>
								Discover Retreats
							</Link>
						</div>
					</motion.aside>
				</div>
			</main>

			<CocoonFooter />
			<AuthModal
				isOpen={showAuthModal}
				onClose={() => setShowAuthModal(false)}
			/>
		</div>
	);
}
