"use client";

import { ArtistDetailsResponse, ArtistSample } from "@/lib/types";
import { useExplore, useExploreDispatch } from "@/contexts/ExploreContext";
import ExploreArtistSelect from "./explore-artist-select";
import { Button } from "./ui/button";
import { useEffect } from "react";
import { FAKE_ARTIST_ID } from "@/lib/utils";

export async function fetchArtistStreams(
  artistId: string | undefined,
  selectIndex: number
) {
  if (!artistId) {
    return [];
  }

  const response = await fetch(
    `/api/artists/details?artistId=${artistId}&selectIndex=${selectIndex}`
  );
  if (!response.ok) {
    return [];
  }
  return response.json();
}

export default function ExploreArtistParentSelect({
  defaultArtistSample = [],
  defaultDetails,
}: {
  defaultArtistSample: ArtistSample[];
  defaultDetails: ArtistDetailsResponse;
}) {
  const { selectedArtists } = useExplore();
  const exploreDispatch = useExploreDispatch();

  useEffect(() => {
    if (selectedArtists[0].id === FAKE_ARTIST_ID) {
      exploreDispatch?.({
        type: "ADD_ARTIST_DETAILS",
        payload: defaultDetails,
      });
    }
  }, [selectedArtists, exploreDispatch, defaultDetails]);

  return (
    <div className="flex items-center gap-3 flex-wrap justify-start flex-col sm:flex-row">
      {selectedArtists.map((artist) => (
        <ExploreArtistSelect
          key={artist.selectIndex}
          defaultArtistSample={defaultArtistSample}
          selectIndex={artist.selectIndex}
        />
      ))}
      {selectedArtists.length < 5 && (
        <Button
          variant="secondary"
          className="w-[100px] justify-center"
          onClick={() => {
            exploreDispatch?.({ type: "ADD_ARTIST" });
          }}
        >
          Add Artist
        </Button>
      )}
    </div>
  );
}
