"use client";

import {
	createContext,
	type ReactNode,
	useContext,
	useEffect,
	useState,
} from "react";

export interface User {
	email: string;
	coupleName: string;
}

interface AuthContextType {
	user: User | null;
	isLoading: boolean;
	signIn: (
		email: string,
		password: string,
	) => Promise<{ success: boolean; error?: string }>;
	signUp: (
		email: string,
		password: string,
		coupleName: string,
	) => Promise<{ success: boolean; error?: string }>;
	signOut: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const STORAGE_KEY = "cocoon_user";

const isValidEmail = (email: string): boolean => {
	return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
};

const isValidPassword = (password: string): boolean => {
	return (
		password.length >= 8 &&
		/[a-z]/.test(password) &&
		/[A-Z]/.test(password) &&
		/[0-9]/.test(password)
	);
};

// mock auth: user in state and localStorage, default user on first visit
export function AuthProvider({ children }: { children: ReactNode }) {
	const [user, setUser] = useState<User | null>(null);
	const [isLoading, setIsLoading] = useState(true);

	useEffect(() => {
		const stored = localStorage.getItem(STORAGE_KEY);
		if (stored) {
			try {
				setUser(JSON.parse(stored));
			} catch {
				const defaultUser = {
					email: "kai.luna@cocoon.us",
					coupleName: "Kai & Luna",
				};
				setUser(defaultUser);
				localStorage.setItem(STORAGE_KEY, JSON.stringify(defaultUser));
			}
		} else {
			const defaultUser = {
				email: "kai.luna@cocoon.us",
				coupleName: "Kai & Luna",
			};
			setUser(defaultUser);
			localStorage.setItem(STORAGE_KEY, JSON.stringify(defaultUser));
		}
		setIsLoading(false);
	}, []);

	const signIn = async (
		email: string,
		password: string,
	): Promise<{ success: boolean; error?: string }> => {
		if (!isValidEmail(email)) {
			return { success: false, error: "Please enter a valid email address" };
		}
		if (!isValidPassword(password)) {
			return {
				success: false,
				error:
					"Password must be at least 8 characters with uppercase, lowercase, and a number",
			};
		}

		const emailPrefix = email.split("@")[0];
		const coupleName = emailPrefix
			.split(/[._-]/)
			.map((part) => part.charAt(0).toUpperCase() + part.slice(1))
			.join(" & ");

		const newUser = { email, coupleName };
		setUser(newUser);
		localStorage.setItem(STORAGE_KEY, JSON.stringify(newUser));
		return { success: true };
	};

	const signUp = async (
		email: string,
		password: string,
		coupleName: string,
	): Promise<{ success: boolean; error?: string }> => {
		if (!isValidEmail(email)) {
			return { success: false, error: "Please enter a valid email address" };
		}
		if (!isValidPassword(password)) {
			return {
				success: false,
				error:
					"Password must be at least 8 characters with uppercase, lowercase, and a number",
			};
		}
		if (coupleName.trim().length < 2) {
			return { success: false, error: "Please enter your couple name" };
		}

		const newUser = { email, coupleName: coupleName.trim() };
		setUser(newUser);
		localStorage.setItem(STORAGE_KEY, JSON.stringify(newUser));
		return { success: true };
	};

	const signOut = () => {
		setUser(null);
		localStorage.removeItem(STORAGE_KEY);
	};

	return (
		<AuthContext.Provider value={{ user, isLoading, signIn, signUp, signOut }}>
			{children}
		</AuthContext.Provider>
	);
}

// must be used inside AuthProvider
export function useAuth() {
	const context = useContext(AuthContext);
	if (context === undefined) {
		throw new Error("useAuth must be used within an AuthProvider");
	}
	return context;
}
