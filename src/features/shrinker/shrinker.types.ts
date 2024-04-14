import { Track } from '@/types/spotify.types';
import { ComputedRef, Ref } from 'vue';

export type ShrinkerStage = 'welcome' | 'config' | 'play' | 'results';

export interface ShrinkerRound {
  tracks: Track[];
}

export interface ShrinkerActiveRound {
  tracks: ShrinkerActiveTrack[];
  done: Ref<boolean>;
}

export interface ShrinkerActiveTrack extends Track {
  show: Ref<boolean>;
  loading: ComputedRef<boolean>;
}

export interface ShrinkerRoundResult {
  kept: Track[];
  removed: Track[];
}

export interface PlayConfig {
  previewDuration: number;
  rounds: ShrinkerRound[];
}
