"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { AnimatePresence, motion } from "framer-motion";
import {
	ArrowLeft,
	Calendar,
	Check,
	ChevronRight,
	Link as LinkIcon,
	LogIn,
	LogOut,
	MapPin,
	Share2,
	Star,
	Users,
} from "lucide-react";
import dynamic from "next/dynamic";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import {
	Tooltip,
	TooltipContent,
	TooltipTrigger,
} from "@/components/ui/tooltip";
import { logger } from "@/lib/logger";
import type { Review, Stay } from "@/types";
import { buildImageUrl, buildVideoUrl } from "@/utils/media";
import { formatPrice } from "@/utils/price";
import { useAuth } from "./auth-context";
import { AuthModal } from "./auth-modal";
import { BookingForm } from "./booking-form";
import { CocoonFooter } from "./cocoon-footer";
import { ReviewCard } from "./review-card";

const StayMap = dynamic(() => import("./stay-map").then((m) => m.StayMap), {
	ssr: false,
	loading: () => (
		<div className="w-full aspect-[2/1] md:aspect-[2.5/1] rounded-2xl bg-muted/30 animate-pulse flex items-center justify-center text-muted-foreground text-sm">
			Loading map…
		</div>
	),
});

interface StayDetailClientProps {
	stayId: string;
}

