<script setup lang="ts">
import { ref, computed, onMounted, watch, onUnmounted } from 'vue';

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
  'CLEAN',
]);

const hints = ref<string[]>([
  'a) Phase which means: "open to try new things" (not women everywhere)',
  'b) Application used to share ideas; be them chaotically or oppresively structured',
  'c) Where the sea monsters can be found',
  "d) Things you'll easily find in Rossman but not in Amazon",
  'e) This brand means youth',
  'f) Color of my favourite hoodie',
  'g) Our shared hobbie, and what made possible that everything started',
  "h) I'm not messy, I'm...",
  'i) Name of the real star of the yoga sessions',
  'j) We are such a great...',
  'k) Place where everything started',
  'l) Place where everything happened',
  'm) The name of my future dog',
  'n) Known for making trousers out of nowhere, stealing money, lying next to naked men and prying on fetish books',
  'o) ..., safe and discrete',
]);

const wordsChars = computed(() => words.value.map((w) => w.split('')));
const inputsPerWord = ref<string[][]>(words.value.map((w) => w.split('').map(() => '')));

// Local storage persistence
const STORAGE_KEY = 'quest_inputs_v1';

function saveToLocalStorage() {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(inputsPerWord.value));
  } catch {
    // ignore storage errors (e.g., quota, private mode)
    // console.warn('Could not save quest inputs', err)
  }
}

function loadFromLocalStorage() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return;
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return;

    // Rebuild inputsPerWord ensuring shape matches current words
    inputsPerWord.value = words.value.map((w, i) => {
      const savedRow = Array.isArray(parsed[i]) ? parsed[i] : [];
      const chars = w.split('');
      return chars.map((_, j) => {
        const v = savedRow[j];
        return typeof v === 'string' && v.length ? String(v).toUpperCase().charAt(0) : '';
      });
    });
  } catch {
    // malformed JSON or other error - ignore and keep defaults
    // console.warn('Could not load quest inputs', err)
  }
}

// Save whenever inputs change
watch(
  inputsPerWord,
  () => {
    saveToLocalStorage();
  },
  { deep: true },
);

onMounted(() => {
  loadFromLocalStorage();
});

// Show dialog when everything is complete
const allComplete = computed(() => {
  return words.value.every((w, i) => {
    const row = inputsPerWord.value[i];
    return Array.isArray(row) && row.join('') === w;
  });
});

const showDialog = ref(false);

watch(allComplete, (val) => {
  if (val) showDialog.value = true;
});

function closeDialog() {
  showDialog.value = false;
}

function resetProgress() {
  // reset inputs and clear storage
  inputsPerWord.value = words.value.map((w) => w.split('').map(() => ''));
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch {}
  showDialog.value = false;
}

// Numeric code input inside completion dialog
const SECRET_CODE = '180625'; // change this to the code you want
const codeInput = ref('');
const codeError = ref('');
const codeSuccess = ref(false);
// Compute input width based on secret code length (1-based). Ensures a comfortable minimum.
const codeInputWidth = computed(() => {
  const len = Math.max(1, String(SECRET_CODE).length);
  const px = Math.max(200, len * 40); // 40px per digit, min 200px
  return `${px}px`;
});

// Configure which box (char index) to highlight for each word when the code is correct.
// Positions are 1-based (start counting at 1). Use `null` for words that shouldn't contribute.
// Length should match `words.value.length`.
const HIGHLIGHT_POSITIONS: (number | null)[] = [7, 2, 5, 1, 3, 1, 4, 2, 4, 3, 4, 4, 3, 1, 4];

function submitCode() {
  // sanitize: keep digits only
  const digits = String(codeInput.value).replace(/\D/g, '');
  if (digits.length === 0) {
    codeError.value = 'Please enter the numeric code.';
    codeSuccess.value = false;
    return;
  }
  if (digits === SECRET_CODE) {
    codeError.value = '';
    codeSuccess.value = true;
  } else {
    codeError.value = 'Code incorrect. Try again.';
    codeSuccess.value = false;
  }
}

function handleCodeInput(e: Event) {
  const el = e.target as HTMLInputElement;
  const digits = String(el.value || '').replace(/\D/g, '');
  codeInput.value = digits;
  // clear any previous error when the user types new input
  codeError.value = '';
}

// Debounced auto-submit when the entered digits reach the secret length
const DEBOUNCE_MS = 150;
const AUTO_CLOSE_MS = 500;
let debounceTimer: ReturnType<typeof setTimeout> | null = null;
let closeTimer: ReturnType<typeof setTimeout> | null = null;

watch(codeInput, (val) => {
  const digits = String(val || '');
  // clear existing debounce timer
  if (debounceTimer) {
    clearTimeout(debounceTimer);
    debounceTimer = null;
  }

  if (digits.length === String(SECRET_CODE).length) {
    // debounce submit to allow quick edits/pastes to settle
    debounceTimer = setTimeout(() => {
      submitCode();
      debounceTimer = null;
    }, DEBOUNCE_MS);
  }
});

// Auto-close dialog shortly after successful code entry
watch(codeSuccess, (val) => {
  if (closeTimer) {
    clearTimeout(closeTimer);
    closeTimer = null;
  }
  if (val) {
    closeTimer = setTimeout(() => {
      closeDialog();
      closeTimer = null;
    }, AUTO_CLOSE_MS);
  }
});

onUnmounted(() => {
  if (debounceTimer) {
    clearTimeout(debounceTimer);
    debounceTimer = null;
  }
  if (closeTimer) {
    clearTimeout(closeTimer);
    closeTimer = null;
  }
});

