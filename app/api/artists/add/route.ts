import { supabase } from "@/lib/supabase";

export async function GET(request: Request): Promise<Response> {
  const { searchParams } = new URL(request.url);
  const artistRank = searchParams.get("artistRank");

  if (!artistRank) {
    return Response.json([]);
  }

  const { data, error } = await supabase
    .from("spotify_artists_meta")
    .select("id")
    .eq("artist_rank", artistRank)
    .single();

  if (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }

  return Response.json(data.id);
}
