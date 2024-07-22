import ExploreArtistSelect from "@/components/explore-artist-select";
import { ExploreChart } from "@/components/explore-chart";
import { supabase } from "@/lib/supabase";
import { ArtistSample } from "@/lib/types";

async function getArtistSample(): Promise<ArtistSample[]> {
  "use server";
  // First, get the total count of rows
  const { count, error: countError } = await supabase
    .from("spotify-artists-meta")
    .select("id", { count: "exact", head: true });

  if (countError || !count) {
    throw countError;
  }

  // If count is small enough, fetch all at once
  if (count <= 1000) {
    const { data, error } = await supabase
      .from("spotify-artists-meta")
      .select("id, name, image");

    if (error) {
      throw error;
    }

    return data;
  }

  // For larger datasets, use pagination
  let allData: ArtistSample[] = [];
  let page = 0;
  const pageSize = Math.min(1000, Math.ceil(count / 10));

  while (allData.length < count) {
    const { data, error } = await supabase
      .from("spotify-artists-meta")
      .select("id, name, image")
      .range(page * pageSize, (page + 1) * pageSize - 1);

    if (error) {
      throw error;
    }
    if (data.length === 0) {
      break;
    }

    allData = allData.concat(data);
    page++;
  }

  return allData;
}

export default async function Home() {
  const artistSample = await getArtistSample();

  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <ExploreArtistSelect artistSample={artistSample} />
      <ExploreChart />
    </main>
  );
}
