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
import { TrendingDown, TrendingUp } from "lucide-react";

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
              <div className="flex justify-start items-start gap-10">
                <div>
                  <p className="text-sm text-gray-400">Artist Rank</p>
                  <div>#{artist.rank}</div>
                </div>
                <div>
                  <p className="text-sm text-gray-400">
                    Current Monthly Listeners
                  </p>

                  <div className="flex items-center space-x-1.5 text-xs">
                    <p className="text-lg font-bold mr-1">
                      {artist.currentListens?.toLocaleString()}
                    </p>
                    <p
                      className={`text-xs  flex items-center gap-1 ${
                        artist.currentListens - artist.prevListens >= 0
                          ? "text-green-500"
                          : "text-red-500"
                      }`}
                    >
                      {artist.currentListens - artist.prevListens >= 0 ? (
                        <TrendingUp size={16} />
                      ) : (
                        <TrendingDown size={16} />
                      )}
                      {formatMonthlyListeners(
                        Math.abs(artist.currentListens - artist.prevListens)
                      )}
                    </p>
                    <p className="text-gray-400">Daily +/-</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
    </div>
  );
}
