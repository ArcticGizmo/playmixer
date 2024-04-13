import { createAuth0 } from '@auth0/auth0-vue';
import { computed } from 'vue';

const scopes = ['openid', 'profile', 'email', 'offline_access'];

export const Auth0Client = createAuth0({
  domain: import.meta.env['VITE_AUTH0__DOMAIN'],
  clientId: import.meta.env['VITE_AUTH0__CLIENT_ID'],
  authorizationParams: {
    redirect_uri: window.location.origin,
    scope: scopes.join(' '),
    prompt: 'select_account',
  },
});

export const useAuth = () => {
  const spotifyUserId = computed(() => {
    const userId = Auth0Client.user.value?.sub;
    if (!userId) {
      return null;
    }

    return userId.replace('oauth2|spotify|spotify:user:', '');
  });

  return {
    spotifyUserId,
    login: Auth0Client.loginWithRedirect,
    logout: Auth0Client.logout,
    isAuthenticated: Auth0Client.isAuthenticated,
    isLoading: Auth0Client.isLoading,
    user: Auth0Client.user,
    getAccessToken: Auth0Client.getAccessTokenSilently,
  };
};