export function StayDetailClient({ stayId }: StayDetailClientProps) {
	const router = useRouter();
	const { user, signOut } = useAuth();
	const [showAuthModal, setShowAuthModal] = useState(false);
	const [showBooking, setShowBooking] = useState(false);
	const [activeImage, setActiveImage] = useState(0);
	const [showShareMenu, setShowShareMenu] = useState(false);
	const [copied, setCopied] = useState(false);
	const queryClient = useQueryClient();

	const {
		data: stay,
		isLoading,
		error: stayError,
	} = useQuery<Stay, Error>({
		queryKey: ["stay", stayId],
		queryFn: async () => {
			const res = await fetch(`/api/stays/${stayId}`);
			if (!res.ok) {
				const error = new Error("Stay not found") as Error & {
					status?: number;
				};
				error.status = res.status;
				throw error;
			}
			return res.json();
		},
		retry: 2,
		retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
	});

	const { data: reviewsData } = useQuery<
		{
			reviews: Review[];
			total: number;
		},
		Error
	>({
		queryKey: ["reviews", stayId],
		queryFn: async () => {
			const res = await fetch(`/api/stays/${stayId}/reviews`);
			if (!res.ok) throw new Error("Failed to fetch reviews");
			return res.json();
		},
		retry: 2,
		retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
	});

	const [reviewError, setReviewError] = useState<string | null>(null);

	const addReviewMutation = useMutation<
		Review,
		Error,
		{
			userId: string;
			coupleName: string;
			rating: number;
			text: string;
		}
	>({
		mutationFn: async (review) => {
			const res = await fetch(`/api/stays/${stayId}/reviews`, {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify(review),
			});
			if (!res.ok) {
				const error = await res.json().catch(() => ({}));
				const message =
					(error && (error.error || error.message)) ||
					`Failed: ${res.status}`;
				logger.error("Review submission failed", {
					stayId,
					status: res.status,
					error,
				});
				throw new Error(message);
			}
			return res.json();
		},
		onSuccess: () => {
			setReviewError(null);
			// Refetch reviews so the newly added review appears immediately
			queryClient.invalidateQueries({ queryKey: ["reviews", stayId] });
		},
		onError: (error: Error) => {
			logger.error("Review mutation error", { error: error.message });
			setReviewError(error.message || "Review failed. Please try again.");
		},
	});

	const handleShare = async (platform: "twitter" | "facebook" | "copy") => {
		if (!stay) return;

		if (typeof window === "undefined") {
			return;
		}

		const url = window.location.href;
		const text = `Discover ${stay.name} on Cocoon - ${stay.tagline}`;

		if (platform === "twitter") {
			window.open(
				`https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(url)}`,
				"_blank",
			);
		} else if (platform === "facebook") {
			window.open(
				`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`,
				"_blank",
			);
		} else if (platform === "copy") {
			await navigator.clipboard.writeText(url);
			setCopied(true);
			setTimeout(() => setCopied(false), 2000);
		}

		setShowShareMenu(false);
	};

	// Show 404 error screen
	if (!isLoading && (stayError || !stay)) {
		return (
			<div className="min-h-screen bg-linen flex items-center justify-center px-4">
				<motion.div
					initial={{ opacity: 0, y: 20 }}
					animate={{ opacity: 1, y: 0 }}
					className="text-center max-w-md"
				>
					<div className="mb-8">
						<motion.h1
							initial={{ opacity: 0 }}
							animate={{ opacity: 1 }}
							transition={{ delay: 0.1 }}
							className="text-6xl md:text-7xl font-bold text-muted-foreground/30 mb-4"
						>
							404
						</motion.h1>
						<motion.p
							initial={{ opacity: 0 }}
							animate={{ opacity: 1 }}
							transition={{ delay: 0.2 }}
							className="text-foreground text-xl md:text-2xl font-semibold mb-2"
						>
							Retreat Not Found
						</motion.p>
						<motion.p
							initial={{ opacity: 0 }}
							animate={{ opacity: 1 }}
							transition={{ delay: 0.3 }}
							className="text-muted-foreground text-sm md:text-base mb-8"
						>
							The retreat you're looking for doesn't exist or has been removed.
						</motion.p>
					</div>

					<motion.div
						initial={{ opacity: 0, y: 10 }}
						animate={{ opacity: 1, y: 0 }}
						transition={{ delay: 0.4 }}
						className="flex flex-col gap-3 sm:flex-row justify-center"
					>
						<button
							type="button"
							onClick={() => router.push("/")}
							className="glass-button rounded-2xl px-6 py-3 text-foreground text-sm font-medium tracking-wide hover:bg-foreground/5 transition-all cursor-pointer"
						>
							Browse All Retreats
						</button>
						<button
							type="button"
							onClick={() => router.back()}
							className="bg-sage-deep text-primary-foreground rounded-2xl px-6 py-3 text-sm font-medium tracking-wide hover:bg-sage-deep/90 transition-all cursor-pointer"
						>
							Go Back
						</button>
					</motion.div>
				</motion.div>
			</div>
		);
	}

	if (isLoading || !stay) {
		return (
			<div className="min-h-screen bg-linen flex items-center justify-center">
				<motion.p
					animate={{ opacity: [0.3, 1, 0.3] }}
					transition={{ repeat: Infinity, duration: 1.5 }}
					className="text-muted-foreground text-xs tracking-[0.2em] uppercase"
				>
					Unveiling retreat...
				</motion.p>
			</div>
		);
	}

	const reviews: Review[] =
		reviewsData?.reviews.map((review) => {
			// Ensure a visible name for the current user's reviews even if the
			// backend didn't persist coupleName correctly.
			const fallbackName =
				user && review.userId === user.userId ? user.coupleName ?? "" : "";
			return {
				...review,
				coupleName: review.coupleName?.trim()
					? review.coupleName
					: fallbackName,
			};
		}) || [];

	// Build media array: video first (if exists), then images
	const mediaItems: { type: "video" | "image"; src: string }[] = [];
	if (stay.video) {
		mediaItems.push({ type: "video", src: buildVideoUrl(stay.video) });
	}
	stay.images.forEach((img) => {
		mediaItems.push({ type: "image", src: buildImageUrl(img) });
	});

	return (
		<div className="min-h-screen bg-linen">
			{/* Navigation */}
			<header className="sticky top-0 z-30 glass-header">
				<div className="mx-auto max-w-7xl flex items-center justify-between px-4 md:px-6 py-3 md:py-4">
					<div className="flex items-center gap-2 md:gap-3">
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
						<Link
							href="/"
							className="text-foreground text-base font-medium tracking-[-0.02em] hover:text-sage-deep transition-colors cursor-pointer"
						>
							cocoon
						</Link>
					</div>
					<nav className="flex items-center gap-1" aria-label="Main navigation">
						{/* Share button */}
						<div className="relative">
							<Tooltip>
								<TooltipTrigger asChild>
									<button
										type="button"
										onClick={() => setShowShareMenu(!showShareMenu)}
										className="glass-button rounded-full px-3 md:px-4 py-2 text-foreground text-[10px] md:text-xs tracking-wider flex items-center gap-1.5 cursor-pointer"
									>
										<Share2 className="h-3 w-3" />
										<span className="hidden md:inline">Share</span>
									</button>
								</TooltipTrigger>
								<TooltipContent side="bottom">Share this stay</TooltipContent>
							</Tooltip>

							<AnimatePresence>
								{showShareMenu && (
									<motion.div
										initial={{ opacity: 0, y: 8, scale: 0.95 }}
										animate={{ opacity: 1, y: 0, scale: 1 }}
										exit={{ opacity: 0, y: 8, scale: 0.95 }}
										transition={{ duration: 0.15 }}
										className="absolute right-0 top-full mt-2 glass-heavy rounded-xl p-2 min-w-[140px] shadow-lg"
									>
										<button
											type="button"
											onClick={() => handleShare("twitter")}
											className="w-full text-left px-3 py-2 text-xs text-foreground hover:bg-foreground/5 rounded-lg transition-colors cursor-pointer"
										>
											Twitter / X
										</button>
										<button
											type="button"
											onClick={() => handleShare("facebook")}
											className="w-full text-left px-3 py-2 text-xs text-foreground hover:bg-foreground/5 rounded-lg transition-colors cursor-pointer"
										>
											Facebook
										</button>
										<button
											type="button"
											onClick={() => handleShare("copy")}
											className="w-full text-left px-3 py-2 text-xs text-foreground hover:bg-foreground/5 rounded-lg transition-colors flex items-center gap-2 cursor-pointer"
										>
											{copied ? (
												<>
													<Check className="h-3 w-3 text-sage-deep" />
													Copied!
												</>
											) : (
												<>
													<LinkIcon className="h-3 w-3" />
													Copy Link
												</>
											)}
										</button>
									</motion.div>
								)}
							</AnimatePresence>
						</div>

						{user && (
							<Tooltip>
								<TooltipTrigger asChild>
									<Link
										href="/our-cocoon"
										className="glass-button rounded-full px-3 md:px-4 py-2 text-foreground text-[10px] md:text-xs tracking-wider cursor-pointer"
									>
										<span className="hidden md:inline">Our Cocoon</span>
										<span className="md:hidden">Cocoon</span>
									</Link>
								</TooltipTrigger>
								<TooltipContent side="bottom">Our bookings</TooltipContent>
							</Tooltip>
						)}
						{user ? (
							<Tooltip>
								<TooltipTrigger asChild>
									<button
										type="button"
										onClick={signOut}
										className="glass-button rounded-full px-3 md:px-4 py-2 text-foreground text-[10px] md:text-xs tracking-wider flex items-center gap-1.5 cursor-pointer"
									>
										<LogOut className="h-3 w-3" />
										<span className="hidden md:inline">Sign Out</span>
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
										className="glass-button rounded-full px-3 md:px-4 py-2 text-foreground text-[10px] md:text-xs tracking-wider flex items-center gap-1.5 cursor-pointer"
									>
										<LogIn className="h-3 w-3" />
										<span className="hidden md:inline">Sign In</span>
									</button>
								</TooltipTrigger>
								<TooltipContent side="bottom">Sign in</TooltipContent>
							</Tooltip>
						)}
					</nav>
				</div>
			</header>

			<main className="mx-auto max-w-7xl px-4 md:px-6 py-6 md:py-8">
				{/* Split hero: Media left, Glass sidebar right */}
				<div className="flex flex-col lg:flex-row gap-6 md:gap-8">
					{/* Left: Media */}
					<div className="flex-1 min-w-0">
						<div className="relative aspect-[4/3] md:aspect-[16/10] rounded-2xl md:rounded-3xl overflow-hidden bg-soft-charcoal">
							<AnimatePresence mode="wait">
								{mediaItems[activeImage]?.type === "video" ? (
									<motion.video
										key={`video-${activeImage}`}
										src={mediaItems[activeImage].src}
										initial={{ opacity: 0 }}
										animate={{ opacity: 1 }}
										exit={{ opacity: 0 }}
										transition={{ duration: 0.4 }}
										onLoadedMetadata={(e) => {
											e.currentTarget.playbackRate = 0.8;
										}}
										className="absolute inset-0 h-full w-full object-cover scale-[1.04]"
										autoPlay
										muted
										loop
										playsInline
									/>
								) : (
									<motion.div
										key={`image-${activeImage}`}
										initial={{ opacity: 0 }}
										animate={{ opacity: 1 }}
										exit={{ opacity: 0 }}
										transition={{ duration: 0.4 }}
										className="absolute inset-0"
									>
										<Image
											src={mediaItems[activeImage]?.src ?? ""}
											alt={`${stay.name} - Media ${activeImage + 1}`}
											fill
											className="object-cover"
											sizes="(max-width: 768px) 100vw, 80vw"
										/>
									</motion.div>
								)}
							</AnimatePresence>

							{/* Media dots — compact, 2026-style (min 32px tap target) */}
							{mediaItems.length > 1 && (
								<div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex items-center gap-1.5 rounded-full bg-black/20 backdrop-blur-md px-2.5 py-2 border border-white/10">
									{mediaItems.map((item, i) => (
										<button
											type="button"
											key={item.src}
											onClick={() => setActiveImage(i)}
											className="group w-8 h-8 rounded-full flex items-center justify-center transition-all duration-200 ease-out cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#F5F2EE]/80 focus-visible:ring-offset-2 focus-visible:ring-offset-transparent"
											aria-label={
												item.type === "video"
													? "View video"
													: `View image ${i + 1}`
											}
										>
											<span
												className={`block transition-all duration-200 ease-out ${
													i === activeImage
														? "w-3.5 md:w-4 h-1 rounded-full bg-[#F5F2EE]"
														: "w-1.5 h-1.5 rounded-full bg-[#F5F2EE]/50 group-hover:bg-[#F5F2EE]/80"
												}`}
											/>
										</button>
									))}
								</div>
							)}
						</div>

						{/* Description */}
						<motion.div
							initial={{ opacity: 0, y: 12 }}
							animate={{ opacity: 1, y: 0 }}
							transition={{ delay: 0.15 }}
							className="mt-6 md:mt-8"
						>
							<span className="glass-button rounded-full px-3 py-1.5 text-[10px] tracking-[0.15em] uppercase font-medium text-sage-deep inline-block mb-3">
								{stay.scenario}
							</span>
							<h1 className="text-foreground text-2xl md:text-4xl font-light tracking-[-0.02em] mb-1">
								{stay.name}
							</h1>
							<p className="text-sage-deep text-sm md:text-base font-light mb-4 md:mb-5">
								{stay.tagline}
							</p>
							<div className="flex flex-wrap items-center gap-3 md:gap-5 text-muted-foreground text-[11px] md:text-xs mb-4 md:mb-6">
								<span className="flex items-center gap-1.5">
									<MapPin className="h-3.5 w-3.5" />
									{stay.location}
								</span>
								<span className="flex items-center gap-1.5">
									<Users className="h-3.5 w-3.5" />
									{stay.maxGuests} guests
								</span>
								<span className="flex items-center gap-1.5">
									<Star className="h-3.5 w-3.5" />
									{stay.resonanceScore} resonance
								</span>
							</div>
							<p className="text-foreground/70 text-sm leading-relaxed">
								{stay.description}
							</p>
						</motion.div>

						{/* Amenities */}
						<motion.div
							initial={{ opacity: 0, y: 12 }}
							animate={{ opacity: 1, y: 0 }}
							transition={{ delay: 0.25 }}
							className="mt-8 md:mt-10"
						>
							<h2 className="text-foreground text-sm font-semibold tracking-wider uppercase mb-4">
								Offerings
							</h2>
							<div className="flex flex-wrap gap-1.5">
								{stay.amenities.map((amenity) => (
									<span
										key={amenity}
										className="glass-button rounded-full px-3 md:px-4 py-1.5 md:py-2 text-foreground text-[11px] md:text-xs"
									>
										{amenity}
									</span>
								))}
							</div>
						</motion.div>

						{/* Location with Map */}
						<motion.div
							initial={{ opacity: 0, y: 12 }}
							animate={{ opacity: 1, y: 0 }}
							transition={{ delay: 0.3 }}
							className="mt-8 md:mt-10"
						>
							<h2 className="text-foreground text-sm font-semibold tracking-wider uppercase mb-4">
								Location
							</h2>
							<div className="rounded-2xl overflow-hidden glass">
								<div className="w-full aspect-[2/1] md:aspect-[2.5/1] relative stay-detail-map">
									<div className="absolute inset-0">
										<StayMap
											lat={stay.coordinates.lat}
											lng={stay.coordinates.lng}
											location={stay.location}
										/>
									</div>
								</div>
								<div className="p-4 border-t border-foreground/5">
									<div className="flex items-center justify-between">
										<div>
											<p className="text-foreground text-sm">{stay.location}</p>
											<p className="text-muted-foreground/50 text-[10px] mt-0.5">
												{stay.coordinates.lat.toFixed(4)},{" "}
												{stay.coordinates.lng.toFixed(4)}
											</p>
										</div>
										<a
											href={`https://www.openstreetmap.org/?mlat=${stay.coordinates.lat}&mlon=${stay.coordinates.lng}&zoom=14`}
											target="_blank"
											rel="noopener noreferrer"
											className="glass-button rounded-full px-4 py-2 text-sage-deep text-[10px] font-medium tracking-wider cursor-pointer"
										>
											Open in OpenStreetMap
										</a>
									</div>
								</div>
							</div>
						</motion.div>

						{/* Reviews */}
						<motion.div
							initial={{ opacity: 0, y: 12 }}
							animate={{ opacity: 1, y: 0 }}
							transition={{ delay: 0.35 }}
							className="mt-8 md:mt-10"
						>
							<h2 className="text-foreground text-sm font-semibold tracking-wider uppercase mb-4">
								Resonance Reviews
							</h2>
							{reviews.length === 0 ? (
								<p className="text-muted-foreground text-xs">
									Be the first to share your resonance.
								</p>
							) : (
								<div className="flex flex-col gap-3">
									{reviews.map((review) => (
										<ReviewCard key={review.id} review={review} />
									))}
								</div>
							)}

							{/* Add review */}
							<div className="mt-6 glass rounded-2xl p-5 md:p-6">
								<h3 className="text-foreground text-xs font-semibold tracking-wider uppercase mb-4">
									Share Your Resonance
								</h3>
								<ReviewForm
									onSubmit={(review) => {
										// Always send a non-empty couple name: form value or current user's name
										const name =
											review.coupleName?.trim() || user?.coupleName?.trim() || "";
										addReviewMutation.mutate({
											...review,
											coupleName: name,
										});
									}}
									isSubmitting={addReviewMutation.isPending}
									defaultCoupleName={user?.coupleName}
									userId={user?.userId}
									errorMessage={reviewError ?? undefined}
								/>
							</div>
						</motion.div>
					</div>

					{/* Right: Glass sidebar */}
					<div className="lg:w-[360px] shrink-0">
						<motion.div
							initial={{ opacity: 0, x: 16 }}
							animate={{ opacity: 1, x: 0 }}
							transition={{ delay: 0.2 }}
							className="lg:sticky lg:top-24"
						>
							<div className="glass-heavy rounded-2xl md:rounded-3xl p-5 md:p-6 flex flex-col gap-4 md:gap-5">
								<div>
									<div className="flex items-baseline gap-1.5">
										<span className="text-foreground text-xl md:text-2xl font-semibold tracking-[-0.02em]">
											{formatPrice(stay.pricePerNight, stay.currency)}
										</span>
										<span className="text-muted-foreground text-xs">
											/ night
										</span>
									</div>
									<div className="flex items-center gap-1.5 mt-1.5">
										<span className="block h-1.5 w-1.5 rounded-full bg-sage-deep" />
										<span className="text-foreground text-xs">
											{stay.resonanceScore} resonance score
										</span>
									</div>
								</div>

								{!showBooking ? (
									<button
										type="button"
										onClick={() => {
											if (!user) {
												setShowAuthModal(true);
											} else {
												setShowBooking(true);
											}
										}}
										className="w-full bg-sage-deep text-primary-foreground py-3 md:py-3.5 rounded-xl md:rounded-2xl text-xs font-semibold tracking-[0.1em] uppercase hover:bg-sage-deep/90 transition-all flex items-center justify-center gap-2 shadow-sm"
									>
										<Calendar className="h-3.5 w-3.5" />
										{user ? "Begin Your Stay" : "Sign In to Book"}
										<ChevronRight className="h-3.5 w-3.5" />
									</button>
								) : (
									<BookingForm
										stay={stay}
										onClose={() => setShowBooking(false)}
									/>
								)}

								<div className="border-t border-foreground/5 pt-4">
									<p className="text-muted-foreground/60 text-[10px] md:text-[11px] leading-relaxed">
										Cocoon retreats are exclusively for two. All stays include a
										curated welcome ritual and 24/7 solitude support.
									</p>
								</div>
							</div>
						</motion.div>
					</div>
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

export function ReviewForm({
	onSubmit,
	isSubmitting,
	defaultCoupleName,
	userId,
	errorMessage,
}: {
	onSubmit: (review: {
		userId: string;
		coupleName: string;
		rating: number;
		text: string;
	}) => void;
	isSubmitting: boolean;
	defaultCoupleName?: string;
	userId?: string;
	errorMessage?: string;
}) {
	const [coupleName, setCoupleName] = useState(defaultCoupleName || "");
	const [rating, setRating] = useState(5);
	const [text, setText] = useState("");
	const [localError, setLocalError] = useState<string | null>(null);

	// Keep couple name in sync when user loads (e.g. after mount)
	useEffect(() => {
		if (defaultCoupleName?.trim()) {
			setCoupleName(defaultCoupleName.trim());
		}
	}, [defaultCoupleName]);

	const isLoggedIn = !!userId;

	const handleSubmit = (e: React.FormEvent) => {
		e.preventDefault();
		if (!userId) return;

		const trimmedName = coupleName.trim();
		if (!trimmedName) {
			setLocalError("Please enter your couple name.");
			return;
		}

		const trimmedText = text.trim();
		if (!trimmedText) {
			setLocalError("Please share a few words about your resonance.");
			return;
		}
		if (trimmedText.length < 10) {
			setLocalError("Please write at least 10 characters.");
			return;
		}

		setLocalError(null);

		const payload = {
			userId,
			coupleName: trimmedName,
			rating,
			text: trimmedText,
		};
		// Debug: inspect payload sent from the form
		// eslint-disable-next-line no-console
		console.log("ReviewForm: submit payload", payload);
		onSubmit(payload);
		setText("");
	};

	return (
		<form onSubmit={handleSubmit} className="flex flex-col gap-3">
			<input
				type="text"
				value={coupleName}
				onChange={(e) => {
					setCoupleName(e.target.value);
					if (localError === "Please enter your couple name.") setLocalError(null);
				}}
				placeholder="Your couple name"
				className="glass-input rounded-xl px-3.5 py-2.5 text-foreground text-sm placeholder:text-muted-foreground/40 outline-none"
				disabled={!isLoggedIn}
			/>
			<div className="flex items-center gap-0.5">
				{[1, 2, 3, 4, 5].map((star) => (
					<button
						key={star}
						type="button"
						onClick={() => setRating(star)}
						disabled={!isLoggedIn}
						className={`p-0.5 transition-colors ${
							isLoggedIn ? "cursor-pointer" : "cursor-not-allowed opacity-50"
						} ${star <= rating ? "text-sage-deep" : "text-foreground/15"}`}
					>
						<Star className="h-4 w-4 fill-current" />
					</button>
				))}
			</div>
			<textarea
				value={text}
				onChange={(e) => {
					const value = e.target.value;
					setText(value);
					if (localError && value.trim().length >= 10) {
						setLocalError(null);
					}
				}}
				placeholder="Share your resonance..."
				rows={3}
				className="glass-input rounded-xl px-3.5 py-2.5 text-foreground text-sm placeholder:text-muted-foreground/40 outline-none resize-none disabled:opacity-50"
				disabled={!isLoggedIn}
			/>
			{(localError || errorMessage) && (
				<p className="text-[11px] text-red-600/90">
					{localError || errorMessage}
				</p>
			)}
			<Tooltip>
				<TooltipTrigger asChild>
					<button
						type="submit"
						disabled={isSubmitting || !isLoggedIn}
						className="glass-button rounded-xl py-2.5 text-sage-deep text-[11px] font-semibold tracking-[0.1em] uppercase disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
					>
						{isSubmitting ? "Sharing..." : "Share Review"}
					</button>
				</TooltipTrigger>
				{!isLoggedIn && (
					<TooltipContent side="top">
						<p className="text-xs">Sign in to share your review</p>
					</TooltipContent>
				)}
			</Tooltip>
		</form>
	);
}
