import { differenceInDays, format, parseISO } from "date-fns";

export function calculateNights(checkIn: string, checkOut: string): number {
	return differenceInDays(parseISO(checkOut), parseISO(checkIn));
}

export function formatDate(dateStr: string): string {
	return format(parseISO(dateStr), "MMM d, yyyy");
}

export function formatDateRange(checkIn: string, checkOut: string): string {
	return `${formatDate(checkIn)} - ${formatDate(checkOut)}`;
}
