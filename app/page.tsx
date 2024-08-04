import ExploreArtistParentSelect from "@/components/explore-artist-parent-select";
import { ExploreChart } from "@/components/explore-chart";
import { supabase } from "@/lib/supabase";
import { ArtistSample } from "@/lib/types";
import { DEFAULT_ARTIST_SAMPLE_SIZE } from "@/lib/utils";

async function getDefaultArtistSample(
  size: number = DEFAULT_ARTIST_SAMPLE_SIZE
): Promise<ArtistSample[]> {
  "use server";

  const { data, error } = await supabase
    .from("spotify_artists_meta")
    .select("id, name")
    .order("popularity", { ascending: false })
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

export default async function Home() {
  const defaultArtistSample = await getDefaultArtistSample();
  const dateRange = await getDateRange();

  return (
    <main className="flex-1 px-16 pt-5 sm:pt-10">
      <h1 className="text-3xl sm:text-4xl font-bold pb-10 text-center sm:text-left">
        Explore
      </h1>
      <ExploreArtistParentSelect defaultArtistSample={defaultArtistSample} />
      <ExploreChart dateRange={dateRange} />
    </main>
  );
}
