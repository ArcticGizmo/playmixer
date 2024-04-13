<template>
  <BaseFullScreenPage class="text-center">
    <div class="text-h2">Welcome!</div>
    <div v-if="user" class="user">
      <div>User: {{ user.sub }}</div>
      <div>Spotify Id: {{ spotifyUserId }}</div>
      <v-btn @click="logout()">Logout</v-btn>
    </div>
    <div v-else class="login">
      <v-btn @click="login()">Login</v-btn>
    </div>
  </BaseFullScreenPage>
</template>

<script setup lang="ts">
import BaseFullScreenPage from './BaseFullScreenPage.vue';
import { useAuth } from '@/composables/auth';

const { user, spotifyUserId, login, logout } = useAuth();
</script>

<style scoped></style>
