<template>
  <BaseFullScreenPage class="text-center">
    <div class="text-h3">Something went wrong while authenticating 💀</div>
    <p>Maybe head back to login and try again</p>
    <br />
    <v-btn class="mt-8" color="primary" :to="{ name: 'login' }">
      Back to login
      <v-icon class="ml-2">mdi-arrow-right</v-icon>
    </v-btn>
  </BaseFullScreenPage>
</template>

<script setup lang="ts">
import BaseFullScreenPage from './BaseFullScreenPage.vue';
</script>
