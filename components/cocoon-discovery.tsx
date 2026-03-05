"use client";

import { useQuery } from "@tanstack/react-query";
import { format, parseISO, startOfDay } from "date-fns";
import { motion } from "framer-motion";
import {
	AlertCircle,
	ArrowLeft,
	LayoutGrid,
	List,
	LogIn,
	LogOut,
	Mic,
	Search as SearchIcon,
	X,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useCallback, useState } from "react";
import { Calendar } from "@/components/ui/calendar";
import { Checkbox } from "@/components/ui/checkbox";
import {
	Command,
	CommandEmpty,
	CommandItem,
	CommandList,
} from "@/components/ui/command";
import {
	Popover,
	PopoverContent,
	PopoverTrigger,
} from "@/components/ui/popover";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import {
	Sheet,
	SheetContent,
	SheetFooter,
	SheetHeader,
	SheetTitle,
} from "@/components/ui/sheet";
import {
	Tooltip,
	TooltipContent,
	TooltipTrigger,
} from "@/components/ui/tooltip";
import type { ScenarioType, Stay } from "@/types";
import { useAuth } from "./auth-context";
import { AuthModal } from "./auth-modal";
import { CocoonFooter } from "./cocoon-footer";
import { SearchBar } from "./search-bar";
import { StayCard } from "./stay-card";
import { StayCardList } from "./stay-card-list";

const HEADER_OFFSET_PX = 57;

function formatDateLabel(iso: string, fallback: string): string {
	try {
		return format(parseISO(iso), "MMM d");
	} catch {
		return fallback;
	}
}

interface CocoonDiscoveryProps {
	initialScenario?: ScenarioType;
	backgroundImage?: string;
	onBack?: () => void;
}

