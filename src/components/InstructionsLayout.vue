<script setup lang="ts">
import { computed, onMounted, ref } from 'vue';

const CURRENT_LIVES = 2;
const EXTRA_LIVES = 2;

const container = ref();

const percentage = computed(() => (CURRENT_LIVES / EXTRA_LIVES) * 100);

onMounted(() => {
  // Close all other details when one is shown
  container.value.addEventListener('sl-show', (event: CustomEvent) => {
    if ((event.target as HTMLElement)?.localName === 'sl-details') {
      [...container.value.querySelectorAll('sl-details')].map(
        (details) => ((details as HTMLElement & { open: boolean }).open = event.target === details),
      );
    }
  });
});
</script>

<template>
  <div ref="container" class="details-group">
    <sl-details summary="First" open>
      Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut
      labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco
      laboris nisi ut aliquip ex ea commodo consequat.
    </sl-details>

    <sl-details summary="Second">
      Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut
      labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco
      laboris nisi ut aliquip ex ea commodo consequat.
    </sl-details>

    <sl-details summary="Third">
      Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut
      labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco
      laboris nisi ut aliquip ex ea commodo consequat.
    </sl-details>
  </div>

  <sl-progress-ring
    class="progress-ring"
    :value="percentage"
    style="
      --track-color: pink;
      --indicator-color: deeppink;
      --track-width: 8px;
      --indicator-width: 8px;
      --size: 400px;
    "
  >
    <div>
      <span class="bold-text">{{ CURRENT_LIVES }}</span>
      <span> out of </span>
      <span class="bold-text">{{ EXTRA_LIVES }}</span>
    </div>
    &nbsp;
    <sl-icon name="suit-heart-fill"></sl-icon>
  </sl-progress-ring>
</template>

<style scoped>
.bold-text {
  font-weight: bold;
}

.progress-ring {
  margin: auto;
  display: block;
}

.details-group {
  margin-top: var(--sl-spacing-2x-large);
}

.details-group sl-details {
  margin-bottom: var(--sl-spacing-2x-small);
}
</style>
