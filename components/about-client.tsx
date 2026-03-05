"use client";

import { motion } from "framer-motion";
import { ArrowLeft, LogIn, LogOut } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import {
	Tooltip,
	TooltipContent,
	TooltipTrigger,
} from "@/components/ui/tooltip";
import { useAuth } from "./auth-context";
import { AuthModal } from "./auth-modal";
import { CocoonFooter } from "./cocoon-footer";

export function AboutClient() {
	const router = useRouter();
	const { user, signOut } = useAuth();
	const [showAuthModal, setShowAuthModal] = useState(false);

	return (
		<div className="min-h-screen bg-linen relative">
			{/* Background */}
			<div className="fixed inset-0 -z-10 relative">
				<Image
					src="/images/forest/01.jpg"
					alt=""
					fill
					className="object-cover"
					priority
				/>
				<div className="absolute inset-0 backdrop-blur-3xl bg-[#F5F2EE]/75" />
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
						{user && (
							<Tooltip>
								<TooltipTrigger asChild>
									<Link
										href="/our-cocoon"
										className="glass-button rounded-full px-4 py-2 text-foreground text-xs tracking-wider cursor-pointer"
									>
										Our Cocoon
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

			<main className="relative z-10 mx-auto max-w-3xl px-6 py-16 md:py-24">
				<motion.div
					initial={{ opacity: 0, y: 20 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ duration: 0.6 }}
					className="glass-heavy rounded-3xl p-8 md:p-12 lg:p-16"
				>
					{/* Title */}
					<motion.div
						initial={{ opacity: 0, y: 12 }}
						animate={{ opacity: 1, y: 0 }}
						transition={{ delay: 0.15, duration: 0.5 }}
						className="text-center mb-12"
					>
						<p className="text-muted-foreground/40 text-[10px] tracking-[0.3em] uppercase mb-4">
							Manifesto
						</p>
						<h1 className="text-foreground text-4xl md:text-5xl lg:text-6xl font-light tracking-[-0.03em]">
							fill the space <span className="font-medium">together</span>
						</h1>
						<div className="h-px w-12 bg-sage-deep/30 mx-auto mt-6" />
					</motion.div>

					{/* Manifesto */}
					<motion.div
						initial={{ opacity: 0 }}
						animate={{ opacity: 1 }}
						transition={{ delay: 0.35, duration: 0.6 }}
						className="flex flex-col gap-7 text-foreground/65 text-sm md:text-base leading-relaxed"
					>
						<p>
							Cocoon was born from a quiet observation: that the world builds
							everything for individuals. Productivity apps, wellness routines,
							career paths. Even if one of the most important units of human
							meaning is the self, we believe that the space between two people
							is also important, and the architecture that brings them together
							is what makes them whole.
						</p>

						<p>
							We design retreats for that space. Places where two become more
							present to each other by becoming less accessible to everything
							else. Where silence is not awkward but architectural. Where nature
							is not backdrop but participant.
						</p>

						<p>
							Every Cocoon is chosen for its capacity to hold intimacy. We do
							not list hotels. We do not offer tours. We find places where the
							walls dissolve and the world outside ceases to make demands. Then
							we prepare them for two.
						</p>

						<p>
							Our Resonance Score is not a rating. It is a measure of
							transformation -- the degree to which a couple reports emerging
							from their stay more attuned to each other. It is calculated from
							qualitative feedback, depth of disconnection from routine, and
							environmental immersion.
						</p>

						<p>
							We accept payment in our platform currency (¤) — borderless, no
							intermediaries, no friction. Just two people and a place.
						</p>

						<div className="text-center pt-6">
							<p className="text-sage-deep text-xl md:text-2xl font-light tracking-[0.15em]">
								Here, us.
							</p>
							<p className="text-muted-foreground/30 text-[10px] tracking-[0.2em] uppercase mt-4">
								Cocoon, 2026
							</p>
						</div>
					</motion.div>
				</motion.div>
			</main>

			<CocoonFooter />
			<AuthModal
				isOpen={showAuthModal}
				onClose={() => setShowAuthModal(false)}
			/>
		</div>
	);
}
