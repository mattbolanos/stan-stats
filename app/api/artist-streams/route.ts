import { supabase } from "@/lib/supabase";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const ids = searchParams.get("id")?.split(",");

  if (!ids) {
    return NextResponse.json([]);
  }

  const { data, error } = await supabase
    .from("spotify_artists_streams")
    .select("id, monthly_listeners, updated_at")
    .in("id", ids);

  if (error) {
    throw error;
  }

  return NextResponse.json(data);
}
