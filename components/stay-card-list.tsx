"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import type { Stay } from "@/types";
import { buildImageUrl, resolveMedia } from "@/utils/media";
import { formatPrice } from "@/utils/price";
import { LazyVideo } from "./lazy-video";

interface StayCardListProps {
	stay: Stay;
	index?: number;
}

/** Compact horizontal card for list view: image left, details right, one per line. */
export function StayCardList({ stay, index = 0 }: StayCardListProps) {
	const media = resolveMedia(stay.images[0], stay.video);

	return (
		<motion.div
			initial={{ opacity: 0, x: -8 }}
			animate={{ opacity: 1, x: 0 }}
			transition={{ delay: index * 0.03, duration: 0.3, ease: "easeOut" }}
		>
			<Link
				href={`/stay/${stay.id}`}
				className="group flex overflow-hidden rounded-xl glass hover:shadow-lg transition-all duration-300 cursor-pointer border border-foreground/5"
			>
				{/* Image / video — video loads only when in view */}
				<div className="relative w-28 sm:w-32 md:w-36 shrink-0 aspect-4/3 overflow-hidden bg-muted/30">
					{media.type === "video" ? (
						<LazyVideo
							src={media.src}
							poster={buildImageUrl(stay.images[0])}
							className="h-full w-full object-cover scale-[1.05] transition-transform duration-500 group-hover:scale-[1.07]"
						/>
					) : (
						<Image
							src={media.src}
							alt={stay.name}
							fill
							className="object-cover transition-transform duration-500 group-hover:scale-[1.02]"
							sizes="160px"
						/>
					)}
					<div className="absolute inset-0 bg-linear-to-r from-transparent via-transparent to-foreground/5" />
					<span className="absolute top-1.5 left-1.5 rounded-md bg-foreground/80 px-1.5 py-0.5 text-[9px] font-medium uppercase tracking-wider text-background">
						{stay.scenario}
					</span>
					<span className="absolute bottom-1.5 right-1.5 rounded-md bg-foreground/80 px-1.5 py-0.5 text-[9px] font-semibold text-background flex items-center gap-0.5">
						<span className="block h-1 w-1 rounded-full bg-sage" />
						{stay.resonanceScore}
					</span>
				</div>

				{/* Content — single-line feel, compact */}
				<div className="flex flex-1 min-w-0 items-center gap-3 px-3 py-2.5 sm:px-4 sm:py-3">
					<div className="flex-1 min-w-0">
						<h3 className="text-foreground font-medium text-sm truncate group-hover:text-sage-deep transition-colors">
							{stay.name}
						</h3>
						<p className="text-muted-foreground text-xs truncate mt-0.5">
							{stay.tagline}
						</p>
						<p className="text-muted-foreground/70 text-[11px] truncate mt-0.5">
							{stay.location}
						</p>
						<p className="text-muted-foreground/60 text-[11px] mt-0.5">
							{stay.reviewCount ?? 0} review
							{(stay.reviewCount ?? 0) === 1 ? "" : "s"}
						</p>
					</div>
					<div className="shrink-0 text-right">
						<p className="text-foreground text-sm font-semibold">
							{formatPrice(stay.pricePerNight, stay.currency)}
						</p>
						<p className="text-muted-foreground text-[10px] tracking-wider">
							/ night
						</p>
					</div>
				</div>
			</Link>
		</motion.div>
	);
}
