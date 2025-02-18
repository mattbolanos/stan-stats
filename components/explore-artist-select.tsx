"use client";

import { ArtistSample } from "@/lib/types";
import * as React from "react";
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
import { useExploreDispatch, useExplore } from "@/contexts/ExploreContext";
import { Spinner } from "./ui/spinner";
import { DEFAULT_ARTIST_SAMPLE_SIZE, FAKE_ARTIST_ID } from "@/lib/utils";
import { useDebouncedCallback } from "use-debounce";
import { useMediaQuery } from "@/hooks/use-media-query";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { getArtistDetails } from "@/app/actions";

export default function ExploreArtistSelect({
  defaultArtistSample = [],
  selectIndex,
}: {
  defaultArtistSample: ArtistSample[];
  selectIndex: number;
}) {
  const isMobile = useMediaQuery("(max-width: 640px)");

  const { selectedArtists } = useExplore();
  const [open, setOpen] = React.useState(
    selectedArtists.find((a) => a.selectIndex === selectIndex)?.id ===
      FAKE_ARTIST_ID
  );
  const [value, setValue] = React.useState("");
  const [search, setSearch] = React.useState("");
  const exploreDispatch = useExploreDispatch();
  const [artists, setArtists] = React.useState(defaultArtistSample);
  const [loading, setLoading] = React.useState(false);
  const [listSize, setListSize] = React.useState<number>(
    DEFAULT_ARTIST_SAMPLE_SIZE
  );
  const [hasMore, setHasMore] = React.useState(true);
  const listRef = React.useRef<HTMLDivElement | null>(null);
  const debouncedSearch = useDebouncedCallback((value: string) => {
    if (value) {
      setListSize(DEFAULT_ARTIST_SAMPLE_SIZE);
      setHasMore(true);
      scrollToTop();
      handleSearch(value);
    } else {
      setArtists(defaultArtistSample);
    }
  }, 200);

  const scrollToTop = () => {
    if (listRef.current) {
      listRef.current.scrollTo({
        top: 0,
      });
    }
  };

  const handleScroll = React.useCallback(async () => {
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
            return [];
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

  const handleSearch = React.useCallback(
    async (value: string) => {
      if (!value) {
        setArtists(defaultArtistSample);
        setLoading(false);
        return;
      }
      try {
        const response = await fetch(`/api/artists/search?query=${value}`);
        if (!response.ok) {
          return [];
        }
        const data: React.SetStateAction<ArtistSample[]> =
          await response.json();
        setArtists(data);
      } catch (err) {
        setArtists([]);
      } finally {
        setLoading(false);
      }
    },
    [defaultArtistSample]
  );

  React.useEffect(() => {
    if (search) {
      setLoading(true);
    }
    debouncedSearch(search);
  }, [search, debouncedSearch]);

  const handleSelect = async (value: string) => {
    setOpen(false);
    setValue(value);
    const artistDetails = await getArtistDetails([value], selectIndex);
    exploreDispatch?.({
      type: "ADD_ARTIST_DETAILS",
      payload: artistDetails,
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

  const currentArtist = selectedArtists.find(
    (artist) => artist.selectIndex === selectIndex
  )?.id;

  if (isMobile) {
    return (
      <div className="flex items-center gap-2">
        {value && currentArtist !== value && <Spinner size={5} />}
        <Dialog open={open} onOpenChange={handleOnOpenChange}>
          <DialogTrigger asChild>
            <Button role="combobox" aria-expanded={open} size="md">
              Change
            </Button>
          </DialogTrigger>
          <DialogContent className="w-5/6 rounded-lg">
            <Command shouldFilter={false}>
              <CommandInput
                placeholder="Search artist..."
                className="h-9"
                value={search}
                onValueChange={(value) => {
                  setSearch(value);
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
          </DialogContent>
        </Dialog>
      </div>
    );
  }
  return (
    <div className="flex items-center gap-2">
      {value && currentArtist !== value && <Spinner size={5} />}
      <Popover open={open} onOpenChange={handleOnOpenChange}>
        <PopoverTrigger asChild>
          <Button role="combobox" aria-expanded={open} size="md">
            Change
          </Button>
        </PopoverTrigger>
        <PopoverContent className="sm:w-[200px] w-full p-0">
          <Command shouldFilter={false}>
            <CommandInput
              placeholder="Search artist..."
              className="h-9"
              value={search}
              onValueChange={(value) => {
                setSearch(value);
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
    </div>
  );
}
