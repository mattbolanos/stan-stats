import { createContext, useContext, useReducer, Dispatch } from "react";
import { ContextAction, ExploreState, ProviderProps } from "./types";
import { ArtistStream } from "@/lib/types";

// default values
const defaultState: ExploreState = {
  artistStreams: [],
  selectedArtists: [{ selectIndex: 0, artistId: "", artistName: "" }],
};

// create context
const ExploreContext = createContext(defaultState);
const ExploreDispatchContext = createContext<
  Dispatch<ContextAction> | undefined
>(undefined);

export function ExploreProvider({ children }: ProviderProps) {
  const [state, dispatch] = useReducer(playerReducer, defaultState);

  return (
    <ExploreContext.Provider value={state}>
      <ExploreDispatchContext.Provider value={dispatch}>
        {children}
      </ExploreDispatchContext.Provider>
    </ExploreContext.Provider>
  );
}

export function useExplore() {
  return useContext(ExploreContext);
}

export function useExploreDispatch() {
  return useContext(ExploreDispatchContext);
}

function playerReducer(
  state: ExploreState,
  action: ContextAction
): ExploreState {
  switch (action.type) {
    // add selected artist
    case "ADD_ARTIST":
      return {
        ...state,
        selectedArtists: state.selectedArtists
          .filter((artist) => artist.selectIndex !== action.payload.selectIndex)
          .concat(action.payload),
      };
    // add artist streams
    case "ADD_ARTIST_STREAMS":
      const payloadIds = Array.from(
        new Set(action.payload.map((item: ArtistStream) => item.id))
      );

      return {
        ...state,
        artistStreams: state.artistStreams
          .filter((item) => !payloadIds.includes(item.id))
          .concat(action.payload),
      };

    default:
      throw new Error(`Unknown action: ${action.type}`);
  }
}
