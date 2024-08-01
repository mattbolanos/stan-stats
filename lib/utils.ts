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

export const DEFAULT_ARTIST_MIN_LISTENERS = 10000000 as const;
export const DEFAULT_ARTIST_SAMPLE_SIZE = 30 as const;

export function formatMonthlyListeners(value: number): string {
  if (value >= 1_000_000) {
    return `${(value / 1_000_000).toFixed(1)}M`;
  } else if (value >= 1_000) {
    return `${(value / 1_000).toFixed(1)}K`;
  }
  return String(value);
}
