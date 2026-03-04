import { Providers } from "@/components/providers";
import { StayDetailClient } from "@/components/stay-detail-client";

interface StayPageProps {
	params: Promise<{ id: string }>;
}

export default async function StayPage({ params }: StayPageProps) {
	const { id } = await params;

	return (
		<Providers>
			<StayDetailClient stayId={id} />
		</Providers>
	);
}
