import { ExploreCard } from "./explore-card";
import { SelectedArtist } from "@/lib/types";

export const DisplayCards = ({ artists }: { artists: SelectedArtist[] }) => {
  return (
    <div className="overflow-hidden max-w-3xl display-cards">
      <div className="animate-scroll flex gap-[--display-card-gap] items-stretch">
        {artists.map((artist, index) => (
          <div
            key={index}
            className="flex items-center justify-center text-foreground"
          >
            <ExploreCard artist={artist} displayArtist={true} />
          </div>
        ))}
        {artists.map((artist, index) => (
          <div
            key={index}
            className="flex items-center justify-center text-foreground"
          >
            <ExploreCard artist={artist} displayArtist={true} />
          </div>
        ))}
      </div>
    </div>
  );
};
