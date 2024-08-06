import { supabase } from "@/lib/supabase";
import { DEFAULT_ARTIST_SAMPLE_SIZE } from "@/lib/utils";

function cleanArtistName(name: string): string {
  return name
    .trim() // Remove leading and trailing whitespace
    .toLowerCase() // Convert to lowercase
    .normalize("NFD") // Normalize Unicode characters
    .replace(/[\u0300-\u036f]/g, "") // Remove diacritical marks
    .replace(/[^\w]/g, "") // Remove all non-alphanumeric characters, including spaces
    .trim(); // Trim again in case the previous operations left any whitespace
}

export async function GET(request: Request): Promise<Response> {
  const { searchParams } = new URL(request.url);
  const query = searchParams.get("query");
  const size = Number(searchParams.get("size")) || DEFAULT_ARTIST_SAMPLE_SIZE;

  if (!query) {
    const { data, error } = await supabase
      .from("spotify_artists_meta")
      .select("id, name")
      .order("popularity", { ascending: false })
      .range(0, size);

    if (error) {
      throw error;
    }

    return Response.json(data);
  }

  const { data, error } = await supabase
    .from("spotify_artists_meta")
    .select("id, name")
    .ilike("slug", `%${cleanArtistName(query)}%`)
    .order("popularity", { ascending: false })
    .range(0, size);

  if (error) {
    throw error;
  }

  return Response.json(data);
}
