document.addEventListener('DOMContentLoaded', async () => {
  const body = document.body;
  const unitNum = body.dataset.unit || '';
  const vocabList = Array.isArray(window.VOCABULARY_DATA) ? window.VOCABULARY_DATA : [];
  let unitData = {};
  let currentFilteredList = [...vocabList];
  let activeCategory = 'all';
  let searchTerm = '';
  let playbackRate = 1;
  let selectedVoice = 'neural';
  let currentCardIdx = 0;
  let isCardFlipped = false;
  let quizQuestion = null;
  let quizScore = 0;
  let quizStreak = 0;
  let quizTotal = 0;
  let defQuizQuestion = null;
  let defQuizScore = 0;
  let defQuizStreak = 0;
  let defQuizTotal = 0;
  let currentAudio = null;
  let audioQueue = [];
  let audioTimer = null;
  let activeAudioButton = null;
  let activeAudioRow = null;

  const byId = id => document.getElementById(id);
  const escapeHtml = value => String(value ?? '').replace(/[&<>'"]/g, char => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', "'": '&#39;', '"': '&quot;' }[char]));
  const normalise = value => String(value ?? '').trim().toLowerCase().replace(/\s+/g, ' ');
  const padId = value => String(value).padStart(2, '0');
  const filePart = value => String(value ?? '').toLowerCase().replace(/[^a-z0-9]+/g, '_').replace(/^_|_$/g, '');

  const tableBody = byId('vocabTableBody');
  const searchInput = byId('searchInput');
  const clearSearchBtn = byId('clearSearchBtn');
  const categoryPills = byId('categoryPills');
  const speedSelect = byId('speedSelect');
  const voiceSelect = byId('voiceSelect');
  const audioHud = byId('audioHud');
  const hudAudioType = byId('hudAudioType');
  const hudAudioTitle = byId('hudAudioTitle');
  const hudPauseBtn = byId('hudPauseBtn');
  const hudStopBtn = byId('hudStopBtn');
  const activeFlashcard = byId('activeFlashcard');
  const currentCardIndex = byId('currentCardIndex');
  const totalCardsCount = byId('totalCardsCount');
  const cardCategory = byId('cardCategory');
  const cardVisual = byId('cardVisual');
  const cardWord = byId('cardWord');
  const cardIpa = byId('cardIpa');
  const cardPos = byId('cardPos');
  const cardMeaningGr = byId('cardMeaningGr');
  const cardDefEn = byId('cardDefEn');
  const cardExample = byId('cardExample');
  const cardPlayWordBtn = byId('cardPlayWordBtn');
  const cardPlayDefBtn = byId('cardPlayDefBtn');
  const cardPlayExBtn = byId('cardPlayExBtn');
  const prevCardBtn = byId('prevCardBtn');
  const nextCardBtn = byId('nextCardBtn');
  const shuffleCardsBtn = byId('shuffleCardsBtn');
  const quizScoreEl = byId('quizScore');
  const quizTotalEl = byId('quizTotal');
  const quizStreakEl = byId('quizStreak');
  const quizPlayPromptBtn = byId('quizPlayPromptBtn');
  const quizClue = byId('quizClue');
  const quizOptionsGrid = byId('quizOptionsGrid');
  const quizFeedback = byId('quizFeedback');
  const feedbackIcon = byId('feedbackIcon');
  const feedbackText = byId('feedbackText');
  const nextQuestionBtn = byId('nextQuestionBtn');
  const restartQuizBtn = byId('restartQuizBtn');
  const defQuizScoreEl = byId('defQuizScore');
  const defQuizTotalEl = byId('defQuizTotal');
  const defQuizStreakEl = byId('defQuizStreak');
  const defQuizPlayPromptBtn = byId('defQuizPlayPromptBtn');
  const defQuizClue = byId('defQuizClue');
  const defQuizOptionsGrid = byId('defQuizOptionsGrid');
  const defQuizFeedback = byId('defQuizFeedback');
  const defFeedbackIcon = byId('defFeedbackIcon');
  const defFeedbackText = byId('defFeedbackText');
  const defNextQuestionBtn = byId('defNextQuestionBtn');
  const restartDefQuizBtn = byId('restartDefQuizBtn');
  const printPageBtn = byId('printPageBtn');
  const printableWordsList = byId('printableWordsList');
  const ttsScriptPreview = byId('ttsScriptPreview');
  const copyTtsBtn = byId('copyTtsBtn');
  const downloadTtsBtn = byId('downloadTtsBtn');
  const downloadJsonBtn = byId('downloadJsonBtn');
  const wordModal = byId('wordModal');
  const modalBody = byId('modalBody');
  const closeModalBtn = byId('closeModalBtn');
  const modeButtons = [...document.querySelectorAll('.mode-btn')];
  const panels = {
    table: byId('viewTable'),
    cards: byId('viewCards'),
    quiz: byId('viewQuiz'),
    defQuiz: byId('viewDefQuiz'),
    printable: byId('viewPrintable'),
    tts: byId('viewTTS')
  };

  function loadScript(src) {
    return new Promise(resolve => {
      const script = document.createElement('script');
      script.src = src;
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.head.appendChild(script);
    });
  }

  async function loadUnitData() {
    if (!/^\d+$/.test(unitNum)) return {};
    const key = `UNIT${unitNum}_V2_DATA`;
    if (window[key]) return window[key];
    const loaded = await loadScript(`data/unit${unitNum}_v2_data.js`);
    if (loaded && window[key]) return window[key];
    try {
      const response = await fetch(`data/unit${unitNum}_v2_data.json`);
      if (response.ok) return await response.json();
    } catch (error) {
      return {};
    }
    return {};
  }

  function getUnitTitle() {
    return unitData.unit_title || (unitNum ? `Unit ${unitNum}` : 'Coursebook Unit');
  }

  function getUnitLabel() {
    return unitNum ? `Unit ${unitNum}: ${getUnitTitle()}` : getUnitTitle();
  }

  function applyIdentity() {
    const unitLabel = getUnitLabel();
    document.title = `${unitLabel} | 6th Grade English Vocabulary Companion`;
    document.querySelectorAll('.shell-unit-label').forEach(el => { el.textContent = unitNum ? `Unit ${unitNum}` : 'Coursebook Unit'; });
    document.querySelectorAll('.shell-unit-title').forEach(el => { el.textContent = getUnitTitle(); });
    document.querySelectorAll('.shell-footer-title').forEach(el => { el.textContent = `6th Grade English Curriculum • ${unitLabel}`; });
    document.querySelectorAll('.shell-source-label').forEach(el => { el.textContent = `Coursebook • ${unitNum ? `Unit ${unitNum}` : 'Vocabulary Companion'}`; });
    document.querySelectorAll('.shell-print-kicker').forEach(el => { el.textContent = `English 6th Grade • ${unitLabel}`; });
    document.querySelectorAll('.shell-print-title').forEach(el => { el.textContent = `${getUnitTitle()} — Vocabulary Study Guide`; });
    document.querySelectorAll('.shell-print-footer').forEach(el => { el.textContent = `${unitLabel} • Printable Vocabulary Reference`; });
    byId('cefrBadge').textContent = `CEFR ${unitData.cefr_level || 'A2'}`;
    byId('totalWordsCount').textContent = vocabList.length;
    byId('audioCount').textContent = vocabList.length * 6;
  }

  function getAudioPath(type, id) {
    const base = selectedVoice === 'neural' ? 'assets/audio_neural' : 'assets/audio';
    const idText = padId(id);
    if (type === 'def') return `${base}/defs/${idText}_definition.mp3`;
    if (type === 'example') return `${base}/examples/${idText}_example.mp3`;
    return `${base}/words/${idText}_word.mp3`;
  }

  function clearAudioVisuals() {
    if (activeAudioButton) activeAudioButton.classList.remove('playing');
    if (activeAudioRow) activeAudioRow.classList.remove('is-playing');
    activeAudioButton = null;
    activeAudioRow = null;
  }

  function stopAudio() {
    if (audioTimer) clearTimeout(audioTimer);
    audioTimer = null;
    audioQueue = [];
    if (currentAudio) {
      currentAudio.pause();
      currentAudio.src = '';
      currentAudio = null;
    }
    clearAudioVisuals();
    audioHud.style.display = 'none';
    hudPauseBtn.textContent = '⏸';
  }

  function playSequence(entries, triggerButton = null, targetRow = null) {
    stopAudio();
    const queue = (Array.isArray(entries) ? entries : [entries]).filter(entry => entry && entry.src);
    if (!queue.length) return;
    audioQueue = queue.slice();
    if (triggerButton) {
      activeAudioButton = triggerButton;
      triggerButton.classList.add('playing');
    }
    if (targetRow) {
      activeAudioRow = targetRow;
      targetRow.classList.add('is-playing');
    }
    const playNext = () => {
      if (!audioQueue.length) {
        stopAudio();
        return;
      }
      const entry = audioQueue.shift();
      currentAudio = new Audio(entry.src);
      currentAudio.playbackRate = playbackRate;
      currentAudio.onended = () => {
        if (audioQueue.length) audioTimer = setTimeout(playNext, 350);
        else stopAudio();
      };
      currentAudio.onerror = stopAudio;
      hudAudioType.textContent = entry.type || 'Audio';
      hudAudioTitle.textContent = entry.title || 'Playback';
      audioHud.style.display = 'block';
      hudPauseBtn.textContent = '⏸';
      currentAudio.play().catch(stopAudio);
    };
    playNext();
  }

  function playItem(item, type, triggerButton = null, row = null) {
    const labels = { word: 'Pronunciation', def: 'Definition', example: 'Example' };
    playSequence({ src: getAudioPath(type, item.id), type: labels[type] || 'Audio', title: item.word }, triggerButton, row);
  }

  function playFullItem(item, triggerButton = null, row = null) {
    const idText = padId(item.id);
    playSequence([
      { src: getAudioPath('word', idText), type: 'Complete Entry', title: item.word },
      { src: getAudioPath('def', idText), type: 'Complete Entry', title: item.word },
      { src: getAudioPath('example', idText), type: 'Complete Entry', title: item.word }
    ], triggerButton, row);
  }

  function setupCategories() {
    const counts = new Map();
    vocabList.forEach(item => counts.set(item.category || 'General', (counts.get(item.category || 'General') || 0) + 1));
    const categories = [...counts.entries()].sort((a, b) => a[0].localeCompare(b[0]));
    categoryPills.innerHTML = `<button class="pill-btn active" data-category="all">All Words (${vocabList.length})</button>${categories.map(([name, count]) => `<button class="pill-btn" data-category="${escapeHtml(name)}">${escapeHtml(name)} (${count})</button>`).join('')}`;
    categoryPills.querySelectorAll('.pill-btn').forEach(button => {
      button.addEventListener('click', () => {
        categoryPills.querySelectorAll('.pill-btn').forEach(item => item.classList.remove('active'));
        button.classList.add('active');
        activeCategory = button.dataset.category;
        filterVocabulary();
      });
    });
  }

  function highlightExample(sentence, word) {
    const first = String(word || '').split(/\s+/)[0].replace(/[^a-zA-Z]/g, '');
    if (!sentence || !first) return escapeHtml(sentence);
    const pattern = new RegExp(`\\b${first}[a-z]*\\b`, 'gi');
    return escapeHtml(sentence).replace(pattern, '<span class="example-target-word">$1</span>');
  }

  function renderTable() {
    tableBody.innerHTML = '';
    if (!currentFilteredList.length) {
      tableBody.innerHTML = '<tr><td colspan="4" style="text-align:center;padding:40px;color:var(--text-light);"><strong>No matching vocabulary items found</strong><p style="font-size:0.88rem;margin-top:4px;">Try another search or reset the filters.</p></td></tr>';
      return;
    }
    currentFilteredList.forEach(item => {
      const row = document.createElement('tr');
      row.id = `row-${item.id}`;
      row.dataset.id = item.id;
      const visual = item.image
        ? `<img src="${escapeHtml(item.image)}" alt="${escapeHtml(item.image_alt || item.word)}" style="width:38px;height:38px;object-fit:cover;border-radius:6px;display:block;">`
        : escapeHtml(item.emoji || '•');
      row.innerHTML = `
        <td class="col-word"><div class="word-cell"><span class="row-index">${escapeHtml(item.id)}</span><div class="word-main-wrap"><div class="word-line"><span class="word-headword" data-action="modal" data-id="${escapeHtml(item.id)}">${escapeHtml(item.word)}</span><span class="word-ipa">${escapeHtml(item.ipa)}</span><span class="word-pos">${escapeHtml(item.pos)}</span><button class="audio-btn" data-audio-type="word" data-id="${escapeHtml(item.id)}" title="Listen to pronunciation" aria-label="Listen to ${escapeHtml(item.word)}">🔊</button></div><div class="word-derivatives">${escapeHtml(item.der)}</div></div><div class="word-visual-badge" data-action="modal" data-id="${escapeHtml(item.id)}" title="${escapeHtml(item.word)}">${visual}</div></div></td>
        <td class="col-meaning"><div class="meaning-cell"><span class="meaning-greek">${escapeHtml(item.meaning_gr)}</span><span class="meaning-en">${escapeHtml(item.definition_en)}</span><button class="audio-btn" data-audio-type="def" data-id="${escapeHtml(item.id)}" title="Listen to definition" aria-label="Listen to definition of ${escapeHtml(item.word)}">🔊</button></div></td>
        <td class="col-example"><div class="example-cell">${highlightExample(item.example, item.word)}<button class="audio-btn" data-audio-type="example" data-id="${escapeHtml(item.id)}" title="Listen to example" aria-label="Listen to example for ${escapeHtml(item.word)}">🔊</button></div></td>
        <td class="col-actions"><button class="play-all-btn" data-full-id="${escapeHtml(item.id)}" title="Play word, definition, and example">▶ Play All</button></td>`;
      tableBody.appendChild(row);
    });
    tableBody.querySelectorAll('.audio-btn').forEach(button => button.addEventListener('click', event => {
      event.stopPropagation();
      const item = vocabList.find(entry => String(entry.id) === button.dataset.id);
      if (item) playItem(item, button.dataset.audioType, button, button.closest('tr'));
    }));
    tableBody.querySelectorAll('[data-full-id]').forEach(button => button.addEventListener('click', event => {
      event.stopPropagation();
      const item = vocabList.find(entry => String(entry.id) === button.dataset.fullId);
      if (item) playFullItem(item, button, button.closest('tr'));
    }));
    tableBody.querySelectorAll('[data-action="modal"]').forEach(element => element.addEventListener('click', () => openWordModal(element.dataset.id)));
  }

  function filterVocabulary() {
    const query = normalise(searchTerm);
    currentFilteredList = vocabList.filter(item => {
      const categoryMatch = activeCategory === 'all' || item.category === activeCategory;
      const haystack = normalise([item.word, item.meaning_gr, item.definition_en, item.example, item.der].join(' '));
      return categoryMatch && (!query || haystack.includes(query));
    });
    currentCardIdx = 0;
    isCardFlipped = false;
    activeFlashcard.classList.remove('flipped');
    renderTable();
    updateFlashcard();
  }

  function resetCard() {
    isCardFlipped = false;
    activeFlashcard.classList.remove('flipped');
    updateFlashcard();
  }

  function updateFlashcard() {
    totalCardsCount.textContent = currentFilteredList.length;
    currentCardIndex.textContent = currentFilteredList.length ? currentCardIdx + 1 : 0;
    const item = currentFilteredList[currentCardIdx];
    if (!item) {
      cardCategory.textContent = 'No item';
      cardVisual.textContent = '—';
      cardWord.textContent = 'No matching item';
      cardIpa.textContent = '';
      cardPos.textContent = '';
      cardMeaningGr.textContent = '';
      cardDefEn.textContent = '';
      cardExample.textContent = '';
      return;
    }
    cardCategory.textContent = item.category || 'General';
    if (item.image) {
      cardVisual.innerHTML = `<img src="${escapeHtml(item.image)}" alt="${escapeHtml(item.image_alt || item.word)}" style="max-width:220px;max-height:180px;border-radius:12px;object-fit:cover;display:block;margin:0 auto;box-shadow:0 4px 12px rgba(0,0,0,0.12);"><div style="font-size:0.72rem;color:#718096;margin-top:6px;text-align:center;font-weight:500;">📷 ${escapeHtml(item.image_credit || item.image_source || '')}</div>`;
    } else {
      cardVisual.textContent = item.emoji || '•';
    }
    cardWord.textContent = item.word;
    cardIpa.textContent = item.ipa || '';
    cardPos.textContent = [item.pos, item.der].filter(Boolean).join(' • ');
    cardMeaningGr.textContent = item.meaning_gr || '';
    cardDefEn.textContent = item.definition_en || '';
    cardExample.textContent = item.example ? `"${item.example}"` : '';
  }

  function chooseQuestion(pool) {
    if (!pool.length) return null;
    const target = pool[Math.floor(Math.random() * pool.length)];
    const others = pool.filter(item => item.id !== target.id);
    const count = Math.min(4, pool.length);
    const distractors = [];
    while (distractors.length < count - 1 && others.length) {
      const candidate = others.splice(Math.floor(Math.random() * others.length), 1)[0];
      if (!distractors.some(item => item.id === candidate.id)) distractors.push(candidate);
    }
    return { target, options: [target, ...distractors].sort(() => Math.random() - 0.5) };
  }

  function updateQuizHud() {
    quizScoreEl.textContent = quizScore;
    quizTotalEl.textContent = quizTotal;
    quizStreakEl.textContent = quizStreak;
  }

  function loadQuizQuestion() {
    const question = chooseQuestion(vocabList);
    if (!question) {
      quizOptionsGrid.innerHTML = '<p>Add more vocabulary items to play this challenge.</p>';
      return;
    }
    quizQuestion = { ...question, answered: false };
    quizFeedback.style.display = 'none';
    quizOptionsGrid.innerHTML = '';
    const letters = ['A', 'B', 'C', 'D'];
    quizQuestion.options.forEach((item, index) => {
      const button = document.createElement('button');
      button.className = 'quiz-option-btn';
      button.dataset.id = item.id;
      button.innerHTML = `<span class="quiz-option-letter">${letters[index] || ''}</span><div class="quiz-option-content"><div class="quiz-option-greek">${escapeHtml(item.meaning_gr)}</div></div>`;
      button.addEventListener('click', () => answerQuiz(item, button));
      quizOptionsGrid.appendChild(button);
    });
    setTimeout(playQuizPrompt, 250);
  }

  function playQuizPrompt() {
    if (!quizQuestion) return;
    playItem(quizQuestion.target, 'word', quizPlayPromptBtn);
  }

  function answerQuiz(selected, button) {
    if (!quizQuestion || quizQuestion.answered) return;
    quizQuestion.answered = true;
    quizTotal += 1;
    const correct = selected.id === quizQuestion.target.id;
    quizOptionsGrid.querySelectorAll('.quiz-option-btn').forEach(item => {
      item.disabled = true;
      if (Number(item.dataset.id) === Number(quizQuestion.target.id)) item.classList.add('correct');
    });
    if (correct) {
      quizScore += 1;
      quizStreak += 1;
      button.classList.add('correct');
      feedbackIcon.textContent = '🌟';
      feedbackText.innerHTML = `<div class="feedback-main"><strong>Correct!</strong> ${escapeHtml(quizQuestion.target.word)} = ${escapeHtml(quizQuestion.target.meaning_gr)}</div>`;
    } else {
      quizStreak = 0;
      button.classList.add('wrong');
      feedbackIcon.textContent = '❌';
      feedbackText.innerHTML = `<div class="feedback-main"><strong>Not quite!</strong> The word was <strong>${escapeHtml(quizQuestion.target.word)}</strong>.</div><div class="feedback-sub">${escapeHtml(quizQuestion.target.meaning_gr)}</div>`;
    }
    updateQuizHud();
    quizFeedback.style.display = 'flex';
  }

  function updateDefQuizHud() {
    defQuizScoreEl.textContent = defQuizScore;
    defQuizTotalEl.textContent = defQuizTotal;
    defQuizStreakEl.textContent = defQuizStreak;
  }

  function loadDefQuizQuestion() {
    const question = chooseQuestion(vocabList);
    if (!question) {
      defQuizOptionsGrid.innerHTML = '<p>Add more vocabulary items to play this challenge.</p>';
      return;
    }
    defQuizQuestion = { ...question, answered: false };
    defQuizFeedback.style.display = 'none';
    defQuizOptionsGrid.innerHTML = '';
    const letters = ['A', 'B', 'C', 'D'];
    defQuizQuestion.options.forEach((item, index) => {
      const button = document.createElement('button');
      button.className = 'def-quiz-option-btn';
      button.dataset.id = item.id;
      button.innerHTML = `<span class="quiz-option-letter">${letters[index] || ''}</span><div class="quiz-option-content"><div class="def-quiz-option-text">${escapeHtml(item.definition_en)}</div></div>`;
      button.addEventListener('click', () => answerDefQuiz(item, button));
      defQuizOptionsGrid.appendChild(button);
    });
    setTimeout(playDefQuizPrompt, 250);
  }

  function playDefQuizPrompt() {
    if (!defQuizQuestion) return;
    playItem(defQuizQuestion.target, 'word', defQuizPlayPromptBtn);
  }

  function answerDefQuiz(selected, button) {
    if (!defQuizQuestion || defQuizQuestion.answered) return;
    defQuizQuestion.answered = true;
    defQuizTotal += 1;
    const correct = selected.id === defQuizQuestion.target.id;
    defQuizOptionsGrid.querySelectorAll('.def-quiz-option-btn').forEach(item => {
      item.disabled = true;
      if (Number(item.dataset.id) === Number(defQuizQuestion.target.id)) item.classList.add('correct');
    });
    if (correct) {
      defQuizScore += 1;
      defQuizStreak += 1;
      button.classList.add('correct');
      defFeedbackIcon.textContent = '🌟';
      defFeedbackText.innerHTML = `<div class="feedback-main"><strong>Correct!</strong> ${escapeHtml(defQuizQuestion.target.definition_en)}</div>`;
    } else {
      defQuizStreak = 0;
      button.classList.add('wrong');
      defFeedbackIcon.textContent = '❌';
      defFeedbackText.innerHTML = `<div class="feedback-main"><strong>Not quite!</strong> ${escapeHtml(defQuizQuestion.target.definition_en)}</div>`;
    }
    updateDefQuizHud();
    defQuizFeedback.style.display = 'flex';
  }

  function openWordModal(id) {
    const item = vocabList.find(entry => String(entry.id) === String(id));
    if (!item) return;
    const visual = item.image
      ? `<img src="${escapeHtml(item.image)}" alt="${escapeHtml(item.image_alt || item.word)}" style="max-width:220px;width:100%;border-radius:12px;box-shadow:var(--shadow-sm);"><div style="font-size:0.72rem;color:#718096;margin-top:6px;text-align:center;">📷 ${escapeHtml(item.image_credit || item.image_source || '')}</div>`
      : `<div style="font-size:5rem;">${escapeHtml(item.emoji || '•')}</div>`;
    modalBody.innerHTML = `
      <div style="text-align:center;margin-bottom:20px;">${visual}<div style="margin-top:14px;"><span class="badge unit-badge">${escapeHtml(item.category || 'General')}</span></div><h2 style="font-family:'Outfit',sans-serif;font-size:2rem;font-weight:800;margin-top:6px;color:#1a202c;">${escapeHtml(item.word)}</h2><div style="color:var(--text-medium);font-size:1.05rem;margin-top:2px;">${escapeHtml(item.ipa)} • <strong style="color:var(--primary-color);">${escapeHtml(item.pos)}</strong></div><div style="font-size:0.9rem;color:var(--secondary-color);margin-top:4px;">${escapeHtml(item.der)}</div></div>
      <div style="background:var(--bg-subtle);padding:16px;border-radius:10px;margin-bottom:14px;"><div style="font-size:0.78rem;font-weight:700;color:var(--text-light);text-transform:uppercase;">Greek Meaning</div><div style="font-size:1.25rem;font-weight:700;color:#2d3748;margin-top:2px;">${escapeHtml(item.meaning_gr)}</div></div>
      <div style="margin-bottom:14px;"><div style="display:flex;justify-content:space-between;align-items:center;"><strong>English Definition</strong><button class="mini-audio-btn" id="modalDefAudioBtn" aria-label="Hear definition">🔊</button></div><p>${escapeHtml(item.definition_en)}</p></div>
      <div style="margin-bottom:20px;"><div style="display:flex;justify-content:space-between;align-items:center;"><strong>Contextual Example</strong><button class="mini-audio-btn" id="modalExAudioBtn" aria-label="Hear example">🔊</button></div><p style="font-style:italic;color:#4a5568;">${highlightExample(item.example, item.word)}</p></div>
      <div style="display:flex;gap:10px;justify-content:center;flex-wrap:wrap;"><button class="play-all-btn" id="modalWordAudioBtn">🔊 Pronounce Word</button><button class="play-all-btn primary" id="modalFullAudioBtn" style="background:var(--primary-color);color:#fff;border-color:var(--primary-color);">▶ Play Full Reading</button></div>`;
    wordModal.style.display = 'flex';
    byId('modalWordAudioBtn').addEventListener('click', event => playItem(item, 'word', event.currentTarget));
    byId('modalDefAudioBtn').addEventListener('click', event => playItem(item, 'def', event.currentTarget));
    byId('modalExAudioBtn').addEventListener('click', event => playItem(item, 'example', event.currentTarget));
    byId('modalFullAudioBtn').addEventListener('click', event => playFullItem(item, event.currentTarget));
  }

  function buildTextScript() {
    return vocabList.map(item => `${item.word}\n${item.ipa} ${item.pos}\n${item.meaning_gr}\n${item.definition_en}\n${item.example}`).join('\n\n');
  }

  function renderPrintable() {
    printableWordsList.innerHTML = vocabList.map((item, index) => `<div class="printable-word-card"><div class="pword-header"><span class="pword-num">${index + 1}.</span><span class="pword-title">${escapeHtml(item.word)}</span><span class="pword-pos">${escapeHtml(item.pos)}</span><span class="pword-ipa">${escapeHtml(item.ipa)}</span><span class="pword-gr">${escapeHtml(item.meaning_gr)}</span></div><div class="pword-def-row"><strong class="pword-label">Definition:</strong><span class="pword-def">${escapeHtml(item.definition_en)}</span></div><div class="pword-example-row"><strong class="pword-label">Example:</strong><span class="pword-example">${escapeHtml(item.example)}</span></div></div>`).join('');
  }

  function downloadText(filename, text, type) {
    const blob = new Blob([text], { type });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    link.remove();
    URL.revokeObjectURL(url);
  }

  function setupEvents() {
    modeButtons.forEach(button => button.addEventListener('click', () => {
      const mode = button.dataset.mode;
      modeButtons.forEach(item => {
        const active = item === button;
        item.classList.toggle('active', active);
        item.setAttribute('aria-selected', active ? 'true' : 'false');
      });
      Object.entries(panels).forEach(([key, panel]) => panel.classList.toggle('active', key === mode));
      if (mode === 'cards') updateFlashcard();
      if (mode === 'printable') renderPrintable();
    }));
    searchInput.addEventListener('input', event => {
      searchTerm = event.target.value;
      clearSearchBtn.classList.toggle('visible', Boolean(searchTerm));
      filterVocabulary();
    });
    clearSearchBtn.addEventListener('click', () => {
      searchInput.value = '';
      searchTerm = '';
      clearSearchBtn.classList.remove('visible');
      filterVocabulary();
      searchInput.focus();
    });
    voiceSelect.addEventListener('change', event => {
      selectedVoice = event.target.value;
      stopAudio();
      renderTable();
    });
    speedSelect.addEventListener('change', event => {
      playbackRate = Number(event.target.value) || 1;
      if (currentAudio) currentAudio.playbackRate = playbackRate;
    });
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
    hudStopBtn.addEventListener('click', stopAudio);
    activeFlashcard.addEventListener('click', event => {
      if (event.target.closest('button')) return;
      isCardFlipped = !isCardFlipped;
      activeFlashcard.classList.toggle('flipped', isCardFlipped);
    });
    activeFlashcard.addEventListener('keydown', event => {
      if (event.code === 'Space') {
        event.preventDefault();
        activeFlashcard.click();
      }
    });
    prevCardBtn.addEventListener('click', () => {
      if (!currentFilteredList.length) return;
      currentCardIdx = (currentCardIdx - 1 + currentFilteredList.length) % currentFilteredList.length;
      resetCard();
    });
    nextCardBtn.addEventListener('click', () => {
      if (!currentFilteredList.length) return;
      currentCardIdx = (currentCardIdx + 1) % currentFilteredList.length;
      resetCard();
    });
    shuffleCardsBtn.addEventListener('click', () => {
      currentFilteredList.sort(() => Math.random() - 0.5);
      currentCardIdx = 0;
      resetCard();
    });
    cardPlayWordBtn.addEventListener('click', event => {
      const item = currentFilteredList[currentCardIdx];
      if (item) playItem(item, 'word', event.currentTarget);
    });
    cardPlayDefBtn.addEventListener('click', event => {
      const item = currentFilteredList[currentCardIdx];
      if (item) playItem(item, 'def', event.currentTarget);
    });
    cardPlayExBtn.addEventListener('click', event => {
      const item = currentFilteredList[currentCardIdx];
      if (item) playItem(item, 'example', event.currentTarget);
    });
    restartQuizBtn.addEventListener('click', () => {
      quizScore = 0;
      quizStreak = 0;
      quizTotal = 0;
      updateQuizHud();
      loadQuizQuestion();
    });
    nextQuestionBtn.addEventListener('click', loadQuizQuestion);
    quizPlayPromptBtn.addEventListener('click', playQuizPrompt);
    restartDefQuizBtn.addEventListener('click', () => {
      defQuizScore = 0;
      defQuizStreak = 0;
      defQuizTotal = 0;
      updateDefQuizHud();
      loadDefQuizQuestion();
    });
    defNextQuestionBtn.addEventListener('click', loadDefQuizQuestion);
    defQuizPlayPromptBtn.addEventListener('click', playDefQuizPrompt);
    printPageBtn.addEventListener('click', () => window.print());
    copyTtsBtn.addEventListener('click', async () => {
      try {
        await navigator.clipboard.writeText(ttsScriptPreview.textContent);
        const original = copyTtsBtn.textContent;
        copyTtsBtn.textContent = 'Copied';
        setTimeout(() => { copyTtsBtn.textContent = original; }, 1500);
      } catch (error) {
        copyTtsBtn.textContent = 'Copy unavailable';
      }
    });
    downloadTtsBtn.addEventListener('click', () => downloadText(`vocabulary_unit${unitNum || 'N'}_tts.txt`, ttsScriptPreview.textContent, 'text/plain;charset=utf-8'));
    downloadJsonBtn.addEventListener('click', () => downloadText(`vocabulary_unit${unitNum || 'N'}_data.json`, JSON.stringify(vocabList, null, 2), 'application/json;charset=utf-8'));
    closeModalBtn.addEventListener('click', () => { wordModal.style.display = 'none'; });
    wordModal.addEventListener('click', event => {
      if (event.target === wordModal) wordModal.style.display = 'none';
    });
    document.addEventListener('keydown', event => {
      if (event.key === 'Escape') wordModal.style.display = 'none';
      if (!panels.cards.classList.contains('active')) return;
      if (event.code === 'ArrowRight') nextCardBtn.click();
      if (event.code === 'ArrowLeft') prevCardBtn.click();
    });
  }

  function init() {
    applyIdentity();
    setupCategories();
    renderTable();
    updateFlashcard();
    updateQuizHud();
    updateDefQuizHud();
    loadQuizQuestion();
    loadDefQuizQuestion();
    renderPrintable();
    ttsScriptPreview.textContent = buildTextScript();
    setupEvents();
  }

  unitData = await loadUnitData();
  init();
});
