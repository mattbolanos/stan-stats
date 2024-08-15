import { ArtistStream, SelectedArtist } from "@/lib/types";
import { ReactNode } from "react";

export interface ProviderProps {
  children: ReactNode;
}

export interface ExploreState {
  artistStreams: ArtistStream[];
  selectedArtists: SelectedArtist[];
}

export type ExploreAction =
  | { type: "ADD_ARTIST" }
  | { type: "REMOVE_ARTIST"; payload: number }
  | { type: "ADD_ARTIST_DETAILS"; payload: any }
  | { type: "UPDATE_ARTIST_STREAMS"; payload: ArtistStream[] };
