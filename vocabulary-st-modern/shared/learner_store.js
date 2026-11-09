/**
 * LEARNER STORE & ADAPTIVE PEDAGOGICAL ENGINE
 * Offline-first, GDPR-compliant per-browser storage for:
 * - Algorithmic Spaced Scheduling (Criterion 4.2 - Leitner Boxes 1-4)
 * - Recognition-to-Recall Fading (Criterion 1.3 - Stage 0/1/2)
 * - Calibrated Input / Mastery Badging (Criterion 1.1)
 * - Modality & Accessibility Preferences (Criterion 3.1)
 */

(function (root, factory) {
  if (typeof module === 'object' && module.exports) {
    module.exports = factory();
  } else {
    root.LearnerStore = factory();
  }
})(typeof self !== 'undefined' ? self : this, function () {
  'use strict';

  const STORAGE_KEY = 'g6_learner_store_v1';
  const DAY_MS = 24 * 60 * 60 * 1000;
  const BOX_INTERVALS = [0, 1 * DAY_MS, 3 * DAY_MS, 7 * DAY_MS, 14 * DAY_MS];

  const defaultState = {
    words: {},
    reviewQueue: {},
    a11y: {
      fontSize: 'normal',   // 'normal', 'large', 'xl'
      spacing: 'normal',    // 'normal', 'wide' (dyslexia-friendly)
      contrast: 'normal',   // 'normal', 'high'
      audioMode: 'audio'    // 'audio', 'readonly'
    },
    skills: {
      reading: 0,
      listening: 0,
      grammar: 0,
      writing: 0,
      vocabulary: 0
    }
  };

  function loadState() {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (!raw) return JSON.parse(JSON.stringify(defaultState));
      const parsed = JSON.parse(raw);
      return Object.assign({}, defaultState, parsed, {
        words: parsed.words || {},
        reviewQueue: parsed.reviewQueue || {},
        a11y: Object.assign({}, defaultState.a11y, parsed.a11y),
        skills: Object.assign({}, defaultState.skills, parsed.skills)
      });
    } catch (e) {
      console.warn('[LearnerStore] Storage access error, using in-memory default:', e);
      return JSON.parse(JSON.stringify(defaultState));
    }
  }

  function saveState(state) {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    } catch (e) {
      console.warn('[LearnerStore] Failed to write localStorage:', e);
    }
  }

  const LearnerStore = {
    // -------------------------------------------------------------------------
    // Word Key Helper: "u{unit}_w{id}"
    // -------------------------------------------------------------------------
    key(unitId, wordId) {
      return `u${unitId}_w${wordId}`;
    },

    // -------------------------------------------------------------------------
    // Criterion 1.3: Recognition-to-Recall Fading
    // Level 0: Multiple choice (recognition)
    // Level 1: Gap-fill with first letter shown (guided recall)
    // Level 2: Free typing input (active recall)
    // -------------------------------------------------------------------------
    getWordMastery(unitId, wordId) {
      const state = loadState();
      const item = state.words[this.key(unitId, wordId)];
      if (!item) return { level: 0, streak: 0, attempts: 0, isMastered: false };
      return {
        level: item.level || 0,
        streak: item.streak || 0,
        attempts: item.attempts || 0,
        isMastered: (item.level || 0) >= 2
      };
    },

    // -------------------------------------------------------------------------
    // Record Practice Attempt
    // -------------------------------------------------------------------------
    recordAttempt(unitId, wordId, isCorrect, wordMeta = {}) {
      const state = loadState();
      const k = this.key(unitId, wordId);
      const existing = state.words[k] || {
        unit: Number(unitId),
        id: Number(wordId),
        level: 0,
        streak: 0,
        attempts: 0
      };

      existing.attempts = (existing.attempts || 0) + 1;
      existing.lastSeen = Date.now();

      if (isCorrect) {
        existing.streak = (existing.streak || 0) + 1;
        // Promote level if 2 consecutive correct answers
        if (existing.streak >= 2 && existing.level < 2) {
          existing.level += 1;
        }

        // Spaced Repetition Progression (Criterion 4.2)
        if (state.reviewQueue[k]) {
          const currentBox = state.reviewQueue[k].box || 1;
          if (currentBox >= 4) {
            // Mastered, remove from active queue
            delete state.reviewQueue[k];
          } else {
            const nextBox = currentBox + 1;
            state.reviewQueue[k].box = nextBox;
            state.reviewQueue[k].dueDate = Date.now() + (BOX_INTERVALS[nextBox] || BOX_INTERVALS[4]);
          }
        }
      } else {
        existing.streak = 0;
        // Demote level on mistake
        if (existing.level > 0) existing.level -= 1;

        // Reset to Box 1 in Spaced Review Queue (due today/now)
        state.reviewQueue[k] = {
          unit: Number(unitId),
          id: Number(wordId),
          word: wordMeta.word || (state.reviewQueue[k] && state.reviewQueue[k].word) || '',
          meaning_gr: wordMeta.meaning_gr || (state.reviewQueue[k] && state.reviewQueue[k].meaning_gr) || '',
          box: 1,
          dueDate: Date.now()
        };
      }

      state.words[k] = existing;
      saveState(state);
      return existing;
    },

    // -------------------------------------------------------------------------
    // Criterion 4.2: Algorithmic Spaced Scheduling (Leitner Review Queue)
    // -------------------------------------------------------------------------
    scheduleReview(unitId, wordId, wordMeta = {}, box = 1) {
      const state = loadState();
      const k = this.key(unitId, wordId);
      state.reviewQueue[k] = {
        unit: Number(unitId),
        id: Number(wordId),
        word: wordMeta.word || '',
        meaning_gr: wordMeta.meaning_gr || '',
        box: box,
        dueDate: Date.now() + (BOX_INTERVALS[box] || 0)
      };
      saveState(state);
    },

    getDueReviews(unitId = null) {
      const state = loadState();
      const now = Date.now();
      const due = [];
      Object.keys(state.reviewQueue).forEach(k => {
        const item = state.reviewQueue[k];
        if (item.dueDate <= now) {
          if (unitId === null || Number(item.unit) === Number(unitId)) {
            due.push(item);
          }
        }
      });
      return due;
    },

    getDueCount(unitId = null) {
      return this.getDueReviews(unitId).length;
    },

    // -------------------------------------------------------------------------
    // Criterion 3.1: Modality & Accessibility Settings
    // -------------------------------------------------------------------------
    getA11y() {
      return loadState().a11y;
    },

    saveA11y(settings) {
      const state = loadState();
      state.a11y = Object.assign({}, state.a11y, settings);
      saveState(state);
      this.applyA11y();
    },

    applyA11y() {
      if (typeof document === 'undefined') return;
      const a11y = this.getA11y();
      const rootEl = document.documentElement;

      // Font size
      rootEl.classList.remove('a11y-font-large', 'a11y-font-xl');
      if (a11y.fontSize === 'large') rootEl.classList.add('a11y-font-large');
      if (a11y.fontSize === 'xl') rootEl.classList.add('a11y-font-xl');

      // Dyslexia-friendly spacing
      rootEl.classList.toggle('a11y-spacing-wide', a11y.spacing === 'wide');

      // High contrast
      rootEl.classList.toggle('a11y-high-contrast', a11y.contrast === 'high');

      // Read-only / No audio mode
      rootEl.classList.toggle('a11y-no-audio', a11y.audioMode === 'readonly');
    },

    // -------------------------------------------------------------------------
    // UI Helpers: Accessibility Modal
    // -------------------------------------------------------------------------
    openA11yModal() {
      if (typeof document === 'undefined') return;
      let modal = document.getElementById('a11ySettingsModal');
      if (!modal) {
        modal = document.createElement('div');
        modal.id = 'a11ySettingsModal';
        modal.className = 'a11y-modal-backdrop';
        document.body.appendChild(modal);
      }

      const current = this.getA11y();
      modal.innerHTML = `
        <div class="a11y-modal-card" role="dialog" aria-labelledby="a11yTitle" aria-modal="true">
          <div class="a11y-modal-header">
            <h2 id="a11yTitle">Accessibility &amp; Display Settings</h2>
            <button type="button" class="a11y-close-btn" id="a11yCloseBtn" aria-label="Close settings">✕</button>
          </div>
          <div class="a11y-modal-body">
            <div class="a11y-option-group">
              <label for="a11yFontSizeSelect"><strong>Text Size</strong></label>
              <select id="a11yFontSizeSelect" class="a11y-select">
                <option value="normal"${current.fontSize === 'normal' ? ' selected' : ''}>Standard (Default)</option>
                <option value="large"${current.fontSize === 'large' ? ' selected' : ''}>Large (+20%)</option>
                <option value="xl"${current.fontSize === 'xl' ? ' selected' : ''}>Extra Large (+40%)</option>
              </select>
            </div>

            <div class="a11y-option-group">
              <label for="a11ySpacingSelect"><strong>Reading Spacing</strong></label>
              <select id="a11ySpacingSelect" class="a11y-select">
                <option value="normal"${current.spacing === 'normal' ? ' selected' : ''}>Standard Spacing</option>
                <option value="wide"${current.spacing === 'wide' ? ' selected' : ''}>Wide Spacing (Dyslexia Friendly)</option>
              </select>
            </div>

            <div class="a11y-option-group">
              <label for="a11yContrastSelect"><strong>Contrast</strong></label>
              <select id="a11yContrastSelect" class="a11y-select">
                <option value="normal"${current.contrast === 'normal' ? ' selected' : ''}>Standard Warm Palette</option>
                <option value="high"${current.contrast === 'high' ? ' selected' : ''}>High Contrast (Black / White / Yellow)</option>
              </select>
            </div>

            <div class="a11y-option-group">
              <label for="a11yAudioSelect"><strong>Audio Mode</strong></label>
              <select id="a11yAudioSelect" class="a11y-select">
                <option value="audio"${current.audioMode === 'audio' ? ' selected' : ''}>Sound Enabled (Default)</option>
                <option value="readonly"${current.audioMode === 'readonly' ? ' selected' : ''}>Read-Only / No Audio (Show text captions)</option>
              </select>
            </div>
          </div>
          <div class="a11y-modal-footer">
            <button type="button" class="cta primary small" id="a11ySaveBtn">Save &amp; Apply</button>
          </div>
        </div>
      `;

      modal.style.display = 'flex';

      const close = () => { modal.style.display = 'none'; };
      document.getElementById('a11yCloseBtn').addEventListener('click', close);
      modal.addEventListener('click', (e) => { if (e.target === modal) close(); });

      document.getElementById('a11ySaveBtn').addEventListener('click', () => {
        const fontSize = document.getElementById('a11yFontSizeSelect').value;
        const spacing = document.getElementById('a11ySpacingSelect').value;
        const contrast = document.getElementById('a11yContrastSelect').value;
        const audioMode = document.getElementById('a11yAudioSelect').value;
        this.saveA11y({ fontSize, spacing, contrast, audioMode });
        close();
      });
    },

    // -------------------------------------------------------------------------
    // Init on DOM ready
    // -------------------------------------------------------------------------
    init() {
      if (typeof document !== 'undefined') {
        this.applyA11y();
      }
    }
  };

  LearnerStore.init();
  return LearnerStore;
});
