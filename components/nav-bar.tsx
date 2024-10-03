import Image from "next/image";
import {
  GitHubLogoIcon,
  HeartFilledIcon,
  InfoCircledIcon,
} from "@radix-ui/react-icons";
import { ThemeToggle } from "./theme-provider";
import { NavButton } from "@/components/ui/button";
import { NAV_BTN_ICON_DIM } from "@/lib/utils";

function infoPopoverContent() {
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
        We use Spotify&apos;s API Search endpoint with a myriad of queries to
        find a wide breadth of artists. An artist must have 5k+ followers to be
        included in our database.
      </p>
    </div>
  );
}

export default function NavBar() {
  return (
    <nav className="flex items-center justify-between px-10 h-14 sticky top-0 z-40 backdrop-blur-sm">
      <div className="flex items-center max-w-screen-2xl">
        <div className="flex items-center space-x-2 nav-logo mr-5">
          <Image src="/spotify-color.svg" alt="logo" width={24} height={24} />
          <span className="font-bold">Chart.ml</span>
        </div>
      </div>
      <div className="flex justify-end gap-1.5 items-center">
        <NavButton
          icon={
            <InfoCircledIcon
              height={NAV_BTN_ICON_DIM}
              width={NAV_BTN_ICON_DIM}
            />
          }
          popoverContent={infoPopoverContent()}
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
