import Image from "next/image";
import Link from "next/link";
import {
  GitHubLogoIcon,
  HamburgerMenuIcon,
  HeartFilledIcon,
  InfoCircledIcon,
} from "@radix-ui/react-icons";
import { ThemeToggle } from "./theme-provider";
import { NavButton } from "@/components/ui/button";
import { formatTotalArtists, NAV_BTN_ICON_DIM } from "@/lib/utils";
import { supabase } from "@/lib/supabase";
import { cache } from "react";

const getTotalArtists = cache(async () => {
  const { count } = await supabase
    .from("spotify_artists_meta")
    .select("id", { count: "exact", head: true });
  return count;
});

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

  return (
    <nav className="flex items-center justify-between px-6 h-14">
      <div className="flex items-center max-w-screen-2xl">
        <div className="flex items-center space-x-2 nav-logo">
          <HamburgerMenuIcon height={24} width={24} className="md:hidden" />
          <Image src="/spotify-color.svg" alt="logo" width={24} height={24} />
          <span className="font-bold">Chart.ml</span>
        </div>
        <nav className="flex items-center gap-4 text-sm lg:gap-6 md:flex hidden">
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
              height={NAV_BTN_ICON_DIM}
              width={NAV_BTN_ICON_DIM}
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
                height={NAV_BTN_ICON_DIM}
                width={NAV_BTN_ICON_DIM}
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
                height={NAV_BTN_ICON_DIM}
                width={NAV_BTN_ICON_DIM}
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
