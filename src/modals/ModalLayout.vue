<template>
  <v-card class="modal-layout rounded-xl">
    <v-card-title class="px-0">
      <slot name="title">{{ title }}</slot>
    </v-card-title>
    <v-card-subtitle>
      <slot name="subtitle">{{ subtitle }}</slot>
    </v-card-subtitle>
    <v-divider class="pb-4" />

    <v-card-text class="pa-0">
      <DivOverlay :show="isLoading">
        <template #overlay>
          <CenteredDiv class="h-100">
            <div>
              <v-progress-circular indeterminate size="60" />
            </div>
            Loading
          </CenteredDiv>
        </template>
        <slot></slot>
      </DivOverlay>
    </v-card-text>
    <v-divider class="pt-4" />

    <v-card-actions class="actions">
      <slot name="actions"> </slot>
    </v-card-actions>
  </v-card>
</template>

<script setup lang="ts">
import CenteredDiv from '@/components/CenteredDiv.vue';
import DivOverlay from '@/components/DivOverlay.vue';
defineProps<{
  title?: string;
  subtitle?: string;
  isLoading?: boolean;
}>();
</script>

<style scoped>
.modal-layout.v-card {
  min-height: 20vh;
  max-height: 85vh;
  padding: 2rem;
}

.actions {
  justify-content: flex-end;
}

.v-card-text {
  position: relative;
  flex-grow: 1;
  overflow-y: auto;
}

.text-overlay {
  position: relative;
  background-color: orange;
  /* top:  */
}
</style>
