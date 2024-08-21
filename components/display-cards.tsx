import { ExploreCard } from "./explore-card";
import { SelectedArtist } from "@/lib/types";

export const DisplayCards = ({
  artists,
  className,
}: {
  artists: SelectedArtist[];
  className?: string;
}) => {
  return (
    <div className={`overflow-hidden w-full display-cards ${className}`}>
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
