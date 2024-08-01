"use client";

import { ArtistSample } from "@/lib/types";
import { SetStateAction, useState } from "react";
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
import { fetchArtistStreams } from "./explore-artist-parent-select";

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
  const [artists, setArtists] = useState(defaultArtistSample);
  const [loading, setLoading] = useState(false);

  const handleSearch = async (value: string) => {
    if (!value) {
      setArtists(defaultArtistSample);
      return;
    }

    setLoading(true);
    try {
      const response = await fetch(`/api/artists/search?query=${value}`);
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      const data: SetStateAction<ArtistSample[]> = await response.json();
      setArtists(data);
    } catch (err) {
      setArtists([]);
    } finally {
      setLoading(false);
    }
  };

  const handleSelect = (value: string) => {
    setValue(value);
    setOpen(false);
    fetchArtistStreams(value, selectIndex)
      .then((data) => {
        exploreDispatch?.({
          type: "ADD_ARTIST_DETAILS",
          payload: data,
        });
      })
      .catch((error) => {
        throw error;
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
            ? selectedArtists.find(
                (artist) => artist.selectIndex === selectIndex
              )?.name
            : "Select artist..."}
          <CaretSortIcon className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[200px] p-0">
        <Command shouldFilter={false}>
          <CommandInput
            placeholder="Search artist..."
            className="h-9"
            value={search}
            onValueChange={(value) => {
              setSearch(value);
              handleSearch(value);
            }}
          />
          <CommandList className="max-h-[200px] overflow-y-auto">
            <CommandEmpty>No artists found.</CommandEmpty>
            <CommandGroup>
              {artists.map((artist) => (
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
