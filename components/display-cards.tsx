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
      <div className="animate-scroll flex items-stretch">
        {[...artists, ...artists, ...artists].map((artist, index) => (
          <div
            key={index}
            className="flex-shrink-0 flex items-center justify-center text-foreground"
            style={{ width: "var(--display-card-width)" }}
          >
            <ExploreCard artist={artist} displayArtist={true} />
          </div>
        ))}
      </div>
    </div>
  );
};
