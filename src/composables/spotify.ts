import { Playlist, Track } from '@/types/spotify.types';
import { chunkUneven } from '@/util/enumerable';
import { RecommendationsRequest, SpotifyApi, UserProfile } from '@spotify/web-api-ts-sdk';
import { readonly, ref } from 'vue';
import { useToast } from 'vue-toast-notification';

const toast = useToast();

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
  }
};

const checkSession = async () => {
  const token = await SDK.getAccessToken();
  if (token) {
    try {
      userProfile.value = await SDK.currentUser.profile();
      isAuthenticated.value = true;
    } catch (error: any) {
      const msg: string = error.message || 'unknown error';
      console.error('Failed to fetch profile', msg);

      if (msg.includes('User not registered in the Developer Dashboard')) {
        toast.error('You need to be invited before using this application', { duration: 5_000 });
        return;
      }
    }
  }
};

const logout = () => {
  SDK.logOut();
  userProfile.value = undefined;
  isAuthenticated.value = false;
  console.log('[spotify] logged out');
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

  const FIELDS = 'items.track(id,uri,name,external_urls,artists,preview_url,album.images)';
  const LIMIT = 50;
  const MAX_LOOPS = 20;

  // We expect to break out early, but this sets a max limit just in case
  for (let i = 0; i < MAX_LOOPS; i++) {
    const resp = await SDK.playlists.getPlaylistItems(id, undefined, FIELDS, LIMIT, i * LIMIT);
    const tracks: Track[] = [];
    for (const r of resp.items) {
      const imageSrc = r.track.album.images[0]?.url || undefined;
      tracks.push({
        id: r.track.id,
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

const getRecommendations = async (trackIds: string[], limit: number): Promise<Track[]> => {
  if (limit < 1) limit = 1;
  if (limit > 100) limit = 100;
  
  const payload: RecommendationsRequest = {
    limit: 5,
    seed_tracks: trackIds.slice(0, 5),
  };
  const resp = await SDK.recommendations.get(payload);
  return resp.tracks.map(track => {
    const imageSrc = track.album.images[0]?.url || undefined;
    return {
      id: track.id,
      uri: track.uri,
      href: track.external_urls.spotify,
      name: track.name,
      artist: track.artists[0]?.name ?? 'unknown',
      imageSrc,
      previewUrl: track.preview_url || undefined,
    };
  });
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
  return { getMyPlaylists, getPlaylist, getPlaylistTracks, createPlaylist, getRecommendations };
};
