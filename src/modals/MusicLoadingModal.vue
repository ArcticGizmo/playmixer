<template>
  <ModalLayout title="Music Pre-loader">
    <v-list lines="two">
      <v-list-item v-for="(audio, index) of audioItems" :key="index">
        <v-list-item-title>{{ audio.src }}</v-list-item-title>
        <v-list-item-subtitle>{{ audio.state }}</v-list-item-subtitle>
      </v-list-item>
    </v-list>
    <!-- <template #actions>
      <v-btn color="error" variant="outlined" @click="clear()">Clear</v-btn>
    </template> -->

    <!-- add the ability to reload music that has errored -->
  </ModalLayout>
</template>

<script setup lang="ts">
import { AudioManager } from '@/composables/audio';
import ModalLayout from './ModalLayout.vue';

const audioItems = AudioManager.debug;

/*
TODO:
- add ability to try reload music
- add track name to each record to help with loading
*/
</script>
