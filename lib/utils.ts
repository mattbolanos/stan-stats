import { ExploreState } from "@/contexts/types";
import { SupabaseClient } from "@supabase/supabase-js";
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

export async function queryArtistDetails(
  supabase: SupabaseClient<any, "public", any>,
  artistIds: string | string[]
) {
  const queryIds = Array.isArray(artistIds) ? artistIds : [artistIds];

  const [streamsResult, metaResult, streamMax] = await Promise.all([
    supabase
      .from("spotify_artists_streams")
      .select("id, monthly_listeners, updated_at")
      .in("id", queryIds)
      .order("updated_at", { ascending: true }),
    supabase
      .from("spotify_artists_meta")
      .select("id, name, image, genres")
      .in("id", queryIds),
    supabase
      .from("spotify_artists_streams")
      .select(
        `id, 
        max_listens:monthly_listeners.max(), 
        min_listens:monthly_listeners.min(),
        max_updated_at:updated_at.max()`
      )
      .in("id", queryIds),
  ]);

  if (streamsResult.error) {
    throw streamsResult.error;
  }

  if (metaResult.error) {
    throw metaResult.error;
  }

  if (streamMax.error) {
    throw streamMax.error;
  }

  return { streamsResult, metaResult, streamMax };
}

export function cleanGenres(genreString: string): string {
  if (!genreString) {
    return "";
  }

  // Split the string into an array and take the first 3 elements
  const genres = genreString.split(",").slice(0, 3);

  // Convert each genre to title case
  return genres
    .map((genre) =>
      genre
        .split(" ")
        .map(
          (word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()
        )
        .join(" ")
    )
    .join(", ");
}
