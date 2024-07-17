import Image from "next/image";
import Link from "next/link";
import {
  GitHubLogoIcon,
  HeartFilledIcon,
  InfoCircledIcon,
} from "@radix-ui/react-icons";
import { ThemeToggle } from "./theme-provider";
import { NavButton } from "@/components/ui/button";
import { navButtonIconDim } from "@/lib/utils";

export default function NavBar() {
  return (
    <nav className="flex items-center justify-between px-6 py-2">
      <div className="flex items-center max-w-screen-2xl">
        <div className="flex items-center space-x-2 nav-logo">
          <Image src="/spotify-color.svg" alt="logo" width={24} height={24} />
          <span className="font-bold">Listener-ify</span>
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
          popoverContent={<div>hi</div>}
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
