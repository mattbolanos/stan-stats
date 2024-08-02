import ExploreArtistParentSelect from "@/components/explore-artist-parent-select";
import { ExploreChart } from "@/components/explore-chart";
import { ExploreState } from "@/contexts/types";
import { supabase } from "@/lib/supabase";
import { ArtistSample } from "@/lib/types";
import {
  DEFAULT_ARTIST_MIN_POPULARITY,
  DEFAULT_ARTIST_SAMPLE_SIZE,
  fallbackDefaultArtist,
} from "@/lib/utils";

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

async function getRandomDefaultArtist(): Promise<
  ExploreState["selectedArtists"][0]
> {
  "use server";

  const { data, error } = await supabase
    .from("spotify_artists_meta")
    .select("id")
    .gte("popularity", DEFAULT_ARTIST_MIN_POPULARITY)
    .limit(100);

  if (error) {
    return {
      selectIndex: 0,
      id: fallbackDefaultArtist.id,
    };
  }

  if (!data || data.length === 0) {
    return {
      selectIndex: 0,
      id: fallbackDefaultArtist.id,
    };
  }

  // Select a random artist
  const randomIndex = Math.floor(Math.random() * data.length);
  const randomArtist: any = data[randomIndex];

  return {
    selectIndex: 0,
    id: randomArtist.id,
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
