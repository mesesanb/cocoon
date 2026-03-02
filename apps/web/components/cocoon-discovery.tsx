"use client";

import { useQuery } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { ArrowLeft, LogIn, LogOut } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useCallback, useState } from "react";
import type { ScenarioType, Stay } from "@/types";
import {
	Tooltip,
	TooltipContent,
	TooltipTrigger,
} from "@/components/ui/tooltip";
import { useAuth } from "./auth-context";
import { AuthModal } from "./auth-modal";
import { CocoonFooter } from "./cocoon-footer";
import { SearchBar } from "./search-bar";
import { StayCard } from "./stay-card";

interface CocoonDiscoveryProps {
	initialScenario?: ScenarioType;
	backgroundImage?: string;
	onBack?: () => void;
}

const SCENARIO_IMAGES: Record<ScenarioType, string> = {
	CITY: "/images/city/01.jpg",
	FOREST: "/images/forest/01.jpg",
	MOUNTAINS: "/images/mountains/01.jpg",
	SEA: "/images/sea/01.jpg",
};

export function CocoonDiscovery({
	initialScenario,
	backgroundImage,
	onBack,
}: CocoonDiscoveryProps) {
	const { user, signOut } = useAuth();
	const [showAuthModal, setShowAuthModal] = useState(false);
	const [searchQuery, setSearchQuery] = useState("");
	const [activeQuery, setActiveQuery] = useState("");
	const [activeScenario, setActiveScenario] = useState<
		ScenarioType | undefined
	>(initialScenario);

	const { data: stays = [], isLoading } = useQuery<Stay[]>({
		queryKey: ["stays", activeScenario, activeQuery],
		queryFn: async () => {
			const params = new URLSearchParams();
			if (activeScenario) params.set("type", activeScenario);
			if (activeQuery) params.set("query", activeQuery);
			params.set("sort", "resonance");
			const res = await fetch(`/api/stays?${params.toString()}`);
			return res.json();
		},
	});

	const handleSearch = useCallback(() => {
		setActiveQuery(searchQuery);
	}, [searchQuery]);

	const bgImage =
		backgroundImage ||
		(activeScenario ? SCENARIO_IMAGES[activeScenario] : "/images/hero.jpg");

	return (
		<motion.div
			initial={{ opacity: 0 }}
			animate={{ opacity: 1 }}
			transition={{ duration: 0.5 }}
			className="min-h-screen relative"
		>
			{/* Background with heavy blur */}
			<div className="fixed inset-0 -z-10 relative">
				<Image src={bgImage} alt="" fill className="object-cover" priority />
				<div className="absolute inset-0 backdrop-blur-3xl bg-[#F5F2EE]/75" />
			</div>

			{/* Navigation */}
			<header className="sticky top-0 z-30 glass-heavy rounded-none">
				<div className="mx-auto max-w-7xl flex items-center justify-between px-4 md:px-6 py-3 md:py-4">
					<div className="flex items-center gap-2 md:gap-3">
						{onBack && (
							<Tooltip>
								<TooltipTrigger asChild>
									<button
										type="button"
										onClick={onBack}
										className="glass-button rounded-full p-2 cursor-pointer"
										aria-label="Go back to landscape selection"
									>
										<ArrowLeft className="h-4 w-4 text-foreground" />
									</button>
								</TooltipTrigger>
								<TooltipContent side="bottom">Back to landscape selection</TooltipContent>
							</Tooltip>
						)}
						<Tooltip>
							<TooltipTrigger asChild>
								<Link
									href="/"
									className="flex items-baseline gap-2 hover:text-sage-deep transition-colors cursor-pointer"
								>
									<span className="text-foreground text-base font-medium tracking-[-0.02em]">
										cocoon
									</span>
									<span className="text-muted-foreground/30 text-[10px] tracking-[0.2em] uppercase hidden md:inline">
										here, us.
									</span>
								</Link>
							</TooltipTrigger>
							<TooltipContent side="bottom">Home</TooltipContent>
						</Tooltip>
					</div>
					<nav className="flex items-center gap-1" aria-label="Main navigation">
						<Tooltip>
							<TooltipTrigger asChild>
								<a
									href="/our-cocoon"
									className="glass-button rounded-full px-3 md:px-4 py-2 text-foreground text-[10px] md:text-xs tracking-wider cursor-pointer"
								>
									<span className="hidden md:inline">Our Cocoon</span>
									<span className="md:hidden">Cocoon</span>
								</a>
							</TooltipTrigger>
							<TooltipContent side="bottom">My bookings</TooltipContent>
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

			<main className="relative z-10 mx-auto max-w-7xl px-4 md:px-6 py-8 md:py-14">
				{/* Search section */}
				<div className="flex flex-col items-center gap-6 md:gap-8 mb-10 md:mb-14">
					<motion.div
						initial={{ opacity: 0, y: 12 }}
						animate={{ opacity: 1, y: 0 }}
						className="text-center"
					>
						<h1 className="text-foreground text-2xl md:text-5xl font-light tracking-[-0.03em] text-balance">
							Discover Your Retreat
						</h1>
						<p className="text-muted-foreground text-xs md:text-sm mt-2 md:mt-3 font-light">
							Nature-based retreats designed for two
						</p>
					</motion.div>

					<SearchBar
						value={searchQuery}
						onChange={setSearchQuery}
						onSearch={handleSearch}
					/>

					{/* Scenario filters */}
					<motion.div
						initial={{ opacity: 0 }}
						animate={{ opacity: 1 }}
						transition={{ delay: 0.3 }}
						className="flex items-center gap-1.5 flex-wrap justify-center"
					>
						<button
							type="button"
							onClick={() => setActiveScenario(undefined)}
							className={`rounded-full px-3 md:px-4 py-1.5 md:py-2 text-[10px] md:text-[11px] tracking-[0.1em] uppercase font-medium transition-all duration-300 ${
								!activeScenario
									? "bg-sage-deep text-primary-foreground shadow-sm"
									: "glass-button text-foreground"
							}`}
						>
							All
						</button>
						{(["CITY", "FOREST", "MOUNTAINS", "SEA"] as ScenarioType[]).map(
							(type) => (
								<button
									type="button"
									key={type}
									onClick={() =>
										setActiveScenario(
											activeScenario === type ? undefined : type,
										)
									}
									className={`rounded-full px-3 md:px-4 py-1.5 md:py-2 text-[10px] md:text-[11px] tracking-[0.1em] uppercase font-medium transition-all duration-300 ${
										activeScenario === type
											? "bg-sage-deep text-primary-foreground shadow-sm"
											: "glass-button text-foreground"
									}`}
								>
									{type}
								</button>
							),
						)}
					</motion.div>
				</div>

				{/* Listings grid */}
				{isLoading ? (
					<div className="flex items-center justify-center py-24">
						<motion.div
							animate={{ opacity: [0.3, 1, 0.3] }}
							transition={{ repeat: Infinity, duration: 1.5 }}
							className="text-muted-foreground text-xs tracking-[0.2em] uppercase"
						>
							Seeking resonance...
						</motion.div>
					</div>
				) : stays.length === 0 ? (
					<div className="flex items-center justify-center py-24">
						<p className="text-muted-foreground text-sm">
							No retreats found. Adjust your search.
						</p>
					</div>
				) : (
					<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-5">
						{stays.map((stay, i) => (
							<StayCard key={stay.id} stay={stay} mode="listing" index={i} />
						))}
					</div>
				)}
			</main>

			<CocoonFooter />
			<AuthModal
				isOpen={showAuthModal}
				onClose={() => setShowAuthModal(false)}
			/>
		</motion.div>
	);
}
