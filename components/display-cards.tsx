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
      <div className="animate-scroll flex items-stretch h-[200px]">
        {[...artists, ...artists, ...artists].map((artist, index) => (
          <div
            key={index}
            className="flex items-center"
            style={{ width: "var(--display-card-width)" }}
          >
            <ExploreCard artist={artist} displayArtist={true} />
          </div>
        ))}
      </div>
    </div>
  );
};
