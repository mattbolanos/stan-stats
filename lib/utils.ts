import { ExploreState } from "@/contexts/types";
import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import { titleCase } from "title-case";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const NAV_BTN_ICON_DIM = 20 as const;

export const DEFAULT_ARTIST_SAMPLE_SIZE = 100 as const;

export function formatMonthlyListeners(
  value: number,
  digits: number = 1
): string {
  let formattedValue = Math.abs(value);
  if (formattedValue >= 1_000_000) {
    return `${(formattedValue / 1_000_000).toFixed(digits)}M`;
  } else if (formattedValue >= 1_000) {
    return `${(formattedValue / 1_000).toFixed(digits)}K`;
  }
  return String(formattedValue);
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
  const options: Intl.DateTimeFormatOptions = {
    month: "long",
    timeZone: "UTC",
  };

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

export const FAKE_ARTIST_ID = "FAKE";

export function cleanGenres(genreString: string): string {
  if (!genreString) {
    return "N/A";
  }

  const genre = genreString.split(",")[0];
  return titleCase(genre.trim());
}

export function formatChartDate(value: any) {
  return new Date(value).toLocaleString("en-US", {
    month: "short",
    timeZone: "UTC",
    year: "numeric",
    day: "numeric",
  });
}

export function createSpotifyURL(artistId: string) {
  return `https://open.spotify.com/artist/${artistId}`;
}

export const DISPLAY_ARTISTS = [
  "1McMsnEElThX1knmY4oliG",
  "0EmeFodog0BfCgMzAIvKQp",
  "74KM79TiuVKeVCqs8QtB0B",
  "6zFYqv1mOsgBRQbae3JJ9e",
  "3l0CmX0FuQjFxr8SK7Vqag",
  "40ZNYROS4zLfyyBSs2PGe2",
  "3lWVgSwutPsiJ8Awm7OTKU",
  "1w5Kfo2jwwIPruYS2UWh56",
  "1WaFQSHVGZQJTbf0BdxdNo",
];
