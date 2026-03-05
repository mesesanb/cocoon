"use client";

import { format, parseISO } from "date-fns";
import { AnimatePresence, motion } from "framer-motion";
import { AlertCircle, Check, Eye, EyeOff, X } from "lucide-react";
import { useId, useState } from "react";
import { Calendar } from "@/components/ui/calendar";
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
import { useAuth } from "./auth-context";

interface AuthModalProps {
	isOpen: boolean;
	onClose: () => void;
	onSuccess?: () => void;
}

type Tab = "signin" | "signup";

// Country list for dropdown
const COUNTRIES = [
	"United States",
	"United Kingdom",
	"Canada",
	"Australia",
	"Germany",
	"France",
	"Japan",
	"Switzerland",
	"Netherlands",
	"Sweden",
	"Norway",
	"Denmark",
	"Italy",
	"Spain",
	"Portugal",
	"Austria",
	"Belgium",
	"Ireland",
	"New Zealand",
	"Singapore",
	"Mexico",
	"Brazil",
	"Argentina",
	"South Africa",
	"United Arab Emirates",
	"India",
	"South Korea",
	"Thailand",
	"Indonesia",
	"Malaysia",
	"Philippines",
	"Vietnam",
	"Poland",
	"Czech Republic",
	"Hungary",
	"Greece",
	"Turkey",
	"Israel",
	"Egypt",
	"Morocco",
	"Chile",
	"Colombia",
	"Peru",
	"Costa Rica",
	"Panama",
	"Other",
].sort();

