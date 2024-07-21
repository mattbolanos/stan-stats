import { createContext, useContext, useReducer, Dispatch } from "react";
import { ContextAction, ExploreState, ProviderProps } from "./types";

// default values
const defaultState: ExploreState = {
  artistStreams: [],
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
    case "SET_ARTIST_STREAMS":
      return {
        ...state,
        artistStreams: action.payload,
      };

    default:
      throw new Error(`Unknown action: ${action.type}`);
  }
}
