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
  cn,
  createSpotifyURL,
  FAKE_ARTIST_ID,
  formatChartDate,
  formatMonthlyListeners,
} from "@/lib/utils";
import { MoveHorizontal, TrendingDown, TrendingUp } from "lucide-react";
import {
  Cross2Icon,
  ExternalLinkIcon,
  EyeClosedIcon,
  EyeOpenIcon,
  InstagramLogoIcon,
  TwitterLogoIcon,
} from "@radix-ui/react-icons";
import { Button } from "./ui/button";
import ExploreArtistSelect from "./explore-artist-select";
import { ArtistSample, SelectedArtist } from "@/lib/types";
import React, { Dispatch } from "react";
import { ExploreAction } from "@/contexts/types";
import {
  Tooltip,
  TooltipProvider,
  TooltipTrigger,
  TooltipContent,
} from "./ui/tooltip";
import { ArtistImage } from "./artist-image";

const changeText = (change: number, formatFn?: any) => {
  const formattedValue = formatFn ? formatFn(change) : change.toString();

  let Icon, color;
  if (change > 0) {
    Icon = TrendingUp;
    color = "text-site";
  } else if (change < 0) {
    Icon = TrendingDown;
    color = "text-red-500";
  } else {
    Icon = MoveHorizontal;
    color = "";
  }

  return (
    <p className={`text-xs sm:text-sm flex items-center gap-1 ${color}`}>
      <Icon className="shrink-0 sm:w-5 sm:h-5 w-3 h-3" />
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
  validArtistsLength,
  displayArtist = false,
  shownArtists = 0,
}: {
  artist: SelectedArtist;
  defaultArtistSample?: ArtistSample[];
  exploreDispatch?: Dispatch<ExploreAction> | undefined;
  validArtistsLength?: number;
  shownArtists?: number;
  displayArtist?: boolean;
}) {
  return (
    <Card
      key={artist.selectIndex}
      className="w-full sm:w-[var(--display-card-width)] relative flex flex-col border sm:min-h-[193px] min-h-[160px]"
      style={{
        border: `2.5px solid ${
          displayArtist
            ? "hsl(var(--border))"
            : `hsl(var(--chart-${artist.selectIndex + 1}))`
        }`,
      }}
    >
      <>
        <div className="absolute top-1 mt-0.5 flex items-center justify-between w-full pl-4 pr-2">
          <div className="flex items-center gap-0.5">
            {artist.id &&
              socialButton(
                createSpotifyURL(artist.id),
                <Image
                  src="/spotify-color.svg"
                  alt="Spotify"
                  height={18}
                  width={18}
                  className="min-w-4 min-h-4 shrink-0"
                />
              )}
            {artist.urlInstagram &&
              socialButton(
                artist.urlInstagram,
                <InstagramLogoIcon
                  height={18}
                  width={18}
                  color="hsl(var(--instagram))"
                  className="shrink-0"
                />
              )}
            {artist.urlTwitter &&
              socialButton(
                artist.urlTwitter,
                <TwitterLogoIcon
                  height={18}
                  width={18}
                  color="hsl(var(--twitter))"
                  className="shrink-0"
                />
              )}
          </div>
          {!displayArtist && (
            <ExploreArtistSelect
              key={artist.selectIndex}
              defaultArtistSample={defaultArtistSample || []}
              selectIndex={artist.selectIndex}
            />
          )}
        </div>
        {!displayArtist && (
          <div className="absolute bottom-2 z-10 flex items-center w-full pr-2 justify-end sm:gap-2">
            <Button
              size="sm"
              variant="ghost"
              disabled={shownArtists < 2 && artist.show}
              onClick={() => {
                exploreDispatch?.({
                  type: "TOGGLE_SHOW",
                  payload: artist.selectIndex,
                });
              }}
            >
              {artist.show ? (
                <EyeOpenIcon className="sm:w-6 sm:h-6 w-4 h-4 shrink-0" />
              ) : (
                <EyeClosedIcon className="sm:w-6 sm:h-6 w-4 h-4 shrink-0" />
              )}
            </Button>
            <Button
              size="mini"
              variant="ghost"
              disabled={
                validArtistsLength === 1 && artist.id !== FAKE_ARTIST_ID
              }
              onClick={() => {
                exploreDispatch?.({
                  type: "REMOVE_ARTIST",
                  payload: artist.selectIndex,
                });
              }}
            >
              <Cross2Icon className="sm:w-6 sm:h-6 w-4 h-4 shrink-0 text-red-600" />
            </Button>
          </div>
        )}
      </>

      <CardHeader
        className={`mb-3 px-4 flex-grow ${artist.id ? "mt-3.5" : "mt-0"}`}
      >
        <div className="flex items-start space-x-3">
          {artist.image && <ArtistImage artist={artist} />}
          <div className="flex flex-col w-full justify-between h-[90px]">
            <CardTitle
              className={cn(
                artist.name.length > 25
                  ? "sm:text-md text-sm"
                  : "sm:text-xl text-lg",
                "leading-5"
              )}
            >
              {artist.name ? artist.name : "No Artist Selected"}
            </CardTitle>
            <CardDescription className="text-[10px] sm:text-xs flex justify-between">
              <div
                className={cn(
                  "flex flex-col space-y-1.5",
                  artist.latestReleaseName
                    ? "sm:max-w-[115px] sm:w-[115px] w-[80px]"
                    : ""
                )}
              >
                {artist.genres.length > 0 && (
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
                <p>
                  <span className="text-muted-foreground">Albums</span>{" "}
                  <span>{artist.albumsCount || "0"}</span>
                </p>
                <p>
                  <span className="text-muted-foreground">Singles</span>{" "}
                  <span>{artist.singlesCount || "0"}</span>
                </p>
              </div>
              {artist.latestReleaseName && (
                <div className="flex flex-col space-y-1.5 sm:max-w-[125px] sm:w-[125px] w-[95px]">
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
      <CardContent className="px-5 pb-1 space-y-0.5 mt-auto sm:ml-1.5">
        <div className="flex justify-start items-center gap-8">
          {artist.rank > 0 && (
            <div>
              <p className="text-xs sm:text-sm text-muted-foreground">
                Artist Rank
              </p>
              <div className="flex items-center space-x-1.5">
                <p className="text-xs sm:text-lg font-bold">#{artist.rank}</p>

                {artist.prevRank > 0 &&
                  artist.rank > 0 &&
                  changeText(artist.prevRank - artist.rank, Math.abs)}
              </div>
            </div>
          )}
          {artist.currentListens > 0 && (
            <div className="sm:ml-0 ml-1">
              <p className="text-xs sm:text-sm text-muted-foreground">
                Monthly Listeners
              </p>
              <div className="flex items-center space-x-1.5">
                <p className="text-xs sm:text-lg font-bold">
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
