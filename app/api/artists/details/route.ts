import { supabase } from "@/lib/supabase";
import { queryArtistDetails } from "@/lib/utils";

export async function GET(request: Request): Promise<Response> {
  const { searchParams } = new URL(request.url);
  const artistId = searchParams.get("artistId");
  const selectIndex = Number(searchParams.get("selectIndex"));

  if (!artistId) {
    return Response.json([]);
  }

  const { streamsResult, metaResult, streamMax } = await queryArtistDetails(
    supabase,
    artistId
  );

  if (streamsResult.error) {
    throw streamsResult.error;
  }

  if (metaResult.error) {
    throw metaResult.error;
  }

  return Response.json({
    streams: streamsResult.data,
    meta: metaResult.data.map((artist) => ({
      id: artist.id,
      name: artist.name,
      image: artist.image,
      genres: artist.genres,
      selectIndex: selectIndex,
      maxListens: streamMax.data.find((stream) => stream.id === artist.id)
        ?.max_listens,
      minListens: streamMax.data.find((stream) => stream.id === artist.id)
        ?.min_listens,
      currentListens: streamsResult.data.filter(
        (stream) =>
          stream.id === artist.id &&
          stream.updated_at ===
            streamMax.data.find((stream) => stream.id === artist.id)
              ?.max_updated_at
      )[0]?.monthly_listeners,
    })),
  });
}
