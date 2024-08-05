import { createContext, useContext, useReducer, Dispatch } from "react";
import { ContextAction, ExploreState, ProviderProps } from "./types";
import { getFirstAvailableIndex } from "@/lib/utils";

// default values
const defaultState: ExploreState = {
  artistStreams: [],
  selectedArtists: [{ selectIndex: 0, id: "FAKE", name: "" }],
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
    // add artist
    case "ADD_ARTIST":
      return {
        ...state,
        selectedArtists: state.selectedArtists.concat({
          id: "",
          name: "",
          selectIndex: getFirstAvailableIndex(state.selectedArtists),
        }),
      };

    // add artist details
    case "ADD_ARTIST_DETAILS":
      const selectedArtistIdToRemove = state.selectedArtists.find(
        (artist) => artist.selectIndex === action.payload.meta.selectIndex
      )?.id;

      return {
        ...state,
        artistStreams: state.artistStreams
          .filter((stream) => stream.id !== selectedArtistIdToRemove)
          .concat(action.payload.streams),
        selectedArtists: state.selectedArtists
          .filter(
            (artist) => artist.selectIndex !== action.payload.meta.selectIndex
          )
          .concat(action.payload.meta)
          // sort by if id is not null
          // then by selectIndex
          .sort((a, b) => {
            if (a.id && !b.id) {
              return -1;
            }
            if (!a.id && b.id) {
              return 1;
            }
            return a.selectIndex - b.selectIndex;
          }),
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
