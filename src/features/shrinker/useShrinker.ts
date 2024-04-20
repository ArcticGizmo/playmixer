import { computed, readonly, ref, watch } from 'vue';
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
import { useToast } from 'vue-toast-notification';

const DEFAULT_PREVIEW_DURATION = 5_000;

const delay = (wait: number) => new Promise(r => setTimeout(r, wait));

const isTrackLoading = (previewUrl: string) => {
  return computed(() => {
    const state = AudioManager.state(previewUrl) as any as string;
    return state !== 'loaded';
  });
};

export const useShrinker = () => {
  const toast = useToast();
  const roundIndex = ref<number>(0);
  const stage = ref<ShrinkerStage>('welcome');
  const previewDuration = ref(DEFAULT_PREVIEW_DURATION);
  const results = ref<ShrinkerRoundResult[]>([]);
  const rounds = ref<ShrinkerRound[]>([]);
  const maxRounds = computed(() => rounds.value.length);
  const isStarted = ref(false);
  const previousTracks = ref<Track[]>([]);

  // Make sure we don't stack tracks
  watch(stage, () => AudioManager.stop());

  // const currentRound = computed(() => rounds.value[roundIndex.value]);
  const currentRound = computed<ShrinkerActiveRound>(() => {
    const cr = rounds.value[roundIndex.value];

    const tracks: ShrinkerActiveTrack[] = cr.tracks.map(t => {
      return {
        uri: t.uri,
        href: t.href,
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
      if (track.previewUrl) {
        await AudioManager.play(track.previewUrl);
      } else {
        toast.warning(`${track.name} does not have a preview`);
      }
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
    previousTracks.value = [];
  };

  const goToWelcome = () => {
    stage.value = 'welcome';
    reset();
  };

  const goToConfig = (tracks?: Track[]) => {
    stage.value = 'config';
    previousTracks.value = tracks || [];
  };

  const goToPlay = async (config: PlayConfig) => {
    previewDuration.value = config.previewDuration;
    rounds.value = config.rounds;
    stage.value = 'play';
    isStarted.value = false;
  };

  const start = () => {
    // preload tracks
    const allTracks = rounds.value
      .map(r => r.tracks)
      .flat()
      .filter(t => !!t.previewUrl);

    for (const track of allTracks) {
      AudioManager.add(track.previewUrl!, { name: track.name, maxDuration: previewDuration.value });
    }

    isStarted.value = true;
    play();
  };

  const nextRound = (kept: Track[], removed: Track[]) => {
    AudioManager.stop();
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
    AudioManager.stop();
    if (roundIndex.value < 1) {
      return;
    }
    roundIndex.value -= 1;
    results.value.pop();
    play();
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
    previousTracks,
    isStarted: readonly(isStarted),
  };
};
