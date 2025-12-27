<script setup lang="ts">
import { computed } from 'vue';

const CURRENT_LIVES = 2;
const EXTRA_LIVES = 2;

const percentage = computed(() => (CURRENT_LIVES / EXTRA_LIVES) * 100);
const heartbeatClass = computed(() => (percentage.value === 0 ? 'heart-icon-off' : 'heart-icon'));
</script>

<template>
  <div class="lives-section">
    <div class="lives-card">
      <sl-progress-ring
        class="progress-ring"
        :value="percentage"
        style="
          --track-color: var(--dull-color);
          --indicator-color: var(--8bit-light-pink);
          /* --track-color: rgba(255, 192, 203, 0.3);
          --indicator-color: #ff1493; */
          --track-width: 10px;
          --indicator-width: 10px;
          --size: 220px;
        "
      >
        <div class="lives-content">
          <div class="lives-text">
            <span class="lives-number">{{ CURRENT_LIVES }}</span>
            <span class="lives-label">/ {{ EXTRA_LIVES }}</span>
          </div>
          <sl-icon name="suit-heart-fill" :class="heartbeatClass"></sl-icon>
        </div>
      </sl-progress-ring>
      <p class="lives-title">Extra Hearts Remaining</p>
    </div>
  </div>
</template>

<style lang="css" scoped>
.lives-section {
  display: flex;
  justify-content: center;
  align-items: center;
  flex-shrink: 0;
  font-family: 'Press Start 2P', monospace;
}

.lives-card {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 16px;
  padding: 24px;
  background: transparent;
  border: none;
  border-radius: 0;
  transition: all 0.15s ease;
  box-shadow: none;
  position: relative;
  overflow: hidden;
}

.lives-card::before {
  content: '';
  position: absolute;
  top: -50%;
  right: -50%;
  width: 200%;
  height: 200%;
  background: none;
  pointer-events: none;
}

.lives-card:hover {
  transform: none;
  box-shadow: none;
}

.progress-ring {
  display: block;
  position: relative;
  z-index: 1;
}

.lives-content {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
}

.lives-text {
  display: flex;
  align-items: baseline;
  gap: 6px;
  font-size: 24px;
}

.lives-number {
  font-weight: 900;
  font-size: 32px;
  /* color: var(--8bit-gold); */
  color: var(--8bit-light-pink);
  /* text-shadow: 2px 2px 0 var(--8bit-deep-pink); */
  letter-spacing: 2px;
}

.lives-label {
  font-size: 18px;
  opacity: 1;
  /* color: var(--8bit-hot-pink);
  text-shadow: 1px 1px 0 var(--8bit-deep-pink); */
  color: var(--8bit-light-pink);
}

.heart-icon {
  color: var(--8bit-light-pink);
  font-size: 20px;
  animation: pixelbeat 0.75s infinite;
  text-shadow: 1px 1px 0 var(--8bit-gold);
  position: relative;
  z-index: 1;
}

.heart-icon-off {
  color: var(--dull-color);
  font-size: 20px;
  position: relative;
  z-index: 1;
}

@keyframes pixelbeat {
  0%,
  100% {
    transform: scale(1);
  }
  50% {
    transform: scale(1.2);
  }
}

.lives-title {
  font-size: 1rem;
  font-weight: 600;
  /* color: var(--8bit-deep-pink); */
  color: var(--8bit-light-pink);
  letter-spacing: 2px;
  text-transform: uppercase;
  /* text-shadow: 1px 1px 0 var(--8bit-hot-pink); */
  position: relative;
}

@media (max-width: 768px) {
  .lives-card {
    padding: 20px;
    gap: 12px;
  }

  .lives-number {
    font-size: 28px;
  }
}
</style>
