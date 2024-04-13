export interface Playlist {
  id: string;
  name: string;
  imageSrc?: string;
  trackCount: number;
}

export interface Track {
  name: string;
  artist: string;
  imageSrc?: string;
  previewUrl?: string;
}