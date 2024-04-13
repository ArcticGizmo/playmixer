<template>
  <BaseFullScreenPage>
    <div class="text-h2">Welcome!</div>
    <p class="my-6">Here is what we have available at the moment</p>
    <v-card color="secondary">
      <v-card-title>Playlist Shrinker</v-card-title>
      <v-card-text>Lets try and cut down those massive playlists shall we!</v-card-text>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn class="float-right"> Start<v-icon>mdi-arrow-right</v-icon> </v-btn>
      </v-card-actions>
    </v-card>
    <v-btn class="mt-4" variant="tonal" @click="onLogout()">Logout</v-btn>
  </BaseFullScreenPage>
</template>

<script setup lang="ts">
import { useSpotifyAuth } from '@/composables/spotify';
import BaseFullScreenPage from './BaseFullScreenPage.vue';
import { useRouter } from 'vue-router';

const router = useRouter();
const { logout } = useSpotifyAuth();

const onLogout = () => {
  logout();
  router.push({ name: 'login' });
};
</script>

<style scoped></style>
