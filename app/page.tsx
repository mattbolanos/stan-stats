import ExploreArtistParentSelect from "@/components/explore-artist-parent-select";
import { ExploreChart } from "@/components/explore-chart";
import { supabase } from "@/lib/supabase";
import { ArtistSample } from "@/lib/types";

async function getArtistSample(): Promise<ArtistSample[]> {
  "use server";

  const { data, error } = await supabase
    .from("spotify-artists-meta")
    .select("id, name, image")
    .order("popularity", { ascending: false })
    .range(0, 1000);

  if (error) {
    throw error;
  }

  return data;
}

export default async function Home() {
  const artistSample = await getArtistSample();

  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <ExploreArtistParentSelect artistSample={artistSample} />
      <ExploreChart />
    </main>
  );
}
