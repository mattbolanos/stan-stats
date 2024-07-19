import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const navButtonIconDim = 20 as const;

export function formatTotalArtists(totalArtists: number) {
  if (totalArtists < 1000) {
    return totalArtists.toString();
  }

  const roundedNumber = Math.floor(totalArtists / 1000) * 1000;
  return new Intl.NumberFormat("en-US").format(roundedNumber) + "+";
}
