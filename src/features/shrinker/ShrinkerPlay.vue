<template>
  <div class="layout w-100 h-100">
    <div>Header</div>
    <div class="tracks" :class="{ vertical, horizontal: !vertical }">
      <AspectContainer v-for="(track, index) of round.tracks" :key="index" aspect-ratio="1 / 1.5">
        <CenteredDiv>
          <SpotifyTrack
            class="track"
            :track-name="track.name"
            :artwork-src="track.imageSrc"
            :artist="track.artist"
          >
            <v-btn
              class="float-right"
              icon="mdi-heart"
              color="primary"
              size="small"
              @click="onSelect(index)"
            />
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
</style>