export function AuthModal({ isOpen, onClose, onSuccess }: AuthModalProps) {
	const baseId = useId();
	const { signIn, signUp } = useAuth();
	const [tab, setTab] = useState<Tab>("signin");
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [confirmPassword, setConfirmPassword] = useState("");
	const [coupleName, setCoupleName] = useState("");
	const [birthDate, setBirthDate] = useState("");
	const [country, setCountry] = useState("");
	const [phoneNumber, setPhoneNumber] = useState("");
	const [showPassword, setShowPassword] = useState(false);
	const [showConfirmPassword, setShowConfirmPassword] = useState(false);
	const [error, setError] = useState("");
	const [isSubmitting, setIsSubmitting] = useState(false);

	// Password validation indicators
	const hasMinLength = password.length >= 8;
	const hasLowercase = /[a-z]/.test(password);
	const hasUppercase = /[A-Z]/.test(password);
	const hasNumber = /[0-9]/.test(password);
	const isPasswordValid =
		hasMinLength && hasLowercase && hasUppercase && hasNumber;
	const passwordsMatch =
		password === confirmPassword && confirmPassword.length > 0;

	// Age validation (must be 18+)
	const calculateAge = (birthDateStr: string) => {
		if (!birthDateStr) return 0;
		const today = new Date();
		const birth = new Date(birthDateStr);
		let age = today.getFullYear() - birth.getFullYear();
		const monthDiff = today.getMonth() - birth.getMonth();
		if (
			monthDiff < 0 ||
			(monthDiff === 0 && today.getDate() < birth.getDate())
		) {
			age--;
		}
		return age;
	};
	const age = calculateAge(birthDate);
	const isAdult = age >= 18;

	// Social auth handlers (mock for presentation)
	const handleSocialAuth = async (provider: "google" | "apple" | "x") => {
		setIsSubmitting(true);
		setError("");

		// Simulate OAuth flow delay
		await new Promise((resolve) => setTimeout(resolve, 1500));

		// Generate unique mock names for each provider
		const mockNames: Record<
			"google" | "apple" | "x",
			{ email: string; couple: string }
		> = {
			google: {
				email: `user.google.${Date.now()}@oauth.cocoon`,
				couple: `Google Couple ${Math.random().toString(36).substring(7)}`,
			},
			apple: {
				email: `user.apple.${Date.now()}@oauth.cocoon`,
				couple: `Apple Couple ${Math.random().toString(36).substring(7)}`,
			},
			x: {
				email: `user.x.${Date.now()}@oauth.cocoon`,
				couple: `X Couple ${Math.random().toString(36).substring(7)}`,
			},
		};

		const mockData = mockNames[provider];

		const result = await signUp(mockData.email, "OAuth2026!", mockData.couple);

		if (result.success) {
			onSuccess?.();
			onClose();
			resetForm();
		} else {
			setError(result.error || "Social authentication failed");
		}
		setIsSubmitting(false);
	};

	const resetForm = () => {
		setEmail("");
		setPassword("");
		setConfirmPassword("");
		setCoupleName("");
		setBirthDate("");
		setCountry("");
		setPhoneNumber("");
	};

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		setError("");

		// Sign up validations
		if (tab === "signup") {
			if (!isAdult) {
				setError("You must be at least 18 years old to create an account");
				return;
			}
			if (!passwordsMatch) {
				setError("Passwords do not match");
				return;
			}
			if (!isPasswordValid) {
				setError("Password does not meet requirements");
				return;
			}
		}

		setIsSubmitting(true);

		try {
			const result =
				tab === "signin"
					? await signIn(email, password)
					: await signUp(email, password, coupleName);

			if (result.success) {
				onSuccess?.();
				onClose();
				resetForm();
			} else {
				setError(result.error || "Something went wrong");
			}
		} finally {
			setIsSubmitting(false);
		}
	};

	const switchTab = (newTab: Tab) => {
		setTab(newTab);
		setError("");
	};

	const canSubmitSignUp =
		isPasswordValid &&
		passwordsMatch &&
		isAdult &&
		coupleName &&
		email &&
		country;

	return (
		<AnimatePresence>
			{isOpen && (
				<motion.div
					initial={{ opacity: 0 }}
					animate={{ opacity: 1 }}
					exit={{ opacity: 0 }}
					transition={{ duration: 0.2 }}
					className="fixed inset-0 z-[1000] flex items-center justify-center p-4"
				>
					{/* Backdrop */}
					<motion.div
						initial={{ opacity: 0 }}
						animate={{ opacity: 1 }}
						exit={{ opacity: 0 }}
						className="absolute inset-0 bg-soft-charcoal/60 backdrop-blur-sm"
						onClick={onClose}
					/>

					{/* Modal */}
					<motion.div
						initial={{ opacity: 0, scale: 0.95, y: 20 }}
						animate={{ opacity: 1, scale: 1, y: 0 }}
						exit={{ opacity: 0, scale: 0.95, y: 20 }}
						transition={{ duration: 0.25, ease: [0.23, 1, 0.32, 1] }}
						className="relative w-full max-w-md glass-heavy rounded-2xl p-6 md:p-8 max-h-[90vh] overflow-y-auto"
					>
						{/* Close button */}
						<button
							type="button"
							onClick={onClose}
							className="absolute top-4 right-4 p-2 rounded-full glass-button"
						>
							<X className="w-4 h-4" />
						</button>

						{/* Header */}
						<div className="text-center mb-6">
							<h2 className="text-2xl font-medium tracking-tight text-foreground">
								{tab === "signin" ? "Welcome back" : "Create your cocoon"}
							</h2>
							<p className="text-sm text-muted-foreground mt-2">
								{tab === "signin"
									? "Sign in to continue your journey"
									: "Start your retreat experience"}
							</p>
						</div>

						{/* Social Auth Buttons */}
						<div className="space-y-2 mb-6">
							<button
								type="button"
								onClick={() => handleSocialAuth("google")}
								disabled={isSubmitting}
								className="w-full py-3 rounded-xl glass-button flex items-center justify-center gap-3 text-sm font-medium disabled:opacity-50"
							>
								<svg className="w-5 h-5" viewBox="0 0 24 24" aria-hidden="true">
									<path
										fill="#4285F4"
										d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
									/>
									<path
										fill="#34A853"
										d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
									/>
									<path
										fill="#FBBC05"
										d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
									/>
									<path
										fill="#EA4335"
										d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
									/>
								</svg>
								Continue with Google
							</button>

							<button
								type="button"
								onClick={() => handleSocialAuth("apple")}
								disabled={isSubmitting}
								className="w-full py-3 rounded-xl glass-button flex items-center justify-center gap-3 text-sm font-medium disabled:opacity-50"
							>
								<svg
									className="w-5 h-5"
									viewBox="0 0 24 24"
									fill="currentColor"
									aria-hidden="true"
								>
									<path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z" />
								</svg>
								Continue with Apple
							</button>

							<button
								type="button"
								onClick={() => handleSocialAuth("x")}
								disabled={isSubmitting}
								className="w-full py-3 rounded-xl glass-button flex items-center justify-center gap-3 text-sm font-medium disabled:opacity-50"
							>
								<svg
									className="w-4 h-4"
									viewBox="0 0 24 24"
									fill="currentColor"
									aria-hidden="true"
								>
									<path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
								</svg>
								Continue with X
							</button>
						</div>

						{/* Divider */}
						<div className="relative mb-6">
							<div className="absolute inset-0 flex items-center">
								<div className="w-full border-t border-soft-charcoal/10"></div>
							</div>
							<div className="relative flex justify-center text-xs">
								<span className="px-3 bg-linen text-muted-foreground">
									or continue with email
								</span>
							</div>
						</div>

						{/* Tab switcher */}
						<div className="flex gap-2 mb-5 p-1 rounded-xl bg-soft-charcoal/5">
							<button
								type="button"
								onClick={() => switchTab("signin")}
								className={`flex-1 py-2.5 text-sm font-medium rounded-lg transition-all duration-200 ${
									tab === "signin"
										? "bg-background shadow-sm text-foreground"
										: "text-muted-foreground hover:text-foreground"
								}`}
							>
								Sign In
							</button>
							<button
								type="button"
								onClick={() => switchTab("signup")}
								className={`flex-1 py-2.5 text-sm font-medium rounded-lg transition-all duration-200 ${
									tab === "signup"
										? "bg-background shadow-sm text-foreground"
										: "text-muted-foreground hover:text-foreground"
								}`}
							>
								Sign Up
							</button>
						</div>

						{/* Form */}
						<form onSubmit={handleSubmit} className="space-y-4">
							{/* Sign up only fields */}
							<AnimatePresence mode="wait">
								{tab === "signup" && (
									<motion.div
										initial={{ opacity: 0, height: 0 }}
										animate={{ opacity: 1, height: "auto" }}
										exit={{ opacity: 0, height: 0 }}
										transition={{ duration: 0.2 }}
										className="space-y-4"
									>
										{/* Couple Name */}
										<div>
											<label
												htmlFor={`${baseId}-couple-name`}
												className="block text-sm font-medium text-foreground mb-2"
											>
												Couple Name <span className="text-red-400">*</span>
											</label>
											<input
												id={`${baseId}-couple-name`}
												type="text"
												value={coupleName}
												onChange={(e) => setCoupleName(e.target.value)}
												placeholder="e.g. Kai & Luna"
												className="glass-input w-full px-4 py-3 rounded-xl text-sm"
												required
											/>
										</div>

										{/* Date of Birth - for the youngest couple member*/}
										<div>
											<label
												htmlFor={`${baseId}-birth-date`}
												className="block text-sm font-medium text-foreground mb-2"
											>
												Date of Birth (for the youngest couple member){" "}
												<span className="text-red-400">*</span>
												<span className="text-muted-foreground font-normal ml-1">
													(Must be 18+)
												</span>
											</label>
											<Popover>
												<PopoverTrigger asChild>
													<button
														id={`${baseId}-birth-date`}
														type="button"
														className="glass-input w-full px-4 py-3 rounded-xl text-sm h-auto text-left font-normal border border-border"
													>
														{birthDate
															? format(parseISO(birthDate), "MMM d, yyyy")
															: "Select date"}
													</button>
												</PopoverTrigger>
												<PopoverContent
													className="glass-popover rounded-xl p-0 border-0 z-[1001] w-auto"
													align="start"
													sideOffset={6}
												>
													<Calendar
														mode="single"
														captionLayout="dropdown"
														selected={
															birthDate ? parseISO(birthDate) : undefined
														}
														onSelect={(date) =>
															setBirthDate(
																date ? format(date, "yyyy-MM-dd") : "",
															)
														}
														disabled={(date) => {
															const maxDate = new Date();
															maxDate.setFullYear(maxDate.getFullYear() - 18);
															return date > maxDate;
														}}
														fromYear={new Date().getFullYear() - 100}
														toYear={new Date().getFullYear()}
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
											{birthDate && !isAdult && (
												<p className="text-red-500 text-xs mt-1.5 flex items-center gap-1">
													<AlertCircle className="w-3 h-3" />
													You must be at least 18 years old
												</p>
											)}
											{birthDate && isAdult && (
												<p className="text-sage text-xs mt-1.5 flex items-center gap-1">
													<Check className="w-3 h-3" />
													Age verified ({age} years old)
												</p>
											)}
										</div>

										{/* Country */}
										<div>
											<label
												htmlFor={`${baseId}-country`}
												className="block text-sm font-medium text-foreground mb-2"
											>
												Country <span className="text-red-400">*</span>
											</label>
											<Select
												value={country || undefined}
												onValueChange={setCountry}
											>
												<SelectTrigger
													id={`${baseId}-country`}
													className="glass-input w-full px-4 py-3 rounded-xl text-sm h-auto border border-border [&_svg]:hidden"
												>
													<SelectValue placeholder="Select your country" />
												</SelectTrigger>
												<SelectContent
													className="glass-popover rounded-xl py-1 max-h-[280px] text-foreground border-0 z-[1001]"
													position="popper"
													sideOffset={6}
												>
													{COUNTRIES.map((c) => (
														<SelectItem
															key={c}
															value={c}
															className="rounded-lg mx-1 px-3 py-2.5 text-sm focus:bg-sage/25 focus:text-foreground data-[highlighted]:bg-sage/25 data-[highlighted]:text-foreground data-[state=checked]:font-semibold [&>span]:hidden"
														>
															{c}
														</SelectItem>
													))}
												</SelectContent>
											</Select>
										</div>

										{/* Phone Number */}
										<div>
											<label
												htmlFor={`${baseId}-phone`}
												className="block text-sm font-medium text-foreground mb-2"
											>
												Phone Number{" "}
												<span className="text-muted-foreground font-normal">
													(optional)
												</span>
											</label>
											<input
												id={`${baseId}-phone`}
												type="tel"
												value={phoneNumber}
												onChange={(e) => setPhoneNumber(e.target.value)}
												placeholder="+1 (555) 000-0000"
												className="glass-input w-full px-4 py-3 rounded-xl text-sm"
											/>
										</div>
									</motion.div>
								)}
							</AnimatePresence>

							{/* Email */}
							<div>
								<label
									htmlFor={`${baseId}-email`}
									className="block text-sm font-medium text-foreground mb-2"
								>
									Email{" "}
									{tab === "signup" && <span className="text-red-400">*</span>}
									{tab === "signin" && (
										<span className="text-muted-foreground font-normal">
											(optional)
										</span>
									)}
								</label>
								<input
									id={`${baseId}-email`}
									type="email"
									value={email}
									onChange={(e) => setEmail(e.target.value)}
									placeholder="your@email.com"
									className="glass-input w-full px-4 py-3 rounded-xl text-sm"
									required={tab === "signup"}
								/>
							</div>

							{/* Password */}
							<div>
								<label
									htmlFor={`${baseId}-password`}
									className="block text-sm font-medium text-foreground mb-2"
								>
									Password{" "}
									{tab === "signup" && <span className="text-red-400">*</span>}
									{tab === "signin" && (
										<span className="text-muted-foreground font-normal">
											(optional)
										</span>
									)}
								</label>
								<div className="relative">
									<input
										id={`${baseId}-password`}
										type={showPassword ? "text" : "password"}
										value={password}
										onChange={(e) => setPassword(e.target.value)}
										placeholder="Enter your password"
										className="glass-input w-full px-4 py-3 pr-12 rounded-xl text-sm"
										required={tab === "signup"}
									/>
									<button
										type="button"
										onClick={() => setShowPassword(!showPassword)}
										className="absolute right-3 top-1/2 -translate-y-1/2 p-1.5 rounded-lg hover:bg-soft-charcoal/5 transition-colors"
									>
										{showPassword ? (
											<EyeOff className="w-4 h-4 text-muted-foreground" />
										) : (
											<Eye className="w-4 h-4 text-muted-foreground" />
										)}
									</button>
								</div>

								{/* Password requirements (visible only for sign up when typing) */}
								{tab === "signup" && password.length > 0 && (
									<motion.div
										initial={{ opacity: 0, height: 0 }}
										animate={{ opacity: 1, height: "auto" }}
										className="mt-3 space-y-1.5"
									>
										<PasswordCheck
											label="At least 8 characters"
											valid={hasMinLength}
										/>
										<PasswordCheck
											label="One lowercase letter"
											valid={hasLowercase}
										/>
										<PasswordCheck
											label="One uppercase letter"
											valid={hasUppercase}
										/>
										<PasswordCheck label="One number" valid={hasNumber} />
									</motion.div>
								)}
							</div>

							{/* Confirm Password (sign up only) */}
							<AnimatePresence mode="wait">
								{tab === "signup" && (
									<motion.div
										initial={{ opacity: 0, height: 0 }}
										animate={{ opacity: 1, height: "auto" }}
										exit={{ opacity: 0, height: 0 }}
										transition={{ duration: 0.2 }}
									>
										<label
											htmlFor={`${baseId}-confirm-password`}
											className="block text-sm font-medium text-foreground mb-2"
										>
											Confirm Password <span className="text-red-400">*</span>
										</label>
										<div className="relative">
											<input
												id={`${baseId}-confirm-password`}
												type={showConfirmPassword ? "text" : "password"}
												value={confirmPassword}
												onChange={(e) => setConfirmPassword(e.target.value)}
												placeholder="Confirm your password"
												className="glass-input w-full px-4 py-3 pr-12 rounded-xl text-sm"
												required
											/>
											<button
												type="button"
												onClick={() =>
													setShowConfirmPassword(!showConfirmPassword)
												}
												className="absolute right-3 top-1/2 -translate-y-1/2 p-1.5 rounded-lg hover:bg-soft-charcoal/5 transition-colors"
											>
												{showConfirmPassword ? (
													<EyeOff className="w-4 h-4 text-muted-foreground" />
												) : (
													<Eye className="w-4 h-4 text-muted-foreground" />
												)}
											</button>
										</div>
										{confirmPassword.length > 0 && (
											<p
												className={`text-xs mt-1.5 flex items-center gap-1 ${passwordsMatch ? "text-sage" : "text-red-500"}`}
											>
												{passwordsMatch ? (
													<>
														<Check className="w-3 h-3" /> Passwords match
													</>
												) : (
													<>
														<AlertCircle className="w-3 h-3" /> Passwords do not
														match
													</>
												)}
											</p>
										)}
									</motion.div>
								)}
							</AnimatePresence>

							{/* Error message */}
							<AnimatePresence>
								{error && (
									<motion.div
										initial={{ opacity: 0, y: -10 }}
										animate={{ opacity: 1, y: 0 }}
										exit={{ opacity: 0, y: -10 }}
										className="flex items-center gap-2 p-3 rounded-xl bg-red-500/10 text-red-600 text-sm"
									>
										<AlertCircle className="w-4 h-4 flex-shrink-0" />
										{error}
									</motion.div>
								)}
							</AnimatePresence>

							{/* Submit button */}
							<button
								type="submit"
								disabled={
									isSubmitting || (tab === "signup" && !canSubmitSignUp)
								}
								className="w-full py-3.5 rounded-xl font-medium text-sm disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 bg-sage-deep text-primary-foreground hover:bg-sage-deep/90 focus-visible:ring-2 focus-visible:ring-sage-deep/40 focus-visible:ring-offset-2"
							>
								{isSubmitting ? (
									<span className="flex items-center justify-center gap-2">
										<motion.span
											animate={{ rotate: 360 }}
											transition={{
												duration: 1,
												repeat: Infinity,
												ease: "linear",
											}}
											className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full"
										/>
										{tab === "signin" ? "Signing in..." : "Creating account..."}
									</span>
								) : tab === "signin" ? (
									"Sign In"
								) : (
									"Create Account"
								)}
							</button>

							{/* Terms notice for sign up */}
							{tab === "signup" && (
								<p className="text-[10px] text-muted-foreground text-center leading-relaxed">
									By creating an account, you agree to our Terms of Service and
									Privacy Policy. Cocoon retreats are exclusively for couples
									aged 18 and over.
								</p>
							)}
						</form>
					</motion.div>
				</motion.div>
			)}
		</AnimatePresence>
	);
}

function PasswordCheck({ label, valid }: { label: string; valid: boolean }) {
	return (
		<div className="flex items-center gap-2 text-xs">
			{valid ? (
				<Check className="w-3.5 h-3.5 text-sage" />
			) : (
				<div className="w-3.5 h-3.5 rounded-full border border-muted-foreground/30" />
			)}
			<span className={valid ? "text-foreground" : "text-muted-foreground"}>
				{label}
			</span>
		</div>
	);
}
