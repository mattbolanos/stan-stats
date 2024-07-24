"use client";

import { ArtistSample } from "@/lib/types";
import { useExplore } from "@/contexts/ExploreContext";
import ExploreArtistSelect from "./explore-artist-select";

export default function ExploreArtistParentSelect({
  defaultArtistSample = [],
}: {
  defaultArtistSample?: ArtistSample[];
}) {
  const { selectedArtists } = useExplore();

  return (
    <>
      {selectedArtists.map((artist) => (
        <ExploreArtistSelect
          key={artist.selectIndex}
          defaultArtistSample={defaultArtistSample}
          selectIndex={artist.selectIndex}
        />
      ))}
    </>
  );
}
