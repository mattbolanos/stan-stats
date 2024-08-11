import { ExploreState } from "@/contexts/types";
import { SupabaseClient } from "@supabase/supabase-js";
import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import { ArtistDetailsResponse } from "./types";
import { titleCase } from "title-case";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const NAV_BTN_ICON_DIM = 20 as const;

export const DEFAULT_ARTIST_SAMPLE_SIZE = 100 as const;

export function formatMonthlyListeners(value: number): string {
  let formattedValue = Math.abs(value);
  if (formattedValue >= 1_000_000) {
    return `${(formattedValue / 1_000_000).toFixed(1)}M`;
  } else if (formattedValue >= 1_000) {
    return `${(formattedValue / 1_000).toFixed(1)}K`;
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

const getPreviousDay = (dateString: string) => {
  const date = new Date(dateString);
  date.setDate(date.getDate() - 1);
  return date.toISOString().split("T")[0]; // Format as YYYY-MM-DD
};

export async function queryArtistDetails(
  supabase: SupabaseClient<any, "public", any>,
  artistIds: string | string[],
  selectIndex?: number
): Promise<ArtistDetailsResponse> {
  const queryIds = Array.isArray(artistIds) ? artistIds : [artistIds];

  const [streamsResult, metaResult, maxResult] = await Promise.all([
    supabase
      .from("spotify_artists_streams")
      .select("id, monthly_listeners, updated_at")
      .in("id", queryIds)
      .order("updated_at", { ascending: true }),
    supabase
      .from("spotify_artists_meta")
      .select(
        `
        id, name, image, genres, singles_count, albums_count,
        url_twitter, url_instagram, 
        artist_rank, prev_artist_rank`
      )
      .in("id", queryIds),
    supabase
      .from("spotify_artists_streams")
      .select("id, max_update:updated_at.max()")
      .in("id", queryIds)
      .not("monthly_listeners", "is", null),
  ]);

  if (streamsResult.error) {
    throw streamsResult.error;
  }

  if (metaResult.error) {
    throw metaResult.error;
  }

  if (maxResult.error) {
    throw maxResult.error;
  }

  return {
    streams: streamsResult.data,
    meta: metaResult.data.map((artist) => ({
      id: artist.id,
      name: artist.name,
      image: artist.image,
      genres: artist.genres,
      selectIndex: selectIndex ?? artistIds.indexOf(artist.id),
      currentListens: streamsResult.data.find(
        (stream) =>
          stream.id === artist.id &&
          stream.updated_at ===
            maxResult.data.find((stream) => stream.id === artist.id)?.max_update
      )?.monthly_listeners,
      prevListens: streamsResult.data.find((stream) => {
        const maxUpdateForArtist = maxResult.data.find(
          (max) => max.id === artist.id
        )?.max_update;
        if (!maxUpdateForArtist) {
          return false;
        }

        const previousDay = getPreviousDay(maxUpdateForArtist);

        return stream.id === artist.id && stream.updated_at === previousDay;
      })?.monthly_listeners,
      rank: artist.artist_rank,
      prevRank: artist.prev_artist_rank,
      singlesCount: artist.singles_count,
      albumsCount: artist.albums_count,
      urlTwitter: artist.url_twitter,
      urlInstagram: artist.url_instagram,
    })),
  };
}

export function cleanGenres(genreString: string): string {
  if (!genreString) {
    return "";
  }

  // Split the string into an array and take the first 3 elements
  const genres = genreString.split(",").slice(0, 3);

  // Use title-case library for each genre
  return genres.map((genre) => titleCase(genre.trim())).join(", ");
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
