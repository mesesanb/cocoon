import { OurCocoonClient } from "@/components/our-cocoon-client";
import { ProtectedRoute } from "@/components/protected-route";
import { Providers } from "@/components/providers";

export default function OurCocoonPage() {
	return (
		<Providers>
			<ProtectedRoute>
				<OurCocoonClient />
			</ProtectedRoute>
		</Providers>
	);
}
