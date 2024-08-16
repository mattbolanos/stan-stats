"use client";

import { SelectedArtist } from "@/lib/types";
import { useRef, useEffect } from "react";
import { ExploreCard } from "./explore-card";

export const DisplayCards = ({ artists }: { artists: SelectedArtist[] }) => {
  const bannerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const banner = bannerRef.current;
    let scrollPosition = 0;

    const scroll = () => {
      scrollPosition += 0.5; // Adjust this value to change scroll speed
      if (scrollPosition >= banner.scrollWidth / 2) {
        scrollPosition = 0;
      }
      banner.scrollLeft = scrollPosition;
      requestAnimationFrame(scroll);
    };

    const animation = requestAnimationFrame(scroll);

    return () => cancelAnimationFrame(animation);
  }, []);

  return (
    <div
      ref={bannerRef}
      className="overflow-x-hidden whitespace-nowrap w-full max-w-2xl
      display-cards-container opacity-75"
    >
      <div className="inline-block">
        {artists.map((artist, index) => (
          <div key={index} className="inline-block mx-3">
            <ExploreCard artist={artist} displayArtist={false} />
          </div>
        ))}
      </div>
    </div>
  );
};
