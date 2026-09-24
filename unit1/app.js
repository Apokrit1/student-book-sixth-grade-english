/**
 * UNIT 1: OUR MULTICULTURAL CLASS - VOCABULARY COMPANION
 * Client Application Logic
 */

document.addEventListener('DOMContentLoaded', () => {
  const vocabList = window.VOCABULARY_DATA || [];
  
  // State
  let currentFilteredList = [...vocabList];
  let activeCategory = 'all';
  let searchTerm = '';
  let playbackRate = 1.0;
  let selectedVoice = 'neural'; // 'neural' (Sonia Natural AI) or 'standard' (Google TTS)
  
  // Audio state
  let currentAudio = null;
  let currentPlayingBtn = null;
  let currentPlayingRow = null;
  let playAllQueue = [];
  let isPlayAllActive = false;
  
  // Flashcard state
  let currentCardIdx = 0;
  let isCardFlipped = false;
  
  // Quiz state (Greek translation matching)
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
  
  // HUD Elements
  const audioHud = document.getElementById('audioHud');
  const hudAudioType = document.getElementById('hudAudioType');
  const hudAudioTitle = document.getElementById('hudAudioTitle');
  const hudPauseBtn = document.getElementById('hudPauseBtn');
  const hudStopBtn = document.getElementById('hudStopBtn');

  // Helper function for dynamic audio paths based on selected voice
  function getAudioPath(type, padId) {
    const base = selectedVoice === 'neural' ? 'assets/audio_neural' : 'assets/audio';
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

  // Greek Listening Quiz Elements
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
  }

  // Populate category filter buttons with word counts
  function setupCategories() {
    const counts = { all: vocabList.length };
    vocabList.forEach(item => {
      counts[item.category] = (counts[item.category] || 0) + 1;
    });

    let html = `<button class="pill-btn active" data-category="all">All Words (${vocabList.length})</button>`;
    Object.keys(counts).forEach(cat => {
      if (cat !== 'all') {
        html += `<button class="pill-btn" data-category="${cat}">${cat} (${counts[cat]})</button>`;
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
    tableBody.innerHTML = '';

    if (currentFilteredList.length === 0) {
      tableBody.innerHTML = `
        <tr>
          <td colspan="4" style="text-align: center; padding: 40px; color: var(--text-light);">
            <div style="font-size: 2rem; margin-bottom: 8px;">🔍</div>
            <strong>No matching vocabulary items found</strong>
            <p style="font-size: 0.88rem; margin-top: 4px;">Try searching for another word or reset filters.</p>
          </td>
        </tr>`;
      return;
    }

    currentFilteredList.forEach((item, index) => {
      const padId = String(item.id).padStart(2, '0');
      const safeName = item.word.toLowerCase().replace(/[^a-z0-9]/g, '_');
      const svgPath = `assets/images/${padId}_${safeName}.svg`;
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
              ${item.image ? `<img src="${item.image}" alt="${item.image_alt || item.word}" style="width: 38px; height: 38px; object-fit: cover; border-radius: 6px; display: block;" />` : item.emoji}
            </div>
          </div>
        </td>

        <!-- Column 2: Meaning -->
        <td class="col-meaning">
          <div class="meaning-cell">
            <span class="meaning-greek">${item.meaning_gr}</span>
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

  // Filter Vocabulary list by Search & Category
  function filterVocabulary() {
    currentFilteredList = vocabList.filter(item => {
      const matchesCategory = (activeCategory === 'all') || (item.category === activeCategory);
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
    if (viewPanels.cards.classList.contains('active')) {
      currentCardIdx = 0;
      updateFlashcardView();
    }
  }

  // ==========================================
  // 2. AUDIO ENGINE & PLAYBACK
  // ==========================================

  function playAudioFile(audioSrc, typeLabel, titleLabel, triggerBtn, targetRow, onComplete) {
    stopCurrentAudio();

    // Mark active button & row
    if (triggerBtn) {
      currentPlayingBtn = triggerBtn;
      currentPlayingBtn.classList.add('playing');
    }
    if (targetRow) {
      currentPlayingRow = targetRow;
      currentPlayingRow.classList.add('is-playing');
    }

    // Show Audio HUD
    audioHud.style.display = 'block';
    hudAudioType.textContent = typeLabel || 'Audio';
    hudAudioTitle.textContent = titleLabel || 'Playback';
    hudPauseBtn.textContent = '⏸';

    currentAudio = new Audio(audioSrc);
    currentAudio.playbackRate = playbackRate;

    currentAudio.play().then(() => {
      // playing successfully
    }).catch(err => {
      console.warn('Audio file play error, using speech synthesis fallback:', err);
      speakFallback(titleLabel || typeLabel, onComplete);
    });

    currentAudio.onended = () => {
      clearPlayingVisuals();
      if (onComplete) onComplete();
    };

    currentAudio.onerror = (e) => {
      console.warn('Audio element error:', e);
      clearPlayingVisuals();
      if (onComplete) onComplete();
    };
  }

  function stopCurrentAudio() {
    if (currentAudio) {
      currentAudio.pause();
      currentAudio.currentTime = 0;
      currentAudio = null;
    }
    clearPlayingVisuals();
    audioHud.style.display = 'none';
    isPlayAllActive = false;
    playAllQueue = [];
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

  // Speech synthesis fallback for extreme edge cases
  function speakFallback(text, onComplete) {
    if (!window.speechSynthesis) {
      if (onComplete) onComplete();
      return;
    }
    window.speechSynthesis.cancel();
    const cleanText = text.replace(/\(.*\)/g, '');
    const utter = new SpeechSynthesisUtterance(cleanText);
    utter.rate = playbackRate;
    utter.lang = 'en-US';
    utter.onend = () => {
      clearPlayingVisuals();
      audioHud.style.display = 'none';
      if (onComplete) onComplete();
    };
    utter.onerror = () => {
      clearPlayingVisuals();
      audioHud.style.display = 'none';
      if (onComplete) onComplete();
    };
    window.speechSynthesis.speak(utter);
  }

  // Play All: Sequentially reads Word -> Definition -> Example
  function playAllSequence(item, rowEl, btnEl) {
    stopCurrentAudio();
    isPlayAllActive = true;
    const padId = String(item.id).padStart(2, '0');
    
    const srcs = [
      getAudioPath('word', padId),
      getAudioPath('def', padId),
      getAudioPath('example', padId)
    ];
    let idx = 0;
    function playStep() {
      if (!isPlayAllActive || idx >= srcs.length) {
        isPlayAllActive = false;
        clearPlayingVisuals();
        audioHud.style.display = 'none';
        return;
      }
      const s = srcs[idx++];
      playAudioFile(s, 'Complete Entry', `${item.word}`, btnEl, rowEl, () => {
        if (isPlayAllActive && idx < srcs.length) {
          setTimeout(playStep, 350);
        } else {
          isPlayAllActive = false;
        }
      });
    }
    playStep();
  }

  // Attach table button events
  function attachTableActionEvents() {
    // Single audio buttons
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

    // Play All buttons
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

    // Modal click triggers
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
    totalCardsCountEl.textContent = vocabList.length;
    updateFlashcardView();

    activeFlashcard.addEventListener('click', () => {
      isCardFlipped = !isCardFlipped;
      activeFlashcard.classList.toggle('flipped', isCardFlipped);
    });

    prevCardBtn.addEventListener('click', () => {
      if (currentFilteredList.length === 0) return;
      currentCardIdx = (currentCardIdx - 1 + currentFilteredList.length) % currentFilteredList.length;
      resetAndShowCard();
    });

    nextCardBtn.addEventListener('click', () => {
      if (currentFilteredList.length === 0) return;
      currentCardIdx = (currentCardIdx + 1) % currentFilteredList.length;
      resetAndShowCard();
    });

    shuffleCardsBtn.addEventListener('click', () => {
      currentFilteredList.sort(() => Math.random() - 0.5);
      currentCardIdx = 0;
      resetAndShowCard();
    });

    // Flashcard Audio buttons
    cardPlayWordBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      const item = currentFilteredList[currentCardIdx];
      if (!item) return;
      const padId = String(item.id).padStart(2, '0');
      playAudioFile(getAudioPath('word', padId), 'Word Pronunciation', item.word, cardPlayWordBtn);
    });

    cardPlayDefBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      const item = currentFilteredList[currentCardIdx];
      if (!item) return;
      const padId = String(item.id).padStart(2, '0');
      playAudioFile(getAudioPath('def', padId), 'Definition', `${item.word} (Definition)`, cardPlayDefBtn);
    });

    cardPlayExBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      const item = currentFilteredList[currentCardIdx];
      if (!item) return;
      const padId = String(item.id).padStart(2, '0');
      playAudioFile(getAudioPath('example', padId), 'Example', `${item.word} (Example)`, cardPlayExBtn);
    });

    // Keyboard support for flashcards
    document.addEventListener('keydown', (e) => {
      if (!viewPanels.cards.classList.contains('active')) return;
      if (e.code === 'Space') {
        e.preventDefault();
        isCardFlipped = !isCardFlipped;
        activeFlashcard.classList.toggle('flipped', isCardFlipped);
      } else if (e.code === 'ArrowRight') {
        nextCardBtn.click();
      } else if (e.code === 'ArrowLeft') {
        prevCardBtn.click();
      }
    });
  }

  function resetAndShowCard() {
    isCardFlipped = false;
    activeFlashcard.classList.remove('flipped');
    updateFlashcardView();
  }

  function updateFlashcardView() {
    if (currentFilteredList.length === 0) return;
    const item = currentFilteredList[currentCardIdx];
    currentCardIndexEl.textContent = currentCardIdx + 1;
    totalCardsCountEl.textContent = currentFilteredList.length;

    cardCategoryEl.textContent = item.category;
    if (item.image) {
      cardVisualEl.innerHTML = `
        <img src="${item.image}" alt="${item.image_alt || item.word}" style="max-width: 220px; max-height: 180px; border-radius: 12px; object-fit: cover; display: block; margin: 0 auto; box-shadow: 0 4px 12px rgba(0,0,0,0.12);" />
        <div style="font-size: 0.72rem; color: #718096; margin-top: 6px; text-align: center; font-weight: 500;">
          📷 ${item.image_credit || ''}
        </div>
      `;
    } else {
      cardVisualEl.textContent = item.emoji;
    }
    cardWordEl.textContent = item.word;
    cardIpaEl.textContent = item.ipa;
    cardPosEl.textContent = `${item.pos} • ${item.der}`;
    cardMeaningGrEl.textContent = item.meaning_gr;
    cardDefEnEl.textContent = item.definition_en;
    cardExampleEl.textContent = `"${item.example}"`;
  }

  // ==========================================
  // 4. LISTENING CHALLENGE QUIZ ENGINE
  // ==========================================

  function initQuiz() {
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
    quizScoreEl.textContent = quizScore;
    quizTotalEl.textContent = quizTotal;
    quizStreakEl.textContent = quizStreak > 0 ? `🔥 ${quizStreak}` : `0`;
  }

  function loadQuizQuestion() {
    quizFeedback.style.display = 'none';
    quizOptionsGrid.innerHTML = '';

    // Pick random target word
    const targetIdx = Math.floor(Math.random() * vocabList.length);
    const target = vocabList[targetIdx];

    // Pick 3 distractors
    const distractors = [];
    while (distractors.length < 3) {
      const rand = vocabList[Math.floor(Math.random() * vocabList.length)];
      if (rand.id !== target.id && !distractors.some(d => d.id === rand.id)) {
        distractors.push(rand);
      }
    }

    const options = [target, ...distractors].sort(() => Math.random() - 0.5);

    // Spoken prompt mode: pronounce the English word
    const mode = 'word';
    quizQuestion = { target, options, mode, answered: false };

    quizClueEl.textContent = 'Mode: Spoken English Word (Listen carefully)';

    const optionLetters = ['A', 'B', 'C', 'D'];

    // Render options - ONLY Greek translation, no English text or giveaway emojis
    options.forEach((opt, idx) => {
      const btn = document.createElement('button');
      btn.className = 'quiz-option-btn';
      btn.dataset.id = opt.id;
      btn.innerHTML = `
        <span class="quiz-option-letter">${optionLetters[idx]}</span>
        <div class="quiz-option-content">
          <div class="quiz-option-greek">${opt.meaning_gr}</div>
        </div>
      `;
      btn.addEventListener('click', () => handleQuizAnswer(opt, btn));
      quizOptionsGrid.appendChild(btn);
    });
  }

  function playQuizPrompt() {
    if (!quizQuestion) return;
    const padId = String(quizQuestion.target.id).padStart(2, '0');
    const audioSrc = getAudioPath(quizQuestion.mode, padId);

    playAudioFile(audioSrc, 'Quiz Prompt', 'Listen to English word', quizPlayPromptBtn);
  }

  function handleQuizAnswer(selectedOption, clickedBtn) {
    if (quizQuestion.answered) return;
    quizQuestion.answered = true;
    quizTotal++;

    const isCorrect = selectedOption.id === quizQuestion.target.id;
    const allOptionBtns = quizOptionsGrid.querySelectorAll('.quiz-option-btn');

    allOptionBtns.forEach(btn => {
      btn.disabled = true;
      if (btn.dataset.id === String(quizQuestion.target.id)) {
        btn.classList.add('correct');
        // Reveal the English word on the correct card for educational reinforcement
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
      quizScore++;
      quizStreak++;
      feedbackIcon.textContent = '🌟';
      feedbackText.innerHTML = `
        <div class="feedback-main"><strong>Correct!</strong> Well done!</div>
        <div class="feedback-sub"><strong>${quizQuestion.target.word}</strong> (${quizQuestion.target.ipa}) = ${quizQuestion.target.meaning_gr}</div>
      `;
    } else {
      clickedBtn.classList.add('wrong');
      quizStreak = 0;
      feedbackIcon.textContent = '❌';
      feedbackText.innerHTML = `
        <div class="feedback-main"><strong>Not quite!</strong> The spoken word was <strong>"${quizQuestion.target.word}"</strong>.</div>
        <div class="feedback-sub">Correct translation: <strong>${quizQuestion.target.meaning_gr}</strong></div>
      `;
    }

    updateQuizHUD();
    quizFeedback.style.display = 'flex';
  }

  // ==========================================
  // 4B. DEFINITION CHALLENGE (HEAR WORD -> CHOOSE ENGLISH DEFINITION)
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
    defQuizScoreEl.textContent = defQuizScore;
    defQuizTotalEl.textContent = defQuizTotal;
    defQuizStreakEl.textContent = defQuizStreak > 0 ? `🔥 ${defQuizStreak}` : `0`;
  }

  function loadDefQuizQuestion() {
    defQuizFeedback.style.display = 'none';
    defQuizOptionsGrid.innerHTML = '';

    // Pick random target word
    const targetIdx = Math.floor(Math.random() * vocabList.length);
    const target = vocabList[targetIdx];

    // Pick 3 distractors
    const distractors = [];
    while (distractors.length < 3) {
      const rand = vocabList[Math.floor(Math.random() * vocabList.length)];
      if (rand.id !== target.id && !distractors.some(d => d.id === rand.id)) {
        distractors.push(rand);
      }
    }

    const options = [target, ...distractors].sort(() => Math.random() - 0.5);
    defQuizQuestion = { target, options, answered: false };

    defQuizClueEl.textContent = 'Mode: Spoken English Word (Listen carefully)';

    const optionLetters = ['A', 'B', 'C', 'D'];

    // Render options - ONLY English definitions
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
        // Reveal the English word and Greek meaning on the correct definition card
        const content = btn.querySelector('.quiz-option-content');
        if (content && !content.querySelector('.quiz-option-revealed-word')) {
          const revealBadge = document.createElement('div');
          revealBadge.className = 'quiz-option-revealed-word';
          revealBadge.innerHTML = `<span>🇬🇧 ${defQuizQuestion.target.word}</span> <small>${defQuizQuestion.target.pos} • ${defQuizQuestion.target.meaning_gr}</small>`;
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
        <div class="feedback-sub"><strong>Definition:</strong> <em>"${defQuizQuestion.target.definition_en}"</em> (${defQuizQuestion.target.meaning_gr})</div>
      `;
    } else {
      clickedBtn.classList.add('wrong');
      defQuizStreak = 0;
      defFeedbackIcon.textContent = '❌';
      defFeedbackText.innerHTML = `
        <div class="feedback-main"><strong>Not quite!</strong> The spoken word was <strong>"${defQuizQuestion.target.word}"</strong>.</div>
        <div class="feedback-sub"><strong>Correct Definition:</strong> <em>"${defQuizQuestion.target.definition_en}"</em> (${defQuizQuestion.target.meaning_gr})</div>
      `;
    }

    updateDefQuizHUD();
    defQuizFeedback.style.display = 'flex';
  }

  // ==========================================
  // 4C. PRINTABLE STUDY SHEET (WORD, DEFINITION & EXAMPLE)
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
          <span class="pword-gr">(${item.meaning_gr})</span>
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
    if (!item) return;

    const padId = String(item.id).padStart(2, '0');
    const safeName = item.word.toLowerCase().replace(/[^a-z0-9]/g, '_');
    const svgPath = `assets/images/${padId}_${safeName}.svg`;
    const wordMp3 = getAudioPath('word', padId);
    const defMp3 = getAudioPath('def', padId);
    const exMp3 = getAudioPath('example', padId);

    modalBody.innerHTML = `
      <div style="text-align: center; margin-bottom: 20px;">
        <img src="${svgPath}" alt="${item.word}" style="max-width: 220px; width: 100%; border-radius: 12px; box-shadow: var(--shadow-sm);" onerror="this.style.display='none'">
        <div style="margin-top: 14px;">
          <span class="badge unit-badge">${item.category}</span>
        </div>
        <h2 style="font-family: 'Outfit', sans-serif; font-size: 2rem; font-weight: 800; margin-top: 6px; color: #1a202c;">
          ${item.word}
        </h2>
        <div style="color: var(--text-medium); font-size: 1.05rem; margin-top: 2px;">
          ${item.ipa} • <strong style="color: var(--primary-color);">${item.pos}</strong>
        </div>
        <div style="font-size: 0.9rem; color: var(--secondary-color); margin-top: 4px;">
          ${item.der}
        </div>
      </div>

      <div style="background: var(--bg-subtle); padding: 16px; border-radius: 10px; margin-bottom: 14px;">
        <div style="font-size: 0.78rem; font-weight: 700; color: var(--text-light); text-transform: uppercase;">Greek Translation:</div>
        <div style="font-size: 1.25rem; font-weight: 700; color: #2d3748; margin-top: 2px;">${item.meaning_gr}</div>
      </div>

      <div style="margin-bottom: 14px;">
        <div style="display: flex; justify-content: space-between; align-items: center;">
          <strong style="font-size: 0.88rem; color: var(--text-medium);">English Definition:</strong>
          <button class="mini-audio-btn" id="modalDefAudioBtn" title="Hear definition">🔊</button>
        </div>
        <p style="font-size: 0.95rem; color: #2d3748; margin-top: 4px;">${item.definition_en}</p>
      </div>

      <div style="margin-bottom: 20px;">
        <div style="display: flex; justify-content: space-between; align-items: center;">
          <strong style="font-size: 0.88rem; color: var(--text-medium);">Contextual Example:</strong>
          <button class="mini-audio-btn" id="modalExAudioBtn" title="Hear example">🔊</button>
        </div>
        <p style="font-size: 0.95rem; font-style: italic; color: #4a5568; margin-top: 4px;">${highlightExample(item.example, item.word)}</p>
      </div>

      <div style="display: flex; gap: 10px; justify-content: center;">
        <button class="play-all-btn" id="modalWordAudioBtn" style="padding: 10px 18px; font-size: 0.9rem;">
          🔊 Pronounce Word
        </button>
        <button class="play-all-btn primary" id="modalFullAudioBtn" style="background: var(--primary-color); color: #fff; border-color: var(--primary-color); padding: 10px 18px; font-size: 0.9rem;">
          ▶ Play Full Reading
        </button>
      </div>
    `;

    wordModal.style.display = 'flex';

    // Audio handlers in modal
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

  closeModalBtn.addEventListener('click', () => {
    wordModal.style.display = 'none';
  });

  wordModal.addEventListener('click', (e) => {
    if (e.target === wordModal) {
      wordModal.style.display = 'none';
    }
  });

  // ==========================================
  // 6. TTS SCRIPT PREVIEW & EXPORT
  // ==========================================

  function loadTtsScript() {
    fetch('vocabulary_unit1_tts.txt')
      .then(res => res.text())
      .then(txt => {
        ttsScriptPreview.textContent = txt;
      })
      .catch(() => {
        ttsScriptPreview.textContent = 'Loaded offline vocabulary dataset for 35 items.';
      });
  }

  copyTtsBtn.addEventListener('click', () => {
    const txt = ttsScriptPreview.textContent;
    navigator.clipboard.writeText(txt).then(() => {
      const origText = copyTtsBtn.innerHTML;
      copyTtsBtn.innerHTML = '✅ Copied to Clipboard!';
      setTimeout(() => { copyTtsBtn.innerHTML = origText; }, 2000);
    });
  });

  downloadJsonBtn.addEventListener('click', () => {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(vocabList, null, 2));
    const dlAnchor = document.createElement('a');
    dlAnchor.setAttribute("href", dataStr);
    dlAnchor.setAttribute("download", "vocabulary_unit1_data.json");
    document.body.appendChild(dlAnchor);
    dlAnchor.click();
    dlAnchor.remove();
  });

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
          viewPanels[key].classList.toggle('active', key === mode);
        });

        // Trigger mode specific refresh
        if (mode === 'cards') updateFlashcardView();
        if (mode === 'quiz' && !quizQuestion) startQuiz();
        if (mode === 'defQuiz' && !defQuizQuestion) startDefQuiz();
        if (mode === 'printable') renderPrintableSheet();
      });
    });

    // Search Input
    searchInput.addEventListener('input', (e) => {
      searchTerm = e.target.value;
      clearSearchBtn.classList.toggle('visible', !!searchTerm);
      filterVocabulary();
    });

    clearSearchBtn.addEventListener('click', () => {
      searchInput.value = '';
      searchTerm = '';
      clearSearchBtn.classList.remove('visible');
      filterVocabulary();
      searchInput.focus();
    });

    // Voice Engine Selection
    if (voiceSelect) {
      voiceSelect.addEventListener('change', (e) => {
        selectedVoice = e.target.value;
        stopCurrentAudio();
        renderTable();
        if (viewPanels.cards.classList.contains('active')) {
          updateFlashcardView();
        }
      });
    }

    // Playback Speed
    speedSelect.addEventListener('change', (e) => {
      playbackRate = parseFloat(e.target.value);
      if (currentAudio) {
        currentAudio.playbackRate = playbackRate;
      }
    });

    // HUD Audio Controls
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

    hudStopBtn.addEventListener('click', stopCurrentAudio);
  }

  // Run initialization
  init();
});
