<template>
  <ModalLayout title="Error Collector">
    <v-list lines="two">
      <v-list-item v-for="(error, index) of errors" :key="index">
        <v-list-item-title>{{ error.message }} ({{ error.at.toISOString() }})</v-list-item-title>
        <v-list-item-subtitle>{{ error.subtitle }}</v-list-item-subtitle>
      </v-list-item>
    </v-list>
    <template #actions>
      <v-btn color="error" variant="outlined" @click="clear()">Clear</v-btn>
    </template>
  </ModalLayout>
</template>

<script setup lang="ts">
import { useErrorCollector } from '@/composables/error';
import ModalLayout from './ModalLayout.vue';

const { errors, clear } = useErrorCollector();
</script>
