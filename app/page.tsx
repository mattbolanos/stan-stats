import { DisplayCards } from "@/components/display-cards";
import ExploreCardsParent from "@/components/explore-cards-parent";
import { ExploreChart } from "@/components/explore-chart";
import { supabase } from "@/lib/supabase";
import { ArtistDetailsResponse, ArtistSample } from "@/lib/types";
import {
  DEFAULT_ARTIST_SAMPLE_SIZE,
  defaultArtists,
  DISPLAY_ARTISTS,
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
  artistRanks: number[] = defaultArtists
): Promise<ArtistDetailsResponse> {
  "use server";

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

async function getDisplayDetails(): Promise<ArtistDetailsResponse> {
  "use server";

  const details = await queryArtistDetails(supabase, DISPLAY_ARTISTS);
  return details;
}

export default async function Home() {
  const defaultArtistSample = await getDefaultArtistSample();
  const dateRange = await getDateRange();
  const defaultDetails = await getDefaultDetails();
  const { totalArtists, totalAlbums, totalSingles } = await getTotals();
  const displayDetails = await getDisplayDetails();

  return (
    <main className="px-16 sm:mt-8 mt-2 mb-10 flex flex-col gap-10">
      <div className="flex justify-center flex-col items-center">
        <div className="flex flex-col mt-2 mb-5 justify-center items-center text-center md:text-left min-h-fit">
          <h1 className="text-4xl sm:text-5xl font-bold tracking-tight">
            Spotify Artist{" "}
            <span className="color-site-primary">Popularity</span> by the
            Numbers
          </h1>
          <p
            className="text-xl text-muted-foreground max-w-xl mt-5 text-center"
            style={{ textWrap: "balance" }}
          >
            Stan like a pro. Compare your faves. See who&apos;s hot and
            who&apos;s not.
          </p>
        </div>
        <div className="flex flex-col gap-3 items-center w-full">
          <p className="text-md flex items-center gap-1.5">
            <ClockIcon className="w-5 h-5 opacity-75 shrink-0" />
            Since{" "}
            {new Date(dateRange.min).toLocaleString("default", {
              month: "long",
              year: "numeric",
              timeZone: "UTC",
            })}
          </p>
          <p className="text-md flex items-center gap-1.5">
            <Mic2Icon className="w-5 h-5 opacity-75 shrink-0" />
            {formatMonthlyListeners(totalArtists ?? 0)} artists
          </p>
          <p className="text-md flex items-center gap-1.5">
            <Disc3 className="w-5 h-5 opacity-75 shrink-0" />
            {formatMonthlyListeners(totalAlbums ?? 0)} albums
          </p>
          <p className="text-md flex items-center gap-1.5">
            <Music2Icon className="w-5 h-5 opacity-75 shrink-0" />
            {formatMonthlyListeners(totalSingles ?? 0)} singles
          </p>
        </div>
      </div>
      <div className="flex flex-col gap-5 opacity-85 items-center">
        <DisplayCards artists={displayDetails.meta} />
      </div>
      <div className="flex justify-start gap-10 mt-32">
        <ExploreCardsParent
          defaultArtistSample={defaultArtistSample}
          defaultDetails={defaultDetails}
        />
        <ExploreChart dateRange={dateRange} />
      </div>
    </main>
  );
}
