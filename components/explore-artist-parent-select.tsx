"use client";

import { ArtistSample } from "@/lib/types";
import { useExplore, useExploreDispatch } from "@/contexts/ExploreContext";
import ExploreArtistSelect from "./explore-artist-select";
import { ExploreState } from "@/contexts/types";
import { useEffect } from "react";

export default function ExploreArtistParentSelect({
  defaultArtistSample = [],
  defaultArtist,
}: {
  defaultArtistSample?: ArtistSample[];
  defaultArtist?: ExploreState["selectedArtists"][0];
}) {
  const { selectedArtists } = useExplore();
  const exploreDispatch = useExploreDispatch();

  useEffect(() => {
    if (!selectedArtists.find((artist) => artist.selectIndex === 0)?.artistId) {
      exploreDispatch &&
        exploreDispatch({
          type: "ADD_ARTIST",
          payload: defaultArtist,
        });
    }
  }, [selectedArtists, exploreDispatch, defaultArtist]);

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
