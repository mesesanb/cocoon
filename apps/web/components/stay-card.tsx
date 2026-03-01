"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import type { Booking, Stay, StayCardMode } from "@/types";
import { formatDateRange } from "@/utils/dates";
import { resolveMedia } from "@/utils/media";
import { formatPrice } from "@/utils/price";

interface StayCardProps {
	stay: Stay;
	mode: StayCardMode;
	booking?: Booking;
	index?: number;
}

export function StayCard({ stay, mode, booking, index = 0 }: StayCardProps) {
	const media = resolveMedia(stay.images[0], stay.video);

	const statusLabel =
		mode === "history" ? "Past Echo" : mode === "upcoming" ? "Upcoming" : null;

	return (
		<motion.div
			initial={{ opacity: 0, y: 20 }}
			animate={{ opacity: 1, y: 0 }}
			transition={{ delay: index * 0.06, duration: 0.4, ease: "easeOut" }}
		>
			<Link
				href={`/stay/${stay.id}`}
				className="group block overflow-hidden rounded-2xl glass hover:shadow-xl transition-all duration-500"
			>
				{/* Image or video */}
				<div className="relative aspect-[4/3] overflow-hidden">
					{media.type === "video" ? (
						<video
							src={media.src}
							className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-[1.03]"
							muted
							loop
							playsInline
							autoPlay
						/>
					) : (
						<Image
							src={media.src}
							alt={stay.name}
							fill
							className="object-cover transition-transform duration-700 group-hover:scale-[1.03]"
							sizes="(max-width: 768px) 100vw, 33vw"
						/>
					)}
					<div className="absolute inset-0 bg-gradient-to-t from-[#1A1A1A]/40 via-transparent to-transparent" />

					{/* Top badges */}
					<div className="absolute top-3 left-3 right-3 flex items-start justify-between">
						<span className="glass-dark rounded-full px-3 py-1.5 text-[#F5F2EE] text-[10px] tracking-[0.15em] uppercase font-medium">
							{stay.scenario}
						</span>
						<div className="glass-dark rounded-full px-3 py-1.5 flex items-center gap-1.5">
							<span className="block h-1.5 w-1.5 rounded-full bg-sage" />
							<span className="text-[#F5F2EE] text-[10px] font-semibold">
								{stay.resonanceScore}
							</span>
						</div>
					</div>

					{/* Status label */}
					{statusLabel && (
						<div className="absolute bottom-3 left-3">
							<span className="glass-dark rounded-full px-3 py-1 text-[#F5F2EE] text-[10px] tracking-[0.15em] uppercase font-medium">
								{statusLabel}
							</span>
						</div>
					)}
				</div>

				{/* Content */}
				<div className="p-5 flex flex-col gap-2">
					<div className="flex items-start justify-between gap-3">
						<div className="flex-1 min-w-0">
							<h3 className="text-foreground font-medium text-sm truncate group-hover:text-sage-deep transition-colors">
								{stay.name}
							</h3>
							<p className="text-muted-foreground text-xs mt-0.5 truncate">
								{stay.tagline}
							</p>
						</div>
						<div className="text-right shrink-0">
							<p className="text-foreground text-sm font-semibold">
								{formatPrice(stay.pricePerNight, stay.currency)}
							</p>
							<p className="text-muted-foreground text-[10px] tracking-wider">
								/ night
							</p>
						</div>
					</div>

					<p className="text-muted-foreground/60 text-[11px]">
						{stay.location}
					</p>

					{/* Booking dates */}
					{booking && (
						<div className="pt-2.5 mt-1 border-t border-foreground/5">
							<p className="text-foreground text-xs">
								{formatDateRange(booking.checkIn, booking.checkOut)}
							</p>
							<p className="text-muted-foreground text-[10px] mt-0.5">
								{formatPrice(booking.totalPrice, booking.currency)} total
							</p>
						</div>
					)}
				</div>
			</Link>
		</motion.div>
	);
}
