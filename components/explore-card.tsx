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
import {
  cleanGenres,
  createSpotifyURL,
  formatMonthlyListeners,
} from "@/lib/utils";
import { MoveHorizontal, TrendingDown, TrendingUp } from "lucide-react";
import {
  InstagramLogoIcon,
  MagnifyingGlassIcon,
  TwitterLogoIcon,
} from "@radix-ui/react-icons";
import { Button } from "./ui/button";

const changeText = (change: number, formatFn?: any) => {
  const formattedValue = formatFn ? formatFn(change) : change.toString();

  let Icon, color;
  if (change > 0) {
    Icon = TrendingUp;
    color = "text-green-500";
  } else if (change < 0) {
    Icon = TrendingDown;
    color = "text-red-500";
  } else {
    Icon = MoveHorizontal;
    color = "";
  }

  return (
    <p className={`text-sm flex items-center gap-1 ${color}`}>
      <Icon size={18} />
      {formattedValue}
    </p>
  );
};

const socialButton = (url: string, Icon: React.ReactNode) => (
  <Button size="icon" variant="ghost">
    <a target="_blank" href={url} rel="noopener noreferrer">
      {Icon}
    </a>
  </Button>
);

export function ExploreCards() {
  const { selectedArtists } = useExplore();

  return (
    <div className="flex gap-5">
      {selectedArtists
        .filter((artist) => artist.id)
        .map((artist) => (
          <Card
            key={artist.selectIndex}
            className="w-96 relative flex flex-col"
            style={{
              border: `1.5px solid hsl(var(--chart-${artist.selectIndex + 1}))`,
            }}
          >
            <Button
              size="icon"
              variant="ghost"
              className="absolute top-2 right-2 z-10"
            >
              <MagnifyingGlassIcon className="w-6 h-6 shrink-0" />
            </Button>
            <CardHeader className="mb-3 px-4 flex-grow">
              <div className="flex items-start space-x-3">
                <Image
                  src={artist.image}
                  alt={artist.name}
                  height={96}
                  width={96}
                  className="min-w-24 min-h-24 max-w-24 max-h-24 rounded-md"
                />
                <div className="flex flex-col">
                  <div className="flex items-center flex-wrap justify-start gap-0.5">
                    <CardTitle className="pr-0.5">{artist.name}</CardTitle>
                    <div className="flex items-center">
                      {socialButton(
                        createSpotifyURL(artist.id),
                        <Image
                          src="/spotify-color.svg"
                          alt="Spotify"
                          height={18}
                          width={18}
                          className="min-w-4 min-h-4"
                        />
                      )}
                      {artist.urlInstagram &&
                        socialButton(
                          artist.urlInstagram,
                          <InstagramLogoIcon
                            height={18}
                            width={18}
                            color="hsl(var(--instagram))"
                          />
                        )}
                      {artist.urlTwitter &&
                        socialButton(
                          artist.urlTwitter,
                          <TwitterLogoIcon
                            height={18}
                            width={18}
                            color="hsl(var(--twitter))"
                          />
                        )}
                    </div>
                  </div>
                  <CardDescription className="text-xs mt-1">
                    <div className="flex flex-col space-y-1">
                      {artist.genres && (
                        <p>
                          <span className="text-gray-400">Genre(s)</span>{" "}
                          <span>{cleanGenres(artist.genres)}</span>
                        </p>
                      )}
                      {artist.albumsCount && (
                        <p>
                          <span className="text-gray-400">Albums</span>{" "}
                          <span>{artist.albumsCount}</span>
                        </p>
                      )}
                      {artist.singlesCount && (
                        <p>
                          <span className="text-gray-400">Singles</span>{" "}
                          <span>{artist.singlesCount}</span>
                        </p>
                      )}
                    </div>
                  </CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="px-5 pb-2 space-y-0.5 mt-auto">
              <div className="flex justify-start items-start gap-9">
                <div>
                  <p className="text-sm text-gray-400">Artist Rank</p>
                  <div className="flex items-center space-x-1.5 text-xs">
                    <p className="text-lg font-bold">#{artist.rank}</p>

                    {artist.prevRank &&
                      artist.rank &&
                      changeText(artist.prevRank - artist.rank, Math.abs)}
                  </div>
                </div>
                <div>
                  <p className="text-sm text-gray-400">Monthly Listeners</p>
                  <div className="flex items-center space-x-1.5 text-xs">
                    <p className="text-lg font-bold">
                      {artist.currentListens
                        ? artist.currentListens.toLocaleString()
                        : "N/A"}
                    </p>
                    {artist.currentListens &&
                      artist.prevListens &&
                      changeText(
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
