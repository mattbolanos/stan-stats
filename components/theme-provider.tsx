"use client";

import * as React from "react";
import { ThemeProvider as NextThemesProvider, useTheme } from "next-themes";
import { type ThemeProviderProps } from "next-themes/dist/types";
import { MoonIcon, SunIcon } from "@radix-ui/react-icons";
import { NavButton } from "@/components/ui/button";

export function ThemeProvider({ children, ...props }: ThemeProviderProps) {
  return <NextThemesProvider {...props}>{children}</NextThemesProvider>;
}

export function ThemeToggle() {
  const { setTheme, resolvedTheme } = useTheme();

  return (
    <NavButton
      onClick={() => setTheme(resolvedTheme === "dark" ? "light" : "dark")}
      icon={
        <>
          <SunIcon className="shrink-0 h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
          <MoonIcon className="absolute shrink-0 h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
          <span className="sr-only">Toggle theme</span>
        </>
      }
    />
  );
}
