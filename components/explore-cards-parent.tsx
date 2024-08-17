"use client";

import { ArtistDetailsResponse, ArtistSample } from "@/lib/types";
import { useExplore, useExploreDispatch } from "@/contexts/ExploreContext";
import { useEffect } from "react";
import { FAKE_ARTIST_ID } from "@/lib/utils";
import { Spinner } from "./ui/spinner";
import { ExploreCard } from "./explore-card";
import { Button } from "./ui/button";

export default function ExploreCardsParent({
  defaultArtistSample = [],
  defaultDetails,
}: {
  defaultArtistSample: ArtistSample[];
  defaultDetails: ArtistDetailsResponse;
}) {
  const { selectedArtists, artistStreams } = useExplore();
  const exploreDispatch = useExploreDispatch();

  const intialLoad = selectedArtists[0].id === FAKE_ARTIST_ID;

  useEffect(() => {
    if (intialLoad) {
      exploreDispatch?.({
        type: "ADD_ARTIST_DETAILS",
        payload: defaultDetails,
      });
    }
  }, [
    selectedArtists,
    exploreDispatch,
    defaultDetails,
    artistStreams.length,
    intialLoad,
  ]);

  return (
    <div className="flex flex-col items-center gap-3.5 justify-start">
      {intialLoad ? (
        <div className="flex items-center gap-2.5 justify-start">
          <Spinner size={5} />
          <span className="loading-text">Loading</span>
        </div>
      ) : (
        <>
          {selectedArtists.map((artist) => (
            <ExploreCard
              key={artist.selectIndex}
              artist={artist}
              defaultArtistSample={defaultArtistSample}
              exploreDispatch={exploreDispatch}
              selectedArtistsLength={selectedArtists.length}
            />
          ))}
          {selectedArtists.length < 3 && (
            <Button
              className="w-full bg-green-600 font-bold"
              variant="outline"
              onClick={() =>
                exploreDispatch?.({
                  type: "ADD_ARTIST",
                })
              }
            >
              Add Artist
            </Button>
          )}
        </>
      )}
    </div>
  );
}
