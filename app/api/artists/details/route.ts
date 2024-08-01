import { supabase } from "@/lib/supabase";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const artistId = searchParams.get("artistId");
  const selectIndex = Number(searchParams.get("selectIndex"));

  if (!artistId) {
    return NextResponse.json([]);
  }

  const [streamsResult, metaResult] = await Promise.all([
    supabase
      .from("spotify_artists_streams")
      .select("id, monthly_listeners, updated_at")
      .eq("id", artistId),
    supabase
      .from("spotify_artists_meta")
      .select("id, name")
      .eq("id", artistId)
      .single(),
  ]);

  if (streamsResult.error) {
    throw streamsResult.error;
  }

  if (metaResult.error) {
    throw metaResult.error;
  }

  return NextResponse.json({
    streams: streamsResult.data,
    meta: {
      id: metaResult.data.id,
      name: metaResult.data.name,
      selectIndex: selectIndex,
    },
  });
}
