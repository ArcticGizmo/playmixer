import { computed, readonly, ref } from 'vue';
import { PlayConfig, ShrinkerRound, ShrinkerRoundResult, ShrinkerStage } from './shrinker.types';
import { Track } from '@/types/spotify.types';

const DEFAULT_PREVIEW_DURATION = 5_000;

export const useShrinker = () => {
  const roundIndex = ref<number>(0);
  const stage = ref<ShrinkerStage>('config');
  const previewDuration = ref(DEFAULT_PREVIEW_DURATION);
  const results = ref<ShrinkerRoundResult[]>([]);
  const rounds = ref<ShrinkerRound[]>([]);

  // TODO: take in previous tracks as a shortcut

  const currentRound = computed(() => rounds.value[roundIndex.value]);

  const reset = () => {
    previewDuration.value = DEFAULT_PREVIEW_DURATION;
    roundIndex.value = 0;
    rounds.value = [];
    results.value = [];
  };

  const goToWelcome = () => {
    stage.value = 'welcome';
    reset();
  };

  const goToConfig = () => {
    // TODO: take in the new config
    stage.value = 'config';
  };

  const goToPlay = (config: PlayConfig) => {
    previewDuration.value = config.previewDuration;
    rounds.value = config.rounds;
    stage.value = 'play';
  };

  const nextRound = (kept: Track[], removed: Track[]) => {
    // TODO: check index
    results.value.push({ kept, removed });
    roundIndex.value += 1;
  };

  const undoRound = () => {
    // TODO: check index
    results.value.pop();
  };

  const goToResults = () => {
    stage.value = 'results';
  };

  return {
    stage: readonly(stage),
    previewDuration: readonly(previewDuration),
    results: readonly(results),
    roundIndex: readonly(roundIndex),
    maxRounds: computed(() => rounds.value.length),
    currentRound,
    goToWelcome,
    goToConfig,
    goToPlay,
    goToResults,
    nextRound,
  };
};

// TODO: expose audio loader? Or maybe just sideload it
