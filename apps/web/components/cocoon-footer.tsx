"use client";

import {
	Tooltip,
	TooltipContent,
	TooltipTrigger,
} from "@/components/ui/tooltip";
import { motion } from "framer-motion";
import Link from "next/link";

export function CocoonFooter() {
	return (
		<motion.footer
			initial={{ opacity: 0 }}
			animate={{ opacity: 1 }}
			transition={{ delay: 0.6 }}
			className="relative z-10 mt-20"
		>
			<div className="mx-auto max-w-7xl px-6">
				<div className="border-t border-foreground/5 py-10">
					<div className="flex flex-col md:flex-row items-center justify-between gap-6">
						<div className="flex items-baseline gap-2">
							<Tooltip>
								<TooltipTrigger asChild>
									<Link
										href="/"
										className="text-foreground text-base font-medium tracking-[-0.02em] hover:text-sage-deep transition-colors cursor-pointer"
									>
										cocoon
									</Link>
								</TooltipTrigger>
								<TooltipContent side="top">Home</TooltipContent>
							</Tooltip>
							<span className="text-muted-foreground/40 text-[10px] tracking-[0.2em] uppercase">
								here, us.
							</span>
						</div>

						<nav
							className="flex items-center gap-6"
							aria-label="Footer navigation"
						>
							<Tooltip>
								<TooltipTrigger asChild>
									<Link
										href="/"
										className="text-muted-foreground text-xs tracking-wider hover:text-foreground transition-colors cursor-pointer"
									>
										Discover
									</Link>
								</TooltipTrigger>
								<TooltipContent side="top">Discover retreats</TooltipContent>
							</Tooltip>
							<Tooltip>
								<TooltipTrigger asChild>
									<Link
										href="/our-cocoon"
										className="text-muted-foreground text-xs tracking-wider hover:text-foreground transition-colors cursor-pointer"
									>
										Our Cocoon
									</Link>
								</TooltipTrigger>
								<TooltipContent side="top">My bookings</TooltipContent>
							</Tooltip>
							<Tooltip>
								<TooltipTrigger asChild>
									<Link
										href="/about"
										className="text-muted-foreground text-xs tracking-wider hover:text-foreground transition-colors cursor-pointer"
									>
										About
									</Link>
								</TooltipTrigger>
								<TooltipContent side="top">About Cocoon</TooltipContent>
							</Tooltip>
						</nav>

						<p className="text-muted-foreground/30 text-[10px] tracking-wider">
							{"Cocoon \u00A9 2026"}
						</p>
					</div>
				</div>
			</div>
		</motion.footer>
	);
}
