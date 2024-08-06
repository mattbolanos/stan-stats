import ExploreArtistParentSelect from "@/components/explore-artist-parent-select";
import { ExploreChart } from "@/components/explore-chart";
import { supabase } from "@/lib/supabase";
import { ArtistDetailsResponse, ArtistSample } from "@/lib/types";
import { DEFAULT_ARTIST_SAMPLE_SIZE, defaultArtists } from "@/lib/utils";
import { ClockIcon } from "@radix-ui/react-icons";

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

async function getDefaultDetails(
  artistIds: string[] = defaultArtists
): Promise<ArtistDetailsResponse> {
  "use server";

  const [streamsResult, metaResult] = await Promise.all([
    supabase
      .from("spotify_artists_streams")
      .select("id, monthly_listeners, updated_at")
      .in("id", artistIds),
    supabase
      .from("spotify_artists_meta")
      .select("id, name")
      .in("id", artistIds),
  ]);

  if (streamsResult.error) {
    throw streamsResult.error;
  }

  if (metaResult.error) {
    throw metaResult.error;
  }

  return {
    streams: streamsResult.data,
    meta: metaResult.data.map((artist) => ({
      id: artist.id,
      name: artist.name,
      selectIndex: artistIds.indexOf(artist.id),
    })),
  };
}

export default async function Home() {
  const defaultArtistSample = await getDefaultArtistSample();
  const dateRange = await getDateRange();
  const defaultDetails = await getDefaultDetails();

  return (
    <main className="flex-1 px-16 sm:mt-8 mt-2">
      <div className="max-w-2xl flex flex-col">
        <div className="flex flex-col gap-4 my-10 text-center md:text-left min-h-fit">
          <h1 className="text-3xl sm:text-4xl font-bold tracking-tight">
            Explore artist{" "}
            <span className="color-site-primary">popularity</span> over time
          </h1>
          <p className="text-lg text-muted-foreground tracking-tight">
            Dive into Spotify&apos;s monthly listener data. Compare artists,
            amplify your favorites, and uncover trends. Whether you&apos;re
            analyzing or stanning, our site gives you the insights you need. FIX
            WORDING LATER
          </p>
          <p className="text-md flex items-center md:justify-start justify-center">
            <ClockIcon className="w-5 h-5 mr-1.5 opacity-50 shrink-0" />
            Data available since{" "}
            {new Date(dateRange.min).toLocaleString("default", {
              month: "long",
              year: "numeric",
              day: "2-digit",
              timeZone: "UTC",
            })}
          </p>
        </div>
        <ExploreArtistParentSelect
          defaultArtistSample={defaultArtistSample}
          defaultDetails={defaultDetails}
        />
      </div>
      <ExploreChart dateRange={dateRange} />
    </main>
  );
}
