"use client";

import { ArtistSample } from "@/lib/types";

export default function ExploreArtistSelect({
  artistSample,
}: {
  artistSample: ArtistSample[];
}) {
  return (
    <div className="flex flex-col items-center justify-center w-full h-full">
      <h1 className="text-4xl font-bold">Explore Artists</h1>
    </div>
  );
}
