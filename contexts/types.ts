import { ArtistStreams } from "@/lib/types";
import { ReactNode } from "react";

export interface ContextAction {
  type: string;
  payload?: any;
}

export interface ProviderProps {
  children: ReactNode;
}

export interface ExploreState {
  artistStreams: ArtistStreams[];
  selectedArtists: {
    artistId: string;
    selectIndex: number;
    artistName: string;
  }[];
}
