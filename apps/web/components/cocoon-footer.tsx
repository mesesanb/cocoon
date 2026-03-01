"use client";

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
							<Link
								href="/"
								className="text-foreground text-base font-medium tracking-[-0.02em] hover:text-sage-deep transition-colors"
							>
								cocoon
							</Link>
							<span className="text-muted-foreground/40 text-[10px] tracking-[0.2em] uppercase">
								here, us.
							</span>
						</div>

						<nav
							className="flex items-center gap-6"
							aria-label="Footer navigation"
						>
							<Link
								href="/"
								className="text-muted-foreground text-xs tracking-wider hover:text-foreground transition-colors"
							>
								Discover
							</Link>
							<Link
								href="/our-cocoon"
								className="text-muted-foreground text-xs tracking-wider hover:text-foreground transition-colors"
							>
								Our Cocoon
							</Link>
							<Link
								href="/about"
								className="text-muted-foreground text-xs tracking-wider hover:text-foreground transition-colors"
							>
								About
							</Link>
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
