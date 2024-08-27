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

export default async function Home() {
  const defaultArtistSample = await fetchDefaultArtistSample();
  const dateRange = await fetchDateRange();
  const defaultDetails = await fetchDefaultArtistDetails();
  const { totalArtists, totalAlbums, totalSingles } = await fetchTotals();

  return (
    <main className="px-16 sm:mt-28 mt-2 mb-10 flex flex-col gap-10">
      <div className="flex flex-col justify-center items-center text-center space-y-10">
        <h1 className="text-4xl sm:text-5xl font-bold tracking-tight">
          Spotify Artist <span className="color-site-primary">Popularity</span>{" "}
          by the Numbers
        </h1>

        <p
          className="text-xl text-muted-foreground max-w-3xl text-center leading-relaxed"
          style={{ textWrap: "balance" }}
        >
          Stan like a pro. Compare your faves daily. See who&apos;s hot and
          who&apos;s not. Free to use, always.
        </p>
        <WelcomeButton />
      </div>
      <div className="max-w-6xl mx-auto w-full">
        <ArtistBanner className="mt-3 flex justify-center" />
      </div>
      <SectionTitle
        text="About the Database"
        icon={DatabaseIcon}
        className="mt-6 mx-auto"
      />
      <HeroCards
        dateRange={dateRange}
        totalArtists={totalArtists}
        totalAlbums={totalAlbums}
        totalSingles={totalSingles}
      />

      <section className="flex flex-col items-center mt-20 gap-10" id="explore">
        <SectionTitle text="Artist Trends" icon={TrendingUpIcon} />
        <div className="flex justify-center gap-6 w-full">
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
