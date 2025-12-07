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
  <div class="layout-container">
    <!-- Left side: Lives circle -->
    <div class="lives-section">
      <sl-progress-ring
        class="progress-ring"
        :value="percentage"
        style="
          --track-color: pink;
          --indicator-color: deeppink;
          --track-width: 8px;
          --indicator-width: 8px;
          --size: 200px;
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
    </div>

    <!-- Divider -->
    <sl-divider vertical></sl-divider>

    <!-- Right side: Instructions -->
    <div ref="container" class="instructions-section">
      <div class="details-group">
        <sl-details summary="First" open>
          Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt
          ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation
          ullamco laboris nisi ut aliquip ex ea commodo consequat.
        </sl-details>

        <sl-details summary="Second">
          Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt
          ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation
          ullamco laboris nisi ut aliquip ex ea commodo consequat.
        </sl-details>

        <sl-details summary="Third">
          Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt
          ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation
          ullamco laboris nisi ut aliquip ex ea commodo consequat.
        </sl-details>
      </div>
    </div>
  </div>
</template>

<style scoped>
.layout-container {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: var(--sl-spacing-2x-large);
  padding: var(--sl-spacing-2x-large);
  min-height: 100vh;
  width: 100%;
}

.lives-section {
  display: flex;
  justify-content: center;
  align-items: center;
  flex-shrink: 0;
}

.instructions-section {
  flex: 1;
  overflow-y: auto;
  max-height: 500px;
  padding-right: var(--sl-spacing-large);
}

.bold-text {
  font-weight: bold;
}

.progress-ring {
  display: block;
}

.details-group {
  margin: 0;
}

.details-group sl-details {
  margin-bottom: var(--sl-spacing-2x-small);
}

sl-divider {
  --spacing: 0;
  height: 300px;
}

@media (max-width: 768px) {
  .layout-container {
    flex-direction: column;
    gap: var(--sl-spacing-large);
  }

  .instructions-section {
    max-height: none;
    padding-right: 0;
    width: 100%;
  }

  sl-divider {
    display: none;
  }
}
</style>
