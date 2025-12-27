<script setup lang="ts">
import { ref } from 'vue';
import LivesSection from './LivesSection.vue';

const currentSlide = ref(2);

const slides = [
  {
    title: '- Welcome, Forgiven One -',
    content:
      '"Hey! Listen! You\'ve found the Heart of Mercy! This sacred heart beats with kindness beyond measure. With it, you will be spared from your not-so-serious faults, and forgiveness will shine upon your path. Carry it close, since mercy is rarer than any treasure."',
  },
  {
    title: '- Terms Of Use -',
    content: `1 - Single Use: Each Heart of Mercy grants the wielder one spared fault. Upon activation, it dissolves into light and is lost.\n\n2 - Manual Invocation: The Heart of Mercy does not act on its own. It must be summoned by the bearer when seeking for forgiveness for a fault.\n\n3 - Multiple Hearts: More than one Heart of Mercy may be carried. Keep track with the progress ring. Each one acts as an additional but independent entity, stacking like lives.`,
  },
  {
    title: '- Patch Notes v1.0 -',
    content: `NEW FEATURES\n
- Enhanced Forgiveness Engine: Player’s emotional load reduced by 75%.\n
- Clean Slate Protocol: All related facts related to guilt, awkwardness, pilots' ass checkings or minor catastrophes have been wiped.\n
- Compassion Aura: Standing near the card’s recipient now grants +25 Relief, +10 Calmness and +5 Hope.\n
BALANCE CHANGES\n
- Apology Cooldown: Reduced from “whenever you have the courage” to “instant cast.”\n
- Overthinking Damage: Nerfed significantly. Now deals only 1 HP instead of 10.\n
- Relationship Stability: Increased baseline by +20%.\n
BUG FIXES\n
- Fixed an issue where the player replayed past mistakes on loop.\n
- Resolved a rare bug where the player thought that was unworthy of mercy.\n
- Patched a glitch causing unnecessary dramatic monologues.\n
GENERAL IMPROVEMENTS\n
- Added clearer emotional UI indicators.\n
- Improved navigation when trying to move away from stressful situations.\n
- Reduced loading times for “feeling better.”\n
`,
  },
];

const nextSlide = () => {
  currentSlide.value =
    currentSlide.value + 1 === slides.length
      ? slides.length - 1
      : (currentSlide.value + 1) % slides.length;
};

const prevSlide = () => {
  currentSlide.value =
    currentSlide.value - 1 === slides.length
      ? slides.length - 1
      : (currentSlide.value - 1) % slides.length;
};
</script>

<template>
  <div class="layout-container">
    <!-- Title -->
    <div class="title-section">
      <h1 class="centered-title">Heart Of Mercy</h1>
      <h2 class="centered-subtitle">
        <i> -When all hope fades this heart beats once more, granting mercy to its bearer-</i>
      </h2>
    </div>

    <!-- Main Content -->
    <div class="main-content">
      <!-- Hearts Counter (Left/Center) -->
      <div class="hearts-section">
        <LivesSection />
      </div>

      <!-- Information Panel (Right/Bottom) -->
      <div class="info-panel">
        <div class="slide-header">
          <h2 class="slide-title">{{ slides[currentSlide].title }}</h2>
        </div>

        <div class="slide-content">
          {{ slides[currentSlide].content }}
        </div>

        <!-- Navigation Controls -->
        <div class="slide-controls">
          <button class="control-btn prev-btn" @click="prevSlide">←</button>
          <div class="slide-indicators">
            <span
              v-for="(_, index) in slides"
              :key="index"
              class="indicator"
              :class="{ active: index === currentSlide }"
            ></span>
          </div>
          <button class="control-btn next-btn" @click="nextSlide">→</button>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.layout-container {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  width: 100%;
  height: 100%;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  background: var(--8bit-green);
  border: 10px solid var(--dull-color);
}

.layout-container::before {
  content: '';
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  pointer-events: none;
  background: none;
  z-index: 0;
}

.main-content {
  flex: 1;
  position: relative;
  z-index: 10;
  display: flex;
  gap: 2rem;
  padding: 2rem;
  overflow: hidden;
  flex-direction: row;
  align-items: center;
  justify-content: center;
}

.title-section {
  width: 100%;
  text-align: center;
  padding: 0rem 1rem;
  flex-shrink: 0;
}

