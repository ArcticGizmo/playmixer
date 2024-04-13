<template>
  <div class="overlay-container">
    <div
      v-if="show"
      class="overlay"
      :style="{ backgroundColor: color ?? 'grey', opacity: opacity ?? 0.75 }"
    >
      <slot name="overlay">
        <CenteredDiv class="h-100">
          <v-progress-circular class="ma-4" size="100" indeterminate />
        </CenteredDiv>
      </slot>
    </div>
    <div class="content">
      <slot></slot>
    </div>
  </div>
</template>

<script setup lang="ts">
defineProps<{ show?: boolean; color?: string; opacity?: number }>();
</script>

<style scoped>
.overlay-container {
  display: grid;
  grid-template: 1fr / 1fr;
  place-items: center;
}

.overlay-container > * {
  width: 100%;
  grid-column: 1 / 1;
  grid-row: 1 / 1;
}

.overlay-container .content {
  z-index: 0;
}

.overlay-container .overlay {
  height: 100%;
  z-index: 1;
  pointer-events: none;
  display: grid;
  justify-content: center;
  align-items: center;
}
</style>
