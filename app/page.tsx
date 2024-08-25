import { WelcomeCards } from "@/components/welcome-cards";
import ExploreCardsParent from "@/components/explore-cards-parent";
import { ExploreChart } from "@/components/explore-chart";
import { HeroCards } from "@/components/hero-cards";
import { WelcomeButton } from "@/components/welcome-button";
import { supabase } from "@/lib/supabase";
import { ArtistDetailsResponse, ArtistSample } from "@/lib/types";
import {
  DEFAULT_ARTIST_SAMPLE_SIZE,
  defaultArtists,
  DISPLAY_ARTISTS,
  queryArtistDetails,
} from "@/lib/utils";
import { DatabaseIcon, TrendingUpIcon } from "lucide-react";
import { SectionTitle } from "@/components/section-title";

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

async function getTotals(): Promise<{
  totalArtists: number;
  totalAlbums: number;
  totalSingles: number;
}> {
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
    totalArtists: artistCount ?? 0,
    totalAlbums: albumTotal ?? 0,
    totalSingles: singleTotal ?? 0,
  };
}

async function getDisplayDetails(
  artistIds: string[] = DISPLAY_ARTISTS
): Promise<ArtistDetailsResponse> {
  "use server";

  const details = await queryArtistDetails(supabase, artistIds);
  return details;
}

export default async function Home() {
  const defaultArtistSample = await getDefaultArtistSample();
  const dateRange = await getDateRange();
  const defaultDetails = await getDefaultDetails();
  const { totalArtists, totalAlbums, totalSingles } = await getTotals();
  const displayDetails = await getDisplayDetails();

  return (
    <main className="px-16 sm:mt-28 mt-2 mb-10 flex flex-col gap-10">
      <div className="flex flex-col justify-center items-center text-center space-y-10">
        <h1 className="text-4xl sm:text-5xl font-bold tracking-tight">
          Spotify Artist <span className="color-site-primary">Popularity</span>{" "}
          by the Numbers
        </h1>

        <p
          className="text-xl text-muted-foreground max-w-3xl text-center leading-relaxed"
          style={{ textWrap: "balance" }}
        >
          Stan like a pro. Compare your faves daily. See who&apos;s hot and
          who&apos;s not. Free to use, always.
        </p>
        <WelcomeButton />
      </div>
      <div className="max-w-6xl mx-auto w-full">
        <WelcomeCards
          artists={displayDetails.meta}
          className="mt-3 flex justify-center"
        />
      </div>
      <SectionTitle
        text="About the Database"
        icon={DatabaseIcon}
        className="mt-6 mx-auto"
      />
      <HeroCards
        dateRange={dateRange}
        totalArtists={totalArtists}
        totalAlbums={totalAlbums}
        totalSingles={totalSingles}
      />

      <section className="flex flex-col items-center mt-20 gap-10" id="explore">
        <SectionTitle text="Artist Trends" icon={TrendingUpIcon} />
        <div className="flex justify-center gap-6 w-full">
          <ExploreCardsParent
            defaultArtistSample={defaultArtistSample}
            defaultDetails={defaultDetails}
          />
          <ExploreChart dateRange={dateRange} />
        </div>
      </section>
    </main>
  );
}