.centered-title {
  /* color: var(--8bit-gold); */
  color: var(--8bit-light-pink);
  font-family: 'Press Start 2P', monospace;
  font-size: 2.2rem;
  text-transform: uppercase;
  letter-spacing: 2px;
  /* text-shadow: 2px 2px 0 var(--8bit-deep-pink); */
  margin: 0 0 0.5rem 0;
  line-height: 1;
  padding-top: 2rem;
  font-weight: 600;
}

.centered-subtitle {
  /* color: var(--8bit-hot-pink); */
  color: var(--8bit-light-pink);
  font-weight: 600;
  font-family: 'Press Start 2P', monospace;
  font-size: 0.7rem;
  /* text-transform: uppercase; */
  letter-spacing: 1px;
  /* text-shadow: 1px 1px 0 var(--8bit-deep-pink); */
  margin: 1rem;
  line-height: 1.6;
}

.hearts-section {
  display: flex;
  min-width: 200px;
}

.info-panel {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
  /* background: linear-gradient(135deg, rgba(255, 215, 229, 0.1) 0%, rgba(255, 105, 180, 0.05) 100%); */
  /* border: 4px solid var(--8bit-hot-pink); */
  border: 4px solid var(--8bit-light-pink);
  padding: 1.5rem;
  /* box-shadow: 4px 4px 0 rgba(255, 20, 147, 0.2); */
  overflow-y: auto;
}

.slide-header {
  /* border-bottom: 3px solid var(--8bit-gold); */
  border-bottom: 3px solid var(--dull-color);
  padding-bottom: 1rem;
}

.slide-title {
  /* color: var(--8bit-gold); */
  /* color: var(--white-color); */
  color: var(--8bit-light-pink);
  font-family: 'Press Start 2P', monospace;
  font-size: 1.1rem;
  text-transform: uppercase;
  /* text-shadow: 2px 2px 0 var(--8bit-deep-pink); */
  margin: 0;
  line-height: 1.3;
  font-weight: 600;
  letter-spacing: 2px;
}

.slide-content {
  /* color: var(--8bit-hot-pink); */
  color: var(--8bit-light-pink);
  font-family: 'Press Start 2P', monospace;
  font-size: 0.8rem;
  /* text-transform: uppercase; */
  letter-spacing: 0.5px;
  /* text-shadow: 1px 1px 0 var(--8bit-deep-pink); */
  line-height: 1.6;
  flex: 1;
  overflow-y: auto;
  padding-right: 0.5rem;
  font-weight: 600;
  white-space: pre-wrap;
}

.slide-controls {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1rem;
  padding-top: 1rem;
  /* border-top: 3px solid var(--8bit-gold); */
  border-top: 3px solid var(--dull-color);
}

.control-btn {
  flex: 0 0 auto;
  /* background: var(--8bit-deep-pink); */
  background: var(--dull-color);
  /* border: 3px solid var(--8bit-gold); */
  border: 3px solid var(--8bit-light-pink);
  /* color: var(--8bit-gold); */
  color: var(--8bit-light-pink);
  font-family: 'Press Start 2P', monospace;
  font-size: 2rem;
  text-transform: uppercase;
  letter-spacing: 1px;
  transition: all 0.1s ease;
  /* text-shadow: 1px 1px 0 #000; */
  /* box-shadow: 2px 2px 0 rgba(0, 0, 0, 0.3); */
  padding: 0.4rem 0.8rem;
}

.slide-indicators {
  display: flex;
  gap: 0.5rem;
  justify-content: center;
}

.indicator {
  width: 12px;
  height: 12px;
  /* border: 2px solid var(--8bit-hot-pink); */
  border: 2px solid var(--8bit-light-pink);
  /* background: transparent; */
  background: var(--dull-color);
  cursor: pointer;
  transition: all 0.1s ease;
}

.indicator.active {
  /* background: var(--8bit-gold);
  box-shadow: 0 0 8px var(--8bit-gold); */
  background: var(--8bit-light-pink);
}

/* Responsive */
@media (max-width: 768px) {
  .main-content {
    flex-direction: column;
    gap: 1.5rem;
    padding: 1.5rem 1rem;
  }

  .info-panel {
    flex: 1;
    min-height: 250px;
  }
}

@media (min-width: 769px) {
  .centered-title {
    font-size: 3rem;
  }
}

@media (min-width: 1024px) {
  .centered-title {
    font-size: 4rem;
    letter-spacing: 3px;
  }

  .main-content {
    gap: 3rem;
    padding: 3rem;
  }

  .slide-title {
    font-size: 1.2rem;
  }

  .slide-content {
    font-size: 0.75rem;
  }
}
</style>
