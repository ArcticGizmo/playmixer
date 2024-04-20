export interface Playlist {
  id: string;
  name: string;
  imageSrc?: string;
  trackCount: number;
}

export interface Track {
  id: string;
  uri: string;
  href: string;
  name: string;
  artist: string;
  imageSrc?: string;
  previewUrl?: string;
}
