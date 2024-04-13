<template>
  <v-container class="pa-0 ma-0 fill-height" fluid>
    <Shrinker />
  </v-container>
</template>

<script setup lang="ts">
import Shrinker from '@/features/shrinker/Shrinker.vue';
</script>

<style scoped>
.v-container {
  background: rgb(203, 211, 255);
  background: radial-gradient(circle, rgba(203, 211, 255, 1) 0%, rgba(195, 255, 245, 1) 100%);
}
</style>
