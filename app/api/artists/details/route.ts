import { supabase } from "@/lib/supabase";
import { queryArtistDetails } from "@/lib/utils";

export async function GET(request: Request): Promise<Response> {
  const { searchParams } = new URL(request.url);
  const artistId = searchParams.get("artistId");
  const selectIndex = Number(searchParams.get("selectIndex"));

  if (!artistId) {
    return Response.json([]);
  }

  const details = await queryArtistDetails(supabase, artistId, selectIndex);

  return Response.json(details);
}
