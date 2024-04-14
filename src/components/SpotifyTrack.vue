<template>
  <div class="spotify-track pa-4">
    <div class="content">
      <v-img :src="artworkSrc" aspect-ratio="1" />
      <div class="mt-2">
        <div class="text-h6">{{ trackName }}</div>
        <div class="text-overline">{{ artist }}</div>
        <slot></slot>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
defineProps<{
  artworkSrc?: string;
  trackName: string;
  artist?: string;
  link?: string;
}>();
</script>

<style scoped>
.spotify-track {
  /* From https://css.glass */
  background: rgba(110, 127, 211, 0.31);
  border-radius: 16px;
  box-shadow: 0 4px 30px rgba(0, 0, 0, 0.1);
  backdrop-filter: blur(3.6px);
  -webkit-backdrop-filter: blur(3.6px);
  border: 1px solid rgba(110, 127, 211, 0.5);
}

.content {
  display: grid;
  height: 100%;
  width: 100%;
  grid-template-rows: 1fr auto;
}
</style>
