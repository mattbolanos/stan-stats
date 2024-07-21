import { ExploreChart } from "@/components/explore-chart";
import { supabase } from "@/lib/supabase";

async function getArtistStreams(artistIds: string[]) {
  "use server";

  const { data } = await supabase
    .from("spotify-artists-streams")
    .select("*")
    .in("id", artistIds);
  return data;
}

export default async function Home() {
  const streams = await getArtistStreams([
    "1Xyo4u8uXC1ZmMpatF05PJ",
    "06HL4z0CvFAxyc27GXpf02",
  ]);

  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <ExploreChart chartData={streams || []} />
    </main>
  );
}
