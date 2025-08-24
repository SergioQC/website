<script setup lang="ts">
import { onMounted, ref, watch } from 'vue';
import { CODE } from '@/misc';

const dialog = ref();
const showCard = ref<boolean>(false);

watch(
  () => showCard.value,
  (newValue) => {
    if (newValue) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (dialog as any).value.hide();
    }
  },
);

onMounted(() => {
  dialog.value?.addEventListener('sl-request-close', (event: CustomEvent) => {
    if (event.detail.source === 'overlay') {
      event.preventDefault();
    }
  });
});

function change(event: CustomEvent) {
  showCard.value = (event.target as HTMLInputElement).value === CODE;
}
</script>

<template>
  <sl-dialog label="Dialog" ref="dialog" class="dialog-focus dialog-deny-close" open no-header>
    <sl-input autofocus placeholder="Introduce the code" @sl-change="change"></sl-input>
  </sl-dialog>
  <div v-if="showCard">Hejka!</div>
</template>
