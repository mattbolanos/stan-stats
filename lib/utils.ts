import { ExploreState } from "@/contexts/types";
import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const NAV_BTN_ICON_DIM = 20 as const;

export function formatTotalArtists(totalArtists: number) {
  if (totalArtists < 1000) {
    return totalArtists.toString();
  }

  const roundedNumber = Math.floor(totalArtists / 1000) * 1000;
  return new Intl.NumberFormat("en-US").format(roundedNumber) + "+";
}

export const DEFAULT_ARTIST_SAMPLE_SIZE = 100 as const;

export function formatMonthlyListeners(value: number): string {
  if (value >= 1_000_000) {
    return `${(value / 1_000_000).toFixed(1)}M`;
  } else if (value >= 1_000) {
    return `${(value / 1_000).toFixed(1)}K`;
  }
  return String(value);
}

export function getFirstAvailableIndex(
  selectedArtists: ExploreState["selectedArtists"]
) {
  // Find the first available index
  let index = 0;
  while (selectedArtists.find((artist) => artist.selectIndex === index)) {
    index++;
  }
  return index;
}

function formatDateToMonthYear(
  date: Date,
  includeYear: boolean = true
): string {
  const options: Intl.DateTimeFormatOptions = { month: "long" };

  if (includeYear) {
    options.year = "numeric";
  }

  return date.toLocaleString("en-US", options);
}

export function formatDateRange(startDate: string, endDate: string): string {
  const start = new Date(startDate);
  const end = new Date(endDate);

  const startFormatted = formatDateToMonthYear(
    start,
    start.getFullYear() !== end.getFullYear()
  );

  return `${startFormatted} - ${formatDateToMonthYear(end)}`;
}

export const defaultArtists = [
  "1McMsnEElThX1knmY4oliG", // olivia rodrigo
  "12GqGscKJx3aE4t07u7eVZ", // peso pluma
];

export const FAKE_ARTIST_ID = "FAKE";

export async function fetchArtistDetails(
  artistId: string | undefined,
  selectIndex: number
) {
  if (!artistId) {
    return [];
  }

  const response = await fetch(
    `/api/artists/details?artistId=${artistId}&selectIndex=${selectIndex}`
  );
  if (!response.ok) {
    return [];
  }
  return response.json();
}
