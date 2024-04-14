<template>Loading ...</template>

<script setup lang="ts">
import { useSpotifyAuth } from '@/composables/spotify';
import { onMounted } from 'vue';
import { useRouter } from 'vue-router';

const { handleRedirect } = useSpotifyAuth();

const router = useRouter();

onMounted(() => {
  const loc = window.location.href;
  if (loc.includes('code=')) {
    handleRedirect()
      .then(() => {
        console.log('[spotify] callback handled');
        router.replace({ name: 'home' });
      })
      .catch(error => {
        console.error('[spotify] error while handling callback', error);
        router.replace('/auth-error');
      });
  } else if (loc.includes('error=')) {
    // Likely cancelled it
    if (loc.includes('error=access_denied')) {
      router.replace('/login');
    } else {
      console.error('[spotify] error during callback', loc);
      router.replace('/auth-error');
    }
  } else {
    console.log('[spotify] nothing to handle, going back to login');
    router.replace({ name: 'login' });
  }
});
</script>
