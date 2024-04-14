<template>
  <BaseFullScreenPage class="bg text-center">
    <v-card class="login-island pa-10">
      <h1>Welcome!</h1>
      <div class="content">
        <p>I hope this makes it easier to crop your huge playlists into much smaller pieces!</p>
        <p>
          This does mean upon logging in, you will be requested to consent to this application
          <strong>creating playlists on your behalf</strong>.
        </p>
        <p>
          Playlists will only be created if you choose to do so, and this consent can be revoked at
          any time from your
          <a aria-label="View spotify account" href="https://www.spotify.com/account/apps/">
            spotify account
          </a>
        </p>
        <p>
          If you do have a good time with the application, please let me know
          <a href="mailto:jon.howell314@gmail.com">via email</a>!
        </p>
      </div>

      <v-btn variant="elevated" color="secondary" size="large" @click="login()">
        <v-img class="spotify-logo mr-4" src="/spotify.svg" height="2rem" width="2rem" />
        Login with spotify
      </v-btn>
    </v-card>
  </BaseFullScreenPage>
</template>

<script setup lang="ts">
import BaseFullScreenPage from './BaseFullScreenPage.vue';
import { useSpotifyAuth } from '@/composables/spotify';
import { watch } from 'vue';
import { onMounted } from 'vue';
import { useRouter } from 'vue-router';

const router = useRouter();
const { login, isAuthenticated, checkSession } = useSpotifyAuth();

watch(isAuthenticated, isAuthed => {
  if (isAuthed) {
    router.push({ name: 'home' });
  }
});

onMounted(() => {
  checkSession();
});
</script>

<style scoped>
.bg {
  background-color: rgb(241, 241, 241);
}

.grid {
  display: grid;
  grid-template-rows: auto 1fr auto;
  align-items: center;
}

.v-card__underlay .spotify-logo {
  height: 1rem;
  width: 1rem;
}

p {
  margin-top: 1rem;
}

.login-island {
  max-width: 500px;
  width: 100%;
  max-height: 600px;
}
</style>
