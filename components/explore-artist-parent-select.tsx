"use client";

import { ArtistSample } from "@/lib/types";
import { useExplore } from "@/contexts/ExploreContext";
import ExploreArtistSelect from "./explore-artist-select";

export default function ExploreArtistParentSelect({
  artistSample = [],
}: {
  artistSample?: ArtistSample[];
}) {
  const { selectedArtists } = useExplore();

  return (
    <>
      {selectedArtists.map((artist) => (
        <ExploreArtistSelect
          key={artist.selectIndex}
          artistSample={artistSample}
          selectIndex={artist.selectIndex}
        />
      ))}
    </>
  );
}
