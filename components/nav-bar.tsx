"use client";

import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu";
import Image from "next/image";
import Link from "next/link";

export default function NavBar() {
  return (
    <nav className="flex items-center justify-between p-4">
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
    </nav>
  );
}
