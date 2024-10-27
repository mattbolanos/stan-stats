"use server";

import { supabase } from "@/lib/supabase";
import {
  DISPLAY_ARTISTS,
  DEFAULT_ARTIST_SAMPLE_SIZE,
  getRandomSequentialIntegers,
} from "@/lib/utils";
import { ArtistDetailsResponse, ArtistSample } from "@/lib/types";
import { SupabaseClient } from "@supabase/supabase-js";
import { unstable_cache } from "next/cache";

export const fetchHeroArtists = unstable_cache(
  async (
    artistIds: string[] = DISPLAY_ARTISTS
  ): Promise<ArtistDetailsResponse["meta"]> => {
    const details = await getArtistDetails(supabase, artistIds);
    return details.meta;
  },
  ["fetchHeroArtists"],
  { revalidate: 3600, tags: ["hero-artists"] }
);

export async function fetchDefaultSelectedArtists(): Promise<string[]> {
  const artistRanks = getRandomSequentialIntegers();

  const { data, error } = await supabase
    .from("spotify_artists_meta")
    .select("id, name")
    .in("artist_rank", artistRanks);

  if (error) {
    throw error;
  }

  return data.map((artist) => artist.id);
}

export const fetchDateRange = unstable_cache(
  async (): Promise<{
    min: string;
    max: string;
  }> => {
    const { data, error } = await supabase
      .from("spotify_artists_streams")
      .select("updated_at.min(), updated_at.max()");

    if (error) {
      throw error;
    }

    return {
      min: data[0].min,
      max: data[0].max,
    };
  },
  ["dateRange"],
  { revalidate: 3600, tags: ["date-range"] }
);

export const fetchDefaultArtistSample = unstable_cache(
  async (
    size: number = DEFAULT_ARTIST_SAMPLE_SIZE
  ): Promise<ArtistSample[]> => {
    const { data, error } = await supabase
      .from("spotify_artists_meta")
      .select("id, name")
      .order("artist_rank", { ascending: true })
      .range(0, size);

    if (error) {
      throw error;
    }

    return data as ArtistSample[];
  },
  ["fetchDefaultArtistSample"],
  { revalidate: 3600, tags: ["artist-sample"] }
);

export const fetchTotals = unstable_cache(
  async (): Promise<{
    totalArtists: number;
    totalAlbums: number;
    totalSingles: number;
  }> => {
    const [artistCount, albumTotal, singleTotal] = await Promise.all([
      supabase
        .from("spotify_artists_meta")
        .select("id", { count: "exact", head: true })
        .then(({ count }) => count),
      supabase
        .from("spotify_artists_meta")
        .select("album_total:albums_count.sum()")
        .not("albums_count", "is", null)
        .single()
        .then(({ data }) => data?.album_total),

      supabase
        .from("spotify_artists_meta")
        .select("single_total:singles_count.sum()")
        .not("singles_count", "is", null)
        .single()
        .then(({ data }) => data?.single_total),
    ]);

    return {
      totalArtists: artistCount ?? 0,
      totalAlbums: albumTotal ?? 0,
      totalSingles: singleTotal ?? 0,
    };
  },
  ["fetchTotals"],
  { revalidate: 3600, tags: ["totals"] }
);

export const getArtistDetails = async (
  supabase: SupabaseClient<any, "public", any>,
  artistIds: string[],
  selectIndex?: number
): Promise<ArtistDetailsResponse> => {
  try {
    const [streamsResult, metaResult, maxResult] = await Promise.all([
      supabase
        .from("spotify_artists_streams")
        .select("id, monthly_listeners, updated_at")
        .in("id", artistIds)
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
        .in("id", artistIds),
      supabase
        .from("spotify_artists_streams")
        .select("id, max_update:updated_at.max()")
        .in("id", artistIds)
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
      meta: metaResult.data.map((artist, index) => ({
        show: true,
        id: artist.id,
        name: artist.name,
        image: artist.image,
        genres: artist.genres,
        selectIndex: artistIds.length < 2 ? selectIndex || 0 : index,
        currentListens: streamsResult.data.find(
          (stream) =>
            stream.id === artist.id &&
            stream.updated_at ===
              maxResult.data.find((stream) => stream.id === artist.id)
                ?.max_update
        )?.monthly_listeners,
        prevListens: streamsResult.data
          .filter((stream) => stream.id === artist.id)
          .sort(
            (a, b) =>
              new Date(b.updated_at).getTime() -
              new Date(a.updated_at).getTime()
          )
          .slice(1, 2)[0]?.monthly_listeners,
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
  } catch (error) {
    throw error;
  }
};
