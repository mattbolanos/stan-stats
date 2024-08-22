"use client";

import { ArtistDetailsResponse, ArtistSample } from "@/lib/types";
import { useExplore, useExploreDispatch } from "@/contexts/ExploreContext";
import { useEffect } from "react";
import { FAKE_ARTIST_ID } from "@/lib/utils";
import { ExploreCard } from "./explore-card";
import { Button } from "./ui/button";
import { Skeleton } from "./ui/skeleton";

const SkeletonCard = () => {
  return (
    <Skeleton className="w-[var(--display-card-width)] h-[195px] px-4 flex">
      <Skeleton className="mt-3 max-w-[90px] max-h-[90px] min-w-[90px] min-h-[90px] rounded-md" />
      <Skeleton className="mt-3 w-3/5 h-[20px] ml-2" />
    </Skeleton>
  );
};

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
        <>
          <SkeletonCard />
          <SkeletonCard />
        </>
      ) : (
        <>
          {selectedArtists.map((artist) => (
            <ExploreCard
              key={artist.selectIndex}
              artist={artist}
              defaultArtistSample={defaultArtistSample}
              exploreDispatch={exploreDispatch}
              validArtistsLength={
                selectedArtists.filter(
                  (artist) => artist.show && artist.id !== FAKE_ARTIST_ID
                ).length
              }
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
