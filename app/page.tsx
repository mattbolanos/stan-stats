import { DisplayCards } from "@/components/display-cards";
import ExploreCardsParent from "@/components/explore-cards-parent";
import { ExploreChart } from "@/components/explore-chart";
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { supabase } from "@/lib/supabase";
import { ArtistDetailsResponse, ArtistSample } from "@/lib/types";
import {
  DEFAULT_ARTIST_SAMPLE_SIZE,
  defaultArtists,
  DISPLAY_ARTISTS,
  formatMonthlyListeners,
  queryArtistDetails,
} from "@/lib/utils";
import { ClockIcon } from "@radix-ui/react-icons";
import { DatabaseIcon, Disc3Icon, Mic2Icon, Music2Icon } from "lucide-react";

async function getDefaultArtistSample(
  size: number = DEFAULT_ARTIST_SAMPLE_SIZE
): Promise<ArtistSample[]> {
  "use server";

  const { data, error } = await supabase
    .from("spotify_artists_meta")
    .select("id, name")
    .order("artist_rank", { ascending: true })
    .range(0, size);

  if (error) {
    throw error;
  }

  return data;
}

async function getDateRange(): Promise<{
  min: string;
  max: string;
}> {
  "use server";

  const { data, error } = await supabase
    .from("spotify_artists_streams")
    .select("updated_at.min(), updated_at.max()");

  if (error) {
    throw error;
  }

  return {
    min: data[0].min,
    max: data[0].max,
  };
}

async function getDefaultDetails(
  artistRanks: number[] = defaultArtists
): Promise<ArtistDetailsResponse> {
  "use server";

  const { data, error } = await supabase
    .from("spotify_artists_meta")
    .select("id, name")
    .in("artist_rank", artistRanks);

  if (error) {
    throw error;
  }

  const details = await queryArtistDetails(
    supabase,
    data.map((artist) => artist.id)
  );

  return details;
}

async function getTotals(): Promise<{
  totalArtists: number;
  totalAlbums: number;
  totalSingles: number;
}> {
  "use server";

  const [artistCount, albumTotal, singleTotal] = await Promise.all([
    supabase
      .from("spotify_artists_meta")
      .select("id", { count: "exact", head: true })
      .then(({ count }) => count),
    supabase
      .from("spotify_artists_meta")
      .select("album_total:albums_count.sum()")
      .not("albums_count", "is", null)
      .single()
      .then(({ data }) => data?.album_total),

    supabase
      .from("spotify_artists_meta")
      .select("single_total:singles_count.sum()")
      .not("singles_count", "is", null)
      .single()
      .then(({ data }) => data?.single_total),
  ]);

  return {
    totalArtists: artistCount ?? 0,
    totalAlbums: albumTotal ?? 0,
    totalSingles: singleTotal ?? 0,
  };
}

async function getDisplayDetails(): Promise<ArtistDetailsResponse> {
  "use server";

  const details = await queryArtistDetails(supabase, DISPLAY_ARTISTS);
  return details;
}

const HeroCard = ({
  icon: Icon,
  title,
  description,
}: {
  icon: React.ElementType;
  title: string;
  description: string;
}) => {
  return (
    <Card className="w-full md:w-[calc(50%-0.5rem)] p-2 min-h-[190px] bg-primary-foreground">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <div className="p-2 rounded-md bg-secondary">
            <Icon className="w-6 h-6 shrink-0 opacity-75 text-green-500" />
          </div>
          <p className="text-base font-bold">{title}</p>
        </CardTitle>
      </CardHeader>
      <CardDescription className="px-5 py-3 pb-1 text-muted-foreground">
        {description}
      </CardDescription>
    </Card>
  );
};

const HeroCards = ({
  dateRange,
  totalArtists,
  totalAlbums,
  totalSingles,
}: {
  dateRange: {
    min: string;
    max: string;
  };
  totalArtists: number;
  totalAlbums: number;
  totalSingles: number;
}) => {
  const cardData = [
    {
      icon: ClockIcon,
      title: `Since ${new Date(dateRange.min).toLocaleString("default", {
        month: "long",
        year: "numeric",
        timeZone: "UTC",
      })}`,
      description:
        "Spotify updates monthly listener data daily. This figure represents the average number of unique listeners over the past 28 days who have played an artist's music at least once.",
    },
    {
      icon: Mic2Icon,
      title: `${formatMonthlyListeners(totalArtists ?? 0)} Artists`,
      description:
        "We use Spotify's API Search endpoint with a myriad of queries to find a wide breadth of artists. An artist must have 5k+ followers to be included in our database.",
    },
    {
      icon: Disc3Icon,
      title: `${formatMonthlyListeners(totalAlbums ?? 0)} Abums`,
      description: "The total number of albums in the dataset.",
    },
    {
      icon: Music2Icon,
      title: `${formatMonthlyListeners(totalSingles ?? 0)} singles`,
      description: "The total number of singles in the dataset.",
    },
  ];

  return (
    <div className="flex flex-wrap gap-4 max-w-4xl mx-auto">
      {cardData.map((card, index) => (
        <HeroCard
          key={index}
          icon={card.icon}
          title={card.title}
          description={card.description}
        />
      ))}
    </div>
  );
};
export default async function Home() {
  const defaultArtistSample = await getDefaultArtistSample();
  const dateRange = await getDateRange();
  const defaultDetails = await getDefaultDetails();
  const { totalArtists, totalAlbums, totalSingles } = await getTotals();
  const displayDetails = await getDisplayDetails();

  return (
    <main className="px-16 sm:mt-8 mt-2 mb-10 flex flex-col gap-10">
      <div className="flex justify-center flex-col items-center">
        <div className="flex flex-col mt-2 mb-5 justify-center items-center text-center md:text-left min-h-fit">
          <h1 className="text-4xl sm:text-5xl font-bold tracking-tight">
            Spotify Artist{" "}
            <span className="color-site-primary">Popularity</span> by the
            Numbers
          </h1>
          <p
            className="text-xl text-muted-foreground max-w-3xl mt-5 text-center"
            style={{ textWrap: "balance" }}
          >
            Stan like a pro. Compare your faves. See who&apos;s hot and
            who&apos;s not. Free and open source.
          </p>
        </div>
      </div>
      <div className="flex justify-center items-center w-full">
        <div className="w-fit flex items-center gap-2 border px-4 py-3 rounded-lg border-yellow-500 bg-primary-foreground">
          <DatabaseIcon className="w-5 h-5" />
          <p className="text-md font-bold">About the Database</p>
        </div>
      </div>
      <HeroCards
        dateRange={dateRange}
        totalArtists={totalArtists}
        totalAlbums={totalAlbums}
        totalSingles={totalSingles}
      />
      <div className="flex flex-col gap-5 opacity-85 items-center">
        <DisplayCards artists={displayDetails.meta} />
      </div>
      <div className="flex justify-start gap-10 mt-32">
        <ExploreCardsParent
          defaultArtistSample={defaultArtistSample}
          defaultDetails={defaultDetails}
        />
        <ExploreChart dateRange={dateRange} />
      </div>
    </main>
  );
}
