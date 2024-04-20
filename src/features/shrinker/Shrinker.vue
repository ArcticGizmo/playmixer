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
      @replay="goToConfig()"
      @back="previousRound()"
      @next="nextRound([], [])"
      @start="start()"
    />
    <ShrinkerResults
      v-else-if="stage === 'results'"
      :kept="results.map(r => r.kept).flat()"
      :removed="results.map(r => r.removed).flat()"
      @reset="onReset()"
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
import { AudioManager } from '@/composables/audio';

const {
  stage,
  goToWelcome,
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
  results,
  previousTracks,
} = useShrinker();

const onReset = () => {
  AudioManager.unload();
  goToConfig();
};

// goToPlay({
//   previewDuration: 7000,
//   rounds: [
//     {
//       tracks: [
//         {
//           uri: 'spotify:track:2X0bCCEsa8gRMt4h0VJY2t',
//           href: 'https://open.spotify.com/track/2X0bCCEsa8gRMt4h0VJY2t',
//           name: 'Call My Name',
//           artist: 'PENTAGON',
//           imageSrc: 'https://i.scdn.co/image/ab67616d0000b273de5a12fc93022c4f7b8030b3',
//           previewUrl:
//             'https://p.scdn.co/mp3-preview/dc884489acd0bb4eba830bcff69f74d6c306136b?cid=44fb6fdea9d64743a51b975b8e90e661',
//         },
//         {
//           uri: 'spotify:track:5Wll1i0Y8GGjyePcP83L3x',
//           href: 'https://open.spotify.com/track/5Wll1i0Y8GGjyePcP83L3x',
//           name: "Feelin' Like",
//           artist: 'PENTAGON',
//           imageSrc: 'https://i.scdn.co/image/ab67616d0000b273de5a12fc93022c4f7b8030b3',
//           previewUrl:
//             'https://p.scdn.co/mp3-preview/c334c1e1853faa71f0eb3f7a5ea85750dcba0ca1?cid=44fb6fdea9d64743a51b975b8e90e661',
//         },
//       ],
//     },
//     {
//       tracks: [
//         {
//           uri: 'spotify:track:51vRumtqbkNW9wrKfESwfu',
//           href: 'https://open.spotify.com/track/51vRumtqbkNW9wrKfESwfu',
//           name: 'UNFORGIVEN (feat. Nile Rodgers)',
//           artist: 'LE SSERAFIM',
//           imageSrc: 'https://i.scdn.co/image/ab67616d0000b273d71fd77b89d08bc1bda219c7',
//           previewUrl:
//             'https://p.scdn.co/mp3-preview/ba72474a4c4c3a63f8c6d00c561ad40be6e1e7c7?cid=44fb6fdea9d64743a51b975b8e90e661',
//         },
//         {
//           uri: 'spotify:track:4F1A1gyNaUVXibZNekQvgO',
//           href: 'https://open.spotify.com/track/4F1A1gyNaUVXibZNekQvgO',
//           name: 'SUMMER!',
//           artist: 'PENTAGON',
//           imageSrc: 'https://i.scdn.co/image/ab67616d0000b2730b6ab2f6b02f2a9e6713b47d',
//         },
//       ],
//     },
//     {
//       tracks: [
//         {
//           uri: 'spotify:track:3Ua0m0YmEjrMi9XErKcNiR',
//           href: 'https://open.spotify.com/track/3Ua0m0YmEjrMi9XErKcNiR',
//           name: 'Like Crazy',
//           artist: 'Jimin',
//           imageSrc: 'https://i.scdn.co/image/ab67616d0000b2732b46078245d0120690eb560d',
//           previewUrl:
//             'https://p.scdn.co/mp3-preview/2db5f36096963d97afc870c50990d62d27858a43?cid=44fb6fdea9d64743a51b975b8e90e661',
//         },
//         {
//           uri: 'spotify:track:3AOf6YEpxQ894FmrwI9k96',
//           href: 'https://open.spotify.com/track/3AOf6YEpxQ894FmrwI9k96',
//           name: 'Super',
//           artist: 'SEVENTEEN',
//           imageSrc: 'https://i.scdn.co/image/ab67616d0000b27380e31ba0c05187e6310ef264',
//           previewUrl:
//             'https://p.scdn.co/mp3-preview/1dd31996959e603934dbe4c7d3ee377243a0f890?cid=44fb6fdea9d64743a51b975b8e90e661',
//         },
//       ],
//     },
//   ],
// });
</script>
