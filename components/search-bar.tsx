"use client";

import { ArrowRight, Mic, Search, SlidersHorizontal, X } from "lucide-react";
import { useState } from "react";
import {
	Tooltip,
	TooltipContent,
	TooltipTrigger,
} from "@/components/ui/tooltip";

interface SearchBarProps {
	value: string;
	onChange: (value: string) => void;
	onSearch: () => void;
	/** Called when user clears the input (e.g. clicks X); use to clear results */
	onClear?: () => void;
	/** Opens the filters UI (amenities, etc). If omitted, no Filters button is shown. */
	onOpenFilters?: () => void;
	/** Number of active filters (shown as a small badge). */
	filtersCount?: number;
}

export function SearchBar({
	value,
	onChange,
	onSearch,
	onClear,
	onOpenFilters,
	filtersCount = 0,
}: SearchBarProps) {
	const [isFocused, setIsFocused] = useState(false);

	return (
		<div className="w-full max-w-3xl mx-auto">
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
					placeholder="Eg. 'Treehouse', 'Cube', 'Lake', 'Dome'	 "
					className="flex-1 min-w-0 bg-transparent text-foreground placeholder:text-muted-foreground/40 text-sm outline-none cursor-text"
					aria-label="Search for retreats"
				/>
				{value.length > 0 && (
					<Tooltip>
						<TooltipTrigger asChild>
							<button
								type="button"
								onClick={() => {
									onChange("");
									onClear?.();
								}}
								className="shrink-0 glass-button rounded-full p-2 text-muted-foreground hover:text-foreground cursor-pointer"
								aria-label="Clear search"
							>
								<X className="h-3.5 w-3.5" />
							</button>
						</TooltipTrigger>
						<TooltipContent side="bottom">Clear</TooltipContent>
					</Tooltip>
				)}
				{onOpenFilters && (
					<Tooltip>
						<TooltipTrigger asChild>
							<button
								type="button"
								onClick={onOpenFilters}
								className="relative shrink-0 glass-button rounded-full p-2 text-muted-foreground hover:text-foreground cursor-pointer"
								aria-label={
									filtersCount > 0
										? `Open filters (${filtersCount} active)`
										: "Open filters"
								}
							>
								<SlidersHorizontal className="h-3.5 w-3.5" />
								{filtersCount > 0 && (
									<span className="absolute -top-1 -right-1 h-4 min-w-4 px-1 rounded-full bg-sage-deep text-primary-foreground text-[10px] leading-4 text-center">
										{filtersCount > 9 ? "9+" : filtersCount}
									</span>
								)}
							</button>
						</TooltipTrigger>
						<TooltipContent side="bottom">Filters</TooltipContent>
					</Tooltip>
				)}
				<Tooltip>
					<TooltipTrigger asChild>
						<button
							type="button"
							className="shrink-0 glass-button rounded-full p-2 text-muted-foreground hover:text-foreground cursor-pointer"
							aria-label="Voice search"
						>
							<Mic className="h-3.5 w-3.5" />
						</button>
					</TooltipTrigger>
					<TooltipContent side="bottom">
						Voice search (not yet wired)
					</TooltipContent>
				</Tooltip>
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
		</div>
	);
}
