import { ExploreChart } from "@/components/explore-chart";
import { supabase } from "@/lib/supabase";

async function getArtistSample(): Promise<string[]> {
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
      .select("id");

    if (error) {
      throw error;
    }

    return data.map((row) => row.id);
  }

  // For larger datasets, use pagination
  let allIds: string[] = [];
  let page = 0;
  const pageSize = Math.min(1000, Math.ceil(count / 10)); // Adjust page size based on total count

  while (allIds.length < count) {
    const { data, error } = await supabase
      .from("spotify-artists-meta")
      .select("id")
      .range(page * pageSize, (page + 1) * pageSize - 1);

    if (error) {
      throw error;
    }
    if (data.length === 0) {
      break;
    }

    allIds = allIds.concat(data.map((row) => row.id));
    page++;
  }

  return allIds;
}

export default async function Home() {
  const artistSample = await getArtistSample();

  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <ExploreChart />
    </main>
  );
}
