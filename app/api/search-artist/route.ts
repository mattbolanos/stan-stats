import { supabase } from "@/lib/supabase";
import { NextResponse } from "next/server";

function cleanArtistName(name: string): string {
  return name
    .trim() // Remove leading and trailing whitespace
    .toLowerCase() // Convert to lowercase
    .normalize("NFD") // Normalize Unicode characters
    .replace(/[\u0300-\u036f]/g, "") // Remove diacritical marks
    .replace(/[^\w]/g, "") // Remove all non-alphanumeric characters, including spaces
    .trim(); // Trim again in case the previous operations left any whitespace
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const query = searchParams.get("query");

  if (!query) {
    return NextResponse.json([]);
  }

  const { data, error } = await supabase
    .from("spotify-artists-meta")
    .select("id, name")
    .ilike("slug", `%${cleanArtistName(query)}%`)
    .order("popularity", { ascending: false })
    .range(0, 20);

  if (error) {
    throw error;
  }

  return NextResponse.json(data);
}
