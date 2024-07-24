"use client";

import { ArtistSample } from "@/lib/types";
import { useState } from "react";
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

export default function ExploreArtistSelect({
  artistSample = [],
  selectIndex,
}: {
  artistSample: ArtistSample[];
  selectIndex: number;
}) {
  const { selectedArtists } = useExplore();
  const [value, setValue] = useState("");
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");
  const exploreDispatch = useExploreDispatch();

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
            ? artistSample.find((artist) => artist.id === value)?.name
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
              {artistSample.map((artist) => (
                <CommandItem
                  key={artist.id}
                  value={artist.name}
                  onSelect={handleSelect}
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
