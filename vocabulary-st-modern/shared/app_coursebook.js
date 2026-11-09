/**
 * UNIFIED COURSEBOOK ENGINE - GRADE 6 ENGLISH
 * Shared by Units 1–10 (vocabulary-st-modern/unitN/index.html)
 * 100% Offline-First · Zero External CDNs · Functional Pedagogy
 *
 * Implements FLL Rubric Standards:
 * - 1.1 Calibrated Input & Mastery Badging (via LearnerStore)
 * - 1.2 Typographical Salience for Grammatical Morphemes
 * - 1.4 Graduated Metalinguistic Feedback in Workbook Checking
 * - 2.1 Spatially Contiguous Tap-to-Gloss Popovers
 * - 2.2 Dual-Channel Modality Control (Listen-first default)
 * - 2.3 Clause / Line-Level Dialogue Replay & Looping
 * - 3.1 Modality-Decoupled Accessibility Toolbar
 * - 4.2 Spaced Repetition Queue Integration
 * - 4.3 Structured Self-Check Writing Checklists & Model Answers
 * - 5.1 Script-Aware Typography (lang="el" for all Greek text)
 * - 5.2 Pragmatic Register Badging
 */

document.addEventListener('DOMContentLoaded', async () => {
  const body = document.body;
  const unitNum = body.dataset.unit || '1';

  // Dynamic Asset Resolver: maps relative assets/* to ../../unit{N}/assets/*
  function resolveAsset(p) {
    if (!p) return p;
    if (typeof p === 'string' && p.startsWith('assets/')) {
      return `../../unit${unitNum}/` + p;
    }
    return p;
  }

  const v2DataKey = `UNIT${unitNum}_V2_DATA`;
  const workbookDataKey = `UNIT${unitNum}_WORKBOOK_DATA`;
  const vocabList = Array.isArray(window.VOCABULARY_DATA) ? window.VOCABULARY_DATA : [];
  let v2Data = {};
  let workbookData = null;
  let selectedVoice = 'neural';
  let playbackRate = 1;
  let currentAudio = null;
  let audioQueue = [];
  let audioTimer = null;
  let activePlayButton = null;
  let activeModule = '';
  let selectedWorksheet = 1;
  let activeCollocation = null;
  let challengeMode = 'greek';
  let challengeQuestion = null;
  let challengeScore = 0;
  let challengeStreak = 0;
  let challengeTotal = 0;
  let workbookActivities = [];

  const byId = id => document.getElementById(id);
  const escapeHtml = value => String(value ?? '').replace(/[&<>'"]/g, char => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', "'": '&#39;', '"': '&quot;' }[char]));
  const escapeAttribute = escapeHtml;
  const normalise = value => String(value ?? '').trim().toLowerCase().replace(/\s+/g, ' ');
  const toAudioId = value => String(value).padStart(2, '0');
  const filePart = value => String(value ?? '').toLowerCase().replace(/[^a-z0-9]+/g, '_').replace(/^_|_$/g, '');
  const array = value => Array.isArray(value) ? value : [];
  const escapeRegExp = value => String(value).replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  const uid = () => Math.random().toString(36).slice(2);

  // Greek L1 wrapper helper (Criterion 5.1)
  function el(text) {
    return `<span lang="el">${escapeHtml(text)}</span>`;
  }

  // Morphological salience helper (Criterion 1.2)
  function highlightMorphology(text) {
    if (!text) return '';
    let res = escapeHtml(text);
    // highlight -ing, am/is/are/'m/'s/'re, -ed, -s/-es
    res = res.replace(/\b(am|is|are|'m|'s|'re)\b/gi, '<span class="morph-highlight morph-be">$1</span>');
    res = res.replace(/(\b\w+)(ing)\b/gi, '$1<span class="morph-highlight morph-ing">$2</span>');
    res = res.replace(/(\b\w+)(ed)\b/gi, '$1<span class="morph-highlight morph-ed">$2</span>');
    return res;
  }

  function loadScript(src) {
    return new Promise(resolve => {
      if (!src) {
        resolve(false);
        return;
      }
      const script = document.createElement('script');
      script.src = src;
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.head.appendChild(script);
    });
  }

  async function loadData() {
    if (!/^\d+$/.test(unitNum)) return;
    if (!window[v2DataKey]) await loadScript(`../../unit${unitNum}/data/unit${unitNum}_v2_data.js`);
    if (window[v2DataKey]) v2Data = window[v2DataKey];
    if (!v2Data || Object.keys(v2Data).length === 0) {
      try {
        const response = await fetch(`../../unit${unitNum}/data/unit${unitNum}_v2_data.json`);
        if (response.ok) v2Data = await response.json();
      } catch (error) {
        v2Data = {};
      }
    }
    const workbookSrc = body.dataset.workbook || '';
    if (workbookSrc) {
      const src = workbookSrc.includes('/') ? workbookSrc : `../../unit${unitNum}/data/${workbookSrc}`;
      if (!window[workbookDataKey]) await loadScript(src);
      if (window[workbookDataKey]) workbookData = window[workbookDataKey];
      if (!workbookData) {
        try {
          const jsonSrc = src.replace(/\.js$/, '.json');
          const wbRes = await fetch(jsonSrc);
          if (wbRes.ok) workbookData = await wbRes.json();
        } catch (e) {}
      }
    }
    if (!workbookData && v2Data.workbook) workbookData = v2Data.workbook;
    workbookActivities = workbookData && Array.isArray(workbookData.activities) ? workbookData.activities : [];
  }

  function unitTitle() {
    return v2Data.unit_title || `Unit ${unitNum}`;
  }

  function unitLabel() {
    return `Unit ${unitNum}: ${unitTitle()}`;
  }

  function moduleShell(id, icon, title, description, bodyHtml, printSheet = '') {
    return `<section id="panel-${escapeAttribute(id)}" class="v2-panel" role="tabpanel" data-module="${escapeAttribute(id)}" hidden>
      <div class="panel-header-box no-print">
        <div><h2 class="panel-title">${escapeHtml(icon)} ${escapeHtml(title)}</h2><p class="panel-desc">${escapeHtml(description)}</p></div>
        ${printSheet ? `<div class="panel-actions"><button class="btn-print-module" type="button" data-print-module="${escapeAttribute(id)}" data-sheet="${escapeAttribute(printSheet)}"><span>📄</span> Print Worksheet ${escapeHtml(printSheet)}</button></div>` : ''}
      </div>
      <div class="module-body">${bodyHtml}</div>
    </section>`;
  }

  function buildModules() {
    const stories = array(v2Data.stories || v2Data.dossiers);
    const grammar = v2Data.grammar_lab && typeof v2Data.grammar_lab === 'object' ? v2Data.grammar_lab : null;
    const collocations = array(v2Data.collocations);
    const challenge = normaliseChallenge(v2Data.definition_challenge || v2Data.crossword);
    const writing = normaliseWriting(v2Data.report_builder_guide || v2Data.writing_workshop);
    const truthItems = array(v2Data.content_true_false || v2Data.geography_true_false);
    const worksheets = normaliseWorksheets(v2Data.worksheets) || deriveWorksheets({ stories, grammar, collocations, challenge, writing, truthItems });
    const canDo = normaliseCanDo(v2Data.can_do || v2Data.passport || v2Data.can_do_statements, { stories, grammar, collocations, writing, truthItems });
    const notes = array(v2Data.teacher_notes);
    const modules = [];

    if (stories.length) modules.push({ id: 'stories', icon: '📚', title: 'Reading Dossiers', description: 'Explore each narrative, connected text, vocabulary, and real-world details.', render: renderStories });
    if (grammar && grammarHasContent(grammar)) modules.push({ id: 'grammar', icon: '🧪', title: 'Grammar Lab', description: grammar.title || grammar.theme || 'Discover language patterns and practise the target structures.', render: renderGrammar, printSheet: '2' });
    if (collocations.length || challenge) modules.push({ id: 'collocations', icon: '🧩', title: 'Words in Partnership', description: 'Match natural word partners and guess terms from their definitions.', render: renderCollocations, printSheet: '3' });
    if (writing) modules.push({ id: 'writing', icon: '✍️', title: 'Writing Workshop', description: writing.title || writing.genre || 'Build a guided text step by step and preview the finished page.', render: renderWriting, printSheet: '4' });
    if (truthItems.length || vocabList.length >= 2) modules.push({ id: 'practice', icon: '🎧', title: 'Practice Arena', description: 'Check key facts and practise vocabulary with interactive audio challenges.', render: renderPractice });
    if (worksheets) modules.push({ id: 'worksheets', icon: '🖨️', title: 'Printable Worksheets', description: worksheets.title || 'Print the complete classroom worksheet pack.', render: renderWorksheets });
    if (canDo) modules.push({ id: 'passport', icon: '🎖️', title: 'Can-Do Passport', description: canDo.title || 'Track what you can do and self-assess your progress.', render: renderPassport });
    if (workbookActivities.length) modules.push({ id: 'workbook', icon: '📓', title: 'Workbook', description: workbookData.title || 'Complete activities in printed book order.', render: renderWorkbook });
    if (notes.length || array(v2Data.book_checks).length) modules.push({ id: 'notes', icon: '🧑‍🏫', title: 'Teacher Notes', description: 'Fact checks, book corrections, and teaching guidance.', render: renderNotes });
    return modules;
  }

  function applyIdentity() {
    document.title = `${unitLabel()} | Coursebook`;
    document.querySelectorAll('.shell-unit-label').forEach(el => { el.textContent = unitLabel(); });
    document.querySelectorAll('.shell-unit-title').forEach(el => { el.textContent = unitTitle(); });
    document.querySelectorAll('.shell-unit-subtitle').forEach(el => { el.textContent = v2Data.subtitle || v2Data.unit_subtitle || 'Interactive Coursebook Lesson'; });
    document.querySelectorAll('.shell-footer-title').forEach(el => { el.textContent = `English 6th Grade • ${unitLabel()}`; });
  }

  function getVocabAudioPath(type, padId) {
    const base = selectedVoice === 'neural' ? `../../unit${unitNum}/assets/audio_neural` : `../../unit${unitNum}/assets/audio`;
    if (type === 'def') return `${base}/defs/${padId}_definition.mp3`;
    if (type === 'example') return `${base}/examples/${padId}_example.mp3`;
    return `${base}/words/${padId}_word.mp3`;
  }

  function stopAudio() {
    if (audioTimer) clearTimeout(audioTimer);
    audioTimer = null;
    audioQueue = [];
    if (currentAudio) {
      currentAudio.onended = null;
      currentAudio.onerror = null;
      currentAudio.pause();
      currentAudio = null;
    }
    if (activePlayButton) activePlayButton.classList.remove('playing');
    activePlayButton = null;
    const hud = byId('audioHud');
    if (hud) hud.style.display = 'none';
  }

  function playAudioSequence(srcs, typeName, trackTitle, triggerButton = null) {
    stopAudio();
    const queue = (Array.isArray(srcs) ? srcs : [srcs]).filter(Boolean);
    const hud = byId('audioHud');
    if (!queue.length || !hud) return;
    audioQueue = queue.slice();
    if (triggerButton) {
      activePlayButton = triggerButton;
      triggerButton.classList.add('playing');
    }
    byId('hudAudioType').textContent = typeName;
    byId('hudAudioTitle').textContent = trackTitle;
    hud.style.display = 'block';
    byId('hudPauseBtn').textContent = '⏸️';

    const playNext = () => {
      if (!audioQueue.length) {
        stopAudio();
        return;
      }
      const src = audioQueue.shift();
      currentAudio = new Audio(src);
      currentAudio.playbackRate = playbackRate;
      currentAudio.onended = () => {
        if (audioQueue.length) audioTimer = setTimeout(playNext, 350);
        else stopAudio();
      };
      currentAudio.onerror = stopAudio;
      currentAudio.play().catch(stopAudio);
    };
    playNext();
  }

  function playAudioFile(src, typeName, trackTitle, triggerButton = null) {
    playAudioSequence([src], typeName, trackTitle, triggerButton);
  }

  function playSpeechLine(text, triggerButton = null) {
    stopAudio();
    if (window.speechSynthesis) {
      window.speechSynthesis.cancel();
      const u = new SpeechSynthesisUtterance(text);
      u.lang = 'en-GB';
      u.rate = playbackRate;
      if (triggerButton) triggerButton.classList.add('playing');
      u.onend = () => { if (triggerButton) triggerButton.classList.remove('playing'); };
      u.onerror = () => { if (triggerButton) triggerButton.classList.remove('playing'); };
      window.speechSynthesis.speak(u);
    }
  }

  function setupAudio() {
    byId('hudStopBtn')?.addEventListener('click', stopAudio);
    byId('hudPauseBtn')?.addEventListener('click', () => {
      if (!currentAudio) return;
      if (currentAudio.paused) {
        currentAudio.play();
        byId('hudPauseBtn').textContent = '⏸️';
      } else {
        currentAudio.pause();
        byId('hudPauseBtn').textContent = '▶️';
      }
    });
    byId('v2VoiceSelect')?.addEventListener('change', event => {
      selectedVoice = event.target.value;
      stopAudio();
    });
    byId('v2SpeedSelect')?.addEventListener('change', event => {
      playbackRate = Number(event.target.value) || 1;
      if (currentAudio) currentAudio.playbackRate = playbackRate;
    });

    // Accessibility modal trigger
    byId('topA11yBtn')?.addEventListener('click', () => {
      if (window.LearnerStore) window.LearnerStore.openA11yModal();
    });
  }

  function setupNavigation(modules) {
    const tabs = byId('moduleTabs');
    const panels = byId('v2Panels');
    if (!tabs || !panels) return;
    tabs.innerHTML = modules.map((module, index) => `<button class="v2-tab${index === 0 ? ' active' : ''}" type="button" role="tab" data-tab="${escapeAttribute(module.id)}" aria-selected="${index === 0 ? 'true' : 'false'}"><span class="tab-icon">${escapeHtml(module.icon)}</span> ${escapeHtml(module.title)}</button>`).join('');
    panels.innerHTML = modules.map(module => moduleShell(module.id, module.icon, module.title, module.description, module.render(), module.printSheet || '')).join('');
    activeModule = modules[0]?.id || '';
    switchModule(activeModule, false);
    tabs.addEventListener('click', event => {
      const tab = event.target.closest('[data-tab]');
      if (tab) switchModule(tab.dataset.tab, true);
    });
    panels.addEventListener('click', event => {
      const printButton = event.target.closest('[data-print-module]');
      if (!printButton) return;
      switchModule('worksheets', false);
      selectWorksheet(Number(printButton.dataset.sheet) || 1);
      setTimeout(() => window.print(), 150);
    });
    const notesModule = modules.find(module => module.id === 'notes');
    const worksheetModule = modules.find(module => module.id === 'worksheets');
    if (byId('topTeacherNotesBtn')) byId('topTeacherNotesBtn').hidden = !notesModule;
    if (byId('topPrintPackBtn')) byId('topPrintPackBtn').hidden = !worksheetModule;
    byId('topTeacherNotesBtn')?.addEventListener('click', () => {
      if (!notesModule) return;
      switchModule('notes', true);
      byId('panel-notes')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    });
    byId('topPrintPackBtn')?.addEventListener('click', () => {
      switchModule('worksheets', false);
      showAllWorksheetsForPrint();
      setTimeout(() => window.print(), 150);
    });
  }

  function switchModule(moduleId, scroll) {
    if (!document.querySelector(`[data-tab="${CSS.escape(moduleId)}"]`)) return;
    activeModule = moduleId;
    document.querySelectorAll('.v2-tab').forEach(tab => {
      const selected = tab.dataset.tab === moduleId;
      tab.classList.toggle('active', selected);
      tab.setAttribute('aria-selected', selected ? 'true' : 'false');
      tab.tabIndex = selected ? 0 : -1;
    });
    document.querySelectorAll('.v2-panel').forEach(panel => {
      const selected = panel.dataset.module === moduleId;
      panel.classList.toggle('active', selected);
      panel.hidden = !selected;
    });
    if (moduleId === 'challenges' || moduleId === 'practice') startChallenge();
    if (moduleId === 'worksheets') selectWorksheet(selectedWorksheet);
    if (scroll) window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  function normaliseChallenge(value) {
    if (!value || typeof value !== 'object') return null;
    const first = array(value.group_a || value.across);
    const second = array(value.group_b || value.down);
    if (!first.length && !second.length) return null;
    return { title: value.title || 'Definitions Challenge', note: value.note || '', first, second };
  }

  function normaliseWriting(value) {
    if (!value || typeof value !== 'object') return null;
    const sections = array(value.paragraphs || value.sections);
    if (!sections.length) return null;
    return {
      title: value.title || 'Guided Writing Workshop',
      genre: value.genre || 'Guided Text',
      defaultTopic: value.default_topic || value.topic || '',
      defaultAuthor: value.default_author || '',
      projectLabel: value.project_label || 'Project',
      checklist: array(value.checklist || [
        'Check capital letters for countries, cities, and languages',
        'Verify correct present/past tense endings (-s, -ing, -ed)',
        'Include at least two linking connectors (because, so, but, also)'
      ]),
      modelAnswer: value.model_answer || value.model_text || '',
      sections
    };
  }

  function normaliseWorksheets(value) {
    if (!value) return null;
    const sheets = Array.isArray(value) ? value : array(value.sheets);
    if (!sheets.length) return null;
    return { title: value.title || 'Printable Worksheets Pack', sheets: sheets.map((sheet, index) => ({ id: sheet.id || index + 1, title: sheet.title || `Worksheet ${index + 1}`, lesson: sheet.lesson || '', sections: array(sheet.sections) })) };
  }

  function normaliseCanDo(value, availability) {
    const statements = value && !Array.isArray(value) ? array(value.statements) : array(value);
    if (statements.length) return { title: value?.title || 'Can-Do Passport', statements };
    const generated = [];
    if (availability.stories.length) generated.push({ id: 'reading', title: 'Reading Comprehension', statement: 'I can read the unit texts and understand the main points and key lexis.', badge: '📚' });
    if (availability.grammar) generated.push({ id: 'grammar', title: 'Grammar in Action', statement: 'I can recognise and use the target grammar structures in context.', badge: '🧪' });
    if (availability.collocations.length || availability.challenge) generated.push({ id: 'lexis', title: 'Vocabulary & Collocations', statement: 'I can match natural word partnerships and explain word definitions.', badge: '🧩' });
    if (availability.writing) generated.push({ id: 'writing', title: 'Writing & Production', statement: 'I can plan, draft, and complete the unit writing task.', badge: '✍️' });
    return generated.length ? { title: 'Can-Do Passport', statements: generated } : null;
  }

  function normaliseBookCheck(value) {
    if (!value) return null;
    if (typeof value === 'string') return { title: 'Book check', note: value };
    return { title: value.title || 'Book check', note: value.note || '' };
  }

  function renderBookCheck(value) {
    const check = normaliseBookCheck(value);
    if (!check || !check.note) return '';
    return `<div class="book-check-box"><span class="book-check-badge">📖 Book check</span><span class="book-check-text"><strong>${escapeHtml(check.title)}:</strong> ${escapeHtml(check.note)}</span></div>`;
  }

  function storyImageCandidates(story) {
    const id = filePart(story.id);
    const student = filePart(story.student || story.title || 'profile');
    const values = [story.image, story.image_path, story.image_key, `assets/images_v2/${student}_${id}.svg`, `assets/images_v2/${id}.svg`, `assets/images_v2/${id}.webp`].filter(Boolean).map(resolveAsset);
    return [...new Set(values.filter(Boolean))];
  }

  function storyLabel(story) {
    if (story.title) return story.title;
    return [story.student, story.country || story.topic || story.context].filter(Boolean).join(' — ');
  }

  function storyAudioPath(story) {
    return resolveAsset(story.audio_file || story.audio || `assets/audio_v2/stories/${story.id}_full_story.mp3`);
  }

  // Criterion 2.1 & 1.1: Interactive Tap-to-Gloss Popovers
  function highlightVocabulary(text) {
    let result = escapeHtml(text);
    vocabList.forEach(item => {
      if (!item.word || item.word.length < 2) return;
      const mastery = window.LearnerStore ? window.LearnerStore.getWordMastery(unitNum, item.id) : { isMastered: false };
      const isMastered = mastery.isMastered;
      const regex = new RegExp(`\\b(${escapeRegExp(escapeHtml(item.word))})\\b`, 'gi');
      result = result.replace(regex, `<span class="gloss-term${isMastered ? ' is-mastered' : ''}" tabindex="0" data-gloss-id="${item.id}" data-word="${escapeAttribute(item.word)}" data-pos="${escapeAttribute(item.pos || '')}" data-greek="${escapeAttribute(item.meaning_gr || '')}" data-def="${escapeAttribute(item.definition_en || item.definition || '')}">$1</span>`);
    });
    return result;
  }

  function resolveLandmarkVocabulary(landmark) {
    let item = null;
    if (landmark.word_key) item = vocabList.find(entry => entry.word.toLowerCase() === landmark.word_key.toLowerCase());
    if (!item && landmark.word_id) item = vocabList.find(entry => String(entry.id) === String(landmark.word_id));
    return item;
  }

  function renderStories() {
    const stories = array(v2Data.stories || v2Data.dossiers);
    return `<div class="story-module">
      <div class="country-pills-row no-print" id="storyPills">${stories.map((story, index) => `<button class="country-pill${index === 0 ? ' active' : ''}" type="button" data-story-id="${escapeAttribute(story.id)}">${escapeHtml(story.flag || '📘')} ${escapeHtml(storyLabel(story))}</button>`).join('')}</div>
      <div id="storyDossier" class="story-dossier-card"></div>
    </div>`;
  }

  function renderStory(story) {
    if (!story) return '';
    const candidates = storyImageCandidates(story);
    const image = candidates.length ? `<img src="${escapeAttribute(candidates[0])}" data-image-fallbacks="${escapeAttribute(candidates.slice(1).join('|'))}" alt="${escapeAttribute(story.alt || storyLabel(story))}">` : '';
    const metaEntries = [
      story.capital && ['Capital', story.capital],
      story.hometown && ['Hometown', story.hometown],
      story.nationality && ['Nationality', story.nationality],
      story.topic && ['Topic', story.topic]
    ].filter(Boolean);
    return `<div class="dossier-hero-row"><div class="dossier-visual-box">${image}</div><div class="dossier-title-area"><span class="dossier-kicker">${escapeHtml(story.kicker || story.lesson || 'Reading profile')}</span><h2 class="dossier-heading">${escapeHtml(story.flag || '')} ${escapeHtml(storyLabel(story))}</h2><div class="dossier-meta-tags">${metaEntries.map(([label, value]) => `<span class="dossier-meta-badge">${escapeHtml(label)}: <strong>${escapeHtml(value)}</strong></span>`).join('')}</div><p class="dossier-summary">${escapeHtml(story.summary || '')}</p><button class="play-full-story-btn" type="button" data-audio-src="${escapeAttribute(storyAudioPath(story))}" data-audio-title="${escapeAttribute(storyLabel(story))}">🔊 Listen to the full text</button></div></div>
      <div class="story-narrative-box">${highlightVocabulary(story.narrative || story.text || '')}</div>
      ${renderBookCheck(story.book_check)}
      ${array(story.vocabulary_ids).length ? `<div class="story-lexis-bar"><strong>📖 Vocabulary in this text</strong>${story.vocabulary_ids.map(id => {
        const item = vocabList.find(entry => String(entry.id) === String(id));
        return item ? vocabButton(item) : '';
      }).join('')}</div>` : ''}
      ${array(story.landmarks).length ? `<h3 class="landmarks-section-title">🔗 Key Items & Vocabulary in Focus</h3><div class="landmarks-grid">${story.landmarks.map(landmark => {
        const item = resolveLandmarkVocabulary(landmark);
        return `<div class="landmark-card"><div class="landmark-header"><div class="landmark-title">${escapeHtml(landmark.name || '')}</div>${item ? vocabButton(item) : ''}</div><div class="landmark-type">${escapeHtml(landmark.type || '')}</div><p class="landmark-desc">${escapeHtml(landmark.desc || '')}</p></div>`;
      }).join('')}</div>` : ''}`;
  }

  function vocabButton(item) {
    return `<button class="audio-chip-btn" type="button" data-vocab-id="${escapeAttribute(item.id)}" data-word="${escapeAttribute(item.word)}">🔊 ${escapeHtml(item.word)}</button>`;
  }

  function setupStoryImages(container) {
    container.querySelectorAll('img[data-image-fallbacks]').forEach(image => {
      image.addEventListener('error', () => {
        const fallbacks = image.dataset.imageFallbacks.split('|').filter(Boolean);
        if (fallbacks.length) image.src = fallbacks.shift();
        else image.style.display = 'none';
      });
    });
  }

  function setupStoryModule() {
    const pills = byId('storyPills');
    const dossier = byId('storyDossier');
    if (!pills || !dossier) return;
    const stories = array(v2Data.stories || v2Data.dossiers);
    const showStory = id => {
      const story = stories.find(entry => String(entry.id) === String(id)) || stories[0];
      pills.querySelectorAll('.country-pill').forEach(pill => pill.classList.toggle('active', pill.dataset.storyId === String(story.id)));
      dossier.innerHTML = renderStory(story);
      setupStoryImages(dossier);
    };
    pills.addEventListener('click', event => {
      const pill = event.target.closest('[data-story-id]');
      if (pill) showStory(pill.dataset.storyId);
    });
    showStory(stories[0]?.id);

    // Setup Tap-to-Gloss Popovers (Criterion 2.1)
    dossier.addEventListener('click', event => {
      const term = event.target.closest('.gloss-term');
      if (!term) {
        document.querySelectorAll('.gloss-popover').forEach(p => p.remove());
        return;
      }
      document.querySelectorAll('.gloss-popover').forEach(p => p.remove());
      const wordId = term.dataset.glossId;
      const word = term.dataset.word;
      const pos = term.dataset.pos;
      const greek = term.dataset.greek;
      const def = term.dataset.def;
      const padId = toAudioId(wordId);
      const audioSrc = getVocabAudioPath('word', padId);

      const popover = document.createElement('div');
      popover.className = 'gloss-popover';
      popover.innerHTML = `
        <strong>${escapeHtml(word)}</strong> ${pos ? `<em>(${escapeHtml(pos)})</em>` : ''}
        <span class="gloss-greek" lang="el">${escapeHtml(greek)}</span>
        ${def ? `<br><small style="color:#CBD5E1">${escapeHtml(def)}</small>` : ''}
        <button type="button" class="gloss-audio-btn" data-audio-src="${escapeAttribute(audioSrc)}" data-audio-title="${escapeAttribute(word)}">🔊</button>
        <button type="button" class="gloss-add-review-btn" style="background:#0284C7;color:#fff;border:none;border-radius:4px;padding:2px 6px;margin-left:6px;font-size:0.75rem;cursor:pointer;" title="Add to Spaced Review Queue">Add to Review</button>
      `;

      term.style.position = 'relative';
      term.appendChild(popover);

      popover.querySelector('.gloss-add-review-btn')?.addEventListener('click', (e) => {
        e.stopPropagation();
        if (window.LearnerStore) {
          window.LearnerStore.scheduleReview(unitNum, wordId, { word, meaning_gr: greek }, 1);
          e.currentTarget.textContent = '✓ Added';
        }
      });
    });
  }

  function listeningComponents(grammar) {
    const values = [grammar.school_lab_listening, grammar.classroom_listening, grammar.authentic_listening].filter(Boolean);
    return values.flatMap(value => Array.isArray(value) ? value : [value]);
  }

  function grammarHasContent(grammar) {
    if (!grammar) return false;
    const keys = ['rules', 'target_structures', 'practice_items', 'frequency_spectrum', 'school_lab_actions', 'charades_game', 'communicative_game', 'school_lab_listening', 'classroom_listening', 'authentic_listening'];
    return keys.some(key => Array.isArray(grammar[key]) ? grammar[key].length : Boolean(grammar[key]));
  }

  function renderGrammar() {
    const grammar = v2Data.grammar_lab || {};
    const parts = [];
    const targets = array(grammar.target_structures);
    if (targets.length) parts.push(`<div class="grammar-card full-width"><div class="grammar-card-header"><h3>🎯 Target Language</h3></div><div class="target-structure-list">${targets.map(target => `<span class="connector-chip">${escapeHtml(target)}</span>`).join('')}</div></div>`);
    const rules = array(grammar.rules);
    if (rules.length) parts.push(`<div class="grammar-card full-width"><div class="grammar-card-header"><h3>📐 Patterns in the Examples</h3></div><div class="grammar-rules-grid">${rules.map(rule => `<div class="grammar-rule-card"><h4>${escapeHtml(rule.concept || rule.tense || rule.title || 'Rule')}</h4><p>${escapeHtml(rule.usage || rule.explanation || '')}</p>${array(rule.signal_words).length ? `<div class="step-connectors"><span>Signals:</span>${array(rule.signal_words).map(word => `<span class="connector-chip">${escapeHtml(word)}</span>`).join('')}</div>` : ''}<ul>${array(rule.examples).map(example => `<li>${highlightMorphology(example)}</li>`).join('')}</ul></div>`).join('')}</div></div>`);
    const practice = array(grammar.practice_items);
    if (practice.length) parts.push(`<div class="grammar-card full-width"><div class="grammar-card-header"><h3>🧩 Guided Practice</h3></div><div class="practice-list">${practice.map((item, index) => `<div class="practice-item"><strong>${escapeHtml(item.sentence || item.prompt || '')}</strong><div class="practice-options">${array(item.options).map(option => `<button type="button" class="practice-option" data-practice-index="${index}" data-practice-answer="${escapeAttribute(option)}">${escapeHtml(option)}</button>`).join('')}</div><div class="practice-feedback" data-practice-feedback="${index}"></div></div>`).join('')}</div></div>`);

    // Criterion 2.2 & 2.3 & 5.2: Listening Modality Controls, Line Replay, Register Badge
    listeningComponents(grammar).forEach((listening, listeningIndex) => {
      const script = array(listening.dialogue_script);
      const quiz = array(listening.true_false_quiz || listening.content_true_false);
      const projects = array(listening.pupil_projects);
      const targetsData = array(listening.target_verbs);
      const audio = resolveAsset(listening.audio_file || listening.audio);
      const registerInfo = listening.register || v2Data.register || null;

      parts.push(`<div class="grammar-card full-width" data-listening-index="${listeningIndex}">
        <div class="grammar-card-header">
          <span class="badge lab-badge">${escapeHtml(listening.label || 'Listening task')}</span>
          ${registerInfo ? `<span class="register-badge">🗣️ Context: ${escapeHtml(registerInfo.context || registerInfo.to || 'Conversation')} · ${escapeHtml(registerInfo.tone || 'Polite')}</span>` : ''}
          <h3>🎧 ${escapeHtml(listening.title || 'Listening Activity')}</h3>
          ${listening.instructions ? `<p>${escapeHtml(listening.instructions)}</p>` : ''}
        </div>
        ${audio ? `<div class="listening-controls">
          <button class="play-full-story-btn" type="button" data-audio-src="${escapeAttribute(audio)}" data-audio-title="${escapeAttribute(listening.title || 'Listening')}">🔊 Listen (Full Recording)</button>
          ${script.length ? `<button class="v1-switch-btn" type="button" data-toggle-transcript>📜 Show English Transcript</button><button class="v1-switch-btn" type="button" data-toggle-greek>🇬🇷 Peek Greek Bridge</button>` : ''}
        </div>
        ${script.length ? `<div class="lab-transcript" data-transcript hidden>
          <div class="transcript-instruction" style="font-size:0.85rem;color:#64748B;margin-bottom:8px;">Listen line by line or loop difficult sentences:</div>
          ${script.map((turn, tIdx) => `<div class="transcript-line" style="display:flex;align-items:flex-start;gap:8px;margin-bottom:8px;">
            <button type="button" class="line-replay-btn" data-line-text="${escapeAttribute(turn.text)}" title="Replay this line" style="padding:2px 8px;border:1.5px solid #0F172A;border-radius:4px;cursor:pointer;background:#F1F5F9;">▶</button>
            <div><strong>${escapeHtml(turn.speaker || '')}:</strong> ${escapeHtml(turn.text || '')}
              ${turn.greek ? `<div class="line-greek" lang="el" style="display:none;color:#64748B;font-size:0.9rem;">${escapeHtml(turn.greek)}</div>` : ''}
            </div>
          </div>`).join('')}
        </div>` : ''}` : ''}
        ${projects.length ? `<div class="lab-station-list">${projects.map(project => `<div class="lab-station-row"><div class="student-avatar">${escapeHtml((project.pupil || '?').charAt(0))}</div><div class="station-content"><strong>${escapeHtml(project.pupil || '')}</strong><p>${escapeHtml(project.subject || '')}: ${escapeHtml(project.topic || '')}</p><p>${escapeHtml(project.actions || '')}</p></div></div>`).join('')}</div>` : ''}
        ${targetsData.length ? `<div class="target-verb-list">${targetsData.map(target => `<span class="connector-chip"><strong>${escapeHtml(target.verb)}</strong> — ${escapeHtml(target.action || '')}</span>`).join('')}</div>` : ''}
        ${quiz.length ? renderTruthChecklist(quiz, `listening-${listeningIndex}`) : ''}
      </div>`);
    });

    const actions = array(grammar.school_lab_actions || grammar.scene_actions);
    if (actions.length) parts.push(`<div class="grammar-card full-width"><div class="grammar-card-header"><h3>🧑‍🎓 Action Cards</h3></div><div class="lab-scene-container">${actions.map(action => `<div class="lab-station-row"><div class="student-avatar">${escapeHtml((action.student || '?').charAt(0))}</div><div class="station-content"><div class="station-now"><span class="badge freq-badge">${escapeHtml(action.subject || action.context || 'Context')}</span> <strong>${escapeHtml(action.student || '')}</strong> ${escapeHtml(action.action_now || action.present || '')}</div>${action.habit || action.routine ? `<div class="station-habit">${escapeHtml(action.habit || action.routine)}</div>` : ''}${action.enrichment_note ? `<div class="enrichment-note">${escapeHtml(action.enrichment_note)}</div>` : ''}</div></div>`).join('')}</div></div>`);
    const timeline = array(grammar.story_timeline || Object.values(grammar).find(value => Array.isArray(value) && value.some(item => item && item.routine && item.today)));
    if (timeline.length) parts.push(`<div class="grammar-card full-width"><div class="grammar-card-header"><h3>🕒 Contrast Timeline</h3></div><div class="badluck-timeline">${timeline.map(item => `<div class="badluck-moment"><div class="moment-time-row"><span>${escapeHtml(item.time || '')}</span></div><div class="moment-routine">${escapeHtml(item.routine || '')}</div><div class="moment-today">${escapeHtml(item.today || item.action || '')}</div></div>`).join('')}</div></div>`);
    const frequency = array(grammar.frequency_spectrum);
    if (frequency.length) parts.push(`<div class="grammar-card full-width"><div class="grammar-card-header"><h3>📊 Frequency Spectrum</h3></div><div class="frequency-spectrum-bar">${frequency.map(item => `<div class="freq-card"><div class="freq-pct">${escapeHtml(item.percent)}%</div><div class="freq-adverb">${escapeHtml(item.adverb)}</div><p class="freq-sentence">${escapeHtml(item.example)}</p></div>`).join('')}</div></div>`);
    const game = grammar.charades_game || grammar.communicative_game;
    const prompts = array(game?.prompts || game?.cards);
    if (prompts.length) parts.push(`<div class="grammar-card full-width" data-game><div class="grammar-card-header"><span class="badge lab-badge">Communicative game</span><h3>🎲 ${escapeHtml(game.title || 'Draw a Card')}</h3>${game.instructions ? `<p>${escapeHtml(game.instructions)}</p>` : ''}</div><div class="game-card-display"><strong id="gameCardDisplay">Draw a card to begin.</strong><p id="gameCardDetail"></p></div><button class="play-full-story-btn" type="button" id="nextGameCard">🎲 Draw Card</button></div>`);
    return `<div class="grammar-layout">${parts.join('')}</div>`;
  }

  function renderTruthChecklist(items, idPrefix) {
    return `<div class="truth-check" data-truth-group="${escapeAttribute(idPrefix)}"><div class="truth-score">Solved: 0 / ${items.length}</div>${items.map((item, index) => `<div class="truth-item" data-truth-item="${idPrefix}-${index}"><span>${escapeHtml(item.statement || item.fact)}</span><div><button type="button" class="btn-tf" data-truth-value="true">TRUE</button><button type="button" class="btn-tf" data-truth-value="false">FALSE</button></div><div class="truth-feedback" data-truth-feedback="${idPrefix}-${index}"></div></div>`).join('')}</div>`;
  }

  function setupTruthChecks(container) {
    container.querySelectorAll('[data-truth-group]').forEach(group => {
      const items = array(v2Data.content_true_false || v2Data.geography_true_false);
      const listeningItems = listeningComponents(v2Data.grammar_lab || {}).flatMap(listening => array(listening.true_false_quiz || listening.content_true_false));
      const pool = group.dataset.truthGroup.startsWith('listening-') ? listeningItems : items;
      const score = group.querySelector('.truth-score');
      group.addEventListener('click', event => {
        const button = event.target.closest('.btn-tf');
        if (!button) return;
        const row = button.closest('.truth-item');
        const index = Number((row.dataset.truthItem.match(/-(\d+)$/) || [0, 0])[1]);
        const item = pool[index];
        if (!item) return;
        const answer = button.dataset.truthValue === 'true';
        const correct = answer === Boolean(item.answer);
        row.querySelectorAll('.btn-tf').forEach(item => { item.disabled = true; });
        button.classList.add(correct ? 'is-correct' : 'is-retry');
        const feedback = row.querySelector('.truth-feedback');
        feedback.textContent = item.explanation || (correct ? 'Correct.' : 'Check the text again.');
        feedback.className = `truth-feedback ${correct ? 'is-correct' : 'is-retry'}`;
        group.querySelectorAll('.truth-item').forEach(entry => entry.classList.remove('solved'));
        group.querySelectorAll('.truth-item').forEach(entry => {
          if (entry.querySelector('.btn-tf:disabled')) entry.classList.add('solved');
        });
        if (score) score.textContent = `Solved: ${group.querySelectorAll('.truth-item.solved').length} / ${pool.length}`;
      });
    });
  }

  function setupGrammarModule() {
    const container = byId('panel-grammar .module-body');
    if (!container) return;
    const practice = array(v2Data.grammar_lab?.practice_items);
    container.addEventListener('click', event => {
      const practiceButton = event.target.closest('.practice-option');
      if (practiceButton) {
        const item = practice[Number(practiceButton.dataset.practiceIndex)];
        const feedback = container.querySelector(`[data-practice-feedback="${practiceButton.dataset.practiceIndex}"]`);
        const correct = normalise(practiceButton.dataset.practiceAnswer) === normalise(item.answer);
        container.querySelectorAll(`[data-practice-index="${practiceButton.dataset.practiceIndex}"]`).forEach(button => { button.disabled = true; button.classList.add(button === practiceButton && correct ? 'is-correct' : 'is-retry'); });
        feedback.textContent = item.explanation || (correct ? 'Correct.' : 'Check the pattern and try another example.');
        feedback.className = `practice-feedback ${correct ? 'is-correct' : 'is-retry'}`;
        return;
      }
      const transcriptButton = event.target.closest('[data-toggle-transcript]');
      if (transcriptButton) {
        const card = transcriptButton.closest('[data-listening-index]');
        const transcript = card?.querySelector('[data-transcript]');
        if (transcript) {
          transcript.hidden = !transcript.hidden;
          transcriptButton.textContent = transcript.hidden ? '📜 Show English Transcript' : '📜 Hide Transcript';
        }
        return;
      }
      const greekButton = event.target.closest('[data-toggle-greek]');
      if (greekButton) {
        const card = greekButton.closest('[data-listening-index]');
        const greeks = card?.querySelectorAll('.line-greek');
        greeks?.forEach(g => {
          g.style.display = g.style.display === 'none' ? 'block' : 'none';
        });
        return;
      }
      const lineReplay = event.target.closest('.line-replay-btn');
      if (lineReplay) {
        playSpeechLine(lineReplay.dataset.lineText, lineReplay);
        return;
      }
      if (event.target.closest('#nextGameCard')) drawGameCard();
    });
    setupTruthChecks(container);
  }

  function drawGameCard() {
    const game = v2Data.grammar_lab?.charades_game || v2Data.grammar_lab?.communicative_game;
    const prompts = array(game?.prompts || game?.cards);
    if (!prompts.length) return;
    const prompt = prompts[Math.floor(Math.random() * prompts.length)];
    byId('gameCardDisplay').textContent = prompt.action || prompt.prompt || prompt.term || '';
    byId('gameCardDetail').textContent = [prompt.question, prompt.affirmative, prompt.negative].filter(Boolean).join(' • ');
  }

  function renderCollocations() {
    const collocations = array(v2Data.collocations);
    const challenge = normaliseChallenge(v2Data.definition_challenge || v2Data.crossword);
    const collocationHtml = collocations.length ? `<div class="collocation-game-card"><div class="game-header"><h3>🔗 Collocation Matcher</h3><p>Choose each word and then its natural partner.</p></div><div class="collocation-matcher-grid" id="collocationMatcher">${collocations.map((item, index) => `<button class="matcher-item verb-item" type="button" data-collocation-id="${index}" data-collocation-type="left">${escapeHtml(item.verb || item.left || item.first || '')}</button>`).join('')}${collocations.map((item, index) => `<button class="matcher-item partner-item" type="button" data-collocation-id="${index}" data-collocation-type="right">${escapeHtml(item.partner || item.right || item.second || '')}</button>`).sort(() => Math.random() - 0.5).join('')}</div><div class="matcher-feedback" id="collocationFeedback" style="display:none;"></div></div>` : '';
    const challengeHtml = challenge ? `<div class="crossword-game-card"><div class="game-header"><div class="crossword-title-row"><h3>🧠 ${escapeHtml(challenge.title)}</h3><span class="crossword-score" id="definitionScore">Solved: 0 / ${challenge.first.length + challenge.second.length}</span></div><p>${escapeHtml(challenge.note)}</p></div><div class="crossword-clues-columns">${challenge.first.length ? `<div class="clues-block"><h4>Clue Group A</h4><ul class="clues-list">${challenge.first.map((clue, index) => renderClue(clue, `a-${index}`)).join('')}</ul></div>` : ''}${challenge.second.length ? `<div class="clues-block"><h4>Clue Group B</h4><ul class="clues-list">${challenge.second.map((clue, index) => renderClue(clue, `b-${index}`)).join('')}</ul></div>` : ''}</div></div>` : '';
    return `<div class="collocations-layout">${collocations.length && challenge ? `${collocationHtml}${challengeHtml}` : collocationHtml || challengeHtml}</div>`;
  }

  function renderClue(clue, index) {
    const clean = String(clue.word || '').toLowerCase();
    const item = vocabList.find(entry => entry.word.toLowerCase() === clean || entry.word.toLowerCase() === clean.replace(/s$/, ''));
    return `<li class="clue-item" data-clue-index="${escapeAttribute(index)}"><span><strong>${escapeHtml(clue.number || '')}.</strong> ${escapeHtml(clue.clue || '')}</span><div>${item ? `<button class="audio-chip-btn clue-audio-btn" type="button" data-vocab-id="${escapeAttribute(item.id)}" data-word="${escapeAttribute(item.word)}">🔊 Hint</button>` : ''}<button class="clue-solve-btn" type="button" data-reveal-word="${escapeAttribute(clue.word || '')}">💡 Reveal Word</button></div></li>`;
  }

  function setupCollocations() {
    const matcher = byId('collocationMatcher');
    const feedback = byId('collocationFeedback');
    const collocations = array(v2Data.collocations);
    if (matcher && feedback) {
      matcher.addEventListener('click', event => {
        const item = event.target.closest('[data-collocation-id]');
        if (!item || item.classList.contains('matched')) return;
        if (item.dataset.collocationType === 'left') {
          matcher.querySelectorAll('.verb-item').forEach(button => button.classList.remove('selected'));
          item.classList.add('selected');
          activeCollocation = item;
          return;
        }
        if (!activeCollocation) return;
        const same = activeCollocation.dataset.collocationId === item.dataset.collocationId;
        feedback.style.display = 'block';
        if (same) {
          activeCollocation.classList.remove('selected');
          activeCollocation.classList.add('matched');
          item.classList.add('matched');
          const col = collocations[Number(item.dataset.collocationId)];
          feedback.className = 'matcher-feedback is-correct';
          feedback.innerHTML = `Matched: <strong>${escapeHtml(col.verb || '')} ${escapeHtml(col.partner || '')}</strong>${col.example ? ` — ${escapeHtml(col.example)}` : ''}`;
          activeCollocation = null;
        } else {
          feedback.className = 'matcher-feedback is-retry';
          feedback.textContent = 'That partner does not naturally pair with this word. Try again.';
          activeCollocation.classList.remove('selected');
          activeCollocation = null;
        }
      });
    }
    let solved = 0;
    document.querySelectorAll('.clue-item').forEach(row => {
      row.querySelector('[data-reveal-word]')?.addEventListener('click', event => {
        const button = event.currentTarget;
        if (button.dataset.revealed) return;
        button.dataset.revealed = 'true';
        button.textContent = `✨ ${button.dataset.revealWord}`;
        button.classList.add('revealed');
        solved += 1;
        byId('definitionScore').textContent = `Solved: ${solved} / ${document.querySelectorAll('.clue-item').length}`;
      });
    });
  }

  // Criterion 4.3: Writing Self-Checklist & Model Answer Toggle
  function renderWriting() {
    const writing = normaliseWriting(v2Data.report_builder_guide || v2Data.writing_workshop);
    return `<div class="report-builder-wrap">
      <div class="report-target-selector no-print">
        <label for="writingTopic">${escapeHtml(writing.projectLabel)}:</label>
        <input type="text" id="writingTopic" value="${escapeAttribute(writing.defaultTopic)}" placeholder="Enter a topic">
        <label for="writingAuthor">Author:</label>
        <input type="text" id="writingAuthor" value="${escapeAttribute(writing.defaultAuthor)}" placeholder="Your name">
        <button class="btn-preview-report" id="writingPreview" type="button">📋 Refresh preview</button>
        <button class="btn-print-report primary" id="writingPrint" type="button">🖨️ Print</button>
      </div>

      <!-- Self-check writing checklist (Criterion 4.3) -->
      <div class="writing-checklist-box" style="margin-bottom:16px;padding:14px;background:#F8FAFC;border:2px solid #CBD5E1;border-radius:12px;">
        <strong style="color:#0F172A;">Self-Check Writing Rubric:</strong>
        <div style="display:flex;flex-wrap:wrap;gap:10px;margin-top:8px;">
          ${writing.checklist.map(item => `<label style="display:inline-flex;align-items:center;gap:6px;font-size:0.88rem;cursor:pointer;"><input type="checkbox" class="writing-rubric-check"> <span>${escapeHtml(item)}</span></label>`).join('')}
        </div>
      </div>

      <div class="paragraphs-step-accordion" id="writingSteps">
        ${writing.sections.map((section, index) => renderWritingSection(section, index)).join('')}
      </div>

      <div class="report-live-preview-card" id="writingPreviewCard">
        <div class="preview-paper-header">
          <span class="paper-kicker">${escapeHtml(writing.genre)}</span>
          <h2 class="preview-report-title" id="writingPreviewTitle">${escapeHtml(writing.title)}</h2>
          <div class="preview-meta"><span id="writingPreviewAuthor"></span></div>
        </div>
        <div class="preview-paragraphs-body" id="writingPreviewBody"></div>
      </div>

      ${writing.modelAnswer ? `<div style="margin-top:16px;" class="no-print">
        <button type="button" class="cta ghost small" id="toggleModelAnswerBtn">💡 Reveal Model Answer</button>
        <div id="writingModelAnswerBox" style="display:none;margin-top:10px;padding:14px;background:#FEF9C3;border:2px solid #CA8A04;border-radius:10px;font-size:0.92rem;">
          <strong>Model Example:</strong><br>${escapeHtml(writing.modelAnswer).replace(/\n/g, '<br>')}
        </div>
      </div>` : ''}
    </div>`;
  }

  function renderWritingSection(section, index) {
    return `<div class="step-card" data-step="${index}">
      <div class="step-header">
        <div class="step-num-badge">${escapeHtml(section.number || index + 1)}</div>
        <div class="step-title">${escapeHtml(section.heading || section.title || `Section ${index + 1}`)}</div>
      </div>
      ${section.guiding_questions || section.prompt ? `<p class="step-guide"><strong>Guide:</strong> ${escapeHtml(section.guiding_questions || section.prompt)}</p>` : ''}
      ${array(section.connectors).length ? `<div class="step-connectors"><span>Helpful connectors:</span>${array(section.connectors).map(connector => `<button class="connector-chip" type="button" data-connector="${escapeAttribute(connector)}">${escapeHtml(connector)}</button>`).join('')}</div>` : ''}
      <textarea class="step-textarea" rows="4" data-writing-index="${index}" placeholder="${escapeAttribute(section.sample_starter || section.placeholder || 'Write this section...')}">${escapeHtml(section.sample_starter || '')}</textarea>
    </div>`;
  }

  function setupWriting() {
    const steps = byId('writingSteps');
    if (!steps) return;
    const update = () => {
      const topic = byId('writingTopic')?.value.trim();
      const author = byId('writingAuthor')?.value.trim();
      const guide = normaliseWriting(v2Data.report_builder_guide || v2Data.writing_workshop);
      if (byId('writingPreviewTitle')) byId('writingPreviewTitle').textContent = topic ? `${guide.title}: ${topic}` : guide.title;
      if (byId('writingPreviewAuthor')) byId('writingPreviewAuthor').textContent = author ? `By: ${author}` : '';
      if (byId('writingPreviewBody')) {
        byId('writingPreviewBody').innerHTML = Array.from(steps.querySelectorAll('textarea')).map((area, index) => `<p class="preview-para"><strong>${escapeHtml(guide.sections[index]?.heading || `Section ${index + 1}`)}:</strong> ${escapeHtml(area.value).replace(/\n/g, '<br>')}</p>`).join('');
      }
    };
    steps.addEventListener('input', update);
    steps.addEventListener('click', event => {
      const connector = event.target.closest('[data-connector]');
      if (!connector) return;
      const area = connector.closest('.step-card').querySelector('textarea');
      area.value = `${area.value.trim()} ${connector.dataset.connector}`.trim();
      update();
      area.focus();
    });
    byId('writingTopic')?.addEventListener('input', update);
    byId('writingAuthor')?.addEventListener('input', update);
    byId('writingPreview')?.addEventListener('click', update);
    byId('writingPrint')?.addEventListener('click', () => { update(); window.print(); });

    byId('toggleModelAnswerBtn')?.addEventListener('click', () => {
      const box = byId('writingModelAnswerBox');
      const btn = byId('toggleModelAnswerBtn');
      if (!box || !btn) return;
      const isHidden = box.style.display === 'none';
      box.style.display = isHidden ? 'block' : 'none';
      btn.textContent = isHidden ? '🙈 Hide Model Answer' : '💡 Reveal Model Answer';
    });

    update();
  }

  function renderPractice() {
    const truthItems = array(v2Data.content_true_false || v2Data.geography_true_false);
    const modes = [];
    if (vocabList.length >= 2) modes.push(['greek', '🔊 Spoken word → meaning'], ['def', '📖 Spoken word → definition'], ['gapfill', '🧩 Example sentence']);
    if (truthItems.length) modes.push(['fact', '⚡ Fact check']);
    return `<div class="challenge-module">
      <div class="challenge-mode-selector no-print" id="challengeModes">
        ${modes.map(([id, label], index) => `<button class="ch-mode-btn${index === 0 ? ' active' : ''}" type="button" data-challenge-mode="${id}">${label}</button>`).join('')}
      </div>
      <div class="challenge-game-card">
        <div class="ch-header">
          <div class="ch-score-box">Score: <strong id="challengeScore">0</strong> / <span id="challengeTotal">0</span></div>
          <div class="ch-streak-box">Streak: <strong id="challengeStreak">0</strong></div>
          <button class="ch-restart-btn" id="challengeRestart" type="button">🔄 Restart</button>
        </div>
        <div class="ch-prompt-box">
          <div class="ch-instruction" id="challengeInstruction">Choose a challenge.</div>
          <div class="ch-audio-row">
            <button class="quiz-play-btn" id="challengePlay" type="button"><span>🔊</span><span>Play prompt</span></button>
          </div>
        </div>
        <div class="ch-options-grid" id="challengeOptions"></div>
        <div class="quiz-feedback-box" id="challengeFeedback" style="display:none;">
          <div class="feedback-icon" id="challengeFeedbackIcon">🎉</div>
          <div class="feedback-text" id="challengeFeedbackText"></div>
          <button class="next-question-btn" id="challengeNext" type="button">Next ➔</button>
        </div>
      </div>
      ${truthItems.length ? `<div class="truth-reference no-print">
        <h3>Complete Fact Bank</h3>
        ${truthItems.map((item, index) => `<div class="truth-bank-item"><span>${index + 1}. ${escapeHtml(item.fact)}</span><button type="button" class="btn-tf" data-bank-answer="${item.answer}" data-bank-index="${index}">${item.answer ? 'TRUE' : 'FALSE'}</button></div>`).join('')}
      </div>` : ''}
    </div>`;
  }

  function chooseVocabQuestion() {
    if (vocabList.length < 2) return null;
    const target = vocabList[Math.floor(Math.random() * vocabList.length)];
    const distractors = vocabList.filter(item => item.id !== target.id).sort(() => Math.random() - 0.5).slice(0, Math.min(3, vocabList.length - 1));
    return { target, options: [target, ...distractors].sort(() => Math.random() - 0.5) };
  }

  function startChallenge() {
    challengeScore = 0;
    challengeStreak = 0;
    challengeTotal = 0;
    updateChallengeHud();
    loadChallengeQuestion();
  }

  function updateChallengeHud() {
    if (byId('challengeScore')) byId('challengeScore').textContent = challengeScore;
    if (byId('challengeTotal')) byId('challengeTotal').textContent = challengeTotal;
    if (byId('challengeStreak')) byId('challengeStreak').textContent = challengeStreak;
  }

  function loadChallengeQuestion() {
    if (!byId('challengeOptions')) return;
    const truthItems = array(v2Data.content_true_false || v2Data.geography_true_false);
    if (challengeMode === 'fact') {
      if (!truthItems.length) return;
      const target = truthItems[Math.floor(Math.random() * truthItems.length)];
      challengeQuestion = { mode: 'fact', target, answered: false };
      byId('challengeInstruction').textContent = target.fact;
      byId('challengeOptions').innerHTML = `<button class="ch-option-btn fact-btn" type="button" data-fact-answer="true"><span class="ch-option-letter">A</span><div><strong>TRUE</strong></div></button><button class="ch-option-btn fact-btn" type="button" data-fact-answer="false"><span class="ch-option-letter">B</span><div><strong>FALSE</strong></div></button>`;
      byId('challengeFeedback').style.display = 'none';
      return;
    }
    const question = chooseVocabQuestion();
    if (!question) return;
    challengeQuestion = { mode: challengeMode, ...question, answered: false };
    byId('challengeFeedback').style.display = 'none';
    byId('challengeInstruction').textContent = challengeMode === 'gapfill' ? 'Listen to the example and choose the missing vocabulary word.' : 'Listen and choose the matching answer.';
    byId('challengeOptions').innerHTML = question.options.map((item, index) => {
      const answer = challengeMode === 'greek' ? `<span lang="el">${escapeHtml(item.meaning_gr)}</span>` : challengeMode === 'def' ? escapeHtml(item.definition_en || item.definition || '') : `${escapeHtml(item.word)} <span>(${escapeHtml(item.pos || '')})</span>`;
      return `<button class="ch-option-btn" type="button" data-vocab-answer-id="${escapeAttribute(item.id)}"><span class="ch-option-letter">${String.fromCharCode(65 + index)}</span><div>${answer}</div></button>`;
    }).join('');
    setTimeout(playChallengePrompt, 200);
  }

  function playChallengePrompt() {
    if (!challengeQuestion || challengeQuestion.mode === 'fact' || !challengeQuestion.target) return;
    const audioId = toAudioId(challengeQuestion.target.id);
    const type = challengeMode === 'gapfill' ? 'example' : 'word';
    const src = getVocabAudioPath(type, audioId);
    playAudioFile(src, 'Practice prompt', challengeQuestion.target.word, byId('challengePlay'));
  }

  function answerChallenge(answerId, button) {
    if (!challengeQuestion || challengeQuestion.answered) return;
    challengeQuestion.answered = true;
    challengeTotal += 1;
    const correct = String(answerId) === String(challengeQuestion.target.id);
    byId('challengeOptions').querySelectorAll('button').forEach(item => {
      item.disabled = true;
      if (String(item.dataset.vocabAnswerId) === String(challengeQuestion.target.id)) item.classList.add('correct');
    });
    if (correct) {
      challengeScore += 1;
      challengeStreak += 1;
      button.classList.add('correct');
    } else {
      challengeStreak = 0;
      button.classList.add('wrong');
    }

    // Adaptive Store Update (Criterion 1.3 & 4.2)
    if (window.LearnerStore) {
      window.LearnerStore.recordAttempt(unitNum, challengeQuestion.target.id, correct, {
        word: challengeQuestion.target.word,
        meaning_gr: challengeQuestion.target.meaning_gr
      });
    }

    byId('challengeFeedbackIcon').textContent = correct ? '🌟' : '❌';
    byId('challengeFeedbackText').textContent = correct ? `Correct: ${challengeQuestion.target.word}` : `The answer was ${challengeQuestion.target.word}.`;
    byId('challengeFeedback').style.display = 'flex';
    updateChallengeHud();
  }

  function answerFact(answer, button) {
    if (!challengeQuestion || challengeQuestion.answered) return;
    challengeQuestion.answered = true;
    challengeTotal += 1;
    const correct = answer === Boolean(challengeQuestion.target.answer);
    byId('challengeOptions').querySelectorAll('button').forEach(item => {
      item.disabled = true;
      if ((item.dataset.factAnswer === 'true') === Boolean(challengeQuestion.target.answer)) item.classList.add('correct');
    });
    if (correct) {
      challengeScore += 1;
      challengeStreak += 1;
      button.classList.add('correct');
    } else {
      challengeStreak = 0;
      button.classList.add('wrong');
    }
    byId('challengeFeedbackIcon').textContent = correct ? '🌟' : '❌';
    byId('challengeFeedbackText').textContent = challengeQuestion.target.explanation || (correct ? 'Correct.' : 'Check the unit text.');
    byId('challengeFeedback').style.display = 'flex';
    updateChallengeHud();
  }

  function setupPractice() {
    const container = byId('panel-practice .module-body');
    if (!container) return;
    container.addEventListener('click', event => {
      const mode = event.target.closest('[data-challenge-mode]');
      if (mode) {
        challengeMode = mode.dataset.challengeMode;
        container.querySelectorAll('[data-challenge-mode]').forEach(button => button.classList.toggle('active', button === mode));
        startChallenge();
        return;
      }
      const vocabAnswer = event.target.closest('[data-vocab-answer-id]');
      if (vocabAnswer) answerChallenge(vocabAnswer.dataset.vocabAnswerId, vocabAnswer);
      const factAnswer = event.target.closest('[data-fact-answer]');
      if (factAnswer) answerFact(factAnswer.dataset.factAnswer === 'true', factAnswer);
      const bankAnswer = event.target.closest('[data-bank-answer]');
      if (bankAnswer) {
        const fact = array(v2Data.content_true_false || v2Data.geography_true_false)[Number(bankAnswer.dataset.bankIndex)];
        const correct = Boolean(fact) && (bankAnswer.dataset.bankAnswer === 'true') === Boolean(fact.answer);
        bankAnswer.classList.add(correct ? 'is-correct' : 'is-retry');
      }
    });
    byId('challengePlay')?.addEventListener('click', playChallengePrompt);
    byId('challengeNext')?.addEventListener('click', loadChallengeQuestion);
    byId('challengeRestart')?.addEventListener('click', startChallenge);
  }

  function deriveWorksheets(data) {
    const sheets = [];
    if (data.stories.length) sheets.push({ id: 1, title: 'Worksheet 1 · Reading & Context', lesson: 'Reading Dossiers', sections: [{ title: 'Comprehension & Vocabulary', prompt: 'Answer the reading questions and identify key target vocabulary from the dossier profiles.' }] });
    if (data.grammar) sheets.push({ id: 2, title: 'Worksheet 2 · Grammar in Action', lesson: 'Grammar Lab', sections: [{ title: 'Pattern Practice', prompt: 'Complete the pattern discovery exercises and form the correct grammatical structures.' }] });
    if (data.collocations.length || data.challenge) sheets.push({ id: 3, title: 'Worksheet 3 · Lexical Partnerships', lesson: 'Vocabulary Studio', sections: [{ title: 'Collocations & Clues', prompt: 'Match natural partners and solve definition clues.' }] });
    if (data.writing) sheets.push({ id: 4, title: 'Worksheet 4 · Writing Project', lesson: 'Writing Workshop', sections: [{ title: 'Guided Drafting', prompt: 'Follow the paragraph structure and write your response.' }] });
    return sheets.length ? { title: 'Printable Worksheets Pack', sheets } : null;
  }

  function renderWorksheets() {
    const worksheets = normaliseWorksheets(v2Data.worksheets) || deriveWorksheets({
      stories: array(v2Data.stories || v2Data.dossiers),
      grammar: v2Data.grammar_lab,
      collocations: array(v2Data.collocations),
      challenge: normaliseChallenge(v2Data.definition_challenge || v2Data.crossword),
      writing: normaliseWriting(v2Data.report_builder_guide || v2Data.writing_workshop),
      truthItems: array(v2Data.content_true_false || v2Data.geography_true_false)
    });
    if (!worksheets) return '<p>No worksheets available for this unit.</p>';
    return `<div class="worksheets-layout">
      <div class="worksheet-tabs-bar no-print" id="worksheetTabs">
        ${worksheets.sheets.map((sheet, index) => `<button class="ws-tab-btn${index === 0 ? ' active' : ''}" type="button" data-sheet-id="${sheet.id}">${escapeHtml(sheet.title)}</button>`).join('')}
      </div>
      <div class="worksheet-display-area" id="worksheetDisplay"></div>
    </div>`;
  }

  function selectWorksheet(sheetId) {
    selectedWorksheet = sheetId;
    const worksheets = normaliseWorksheets(v2Data.worksheets) || deriveWorksheets({
      stories: array(v2Data.stories || v2Data.dossiers),
      grammar: v2Data.grammar_lab,
      collocations: array(v2Data.collocations),
      challenge: normaliseChallenge(v2Data.definition_challenge || v2Data.crossword),
      writing: normaliseWriting(v2Data.report_builder_guide || v2Data.writing_workshop),
      truthItems: array(v2Data.content_true_false || v2Data.geography_true_false)
    });
    if (!worksheets) return;
    const sheet = worksheets.sheets.find(s => Number(s.id) === Number(sheetId)) || worksheets.sheets[0];
    const display = byId('worksheetDisplay');
    if (!display || !sheet) return;

    document.querySelectorAll('.ws-tab-btn').forEach(btn => {
      btn.classList.toggle('active', Number(btn.dataset.sheetId) === Number(sheet.id));
    });

    display.innerHTML = `
      <article class="printable-paper-sheet">
        <div class="sheet-meta-header">
          <div class="sheet-kicker">English 6th Grade • ${escapeHtml(unitLabel())}</div>
          <h1 class="sheet-main-title">${escapeHtml(sheet.title)}</h1>
          <div class="sheet-student-info-bar">
            <span><strong>Name:</strong> ___________________________</span>
            <span><strong>Class:</strong> ________</span>
            <span><strong>Date:</strong> ____________</span>
          </div>
        </div>
        ${sheet.sections.map(sec => `<div class="sheet-section">
          <h3>${escapeHtml(sec.title || '')}</h3>
          <p>${escapeHtml(sec.prompt || '')}</p>
          <div class="sheet-writing-lines" style="border:1px dashed #CBD5E1;height:140px;border-radius:8px;margin-top:8px;"></div>
        </div>`).join('')}
      </article>
    `;
  }

  function showAllWorksheetsForPrint() {
    const worksheets = normaliseWorksheets(v2Data.worksheets) || deriveWorksheets({
      stories: array(v2Data.stories || v2Data.dossiers),
      grammar: v2Data.grammar_lab,
      collocations: array(v2Data.collocations),
      challenge: normaliseChallenge(v2Data.definition_challenge || v2Data.crossword),
      writing: normaliseWriting(v2Data.report_builder_guide || v2Data.writing_workshop),
      truthItems: array(v2Data.content_true_false || v2Data.geography_true_false)
    });
    if (!worksheets) return;
    const display = byId('worksheetDisplay');
    if (!display) return;
    display.innerHTML = worksheets.sheets.map(sheet => `
      <article class="printable-paper-sheet" style="page-break-after:always;margin-bottom:30px;">
        <div class="sheet-meta-header">
          <div class="sheet-kicker">English 6th Grade • ${escapeHtml(unitLabel())}</div>
          <h1 class="sheet-main-title">${escapeHtml(sheet.title)}</h1>
          <div class="sheet-student-info-bar">
            <span><strong>Name:</strong> ___________________________</span>
            <span><strong>Class:</strong> ________</span>
            <span><strong>Date:</strong> ____________</span>
          </div>
        </div>
        ${sheet.sections.map(sec => `<div class="sheet-section">
          <h3>${escapeHtml(sec.title || '')}</h3>
          <p>${escapeHtml(sec.prompt || '')}</p>
          <div class="sheet-writing-lines" style="border:1px dashed #CBD5E1;height:140px;border-radius:8px;margin-top:8px;"></div>
        </div>`).join('')}
      </article>
    `).join('');
  }

  function setupWorksheets() {
    byId('worksheetTabs')?.addEventListener('click', event => {
      const tab = event.target.closest('[data-sheet-id]');
      if (tab) selectWorksheet(Number(tab.dataset.sheetId));
    });
    if (selectedWorksheet) selectWorksheet(selectedWorksheet);
  }

  function renderPassport() {
    const canDo = normaliseCanDo(v2Data.can_do || v2Data.passport || v2Data.can_do_statements, {
      stories: array(v2Data.stories || v2Data.dossiers),
      grammar: v2Data.grammar_lab,
      collocations: array(v2Data.collocations),
      writing: normaliseWriting(v2Data.report_builder_guide || v2Data.writing_workshop),
      truthItems: array(v2Data.content_true_false || v2Data.geography_true_false)
    });
    if (!canDo) return '<p>Can-Do Passport not configured.</p>';
    return `<div class="passport-layout">
      <div class="passport-grid">
        ${canDo.statements.map((stmt, index) => `<div class="passport-card" data-passport-index="${index}">
          <div class="passport-badge">${escapeHtml(stmt.badge || '🎖️')}</div>
          <h4>${escapeHtml(stmt.title || `Goal ${index + 1}`)}</h4>
          <p>${escapeHtml(stmt.statement || '')}</p>
          <label class="passport-check-label"><input type="checkbox" class="passport-checkbox"> I can do this</label>
        </div>`).join('')}
      </div>
    </div>`;
  }

  function setupPassport() {
    // Checkbox persistence can be added if desired
  }

  function renderWorkbook() {
    if (!workbookActivities.length) return '<p>No workbook activities loaded.</p>';
    const lessons = [...new Set(workbookActivities.map(act => act.lesson || act.page ? `Lesson ${act.lesson || Math.ceil((act.page || 1) / 3)}` : 'Activities'))];
    return `<div class="workbook-module">
      <div class="wb-filters-bar no-print">
        <button class="wb-filter-btn active" type="button" data-wb-filter="all">All Activities (${workbookActivities.length})</button>
        ${lessons.map(les => `<button class="wb-filter-btn" type="button" data-wb-filter="${escapeAttribute(les)}">${escapeHtml(les)}</button>`).join('')}
      </div>
      <div class="wb-cards-container" id="workbookCards">
        ${workbookActivities.map(activity => renderWorkbookCard(activity)).join('')}
      </div>
    </div>`;
  }

  function renderWorkbookCard(activity) {
    const les = activity.lesson || activity.page ? `Lesson ${activity.lesson || Math.ceil((activity.page || 1) / 3)}` : 'Activities';
    return `<article class="wb-card" data-activity-id="${escapeAttribute(activity.id)}" data-lesson="${escapeAttribute(les)}">
      <div class="wb-card-header">
        <div>
          <span class="badge freq-badge">Activity ${escapeHtml(activity.number || activity.id)}</span>
          <h3 class="wb-card-title">${escapeHtml(activity.title || '')}</h3>
          ${activity.page ? `<small style="color:#64748B;">Workbook page ${escapeHtml(activity.page)}</small>` : ''}
        </div>
        <div class="wb-card-status" data-status-activity="${escapeAttribute(activity.id)}"></div>
      </div>
      ${renderBookCheck(activity.book_check)}
      ${activity.instruction ? `<p class="wb-card-instruction">${escapeHtml(activity.instruction)}</p>` : ''}
      <div class="wb-card-body">
        ${renderWorkbookBody(activity)}
      </div>
      <div class="wb-card-actions no-print">
        <button class="wb-btn wb-btn-primary" type="button" data-check-activity="${escapeAttribute(activity.id)}">Check Answers</button>
        <button class="wb-btn wb-btn-retry" type="button" data-retry-activity="${escapeAttribute(activity.id)}" hidden>Try Again</button>
        <button class="wb-btn wb-btn-reveal" type="button" data-reveal-activity="${escapeAttribute(activity.id)}">Show Answer</button>
        <button class="wb-btn wb-btn-secondary" type="button" data-print-activity="${escapeAttribute(activity.id)}">📄 Print</button>
      </div>
      <!-- Graduated Metalinguistic Feedback Box (Criterion 1.4) -->
      <div class="wb-graduated-feedback-box" data-feedback-box="${escapeAttribute(activity.id)}" style="display:none;margin-top:12px;padding:12px;border-radius:10px;"></div>
    </article>`;
  }

  function renderWorkbookBody(activity) {
    const bankHtml = array(activity.word_bank).length ? `<div class="wb-word-bank"><span class="wb-word-bank-label">Word Bank:</span>${activity.word_bank.map(word => `<span class="wb-word-chip">${escapeHtml(word)}</span>`).join('')}</div>` : '';
    if (array(activity.gaps).length) {
      return `${bankHtml}<div class="wb-sentence-list">${activity.gaps.map(gap => `<div class="wb-sentence-row">
        ${gap.speaker ? `<span class="wb-speaker-badge">${escapeHtml(gap.speaker)}</span>` : ''}
        <div class="wb-sentence-body">
          ${gap.label ? `<span>${escapeHtml(gap.label)}</span>` : ''}
          <div>${escapeHtml(gap.prefix || '')} <input class="wb-gap-input" data-gap-id="${escapeAttribute(gap.id || uid())}" data-accepted="${escapeAttribute(array(gap.accepted || [gap.key_answer]).join('|||'))}"> ${escapeHtml(gap.suffix || '')}</div>
        </div>
      </div>`).join('')}</div>`;
    }
    if (array(activity.items).length && array(activity.items[0].options).length) {
      return `${bankHtml}<div class="wb-sentence-list">${activity.items.map((item, index) => `<div class="wb-sentence-row">
        ${item.speaker ? `<span class="wb-speaker-badge">${escapeHtml(item.speaker)}</span>` : ''}
        <div class="wb-sentence-body">
          <span>${escapeHtml(item.context || item.prompt || item.sentence || '')}</span>
          <select class="wb-match-select" data-item-select="${index}" data-key="${escapeAttribute(item.key_answer || item.target || '')}">
            <option value="">Choose…</option>
            ${array(item.options).map(option => `<option value="${escapeAttribute(option)}">${escapeHtml(option)}</option>`).join('')}
          </select>
        </div>
      </div>`).join('')}</div>`;
    }
    if (array(activity.items).length) {
      return `${bankHtml}<div class="wb-subjects-grid">${activity.items.map((item, index) => `<div class="wb-subject-card">
        ${resolveAsset(item.image) ? `<img class="wb-subject-img" src="${escapeAttribute(resolveAsset(item.image))}" alt="${escapeAttribute(item.alt || 'Workbook illustration')}">` : ''}
        <input class="wb-gap-input" data-item-input="${index}" data-accepted="${escapeAttribute(array(item.accepted || [item.target || item.key_answer]).join('|||'))}" data-model="${escapeAttribute(item.target || item.key_answer || '')}" placeholder="Type answer">
      </div>`).join('')}</div>`;
    }
    if (array(activity.pairs).length) {
      return `${bankHtml}<div class="wb-sentence-list">${activity.pairs.map((pair, index) => `<div class="wb-sentence-row">
        <span><strong>${escapeHtml(pair.prompt || pair.left || Object.values(pair)[0] || '')}</strong></span>
        <input class="wb-gap-input" data-match-index="${index}" placeholder="Matching partner">
      </div>`).join('')}</div>`;
    }
    return `${bankHtml}<textarea class="wb-pupil-textarea" data-semi-input="true" placeholder="Write your response..."></textarea>`;
  }

  // Criterion 1.4: Graduated Metalinguistic Feedback Engine
  function setupWorkbook() {
    const container = byId('workbookCards');
    if (!container) return;
    const filterBar = container.previousElementSibling;
    filterBar?.addEventListener('click', event => {
      const button = event.target.closest('[data-wb-filter]');
      if (!button) return;
      filterBar.querySelectorAll('[data-wb-filter]').forEach(item => item.classList.toggle('active', item === button));
      container.querySelectorAll('.wb-card').forEach(card => {
        card.hidden = button.dataset.wbFilter !== 'all' && card.dataset.lesson !== button.dataset.wbFilter;
      });
    });

    workbookActivities.forEach(activity => {
      const card = container.querySelector(`[data-activity-id="${CSS.escape(activity.id)}"]`);
      if (!card) return;
      const controls = [...card.querySelectorAll('input,select,textarea')];
      const status = card.querySelector(`[data-status-activity="${CSS.escape(activity.id)}"]`);
      const retry = card.querySelector(`[data-retry-activity="${CSS.escape(activity.id)}"]`);
      const feedbackBox = card.querySelector(`[data-feedback-box="${CSS.escape(activity.id)}"]`);
      let attemptCount = 0;

      const setStatus = (correct, total) => {
        status.innerHTML = `<span style="color:${correct === total ? '#276749' : '#c53030'};font-weight:700;">${correct} / ${total} correct</span>`;
        if (retry) retry.hidden = correct === total;
      };

      const validate = control => {
        const value = normalise(control.value);
        if (control.matches('[data-gap-id], [data-item-input]')) {
          const accepted = control.dataset.accepted ? control.dataset.accepted.split('|||') : [];
          return accepted.some(answer => normalise(answer) === value);
        }
        if (control.matches('[data-item-select]')) return normalise(control.dataset.key) === value;
        return Boolean(value);
      };

      const check = () => {
        attemptCount += 1;
        let correct = 0;
        let wrongControls = [];

        controls.forEach(control => {
          const valid = validate(control);
          control.classList.toggle('is-correct', valid);
          control.classList.toggle('is-retry', !valid);
          if (valid) correct += 1;
          else wrongControls.push(control);
        });

        setStatus(correct, controls.length);

        if (feedbackBox) {
          if (correct === controls.length) {
            feedbackBox.style.display = 'block';
            feedbackBox.style.background = '#F0FDF4';
            feedbackBox.style.border = '2px solid #16A34A';
            feedbackBox.innerHTML = '<strong>🎉 Well done!</strong> All answers in this activity are correct.';
          } else {
            feedbackBox.style.display = 'block';
            feedbackBox.style.background = '#FEF2F2';
            feedbackBox.style.border = '2px solid #DC2626';

            // Graduated Feedback logic (Criterion 1.4)
            if (attemptCount === 1) {
              const cueHint = activity.book_check?.note || activity.hints || (activity.tense ? `Remember: this activity tests ${activity.tense}. Check the time signal words in the sentences.` : 'Look closely at the word bank and spelling.');
              feedbackBox.innerHTML = `<strong>💡 Step 1 Hint:</strong> ${escapeHtml(cueHint)}`;
            } else if (attemptCount >= 2) {
              const ruleNote = activity.tense === 'Present Continuous' ? 'Rule: am / is / are + verb-ing (actions happening right now).' : (activity.tense === 'Present Simple' ? 'Rule: base verb (or verb + -s for he/she/it for routines and habits).' : 'Check the Grammar Lab pattern rules for this unit.');
              feedbackBox.innerHTML = `<strong>📐 Step 2 Grammar Rule:</strong> ${escapeHtml(ruleNote)}<br><small style="color:#64748B;">Click "Show Answer" if you need to see the model solutions.</small>`;
            }
          }
        }
      };

      const reveal = () => {
        controls.forEach(control => {
          if (control.matches('[data-gap-id]')) {
            const gap = array(activity.gaps).find(item => String(item.id) === control.dataset.gapId);
            control.value = gap?.key_answer || array(gap?.accepted)[0] || '';
          } else if (control.matches('[data-item-select]')) {
            control.value = control.dataset.key;
          } else if (control.dataset.model) {
            control.value = control.dataset.model;
          }
          control.classList.add('is-revealed');
        });
        if (status) status.textContent = 'Answers revealed';
        if (retry) retry.hidden = true;
        if (feedbackBox) {
          feedbackBox.style.display = 'block';
          feedbackBox.style.background = '#EFF6FF';
          feedbackBox.style.border = '2px solid #2563EB';
          feedbackBox.innerHTML = '<strong>Solutions displayed:</strong> Inspect the correct forms above.';
        }
      };

      card.querySelector(`[data-check-activity="${CSS.escape(activity.id)}"]`)?.addEventListener('click', check);
      card.querySelector(`[data-retry-activity="${CSS.escape(activity.id)}"]`)?.addEventListener('click', () => {
        const wrong = controls.filter(control => control.classList.contains('is-retry'));
        wrong.forEach(control => { control.value = ''; control.classList.remove('is-retry'); });
        wrong[0]?.focus();
      });
      card.querySelector(`[data-reveal-activity="${CSS.escape(activity.id)}"]`)?.addEventListener('click', reveal);
      card.querySelector(`[data-print-activity="${CSS.escape(activity.id)}"]`)?.addEventListener('click', () => printWorkbookActivity(activity));
    });
  }

  function printWorkbookActivity(activity) {
    const area = byId('workbookPrintArea');
    if (!area) return;
    const sheet = `<article class="printable-paper-sheet">
      <div class="sheet-meta-header">
        <div class="sheet-kicker">English 6th Grade • ${escapeHtml(unitLabel())}</div>
        <h1 class="sheet-main-title">Activity ${escapeHtml(activity.number || activity.id)}: ${escapeHtml(activity.title || '')}</h1>
        <div class="sheet-student-info-bar">
          <span><strong>Name:</strong> ___________________________</span>
          <span><strong>Class:</strong> ________</span>
          <span><strong>Date:</strong> ____________</span>
        </div>
      </div>
      ${renderBookCheck(activity.book_check)}
      ${activity.instruction ? `<p class="sheet-prompt-text">${escapeHtml(activity.instruction)}</p>` : ''}
      ${renderWorkbookBody(activity)}
      <div class="sheet-footer-bar"><span>${escapeHtml(unitLabel())}</span><span>Workbook Activity</span></div>
    </article>`;
    area.innerHTML = sheet;
    body.classList.add('printing-wb-sheet');
    setTimeout(() => window.print(), 100);
    window.addEventListener('afterprint', () => { body.classList.remove('printing-wb-sheet'); area.innerHTML = ''; }, { once: true });
  }

  function renderNotes() {
    const notes = array(v2Data.teacher_notes);
    const checks = array(v2Data.book_checks);
    return `<div class="teacher-notes-list">${notes.map(note => `<article class="teacher-note-card"><span>${escapeHtml(note.lesson || 'Teacher note')}</span><h3>${escapeHtml(note.title || note.id || 'Teaching note')}</h3><p>${escapeHtml(note.note || note.text || '')}</p></article>`).join('')}</div>${checks.length ? `<div class="book-check-list">${checks.map(check => renderBookCheck(check)).join('')}</div>` : ''}`;
  }

  function setupGlobalAudioButtons() {
    document.addEventListener('click', event => {
      const button = event.target.closest('[data-audio-src]');
      if (button) {
        playAudioFile(resolveAsset(button.dataset.audioSrc), 'Audio', button.dataset.audioTitle || 'Audio', button);
        return;
      }
      const vocab = event.target.closest('[data-vocab-id]');
      if (vocab) {
        const item = vocabList.find(entry => String(entry.id) === String(vocab.dataset.vocabId));
        if (!item) return;
        const padId = toAudioId(item.id);
        const srcs = [
          getVocabAudioPath('word', padId),
          getVocabAudioPath('def', padId),
          getVocabAudioPath('example', padId)
        ];
        playAudioSequence(srcs, 'Vocabulary reading', item.word, vocab);
      }
    });
  }

  function setupModules() {
    setupStoryModule();
    setupGrammarModule();
    setupCollocations();
    setupWriting();
    setupPractice();
    setupWorksheets();
    setupPassport();
    setupWorkbook();
  }

  await loadData();
  applyIdentity();
  setupAudio();
  setupGlobalAudioButtons();
  const modules = buildModules();
  setupNavigation(modules);
  setupModules();
});
