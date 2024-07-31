import ExploreArtistParentSelect from "@/components/explore-artist-parent-select";
import { ExploreChart } from "@/components/explore-chart";
import { ExploreState } from "@/contexts/types";
import { supabase } from "@/lib/supabase";
import { ArtistSample } from "@/lib/types";
import { DEFAULT_ARTIST_MIN_LISTENERS } from "@/lib/utils";

async function getDefaultArtistSample(): Promise<ArtistSample[]> {
  "use server";

  const { data, error } = await supabase
    .from("spotify_artists_meta")
    .select("id, name")
    .order("popularity", { ascending: false })
    .range(0, 30);

  if (error) {
    throw error;
  }

  return data;
}

async function getRandomDefaultArtist(): Promise<
  ExploreState["selectedArtists"][0]
> {
  "use server";

  const { data, error } = await supabase
    .from("spotify_artists_streams")
    .select(
      `
      id,
      spotify_artists_meta(name)
    `
    )
    .gt("monthly_listeners", DEFAULT_ARTIST_MIN_LISTENERS)
    .limit(200);

  if (error) {
    throw new Error("Failed to fetch artists");
  }

  if (!data || data.length === 0) {
    throw new Error("No artists found");
  }

  // Select a random artist
  const randomIndex = Math.floor(Math.random() * data.length);
  const randomArtist: any = data[randomIndex];

  return {
    selectIndex: 0,
    artistId: randomArtist.id,
    artistName: randomArtist.spotify_artists_meta.name,
  };
}

export default async function Home() {
  const defaultArtistSample = await getDefaultArtistSample();
  const defaultArtist = await getRandomDefaultArtist();

  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <ExploreArtistParentSelect
        defaultArtistSample={defaultArtistSample}
        defaultArtist={defaultArtist}
      />
      <ExploreChart />
    </main>
  );
}
