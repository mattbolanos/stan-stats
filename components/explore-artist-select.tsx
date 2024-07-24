"use client";

import { ArtistSample } from "@/lib/types";
import { useMemo, useState } from "react";
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
import { useExploreDispatch, useExplore } from "@/contexts/ExploreContext";
import { supabase } from "@/lib/supabase";

async function searchArtists(query: string): Promise<ArtistSample[]> {
  const { data, error } = await supabase
    .from("spotify-artists-meta")
    .select("id, name")
    .textSearch("name", query)
    .range(0, 20);

  if (error) {
    throw error;
  }

  return data;
}

export default function ExploreArtistSelect({
  defaultArtistSample = [],
  selectIndex,
}: {
  defaultArtistSample: ArtistSample[];
  selectIndex: number;
}) {
  const { selectedArtists } = useExplore();
  const [value, setValue] = useState("");
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");
  const exploreDispatch = useExploreDispatch();

  const filteredArtists = useMemo(() => {
    if (!search) {
      return defaultArtistSample;
    }

    return searchArtists(search);
  }, [search, defaultArtistSample]);

  const handleSelect = (value: string) => {
    setValue(value);
    setOpen(false);
    exploreDispatch?.({
      type: "ADD_ARTIST",
      payload: {
        artistId: value,
        selectIndex: selectIndex,
      },
    });
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-[200px] justify-between"
        >
          {selectedArtists.find((artist) => artist.selectIndex === selectIndex)
            ? defaultArtistSample.find((artist) => artist.id === value)?.name
            : "Select artist..."}
          <CaretSortIcon className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[200px] p-0">
        <Command>
          <CommandInput
            placeholder="Search artist..."
            className="h-9"
            value={search}
            onValueChange={setSearch}
          />
          <CommandList className="max-h-[200px] overflow-y-auto">
            <CommandEmpty>No artists found.</CommandEmpty>
            <CommandGroup>
              {filteredArtists.map((artist) => (
                <CommandItem
                  key={artist.id}
                  keywords={[artist.name]}
                  onSelect={() => handleSelect(artist.id)}
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
