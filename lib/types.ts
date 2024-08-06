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
}

export interface ArtistDetailsResponse {
  streams: ArtistStream[];
  meta: SelectedArtist;
}
