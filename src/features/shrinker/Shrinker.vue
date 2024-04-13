<template>
  <div class="shrinker w-100 h-100">
    <ShrinkerWelcome v-if="stage === 'welcome'" @next="goToConfig()" />
    <ShrinkerConfig v-else-if="stage === 'config'" @next="goToPlay" />
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
    <ShrinkerResults v-else-if="stage === 'results'" />
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
  goToConfig,
  goToPlay,
  nextRound,
  previousRound,
  roundIndex,
  maxRounds,
  currentRound,
  previewDuration,
  start,
  isStarted,
} = useShrinker();
</script>
