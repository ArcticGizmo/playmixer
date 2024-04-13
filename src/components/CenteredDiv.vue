<template>
  <div
    class="centered-div"
    :class="{ 'vertical-only': verticalOnly, 'horizontal-only': horizontalOnly }"
  >
    <div v-if="wrapChildren">
      <slot></slot>
    </div>
    <slot v-else></slot>
  </div>
</template>

<script setup lang="ts">
defineProps<{
  horizontalOnly?: boolean;
  verticalOnly?: boolean;
  wrapChildren?: boolean;
}>();
</script>

<style scoped>
.centered-div {
  display: grid;
  place-items: center;
}

.centered-div.vertical-only {
  justify-content: start;
}

.centered-div.horizontal-only {
  align-items: start;
}
</style>
