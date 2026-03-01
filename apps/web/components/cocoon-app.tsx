"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useCallback, useEffect, useState } from "react";
import type { ScenarioType } from "@/types";
import { useAuth } from "./auth-context";
import { CocoonDiscovery } from "./cocoon-discovery";
import { Gateway } from "./gateway";
import { NarrativeIntro } from "./narrative-intro";

type Phase = "intro" | "gateway" | "discovery";

// orchestrates intro, gateway (landscape pick), and discovery; persists phase in sessionStorage
export function CocoonApp() {
	const { user, isLoading } = useAuth();
	const [phase, setPhase] = useState<Phase | null>(null);
	const [selectedScenario, setSelectedScenario] = useState<
		ScenarioType | undefined
	>();
	const [phaseHistory, setPhaseHistory] = useState<Phase[]>([]);

	useEffect(() => {
		if (isLoading) return;

		const hasSeenIntro = sessionStorage.getItem("cocoon-seen-intro");
		const storedPhase = sessionStorage.getItem("cocoon-phase") as Phase | null;
		const storedScenario = sessionStorage.getItem(
			"cocoon-scenario",
		) as ScenarioType | null;

		if (user) {
			if (!hasSeenIntro) {
				setPhase("intro");
			} else if (storedPhase && storedPhase !== "intro") {
				setPhase(storedPhase);
				if (storedScenario) setSelectedScenario(storedScenario);
			} else {
				setPhase("intro");
			}
		} else {
			sessionStorage.removeItem("cocoon-seen-intro");
			setPhase("gateway");
		}
	}, [user, isLoading]);

	const coupleName = user?.coupleName || "Dear Traveler";

	const handleIntroComplete = useCallback(() => {
		setPhaseHistory((prev) => [...prev, "intro"]);
		setPhase("gateway");
		sessionStorage.setItem("cocoon-phase", "gateway");
		sessionStorage.setItem("cocoon-seen-intro", "true");
	}, []);

	const handleScenarioSelect = useCallback((scenario: ScenarioType) => {
		setPhaseHistory((prev) => [...prev, "gateway"]);
		setSelectedScenario(scenario);
		setPhase("discovery");
		sessionStorage.setItem("cocoon-phase", "discovery");
		sessionStorage.setItem("cocoon-scenario", scenario);
	}, []);

	const handleBack = useCallback(() => {
		if (phaseHistory.length > 0) {
			const previousPhase = phaseHistory[phaseHistory.length - 1];
			setPhaseHistory((prev) => prev.slice(0, -1));
			setPhase(previousPhase);
			sessionStorage.setItem("cocoon-phase", previousPhase);
		} else if (phase === "discovery") {
			setPhase("gateway");
			sessionStorage.setItem("cocoon-phase", "gateway");
		} else if (phase === "gateway" && user) {
			setPhase("intro");
			sessionStorage.setItem("cocoon-phase", "intro");
		}
	}, [phaseHistory, phase, user]);

	if (isLoading || phase === null) {
		return (
			<div className="min-h-screen bg-linen flex items-center justify-center">
				<motion.p
					animate={{ opacity: [0.3, 1, 0.3] }}
					transition={{ repeat: Infinity, duration: 1.5 }}
					className="text-muted-foreground text-xs tracking-[0.2em] uppercase"
				>
					Preparing your cocoon...
				</motion.p>
			</div>
		);
	}

	return (
		<div className="relative min-h-screen bg-linen">
			<AnimatePresence mode="sync">
				{phase === "intro" && (
					<motion.div
						key="intro"
						exit={{ opacity: 0 }}
						transition={{ duration: 0.8, ease: "easeInOut" }}
						className="absolute inset-0"
					>
						<NarrativeIntro
							coupleName={coupleName}
							onComplete={handleIntroComplete}
						/>
					</motion.div>
				)}

				{phase === "gateway" && (
					<motion.div
						key="gateway"
						initial={{ opacity: 0 }}
						animate={{ opacity: 1 }}
						exit={{ opacity: 0 }}
						transition={{ duration: 0.6, ease: "easeInOut" }}
						className="absolute inset-0"
					>
						<Gateway onSelect={handleScenarioSelect} />
					</motion.div>
				)}

				{phase === "discovery" && (
					<motion.div
						key="discovery"
						initial={{ opacity: 0 }}
						animate={{ opacity: 1 }}
						transition={{ duration: 0.5 }}
					>
						<CocoonDiscovery
							initialScenario={selectedScenario}
							onBack={handleBack}
						/>
					</motion.div>
				)}
			</AnimatePresence>
		</div>
	);
}
