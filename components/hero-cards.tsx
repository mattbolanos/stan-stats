import React from "react";
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { formatMonthlyListeners } from "@/lib/utils";
import { HashIcon, Mic2Icon, ClockIcon } from "lucide-react";

const HeroCard = ({
  icon: Icon,
  title,
  description,
}: {
  icon: React.ElementType;
  title: string;
  description: string | React.ReactNode;
}) => {
  return (
    <Card className="w-full lg:w-[calc(33%-0.5rem)] p-0.5 min-h-[145px] bg-primary-foreground">
      <CardHeader>
        <CardTitle className="flex items-center gap-2.5">
          <div className="p-2 rounded-md bg-secondary">
            <Icon className="w-6 h-6 shrink-0 opacity-75 text-site" />
          </div>
          <p className="text-base font-bold">{title}</p>
        </CardTitle>
      </CardHeader>
      <CardDescription className="p-5 text-muted-foreground tracking-wide">
        {description}
      </CardDescription>
    </Card>
  );
};

export const HeroCards = ({
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
      icon: Mic2Icon,
      title: `${totalArtists.toLocaleString()} Artists`,
      description: (
        <>
          {`Tracking every artist with at least 5000 followers on Spotify. That's ${formatMonthlyListeners(
            totalAlbums
          )} albums and
      ${formatMonthlyListeners(totalSingles)} singles.`}
        </>
      ),
    },
    {
      icon: HashIcon,
      title: "Full Artist Ranks",
      description:
        "A rank based on total monthly listeners is assigned to every single artist on our site. Spotify only provides ranks for top artists.",
    },
    {
      icon: ClockIcon,
      title: `Since ${new Date(dateRange.min).toLocaleString("default", {
        month: "long",
        year: "numeric",
        timeZone: "UTC",
      })}`,
      description: `Spotify updates their monthly listener figures daily. These numbers have been collected daily since ${new Date(
        dateRange.min
      ).toLocaleString("default", {
        dateStyle: "long",
      })}.`,
    },
  ];

  return (
    <div className="flex flex-wrap gap-4 max-w-6xl mx-auto">
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
