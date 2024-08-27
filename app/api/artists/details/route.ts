import { getArtistDetails } from "@/app/actions";
import { supabase } from "@/lib/supabase";

export async function GET(request: Request): Promise<Response> {
  const { searchParams } = new URL(request.url);
  const artistId = searchParams.get("artistId");
  const selectIndex = Number(searchParams.get("selectIndex"));

  if (!artistId) {
    return Response.json([]);
  }

  const details = await getArtistDetails(supabase, artistId, selectIndex);

  return Response.json(details);
}
