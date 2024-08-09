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
import { cleanGenres, formatMonthlyListeners } from "@/lib/utils";
import { MoveHorizontal, TrendingDown, TrendingUp } from "lucide-react";

const changeText = (change: number, formatFn?: any) => {
  let formattedValue = formatFn ? formatFn(change) : change;

  if (change > 0) {
    return (
      <p className="text-xs flex items-center gap-1 text-green-500">
        <TrendingUp size={16} />
        {formattedValue}
      </p>
    );
  } else if (change < 0) {
    return (
      <p className="text-xs flex items-center gap-1 text-red-500">
        <TrendingDown size={16} />
        {formattedValue}
      </p>
    );
  } else {
    return (
      <p className="text-xs flex items-center gap-1">
        <MoveHorizontal size={16} />
        {formattedValue}
      </p>
    );
  }
};

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
            <CardContent className="px-5 pb-2 space-y-0.5">
              <div className="flex justify-start items-start gap-5">
                <div>
                  <p className="text-sm text-gray-400">Artist Rank</p>
                  <div className="flex items-center space-x-3 text-xs">
                    <p className="text-lg font-bold">#{artist.rank}</p>

                    {artist.prevRank &&
                      changeText(artist.prevRank - artist.rank, Math.abs)}
                  </div>
                </div>
                <div>
                  <p className="text-sm text-gray-400">Monthly Listeners</p>
                  <div className="flex items-center space-x-3 text-xs">
                    <p className="text-lg font-bold">
                      {artist.currentListens?.toLocaleString()}
                    </p>
                    {changeText(
                      artist.currentListens - artist.prevListens,
                      formatMonthlyListeners
                    )}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
    </div>
  );
}
