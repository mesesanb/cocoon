export type ScenarioType = "CITY" | "FOREST" | "MOUNTAINS" | "SEA";

export interface Stay {
	id: string;
	name: string;
	tagline: string;
	description: string;
	scenario: ScenarioType;
	location: string;
	coordinates: { lat: number; lng: number };
	video?: string;
	images: string[];
	pricePerNight: number;
	currency: string;
	maxGuests: 2;
	amenities: string[];
	resonanceScore: number;
	avgRating?: number;
	reviewCount?: number;
	availability: DateRange[];
}

export interface DateRange {
	checkIn: string;
	checkOut: string;
}

export interface Review {
	id: string;
	stayId: string;
	userId: string;
	coupleName: string;
	rating: number;
	text: string;
	date: string;
	resonanceScore: number;
}

export interface Booking {
	confirmationId: string;
	stayId: string;
	userId: string;
	coupleName: string;
	checkIn: string;
	checkOut: string;
	guests: number;
	totalPrice: number;
	currency: string;
	status: "confirmed" | "pending" | "completed";
	createdAt: string;
}

export interface AvailabilityResponse {
	available: boolean;
	totalPrice: number;
	currency: string;
	nights: number;
	conflictMessage?: string;
}

export type StayCardMode = "listing" | "history" | "upcoming";
