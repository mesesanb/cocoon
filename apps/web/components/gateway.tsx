"use client";

import { AnimatePresence, motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import type { ScenarioType } from "@/types";

// fixed card images: Tokyo Sky Dome (city), The Redwood Sphere (forest), The Wadi Gorge Cabin (mountains), The Beacon Suite (sea)
const CARD_IMAGES: Record<ScenarioType, string> = {
	CITY: "/images/city/39.jpg",
	FOREST: "/images/forest/01.jpg",
	MOUNTAINS: "/images/mountains/36.jpg",
	SEA: "/images/sea/10.jpg",
};

const SCENARIO_META: {
	type: ScenarioType;
	label: string;
	description: string;
}[] = [
	{
		type: "CITY",
		label: "City",
		description: "Reconnect amidst the urban rhythm",
	},
	{
		type: "FOREST",
		label: "Forest",
		description: "Find stillness beneath ancient canopies",
	},
	{
		type: "MOUNTAINS",
		label: "Mountains",
		description: "Rise together above the clouds",
	},
	{ type: "SEA", label: "Sea", description: "Let the tides carry you closer" },
];

interface GatewayProps {
	onSelect: (scenario: ScenarioType) => void;
}

export function Gateway({ onSelect }: GatewayProps) {
	const [hovered, setHovered] = useState<ScenarioType | null>(null);
	const scenariosWithImages = SCENARIO_META.map((s) => ({
		...s,
		image: CARD_IMAGES[s.type],
	}));
	const activeScenario = scenariosWithImages.find((s) => s.type === hovered);

	return (
		<motion.div
			initial={{ opacity: 0 }}
			animate={{ opacity: 1 }}
			transition={{ duration: 0.8 }}
			className="fixed inset-0 z-40 flex flex-col bg-[#1A1A1A]"
		>
			{/* Background cross-fade */}
			<div className="absolute inset-0">
				<div className="absolute inset-0 opacity-60">
					<Image
						src="/images/hero.jpg"
						alt=""
						fill
						className="object-cover"
						priority
					/>
				</div>
				<AnimatePresence>
					{activeScenario && (
						<motion.div
							key={activeScenario.type}
							initial={{ opacity: 0 }}
							animate={{ opacity: 0.7 }}
							exit={{ opacity: 0 }}
							transition={{ duration: 0.6 }}
							className="absolute inset-0"
						>
							<Image
								src={activeScenario.image}
								alt=""
								fill
								className="object-cover"
								sizes="100vw"
							/>
						</motion.div>
					)}
				</AnimatePresence>
				<div className="absolute inset-0 bg-gradient-to-b from-[#1A1A1A]/60 via-transparent to-[#1A1A1A]/80" />
			</div>

			{/* Header with title inline */}
			<motion.header
				initial={{ opacity: 0, y: -10 }}
				animate={{ opacity: 1, y: 0 }}
				transition={{ delay: 0.3, duration: 0.6 }}
				className="relative z-10 flex items-center justify-between px-4 md:px-8 py-3 md:py-4"
			>
				<div className="flex items-center gap-3">
					<Link href="/" className="hover:opacity-90 transition-opacity">
						<h1 className="text-[#F5F2EE] text-lg md:text-xl font-medium tracking-[-0.02em]">
							cocoon
						</h1>
						<span className="text-[#F5F2EE]/40 text-[9px] md:text-[10px] tracking-[0.2em] uppercase">
							here, us.
						</span>
					</Link>
				</div>

				{/* Title moved to header row */}
				<p className="text-[#F5F2EE]/50 text-[9px] md:text-xs tracking-[0.15em] md:tracking-[0.2em] uppercase">
					Choose your landscape
				</p>
			</motion.header>

			{/* Panels - take remaining space, taller cards */}
			<div className="relative z-10 flex flex-1 gap-1.5 px-2 pb-2 md:gap-3 md:px-6 md:pb-6 min-h-0">
				{scenariosWithImages.map((scenario, i) => {
					const isHovered = hovered === scenario.type;

					return (
						<motion.button
							key={scenario.type}
							initial={{ opacity: 0, y: 20 }}
							animate={{ opacity: 1, y: 0 }}
							style={{
								flexShrink: 1,
								flexBasis: 0,
								flexGrow: isHovered ? 2 : 1,
								transition: "flex-grow 0.4s cubic-bezier(0.33, 1, 0.68, 1)",
							}}
							transition={{
								opacity: { delay: 0.2 + i * 0.06, duration: 0.4 },
								y: { delay: 0.2 + i * 0.06, duration: 0.4 },
							}}
							onMouseEnter={() => setHovered(scenario.type)}
							onMouseLeave={() => setHovered(null)}
							onClick={() => onSelect(scenario.type)}
							className="relative overflow-hidden rounded-xl md:rounded-2xl group cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-[#F5F2EE]/30"
							aria-label={`Select ${scenario.label} retreats`}
						>
							{/* Panel background */}
							<div className="absolute inset-0">
								<Image
									src={scenario.image}
									alt={`${scenario.label} retreat setting`}
									fill
									className="object-cover transition-transform duration-500 group-hover:scale-105"
									sizes="(max-width: 768px) 25vw, 20vw"
								/>
								<motion.div
									className="absolute inset-0"
									animate={{
										backgroundColor: isHovered
											? "rgba(0,0,0,0.2)"
											: "rgba(0,0,0,0.45)",
									}}
									transition={{ duration: 0.4 }}
								/>
							</div>

							{/* Mobile: Vertical rotated text in center */}
							<div className="absolute inset-0 flex items-center justify-center md:hidden">
								<span
									className="text-[#F5F2EE] text-base font-medium tracking-[0.15em] uppercase"
									style={{
										writingMode: "vertical-rl",
										textOrientation: "mixed",
										transform: "rotate(180deg)",
									}}
								>
									{scenario.label}
								</span>
							</div>

							{/* Desktop: Text label at bottom with hover reveal */}
							<div className="hidden md:block absolute inset-x-0 bottom-0 p-5">
								<motion.div
									animate={{
										y: isHovered ? -8 : 0,
									}}
									transition={{ duration: 0.3, ease: [0.33, 1, 0.68, 1] }}
								>
									<span className="block text-[#F5F2EE] text-sm font-medium tracking-[0.12em] uppercase">
										{scenario.label}
									</span>
								</motion.div>
								<motion.p
									initial={{ opacity: 0, y: 6 }}
									animate={{
										opacity: isHovered ? 0.8 : 0,
										y: isHovered ? 0 : 6,
									}}
									transition={{ duration: 0.3, ease: [0.33, 1, 0.68, 1] }}
									className="text-[#F5F2EE] text-xs font-light tracking-wide mt-1"
								>
									{scenario.description}
								</motion.p>
							</div>
						</motion.button>
					);
				})}
			</div>
		</motion.div>
	);
}
