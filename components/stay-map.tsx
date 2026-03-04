"use client";

import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { useEffect, useState } from "react";
import { MapContainer, Marker, Popup, TileLayer } from "react-leaflet";

// Fix default marker icon in Next.js (webpack resolves paths differently)
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

interface StayMapProps {
	lat: number;
	lng: number;
	location: string;
}

export function StayMap({ lat, lng, location }: StayMapProps) {
	const [ready, setReady] = useState(false);

	useEffect(() => {
		// Defer map creation so the container div is in the DOM before Leaflet runs
		const id = requestAnimationFrame(() => {
			requestAnimationFrame(() => setReady(true));
		});
		return () => cancelAnimationFrame(id);
	}, []);

	if (!ready) {
		return (
			<div
				className="h-full w-full min-h-[200px] rounded-2xl bg-muted/30 animate-pulse"
				style={{ minHeight: "200px" }}
				aria-hidden
			/>
		);
	}

	return (
		<div className="h-full w-full overflow-hidden rounded-2xl [&_.leaflet-pane]:z-[1]">
			<MapContainer
				key="stay-map"
				center={[lat, lng]}
				zoom={14}
				scrollWheelZoom={false}
				className="h-full w-full rounded-2xl"
				style={{ height: "100%", minHeight: "200px" }}
			>
				<TileLayer
					attribution='Tiles &copy; <a href="https://www.esri.com/">Esri</a> — Source: Esri, Maxar, Earthstar Geographics, and the GIS User Community'
					url="https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}"
				/>
				<Marker position={[lat, lng]}>
					<Popup>{location}</Popup>
				</Marker>
			</MapContainer>
		</div>
	);
}
