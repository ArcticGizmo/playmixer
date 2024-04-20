<template>
  <StartOverlay :show="!isStarted" @start="emits('start')" />
  <v-btn
    class="music-loading-icon"
    icon="mdi-music"
    color="secondary"
    variant="tonal"
    size="small"
    @click="onShowLoading()"
  />
  <div class="layout w-100 h-100">
    <div class="header w-100 d-flex pa-2">
      <CenteredDiv class="counter">{{ roundIndex + 1 }} / {{ maxRounds }}</CenteredDiv>
      <v-spacer></v-spacer>
      <div class="actions justify-right">
        <v-btn
          color="brown"
          elevation="2"
          icon="mdi-arrow-left"
          variant="tonal"
          :disabled="roundIndex < 1"
          @click="emits('back')"
        />
        <v-btn
          color="brown"
          elevation="2"
          icon="mdi-arrow-right"
          variant="tonal"
          @click="emits('next')"
        />
        <v-tooltip location="bottom">
          <template #activator="{ props: p }">
            <v-btn v-bind="p" icon="mdi-autorenew" color="secondary" @click="emits('replay')" />
          </template>
          New
        </v-tooltip>
        <v-tooltip location="bottom">
          <template #activator="{ props: p }">
            <v-btn v-bind="p" icon="mdi-home" color="error" :to="{ name: 'home' }" />
          </template>
          Home
        </v-tooltip>
      </div>
    </div>

    <div class="tracks pa-3" :class="{ vertical: !horizontal, horizontal }">
      <AspectContainer
        v-for="(track, index) of round.tracks"
        :key="index"
        :aspect-ratio="aspectRatio"
      >
        <CenteredDiv v-if="track.show.value">
          <SpotifyTrack
            class="track"
            :track-name="track.name"
            :artwork-src="track.imageSrc"
            :artist="track.artist"
            :horizontal="!horizontal"
            :loading="track.loading.value"
            :no-preview="!track.previewUrl"
          >
            <div class="d-flex">
              <v-tooltip location="top">
                <template #activator="{ props: p }">
                  <v-btn v-bind="p" icon variant="text" :href="track.href" target="_blank">
                    <v-img src="/spotify.svg" height="2.5rem" width="2.5rem"></v-img>
                  </v-btn>
                </template>
                View on Spotify
              </v-tooltip>
              <v-spacer></v-spacer>
              <v-tooltip location="top">
                <template #activator="{ props: p }">
                  <v-btn
                    v-bind="p"
                    :class="{ 'keep-btn': round.done.value }"
                    :variant="round.done.value ? undefined : 'tonal'"
                    icon="mdi-heart"
                    size="small"
                    @click="onSelect(index)"
                  />
                </template>
                Keep
              </v-tooltip>
            </div>
          </SpotifyTrack>
        </CenteredDiv>
      </AspectContainer>
    </div>
  </div>
</template>

<script setup lang="ts">
import CenteredDiv from '@/components/CenteredDiv.vue';
import { ShrinkerActiveRound } from './shrinker.types';
import SpotifyTrack from '@/components/SpotifyTrack.vue';
import AspectContainer from '@/components/AspectContainer.vue';
import { useWindowSize } from '@vueuse/core';
import { computed } from 'vue';
import { Track } from '@/types/spotify.types';
import StartOverlay from '@/components/StartOverlay.vue';
import { useModalController } from '@/modals';
import MusicLoadingModal from '@/modals/MusicLoadingModal.vue';

const props = defineProps<{
  isStarted: boolean;
  roundIndex: number;
  maxRounds: number;
  previewDuration: number;
  round: ShrinkerActiveRound;
}>();

const emits = defineEmits<{
  (e: 'select', payload: { kept: Track[]; removed: Track[] }): void;
  (e: 'start'): void;
  (e: 'next'): void;
  (e: 'back'): void;
  (e: 'replay'): void;
}>();

const modalController = useModalController();

const { width, height } = useWindowSize();
const horizontal = computed(() => width.value > height.value);

const aspectRatio = computed(() => (horizontal.value ? '0.75' : '3'));

const onSelect = (index: number) => {
  const kept: Track[] = [];
  const removed: Track[] = [];

  props.round.tracks.forEach((track, i) => {
    if (i === index) {
      kept.push(track);
    } else {
      removed.push(track);
    }
  });

  emits('select', { kept, removed });
};

const onShowLoading = async () => {
  const highlightSrcs = props.round.tracks.map(t => t.previewUrl).filter(p => !!p) as string[];
  await modalController.show({
    component: MusicLoadingModal,
    props: { highlightSrcs },
    options: { maxWidth: '80vw' },
  });
};
</script>

<style scoped>
.layout {
  display: grid;
  grid-template-rows: 4rem 1fr;
}

.tracks {
  display: flex;
  justify-content: space-evenly;
}

.tracks.vertical {
  flex-direction: column;
}

.tracks.horizontal {
  flex-direction: row;
}

.track {
  height: 100%;
  width: 90%;
  animation: animateJackInTheBox, animationFloat;
  animation-duration: 0.75s, 10s;
  animation-iteration-count: 1, infinite;
  animation-delay: 0s, 0.75s;
  animation-timing-function: ease-out, linear;
}

.keep-btn {
  animation: animationTada;
  animation-duration: 1s;
  animation-timing-function: ease-in-out;
}

.counter {
  font-weight: bold;
  padding: 0.5rem;
  /* From https://css.glass */
  background: rgba(110, 127, 211, 0.31);
  border-radius: 16px;
  box-shadow: 0 4px 30px rgba(0, 0, 0, 0.1);
  backdrop-filter: blur(3.6px);
  -webkit-backdrop-filter: blur(3.6px);
  border: 1px solid rgba(110, 127, 211, 0.79);
}

.actions {
  display: flex;
  gap: 0.5rem;
}

.music-loading-icon {
  position: fixed;
  bottom: 1rem;
  left: 1rem;
  z-index: 20;
}
</style>
