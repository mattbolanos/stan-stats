import { ReactNode } from "react";

export interface ContextAction {
  type: string;
  payload?: any;
}

export interface ProviderProps {
  children: ReactNode;
}

export interface ExploreState {
  artistStreams: {
    id: string;
    monthly_listeners: number;
    updated_at: string;
  }[];
}
