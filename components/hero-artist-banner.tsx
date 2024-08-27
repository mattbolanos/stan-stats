import { ExploreCard } from "./explore-card";
import { fetchHeroArtists } from "@/app/actions";

export const ArtistBanner = async ({ className }: { className?: string }) => {
  const heroArtists = await fetchHeroArtists();

  return (
    <div className={`overflow-hidden w-full display-cards ${className}`}>
      <div className="animate-scroll flex items-stretch h-[200px]">
        {[...heroArtists, ...heroArtists, ...heroArtists].map(
          (artist, index) => (
            <div
              key={index}
              className="flex items-center"
              style={{ width: "var(--display-card-width)" }}
            >
              <ExploreCard artist={artist} displayArtist={true} />
            </div>
          )
        )}
      </div>
    </div>
  );
};
