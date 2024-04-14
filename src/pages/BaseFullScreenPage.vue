<template>
  <v-container class="pa-6 fill-height" fluid>
    <CenteredDiv
      class="w-100 h-100"
      :vertical-only="verticalOnly"
      :horizontal-only="horizontalOnly"
      wrap-children
    >
      <slot></slot>
    </CenteredDiv>
  </v-container>
</template>

<script setup lang="ts">
import CenteredDiv from '@/components/CenteredDiv.vue';

defineProps<{
  verticalOnly?: boolean;
  horizontalOnly?: boolean;
}>();
</script>
