<template>
  <CenteredDiv>
    Welcome

    <v-btn @click="emits('next')">Next</v-btn>
  </CenteredDiv>
</template>

<script setup lang="ts">
import CenteredDiv from '@/components/CenteredDiv.vue';

const emits = defineEmits<{
  (e: 'next'): void;
}>();
</script>
