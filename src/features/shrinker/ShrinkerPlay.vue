<template>
  <StartOverlay :show="!isStarted" @start="emits('start')" />
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

    <div class="tracks" :class="{ vertical, horizontal: !vertical }">
      <AspectContainer v-for="(track, index) of round.tracks" :key="index" aspect-ratio="1 / 1.5">
        <CenteredDiv>
          <SpotifyTrack
            v-show="track.show.value"
            class="track"
            :track-name="track.name"
            :artwork-src="track.imageSrc"
            :artist="track.artist"
          >
            <v-tooltip location="top">
              <template #activator="{ props: p }">
                <v-btn
                  v-bind="p"
                  class="float-right"
                  :class="{ 'keep-btn': round.done.value }"
                  icon="mdi-heart"
                  :color="round.done.value ? '' : 'primary'"
                  size="small"
                  @click="onSelect(index)"
                />
              </template>
              Keep
            </v-tooltip>
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

const { width, height } = useWindowSize();
const vertical = computed(() => height.value > width.value);

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
  width: 100%;
  animation: animationFlipInX, animationFloat;
  animation-duration: 0.75s, 10s;
  animation-iteration-count: 1, infinite;
  animation-delay: 0s, 0.75s;
  animation-timing-function: linear, linear;
}

.keep-btn {
  animation: animationTada;
  animation-duration: 2s;
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
</style>
