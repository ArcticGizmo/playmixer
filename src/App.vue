<template>
  <ModalProvider>
    <v-app>
      <v-main>
        <router-view />
      </v-main>
      <div v-if="errors.length" class="error-modal">
        <v-btn icon="mdi-bug" color="error" size="x-small" @click="onShowErrors()" />
      </div>
    </v-app>
  </ModalProvider>
</template>

<script lang="ts" setup>
import ModalProvider from '@/components/ModalProvider.vue';
import { useErrorCollector } from './composables/error';
import { useModalController } from './composables/modal';
import ErrorCollectorModal from '@/modals/ErrorCollectorModal.vue';

const modalController = useModalController();
const { errors } = useErrorCollector();

const onShowErrors = async () => {
  await modalController.show({
    component: ErrorCollectorModal,
    options: { maxWidth: '80vw' },
  });
};
</script>

<style scoped>
.error-modal {
  position: fixed;
  bottom: 1rem;
  right: 1rem;
}
</style>
