"use client";

import { Star } from "lucide-react";
import type { Review } from "@/types";
import { formatDate } from "@/utils/dates";

interface ReviewCardProps {
	review: Review;
}

export function ReviewCard({ review }: ReviewCardProps) {
	return (
		<div className="glass rounded-2xl p-5">
			<div className="flex items-start justify-between mb-3">
				<div>
					<p className="text-foreground text-sm font-medium">
						{review.coupleName}
					</p>
					<p className="text-muted-foreground/50 text-[10px] mt-0.5">
						{formatDate(review.date)}
					</p>
				</div>
				<div className="flex items-center gap-2">
					<div className="flex items-center gap-0.5">
						{[1, 2, 3, 4, 5].map((star) => (
							<Star
								key={star}
								className={`h-3 w-3 ${
									star <= review.rating
										? "text-sage-deep fill-sage-deep"
										: "text-foreground/10"
								}`}
							/>
						))}
					</div>
					<span className="glass-button rounded-full px-2 py-0.5 text-[10px] text-sage-deep font-semibold">
						{review.resonanceScore}
					</span>
				</div>
			</div>
			<p className="text-foreground/60 text-sm leading-relaxed">
				{`"${review.text}"`}
			</p>
		</div>
	);
}
