"use client";

import { Button } from "./ui/button";

export const WelcomeButton = () => {
  return (
    <Button
      size="lg"
      className="bg-slate-900 max-w-64 hover:bg-slate-700 focus:outline-none focus:ring-2 focus:ring-slate-700 focus:ring-offset-2 focus:ring-offset-slate-50 text-white font-semibold h-12 px-6 rounded-lg w-full flex items-center justify-center sm:w-auto dark:bg-site dark:highlight-white/20 dark:hover:bg-green-500"
      onClick={() => {
        const exploreSection = document.getElementById("explore");
        if (exploreSection) {
          exploreSection.scrollIntoView({ behavior: "smooth" });
        }
      }}
    >
      Start Exploring
    </Button>
  );
};
