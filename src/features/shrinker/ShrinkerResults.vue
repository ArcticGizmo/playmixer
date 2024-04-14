<template>
  <div class="shrinker-results">
    <div class="background">
      <InfiniteScroller
        v-for="(item, index) of backgroundItems"
        :key="index"
        :duration="item.duration"
        :direction="item.direction as any"
      >
        <SpotifyTrackTile
          v-for="(track, index) of item.tracks"
          :key="index"
          :track-name="track.name"
          :artwork-src="track.imageSrc"
          :artist="track.artist"
        >
          <v-btn
            class="spotify-btn ma-2 pa-1"
            icon
            size="x-small"
            variant="text"
            :href="track.href"
            target="_blank"
          >
            <img src="/spotify.svg" height="100%" width="100%" />
          </v-btn>
        </SpotifyTrackTile>
      </InfiniteScroller>
    </div>
    <CenteredDiv class="w-100 h-100">
      <v-card class="px-10 py-6" max-width="600px">
        <h2 class="text-center mb-6">Whats next?</h2>
        <div class="options-layout text-center">
          <div>
            <h3>Kept</h3>
            <v-btn
              color="primary"
              variant="elevated"
              :disabled="props.kept.length < 4"
              @click="onKeepGoing(props.kept)"
            >
              Keep Cutting
            </v-btn>
            <v-btn color="secondary" @click="onSavePlaylist(props.kept)">Save Playlist</v-btn>
          </div>
          <div>
            <h3>Removed</h3>
            <v-btn
              color="primary"
              variant="elevated"
              :disabled="props.kept.length < 4"
              @click="onKeepGoing(props.removed)"
            >
              Keep Cutting
            </v-btn>
            <v-btn color="secondary" @click="onSavePlaylist(props.removed)">Save Playlist</v-btn>
          </div>
        </div>

        <v-btn class="mt-10 w-100" color="primary" variant="elevated" @click="emits('reset')">
          Again!
        </v-btn>
        <v-btn class="mt-3 w-100" color="error" variant="elevated" :to="{ name: 'home' }"
          >Home</v-btn
        >
      </v-card>
    </CenteredDiv>
  </div>
</template>

<script setup lang="ts">
import CenteredDiv from '@/components/CenteredDiv.vue';
import InfiniteScroller from '@/components/InfiniteScroller.vue';
import SpotifyTrackTile from '@/components/SpotifyTrackTile.vue';
import { useModalController } from '@/modals';
import SavePlaylistModal from '@/modals/SavePlaylistModal.vue';
import { Track } from '@/types/spotify.types';

const props = defineProps<{
  kept: Track[];
  removed: Track[];
}>();

const emits = defineEmits<{
  (e: 'keep-going', payload: Track[]): void;
  (e: 'reset'): void;
}>();

const modalController = useModalController();

const backgroundItems = [
  {
    tracks: props.kept,
    direction: 'forwards',
    duration: '80s',
  },
  {
    tracks: props.removed,
    direction: 'reverse',
    duration: '80s',
  },
];

const onKeepGoing = (tracks: Track[]) => {
  emits('keep-going', tracks);
};

const onSavePlaylist = async (tracks: Track[]) => {
  await modalController.show({
    component: SavePlaylistModal,
    options: { maxWidth: '500px' },
    props: { tracks },
  });
};
</script>

<style scoped>
.background {
  position: absolute;
  width: 100%;
}

.foreground {
  position: absolute;
  width: 100%;
  z-index: 10;
}

.shrinker-results {
  display: flex;
  flex-direction: column;
  justify-content: center;
  height: 100vh;
  width: 100vw;
}

.infinite-scroller {
  opacity: 0.5;
}

.spotify-track-tile {
  height: 40vh;
  min-width: 40vh;
}

.spotify-btn {
  position: absolute;
  bottom: 0;
  right: 0;
}

.options-layout {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 0.5rem;
}

.options-layout > * {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.options {
  text-align: center;
  display: grid;
  grid-template-columns: 2fr 3fr 3fr;
  gap: 0.5rem;
}
</style>
