"use client";

import L from "leaflet";
import "leaflet/dist/leaflet.css";
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
	return (
		<MapContainer
			center={[lat, lng]}
			zoom={14}
			scrollWheelZoom={false}
			className="h-full w-full min-h-[200px] rounded-2xl"
			style={{ minHeight: "200px" }}
		>
			<TileLayer
				attribution='Tiles &copy; <a href="https://www.esri.com/">Esri</a> — Source: Esri, Maxar, Earthstar Geographics, and the GIS User Community'
				url="https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}"
			/>
			<Marker position={[lat, lng]}>
				<Popup>{location}</Popup>
			</Marker>
		</MapContainer>
	);
}
