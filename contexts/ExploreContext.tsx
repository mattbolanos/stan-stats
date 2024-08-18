import { createContext, useContext, useReducer, Dispatch } from "react";
import { ExploreAction, ExploreState, ProviderProps } from "./types";
import { FAKE_ARTIST_ID, getFirstAvailableIndex } from "@/lib/utils";
import { SelectedArtist } from "@/lib/types";

// default values
const defaultState: ExploreState = {
  artistStreams: [],
  selectedArtists: [
    {
      selectIndex: 0,
      id: FAKE_ARTIST_ID,
      name: "",
      image: "",
      genres: "",
      currentListens: 0,
      prevListens: 0,
      urlInstagram: "",
      urlTwitter: "",
      rank: 0,
      prevRank: 0,
      singlesCount: 0,
      albumsCount: 0,
      latestReleaseDate: "",
      latestReleaseType: "",
      latestReleaseName: "",
      latestReleaseShareUrl: "",
    },
  ],
};

// create context
const ExploreContext = createContext(defaultState);
const ExploreDispatchContext = createContext<
  Dispatch<ExploreAction> | undefined
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
  action: ExploreAction
): ExploreState {
  switch (action.type) {
    // add artist
    case "ADD_ARTIST":
      return {
        ...state,
        selectedArtists: state.selectedArtists.concat({
          ...defaultState.selectedArtists[0],
          selectIndex: getFirstAvailableIndex(state.selectedArtists),
        }),
      };

    // add artist details
    case "ADD_ARTIST_DETAILS":
      if (!action.payload?.meta) {
        return state;
      }

      // if meta is an array
      const passedIndexes = action.payload.meta.map(
        (meta: SelectedArtist) => meta.selectIndex
      );

      const idsToRemove = state.selectedArtists
        .filter((artist) => passedIndexes.includes(artist.selectIndex))
        .map((artist) => artist.id);

      return {
        ...state,
        selectedArtists: state.selectedArtists
          .filter((artist) => !passedIndexes.includes(artist.selectIndex))
          .concat(action.payload.meta)
          .sort((a, b) => a.selectIndex - b.selectIndex),
        artistStreams: state.artistStreams
          .filter((stream) => !idsToRemove.includes(stream.id))
          .concat(action.payload.streams),
      };

    // remove artist`
    case "REMOVE_ARTIST":
      const removeId = state.selectedArtists.find(
        (artist) => artist.selectIndex === action.payload
      )?.id;

      return {
        ...state,
        artistStreams: state.artistStreams.filter(
          (stream) => stream.id !== removeId
        ),
        selectedArtists: state.selectedArtists.filter(
          (artist) => artist.selectIndex !== action.payload
        ),
      };

    default:
      throw new Error(`Unknown action: ${action.type}`);
  }
}
