// Composables
import { type RouteRecordRaw, createRouter, createWebHistory } from 'vue-router';
import NotFoundPage from '@/pages/NotFoundPage.vue';
import TestPage from '@/pages/TestPage.vue';
import HomePage from '@/pages/HomePage.vue';

export const routes: RouteRecordRaw[] = [
  {
    path: '',
    redirect: '/',
  },
  {
    path: '/home',
    name: 'home',
    component: HomePage,
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

export default router;
