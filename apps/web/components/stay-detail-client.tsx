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
import { useState } from "react";
import {
	Tooltip,
	TooltipContent,
	TooltipTrigger,
} from "@/components/ui/tooltip";
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

	const { data: stay, isLoading } = useQuery<Stay>({
		queryKey: ["stay", stayId],
		queryFn: async () => {
			const res = await fetch(`/api/stays/${stayId}`);
			if (!res.ok) throw new Error("Stay not found");
			return res.json();
		},
	});

	const { data: reviewsData } = useQuery<{
		reviews: Review[];
		total: number;
	}>({
		queryKey: ["reviews", stayId],
		queryFn: async () => {
			const res = await fetch(`/api/stays/${stayId}/reviews`);
			return res.json();
		},
	});

	const addReviewMutation = useMutation({
		mutationFn: async (review: {
			coupleName: string;
			rating: number;
			text: string;
		}) => {
			const res = await fetch(`/api/stays/${stayId}/reviews`, {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify(review),
			});
			return res.json();
		},
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ["reviews", stayId] });
		},
	});

	const handleShare = async (platform: "twitter" | "facebook" | "copy") => {
		if (!stay) return;

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

	const reviews = reviewsData?.reviews || [];

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
									onSubmit={(review) => addReviewMutation.mutate(review)}
									isSubmitting={addReviewMutation.isPending}
									defaultCoupleName={user?.coupleName}
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

function ReviewForm({
	onSubmit,
	isSubmitting,
	defaultCoupleName,
}: {
	onSubmit: (review: {
		coupleName: string;
		rating: number;
		text: string;
	}) => void;
	isSubmitting: boolean;
	defaultCoupleName?: string;
}) {
	const [coupleName, setCoupleName] = useState(defaultCoupleName || "");
	const [rating, setRating] = useState(5);
	const [text, setText] = useState("");

	const handleSubmit = (e: React.FormEvent) => {
		e.preventDefault();
		if (!coupleName.trim() || !text.trim()) return;
		onSubmit({ coupleName, rating, text });
		setCoupleName(defaultCoupleName || "");
		setText("");
	};

	return (
		<form onSubmit={handleSubmit} className="flex flex-col gap-3">
			<input
				type="text"
				value={coupleName}
				onChange={(e) => setCoupleName(e.target.value)}
				placeholder="Your couple name"
				className="glass-input rounded-xl px-3.5 py-2.5 text-foreground text-sm placeholder:text-muted-foreground/40 outline-none"
				required
			/>
			<div className="flex items-center gap-0.5">
				{[1, 2, 3, 4, 5].map((star) => (
					<button
						key={star}
						type="button"
						onClick={() => setRating(star)}
						className={`p-0.5 transition-colors ${star <= rating ? "text-sage-deep" : "text-foreground/15"}`}
					>
						<Star className="h-4 w-4 fill-current" />
					</button>
				))}
			</div>
			<textarea
				value={text}
				onChange={(e) => setText(e.target.value)}
				placeholder="Share your resonance..."
				rows={3}
				className="glass-input rounded-xl px-3.5 py-2.5 text-foreground text-sm placeholder:text-muted-foreground/40 outline-none resize-none"
				required
			/>
			<button
				type="submit"
				disabled={isSubmitting}
				className="glass-button rounded-xl py-2.5 text-sage-deep text-[11px] font-semibold tracking-[0.1em] uppercase disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
			>
				{isSubmitting ? "Sharing..." : "Share Review"}
			</button>
		</form>
	);
}
