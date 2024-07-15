"use client";

import Image from "next/image";
import Link from "next/link";
import {
  GitHubLogoIcon,
  HeartFilledIcon,
  InfoCircledIcon,
} from "@radix-ui/react-icons";
import { ThemeToggle } from "./theme-provider";

export default function NavBar() {
  return (
    <nav className="flex items-center justify-between px-8 py-4">
      <div className="flex items-center max-w-screen-2xl">
        <div className="flex items-center space-x-2 nav-logo">
          <Image src="/spotify-color.svg" alt="logo" width={24} height={24} />
          <span className="font-bold">SonoGraph</span>
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
      <div className="flex justify-end gap-4 items-center">
        <InfoCircledIcon height={24} width={24} />
        <GitHubLogoIcon height={24} width={24} />
        <HeartFilledIcon height={24} width={24} color="red" />
        <ThemeToggle />
      </div>
    </nav>
  );
}
