<script setup lang="ts">
import { isCorrectCode } from '@/utils/secrets';
import { onMounted, ref, watch } from 'vue';
import InstructionsLayout from './InstructionsLayout.vue';
import { FF_SHOW_CODE_INPUT } from '@/utils/feature-flags';

const dialog = ref();
const showCard = ref<boolean>(!FF_SHOW_CODE_INPUT);

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
  showCard.value = isCorrectCode((event.target as HTMLInputElement).value);
}
</script>

<template>
  <sl-dialog
    v-if="FF_SHOW_CODE_INPUT"
    label="Dialog"
    ref="dialog"
    class="dialog-focus dialog-deny-close"
    open
    no-header
  >
    <sl-input autofocus placeholder="Introduce the code" @sl-change="change"></sl-input>
  </sl-dialog>
  <InstructionsLayout v-if="showCard"></InstructionsLayout>
</template>
