<template>
  <v-dialog :model-value="show" persistent absolute>
    <CenteredDiv>
      <v-btn size="large" @click="emits('start')">Start!</v-btn>
    </CenteredDiv>
  </v-dialog>
</template>

<script setup lang="ts">
defineProps<{
  show: boolean;
}>();

const emits = defineEmits<{
  (e: 'start'): void;
}>();
</script>
