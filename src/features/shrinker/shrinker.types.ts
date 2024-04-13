import { Track } from '@/types/spotify.types';

export type ShrinkerStage = 'welcome' | 'config' | 'play' | 'results';

export interface ShrinkerRound {
  tracks: Track[];
}

export interface ShrinkerRoundResult {
  kept: Track[];
  removed: Track[];
}

export interface PlayConfig {
  previewDuration: number;
  rounds: ShrinkerRound[];
}
