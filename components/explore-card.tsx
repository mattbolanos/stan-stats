"use client";

import Image from "next/image";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "./ui/card";
import { useExplore } from "@/contexts/ExploreContext";
import { cleanGenres } from "@/lib/utils";

export function ExploreCard() {
  const { selectedArtists } = useExplore();

  return (
    <div className="flex flex-col gap-3">
      {selectedArtists
        .filter((artist) => artist.id)
        .map((artist) => (
          <Card className="w-96" key={artist.selectIndex}>
            <CardHeader className="mb-3 px-5">
              <div className="flex items-start space-x-3">
                <Image
                  src={artist.image}
                  alt={artist.name}
                  height={96}
                  width={96}
                  className="min-w-24 min-h-24 max-w-24 max-h-24 rounded-md"
                />
                <div className="flex flex-col">
                  <CardTitle>{artist.name}</CardTitle>
                  <CardDescription className="text-xs mt-1">
                    Genres: {cleanGenres(artist.genres)}
                  </CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="px-5 pb-2">
              <p className="text-sm text-gray-400">Current Monthly Listeners</p>
              <p className="text-lg font-bold">
                {artist.currentListens.toLocaleString()}
              </p>
              <p className="text-xs text-green-500">
                +
                {(
                  ((artist.currentListens - artist.minListens) /
                    artist.minListens) *
                  100
                ).toFixed(2)}
                % from lowest
              </p>
            </CardContent>
          </Card>
        ))}
    </div>
  );
}
