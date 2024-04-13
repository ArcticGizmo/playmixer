// Composables
import { type RouteRecordRaw, createRouter, createWebHistory } from 'vue-router';
import NotFoundPage from '@/pages/NotFoundPage.vue';
import TestPage from '@/pages/TestPage.vue';
import HomePage from '@/pages/HomePage.vue';
import LoginPage from '@/pages/LoginPage.vue';
import AuthErrorPage from '@/pages/AuthErrorPage.vue';
import SpotifyCallbackPage from '@/pages/SpotifyCallbackPage.vue';
import { useRouteGuard } from '@/composables/authGuard';

export const routes: RouteRecordRaw[] = [
  {
    path: '/',
    redirect: '/login',
  },
  {
    path: '/home',
    name: 'home',
    component: HomePage,
    meta: { requiresAuth: true },
  },
  {
    path: '/login',
    name: 'login',
    component: LoginPage,
  },
  {
    path: '/auth-error',
    component: AuthErrorPage,
  },
  {
    path: '/spotify/callback',
    component: SpotifyCallbackPage,
  },
  {
    path: '/:catchAll(.*)',
    name: 'not found',
    component: NotFoundPage,
  },
];

if (import.meta.env.DEV) {
  routes.push({
    path: '/test',
    name: 'test',
    component: TestPage,
  });
}

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
});

router.beforeEach(useRouteGuard);

export default router;
