import type { NavigationGuardNext, RouteLocationNormalized } from 'vue-router';
import { useSpotifyAuth } from './spotify';

export const useRouteGuard = async (
  to: RouteLocationNormalized,
  from: RouteLocationNormalized,
  next: NavigationGuardNext,
) => {
  const { isAuthenticated } = useSpotifyAuth();

  if (!to.meta.requiresAuth) return next();

  if (isAuthenticated.value) {
    next();
    return;
  }

  next('/login');
};
