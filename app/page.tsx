import { ArtistBanner } from "@/components/hero-artist-banner";
import ExploreCardsParent from "@/components/explore-cards-parent";
import { ExploreChart } from "@/components/explore-chart";
import { HeroCards } from "@/components/hero-cards";
import { WelcomeButton } from "@/components/hero-button";
import { DatabaseIcon, TrendingUpIcon } from "lucide-react";
import { SectionTitle } from "@/components/section-title";
import {
  fetchDefaultArtistSample,
  fetchDateRange,
  fetchDefaultArtistDetails,
  fetchTotals,
} from "./actions";

export const dynamic = "force-dynamic";

export default async function Home() {
  const defaultArtistSample = await fetchDefaultArtistSample();
  const dateRange = await fetchDateRange();
  const defaultDetails = await fetchDefaultArtistDetails();
  const { totalArtists, totalAlbums, totalSingles } = await fetchTotals();

  return (
    <main className="px-8 sm:px-16 sm:mt-28 mt-8 mb-10 flex flex-col gap-10">
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
      <section
        className="flex flex-col items-center sm:mt-3 mt-2 gap-10 scroll-mt-20"
        id="explore"
      >
        <SectionTitle text="Artist Trends" icon={TrendingUpIcon} />
        <div className="flex justify-center sm:gap-3.5 gap-2.5 w-full flex-col items-center">
          <ExploreCardsParent
            defaultArtistSample={defaultArtistSample}
            defaultDetails={defaultDetails}
          />
          <ExploreChart dateRange={dateRange} />
        </div>
      </section>
    </main>
  );
}
