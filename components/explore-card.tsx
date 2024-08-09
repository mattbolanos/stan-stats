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
import { InstagramLogoIcon, TwitterLogoIcon } from "@radix-ui/react-icons";
import { Button } from "./ui/button";

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
          <Card
            className="w-96"
            key={artist.selectIndex}
            style={{
              border: `2px solid hsl(var(--chart-${artist.selectIndex + 1}))`,
            }}
          >
            <CardHeader className="mb-3 px-5">
              <div className="flex items-start space-x-3">
                <Image
                  src={artist.image}
                  alt={artist.name}
                  height={96}
                  width={96}
                  className="min-w-24 min-h-24 max-w-24 max-h-24 rounded-md"
                />
                <div className="flex flex-col gap-1">
                  <CardTitle>{artist.name}</CardTitle>
                  <div className="flex items-center gap-1.5">
                    {artist.urlInstagram && (
                      <Button
                        size="icon"
                        variant="link"
                        className="instagram-logo"
                      >
                        <a
                          target="_blank"
                          href={artist.urlInstagram}
                          rel="noopener noreferrer"
                        >
                          <InstagramLogoIcon
                            height={20}
                            width={20}
                            className="h-5 w-5"
                          />
                        </a>
                      </Button>
                    )}
                    {artist.urlTwitter && (
                      <Button
                        size="icon"
                        variant="link"
                        className="twitter-logo"
                      >
                        <a
                          target="_blank"
                          href={artist.urlTwitter}
                          rel="noopener noreferrer"
                        >
                          <TwitterLogoIcon
                            height={20}
                            width={20}
                            className="h-5 w-5"
                          />
                        </a>
                      </Button>
                    )}
                  </div>
                  <CardDescription className="text-xs">
                    <div className="flex flex-col gap-1">
                      {artist.genres && (
                        <p>Genres: {cleanGenres(artist.genres)}</p>
                      )}
                      <div className="flex items-center space-x-1.5">
                        {artist.albumsCount && (
                          <p>Albums: {artist.albumsCount}</p>
                        )}
                        {artist.singlesCount && (
                          <p>Singles: {artist.singlesCount}</p>
                        )}
                      </div>
                    </div>
                  </CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="px-5 pb-2 space-y-0.5">
              <div className="flex justify-start items-start gap-7">
                <div>
                  <p className="text-sm text-gray-400">Artist Rank</p>
                  <div className="flex items-center space-x-2 text-xs">
                    <p className="text-lg font-bold">#{artist.rank}</p>

                    {artist.prevRank &&
                      changeText(artist.prevRank - artist.rank, Math.abs)}
                  </div>
                </div>
                <div>
                  <p className="text-sm text-gray-400">Monthly Listeners</p>
                  <div className="flex items-center space-x-2 text-xs">
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
