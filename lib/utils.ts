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

export function getRandomSequentialIntegers(
  max: number = 100
): [number, number] {
  const start = Math.floor(Math.random() * (max - 1)) + 1;
  return [start, start + 1];
}

export const defaultArtists = getRandomSequentialIntegers();

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
        artist_rank, prev_artist_rank,
        latest_release_date, latest_release_type, latest_release_name, latest_release_share_url
        `
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
      show: true,
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
      latestReleaseDate: artist.latest_release_date,
      latestReleaseType: artist.latest_release_type,
      latestReleaseName: artist.latest_release_name,
      latestReleaseShareUrl: artist.latest_release_share_url,
    })),
  };
}

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
