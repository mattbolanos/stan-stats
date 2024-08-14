"use client";

import { ArtistDetailsResponse, ArtistSample } from "@/lib/types";
import { useExplore, useExploreDispatch } from "@/contexts/ExploreContext";
import { useEffect } from "react";
import { FAKE_ARTIST_ID } from "@/lib/utils";
import { Spinner } from "./ui/spinner";
import { ExploreCard } from "./explore-card";

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
    <div className="flex items-center gap-3 flex-wrap justify-start flex-col sm:flex-row min-h-9">
      {intialLoad ? (
        <>
          <Spinner size={5} />
          <span className="loading-text">Loading</span>
        </>
      ) : (
        <>
          {selectedArtists.map((artist) => (
            <ExploreCard
              key={artist.selectIndex}
              artist={artist}
              defaultArtistSample={defaultArtistSample}
            />
          ))}
        </>
      )}
    </div>
  );
}
