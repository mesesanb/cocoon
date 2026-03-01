"use client";

import { AnimatePresence, motion } from "framer-motion";
import Image from "next/image";
import { useCallback, useEffect, useState } from "react";

interface NarrativeIntroProps {
	coupleName: string;
	onComplete: () => void;
}

// intro screen: phased text, completes after delay or on click
export function NarrativeIntro({
	coupleName,
	onComplete,
}: NarrativeIntroProps) {
	const [textPhase, setTextPhase] = useState(0);

	useEffect(() => {
		const timers = [
			setTimeout(() => setTextPhase(1), 800),
			setTimeout(() => setTextPhase(2), 2800),
			setTimeout(() => setTextPhase(3), 5000),
			setTimeout(() => onComplete(), 8000),
		];
		return () => timers.forEach(clearTimeout);
	}, [onComplete]);

	const handleClick = useCallback(() => {
		onComplete();
	}, [onComplete]);

	return (
		<motion.div
			className="fixed inset-0 z-50 flex items-center justify-center cursor-pointer overflow-hidden"
			onClick={handleClick}
			role="button"
			tabIndex={0}
			onKeyDown={(e) => e.key === "Enter" && handleClick()}
			aria-label="Skip intro"
		>
			{/* Background image with slow zoom */}
			<motion.div
				className="absolute inset-0"
				initial={{ scale: 1 }}
				animate={{ scale: 1.08 }}
				transition={{ duration: 12, ease: "linear" }}
			>
				<Image
					src="/images/hero.jpg"
					alt=""
					fill
					className="object-cover"
					priority
				/>
				<div className="absolute inset-0 bg-[#1A1A1A]/55" />
			</motion.div>

			{/* Text overlay */}
			<div className="relative z-10 flex flex-col items-center gap-8 px-6 text-center">
				<AnimatePresence>
					{textPhase >= 1 && (
						<motion.p
							key="greeting"
							initial={{ opacity: 0, y: 20, filter: "blur(8px)" }}
							animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
							transition={{ duration: 1.2, ease: "easeOut" }}
							className="text-[#F5F2EE]/60 text-xs tracking-[0.4em] uppercase font-medium"
						>
							{`Hello, ${coupleName}`}
						</motion.p>
					)}
				</AnimatePresence>

				<AnimatePresence>
					{textPhase >= 2 && (
						<motion.h1
							key="welcome"
							initial={{ opacity: 0, y: 20, filter: "blur(8px)" }}
							animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
							transition={{ duration: 1.4, ease: "easeOut" }}
							className="text-[#F5F2EE] text-5xl md:text-7xl lg:text-8xl font-light tracking-[-0.03em] text-balance leading-none"
						>
							Welcome to
							<br />
							<span className="font-medium">Cocoon</span>
						</motion.h1>
					)}
				</AnimatePresence>

				<AnimatePresence>
					{textPhase >= 3 && (
						<motion.div
							key="tagline"
							initial={{ opacity: 0, y: 12 }}
							animate={{ opacity: 1, y: 0 }}
							transition={{ duration: 1, ease: "easeOut" }}
							className="flex flex-col items-center gap-6"
						>
							<div className="h-px w-12 bg-[#DDE2D5]/40" />
							<p className="text-[#DDE2D5] text-lg md:text-xl font-light tracking-[0.2em]">
								Here, us.
							</p>
						</motion.div>
					)}
				</AnimatePresence>

				<AnimatePresence>
					{textPhase >= 3 && (
						<motion.p
							key="skip"
							initial={{ opacity: 0 }}
							animate={{ opacity: 0.4 }}
							transition={{ duration: 1, delay: 0.8 }}
							className="text-[#F5F2EE]/30 text-[10px] tracking-[0.3em] uppercase mt-16"
						>
							click anywhere to continue
						</motion.p>
					)}
				</AnimatePresence>
			</div>
		</motion.div>
	);
}
