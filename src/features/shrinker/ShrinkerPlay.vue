<template>
  <div class="layout w-100 h-100">
    <div class="header w-100 d-flex pa-2">
      <CenteredDiv class="counter">{{ roundIndex + 1 }} / {{ maxRounds }}</CenteredDiv>
      <v-spacer></v-spacer>
      <div class="actions justify-right">
        <!-- <v-btn
            color="brown"
            elevation="2"
            icon="mdi-arrow-left"
            variant="tonal"
            :disabled="!state.canBack"
            @click="state.back()"
          />
          <v-btn
            color="brown"
            elevation="2"
            icon="mdi-arrow-right"
            variant="tonal"
            :disabled="!state.canNext"
            @click="state.next()"
          />
          
          -->
        <v-tooltip location="bottom">
          <template #activator="{ props: p }">
            <v-btn v-bind="p" icon="mdi-autorenew" color="secondary" />
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
                  icon="mdi-heart"
                  color="primary"
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
import { ShrinkerRound } from './shrinker.types';
import SpotifyTrack from '@/components/SpotifyTrack.vue';
import AspectContainer from '@/components/AspectContainer.vue';
import { useWindowSize } from '@vueuse/core';
import { computed } from 'vue';
import { Track } from '@/types/spotify.types';

const props = defineProps<{
  roundIndex: number;
  maxRounds: number;
  previewDuration: number;
  round: ShrinkerRound;
}>();

const emits = defineEmits<{
  (e: 'select', payload: { kept: Track[]; removed: Track[] }): void;
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
}

.counter {
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
