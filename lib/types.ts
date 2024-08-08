export interface ArtistSample {
  id: string;
  name: string;
}

export interface ArtistStream {
  id: string;
  updated_at: string;
  monthly_listeners: number;
}

export interface SelectedArtist {
  id: string;
  name: string;
  selectIndex: number;
  image: string;
  genres: string;
  maxListens: number;
  minListens: number;
  currentListens: number;
}

export interface ArtistDetailsResponse {
  streams: ArtistStream[];
  meta: SelectedArtist | SelectedArtist[];
}
