import { differenceInDays, format, parseISO } from "date-fns";

export function calculateNights(checkIn: string, checkOut: string): number {
	return differenceInDays(parseISO(checkOut), parseISO(checkIn));
}

/** Returns true when the two date ranges overlap */
export function datesOverlap(
	start1: string,
	end1: string,
	start2: string,
	end2: string,
): boolean {
	return start1 < end2 && start2 < end1;
}

export function formatDate(dateStr: string): string {
	return format(parseISO(dateStr), "MMM d, yyyy");
}

export function formatDateRange(checkIn: string, checkOut: string): string {
	return `${formatDate(checkIn)} - ${formatDate(checkOut)}`;
}
