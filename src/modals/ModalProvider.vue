<template>
  <slot></slot>
  <div id="modal-controller">
    <v-dialog
      v-for="(m, index) in modals"
      :key="index"
      v-model="m.show"
      v-bind="((m.options || {}) as any)"
      @after-leave="m.destroy()"
    >
      <component :is="m.component" v-bind="m.props" />
    </v-dialog>
  </div>
</template>

<script setup lang="ts">
import { MODAL_LOOKUP } from '.';
import { computed, onBeforeUnmount } from 'vue';

const modals = computed(() => Object.values(MODAL_LOOKUP.value));

onBeforeUnmount(() => {
  modals.value.forEach(m => m.destroy());
});
</script>

<style scoped>
#modal-controller {
  position: fixed;
  width: 100vh;
  height: 100vh;
  top: 0;
  left: 0;
  z-index: 100000;
  pointer-events: none;
}
</style>
@/modals/modal
