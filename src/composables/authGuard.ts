import type { NavigationGuardNext, RouteLocationNormalized } from 'vue-router';
import { useSpotifyAuth } from './spotify';
import { AudioManager } from './vAudio';

export const useRouteGuard = async (
  to: RouteLocationNormalized,
  from: RouteLocationNormalized,
  next: NavigationGuardNext,
) => {
  AudioManager.stop();
  const { isAuthenticated, checkSession } = useSpotifyAuth();

  if (!to.meta.requiresAuth) return next();

  await checkSession();
  if (isAuthenticated.value) {
    next();
    return;
  }

  next('/login');
};
