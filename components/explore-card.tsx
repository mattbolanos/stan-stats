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
  formatMonthlyListeners,
} from "@/lib/utils";
import { MoveHorizontal, TrendingDown, TrendingUp } from "lucide-react";
import {
  Cross2Icon,
  InstagramLogoIcon,
  TwitterLogoIcon,
} from "@radix-ui/react-icons";
import { Button } from "./ui/button";
import ExploreArtistSelect from "./explore-artist-select";
import { ArtistSample, SelectedArtist } from "@/lib/types";
import { Dispatch } from "react";
import { ExploreAction } from "@/contexts/types";

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
      className="min-w-96 max-w-96 relative flex flex-col"
      style={{
        border: `2.5px solid ${
          displayArtist
            ? "currentColor"
            : `hsl(var(--chart-${artist.selectIndex + 1}))`
        }`,
      }}
    >
      {!displayArtist && (
        <div className="absolute top-1 right-1 z-10 flex items-center">
          <ExploreArtistSelect
            key={artist.selectIndex}
            defaultArtistSample={defaultArtistSample || []}
            selectIndex={artist.selectIndex}
          />
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
            <Cross2Icon className="w-5 h-5 shrink-0 text-red-600" />
          </Button>
        </div>
      )}
      <div className="absolute top-2 left-4 z-10 flex items-center">
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
      <CardHeader
        className={`mt-4 mb-3 px-4 flex-grow ${
          artist.id ? "mt-4" : "mt-0"
        } max-w-96`}
      >
        <div className="flex items-start space-x-3">
          {artist.image && (
            <Image
              src={artist.image}
              alt={artist.name}
              height={96}
              width={96}
              className="min-w-24 min-h-24 max-w-24 max-h-24 rounded-md border-gray-700 border-x border-y"
            />
          )}
          <div className="flex flex-col">
            <CardTitle className="pr-0.5">
              {artist.name ? artist.name : "No Artist Selected"}
            </CardTitle>
            <CardDescription className="text-xs mt-1 pr-0.5 flex flex-wrap flex-col">
              <div className="flex flex-col space-y-1">
                {artist.genres && (
                  <p>
                    <span className="text-gray-400">Genre(s)</span>{" "}
                    <span>{cleanGenres(artist.genres)}</span>
                  </p>
                )}
                {artist.albumsCount > 0 && (
                  <p>
                    <span className="text-gray-400">Albums</span>{" "}
                    <span>{artist.albumsCount}</span>
                  </p>
                )}
                {artist.singlesCount > 0 && (
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
        <div className="flex justify-start items-start gap-6">
          {artist.rank > 0 && (
            <div>
              <p className="text-sm text-gray-400">Artist Rank</p>
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
              <p className="text-sm text-gray-400">Monthly Listeners</p>
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
