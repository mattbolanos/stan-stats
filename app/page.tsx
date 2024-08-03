import ExploreArtistParentSelect from "@/components/explore-artist-parent-select";
import { ExploreChart } from "@/components/explore-chart";
import { supabase } from "@/lib/supabase";
import { ArtistSample } from "@/lib/types";
import { DEFAULT_ARTIST_SAMPLE_SIZE } from "@/lib/utils";

export async function getDefaultArtistSample(
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

export default async function Home() {
  const defaultArtistSample = await getDefaultArtistSample();

  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <ExploreArtistParentSelect defaultArtistSample={defaultArtistSample} />
      <ExploreChart />
    </main>
  );
}
