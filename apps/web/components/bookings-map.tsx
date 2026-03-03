"use client";

import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { useEffect, useMemo, useState } from "react";
import {
	MapContainer,
	Marker,
	Popup,
	TileLayer,
	useMap,
} from "react-leaflet";

const defaultIcon = L.icon({
	iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
	iconRetinaUrl:
		"https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
	shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
	iconSize: [25, 41],
	iconAnchor: [12, 41],
	popupAnchor: [1, -34],
	shadowSize: [41, 41],
});
L.Marker.prototype.options.icon = defaultIcon;

export interface BookingPin {
	lat: number;
	lng: number;
	label: string;
	stayName?: string;
}

interface FitBoundsProps {
	pins: BookingPin[];
}

function FitBounds({ pins }: FitBoundsProps) {
	const map = useMap();
	useEffect(() => {
		if (pins.length < 2) return;
		const bounds = L.latLngBounds(
			pins.map((p) => [p.lat, p.lng] as [number, number]),
		);
		map.fitBounds(bounds, { padding: [24, 24], maxZoom: 10 });
	}, [map, pins]);
	return null;
}

interface BookingsMapProps {
	pins: BookingPin[];
	className?: string;
}

export function BookingsMap({ pins, className = "" }: BookingsMapProps) {
	const [ready, setReady] = useState(false);

	useEffect(() => {
		const id = requestAnimationFrame(() => {
			requestAnimationFrame(() => setReady(true));
		});
		return () => cancelAnimationFrame(id);
	}, []);

	const center = useMemo(() => {
		if (pins.length === 0) return [20, 0] as [number, number];
		if (pins.length === 1) return [pins[0].lat, pins[0].lng] as [number, number];
		const sum = pins.reduce(
			(acc, p) => ({ lat: acc.lat + p.lat, lng: acc.lng + p.lng }),
			{ lat: 0, lng: 0 },
		);
		return [sum.lat / pins.length, sum.lng / pins.length] as [number, number];
	}, [pins]);

	const zoom = pins.length <= 1 ? 5 : 3;

	if (!ready) {
		return (
			<div
				className={`min-h-[220px] rounded-2xl bg-muted/30 animate-pulse ${className}`}
				style={{ minHeight: "220px" }}
				aria-hidden
			/>
		);
	}

	if (pins.length === 0) {
		return (
			<div
				className={`min-h-[220px] rounded-2xl bg-muted/20 flex items-center justify-center text-muted-foreground text-sm ${className}`}
			>
				No locations to show
			</div>
		);
	}

	return (
		<div className={`overflow-hidden rounded-2xl [&_.leaflet-pane]:z-[1] ${className}`}>
			<MapContainer
				center={center}
				zoom={zoom}
				scrollWheelZoom={false}
				className="h-full w-full min-h-[220px] rounded-2xl"
				style={{ minHeight: "220px" }}
			>
				<TileLayer
					attribution='Tiles &copy; Esri — Source: Esri, Maxar, Earthstar Geographics, and the GIS User Community'
					url="https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}"
				/>
				{pins.length >= 2 && <FitBounds pins={pins} />}
				{pins.map((pin, i) => (
					<Marker key={`${pin.lat}-${pin.lng}-${i}`} position={[pin.lat, pin.lng]}>
						<Popup>
							{pin.stayName ? (
								<>
									<span className="font-medium">{pin.stayName}</span>
									<br />
									<span className="text-muted-foreground text-xs">{pin.label}</span>
								</>
							) : (
								pin.label
							)}
						</Popup>
					</Marker>
				))}
			</MapContainer>
		</div>
	);
}
