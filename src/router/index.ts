// Composables
import { type RouteRecordRaw, createRouter, createWebHistory } from 'vue-router';
import { authGuard } from '@auth0/auth0-vue';
import NotFoundPage from '@/pages/NotFoundPage.vue';
import TestPage from '@/pages/TestPage.vue';
import HomePage from '@/pages/HomePage.vue';

export const routes: RouteRecordRaw[] = [
  {
    path: '',
    name: 'home',
    component: HomePage,
    meta: { noAuth: true },
  },
  {
    path: '/:catchAll(.*)',
    name: 'not found',
    component: NotFoundPage,
    meta: { noAuth: true },
  },
];

if (import.meta.env.DEV) {
  routes.push({
    path: '/test',
    name: 'test',
    component: TestPage,
  });
}

routes.forEach(r => {
  if (r.component && !r.meta?.noAuth) {
    r.beforeEnter = authGuard;
  }
});

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
});

export default router;
