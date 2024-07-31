"use client";

import { ArtistSample } from "@/lib/types";
import { useExplore, useExploreDispatch } from "@/contexts/ExploreContext";
import ExploreArtistSelect from "./explore-artist-select";
import { ExploreState } from "@/contexts/types";
import { useEffect } from "react";
import { PlusIcon } from "@radix-ui/react-icons";
import { Button } from "./ui/button";

async function fetchArtistStreams(artistIds: string[] | undefined) {
  if (!artistIds) {
    return [];
  }

  const response = await fetch(`/api/artist-streams?id=${artistIds.join(",")}`);
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
  const { selectedArtists } = useExplore();
  const exploreDispatch = useExploreDispatch();

  useEffect(() => {
    if (!selectedArtists.find((artist) => artist.selectIndex === 0)?.artistId) {
      exploreDispatch?.({
        type: "ADD_ARTIST",
        payload: defaultArtist,
      });
      fetchArtistStreams([defaultArtist?.artistId])
        .then((data) => {
          exploreDispatch?.({
            type: "ADD_ARTIST_STREAMS",
            payload: data,
          });
        })
        .catch((error) => {
          throw error;
        });
    } else {
      fetchArtistStreams(selectedArtists.map((artist) => artist.artistId))
        .then((data) => {
          exploreDispatch?.({
            type: "ADD_ARTIST_STREAMS",
            payload: data,
          });
        })
        .catch((error) => {
          throw error;
        });
    }
  }, [selectedArtists, exploreDispatch, defaultArtist]);

  return (
    <div className="flex items-center gap-2">
      {selectedArtists.map((artist) => (
        <ExploreArtistSelect
          key={artist.selectIndex}
          defaultArtistSample={defaultArtistSample}
          selectIndex={artist.selectIndex}
        />
      ))}
      <Button size="sm" variant="outline">
        <PlusIcon stroke="green" />
      </Button>
    </div>
  );
}
