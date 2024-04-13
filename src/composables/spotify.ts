import { SpotifyApi, UserProfile } from '@spotify/web-api-ts-sdk';
import { readonly, ref } from 'vue';

export interface Playlist {
  id: string;
  name: string;
  imageSrc?: string;
  trackCount: number;
}

const SCOPES: string[] = [];

const SDK = SpotifyApi.withUserAuthorization(
  import.meta.env.VITE_SPOTIFY_CLIENT_ID,
  import.meta.env.VITE_REDIRECT_TARGET,
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
  console.dir(resp);
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

export const useSpotify = () => {
  return { getMyPlaylists };
};
