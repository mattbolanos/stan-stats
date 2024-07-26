import ExploreArtistParentSelect from "@/components/explore-artist-parent-select";
import { ExploreChart } from "@/components/explore-chart";
import { ExploreState } from "@/contexts/types";
import { supabase } from "@/lib/supabase";
import { ArtistSample } from "@/lib/types";
import { DEFAULT_ARTIST_MIN_LISTENERS } from "@/lib/utils";
import { PostgrestError } from "@supabase/supabase-js";

async function getDefaultArtistSample(): Promise<ArtistSample[]> {
  "use server";

  const { data, error } = await supabase
    .from("spotify_artists_meta")
    .select("id, name")
    .order("popularity", { ascending: false })
    .range(0, 20);

  if (error) {
    throw error;
  }

  return data;
}

async function getRandomDefaultArtist(): Promise<
  ExploreState["selectedArtists"][0]
> {
  "use server";

  const { count } = await supabase
    .from("spotify_artists_streams")
    .select("id", { count: "exact", head: true })
    .gt("monthly_listeners", DEFAULT_ARTIST_MIN_LISTENERS);

  if (!count) {
    throw new Error("No artists found");
  }

  const randomOffset = Math.floor(Math.random() * count);

  const {
    data,
    error,
  }: {
    data: any;
    error: PostgrestError | null;
  } = await supabase
    .from("spotify_artists_streams")
    .select(
      `
      id,
      spotify_artists_meta(name)
    `
    )
    .gt("monthly_listeners", DEFAULT_ARTIST_MIN_LISTENERS)
    .order("id", { ascending: true })
    .limit(1)
    .range(randomOffset, randomOffset)
    .single();

  if (error) {
    throw error;
  }

  return {
    selectIndex: 0,
    artistId: data.id,
    artistName: data.spotify_artists_meta.name,
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
