export interface ArtistSample {
  image: string | null;
  id: string;
  name: string;
}

export interface ArtistStreams {
  id: string;
  updated_at: string;
  monthly_listeners: number;
}
