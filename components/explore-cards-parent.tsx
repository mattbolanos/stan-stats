"use client";

import { ArtistDetailsResponse, ArtistSample } from "@/lib/types";
import { useExplore, useExploreDispatch } from "@/contexts/ExploreContext";
import React, { useEffect } from "react";
import { FAKE_ARTIST_ID } from "@/lib/utils";
import { ExploreCard } from "./explore-card";
import { Button } from "./ui/button";
import { Skeleton } from "./ui/skeleton";
import { PlusIcon } from "@radix-ui/react-icons";

const SkeletonCard = () => {
  return (
    <Skeleton className="w-[var(--display-card-width)] h-[193px] px-4 flex flex-col">
      <div className="flex">
        <Skeleton className="mt-3 max-w-[90px] max-h-[90px] min-w-[90px] min-h-[90px] rounded-md" />
        <div className="flex flex-col gap-3 mt-3 w-3/5 ml-2">
          <Skeleton className="w-full h-4" />
          <Skeleton className="w-full h-4" />
        </div>
      </div>
      <div className="flex justify-start gap-5">
        <div className="flex flex-col gap-3 w-1/5 mt-4">
          <Skeleton className="h-4" />
          <Skeleton className="h-4" />
        </div>
        <div className="flex flex-col gap-3 w-1/5 mt-4">
          <Skeleton className="h-4" />
          <Skeleton className="h-4" />
        </div>
      </div>
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
    <div className="flex flex-col items-center gap-3.5">
      <div className="flex flex-row items-center gap-3.5 justify-center flex-wrap">
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
                    (artist) => artist.id !== FAKE_ARTIST_ID
                  ).length
                }
                shownArtists={
                  selectedArtists.filter((artist) => artist.show).length
                }
              />
            ))}
          </>
        )}
      </div>
      {selectedArtists.length < 3 && (
        <Button
          className="w-full bg-green-600 font-bold max-w-[300px]"
          variant="outline"
          onClick={() =>
            exploreDispatch?.({
              type: "ADD_ARTIST",
            })
          }
        >
          <PlusIcon className="w-5 h-5 mr-1.5" />
          Add Artist
        </Button>
      )}
    </div>
  );
}
