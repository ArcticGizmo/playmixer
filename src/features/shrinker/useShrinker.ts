import { computed, readonly, ref } from 'vue';
import {
  PlayConfig,
  ShrinkerActiveRound,
  ShrinkerActiveTrack,
  ShrinkerRound,
  ShrinkerRoundResult,
  ShrinkerStage,
} from './shrinker.types';
import { Track } from '@/types/spotify.types';
import { AudioManager } from '@/composables/audio';

const DEFAULT_PREVIEW_DURATION = 5_000;

const delay = (wait: number) => new Promise(r => setTimeout(r, wait));

const isTrackLoading = (previewUrl: string) => {
  return computed(() => {
    const state = AudioManager.state(previewUrl) as any as string;
    return state !== 'loaded';
  });
};

export const useShrinker = () => {
  const roundIndex = ref<number>(0);
  const stage = ref<ShrinkerStage>('config');
  const previewDuration = ref(DEFAULT_PREVIEW_DURATION);
  const results = ref<ShrinkerRoundResult[]>([]);
  const rounds = ref<ShrinkerRound[]>([]);
  const maxRounds = computed(() => rounds.value.length);
  const isStarted = ref(false);

  // const currentRound = computed(() => rounds.value[roundIndex.value]);
  const currentRound = computed<ShrinkerActiveRound>(() => {
    const cr = rounds.value[roundIndex.value];

    const tracks: ShrinkerActiveTrack[] = cr.tracks.map(t => {
      return {
        name: t.name,
        artist: t.artist,
        imageSrc: t.imageSrc,
        previewUrl: t.previewUrl!,
        show: ref(false),
        loading: isTrackLoading(t.previewUrl!),
      };
    });

    return {
      done: ref(false),
      tracks,
    };
  });

  const play = async () => {
    AudioManager.stop();

    await delay(100);
    for (const track of currentRound.value.tracks) {
      track.show.value = true;
      await AudioManager.play(track.previewUrl!);
      await delay(500);
    }
    currentRound.value.done.value = true;
  };

  const reset = () => {
    previewDuration.value = DEFAULT_PREVIEW_DURATION;
    roundIndex.value = 0;
    rounds.value = [];
    results.value = [];
    isStarted.value = false;
  };

  const goToWelcome = () => {
    stage.value = 'welcome';
    reset();
  };

  const goToConfig = () => {
    stage.value = 'config';
  };

  const goToPlay = async (config: PlayConfig) => {
    previewDuration.value = config.previewDuration;
    rounds.value = config.rounds;
    stage.value = 'play';
    isStarted.value = false;
  };

  const start = () => {
    // preload all tracks
    const alltracks = rounds.value
      .map(r => r.tracks)
      .flat()
      .map(t => t.previewUrl!)
      .filter(p => !!p) as string[];
    AudioManager.add(alltracks, previewDuration.value);
    isStarted.value = true;
    play();
  };

  const nextRound = (kept: Track[], removed: Track[]) => {
    results.value.push({ kept, removed });
    const nextRoundIndex = roundIndex.value + 1;
    if (nextRoundIndex > maxRounds.value - 1) {
      goToResults();
      return;
    }

    roundIndex.value = nextRoundIndex;
    play();
  };

  const previousRound = () => {
    if (roundIndex.value < 1) {
      return;
    }
    roundIndex.value -= 1;
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
    maxRounds,
    currentRound,
    goToWelcome,
    goToConfig,
    goToPlay,
    goToResults,
    nextRound,
    previousRound,
    start,
    isStarted: readonly(isStarted),
  };
};

// TODO: expose audio loader? Or maybe just sideload it
