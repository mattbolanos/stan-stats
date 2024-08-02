"use client";

import { ArtistSample } from "@/lib/types";
import { useExplore, useExploreDispatch } from "@/contexts/ExploreContext";
import ExploreArtistSelect from "./explore-artist-select";
import { ExploreState } from "@/contexts/types";
import { useEffect } from "react";
import { Button } from "./ui/button";

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
    throw new Error("Network response was not ok");
  }
  return response.json();
}

export default function ExploreArtistParentSelect({
  defaultArtistSample = [],
  defaultArtist,
}: {
  defaultArtistSample: ArtistSample[];
  defaultArtist: ExploreState["selectedArtists"][0];
}) {
  const { selectedArtists, artistStreams } = useExplore();
  const exploreDispatch = useExploreDispatch();

  useEffect(() => {
    if (artistStreams.length < 1 && defaultArtist) {
      fetchArtistStreams(defaultArtist?.id, 0)
        .then((data) => {
          exploreDispatch?.({
            type: "ADD_ARTIST_DETAILS",
            payload: data,
          });
        })
        .catch((error) => {
          throw error;
        });
    }
  }, [selectedArtists, exploreDispatch, defaultArtist, artistStreams.length]);

  return (
    <div className="flex items-center gap-2 flex-wrap px-5 justify-start flex-col sm:flex-row">
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