const SCENARIO_IMAGES: Record<ScenarioType, string> = {
	CITY: "/images/city/39.jpg",
	FOREST: "/images/forest/01.jpg",
	MOUNTAINS: "/images/mountains/36.jpg",
	SEA: "/images/sea/10.jpg",
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
	const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
	const [sortBy, setSortBy] = useState<
		"price_asc" | "price_desc" | "rating_asc" | "rating_desc" | "reviews_desc"
	>("reviews_desc");
	const [dateBegin, setDateBegin] = useState("");
	const [dateEnd, setDateEnd] = useState("");
	const [openBeginStay, setOpenBeginStay] = useState(false);
	const [openEndStay, setOpenEndStay] = useState(false);
	const [filtersOpen, setFiltersOpen] = useState(false);
	const [amenitiesSelected, setAmenitiesSelected] = useState<string[]>([]);
	const [amenitiesDraft, setAmenitiesDraft] = useState<string[]>([]);
	const [amenitiesSearch, setAmenitiesSearch] = useState("");

	const { data: allStays = [] } = useQuery<Stay[], Error>({
		queryKey: ["stays_all_for_amenities"],
		queryFn: async () => {
			const res = await fetch("/api/stays");
			if (!res.ok) throw new Error(`Failed to fetch stays: ${res.status}`);
			return res.json();
		},
		retry: 2,
		retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
	});

	const availableAmenities = Array.from(
		new Set(allStays.flatMap((s) => (s.amenities ?? []).map((a) => String(a)))),
	).sort((a, b) => a.localeCompare(b));

	const {
		data: stays = [],
		isLoading,
		isError: staysError,
		error: staysErrorObj,
		refetch: refetchStays,
	} = useQuery<Stay[], Error>({
		queryKey: [
			"stays",
			activeScenario,
			activeQuery,
			sortBy,
			dateBegin,
			dateEnd,
			amenitiesSelected.join(","),
		],
		queryFn: async () => {
			const params = new URLSearchParams();
			if (activeScenario) params.set("type", activeScenario);
			if (activeQuery) params.set("query", activeQuery);
			if (dateBegin) params.set("checkIn", dateBegin);
			if (dateEnd) params.set("checkOut", dateEnd);
			if (amenitiesSelected.length > 0)
				params.set("amenities", amenitiesSelected.join(","));
			params.set("sort", sortBy);
			const res = await fetch(`/api/stays?${params.toString()}`);
			if (!res.ok) throw new Error(`Failed to fetch stays: ${res.status}`);
			return res.json();
		},
		retry: 2,
		retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
	});

	const handleSearch = useCallback(() => {
		setActiveQuery(searchQuery);
		setActiveScenario(undefined); // reset to All so search has more chances to find results
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
				<Image
					src={bgImage}
					alt=""
					fill
					className="object-cover"
					priority
					unoptimized
				/>
				<div className="absolute inset-0 backdrop-blur-3xl bg-[#F5F2EE]/75" />
			</div>

			{/* Navigation */}
			<header className="sticky top-0 z-30 glass-header rounded-none">
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
								<TooltipContent side="bottom">
									Back to landscape selection
								</TooltipContent>
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
						{user && (
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
								<TooltipContent side="bottom">Our bookings</TooltipContent>
							</Tooltip>
						)}
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
				<div className="flex flex-col items-center gap-6 md:gap-8 mb-3">
					<motion.div
						initial={{ opacity: 0, y: 12 }}
						animate={{ opacity: 1, y: 0 }}
						className="text-center shrink-0"
					>
						<h1 className="text-foreground text-2xl md:text-5xl font-light tracking-[-0.03em] text-balance">
							fill the space together
						</h1>
						<p className="text-muted-foreground text-xs md:text-sm mt-2 md:mt-3 font-light">
							retreats designed for two
						</p>
					</motion.div>
					<SearchBar
						value={searchQuery}
						onChange={setSearchQuery}
						onSearch={handleSearch}
						onClear={() => {
							setSearchQuery("");
							setActiveQuery("");
						}}
						onOpenFilters={() => {
							setAmenitiesDraft(amenitiesSelected);
							setAmenitiesSearch("");
							setFiltersOpen(true);
						}}
						filtersCount={amenitiesSelected.length}
					/>
				</div>

				<Sheet open={filtersOpen} onOpenChange={setFiltersOpen}>
					<SheetContent
						side="bottom"
						className="bg-transparent border-0 p-0 flex items-center justify-center py-8 [data-slot=sheet-close]:hidden"
						onInteractOutside={(event) => {
							// Do not close when clicking outside; only explicit controls close.
							event.preventDefault();
						}}
					>
						<div className="glass-header relative mx-5 w-full max-w-sm rounded-3xl pt-5 pb-5 h-130">
							<button
								type="button"
								onClick={() => setFiltersOpen(false)}
								className="absolute top-3 right-3 flex h-7 w-7 items-center justify-center rounded-full bg-white/40 text-muted-foreground hover:bg-white/60 cursor-pointer shadow-sm"
								aria-label="Close filters"
							>
								<X className="h-4 w-4" />
							</button>
							<SheetHeader className="px-5 pt-5 pb-3">
								<SheetTitle className="text-foreground text-xs font-semibold tracking-wider uppercase">
									Filters
								</SheetTitle>
								<div className="text-muted-foreground text-xs mt-1">
									Amenities
								</div>
							</SheetHeader>

							<div className="px-5 pb-4 h-90">
								<Command className="glass rounded-2xl border-0 bg-transparent h-full">
									<div className="flex items-center gap-2 px-3 py-2 border-b">
										<SearchIcon className="h-4 w-4 text-muted-foreground/70 shrink-0" />
										<input
											type="text"
											placeholder="Eg. 'Bike', 'Fireplace'"
											value={amenitiesSearch}
											onChange={(e) => setAmenitiesSearch(e.target.value)}
											className="flex-1 min-w-0 bg-transparent text-foreground placeholder:text-muted-foreground/40 text-sm outline-none"
										/>
										{amenitiesSearch.trim().length > 0 && (
											<Tooltip>
												<TooltipTrigger asChild>
													<button
														type="button"
														onClick={() => setAmenitiesSearch("")}
														className="glass-button rounded-full h-7 w-7 flex items-center justify-center text-muted-foreground hover:text-foreground cursor-pointer"
														aria-label="Clear amenity search"
													>
														<X className="h-3.5 w-3.5" />
													</button>
												</TooltipTrigger>
												<TooltipContent side="bottom">
													Clear amenity search
												</TooltipContent>
											</Tooltip>
										)}
										<Tooltip>
											<TooltipTrigger asChild>
												<button
													type="button"
													className="glass-button rounded-full h-7 w-7 flex items-center justify-center text-muted-foreground hover:text-foreground cursor-pointer"
													aria-label="Voice amenity search"
												>
													<Mic className="h-3.5 w-3.5" />
												</button>
											</TooltipTrigger>
											<TooltipContent side="bottom">
												Voice search (not yet wired)
											</TooltipContent>
										</Tooltip>
									</div>
									<CommandList className="max-h-[45vh] grid grid-cols-2 gap-1.5 px-2 py-2">
										<CommandEmpty className="col-span-2 text-center text-xs text-muted-foreground">
											No amenities found.
										</CommandEmpty>
										{availableAmenities
											.filter((a) =>
												amenitiesSearch.trim()
													? a
															.toLowerCase()
															.includes(amenitiesSearch.trim().toLowerCase())
													: true,
											)
											.map((amenity) => {
												const checked = amenitiesDraft.includes(amenity);
												return (
													<CommandItem
														key={amenity}
														value={amenity}
														onSelect={() => {
															setAmenitiesDraft((prev) =>
																prev.includes(amenity)
																	? prev.filter((x) => x !== amenity)
																	: [...prev, amenity],
															);
														}}
														className="cursor-pointer rounded-xl hover:bg-white/25 data-[selected=true]:bg-sage/35 data-[selected=true]:text-foreground transition-colors"
													>
														<Checkbox
															checked={checked}
															aria-hidden
															className="mr-2"
														/>
														<span className="text-sm">{amenity}</span>
													</CommandItem>
												);
											})}
									</CommandList>
								</Command>
							</div>

							<SheetFooter className="px-5 pb-5 pt-0">
								<div className="flex items-center gap-2">
									<button
										type="button"
										className="glass-button rounded-full h-9 px-4 text-[11px] tracking-[0.1em] uppercase font-medium text-foreground bg-white/40"
										onClick={() => setAmenitiesDraft([])}
									>
										Clear
									</button>
									<button
										type="button"
										className="rounded-2xl h-9 px-5 text-[11px] tracking-[0.1em] uppercase font-semibold bg-sage-deep text-primary-foreground hover:bg-sage-deep/90 transition-all shadow-sm flex-1"
										onClick={() => {
											setAmenitiesSelected(amenitiesDraft);
											setFiltersOpen(false);
										}}
									>
										Apply
									</button>
								</div>
							</SheetFooter>
						</div>
					</SheetContent>
				</Sheet>

				{/* Toolbar: full viewport width (covers cards left and right), same height as header, rounded bottom, glass */}
				<div
					className="sticky z-20 w-screen ml-[calc(-50vw+50%)]"
					style={{ top: HEADER_OFFSET_PX }}
				>
					{/* Horizontal scroll when narrow so toolbar stays one row (no wrap/overlap) */}
					<div className="glass-header scrollbar-glass rounded-b-xl py-3 md:py-4 overflow-x-auto overflow-y-hidden scroll-smooth [scrollbar-gutter:stable]">
						<div className="flex items-center flex-nowrap gap-2 md:gap-3 mx-auto max-w-7xl px-4 md:px-6 min-w-full w-max">
							{/* Left: scenario chips */}
							<div className="flex items-center gap-1.5 shrink-0">
								<button
									type="button"
									onClick={() => setActiveScenario(undefined)}
									className={`h-8 flex items-center rounded-full px-3 md:px-4 text-[10px] md:text-[11px] tracking-[0.1em] uppercase font-medium transition-all duration-300 ${
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
											className={`h-8 flex items-center rounded-full px-3 md:px-4 text-[10px] md:text-[11px] tracking-[0.1em] uppercase font-medium transition-all duration-300 ${
												activeScenario === type
													? "bg-sage-deep text-primary-foreground shadow-sm"
													: "glass-button text-foreground"
											}`}
										>
											{type}
										</button>
									),
								)}
							</div>
							{/* Center: Begin / End stay — in the middle of the space between SEA and Top reviewed */}
							<div className="flex-1 flex justify-center items-center px-2 shrink-0 min-w-48">
								<div className="flex items-center gap-2">
									<Popover open={openBeginStay} onOpenChange={setOpenBeginStay}>
										<PopoverTrigger asChild>
											<button
												type="button"
												className="glass-input h-8 flex items-center rounded-full px-3 text-foreground text-[11px] font-medium border border-border min-w-28 cursor-pointer"
											>
												{dateBegin
													? formatDateLabel(dateBegin, "Begin stay")
													: "Begin stay"}
											</button>
										</PopoverTrigger>
										<PopoverContent
											className="glass-popover rounded-xl p-0 border-0 w-auto"
											align="start"
											sideOffset={6}
										>
											<Calendar
												mode="single"
												captionLayout="dropdown"
												selected={dateBegin ? parseISO(dateBegin) : undefined}
												onSelect={(date) => {
													setDateBegin(date ? format(date, "yyyy-MM-dd") : "");
													setOpenBeginStay(false);
												}}
												disabled={(date) => date < startOfDay(new Date())}
												fromYear={new Date().getFullYear()}
												toYear={new Date().getFullYear() + 2}
												className="rounded-xl [--cell-size:2.25rem] border-0 bg-transparent p-3 text-foreground [&_[data-selected-single=true]]:bg-sage-deep [&_[data-selected-single=true]]:text-primary-foreground"
												classNames={{
													button_previous:
														"text-foreground hover:bg-sage/20 hover:text-foreground",
													button_next:
														"text-foreground hover:bg-sage/20 hover:text-foreground",
													dropdown_root:
														"border-border bg-transparent text-foreground rounded-md",
													caption_label: "text-foreground",
												}}
											/>
										</PopoverContent>
									</Popover>
									<Popover open={openEndStay} onOpenChange={setOpenEndStay}>
										<PopoverTrigger asChild>
											<button
												type="button"
												className="glass-input h-8 flex items-center rounded-full px-3 text-foreground text-[11px] font-medium border border-border min-w-28 cursor-pointer"
											>
												{dateEnd
													? formatDateLabel(dateEnd, "End stay")
													: "End stay"}
											</button>
										</PopoverTrigger>
										<PopoverContent
											className="glass-popover rounded-xl p-0 border-0 w-auto"
											align="start"
											sideOffset={6}
										>
											<Calendar
												mode="single"
												captionLayout="dropdown"
												selected={dateEnd ? parseISO(dateEnd) : undefined}
												onSelect={(date) => {
													setDateEnd(date ? format(date, "yyyy-MM-dd") : "");
													setOpenEndStay(false);
												}}
												disabled={(date) => {
													const min = dateBegin
														? startOfDay(parseISO(dateBegin))
														: startOfDay(new Date());
													return date < min;
												}}
												fromYear={new Date().getFullYear()}
												toYear={new Date().getFullYear() + 2}
												className="rounded-xl [--cell-size:2.25rem] border-0 bg-transparent p-3 text-foreground [&_[data-selected-single=true]]:bg-sage-deep [&_[data-selected-single=true]]:text-primary-foreground"
												classNames={{
													button_previous:
														"text-foreground hover:bg-sage/20 hover:text-foreground",
													button_next:
														"text-foreground hover:bg-sage/20 hover:text-foreground",
													dropdown_root:
														"border-border bg-transparent text-foreground rounded-md",
													caption_label: "text-foreground",
												}}
											/>
										</PopoverContent>
									</Popover>
								</div>
							</div>
							{/* Right: count, sort, view */}
							<div className="flex items-center gap-1.5 md:gap-2 shrink-0">
								<p className="text-muted-foreground text-[11px] h-8 flex items-center">
									{stays.length} retreat{stays.length === 1 ? "" : "s"} found
								</p>
								<Select
									value={sortBy}
									onValueChange={(value) => {
										const validSorts = [
											"price_asc",
											"price_desc",
											"rating_asc",
											"rating_desc",
											"reviews_desc",
										] as const;
										if (
											validSorts.includes(value as (typeof validSorts)[number])
										) {
											setSortBy(value as (typeof validSorts)[number]);
										}
									}}
								>
									<SelectTrigger
										className="glass-button h-8 flex items-center rounded-full px-3 md:px-4 text-[10px] md:text-[11px] tracking-[0.1em] uppercase font-medium text-foreground focus:ring-2 focus:ring-sage-deep/40 focus:ring-offset-1 border-0 min-w-0 w-fit gap-1.5 [&_svg]:hidden"
										aria-label="Sort by"
									>
										<SelectValue />
									</SelectTrigger>
									<SelectContent
										className="glass-popover rounded-xl py-1 min-w-[var(--radix-select-trigger-width)] text-foreground"
										position="popper"
										sideOffset={6}
									>
										<SelectItem
											value="price_asc"
											className="text-[10px] md:text-[11px] tracking-[0.1em] uppercase font-medium rounded-md mx-1 px-3 py-2 pr-3 focus:bg-sage/25 focus:text-foreground data-[highlighted]:bg-sage/25 data-[highlighted]:text-foreground data-[state=checked]:font-bold [&>span]:hidden"
										>
											Price low to high
										</SelectItem>
										<SelectItem
											value="price_desc"
											className="text-[10px] md:text-[11px] tracking-[0.1em] uppercase font-medium rounded-md mx-1 px-3 py-2 pr-3 focus:bg-sage/25 focus:text-foreground data-[highlighted]:bg-sage/25 data-[highlighted]:text-foreground data-[state=checked]:font-bold [&>span]:hidden"
										>
											Price high to low
										</SelectItem>
										<SelectItem
											value="rating_asc"
											className="text-[10px] md:text-[11px] tracking-[0.1em] uppercase font-medium rounded-md mx-1 px-3 py-2 pr-3 focus:bg-sage/25 focus:text-foreground data-[highlighted]:bg-sage/25 data-[highlighted]:text-foreground data-[state=checked]:font-bold [&>span]:hidden"
										>
											Rating low to high
										</SelectItem>
										<SelectItem
											value="rating_desc"
											className="text-[10px] md:text-[11px] tracking-[0.1em] uppercase font-medium rounded-md mx-1 px-3 py-2 pr-3 focus:bg-sage/25 focus:text-foreground data-[highlighted]:bg-sage/25 data-[highlighted]:text-foreground data-[state=checked]:font-bold [&>span]:hidden"
										>
											Rating high to low
										</SelectItem>
										<SelectItem
											value="reviews_desc"
											className="text-[10px] md:text-[11px] tracking-[0.1em] uppercase font-medium rounded-md mx-1 px-3 py-2 pr-3 focus:bg-sage/25 focus:text-foreground data-[highlighted]:bg-sage/25 data-[highlighted]:text-foreground data-[state=checked]:font-bold [&>span]:hidden"
										>
											Top reviewed
										</SelectItem>
									</SelectContent>
								</Select>
								<div className="inline-flex h-8 items-center rounded-full bg-foreground/5 px-1 shadow-sm">
									<Tooltip>
										<TooltipTrigger asChild>
											<button
												type="button"
												onClick={() => setViewMode("grid")}
												className={`inline-flex h-6 w-6 items-center justify-center rounded-full text-[10px] md:text-xs transition-colors ${
													viewMode === "grid"
														? "bg-background text-foreground shadow-sm"
														: "text-muted-foreground/70 hover:text-foreground"
												}`}
												aria-label="Grid view"
											>
												<LayoutGrid className="h-3.5 w-3.5" />
											</button>
										</TooltipTrigger>
										<TooltipContent side="bottom">Grid view</TooltipContent>
									</Tooltip>
									<Tooltip>
										<TooltipTrigger asChild>
											<button
												type="button"
												onClick={() => setViewMode("list")}
												className={`ml-0.5 inline-flex h-6 w-6 items-center justify-center rounded-full text-[10px] md:text-xs transition-colors ${
													viewMode === "list"
														? "bg-background text-foreground shadow-sm"
														: "text-muted-foreground/70 hover:text-foreground"
												}`}
												aria-label="List view"
											>
												<List className="h-3.5 w-3.5" />
											</button>
										</TooltipTrigger>
										<TooltipContent side="bottom">List view</TooltipContent>
									</Tooltip>
								</div>
							</div>
						</div>
					</div>
				</div>

				<div className="mb-6" />

				{/* Listings */}
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
				) : staysError ? (
					<div className="flex items-center justify-center py-24">
						<div className="rounded-lg bg-red-50 border border-red-200 p-6 max-w-md">
							<div className="flex gap-3 items-start">
								<AlertCircle className="h-5 w-5 text-red-600 flex-shrink-0 mt-0.5" />
								<div className="flex-1">
									<h3 className="font-semibold text-red-900 mb-1">
										Failed to Load Retreats
									</h3>
									<p className="text-sm text-red-700 mb-4">
										{staysErrorObj?.message || "An unexpected error occurred"}
									</p>
									<button
										type="button"
										onClick={() => refetchStays()}
										className="px-4 py-2 bg-red-600 text-white rounded-lg font-medium hover:bg-red-700 transition-colors"
									>
										Try Again
									</button>
								</div>
							</div>
						</div>
					</div>
				) : stays.length === 0 ? (
					<div className="flex items-center justify-center py-24">
						<p className="text-muted-foreground text-sm">
							No retreats found. Adjust your search.
						</p>
					</div>
				) : viewMode === "grid" ? (
					<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-5">
						{stays.map((stay, i) => (
							<StayCard key={stay.id} stay={stay} mode="listing" index={i} />
						))}
					</div>
				) : (
					<div className="flex flex-col gap-2 sm:gap-3">
						{stays.map((stay, i) => (
							<StayCardList key={stay.id} stay={stay} index={i} />
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
