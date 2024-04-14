<template>
  <div class="shrinker w-100 h-100">
    <ShrinkerWelcome v-if="stage === 'welcome'" @next="goToConfig()" />
    <ShrinkerConfig
      v-else-if="stage === 'config'"
      :previous-tracks="previousTracks"
      @back="goToWelcome()"
      @next="goToPlay"
    />
    <ShrinkerPlay
      v-else-if="stage === 'play'"
      :is-started="isStarted"
      :max-rounds="maxRounds"
      :round-index="roundIndex"
      :preview-duration="previewDuration"
      :round="currentRound"
      @select="e => nextRound(e.kept, e.removed)"
      @back="previousRound()"
      @next="nextRound([], [])"
      @start="start()"
    />
    <ShrinkerResults
      v-else-if="stage === 'results'"
      :kept="results.map(r => r.kept).flat()"
      :removed="results.map(r => r.removed).flat()"
      @reset="goToWelcome()"
      @keep-going="goToConfig"
    />
  </div>
</template>

<script setup lang="ts">
import ShrinkerWelcome from './ShrinkerWelcome.vue';
import ShrinkerConfig from './ShrinkerConfig.vue';
import ShrinkerPlay from './ShrinkerPlay.vue';
import ShrinkerResults from './ShrinkerResults.vue';
import { useShrinker } from './useShrinker';

const {
  stage,
  goToWelcome,
  goToConfig,
  goToPlay,
  nextRound,
  previousRound,
  goToResults,
  roundIndex,
  maxRounds,
  currentRound,
  previewDuration,
  start,
  isStarted,
  results,
  previousTracks,
} = useShrinker();
</script>
