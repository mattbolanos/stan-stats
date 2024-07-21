import Image from "next/image";
import Link from "next/link";
import {
  GitHubLogoIcon,
  HeartFilledIcon,
  InfoCircledIcon,
} from "@radix-ui/react-icons";
import { ThemeToggle } from "./theme-provider";
import { NavButton } from "@/components/ui/button";
import { formatTotalArtists, navButtonIconDim } from "@/lib/utils";
import { supabase } from "@/lib/supabase";
import { cache } from "react";

const getTotalArtists = cache(async () => {
  const { count } = await supabase
    .from("spotify-artists-meta")
    .select("id", { count: "exact", head: true });
  return count;
});

async function getArtistStreams() {
  "use server";

  const { data } = await supabase
    .from("spotify-artists-streams")
    .select("*")
    .eq("id", "1Xyo4u8uXC1ZmMpatF05PJ");
  return data;
}

function infoPopoverContent(totalArtists: number) {
  return (
    <div className="flex flex-col gap-2.5 px-1">
      <h2 className="text-md font-bold">What is this site?</h2>
      <p className="text-sm">
        Chart.ml is a web app that visualizes the monthly listener counts for
        artists on Spotify. The data is updated daily.
      </p>
      <h2 className="text-md font-bold">
        Why Can&apos;t I Find my Favorite Artist?
      </h2>
      <p className="text-sm">
        We use Spotify&apos;s API Search endpoint to find popular artists. For
        each search, we include the top 1000 most popular artists that Spotify
        suggests.
      </p>
      <span className="text-sm">
        Right now, our database includes{" "}
        <span className="font-bold">{formatTotalArtists(totalArtists)}</span>{" "}
        unique artists.
      </span>
    </div>
  );
}

export default async function NavBar() {
  const totalArtists = await getTotalArtists();
  const streams = await getArtistStreams();
  console.log(streams);

  return (
    <nav className="flex items-center justify-between px-6 py-2">
      <div className="flex items-center max-w-screen-2xl">
        <div className="flex items-center space-x-2 nav-logo">
          <Image src="/spotify-color.svg" alt="logo" width={24} height={24} />
          <span className="font-bold">Chart.ml</span>
        </div>
        <nav className="flex items-center gap-4 text-sm lg:gap-6">
          <Link href="/" legacyBehavior passHref>
            Explore
          </Link>
          <Link href="/charts" legacyBehavior passHref>
            Charts
          </Link>
        </nav>
      </div>
      <div className="flex justify-end gap-1.5 items-center">
        <NavButton
          icon={
            <InfoCircledIcon
              height={navButtonIconDim}
              width={navButtonIconDim}
            />
          }
          popoverContent={infoPopoverContent(totalArtists ?? 0)}
        />
        <NavButton
          icon={
            <a
              target="_blank"
              href="https://github.com/mattbolanos/spotify-stream-app"
              rel="noopener noreferrer"
            >
              <GitHubLogoIcon
                height={navButtonIconDim}
                width={navButtonIconDim}
              />
            </a>
          }
        />
        <NavButton
          icon={
            <a
              target="_blank"
              href="https://www.buymeacoffee.com/mattbolanos"
              rel="noopener noreferrer"
            >
              <HeartFilledIcon
                height={navButtonIconDim}
                width={navButtonIconDim}
                color="red"
              />
            </a>
          }
        />

        <ThemeToggle />
      </div>
    </nav>
  );
}
