import { CocoonApp } from "@/components/cocoon-app";
import { Providers } from "@/components/providers";

export default function Home() {
	return (
		<Providers>
			<CocoonApp />
		</Providers>
	);
}
