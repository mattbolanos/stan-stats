"use client";

import { ArtistSample } from "@/lib/types";
import { SetStateAction, useCallback, useRef, useState } from "react";
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
import { CaretSortIcon, Cross2Icon } from "@radix-ui/react-icons";
import { useExploreDispatch, useExplore } from "@/contexts/ExploreContext";
import { fetchArtistStreams } from "./explore-artist-parent-select";
import { Spinner } from "./ui/spinner";
import { DEFAULT_ARTIST_SAMPLE_SIZE } from "@/lib/utils";

export default function ExploreArtistSelect({
  defaultArtistSample = [],
  selectIndex,
}: {
  defaultArtistSample: ArtistSample[];
  selectIndex: number;
}) {
  const { selectedArtists } = useExplore();
  const [value, setValue] = useState(selectedArtists[selectIndex]?.id);
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");
  const exploreDispatch = useExploreDispatch();
  const [artists, setArtists] = useState(defaultArtistSample);
  const [loading, setLoading] = useState(false);
  const [listSize, setListSize] = useState<number>(DEFAULT_ARTIST_SAMPLE_SIZE);
  const [hasMore, setHasMore] = useState(true);
  const listRef = useRef<HTMLDivElement | null>(null);

  const scrollToTop = () => {
    if (listRef.current) {
      listRef.current.scrollTo({
        top: 0,
      });
    }
  };

  const handleScroll = useCallback(async () => {
    const list = listRef.current;
    if (list) {
      const { scrollTop, scrollHeight, clientHeight } = list;

      if (
        (scrollHeight - (scrollTop + clientHeight)) / scrollHeight < 0.1 &&
        !loading &&
        hasMore
      ) {
        try {
          setLoading(true);
          const nextSize = listSize + DEFAULT_ARTIST_SAMPLE_SIZE;
          const response = await fetch(
            `/api/artists/search?query=${search}&size=${nextSize}`
          );
          if (!response.ok) {
            throw new Error("Network response was not ok");
          }
          const data: ArtistSample[] = await response.json();

          if (data.length === artists.length) {
            // We've reached the end of the results
            setHasMore(false);
          } else {
            setArtists(data);
            setListSize(nextSize);
          }
        } catch (err) {
          setArtists([]);
          setLoading(false);
        } finally {
          setLoading(false);
        }
      }
    }
  }, [listSize, search, loading, hasMore, artists.length]);

  const handleSearch = async (value: string) => {
    if (!value) {
      setArtists(defaultArtistSample);
      return;
    }
    setLoading(true);
    setListSize(DEFAULT_ARTIST_SAMPLE_SIZE);
    setHasMore(true);
    scrollToTop();
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

  const handleOnOpenChange = (open: boolean) => {
    setOpen(open);
    // if closing, reset limit
    if (!open) {
      setListSize(DEFAULT_ARTIST_SAMPLE_SIZE);
      setArtists(artists.slice(0, DEFAULT_ARTIST_SAMPLE_SIZE));
      setHasMore(true);
    }
  };

  return (
    <Popover open={open} onOpenChange={handleOnOpenChange}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-[200px] justify-between"
        >
          <div
            className="h-3 w-3 rounded-[2px] shrink-0"
            style={{
              backgroundColor: `hsl(var(--chart-${selectIndex + 1}))`,
            }}
          />
          <div className="flex justify-between w-full ml-2">
            <p className="max-w-[125px] truncate">
              {selectedArtists.find(
                (artist) => artist.selectIndex === selectIndex
              )
                ? selectedArtists.find(
                    (artist) => artist.selectIndex === selectIndex
                  )?.name
                : "Select artist..."}
            </p>
            <div className="flex items-center space-x-1">
              {value &&
              !selectedArtists.find((artist) => artist.id === value) ? (
                <Spinner />
              ) : (
                selectedArtists.filter((artist) => artist.id).length > 1 && (
                  <Cross2Icon
                    stroke="red"
                    onClick={() => {
                      exploreDispatch?.({
                        type: "REMOVE_ARTIST",
                        payload: selectIndex,
                      });
                    }}
                  />
                )
              )}
              <CaretSortIcon className="h-4 w-4 shrink-0 opacity-50" />
            </div>
          </div>
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
            endContent={loading && <Spinner />}
          />
          <CommandList
            className="max-h-[200px] overflow-y-auto"
            ref={listRef}
            onScroll={handleScroll}
          >
            <CommandEmpty>No artists found.</CommandEmpty>
            <CommandGroup>
              {artists.map((artist) => (
                <CommandItem
                  key={artist.id}
                  keywords={[artist.name]}
                  onSelect={() => handleSelect(artist.id)}
                  disabled={
                    selectedArtists.find((a) => a.id === artist.id) !==
                    undefined
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
