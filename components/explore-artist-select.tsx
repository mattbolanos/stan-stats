"use client";

import { ArtistSample } from "@/lib/types";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { CaretSortIcon } from "@radix-ui/react-icons";
import commandScore from "command-score";

export default function ExploreArtistSelect({
  artistSample = [],
}: {
  artistSample?: ArtistSample[];
}) {
  const [value, setValue] = useState("");
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [limit, setLimit] = useState(20);
  const observerTarget = useRef(null);

  const filteredArtists = useMemo(() => {
    if (!search) {
      return artistSample.slice(0, limit);
    }

    return artistSample
      .map((artist) => ({
        ...artist,
        score: commandScore(artist.name, search),
      }))
      .filter((artist) => artist.score > 0)
      .sort((a, b) => b.score - a.score)
      .slice(0, limit);
  }, [artistSample, search, limit]);

  const loadMore = useCallback(() => {
    setLimit((prevLimit) => prevLimit + 20);
  }, []);

  const handleObserver = useCallback(
    (entries: IntersectionObserverEntry[]) => {
      const target = entries[0];
      if (
        target.isIntersecting &&
        filteredArtists.length < artistSample.length
      ) {
        loadMore();
      }
    },
    [loadMore, filteredArtists.length, artistSample.length]
  );

  useEffect(() => {
    const option = {
      root: null,
      rootMargin: "20px",
      threshold: 1.0,
    };
    const observer = new IntersectionObserver(handleObserver, option);
    if (observerTarget.current) {
      observer.observe(observerTarget.current);
    }
    return () => observer.disconnect();
  }, [handleObserver]);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-[200px] justify-between"
        >
          {value
            ? artistSample.find((artist) => artist.id === value)?.name
            : "Select artist..."}
          <CaretSortIcon className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[200px] p-0">
        <Command>
          <CommandList className="max-h-[200px] overflow-y-auto">
            <CommandInput
              placeholder="Search artist..."
              className="h-9"
              onValueChange={setSearch}
            />
            <CommandEmpty>No artists found.</CommandEmpty>
            <CommandGroup>
              {filteredArtists.map((artist, index) => (
                <CommandItem
                  key={artist.id}
                  value={artist.name}
                  onSelect={(currentValue) => {
                    setValue(currentValue === value ? "" : artist.id);
                    setOpen(false);
                  }}
                  ref={
                    index === filteredArtists.length - 1 ? observerTarget : null
                  }
                >
                  {artist.name}
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
