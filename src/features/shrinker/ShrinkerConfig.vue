<template>
  <v-container class="shrinker-config pt-10">
    <DivOverlay :show="isLoading">
      <v-card class="pa-10">
        <form @submit.prevent="onSubmit">
          <h4 v-if="hasPreviousTracks" class="mb-4">
            You brought {{ previousTracks.length }} tracks to go around again!
          </h4>

          <h4>Pick your playlists</h4>
          <v-autocomplete
            label="Playlist"
            v-model="autocompleteValue"
            :items="playlists"
            item-title="name"
            return-object
            clear-on-select
            @update:model-value="(p: any) => onSelect(p)"
          >
            <template v-slot:item="{ props, item }">
              <v-list-item
                v-bind="props"
                :prepend-avatar="item.raw.imageSrc"
                :title="item.raw.name"
                :subtitle="item.raw.trackCount"
              />
            </template>
          </v-autocomplete>
          <v-text-field v-model="playlistUrl" label="Load from Share Link">
            <template #append>
              <v-btn color="primary" :disabled="!playlistUrl" @click="onLoadShareLink()"
                >Load</v-btn
              >
            </template>
          </v-text-field>

          <v-list class="mb-6">
            <v-list-item
              v-for="(playlist, index) of form.playlists"
              :key="index"
              :prepend-avatar="playlist.imageSrc"
              :title="playlist.name"
              :subtitle="playlist.trackCount"
            >
              <template #append>
                <v-btn
                  icon="mdi-delete"
                  color="error"
                  variant="tonal"
                  @click="onRemovePlaylist(playlist.id)"
                />
              </template>
            </v-list-item>
          </v-list>

          <h4>Configuration</h4>
          <br />

          <!-- variance -->
          <v-switch label="Add related tracks" v-model="form.useRecommendations" color="primary" />

          <!-- Team Count -->
          <v-label>Tracks per round ({{ form.tracksPerRound }})</v-label>
          <v-slider
            v-model="form.tracksPerRound"
            :min="2"
            :max="4"
            :step="1"
            thumb-label
            :disabled="!trackCount"
          />

          <!-- Rounds -->
          <v-label>Max Rounds ({{ form.maxRounds }})</v-label>
          <v-slider
            v-model="form.maxRounds"
            :min="1"
            :max="maxRounds"
            :step="1"
            thumb-label
            :disabled="!maxRounds"
          />

          <!-- preview time -->
          <v-label>Preview Length ({{ form.previewLimit }} sec)</v-label>
          <v-slider v-model="form.previewLimit" :min="1" :max="30" :step="1" thumb-label />
        </form>
        <div class="actions d-flex">
          <v-btn color="primary" @click="onBack()">Back</v-btn>
          <v-spacer></v-spacer>
          <v-btn color="primary" :disabled="!maxRounds" @click="onSubmit()">Next</v-btn>
        </div>
      </v-card>
    </DivOverlay>
  </v-container>
</template>

<script setup lang="ts">
import { useSpotify } from '@/composables/spotify';
import { onMounted, ref } from 'vue';
import { useToast } from 'vue-toast-notification';
import { computed } from 'vue';
import { Playlist, Track } from '@/types/spotify.types';
import { PlayConfig, ShrinkerRound } from './shrinker.types';
import { shuffleInPlace } from '@/util/shuffle';
import { chunk } from '@/util/enumerable';
import DivOverlay from '@/components/DivOverlay.vue';

interface Form {
  playlists: Playlist[];
  previewLimit: number;
  tracksPerRound: number;
  maxRounds: number;
  useRecommendations: boolean;
}

const props = defineProps<{
  previousTracks: Track[];
}>();

const emits = defineEmits<{
  (e: 'next', config: PlayConfig): void;
  (e: 'back'): void;
}>();

const spotify = useSpotify();
const toast = useToast({ position: 'top' });
const playlistUrl = ref('');
const autocompleteValue = ref<Playlist>();
const hasPreviousTracks = computed(() => props.previousTracks.length > 0);

const form = ref<Form>({
  playlists: [],
  previewLimit: 7,
  tracksPerRound: 2,
  maxRounds: 10,
  useRecommendations: false,
});

const isLoading = ref(true);
const playlists = ref<Playlist[]>([]);
const trackCount = computed(() => {
  return (
    props.previousTracks.length + form.value.playlists.reduce((acc, p) => acc + p.trackCount, 0)
  );
});
const maxRounds = computed(() => {
  return Math.floor(trackCount.value / form.value.tracksPerRound);
});

onMounted(async () => {
  playlists.value = await spotify.getMyPlaylists();
  isLoading.value = false;
});

const onSelect = (playlist: Playlist) => {
  if (playlist && !form.value.playlists.some(p => p.id === playlist.id)) {
    form.value.playlists.push(playlist);
  }
  autocompleteValue.value = undefined;
};

const onRemovePlaylist = (id: string) => {
  form.value.playlists = form.value.playlists.filter(p => p.id !== id);
};

const onSubmit = async () => {
  isLoading.value = true;

  try {
    await submit();
  } finally {
    isLoading.value = false;
  }
};

const submit = async () => {
  // fetch tracks
  const allTracks = await fetchTracks();
  shuffleInPlace(allTracks);

  // if recommendations requested, add those as well
  if (form.value.useRecommendations) {
    const trackIds = allTracks.map(t => t.id).slice(0, 5);
    const variableTracks = await spotify.getRecommendations(trackIds, trackIds.length);
    allTracks.push(...variableTracks);
  }

  // shuffle the tracks
  shuffleInPlace(allTracks);

  const tracksPerRound = form.value.tracksPerRound;

  const rounds: ShrinkerRound[] = chunk(allTracks, tracksPerRound)
    .map(tracks => {
      return { tracks };
    })
    .slice(0, form.value.maxRounds);

  const payload: PlayConfig = {
    previewDuration: form.value.previewLimit * 1000,
    rounds,
  };

  if (import.meta.env.DEV) {
    console.log('[dev] play config', payload);
  }

  emits('next', payload);
};

const fetchTracks = async () => {
  const fetchers = form.value.playlists.map(p => spotify.getPlaylistTracks(p.id));
  const allTracks = (await Promise.all(fetchers)).flat();
  allTracks.push(...props.previousTracks);
  return allTracks;
};

const onBack = () => {
  emits('back');
};

const onLoadShareLink = async () => {
  let link = playlistUrl.value;
  if (!link) {
    return;
  }

  playlistUrl.value = '';

  // remove leading http stuff
  link = link.replace('https://open.spotify.com/playlist/', '');
  // remove query string
  const playlistId = link.split('?')[0];

  if (!playlistId) {
    toast.warning("URL doesn't look right, please try again");
    return;
  }

  try {
    form.value.playlists.push(await spotify.getPlaylist(playlistId));
    toast.success('Playlist loaded!');
  } catch (error) {
    console.error(error);
    toast.warning('Playlist not found. Please try something else');
  }
};
</script>

<style scoped>
:deep(.v-slider__container) {
  margin-right: 1rem;
}

:deep(.v-input__prepend) {
  min-width: 11rem;
}

.spotify-btn {
  position: absolute;
  top: 0;
  right: 0;
}
</style>