// Helper to decide if a given square should be highlighted
// HIGHLIGHT_POSITIONS entries are 1-based so convert to 0-based here
function isHighlighted(wordIdx: number, charIdx: number) {
  if (!codeSuccess.value) return false;
  const posOneBased = HIGHLIGHT_POSITIONS[wordIdx];
  if (posOneBased == null) return false;
  const pos = Number(posOneBased) - 1;
  if (!Number.isInteger(pos) || pos < 0) return false;
  return pos === charIdx;
}

function handleKeydown(e: KeyboardEvent, wordIdx: number, charIdx: number) {
  const key = e.key;
  const target = e.target as HTMLInputElement;

  if (key.length === 1 && /^[a-zA-Z0-9]$/.test(key)) {
    e.preventDefault();
    const value = key.toUpperCase();
    inputsPerWord.value[wordIdx][charIdx] = value;

    // Find all letter inputs and get current position
    const allInputs = Array.from(document.querySelectorAll('input.letter-input'));
    const currentIndex = allInputs.findIndex(
      (input) =>
        input.getAttribute('data-word') === wordIdx.toString() &&
        input.getAttribute('data-index') === charIdx.toString(),
    );

    // Move to next input if available
    if (currentIndex < allInputs.length - 1) {
      (allInputs[currentIndex + 1] as HTMLInputElement).focus();
    }
  } else if (key === 'Backspace') {
    if (target.value) {
      return; // Let default backspace behavior work
    }

    e.preventDefault();

    // Find all letter inputs and get current position
    const allInputs = Array.from(document.querySelectorAll('input.letter-input'));
    const currentIndex = allInputs.findIndex(
      (input) =>
        input.getAttribute('data-word') === wordIdx.toString() &&
        input.getAttribute('data-index') === charIdx.toString(),
    );

    // Move to previous input if available and clear it
    if (currentIndex > 0) {
      const prevInput = allInputs[currentIndex - 1] as HTMLInputElement;
      const prevWordIdx = parseInt(prevInput.getAttribute('data-word') || '0');
      const prevCharIdx = parseInt(prevInput.getAttribute('data-index') || '0');

      inputsPerWord.value[prevWordIdx][prevCharIdx] = '';
      prevInput.focus();
    }
  }
}

function isWordComplete(wordIdx: number) {
  return inputsPerWord.value[wordIdx].join('') === words.value[wordIdx];
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
              <div v-else :class="['square', { highlighted: isHighlighted(wi, ci) }]">
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
          <!-- Completion modal -->
          <div v-if="showDialog" class="overlay">
            <div class="modal">
              <h2>Well done!</h2>
                  <p>But the quest goes on, there's more to see...</p>
                  <!-- <p>But now there's a code you need to get, and this is where you'll find it:</p> -->
                  <!-- <p><i>Not in plain sight but close at hand, where thoughts are typed the clue will stand.</i></p> -->
              <p><i>
                One last code awaits for you. To find it now,
                don’t miss the sign: it’s hidden under where keys align.
              </i></p>
              <div class="modal-body">
                <div class="code-row">
                  <input
                    id="code"
                    class="code-input"
                    inputmode="numeric"
                    pattern="[0-9]*"
                    :maxlength="SECRET_CODE.length"
                    v-model="codeInput"
                    @keydown.enter.prevent="submitCode"
                    @input="handleCodeInput"
                    placeholder="Enter code"
                    :style="{ width: codeInputWidth }"
                  />
                  <!-- Submit button removed: auto-submit when full or Enter pressed -->
                </div>
                <div class="code-msg">
                  <span v-if="codeError" class="error">{{ codeError }}</span>
                </div>
              </div>
              <div class="modal-actions">
                <button class="btn reset" @click="resetProgress">Reset progress</button>
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

/* modal styles */
.overlay {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.45);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 2000;
}

.modal {
  background: white;
  padding: 1.25rem 1.5rem;
  border-radius: 8px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.25);
  max-width: 420px;
  width: 90%;
  text-align: center;
  position: relative;
}

.modal h2 {
  margin: 0 0 0.5rem 0;
}

.modal p {
  margin: 0 0 1rem 0;
  color: var(--sl-color-neutral-700);
}

.modal-actions {
  display: flex;
  gap: 0.5rem;
  justify-content: center;
}
.modal .btn {
  padding: 0.5rem 0.75rem;
  border-radius: 6px;
  border: none;
  cursor: pointer;
}
.modal .btn.reset {
  background: #f3f4f6;
  color: #111827;
}
.modal .btn.close {
  background: var(--sl-color-primary-600);
  color: white;
}

.code-label {
  display: block;
  font-size: 0.9rem;
  margin-bottom: 0.5rem;
  color: var(--sl-color-neutral-700);
}
.code-row {
  display: flex;
  gap: 0.5rem;
  align-items: center;
  justify-content: center;
  margin-bottom: 0.5rem;
}
.code-input {
  width: 160px;
  padding: 0.5rem 0.6rem;
  font-size: 1rem;
  text-align: center;
  border: 2px solid var(--sl-color-neutral-300);
  border-radius: 6px;
}
.modal .btn.submit {
  background: var(--sl-color-primary-600);
  color: white;
}
.code-msg {
  min-height: 1.25rem;
}
.code-msg .error {
  color: #dc2626;
}
.code-msg .success {
  color: #16a34a;
}
.final-word {
  margin-top: 0.5rem;
  color: var(--sl-color-neutral-900);
}

/* highlighted square */
.square.highlighted .letter-input {
  background: linear-gradient(180deg, #fff6e6, #fff2dc);
  border-color: var(--sl-color-primary-600);
  box-shadow: 0 4px 12px rgba(99, 102, 241, 0.12);
}
.square.highlighted .index {
  color: var(--sl-color-primary-600);
}


</style>
