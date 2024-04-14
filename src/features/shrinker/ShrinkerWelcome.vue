<template>
  <v-container class="pt-10">
    <v-card class="pa-10">
      <div class="text-h4">Lets get cutting!</div>
      <div v-for="(text, index) of lines" class="text-body mt-4" :key="index">{{ text }}</div>

      <v-btn class="float-right mt-10" color="primary" @click="emits('next')">
        Get Started <v-icon>mdi-arrow-right</v-icon>
      </v-btn>
    </v-card>
  </v-container>
</template>

<script setup lang="ts">
const emits = defineEmits<{
  (e: 'next'): void;
}>();

const lines = [
  'Do you have those playlists that just have every song on the planet in them?',
  '.... I know you do',
  'Instead of going through it manually and moving it to a new playlist, what if I told you there was a better way?',
  'With the playlist shrinker, we force you to cut 50%, 66% or event 75% of your playlist! Best thing is, you can easily save your new playlist without affecting the old one!',
  'Give it a go and see what you learn about yourself 👼😈',
];
</script>
