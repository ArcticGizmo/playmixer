<template>
  <ModalLayout title="Save playlist" :is-loading="isSubmitting">
    <v-text-field v-model="playlistName" label="Playlist Name" :error-messages="error" />

    <template #actions>
      <v-btn
        color="primary"
        variant="flat"
        :disabled="!playlistName.trim().length"
        @click="onSubmit()"
      >
        Create
      </v-btn>
      <v-btn color="error" :disabled="isSubmitting" @click="onCancel()">Cancel</v-btn>
    </template>
  </ModalLayout>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import ModalLayout from './ModalLayout.vue';
import { Track } from '@/types/spotify.types';
import { useModal } from '.';
import { useSpotify } from '@/composables/spotify';
import { useToast } from 'vue-toast-notification';

const { createPlaylist } = useSpotify();
const toast = useToast();

const props = defineProps<{
  tracks: Track[];
}>();

const isSubmitting = ref(false);

const playlistName = ref('');
const error = ref('');

const modal = useModal();

const onCancel = () => modal.close();

const onSubmit = async () => {
  const uris = [...new Set(props.tracks.map(t => t.uri))];
  isSubmitting.value = true;
  error.value = '';
  try {
    await createPlaylist(playlistName.value, uris);
    toast.success('Playlist created!', { duration: 2000 });
    modal.close();
  } catch (e) {
    console.error(e);
    error.value = 'Something went wrong while creating your playlist :(';
  } finally {
    isSubmitting.value = false;
  }
};
</script>
