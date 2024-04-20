<template>
  <ModalLayout title="Music Pre-loader">
    <v-list lines="three">
      <v-list-item
        v-for="(item, index) of items"
        :key="index"
        :active="highlightSrcs?.includes(item.src)"
      >
        <template #prepend>
          <v-progress-circular v-if="item.icon.icon === 'loading'" class="loading" indeterminate />
          <v-icon v-else class="pl-7" :icon="item.icon.icon" :color="item.icon.color" />
        </template>
        <template #append>
          <v-btn
            class="ml-4"
            icon="mdi-reload"
            variant="tonal"
            size="small"
            :color="item.state === 'errored' ? 'red' : 'green'"
            @click="onReload(item.src)"
          />
        </template>
        <v-list-item-title>{{ item.name || '--No Name--' }}</v-list-item-title>
        <v-list-item-subtitle style="word-break: break-all">{{ item.src }}</v-list-item-subtitle>
        <v-list-item-subtitle v-if="item.error" class="mt-4">
          Error: {{ item.error }}
        </v-list-item-subtitle>
      </v-list-item>
    </v-list>
  </ModalLayout>
</template>

<script setup lang="ts">
import { AudioManager } from '@/composables/audio';
import type { AudioState } from '@/composables/audio';
import ModalLayout from './ModalLayout.vue';
import { computed } from 'vue';
import { firstBy } from 'thenby';

const ICONS: Record<AudioState, { icon: string; color?: string }> = {
  unloaded: { icon: 'mdi-crosshairs-question' },
  loading: { icon: 'loading' },
  loaded: { icon: 'mdi-check', color: 'green' },
  errored: { icon: 'mdi-alert-circle-outline', color: 'red' },
};

const props = defineProps<{
  highlightSrcs?: string[];
}>();

const items = computed(() => {
  const items = AudioManager.records.value.map(r => {
    const icon = ICONS[r.state];

    return {
      name: r.name,
      src: r.src,
      state: r.state,
      icon,
      error: r.error,
    };
  });

  const highlightSrcs = props.highlightSrcs || [];
  items.sort(firstBy(x => highlightSrcs.includes(x.src), 'desc'));
  return items;
});

const onReload = (src: string) => {
  AudioManager.reload(src);
};
</script>

<style scoped>
.loading {
  width: 3.75rem;
  height: 25px;
}
</style>
