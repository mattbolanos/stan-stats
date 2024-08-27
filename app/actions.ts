"use server";

import { supabase } from "@/lib/supabase";
import {
  queryArtistDetails,
  DISPLAY_ARTISTS,
  defaultArtists,
  DEFAULT_ARTIST_SAMPLE_SIZE,
} from "@/lib/utils";
import { ArtistDetailsResponse, ArtistSample } from "@/lib/types";

export async function fetchHeroArtists(
  artistIds: string[] = DISPLAY_ARTISTS
): Promise<ArtistDetailsResponse["meta"]> {
  const details = await queryArtistDetails(supabase, artistIds);
  return details.meta;
}

export async function fetchDefaultArtistDetails(
  artistRanks: number[] = defaultArtists
): Promise<ArtistDetailsResponse> {
  const { data, error } = await supabase
    .from("spotify_artists_meta")
    .select("id, name")
    .in("artist_rank", artistRanks);

  if (error) {
    throw error;
  }

  const details = await queryArtistDetails(
    supabase,
    data.map((artist) => artist.id)
  );

  return details;
}

export async function fetchDateRange(): Promise<{
  min: string;
  max: string;
}> {
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
}

export async function fetchDefaultArtistSample(
  size: number = DEFAULT_ARTIST_SAMPLE_SIZE
): Promise<ArtistSample[]> {
  const { data, error } = await supabase
    .from("spotify_artists_meta")
    .select("id, name")
    .order("artist_rank", { ascending: true })
    .range(0, size);

  if (error) {
    throw error;
  }

  return data;
}

export async function fetchTotals(): Promise<{
  totalArtists: number;
  totalAlbums: number;
  totalSingles: number;
}> {
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
}
