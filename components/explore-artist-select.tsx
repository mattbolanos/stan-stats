"use client";

import { ArtistSample } from "@/lib/types";
import {
  SetStateAction,
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";
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
import {
  CaretSortIcon,
  Cross2Icon,
  MagnifyingGlassIcon,
} from "@radix-ui/react-icons";
import { useExploreDispatch, useExplore } from "@/contexts/ExploreContext";
import { Spinner } from "./ui/spinner";
import { DEFAULT_ARTIST_SAMPLE_SIZE, fetchArtistDetails } from "@/lib/utils";
import { useDebouncedCallback } from "use-debounce";

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
  const [listSize, setListSize] = useState<number>(DEFAULT_ARTIST_SAMPLE_SIZE);
  const [hasMore, setHasMore] = useState(true);
  const listRef = useRef<HTMLDivElement | null>(null);
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

  const handleSearch = useCallback(
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
        const data: SetStateAction<ArtistSample[]> = await response.json();
        setArtists(data);
      } catch (err) {
        setArtists([]);
      } finally {
        setLoading(false);
      }
    },
    [defaultArtistSample]
  );

  useEffect(() => {
    if (search) {
      setLoading(true);
    }
    debouncedSearch(search);
  }, [search, debouncedSearch]);

  const handleSelect = (value: string) => {
    setValue(value);
    setOpen(false);
    fetchArtistDetails(value, selectIndex)
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

  const validArtistName = selectedArtists.find(
    (artist) => artist.selectIndex === selectIndex
  )?.name;

  const validArtists = selectedArtists.filter((artist) => artist.id);

  const canDelete =
    (validArtists.length === 1 &&
      validArtists[0].selectIndex === selectIndex) ||
    selectedArtists.length === 1
      ? false
      : true;

  return (
    <Popover open={open} onOpenChange={handleOnOpenChange}>
      <PopoverTrigger asChild>
        <Button
          variant="ghost"
          role="combobox"
          aria-expanded={open}
          className="justify-between"
          size="sm"
        >
          <MagnifyingGlassIcon className="w-6 h-6" />
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
