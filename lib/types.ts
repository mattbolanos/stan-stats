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
  show: boolean;
  id: string;
  name: string;
  selectIndex: number;
  image: string;
  genres: string;
  currentListens: number;
  prevListens: number;
  rank: number;
  prevRank: number;
  singlesCount: number;
  albumsCount: number;
  urlTwitter: string;
  urlInstagram: string;
  latestReleaseDate: string;
  latestReleaseType: string;
  latestReleaseName: string;
  latestReleaseShareUrl: string;
}

export interface ArtistDetailsResponse {
  streams: ArtistStream[];
  meta: SelectedArtist[];
}
