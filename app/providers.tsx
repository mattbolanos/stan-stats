"use client";

import { ThemeProvider } from "@/components/theme-provider";
import { ExploreProvider } from "@/contexts/ExploreContext";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider
      attribute="class"
      defaultTheme="system"
      enableSystem
      disableTransitionOnChange
    >
      <ExploreProvider>{children}</ExploreProvider>
    </ThemeProvider>
  );
}
