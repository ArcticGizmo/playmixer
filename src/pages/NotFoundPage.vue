<template>
  <BaseFullScreenPage class="text-center">
    <div class="text-h3">Looks like you might be lost 🤔</div>
    <br />
    <v-btn class="mt-8" color="primary" :to="{ name: 'home' }">
      Back Home
      <v-icon class="ml-2">mdi-arrow-right</v-icon>
    </v-btn>
  </BaseFullScreenPage>
</template>

<script setup lang="ts">
import BaseFullScreenPage from './BaseFullScreenPage.vue';
</script>
