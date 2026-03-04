"use client";

import { useEffect, useRef, useState } from "react";

interface LazyVideoProps
	extends Omit<React.ComponentProps<"video">, "src"> {
	src: string;
	poster?: string;
}

/**
 * Video that only loads (sets src) when it enters the viewport.
 * Uses poster until then so layout and first frame are shown without downloading video.
 */
export function LazyVideo({ src, poster, ...props }: LazyVideoProps) {
	const ref = useRef<HTMLVideoElement>(null);
	const [shouldLoad, setShouldLoad] = useState(false);

	useEffect(() => {
		const el = ref.current;
		if (!el) return;

		const observer = new IntersectionObserver(
			(entries) => {
				if (entries[0]?.isIntersecting) setShouldLoad(true);
			},
			{ rootMargin: "100px" },
		);
		observer.observe(el);
		return () => observer.disconnect();
	}, []);

	return (
		<video
			ref={ref}
			src={shouldLoad ? src : undefined}
			poster={poster}
			preload={shouldLoad ? "metadata" : "none"}
			muted
			playsInline
			loop
			autoPlay={shouldLoad}
			{...props}
		/>
	);
}
