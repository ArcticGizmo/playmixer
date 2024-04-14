<template>
  <div class="aspect-container" :class="{ debug }">
    <div class="aspect-child pa-3" :style="{ aspectRatio }">
      <slot></slot>
    </div>
  </div>
</template>

<script setup lang="ts">
defineProps<{
  debug?: boolean;
  aspectRatio?: string | number;
}>();
</script>

<style scoped>
.aspect-container {
  position: relative;
  width: 100%;
  height: 100%;
}

.aspect-child {
  position: absolute;
  margin: auto;
  left: 0;
  right: 0;
  top: 0;
  bottom: 0;
  max-width: 100%;
  max-height: 100%;
}

.aspect-container.debug {
  background-color: rgba(255, 0, 0, 0.2);
}

.debug .aspect-child {
  background-color: rgba(0, 187, 255, 0.2);
}
</style>
