<script setup lang="ts">
import { onMounted, ref } from 'vue';

interface SlDetails extends HTMLElement {
  open: boolean;
}

const container = ref<HTMLDivElement>();

onMounted(() => {
  if (!container.value) return;

  const details = container.value.querySelectorAll('sl-details');

  // Set up click handler for each detail
  details.forEach((detail: Element) => {
    detail.addEventListener(
      'click',
      (event: Event) => {
        // If this detail is already open, prevent the click
        const detailElement = detail as SlDetails;
        if (detailElement.open) {
          event.stopPropagation();
          event.preventDefault();
          return;
        }
      },
      true,
    );
  });

  // Track which detail is currently open
  container.value.addEventListener('sl-show', ((event: Event) => {
    if ((event.target as HTMLElement)?.localName === 'sl-details') {
      const target = event.target;
      // Close all other details
      [...container.value!.querySelectorAll('sl-details')].forEach((d: Element) => {
        if (d !== target) {
          (d as SlDetails).open = false;
        }
      });
    }
  }) as EventListener);
});
</script>

<template>
  <div ref="container">
    <div class="details-group">
      <sl-details summary="Welcome, Forgiven One">
        "Hey! Listen! You’ve found the Heart of Mercy! This sacred heart beats with kindness beyond
        measure. With it, you will be spared from your not-so-serious faults, and forgiveness will
        shine upon your path. Carry it close, since mercy is rarer than any treasure."
      </sl-details>

      <sl-details summary="Terms Of Use" open>
        <ol>
          <li>
            Single Use
            <ul>
              <li>Each Heart of Mercy grants the wielder one spared fault.</li>
              <li>Upon activation, it dissolves into light and is lost.</li>
            </ul>
          </li>

          <li>
            Manual Invocation
            <ul>
              <li>The Heart of Mercy does not act on its own.</li>
              <li>
                It must be summoned by the bearer at the moment they seek forgiveness for a fault.
              </li>
            </ul>
          </li>

          <li>
            Multiple Hearts
            <ul>
              <li>
                More than one Heart of Mercy may be carried. Keep track with the progress ring.
              </li>
              <li>Each acts as an additional chance at reprieve, stacking like lives.</li>
            </ul>
          </li>
        </ol>
      </sl-details>

      <sl-details summary="Achievements">
        Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut
        labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco
        laboris nisi ut aliquip ex ea commodo consequat.
      </sl-details>
    </div>
  </div>
</template>

<style lang="css" scoped>
.details-group {
  margin: 0;
  width: 100%;
  max-width: 500px;
}

@media (min-width: 769px) {
  .details-group {
    min-width: 400px;
  }
}

@media (min-width: 1024px) {
  .details-group {
    min-width: 900px;
  }
}

.details-group::part(base) {
  background: transparent;
}

.details-group sl-details {
  margin-bottom: var(--sl-spacing-large);
}

.details-group sl-details::part(base) {
  background: var(--8bit-dark-bg);
  border: 4px solid var(--8bit-hot-pink);
  border-radius: 0;
  overflow: hidden;
  transition: all 0.1s ease;
  box-shadow: 3px 3px 0 var(--8bit-deep-pink);
}

.details-group sl-details:hover::part(base) {
  background: var(--8bit-dark-hover);
  border-color: var(--8bit-gold);
  box-shadow: 5px 5px 0 var(--8bit-deep-pink);
}

.details-group sl-details::part(summary) {
  padding: 8px;
  font-weight: 800;
  font-size: 18px;
  cursor: pointer;
  transition: all 0.1s ease;
  font-family: 'Press Start 2P', monospace;
  text-transform: uppercase;
  letter-spacing: 1px;
  color: var(--8bit-gold);
  text-shadow: 1px 1px 0 var(--8bit-deep-pink);
}

.details-group sl-details:hover::part(summary) {
  color: var(--8bit-gold);
}

.details-group sl-details::part(content) {
  padding: 8px;
  padding-top: 0;
  font-family: 'Press Start 2P', monospace;
  font-size: 12px;
  color: var(--8bit-hot-pink);
  overflow: auto;
  max-height: 150px;
  text-shadow: 1px 1px 0 var(--8bit-deep-pink);
  text-transform: uppercase;
  line-height: 1.4;
}
</style>
