import ExploreArtistParentSelect from "@/components/explore-artist-parent-select";
import { ExploreCards } from "@/components/explore-card";
import { ExploreChart } from "@/components/explore-chart";
import { supabase } from "@/lib/supabase";
import { ArtistDetailsResponse, ArtistSample } from "@/lib/types";
import {
  DEFAULT_ARTIST_SAMPLE_SIZE,
  defaultArtists,
  formatMonthlyListeners,
  queryArtistDetails,
} from "@/lib/utils";
import { ClockIcon } from "@radix-ui/react-icons";
import { Disc3, Mic2Icon, Music2Icon } from "lucide-react";

async function getDefaultArtistSample(
  size: number = DEFAULT_ARTIST_SAMPLE_SIZE
): Promise<ArtistSample[]> {
  "use server";

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

async function getDateRange(): Promise<{
  min: string;
  max: string;
}> {
  "use server";

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

async function getDefaultDetails(
  artistIds: string[] = defaultArtists
): Promise<ArtistDetailsResponse> {
  "use server";

  const details = await queryArtistDetails(supabase, artistIds);

  return details;
}

async function getTotals() {
  "use server";

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
    totalArtists: artistCount,
    totalAlbums: albumTotal,
    totalSingles: singleTotal,
  };
}

export default async function Home() {
  const defaultArtistSample = await getDefaultArtistSample();
  const dateRange = await getDateRange();
  const defaultDetails = await getDefaultDetails();
  const { totalArtists, totalAlbums, totalSingles } = await getTotals();

  return (
    <main className="flex-1 px-16 sm:mt-8 mt-2 mb-10">
      <div className="max-w-2xl flex flex-col">
        <div className="flex flex-col gap-3 mt-2 mb-5 text-center md:text-left min-h-fit">
          <h1 className="text-3xl sm:text-4xl font-bold tracking-tight">
            Explore artist{" "}
            <span className="color-site-primary">popularity</span> over time
          </h1>
          <p className="text-lg text-muted-foreground tracking-tight">
            Dive into Spotify&apos;s monthly listener data. Compare artists,
            amplify your favorites, and uncover trends. Whether you&apos;re
            analyzing or stanning, our site gives you the insights you need. FIX
            WORDING LATER
          </p>
          <p className="text-md flex items-center md:justify-start justify-center gap-1.5">
            <ClockIcon className="w-5 h-5 opacity-75 shrink-0" />
            Since{" "}
            {new Date(dateRange.min).toLocaleString("default", {
              month: "long",
              year: "numeric",
              timeZone: "UTC",
            })}
          </p>
          <p className="text-md flex items-center md:justify-start justify-center gap-1.5">
            <Mic2Icon className="w-5 h-5 opacity-75 shrink-0" />
            {formatMonthlyListeners(totalArtists ?? 0)} artists
          </p>
          <p className="text-md flex items-center md:justify-start justify-center gap-1.5">
            <Disc3 className="w-5 h-5 opacity-75 shrink-0" />
            {formatMonthlyListeners(totalAlbums ?? 0)} albums
          </p>
          <p className="text-md flex items-center md:justify-start justify-center gap-1.5">
            <Music2Icon className="w-5 h-5 opacity-75 shrink-0" />
            {formatMonthlyListeners(totalSingles ?? 0)} singles
          </p>
        </div>
      </div>
      <div className="flex flex-col lg:flex-row gap-10 items-end">
        <div className="flex flex-col w-8/12">
          <div className="flex flex-col justify-between">
            <div className="max-w-2xl">
              <ExploreArtistParentSelect
                defaultArtistSample={defaultArtistSample}
                defaultDetails={defaultDetails}
              />
            </div>
            <ExploreChart dateRange={dateRange} />
          </div>
        </div>
        <div>
          <ExploreCards />
        </div>
      </div>
    </main>
  );
}
