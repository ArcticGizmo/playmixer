<template>
  <v-responsive style="margin: auto">
    <v-card class="text-center" min-width="200px" max-width="500px">
      <v-card-title>{{ title || 'Loading' }}</v-card-title>
      <v-card-text v-if="message">{{ message }} </v-card-text>
      <v-progress-circular class="ma-4" indeterminate />
    </v-card>
  </v-responsive>
</template>

<script setup lang="ts">
defineProps<{ title?: string; message?: string }>();
</script>
