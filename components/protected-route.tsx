"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { useAuth } from "./auth-context";

interface ProtectedRouteProps {
	children: React.ReactNode;
}

export function ProtectedRoute({ children }: ProtectedRouteProps) {
	const router = useRouter();
	const { user, isLoading } = useAuth();

	useEffect(() => {
		if (!isLoading && !user) {
			// User not logged in, redirect to home
			router.push("/");
		}
	}, [user, isLoading, router]);

	if (isLoading) {
		return (
			<div className="w-full h-screen flex items-center justify-center">
				<div className="text-muted-foreground text-sm">Loading...</div>
			</div>
		);
	}

	if (!user) {
		return null;
	}

	return <>{children}</>;
}
