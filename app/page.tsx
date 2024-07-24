import ExploreArtistParentSelect from "@/components/explore-artist-parent-select";
import { ExploreChart } from "@/components/explore-chart";
import { supabase } from "@/lib/supabase";
import { ArtistSample } from "@/lib/types";

async function getDefaultArtistSample(): Promise<ArtistSample[]> {
  "use server";

  const { data, error } = await supabase
    .from("spotify-artists-meta")
    .select("id, name")
    .order("popularity", { ascending: false })
    .range(0, 20);

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
