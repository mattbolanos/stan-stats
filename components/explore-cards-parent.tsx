"use client";

import { ArtistDetailsResponse, ArtistSample } from "@/lib/types";
import { useExplore, useExploreDispatch } from "@/contexts/ExploreContext";
import { useEffect, useState } from "react";
import {
  FAKE_ARTIST_ID,
  fetchArtistDetails,
  getFirstAvailableIndex,
} from "@/lib/utils";
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
  const [loading, setLoading] = useState(false);

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

  const maxRank = Math.max(...selectedArtists.map((artist) => artist.rank));

  const handleAddArtist = async () => {
    setLoading(true);
    try {
      const response = await fetch(
        `/api/artists/add?artistRank=${maxRank + 1}`
      );

      if (!response.ok) {
        return;
      }

      const newId = await response.json();

      fetchArtistDetails(newId, getFirstAvailableIndex(selectedArtists))
        .then((data) => {
          exploreDispatch?.({
            type: "ADD_ARTIST_DETAILS",
            payload: data,
          });
        })
        .catch((error) => {
          throw error;
        });
    } catch (error) {
      return;
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center gap-2.5 justify-start">
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
              exploreDispatch={exploreDispatch}
              selectedArtistsLength={selectedArtists.length}
            />
          ))}
          {selectedArtists.length < 3 && (
            <>
              <Button
                className="w-full bg-green-600 font-bold"
                variant="outline"
                onClick={handleAddArtist}
              >
                Add Artist
              </Button>
              {loading && <Spinner size={5} />}
            </>
          )}
        </>
      )}
    </div>
  );
}
