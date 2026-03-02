"use client";

import {
	Tooltip,
	TooltipContent,
	TooltipTrigger,
} from "@/components/ui/tooltip";
import { motion } from "framer-motion";
import { ArrowRight, Search } from "lucide-react";
import { useState } from "react";

interface SearchBarProps {
	value: string;
	onChange: (value: string) => void;
	onSearch: () => void;
}

export function SearchBar({ value, onChange, onSearch }: SearchBarProps) {
	const [isFocused, setIsFocused] = useState(false);

	return (
		<motion.div
			initial={{ opacity: 0, y: 12 }}
			animate={{ opacity: 1, y: 0 }}
			transition={{ duration: 0.5, delay: 0.2 }}
			className="w-full max-w-xl mx-auto"
		>
			<div
				className={`glass-heavy rounded-2xl flex items-center gap-3 px-5 py-3.5 transition-all duration-300 ${
					isFocused ? "ring-2 ring-sage-deep/15" : ""
				}`}
			>
				<Search className="h-4 w-4 text-muted-foreground/60 shrink-0" />
				<input
					type="text"
					value={value}
					onChange={(e) => onChange(e.target.value)}
					onFocus={() => setIsFocused(true)}
					onBlur={() => setIsFocused(false)}
					onKeyDown={(e) => e.key === "Enter" && onSearch()}
					placeholder="Search sanctuaries..."
					className="flex-1 bg-transparent text-foreground placeholder:text-muted-foreground/40 text-sm outline-none cursor-text"
					aria-label="Search for retreats"
				/>
				<Tooltip>
					<TooltipTrigger asChild>
						<button
							type="button"
							className="shrink-0 glass-button rounded-full p-2 text-sage-deep cursor-pointer"
							aria-label="Search"
							onClick={onSearch}
						>
							<ArrowRight className="h-3.5 w-3.5" />
						</button>
					</TooltipTrigger>
					<TooltipContent side="bottom">Search</TooltipContent>
				</Tooltip>
			</div>
		</motion.div>
	);
}
