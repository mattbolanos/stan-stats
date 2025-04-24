import { ArtistBanner } from "@/components/hero-artist-banner";
import ExploreCardsParent from "@/components/explore-cards-parent";
import { ExploreChart } from "@/components/explore-chart";
import { HeroCards } from "@/components/hero-cards";
import { WelcomeButton } from "@/components/hero-button";
import { DatabaseIcon, TrendingUpIcon, AlertTriangle } from "lucide-react";
import { SectionTitle } from "@/components/section-title";
import {
  fetchDefaultArtistSample,
  fetchDateRange,
  fetchDefaultSelectedArtists,
  fetchTotals,
} from "./actions";

export default async function Home() {
  const [dateRange, { totalArtists, totalAlbums, totalSingles }] =
    await Promise.all([fetchDateRange(), fetchTotals()]);

  return (
    <main className="px-4 md:px-16 sm:mt-28 mt-8 mb-10 flex flex-col gap-10">
      <div className="flex flex-col justify-center items-center text-center sm:space-y-8 space-y-4">
        <h1 className="text-xl sm:text-5xl font-bold tracking-tight">
          Spotify Artist <span className="color-site-primary">Popularity</span>{" "}
          by the Numbers
        </h1>

        <p
          className="text-md sm:text-xl text-muted-foreground max-w-3xl text-center leading-relaxed"
          style={{ textWrap: "balance" }}
        >
          Stan like a pro. Compare your faves daily. See who&apos;s hot and
          who&apos;s not. Free to use, always.
        </p>
        <WelcomeButton />
      </div>
      <div className="max-w-6xl mx-auto w-full">
        <ArtistBanner className="mt-2 flex justify-center" />
      </div>
      <SectionTitle
        text="About the Database"
        icon={DatabaseIcon}
        className="sm:mt-2 mt-2 mx-auto"
      />
      <HeroCards
        dateRange={dateRange}
        totalArtists={totalArtists}
        totalAlbums={totalAlbums}
        totalSingles={totalSingles}
      />
      <div className="w-full max-w-4xl mx-auto bg-yellow-100 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-4 mb-4">
        <div className="flex items-center gap-3">
          <AlertTriangle className="size-7 text-yellow-600 dark:text-yellow-500 shrink-0" />
          <p className="text-yellow-800 dark:text-yellow-200">
            Important Notice: This site will not be updated for the time being
            due to recent changes in Spotify&apos;s API that have affected my
            ability to retrieve daily monthly listener data.
          </p>
        </div>
      </div>
      <section
        className="flex flex-col items-center sm:mt-3 mt-2 gap-10 scroll-mt-20"
        id="explore"
      >
        <SectionTitle text="Artist Trends" icon={TrendingUpIcon} />
        <div className="flex justify-center sm:gap-5 gap-3 w-full flex-col items-center">
          <ExploreCardsParent
            defaultArtistSamplePromise={fetchDefaultArtistSample()}
            defaultSelectedArtistsPromise={fetchDefaultSelectedArtists()}
          />
          <ExploreChart dateRange={dateRange} />
        </div>
      </section>
    </main>
  );
}
