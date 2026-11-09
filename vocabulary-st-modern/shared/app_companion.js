/**
 * UNIFIED VOCABULARY COMPANION ENGINE - GRADE 6 ENGLISH
 * Shared by Units 1–10 (vocabulary-st-modern/unitN/companion.html)
 * 100% Offline-First · Zero External CDNs · Functional Pedagogy
 *
 * Implements FLL Rubric Standards:
 * - 1.1 Calibrated Input & Mastery Badging (via LearnerStore)
 * - 1.3 Recognition-to-Recall Fading (Level 0 Recognition -> Level 1 Guided Gap-fill -> Level 2 Active Recall)
 * - 3.1 Modality-Decoupled Accessibility Toolbar
 * - 4.2 Spaced Repetition Queue Integration (Leitner Review Filters & Scheduling)
 * - 5.1 Script-Aware Typography (lang="el" for all Greek text)
 */

document.addEventListener('DOMContentLoaded', async () => {
  const body = document.body;
  const unitNum = body.dataset.unit || '1';

  // Helper for loading script dynamically if not yet in DOM
  function loadScript(src) {
    return new Promise(resolve => {
      if (!src) return resolve(false);
      const s = document.createElement('script');
      s.src = src;
      s.onload = () => resolve(true);
      s.onerror = () => resolve(false);
      document.head.appendChild(s);
    });
  }

  if (!window.VOCABULARY_DATA || !Array.isArray(window.VOCABULARY_DATA)) {
    await loadScript(`../../unit${unitNum}/data/vocabulary_data.js`);
  }

  const vocabList = Array.isArray(window.VOCABULARY_DATA) ? window.VOCABULARY_DATA : [];

  // Asset Path Resolver: maps relative assets/* to ../../unit{N}/assets/*
  function resolveAsset(p) {
    if (!p) return p;
    if (typeof p === 'string' && p.startsWith('assets/')) {
      return `../../unit${unitNum}/` + p;
    }
    return p;
  }

  // State
  let currentFilteredList = [...vocabList];
  let activeCategory = 'all';
  let searchTerm = '';
  let playbackRate = 1.0;
  let selectedVoice = 'neural'; // 'neural' or 'standard'

  // Audio state
  let currentAudio = null;
  let currentPlayingBtn = null;
  let currentPlayingRow = null;
  let playAllQueue = [];
  let isPlayAllActive = false;
  let audioTimer = null;

  // Flashcard state
  let currentCardIdx = 0;
  let isCardFlipped = false;

  // Quiz state (Greek translation & Recall Fading)
  let quizQuestion = null;
  let quizScore = 0;
  let quizStreak = 0;
  let quizTotal = 0;

  // Definition Quiz state (English definition matching)
  let defQuizQuestion = null;
  let defQuizScore = 0;
  let defQuizStreak = 0;
  let defQuizTotal = 0;

  // DOM Elements
  const tableBody = document.getElementById('vocabTableBody');
  const searchInput = document.getElementById('searchInput');
  const clearSearchBtn = document.getElementById('clearSearchBtn');
  const categoryPillsContainer = document.getElementById('categoryPills');
  const speedSelect = document.getElementById('speedSelect');
  const voiceSelect = document.getElementById('voiceSelect');
  const a11yBtn = document.getElementById('a11yBtn');

  // HUD Elements
  const audioHud = document.getElementById('audioHud');
  const hudAudioType = document.getElementById('hudAudioType');
  const hudAudioTitle = document.getElementById('hudAudioTitle');
  const hudPauseBtn = document.getElementById('hudPauseBtn');
  const hudStopBtn = document.getElementById('hudStopBtn');

  // Helper function for dynamic audio paths based on selected voice
  function getAudioPath(type, padId) {
    const base = selectedVoice === 'neural' ? `../../unit${unitNum}/assets/audio_neural` : `../../unit${unitNum}/assets/audio`;
    switch (type) {
      case 'word': return `${base}/words/${padId}_word.mp3`;
      case 'def': return `${base}/defs/${padId}_definition.mp3`;
      case 'example': return `${base}/examples/${padId}_example.mp3`;
      default: return `${base}/words/${padId}_word.mp3`;
    }
  }

  // Mode View Panels & Buttons
  const modeButtons = document.querySelectorAll('.mode-btn');
  const viewPanels = {
    table: document.getElementById('viewTable'),
    cards: document.getElementById('viewCards'),
    quiz: document.getElementById('viewQuiz'),
    defQuiz: document.getElementById('viewDefQuiz'),
    printable: document.getElementById('viewPrintable'),
    tts: document.getElementById('viewTTS')
  };

  // Flashcard Elements
  const activeFlashcard = document.getElementById('activeFlashcard');
  const currentCardIndexEl = document.getElementById('currentCardIndex');
  const totalCardsCountEl = document.getElementById('totalCardsCount');
  const cardCategoryEl = document.getElementById('cardCategory');
  const cardVisualEl = document.getElementById('cardVisual');
  const cardWordEl = document.getElementById('cardWord');
  const cardIpaEl = document.getElementById('cardIpa');
  const cardPosEl = document.getElementById('cardPos');
  const cardMeaningGrEl = document.getElementById('cardMeaningGr');
  const cardDefEnEl = document.getElementById('cardDefEn');
  const cardExampleEl = document.getElementById('cardExample');
  const cardPlayWordBtn = document.getElementById('cardPlayWordBtn');
  const cardPlayDefBtn = document.getElementById('cardPlayDefBtn');
  const cardPlayExBtn = document.getElementById('cardPlayExBtn');
  const prevCardBtn = document.getElementById('prevCardBtn');
  const nextCardBtn = document.getElementById('nextCardBtn');
  const shuffleCardsBtn = document.getElementById('shuffleCardsBtn');

  // Greek Listening & Fading Quiz Elements
  const quizScoreEl = document.getElementById('quizScore');
  const quizTotalEl = document.getElementById('quizTotal');
  const quizStreakEl = document.getElementById('quizStreak');
  const quizPlayPromptBtn = document.getElementById('quizPlayPromptBtn');
  const quizClueEl = document.getElementById('quizClue');
  const quizOptionsGrid = document.getElementById('quizOptionsGrid');
  const quizFeedback = document.getElementById('quizFeedback');
  const feedbackIcon = document.getElementById('feedbackIcon');
  const feedbackText = document.getElementById('feedbackText');
  const nextQuestionBtn = document.getElementById('nextQuestionBtn');
  const restartQuizBtn = document.getElementById('restartQuizBtn');

  // Definition Challenge Elements
  const defQuizScoreEl = document.getElementById('defQuizScore');
  const defQuizTotalEl = document.getElementById('defQuizTotal');
  const defQuizStreakEl = document.getElementById('defQuizStreak');
  const defQuizPlayPromptBtn = document.getElementById('defQuizPlayPromptBtn');
  const defQuizClueEl = document.getElementById('defQuizClue');
  const defQuizOptionsGrid = document.getElementById('defQuizOptionsGrid');
  const defQuizFeedback = document.getElementById('defQuizFeedback');
  const defFeedbackIcon = document.getElementById('defFeedbackIcon');
  const defFeedbackText = document.getElementById('defFeedbackText');
  const defNextQuestionBtn = document.getElementById('defNextQuestionBtn');
  const restartDefQuizBtn = document.getElementById('restartDefQuizBtn');

  // Printable Study Sheet Elements
  const printPageBtn = document.getElementById('printPageBtn');
  const printableWordsList = document.getElementById('printableWordsList');

  // TTS Export Elements
  const ttsScriptPreview = document.getElementById('ttsScriptPreview');
  const copyTtsBtn = document.getElementById('copyTtsBtn');
  const downloadJsonBtn = document.getElementById('downloadJsonBtn');

  // Modal Elements
  const wordModal = document.getElementById('wordModal');
  const modalBody = document.getElementById('modalBody');
  const closeModalBtn = document.getElementById('closeModalBtn');

  // ==========================================
  // 1. INITIALIZATION & DATA RENDERING
  // ==========================================

  function init() {
    setupCategories();
    renderTable();
    setupEventListeners();
    loadTtsScript();
    initFlashcards();
    initQuiz();
    initDefQuiz();
    initPrintableSheet();

    // Update count stats in header if elements exist
    const totalWordsCountEl = document.getElementById('totalWordsCount');
    if (totalWordsCountEl) totalWordsCountEl.textContent = vocabList.length;
    const audioCountEl = document.getElementById('audioCount');
    if (audioCountEl) audioCountEl.textContent = vocabList.length * 6;
  }

  // Populate category filter buttons with word counts & Leitner Spaced Review Filter
  function setupCategories() {
    if (!categoryPillsContainer) return;
    const counts = { all: vocabList.length };
    vocabList.forEach(item => {
      counts[item.category] = (counts[item.category] || 0) + 1;
    });

    const dueCount = (typeof LearnerStore !== 'undefined' && LearnerStore.getDueCount)
      ? LearnerStore.getDueCount(unitNum)
      : 0;

    let html = `<button class="pill-btn ${activeCategory === 'all' ? 'active' : ''}" data-category="all">All Words (${vocabList.length})</button>`;

    if (dueCount > 0) {
      html += `<button class="pill-btn ${activeCategory === 'due' ? 'active' : ''}" data-category="due" style="border-color: #EA580C; color: #EA580C; font-weight: 800;">⏰ Due for Review (${dueCount})</button>`;
    }

    Object.keys(counts).forEach(cat => {
      if (cat !== 'all') {
        html += `<button class="pill-btn ${activeCategory === cat ? 'active' : ''}" data-category="${cat}">${cat} (${counts[cat]})</button>`;
      }
    });
    categoryPillsContainer.innerHTML = html;

    // Attach click events
    categoryPillsContainer.querySelectorAll('.pill-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        categoryPillsContainer.querySelectorAll('.pill-btn').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        activeCategory = btn.dataset.category;
        filterVocabulary();
      });
    });
  }

  // Highlight target word in example sentence
  function highlightExample(sentence, word) {
    if (!sentence || !word) return sentence;
    const cleanWord = word.split(' ')[0].replace(/[^a-zA-Z]/g, '');
    const regex = new RegExp(`(\\b${cleanWord}[a-z]*\\b)`, 'gi');
    return sentence.replace(regex, '<span class="example-target-word">$1</span>');
  }

  // Render the textbook companion table
  function renderTable() {
    if (!tableBody) return;
    tableBody.innerHTML = '';

    if (currentFilteredList.length === 0) {
      tableBody.innerHTML = `
        <tr>
          <td colspan="4" style="text-align: center; padding: 40px; color: var(--text-light, #64748B);">
            <div style="font-size: 2rem; margin-bottom: 8px;">🔍</div>
            <strong>No matching vocabulary items found</strong>
            <p style="font-size: 0.88rem; margin-top: 4px;">Try searching for another word or reset filters.</p>
          </td>
        </tr>`;
      return;
    }

    currentFilteredList.forEach((item) => {
      const padId = String(item.id).padStart(2, '0');
      const safeName = item.word.toLowerCase().replace(/[^a-z0-9]/g, '_');
      const svgPath = `../../unit${unitNum}/assets/images/${padId}_${safeName}.svg`;
      const wordMp3 = getAudioPath('word', padId);
      const defMp3 = getAudioPath('def', padId);
      const exMp3 = getAudioPath('example', padId);

      const tr = document.createElement('tr');
      tr.id = `row-${item.id}`;
      tr.dataset.id = item.id;

      tr.innerHTML = `
        <!-- Column 1: Word -->
        <td class="col-word">
          <div class="word-cell">
            <span class="row-index">${item.id}</span>
            <div class="word-main-wrap">
              <div class="word-line">
                <span class="word-headword" title="Click for details" data-action="modal" data-id="${item.id}">${item.word}</span>
                <span class="word-ipa">${item.ipa}</span>
                <span class="word-pos">${item.pos}</span>
                <button class="audio-btn" data-audio="${wordMp3}" data-type="Word" data-title="${item.word}" title="Listen to pronunciation">🔊</button>
              </div>
              <div class="word-derivatives">${item.der}</div>
            </div>
            <div class="word-visual-badge" data-action="modal" data-id="${item.id}" title="${item.word}">
              ${item.image ? `<img src="${resolveAsset(item.image)}" alt="${item.image_alt || item.word}" class="badge-thumb-img" />` : `<img src="${svgPath}" alt="${item.word}" class="badge-thumb-img" onerror="this.onerror=null; this.replaceWith(document.createTextNode('${item.emoji || '📖'}'))" />`}
            </div>
          </div>
        </td>

        <!-- Column 2: Meaning -->
        <td class="col-meaning">
          <div class="meaning-cell">
            <span class="meaning-greek" lang="el">${item.meaning_gr}</span>
            <span class="meaning-en">${item.definition_en}</span>
            <button class="audio-btn" data-audio="${defMp3}" data-type="Definition" data-title="${item.word} (Definition)" title="Listen to English definition">🔊</button>
          </div>
        </td>

        <!-- Column 3: Example -->
        <td class="col-example">
          <div class="example-cell">
            ${highlightExample(item.example, item.word)}
            <button class="audio-btn" data-audio="${exMp3}" data-type="Example" data-title="${item.word} (Example)" title="Listen to example sentence">🔊</button>
          </div>
        </td>

        <!-- Column 4: Play All -->
        <td class="col-actions">
          <button class="play-all-btn" data-id="${item.id}" data-title="${item.word} (Complete Entry)" title="Play Word, Definition, and Example">
            ▶ Play All
          </button>
        </td>
      `;

      tableBody.appendChild(tr);
    });

    attachTableActionEvents();
  }

  // Filter Vocabulary list by Search, Category, and Due Spaced Reviews
  function filterVocabulary() {
    const dueReviews = (typeof LearnerStore !== 'undefined' && LearnerStore.getDueReviews)
      ? LearnerStore.getDueReviews(unitNum)
      : [];
    const dueIdSet = new Set(dueReviews.map(r => Number(r.id)));

    currentFilteredList = vocabList.filter(item => {
      let matchesCategory = true;
      if (activeCategory === 'all') {
        matchesCategory = true;
      } else if (activeCategory === 'due') {
        matchesCategory = dueIdSet.has(Number(item.id));
      } else {
        matchesCategory = item.category === activeCategory;
      }

      const query = searchTerm.toLowerCase().trim();
      const matchesSearch = !query ||
        item.word.toLowerCase().includes(query) ||
        item.meaning_gr.toLowerCase().includes(query) ||
        item.definition_en.toLowerCase().includes(query) ||
        item.example.toLowerCase().includes(query) ||
        item.der.toLowerCase().includes(query);

      return matchesCategory && matchesSearch;
    });

    renderTable();
    if (viewPanels.cards && viewPanels.cards.classList.contains('active')) {
      currentCardIdx = 0;
      updateFlashcardView();
    }
  }

  // ==========================================
  // 2. AUDIO ENGINE & PLAYBACK
  // ==========================================

  function stopCurrentAudio() {
    if (audioTimer) {
      clearTimeout(audioTimer);
      audioTimer = null;
    }
    playAllQueue = [];
    isPlayAllActive = false;

    if (currentAudio) {
      currentAudio.onended = null;
      currentAudio.onerror = null;
      currentAudio.pause();
      currentAudio.currentTime = 0;
      currentAudio = null;
    }

    if (window.speechSynthesis) {
      window.speechSynthesis.cancel();
    }

    clearPlayingVisuals();
    if (audioHud) audioHud.style.display = 'none';
    if (hudPauseBtn) hudPauseBtn.textContent = '⏸';
  }

  function clearPlayingVisuals() {
    if (currentPlayingBtn) {
      currentPlayingBtn.classList.remove('playing');
      currentPlayingBtn = null;
    }
    if (currentPlayingRow) {
      currentPlayingRow.classList.remove('is-playing');
      currentPlayingRow = null;
    }
  }

  function playSequence(entries, triggerBtn, targetRow, onComplete) {
    if (triggerBtn && triggerBtn.classList.contains('playing')) {
      stopCurrentAudio();
      return;
    }

    stopCurrentAudio();

    const queue = (Array.isArray(entries) ? entries : [entries]).filter(e => e && (e.src || e.fallbackText));
    if (!queue.length) return;

    playAllQueue = queue.slice();
    isPlayAllActive = playAllQueue.length > 1;

    if (triggerBtn) {
      currentPlayingBtn = triggerBtn;
      currentPlayingBtn.classList.add('playing');
    }
    if (targetRow) {
      currentPlayingRow = targetRow;
      currentPlayingRow.classList.add('is-playing');
    }

    const playNext = () => {
      if (!playAllQueue.length) {
        stopCurrentAudio();
        if (onComplete) onComplete();
        return;
      }

      const entry = playAllQueue.shift();

      if (audioHud) audioHud.style.display = 'block';
      if (hudAudioType) hudAudioType.textContent = entry.type || 'Audio';
      if (hudAudioTitle) hudAudioTitle.textContent = entry.title || 'Playback';
      if (hudPauseBtn) hudPauseBtn.textContent = '⏸';

      currentAudio = new Audio(entry.src);
      currentAudio.playbackRate = playbackRate;

      const advance = () => {
        if (playAllQueue.length) {
          audioTimer = setTimeout(playNext, 350);
        } else {
          stopCurrentAudio();
          if (onComplete) onComplete();
        }
      };

      currentAudio.onended = () => {
        if (currentAudio) {
          currentAudio.onended = null;
          currentAudio.onerror = null;
        }
        advance();
      };

      currentAudio.onerror = (e) => {
        console.warn('Audio play error:', entry.src, e);
        if (currentAudio) {
          currentAudio.onended = null;
          currentAudio.onerror = null;
        }
        advance();
      };

      currentAudio.play().catch(err => {
        console.warn('Audio play() rejected:', err);
        if (currentAudio) {
          currentAudio.onended = null;
          currentAudio.onerror = null;
        }
        advance();
      });
    };

    playNext();
  }

  function playAudioFile(audioSrc, typeLabel, titleLabel, triggerBtn, targetRow, onComplete) {
    playSequence([{
      src: audioSrc,
      type: typeLabel,
      title: titleLabel,
      fallbackText: titleLabel
    }], triggerBtn, targetRow, onComplete);
  }

  function playAllSequence(item, rowEl, btnEl) {
    const padId = String(item.id).padStart(2, '0');
    playSequence([
      {
        src: getAudioPath('word', padId),
        type: 'Complete Entry',
        title: item.word,
        fallbackText: item.word
      },
      {
        src: getAudioPath('def', padId),
        type: 'Complete Entry',
        title: item.word,
        fallbackText: item.definition_en
      },
      {
        src: getAudioPath('example', padId),
        type: 'Complete Entry',
        title: item.word,
        fallbackText: item.example
      }
    ], btnEl, rowEl);
  }

  function attachTableActionEvents() {
    tableBody.querySelectorAll('.audio-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        const src = btn.dataset.audio;
        const type = btn.dataset.type;
        const title = btn.dataset.title;
        const row = btn.closest('tr');
        playAudioFile(src, type, title, btn, row);
      });
    });

    tableBody.querySelectorAll('.play-all-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        const id = parseInt(btn.dataset.id, 10);
        const item = vocabList.find(v => v.id === id);
        const row = btn.closest('tr');
        if (item) {
          playAllSequence(item, row, btn);
        }
      });
    });

    tableBody.querySelectorAll('[data-action="modal"]').forEach(el => {
      el.addEventListener('click', () => {
        const id = parseInt(el.dataset.id, 10);
        openWordModal(id);
      });
    });
  }

  // ==========================================
  // 3. FLASHCARDS ENGINE
  // ==========================================

  function initFlashcards() {
    if (!activeFlashcard || !totalCardsCountEl) return;
    totalCardsCountEl.textContent = vocabList.length;
    updateFlashcardView();

    activeFlashcard.addEventListener('click', () => {
      isCardFlipped = !isCardFlipped;
      activeFlashcard.classList.toggle('flipped', isCardFlipped);
    });

    if (prevCardBtn) {
      prevCardBtn.addEventListener('click', () => {
        if (currentFilteredList.length === 0) return;
        currentCardIdx = (currentCardIdx - 1 + currentFilteredList.length) % currentFilteredList.length;
        resetAndShowCard();
      });
    }

    if (nextCardBtn) {
      nextCardBtn.addEventListener('click', () => {
        if (currentFilteredList.length === 0) return;
        currentCardIdx = (currentCardIdx + 1) % currentFilteredList.length;
        resetAndShowCard();
      });
    }

    if (shuffleCardsBtn) {
      shuffleCardsBtn.addEventListener('click', () => {
        currentFilteredList.sort(() => Math.random() - 0.5);
        currentCardIdx = 0;
        resetAndShowCard();
      });
    }

    if (cardPlayWordBtn) {
      cardPlayWordBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        const item = currentFilteredList[currentCardIdx];
        if (!item) return;
        const padId = String(item.id).padStart(2, '0');
        playAudioFile(getAudioPath('word', padId), 'Word Pronunciation', item.word, cardPlayWordBtn);
      });
    }

    if (cardPlayDefBtn) {
      cardPlayDefBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        const item = currentFilteredList[currentCardIdx];
        if (!item) return;
        const padId = String(item.id).padStart(2, '0');
        playAudioFile(getAudioPath('def', padId), 'Definition', `${item.word} (Definition)`, cardPlayDefBtn);
      });
    }

    if (cardPlayExBtn) {
      cardPlayExBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        const item = currentFilteredList[currentCardIdx];
        if (!item) return;
        const padId = String(item.id).padStart(2, '0');
        playAudioFile(getAudioPath('example', padId), 'Example', `${item.word} (Example)`, cardPlayExBtn);
      });
    }

    document.addEventListener('keydown', (e) => {
      if (!viewPanels.cards || !viewPanels.cards.classList.contains('active')) return;
      if (e.code === 'Space') {
        e.preventDefault();
        isCardFlipped = !isCardFlipped;
        activeFlashcard.classList.toggle('flipped', isCardFlipped);
      } else if (e.code === 'ArrowRight' && nextCardBtn) {
        nextCardBtn.click();
      } else if (e.code === 'ArrowLeft' && prevCardBtn) {
        prevCardBtn.click();
      }
    });
  }

  function resetAndShowCard() {
    isCardFlipped = false;
    if (activeFlashcard) activeFlashcard.classList.remove('flipped');
    updateFlashcardView();
  }

  function updateFlashcardView() {
    if (currentFilteredList.length === 0 || !cardWordEl) return;
    const item = currentFilteredList[currentCardIdx];
    if (currentCardIndexEl) currentCardIndexEl.textContent = currentCardIdx + 1;
    if (totalCardsCountEl) totalCardsCountEl.textContent = currentFilteredList.length;

    const padId = String(item.id).padStart(2, '0');
    const safeName = item.word.toLowerCase().replace(/[^a-z0-9]/g, '_');
    const svgPath = `../../unit${unitNum}/assets/images/${padId}_${safeName}.svg`;

    if (cardCategoryEl) cardCategoryEl.textContent = item.category;
    if (cardVisualEl) {
      if (item.image) {
        cardVisualEl.innerHTML = `
          <img src="${resolveAsset(item.image)}" alt="${item.image_alt || item.word}" class="flashcard-visual-img" />
          ${item.image_credit ? `<div class="flashcard-visual-credit">📷 ${item.image_credit}</div>` : ''}
        `;
      } else {
        cardVisualEl.innerHTML = `
          <img src="${svgPath}" alt="${item.word}" class="flashcard-visual-img flashcard-svg-img" onerror="this.onerror=null; this.style.display='none'; this.nextElementSibling.style.display='flex';" />
          <div class="flashcard-emoji-fallback" style="display:none; font-size: 4rem; height: 180px; align-items:center; justify-content:center;">${item.emoji || '📖'}</div>
        `;
      }
    }
    cardWordEl.textContent = item.word;
    if (cardIpaEl) cardIpaEl.textContent = item.ipa;
    if (cardPosEl) cardPosEl.textContent = `${item.pos} • ${item.der}`;
    if (cardMeaningGrEl) {
      cardMeaningGrEl.setAttribute('lang', 'el');
      cardMeaningGrEl.textContent = item.meaning_gr;
    }
    if (cardDefEnEl) cardDefEnEl.textContent = item.definition_en;
    if (cardExampleEl) cardExampleEl.textContent = `"${item.example}"`;
  }

  // ==========================================
  // 4. LISTENING & RECALL FADING ENGINE (Criteria 1.3 & 4.2)
  // Level 0: 4-Option Multiple Choice (Recognition)
  // Level 1: 1st Letter Gap-Fill (Guided Recall)
  // Level 2: Free Typing (Active Recall)
  // ==========================================

  function initQuiz() {
    if (!restartQuizBtn || !nextQuestionBtn || !quizPlayPromptBtn) return;
    restartQuizBtn.addEventListener('click', startQuiz);
    nextQuestionBtn.addEventListener('click', loadQuizQuestion);
    quizPlayPromptBtn.addEventListener('click', playQuizPrompt);
    startQuiz();
  }

  function startQuiz() {
    quizScore = 0;
    quizStreak = 0;
    quizTotal = 0;
    updateQuizHUD();
    loadQuizQuestion();
  }

  function updateQuizHUD() {
    if (quizScoreEl) quizScoreEl.textContent = quizScore;
    if (quizTotalEl) quizTotalEl.textContent = quizTotal;
    if (quizStreakEl) quizStreakEl.textContent = quizStreak > 0 ? `🔥 ${quizStreak}` : `0`;
  }

  function buildFirstLetterClue(word) {
    if (!word) return '';
    return word.split(' ').map(token => {
      if (token.length <= 1) return token;
      return token[0].toUpperCase() + ' ' + token.slice(1).split('').map(c => /[a-zA-Z]/.test(c) ? '_' : c).join(' ');
    }).join('   ');
  }

  function loadQuizQuestion() {
    if (!quizOptionsGrid || !quizFeedback) return;
    quizFeedback.style.display = 'none';
    quizOptionsGrid.innerHTML = '';

    // Pick target word (prioritize due spaced review items if any)
    const dueReviews = (typeof LearnerStore !== 'undefined' && LearnerStore.getDueReviews)
      ? LearnerStore.getDueReviews(unitNum)
      : [];
    let target = null;
    if (dueReviews.length > 0 && Math.random() < 0.6) {
      const pickDue = dueReviews[Math.floor(Math.random() * dueReviews.length)];
      target = vocabList.find(v => Number(v.id) === Number(pickDue.id)) || null;
    }
    if (!target) {
      target = vocabList[Math.floor(Math.random() * vocabList.length)];
    }

    // Determine pedagogical fading stage (Criterion 1.3)
    const mastery = (typeof LearnerStore !== 'undefined' && LearnerStore.getWordMastery)
      ? LearnerStore.getWordMastery(unitNum, target.id)
      : { level: 0, streak: 0 };
    const stage = mastery.level || 0; // 0 = Recognition, 1 = Guided Recall, 2 = Active Recall

    // Pick 3 distractors for Stage 0
    const distractors = [];
    while (distractors.length < 3 && vocabList.length > 3) {
      const rand = vocabList[Math.floor(Math.random() * vocabList.length)];
      if (rand.id !== target.id && !distractors.some(d => d.id === rand.id)) {
        distractors.push(rand);
      }
    }
    const options = [target, ...distractors].sort(() => Math.random() - 0.5);

    quizQuestion = { target, options, stage, answered: false };

    // Update Stage Clue Tag
    const stageNames = ['Level 0: Recognition', 'Level 1: Guided Recall', 'Level 2: Active Recall'];
    const stageBadge = `<span class="quiz-mastery-tag level-${stage}">${stageNames[stage]}</span>`;
    quizClueEl.innerHTML = `Mode: Spoken English Word • ${stageBadge}`;

    if (stage === 0) {
      // Stage 0: Multiple Choice Recognition
      const optionLetters = ['A', 'B', 'C', 'D'];
      options.forEach((opt, idx) => {
        const btn = document.createElement('button');
        btn.className = 'quiz-option-btn';
        btn.dataset.id = opt.id;
        btn.innerHTML = `
          <span class="quiz-option-letter">${optionLetters[idx]}</span>
          <div class="quiz-option-content">
            <div class="quiz-option-greek" lang="el">${opt.meaning_gr}</div>
          </div>
        `;
        btn.addEventListener('click', () => handleQuizRecognitionAnswer(opt, btn));
        quizOptionsGrid.appendChild(btn);
      });
    } else {
      // Stage 1 (Gap-fill) or Stage 2 (Free typing)
      const isGapFill = stage === 1;
      const clueText = isGapFill ? buildFirstLetterClue(target.word) : 'Type the English word:';

      const fadingBox = document.createElement('div');
      fadingBox.className = 'quiz-fading-box';
      fadingBox.innerHTML = `
        <div style="font-size: 1.15rem; font-weight: 700; color: var(--ink, #0F172A); margin-bottom: 8px;">
          Meaning: <span lang="el" style="color: #EA580C;">${target.meaning_gr}</span>
        </div>
        ${isGapFill ? `<div class="quiz-fading-clue" aria-label="First letter clue">${clueText}</div>` : ''}
        <form class="quiz-fading-form" id="quizFadingForm" onsubmit="return false;">
          <input type="text" id="quizFadingInput" class="quiz-fading-input" placeholder="${isGapFill ? 'Complete word...' : 'Type English word...'}" autocomplete="off" autocapitalize="off" spellcheck="false" />
          <button type="submit" class="quiz-fading-submit" id="quizFadingSubmit">Check ➔</button>
        </form>
      `;

      quizOptionsGrid.appendChild(fadingBox);

      const input = fadingBox.querySelector('#quizFadingInput');
      const submitBtn = fadingBox.querySelector('#quizFadingSubmit');
      const form = fadingBox.querySelector('#quizFadingForm');

      setTimeout(() => { if (input) input.focus(); }, 100);

      const doSubmit = () => {
        const val = input.value.trim();
        if (!val) return;
        handleQuizRecallAnswer(val, input, submitBtn);
      };

      form.addEventListener('submit', (e) => {
        e.preventDefault();
        doSubmit();
      });
    }
  }

  function playQuizPrompt() {
    if (!quizQuestion) return;
    const padId = String(quizQuestion.target.id).padStart(2, '0');
    const audioSrc = getAudioPath('word', padId);
    playAudioFile(audioSrc, 'Quiz Prompt', 'Listen to English word', quizPlayPromptBtn);
  }

  function handleQuizRecognitionAnswer(selectedOption, clickedBtn) {
    if (quizQuestion.answered) return;
    quizQuestion.answered = true;
    quizTotal++;

    const isCorrect = selectedOption.id === quizQuestion.target.id;
    const allOptionBtns = quizOptionsGrid.querySelectorAll('.quiz-option-btn');

    allOptionBtns.forEach(btn => {
      btn.disabled = true;
      if (btn.dataset.id === String(quizQuestion.target.id)) {
        btn.classList.add('correct');
        const content = btn.querySelector('.quiz-option-content');
        if (content && !content.querySelector('.quiz-option-revealed-word')) {
          const revealBadge = document.createElement('div');
          revealBadge.className = 'quiz-option-revealed-word';
          revealBadge.innerHTML = `<span>🇬🇧 ${quizQuestion.target.word}</span> <small>${quizQuestion.target.ipa}</small>`;
          content.appendChild(revealBadge);
        }
      }
    });

    if (isCorrect) {
      clickedBtn.classList.add('correct');
      finishQuizAnswer(true);
    } else {
      clickedBtn.classList.add('wrong');
      finishQuizAnswer(false);
    }
  }

  function handleQuizRecallAnswer(userText, inputEl, submitBtn) {
    if (quizQuestion.answered) return;
    quizQuestion.answered = true;
    quizTotal++;

    inputEl.disabled = true;
    submitBtn.disabled = true;

    const normalClean = s => s.toLowerCase().replace(/[^a-z0-9]/g, '');
    const isCorrect = normalClean(userText) === normalClean(quizQuestion.target.word);

    if (isCorrect) {
      inputEl.style.borderColor = '#16A34A';
      inputEl.style.background = '#DCFCE7';
      finishQuizAnswer(true);
    } else {
      inputEl.style.borderColor = '#DC2626';
      inputEl.style.background = '#FEE2E2';
      finishQuizAnswer(false);
    }
  }

  function finishQuizAnswer(isCorrect) {
    const target = quizQuestion.target;

    // Record in LearnerStore (Criterion 1.3 & 4.2)
    let updatedMastery = null;
    if (typeof LearnerStore !== 'undefined' && LearnerStore.recordAttempt) {
      updatedMastery = LearnerStore.recordAttempt(unitNum, target.id, isCorrect, target);
      setupCategories(); // Refresh due review count pill
    }

    if (isCorrect) {
      quizScore++;
      quizStreak++;
      feedbackIcon.textContent = '🌟';
      const levelUpMsg = (updatedMastery && updatedMastery.level > quizQuestion.stage)
        ? `<div style="color: #16A34A; font-weight: 700; margin-top: 4px;">🚀 Promoted to Level ${updatedMastery.level} (${updatedMastery.level === 1 ? 'Guided Recall' : 'Active Recall'})!</div>`
        : '';

      feedbackText.innerHTML = `
        <div class="feedback-main"><strong>Correct!</strong> Well done!</div>
        <div class="feedback-sub"><strong>${target.word}</strong> (${target.ipa}) = <span lang="el">${target.meaning_gr}</span></div>
        ${levelUpMsg}
      `;
    } else {
      quizStreak = 0;
      feedbackIcon.textContent = '❌';
      feedbackText.innerHTML = `
        <div class="feedback-main"><strong>Not quite!</strong> Target word: <strong>"${target.word}"</strong> (${target.ipa}).</div>
        <div class="feedback-sub">Meaning: <strong lang="el">${target.meaning_gr}</strong></div>
        <div style="color: #EA580C; font-weight: 700; margin-top: 4px;">📅 Scheduled into Spaced Review Box 1!</div>
      `;
    }

    updateQuizHUD();
    quizFeedback.style.display = 'flex';
  }

  // ==========================================
  // 4B. DEFINITION CHALLENGE ENGINE
  // ==========================================

  function initDefQuiz() {
    if (!restartDefQuizBtn || !defNextQuestionBtn || !defQuizPlayPromptBtn) return;
    restartDefQuizBtn.addEventListener('click', startDefQuiz);
    defNextQuestionBtn.addEventListener('click', loadDefQuizQuestion);
    defQuizPlayPromptBtn.addEventListener('click', playDefQuizPrompt);
  }

  function startDefQuiz() {
    defQuizScore = 0;
    defQuizStreak = 0;
    defQuizTotal = 0;
    updateDefQuizHUD();
    loadDefQuizQuestion();
  }

  function updateDefQuizHUD() {
    if (defQuizScoreEl) defQuizScoreEl.textContent = defQuizScore;
    if (defQuizTotalEl) defQuizTotalEl.textContent = defQuizTotal;
    if (defQuizStreakEl) defQuizStreakEl.textContent = defQuizStreak > 0 ? `🔥 ${defQuizStreak}` : `0`;
  }

  function loadDefQuizQuestion() {
    if (!defQuizFeedback || !defQuizOptionsGrid) return;
    defQuizFeedback.style.display = 'none';
    defQuizOptionsGrid.innerHTML = '';

    const targetIdx = Math.floor(Math.random() * vocabList.length);
    const target = vocabList[targetIdx];

    const distractors = [];
    while (distractors.length < 3 && vocabList.length > 3) {
      const rand = vocabList[Math.floor(Math.random() * vocabList.length)];
      if (rand.id !== target.id && !distractors.some(d => d.id === rand.id)) {
        distractors.push(rand);
      }
    }

    const options = [target, ...distractors].sort(() => Math.random() - 0.5);
    defQuizQuestion = { target, options, answered: false };

    if (defQuizClueEl) defQuizClueEl.textContent = 'Mode: Spoken English Word (Listen carefully)';

    const optionLetters = ['A', 'B', 'C', 'D'];

    options.forEach((opt, idx) => {
      const btn = document.createElement('button');
      btn.className = 'def-quiz-option-btn';
      btn.dataset.id = opt.id;
      btn.innerHTML = `
        <span class="quiz-option-letter">${optionLetters[idx]}</span>
        <div class="quiz-option-content">
          <div class="def-quiz-option-text">${opt.definition_en}</div>
        </div>
      `;
      btn.addEventListener('click', () => handleDefQuizAnswer(opt, btn));
      defQuizOptionsGrid.appendChild(btn);
    });
  }

  function playDefQuizPrompt() {
    if (!defQuizQuestion) return;
    const padId = String(defQuizQuestion.target.id).padStart(2, '0');
    const audioSrc = getAudioPath('word', padId);
    playAudioFile(audioSrc, 'Definition Challenge Prompt', `Listen to: "${defQuizQuestion.target.word}"`, defQuizPlayPromptBtn);
  }

  function handleDefQuizAnswer(selectedOption, clickedBtn) {
    if (defQuizQuestion.answered) return;
    defQuizQuestion.answered = true;
    defQuizTotal++;

    const isCorrect = selectedOption.id === defQuizQuestion.target.id;
    const allOptionBtns = defQuizOptionsGrid.querySelectorAll('.def-quiz-option-btn');

    allOptionBtns.forEach(btn => {
      btn.disabled = true;
      if (btn.dataset.id === String(defQuizQuestion.target.id)) {
        btn.classList.add('correct');
        const content = btn.querySelector('.quiz-option-content');
        if (content && !content.querySelector('.quiz-option-revealed-word')) {
          const revealBadge = document.createElement('div');
          revealBadge.className = 'quiz-option-revealed-word';
          revealBadge.innerHTML = `<span>🇬🇧 ${defQuizQuestion.target.word}</span> <small>${defQuizQuestion.target.pos} • <span lang="el">${defQuizQuestion.target.meaning_gr}</span></small>`;
          content.appendChild(revealBadge);
        }
      }
    });

    if (isCorrect) {
      clickedBtn.classList.add('correct');
      defQuizScore++;
      defQuizStreak++;
      defFeedbackIcon.textContent = '🌟';
      defFeedbackText.innerHTML = `
        <div class="feedback-main"><strong>Correct!</strong> The spoken word was <strong>"${defQuizQuestion.target.word}"</strong>.</div>
        <div class="feedback-sub"><strong>Definition:</strong> <em>"${defQuizQuestion.target.definition_en}"</em> (<span lang="el">${defQuizQuestion.target.meaning_gr}</span>)</div>
      `;
    } else {
      clickedBtn.classList.add('wrong');
      defQuizStreak = 0;
      defFeedbackIcon.textContent = '❌';
      defFeedbackText.innerHTML = `
        <div class="feedback-main"><strong>Not quite!</strong> The spoken word was <strong>"${defQuizQuestion.target.word}"</strong>.</div>
        <div class="feedback-sub"><strong>Correct Definition:</strong> <em>"${defQuizQuestion.target.definition_en}"</em> (<span lang="el">${defQuizQuestion.target.meaning_gr}</span>)</div>
      `;
    }

    updateDefQuizHUD();
    defQuizFeedback.style.display = 'flex';
  }

  // ==========================================
  // 4C. PRINTABLE STUDY SHEET
  // ==========================================

  function initPrintableSheet() {
    if (!printPageBtn) return;
    printPageBtn.addEventListener('click', () => {
      window.print();
    });
    renderPrintableSheet();
  }

  function renderPrintableSheet() {
    if (!printableWordsList) return;
    printableWordsList.innerHTML = vocabList.map((item, idx) => `
      <div class="printable-word-card">
        <div class="pword-header">
          <span class="pword-num">${idx + 1}.</span>
          <span class="pword-title">${item.word}</span>
          <span class="pword-pos">${item.pos}</span>
          <span class="pword-ipa">${item.ipa}</span>
          <span class="pword-gr">(<span lang="el">${item.meaning_gr}</span>)</span>
        </div>
        <div class="pword-def-row">
          <strong class="pword-label">Definition:</strong>
          <span class="pword-def">${item.definition_en}</span>
        </div>
        <div class="pword-example-row">
          <strong class="pword-label">Example:</strong>
          <span class="pword-example">${item.example}</span>
        </div>
      </div>
    `).join('');
  }

  // ==========================================
  // 5. WORD DETAIL MODAL
  // ==========================================

  function openWordModal(id) {
    const item = vocabList.find(v => v.id === id);
    if (!item || !modalBody || !wordModal) return;

    const padId = String(item.id).padStart(2, '0');
    const safeName = item.word.toLowerCase().replace(/[^a-z0-9]/g, '_');
    const svgPath = item.image ? resolveAsset(item.image) : `../../unit${unitNum}/assets/images/${padId}_${safeName}.svg`;
    const wordMp3 = getAudioPath('word', padId);
    const defMp3 = getAudioPath('def', padId);
    const exMp3 = getAudioPath('example', padId);

    modalBody.innerHTML = `
      <div class="modal-hero-center">
        <img src="${svgPath}" alt="${item.word}" class="modal-visual-img" onerror="this.onerror=null; this.style.display='none'; this.nextElementSibling.style.display='flex';" />
        <div class="modal-emoji-fallback" style="display:none; font-size: 3.5rem; height: 120px; align-items:center; justify-content:center;">${item.emoji || '📖'}</div>
        <div class="modal-badge-row">
          <span class="badge unit-badge">${item.category}</span>
        </div>
        <h2 class="modal-word-title">
          ${item.word}
        </h2>
        <div class="modal-word-meta">
          <span class="modal-ipa">${item.ipa}</span> • <strong class="modal-pos">${item.pos}</strong>
        </div>
        <div class="modal-word-der">
          ${item.der}
        </div>
      </div>

      <div class="modal-gr-box">
        <div class="modal-box-kicker">Greek Translation</div>
        <div class="modal-gr-text" lang="el">${item.meaning_gr}</div>
      </div>

      <div class="modal-section-box">
        <div class="modal-section-header">
          <strong>English Definition:</strong>
          <button class="mini-audio-btn" id="modalDefAudioBtn" title="Hear definition">🔊</button>
        </div>
        <p class="modal-def-text">${item.definition_en}</p>
      </div>

      <div class="modal-section-box">
        <div class="modal-section-header">
          <strong>Contextual Example:</strong>
          <button class="mini-audio-btn" id="modalExAudioBtn" title="Hear example">🔊</button>
        </div>
        <p class="modal-ex-text">${highlightExample(item.example, item.word)}</p>
      </div>

      <div class="modal-actions-row">
        <button class="play-all-btn" id="modalWordAudioBtn">
          🔊 Pronounce Word
        </button>
        <button class="play-all-btn primary" id="modalFullAudioBtn">
          ▶ Play Full Reading
        </button>
      </div>
    `;

    wordModal.style.display = 'flex';

    document.getElementById('modalWordAudioBtn').addEventListener('click', (e) => {
      playAudioFile(wordMp3, 'Word Pronunciation', item.word, e.target);
    });
    document.getElementById('modalDefAudioBtn').addEventListener('click', (e) => {
      playAudioFile(defMp3, 'Definition', `${item.word} (Definition)`, e.target);
    });
    document.getElementById('modalExAudioBtn').addEventListener('click', (e) => {
      playAudioFile(exMp3, 'Example', `${item.word} (Example)`, e.target);
    });
    document.getElementById('modalFullAudioBtn').addEventListener('click', (e) => {
      playAllSequence(item, null, e.target);
    });
  }

  if (closeModalBtn) {
    closeModalBtn.addEventListener('click', () => {
      if (wordModal) wordModal.style.display = 'none';
    });
  }

  if (wordModal) {
    wordModal.addEventListener('click', (e) => {
      if (e.target === wordModal) wordModal.style.display = 'none';
    });
  }

  // ==========================================
  // 6. TTS SCRIPT PREVIEW & EXPORT
  // ==========================================

  function loadTtsScript() {
    if (!ttsScriptPreview) return;
    fetch(`vocabulary_unit${unitNum}_tts.txt`)
      .then(res => res.text())
      .then(txt => {
        ttsScriptPreview.textContent = txt;
      })
      .catch(() => {
        ttsScriptPreview.textContent = `Loaded offline vocabulary dataset for ${vocabList.length} items.`;
      });
  }

  if (copyTtsBtn) {
    copyTtsBtn.addEventListener('click', () => {
      const txt = ttsScriptPreview.textContent;
      navigator.clipboard.writeText(txt).then(() => {
        const origText = copyTtsBtn.innerHTML;
        copyTtsBtn.innerHTML = '✅ Copied to Clipboard!';
        setTimeout(() => { copyTtsBtn.innerHTML = origText; }, 2000);
      });
    });
  }

  if (downloadJsonBtn) {
    downloadJsonBtn.addEventListener('click', () => {
      const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(vocabList, null, 2));
      const dlAnchor = document.createElement('a');
      dlAnchor.setAttribute("href", dataStr);
      dlAnchor.setAttribute("download", `vocabulary_unit${unitNum}_data.json`);
      document.body.appendChild(dlAnchor);
      dlAnchor.click();
      dlAnchor.remove();
    });
  }

  // ==========================================
  // 7. GENERAL CONTROLS & LISTENERS
  // ==========================================

  function setupEventListeners() {
    // Mode Switcher Tabs
    modeButtons.forEach(btn => {
      btn.addEventListener('click', () => {
        modeButtons.forEach(b => {
          b.classList.remove('active');
          b.setAttribute('aria-selected', 'false');
        });
        btn.classList.add('active');
        btn.setAttribute('aria-selected', 'true');

        const mode = btn.dataset.mode;
        Object.keys(viewPanels).forEach(key => {
          if (viewPanels[key]) {
            viewPanels[key].classList.toggle('active', key === mode);
          }
        });

        if (mode === 'cards') updateFlashcardView();
        if (mode === 'quiz' && !quizQuestion) startQuiz();
        if (mode === 'defQuiz' && !defQuizQuestion) startDefQuiz();
        if (mode === 'printable') renderPrintableSheet();
      });
    });

    if (searchInput) {
      searchInput.addEventListener('input', (e) => {
        searchTerm = e.target.value;
        if (clearSearchBtn) clearSearchBtn.classList.toggle('visible', !!searchTerm);
        filterVocabulary();
      });
    }

    if (clearSearchBtn) {
      clearSearchBtn.addEventListener('click', () => {
        if (searchInput) {
          searchInput.value = '';
          searchInput.focus();
        }
        searchTerm = '';
        clearSearchBtn.classList.remove('visible');
        filterVocabulary();
      });
    }

    if (voiceSelect) {
      voiceSelect.addEventListener('change', (e) => {
        selectedVoice = e.target.value;
        stopCurrentAudio();
        renderTable();
        if (viewPanels.cards && viewPanels.cards.classList.contains('active')) {
          updateFlashcardView();
        }
      });
    }

    if (speedSelect) {
      speedSelect.addEventListener('change', (e) => {
        playbackRate = parseFloat(e.target.value);
        if (currentAudio) {
          currentAudio.playbackRate = playbackRate;
        }
      });
    }

    if (hudPauseBtn) {
      hudPauseBtn.addEventListener('click', () => {
        if (!currentAudio) return;
        if (currentAudio.paused) {
          currentAudio.play();
          hudPauseBtn.textContent = '⏸';
        } else {
          currentAudio.pause();
          hudPauseBtn.textContent = '▶';
        }
      });
    }

    if (hudStopBtn) {
      hudStopBtn.addEventListener('click', stopCurrentAudio);
    }

    // Accessibility Modal trigger
    if (a11yBtn && typeof LearnerStore !== 'undefined') {
      a11yBtn.addEventListener('click', () => LearnerStore.openA11yModal());
    }
  }

  // Run initialization
  init();
});
