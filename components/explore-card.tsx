"use client";

import Image from "next/image";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "./ui/card";
import {
  cleanGenres,
  createSpotifyURL,
  formatChartDate,
  formatMonthlyListeners,
} from "@/lib/utils";
import { MoveHorizontal, TrendingDown, TrendingUp } from "lucide-react";
import {
  Cross2Icon,
  ExternalLinkIcon,
  InstagramLogoIcon,
  TwitterLogoIcon,
} from "@radix-ui/react-icons";
import { Button } from "./ui/button";
import ExploreArtistSelect from "./explore-artist-select";
import { ArtistSample, SelectedArtist } from "@/lib/types";
import { Dispatch } from "react";
import { ExploreAction } from "@/contexts/types";
import {
  Tooltip,
  TooltipProvider,
  TooltipTrigger,
  TooltipContent,
} from "./ui/tooltip";

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

export function ExploreCard({
  artist,
  defaultArtistSample,
  exploreDispatch,
  selectedArtistsLength,
  displayArtist = false,
}: {
  artist: SelectedArtist;
  defaultArtistSample?: ArtistSample[];
  exploreDispatch?: Dispatch<ExploreAction> | undefined;
  selectedArtistsLength?: number;
  displayArtist?: boolean;
}) {
  return (
    <Card
      key={artist.selectIndex}
      className="w-96 relative flex flex-col"
      style={{
        border: `2.5px solid ${
          displayArtist
            ? "currentColor"
            : `hsl(var(--chart-${artist.selectIndex + 1}))`
        }`,
      }}
    >
      {!displayArtist && (
        <>
          <div className="absolute top-1 mt-0.5 flex items-center justify-between w-full pl-4 pr-2">
            <div className="flex items-center">
              {artist.id &&
                socialButton(
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
            <ExploreArtistSelect
              key={artist.selectIndex}
              defaultArtistSample={defaultArtistSample || []}
              selectIndex={artist.selectIndex}
            />
          </div>
          <div className="absolute bottom-2 z-10 flex items-center w-full pr-2 justify-end">
            <Button
              size="mini"
              variant="ghost"
              disabled={selectedArtistsLength === 1}
              onClick={() => {
                exploreDispatch?.({
                  type: "REMOVE_ARTIST",
                  payload: artist.selectIndex,
                });
              }}
            >
              <Cross2Icon className="w-6 h-6 shrink-0 text-red-600" />
            </Button>
          </div>
        </>
      )}
      <CardHeader
        className={`mt-4 mb-3 px-4 flex-grow ${artist.id ? "mt-4" : "mt-0"}`}
      >
        <div className="flex items-start space-x-3">
          {artist.image && (
            <Image
              src={artist.image}
              alt={artist.name}
              height={90}
              width={90}
              className="max-w-[90px] max-h-[90px] min-w-[90px] min-h-[90px] rounded-md border-gray-700 border-x border-y"
            />
          )}
          <div className="flex flex-col w-full">
            <CardTitle className="pr-0.5">
              {artist.name ? artist.name : "No Artist Selected"}
            </CardTitle>
            <CardDescription className="text-xs mt-3 flex justify-between">
              <div className="flex flex-col space-y-1.5 max-w-[100px] w-[100px]">
                {artist.id && (
                  <TooltipProvider>
                    <Tooltip delayDuration={150}>
                      <TooltipTrigger asChild className="cursor-pointer">
                        <p className="truncate">
                          <span className="text-muted-foreground">Genre</span>{" "}
                          <span>{cleanGenres(artist.genres)}</span>
                        </p>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>{cleanGenres(artist.genres)}</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                )}

                {artist.albumsCount > 0 && (
                  <p>
                    <span className="text-muted-foreground">Albums</span>{" "}
                    <span>{artist.albumsCount}</span>
                  </p>
                )}
                {artist.singlesCount > 0 && (
                  <p>
                    <span className="text-muted-foreground">Singles</span>{" "}
                    <span>{artist.singlesCount}</span>
                  </p>
                )}
              </div>
              {artist.latestReleaseName && (
                <div className="flex flex-col space-y-1.5 max-w-[130px] w-[130px]">
                  <span className="text-muted-foreground flex items-center">
                    {artist.latestReleaseShareUrl ? (
                      <a
                        target="_blank"
                        href={artist.latestReleaseShareUrl}
                        rel="noopener noreferrer"
                        className="hover:bg-accent rounded-md flex items-center gap-1"
                      >
                        Latest Release
                        <ExternalLinkIcon
                          className="w-3 h-3 color-site-primary"
                          strokeWidth={3}
                        />
                      </a>
                    ) : (
                      "Latest Release"
                    )}
                  </span>
                  <TooltipProvider>
                    <Tooltip delayDuration={150}>
                      <TooltipTrigger asChild className="cursor-pointer">
                        <span
                          className="truncate"
                          title={artist.latestReleaseName}
                        >
                          {artist.latestReleaseName}
                        </span>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>{artist.latestReleaseName}</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                  <span className="text-muted-foreground">
                    {formatChartDate(artist.latestReleaseDate)}
                  </span>
                </div>
              )}
            </CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent className="px-5 pb-1 space-y-0.5 mt-auto">
        <div className="flex justify-start items-center gap-6">
          {artist.rank > 0 && (
            <div>
              <p className="text-sm text-muted-foreground">Artist Rank</p>
              <div className="flex items-center space-x-1.5 text-xs">
                <p className="text-lg font-bold">#{artist.rank}</p>

                {artist.prevRank > 0 &&
                  artist.rank > 0 &&
                  changeText(artist.prevRank - artist.rank, Math.abs)}
              </div>
            </div>
          )}
          {artist.currentListens > 0 && (
            <div>
              <p className="text-sm text-muted-foreground">Monthly Listeners</p>
              <div className="flex items-center space-x-1.5 text-xs">
                <p className="text-lg font-bold">
                  {artist.id &&
                    (artist.currentListens > 0
                      ? artist.currentListens.toLocaleString()
                      : "N/A")}
                </p>
                {artist.currentListens > 0 &&
                  artist.prevListens > 0 &&
                  changeText(
                    artist.currentListens - artist.prevListens,
                    formatMonthlyListeners
                  )}
              </div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
