<script setup lang="ts">
import { ref, computed, onMounted, watch } from 'vue'

const words = ref<string[]>([
  'EXPLORING',
  'SLOWLY',
  'SEAFOOD',
  'VIBRATORS',
  'KIEHLS',
  'YELLOW',
  'LEGO',
  'BUSY',
  'BENJI',
  'TEAM',
  'PRAGUE',
  'SEGOVIA',
  'TEDDY',
  'KRTEK',
  'CLEAN'
])

const hints = ref<string[]>([
  'a) Phase which means: "open to try new things" (not women everywhere)',
  'b) Application used to share ideas; be them chaotically or oppresively structured',
  'c) Where the sea monsters can be found',
  'd) Things you\'ll easily find in Rossman but not in Amazon',
  'e) This brand means youth',
  'f) Color of my favourite hoodie',
  'g) Our shared hobbie, and what made possible that everything started',
  'h) I\'m not messy, I\'m...',
  'i) Name of the real star of the yoga sessions',
  'j) We are such a great...',
  'k) Place where everything started',
  'l) Place where everything happened',
  'm) The name of my future dog',
  'n) Known for making trousers out of nowhere, stealing money, lying next to naked men and prying on fetish books',
  'o) ..., safe and discrete'
])

const wordsChars = computed(() => words.value.map((w) => w.split('')))
const inputsPerWord = ref<string[][]>(words.value.map((w) => w.split('').map(() => '')))

// Local storage persistence
const STORAGE_KEY = 'quest_inputs_v1'

function saveToLocalStorage() {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(inputsPerWord.value))
  } catch {
    // ignore storage errors (e.g., quota, private mode)
    // console.warn('Could not save quest inputs', err)
  }
}

function loadFromLocalStorage() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return
    const parsed = JSON.parse(raw)
    if (!Array.isArray(parsed)) return

    // Rebuild inputsPerWord ensuring shape matches current words
    inputsPerWord.value = words.value.map((w, i) => {
      const savedRow = Array.isArray(parsed[i]) ? parsed[i] : []
      const chars = w.split('')
      return chars.map((_, j) => {
        const v = savedRow[j]
        return typeof v === 'string' && v.length ? String(v).toUpperCase().charAt(0) : ''
      })
    })
  } catch {
    // malformed JSON or other error - ignore and keep defaults
    // console.warn('Could not load quest inputs', err)
  }
}

// Save whenever inputs change
watch(inputsPerWord, () => {
  saveToLocalStorage()
}, { deep: true })

onMounted(() => {
  loadFromLocalStorage()
})

function handleKeydown(e: KeyboardEvent, wordIdx: number, charIdx: number) {
  const key = e.key
  const target = e.target as HTMLInputElement

  if (key.length === 1 && /^[a-zA-Z0-9]$/.test(key)) {
    e.preventDefault()
    const value = key.toUpperCase()
    inputsPerWord.value[wordIdx][charIdx] = value

    // Find all letter inputs and get current position
    const allInputs = Array.from(document.querySelectorAll('input.letter-input'))
    const currentIndex = allInputs.findIndex(input => 
      input.getAttribute('data-word') === wordIdx.toString() && 
      input.getAttribute('data-index') === charIdx.toString()
    )
    
    // Move to next input if available
    if (currentIndex < allInputs.length - 1) {
      (allInputs[currentIndex + 1] as HTMLInputElement).focus()
    }
  } else if (key === 'Backspace') {
    if (target.value) {
      return // Let default backspace behavior work
    }

    e.preventDefault()
    
    // Find all letter inputs and get current position
    const allInputs = Array.from(document.querySelectorAll('input.letter-input'))
    const currentIndex = allInputs.findIndex(input => 
      input.getAttribute('data-word') === wordIdx.toString() && 
      input.getAttribute('data-index') === charIdx.toString()
    )
    
    // Move to previous input if available and clear it
    if (currentIndex > 0) {
      const prevInput = allInputs[currentIndex - 1] as HTMLInputElement
      const prevWordIdx = parseInt(prevInput.getAttribute('data-word') || '0')
      const prevCharIdx = parseInt(prevInput.getAttribute('data-index') || '0')
      
      inputsPerWord.value[prevWordIdx][prevCharIdx] = ''
      prevInput.focus()
    }
  }
}

function isWordComplete(wordIdx: number) {
  return inputsPerWord.value[wordIdx].join('') === words.value[wordIdx]
}
</script>

<template>
  <div class="quest-page">
    <h1 class="page-title">Crosswords Quest</h1>
    <div class="rows">
      <template v-for="(word, wi) in words" :key="wi">
        <div class="word-row">
          <div class="row-hint">{{ hints[wi] }}</div>
          <div class="row-squares">
            <template v-for="(ch, ci) in wordsChars[wi]" :key="ci">
              <div v-if="ch === ' '" class="spacer" />
              <div v-else class="square">
                <div class="index">{{ ci + 1 }}</div>
                <input
                  type="text"
                  class="letter-input"
                  :data-word="wi"
                  :data-index="ci"
                  maxlength="1"
                  v-model="inputsPerWord[wi][ci]"
                  @keydown="(e) => handleKeydown(e, wi, ci)"
                />
              </div>
            </template>
            <div class="square check-square">
              <div class="check-box">
                <span v-show="isWordComplete(wi)" class="complete">✓</span>
              </div>
            </div>
          </div>
        </div>
      </template>
    </div>
  </div>
</template>

<style scoped>
.quest-page {
  padding: 1rem;
}

.page-title {
  margin-bottom: 2rem;
  color: var(--sl-color-neutral-900);
  font-size: 2rem;
  text-align: center;
}

.rows {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.word-row {
  position: relative;
  display: flex;
  align-items: center;
  gap: 2rem;
}

.row-hint {
  width: 300px;
  color: var(--sl-color-neutral-700);
  text-align: right;
  padding-right: 2rem;
  flex-shrink: 0;
}

.row-squares {
  display: grid;
  grid-template-columns: repeat(9, 56px) 56px;
  gap: 0.25rem;
  width: fit-content;
}

.square {
  width: 56px;
  display: flex;
  flex-direction: column;
  align-items: center;
  flex: 0 0 auto;
}

.square .index {
  font-size: 0.65rem;
  color: var(--sl-color-neutral-600);
  margin-bottom: 0.15rem;
}

.letter-input {
  width: 52px;
  height: 52px;
  text-align: center;
  font-size: 1.2rem;
  text-transform: uppercase;
  border: 2px solid var(--sl-color-neutral-300);
  border-radius: 4px;
  background: white;
  color: var(--sl-color-neutral-900);
  padding: 0;
}

.letter-input:focus {
  outline: none;
  border-color: var(--sl-color-primary-500);
  box-shadow: 0 0 0 2px var(--sl-color-primary-100);
}

.spacer {
  width: 100%;
}

.check-square {
  display: flex;
  align-items: center;
  justify-content: center;
}

.check-box {
  width: 52px;
  height: 52px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: transparent;
}

.complete {
  color: var(--sl-color-success-600);
  font-size: 1.2rem;
}
</style>