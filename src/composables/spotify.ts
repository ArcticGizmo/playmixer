import { Playlist, Track } from '@/types/spotify.types';
import { chunkUneven } from '@/util/enumerable';
import { SpotifyApi, UserProfile } from '@spotify/web-api-ts-sdk';
import { readonly, ref } from 'vue';

const SCOPES: string[] = ['playlist-modify-public'];

const SDK = SpotifyApi.withUserAuthorization(
  import.meta.env.VITE_SPOTIFY_CLIENT_ID,
  import.meta.env.VITE_SPOTIFY_REDIRECT_TARGET,
  SCOPES,
);

const userProfile = ref<UserProfile>();
const isAuthenticated = ref(false);

const login = async () => {
  if (isAuthenticated.value) {
    return;
  }

  // You will be redirected
  const resp = await SDK.authenticate();
  if (!resp?.authenticated) {
    console.log('[spotify] not authenticated, redirecting...');
    return;
  }
};

const checkSession = async () => {
  const token = await SDK.getAccessToken();
  if (token) {
    isAuthenticated.value = true;
    userProfile.value = await SDK.currentUser.profile();
  }
};

const logout = () => {
  SDK.logOut();
  userProfile.value = undefined;
  isAuthenticated.value = false;
};

const handleRedirect = async () => {
  // For some reason we need another API call to handle the returned ?code=xxx
  // otherwise a token will not be exchanged
  const resp = await SDK.authenticate();

  if (!resp.authenticated) {
    window.location.replace(window.origin + '/auth-error');
    return;
  }

  await checkSession();
};

export const useSpotifyAuth = () => {
  return {
    login,
    checkSession,
    logout,
    userProfile: readonly(userProfile),
    isAuthenticated: readonly(isAuthenticated),
    handleRedirect,
  };
};

const getMyPlaylists = async (): Promise<Playlist[]> => {
  const resp = await SDK.currentUser.playlists.playlists(50);
  return resp.items.map(p => {
    return {
      id: p.id,
      name: p.name,
      imageSrc: p.images[0]?.url,
      trackCount: p.tracks?.total || 0,
    };
  });
};

const getPlaylist = async (id: string): Promise<Playlist> => {
  const resp = await SDK.playlists.getPlaylist(id);
  return {
    id: resp.id,
    name: resp.name,
    imageSrc: resp.images[0]?.url,
    trackCount: resp.tracks?.total || 0,
  };
};

const getPlaylistTracks = async (id: string): Promise<Track[]> => {
  const allTracks: Track[] = [];

  const FIELDS = 'items.track(uri,name,external_urls,artists,preview_url,album.images)';
  const LIMIT = 50;
  const MAX_LOOPS = 20;

  // We expect to break out early, but this sets a max limit just in case
  for (let i = 0; i < MAX_LOOPS; i++) {
    const resp = await SDK.playlists.getPlaylistItems(id, undefined, FIELDS, LIMIT, i * LIMIT);
    const tracks: Track[] = [];
    for (const r of resp.items) {
      const imageSrc = r.track.album.images[0]?.url || undefined;
      tracks.push({
        uri: r.track.uri,
        href: r.track.external_urls.spotify,
        name: r.track.name,
        artist: r.track.artists[0]?.name ?? 'unknown',
        imageSrc,
        previewUrl: r.track.preview_url || undefined,
      });
    }

    allTracks.push(...tracks);

    if (!tracks.length) {
      break;
    }
  }

  return allTracks;
};

const createPlaylist = async (name: string, uris: string[]) => {
  const uriChunks = chunkUneven(uris, 100);

  const userId = userProfile.value?.id;
  if (!userId) {
    throw 'Cannot find your user id';
  }

  const request = {
    name,
    description: 'Created by playmixer',
    public: true,
  };

  const resp = await SDK.playlists.createPlaylist(userId, request);

  for (const chunk of uriChunks) {
    await SDK.playlists.addItemsToPlaylist(resp.id, chunk);
  }
};

export const useSpotify = () => {
  return { getMyPlaylists, getPlaylist, getPlaylistTracks, createPlaylist };
};
