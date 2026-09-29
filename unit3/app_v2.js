document.addEventListener('DOMContentLoaded', async () => {
  const body = document.body;
  const unitNum = body.dataset.unit || '';
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
  const titleCase = value => String(value || '').replace(/(^|\s|[-_])\S/g, char => char.toUpperCase());
  const uid = () => Math.random().toString(36).slice(2);

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
    if (!window[v2DataKey]) await loadScript(`data/unit${unitNum}_v2_data.js`);
    if (window[v2DataKey]) v2Data = window[v2DataKey];
    if (!v2Data) {
      try {
        const response = await fetch(`data/unit${unitNum}_v2_data.json`);
        if (response.ok) v2Data = await response.json();
      } catch (error) {
        v2Data = {};
      }
    }
    const workbookSrc = body.dataset.workbook || '';
    if (workbookSrc) {
      const src = workbookSrc.includes('/') ? workbookSrc : `data/${workbookSrc}`;
      if (!window[workbookDataKey]) await loadScript(src);
      if (window[workbookDataKey]) workbookData = window[workbookDataKey];
    }
    if (!workbookData && v2Data.workbook) workbookData = v2Data.workbook;
    workbookActivities = workbookData && Array.isArray(workbookData.activities) ? workbookData.activities : [];
  }

  function unitTitle() {
    return v2Data.unit_title || (unitNum ? `Unit ${unitNum}` : 'Coursebook Unit');
  }

  function unitLabel() {
    return unitNum ? `Unit ${unitNum}: ${unitTitle()}` : unitTitle();
  }

  function moduleShell(id, icon, title, description, body, printSheet = '') {
    return `<section id="panel-${escapeAttribute(id)}" class="v2-panel" role="tabpanel" data-module="${escapeAttribute(id)}" hidden>
      <div class="panel-header-box no-print">
        <div><h2 class="panel-title">${escapeHtml(icon)} ${escapeHtml(title)}</h2><p class="panel-desc">${escapeHtml(description)}</p></div>
        ${printSheet ? `<div class="panel-actions"><button class="btn-print-module" type="button" data-print-module="${escapeAttribute(id)}" data-sheet="${escapeAttribute(printSheet)}"><span>📄</span> Print Worksheet ${escapeHtml(printSheet)}</button></div>` : ''}
      </div>
      <div class="module-body">${body}</div>
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
    const canDo = normaliseCanDo(v2Data.can_do || v2Data.passport, { stories, grammar, collocations, writing, truthItems });
    const notes = array(v2Data.teacher_notes);
    const modules = [];

    if (stories.length) modules.push({ id: 'stories', icon: '📚', title: 'Reading Dossiers', description: 'Explore each narrative, connected text, vocabulary, and real-world details.', render: renderStories });
    if (grammar && grammarHasContent(grammar)) modules.push({ id: 'grammar', icon: '🧪', title: 'Grammar Lab', description: grammar.title || grammar.theme || 'Discover the patterns and practise the target language.', render: renderGrammar, printSheet: '2' });
    if (collocations.length || challenge) modules.push({ id: 'collocations', icon: '🧩', title: 'Words in Partnership', description: 'Match natural word partners and guess terms from their definitions.', render: renderCollocations, printSheet: '3' });
    if (writing) modules.push({ id: 'writing', icon: '✍️', title: 'Writing Workshop', description: writing.title || writing.genre || 'Build a guided text step by step and preview the finished page.', render: renderWriting, printSheet: '4' });
    if (truthItems.length) modules.push({ id: 'practice', icon: '🎧', title: 'Practice Arena', description: 'Check key facts and practise vocabulary with short audio challenges.', render: renderPractice });
    if (worksheets) modules.push({ id: 'worksheets', icon: '🖨️', title: 'Printable Worksheets', description: worksheets.title || 'Print the complete classroom worksheet pack.', render: renderWorksheets });
    if (canDo) modules.push({ id: 'passport', icon: '🎖️', title: 'Can-Do Passport', description: canDo.title || 'Track what you can do and print a unit certificate.', render: renderPassport });
    if (workbookActivities.length) modules.push({ id: 'workbook', icon: '📓', title: 'Workbook', description: workbookData.title || 'Complete activities in printed book order.', render: renderWorkbook });
    if (notes.length || array(v2Data.book_checks).length) modules.push({ id: 'notes', icon: '🧑‍🏫', title: 'Teacher Notes', description: 'Fact checks, book corrections, and teaching guidance.', render: renderNotes });
    return modules;
  }

  function applyIdentity() {
    document.title = `${unitLabel()} | Digital Companion`;
    document.querySelectorAll('.shell-unit-label').forEach(element => { element.textContent = unitNum ? `Unit ${unitNum}: ${unitTitle()}` : unitTitle(); });
    document.querySelectorAll('.shell-unit-title').forEach(element => { element.textContent = unitTitle(); });
    document.querySelectorAll('.shell-unit-subtitle').forEach(element => { element.textContent = v2Data.subtitle || 'Interactive learning companion'; });
    document.querySelectorAll('.shell-footer-title').forEach(element => { element.textContent = `Coursebook Digital Companion • ${unitLabel()}`; });
  }

  function getVocabAudioPath(type, padId) {
    const base = selectedVoice === 'neural' ? 'assets/audio_neural' : 'assets/audio';
    if (type === 'def') return `${base}/defs/${padId}_definition.mp3`;
    if (type === 'example') return `${base}/examples/${padId}_example.mp3`;
    return `${base}/words/${padId}_word.mp3`;
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

  function setupAudio() {
    byId('hudStopBtn').addEventListener('click', stopAudio);
    byId('hudPauseBtn').addEventListener('click', () => {
      if (!currentAudio) return;
      if (currentAudio.paused) {
        currentAudio.play();
        byId('hudPauseBtn').textContent = '⸕️';
      } else {
        currentAudio.pause();
        byId('hudPauseBtn').textContent = '▶️';
      }
    });
    byId('v2VoiceSelect').addEventListener('change', event => {
      selectedVoice = event.target.value;
      stopAudio();
    });
    byId('v2SpeedSelect').addEventListener('change', event => {
      playbackRate = Number(event.target.value) || 1;
      if (currentAudio) currentAudio.playbackRate = playbackRate;
    });
  }

  function setupNavigation(modules) {
    const tabs = byId('moduleTabs');
    const panels = byId('v2Panels');
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
    byId('topTeacherNotesBtn').hidden = !notesModule;
    byId('topPrintPackBtn').hidden = !worksheetModule;
    byId('topTeacherNotesBtn').addEventListener('click', () => {
      if (!notesModule) return;
      switchModule('notes', true);
      byId('panel-notes')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    });
    byId('topPrintPackBtn').addEventListener('click', () => {
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
    return { title: value.title || 'Terms: Guess the Word from its Definition', note: value.note || '', first, second };
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
      sections
    };
  }

  function normaliseWorksheets(value) {
    if (!value) return null;
    const sheets = Array.isArray(value) ? value : array(value.sheets);
    if (!sheets.length) return null;
    return { title: value.title || 'Complete Worksheet Pack', sheets: sheets.map((sheet, index) => ({ id: sheet.id || index + 1, title: sheet.title || `Worksheet ${index + 1}`, lesson: sheet.lesson || '', sections: array(sheet.sections) })) };
  }

  function normaliseCanDo(value, availability) {
    const statements = value && !Array.isArray(value) ? array(value.statements) : array(value);
    if (statements.length) return { title: value.title || 'Can-Do Passport', statements };
    const generated = [];
    if (availability.stories.length) generated.push({ id: 'reading', title: 'Reader', statement: 'I can read the unit texts and use important words in context.', badge: '📚' });
    if (availability.grammar) generated.push({ id: 'grammar', title: 'Language User', statement: 'I can recognise and use this unit’s target language patterns.', badge: '🧪' });
    if (availability.collocations.length || availability.challenge) generated.push({ id: 'lexis', title: 'Word Finder', statement: 'I can match words with natural partners and explain their meanings.', badge: '🧩' });
    if (availability.writing) generated.push({ id: 'writing', title: 'Writer', statement: 'I can plan, write, and check a complete unit project.', badge: '✍️' });
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
    const values = [story.image, story.image_path, story.image_key, `assets/images_v2/${student}_${id}.svg`];
    return [...new Set(values.filter(Boolean))];
  }

  function storyLabel(story) {
    if (story.title) return story.title;
    return [story.student, story.country || story.topic || story.context].filter(Boolean).join(' — ');
  }

  function storyAudioPath(story) {
    return story.audio_file || story.audio || `assets/audio_v2/stories/${story.id}_full_story.mp3`;
  }

  function highlightVocabulary(text) {
    let result = escapeHtml(text);
    vocabList.forEach(item => {
      if (!item.word || item.word.length < 2) return;
      result = result.replace(new RegExp(`\\b(${escapeRegExp(escapeHtml(item.word))})\\b`, 'gi'), '<strong class="story-vocab-highlight" title="' + escapeAttribute(`${item.pos || ''} ${item.meaning_gr || ''}`.trim()) + '">$1</strong>');
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
        image.dataset.imageFallbacks = fallbacks.join('|');
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
    if (rules.length) parts.push(`<div class="grammar-card full-width"><div class="grammar-card-header"><h3>📐 Patterns in the Examples</h3></div><div class="grammar-rules-grid">${rules.map(rule => `<div class="grammar-rule-card"><h4>${escapeHtml(rule.concept || rule.tense || rule.title || 'Rule')}</h4><p>${escapeHtml(rule.usage || rule.explanation || '')}</p>${array(rule.signal_words).length ? `<div class="step-connectors"><span>Signals:</span>${array(rule.signal_words).map(word => `<span class="connector-chip">${escapeHtml(word)}</span>`).join('')}</div>` : ''}<ul>${array(rule.examples).map(example => `<li>${escapeHtml(example)}</li>`).join('')}</ul></div>`).join('')}</div></div>`);
    const practice = array(grammar.practice_items);
    if (practice.length) parts.push(`<div class="grammar-card full-width"><div class="grammar-card-header"><h3>🧩 Guided Practice</h3></div><div class="practice-list">${practice.map((item, index) => `<div class="practice-item"><strong>${escapeHtml(item.sentence || item.prompt || '')}</strong><div class="practice-options">${array(item.options).map(option => `<button type="button" class="practice-option" data-practice-index="${index}" data-practice-answer="${escapeAttribute(option)}">${escapeHtml(option)}</button>`).join('')}</div><div class="practice-feedback" data-practice-feedback="${index}"></div></div>`).join('')}</div></div>`);
    listeningComponents(grammar).forEach((listening, listeningIndex) => {
      const script = array(listening.dialogue_script);
      const quiz = array(listening.true_false_quiz || listening.content_true_false);
      const projects = array(listening.pupil_projects);
      const targetsData = array(listening.target_verbs);
      const audio = listening.audio_file || listening.audio;
      parts.push(`<div class="grammar-card full-width" data-listening-index="${listeningIndex}"><div class="grammar-card-header"><span class="badge lab-badge">${escapeHtml(listening.label || 'Listening task')}</span><h3>🎧 ${escapeHtml(listening.title || 'Authentic Listening')}</h3>${listening.instructions ? `<p>${escapeHtml(listening.instructions)}</p>` : ''}</div>${audio ? `<div class="listening-controls"><button class="play-full-story-btn" type="button" data-audio-src="${escapeAttribute(audio)}" data-audio-title="${escapeAttribute(listening.title || 'Listening')}">🔊 Play recording</button>${script.length ? '<button class="v1-switch-btn" type="button" data-toggle-transcript>📜 Toggle transcript</button>' : ''}</div>${script.length ? `<div class="lab-transcript" data-transcript hidden>${script.map(turn => `<p><strong>${escapeHtml(turn.speaker || '')}:</strong> ${escapeHtml(turn.text || '')}</p>`).join('')}</div>` : ''}` : ''}${projects.length ? `<div class="lab-station-list">${projects.map(project => `<div class="lab-station-row"><div class="student-avatar">${escapeHtml((project.pupil || '?').charAt(0))}</div><div class="station-content"><strong>${escapeHtml(project.pupil || '')}</strong><p>${escapeHtml(project.subject || '')}: ${escapeHtml(project.topic || '')}</p><p>${escapeHtml(project.actions || '')}</p></div></div>`).join('')}</div>` : ''}${targetsData.length ? `<div class="target-verb-list">${targetsData.map(target => `<span class="connector-chip"><strong>${escapeHtml(target.verb)}</strong> — ${escapeHtml(target.action || '')}</span>`).join('')}</div>` : ''}${quiz.length ? renderTruthChecklist(quiz, `listening-${listeningIndex}`) : ''}</div>`);
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
        feedback.textContent = item.explanation || (correct ? 'Correct.' : 'Try the unit text again.');
        feedback.className = `truth-feedback ${correct ? 'is-correct' : 'is-retry'}`;
        const solved = group.querySelectorAll('.truth-item.solved').length + (row.classList.contains('solved') ? 0 : 1);
        group.querySelectorAll('.truth-item').forEach(entry => entry.classList.remove('solved'));
        group.querySelectorAll('.truth-item').forEach(entry => {
          if (entry.querySelector('.btn-tf:disabled')) entry.classList.add('solved');
        });
        if (score) score.textContent = `Solved: ${group.querySelectorAll('.truth-item.solved').length} / ${pool.length}`;
        return solved;
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
        if (transcript) transcript.hidden = !transcript.hidden;
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

  function renderWriting() {
    const writing = normaliseWriting(v2Data.report_builder_guide || v2Data.writing_workshop);
    return `<div class="report-builder-wrap"><div class="report-target-selector no-print"><label for="writingTopic">${escapeHtml(writing.projectLabel)}:</label><input type="text" id="writingTopic" value="${escapeAttribute(writing.defaultTopic)}" placeholder="Enter a topic"><label for="writingAuthor">Author:</label><input type="text" id="writingAuthor" value="${escapeAttribute(writing.defaultAuthor)}" placeholder="Your name"><button class="btn-preview-report" id="writingPreview" type="button">📋 Refresh preview</button><button class="btn-print-report primary" id="writingPrint" type="button">🖨️ Print</button></div><div class="paragraphs-step-accordion" id="writingSteps">${writing.sections.map((section, index) => renderWritingSection(section, index)).join('')}</div><div class="report-live-preview-card" id="writingPreviewCard"><div class="preview-paper-header"><span class="paper-kicker">${escapeHtml(writing.genre)}</span><h2 class="preview-report-title" id="writingPreviewTitle">${escapeHtml(writing.title)}</h2><div class="preview-meta"><span id="writingPreviewAuthor"></span></div></div><div class="preview-paragraphs-body" id="writingPreviewBody"></div></div></div>`;
  }

  function renderWritingSection(section, index) {
    return `<div class="step-card" data-step="${index}"><div class="step-header"><div class="step-num-badge">${escapeHtml(section.number || index + 1)}</div><div class="step-title">${escapeHtml(section.heading || section.title || `Section ${index + 1}`)}</div></div>${section.guiding_questions || section.prompt ? `<p class="step-guide"><strong>Guide:</strong> ${escapeHtml(section.guiding_questions || section.prompt)}</p>` : ''}${array(section.connectors).length ? `<div class="step-connectors"><span>Helpful connectors:</span>${array(section.connectors).map(connector => `<button class="connector-chip" type="button" data-connector="${escapeAttribute(connector)}">${escapeHtml(connector)}</button>`).join('')}</div>` : ''}<textarea class="step-textarea" rows="4" data-writing-index="${index}" placeholder="${escapeAttribute(section.sample_starter || section.placeholder || 'Write this section...')}">${escapeHtml(section.sample_starter || '')}</textarea></div>`;
  }

  function setupWriting() {
    const steps = byId('writingSteps');
    if (!steps) return;
    const update = () => {
      const topic = byId('writingTopic').value.trim();
      const author = byId('writingAuthor').value.trim();
      const guide = normaliseWriting(v2Data.report_builder_guide || v2Data.writing_workshop);
      byId('writingPreviewTitle').textContent = topic ? `${guide.title}: ${topic}` : guide.title;
      byId('writingPreviewAuthor').textContent = author ? `By: ${author}` : '';
      byId('writingPreviewBody').innerHTML = Array.from(steps.querySelectorAll('textarea')).map((area, index) => `<p class="preview-para"><strong>${escapeHtml(guide.sections[index]?.heading || `Section ${index + 1}`)}:</strong> ${escapeHtml(area.value).replace(/\n/g, '<br>')}</p>`).join('');
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
    byId('writingTopic').addEventListener('input', update);
    byId('writingAuthor').addEventListener('input', update);
    byId('writingPreview').addEventListener('click', update);
    byId('writingPrint').addEventListener('click', () => { update(); window.print(); });
    update();
  }

  function renderPractice() {
    const truthItems = array(v2Data.content_true_false || v2Data.geography_true_false);
    const modes = [];
    if (vocabList.length >= 2) modes.push(['greek', '🔊 Spoken word → meaning'], ['def', '📖 Spoken word → definition'], ['gapfill', '🧩 Example sentence']);
    if (truthItems.length) modes.push(['fact', '⚡ Fact check']);
    return `<div class="challenge-module"><div class="challenge-mode-selector no-print" id="challengeModes">${modes.map(([id, label], index) => `<button class="ch-mode-btn${index === 0 ? ' active' : ''}" type="button" data-challenge-mode="${id}">${label}</button>`).join('')}</div><div class="challenge-game-card"><div class="ch-header"><div class="ch-score-box">Score: <strong id="challengeScore">0</strong> / <span id="challengeTotal">0</span></div><div class="ch-streak-box">Streak: <strong id="challengeStreak">0</strong></div><button class="ch-restart-btn" id="challengeRestart" type="button">🔄 Restart</button></div><div class="ch-prompt-box"><div class="ch-instruction" id="challengeInstruction">Choose a challenge.</div><div class="ch-audio-row"><button class="quiz-play-btn" id="challengePlay" type="button"><span>🔊</span><span>Play prompt</span></button></div></div><div class="ch-options-grid" id="challengeOptions"></div><div class="quiz-feedback-box" id="challengeFeedback" style="display:none;"><div class="feedback-icon" id="challengeFeedbackIcon">🎉</div><div class="feedback-text" id="challengeFeedbackText"></div><button class="next-question-btn" id="challengeNext" type="button">Next ➔</button></div></div><div class="truth-reference no-print"><h3>Complete fact bank</h3>${truthItems.map((item, index) => `<div class="truth-bank-item"><span>${index + 1}. ${escapeHtml(item.fact)}</span><button type="button" class="btn-tf" data-bank-answer="${item.answer}" data-bank-index="${index}">${item.answer ? 'TRUE' : 'FALSE'}</button></div>`).join('')}</div></div>`;
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
      const answer = challengeMode === 'greek' ? escapeHtml(item.meaning_gr) : challengeMode === 'def' ? escapeHtml(item.definition_en) : `${escapeHtml(item.word)} <span>(${escapeHtml(item.pos || '')})</span>`;
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
      if((item.dataset.factAnswer === 'true') === Boolean(challengeQuestion.target.answer)) item.classList.add('correct');
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
    byId('challengeRestart')?.addEventListener('click', startChallenge);
    byId('challengeNext')?.addEventListener('click', loadChallengeQuestion);
    byId('challengePlay')?.addEventListener('click', playChallengePrompt);
  }

  function deriveWorksheets(source) {
    const sheets = [];
    if (source.stories.length) sheets.push({ id: 1, title: 'Reading & Dossiers', sections: [{ kind: 'text', title: 'Read and respond', prompt: 'Read each profile and answer the prompts.', items: source.stories.flatMap(story => [`${storyLabel(story)}: ${story.summary || ''}`, ...array(story.landmarks).map(item => `${item.name || ''}: ${item.desc || ''}`)]) }] });
    if (source.grammar) sheets.push({ id: 2, title: 'Grammar in Action', sections: [{ kind: 'text', title: source.grammar.title || 'Target language', items: array(source.grammar.rules).flatMap(rule => [rule.usage || '', ...array(rule.examples)]) }, { kind: 'lines', title: 'Practice', items: array(source.grammar.practice_items).map(item => item.sentence || item.prompt || '') }] });
    if (source.collocations.length || source.challenge) sheets.push({ id: 3, title: 'Collocations & Definition Clues', sections: [{ kind: 'text', title: 'Word partners', items: source.collocations.map(item => `${item.verb || ''} ${item.partner || ''}: ${item.example || ''}`) }, { kind: 'text', title: source.challenge?.title || 'Definitions', items: [...(source.challenge?.first || []), ...(source.challenge?.second || [])].map(item => `${item.clue || ''} → ${item.word || ''}`) }] });
    if (source.writing) sheets.push({ id: 4, title: 'Guided Portfolio Writing', sections: source.writing.sections.map(section => ({ kind: 'lines', title: section.heading || section.title || 'Section', items: [section.guiding_questions || '', section.sample_starter || ''] })) });
    if (sheets.length) sheets.push({ id: 5, title: 'Unit Mastery Review', sections: [{ kind: 'text', title: 'Review', items: [`Vocabulary items: ${vocabList.length}`, ...array(source.grammar?.target_structures), ...(source.truthItems.length ? source.truthItems.map(item => item.fact) : [])] }] });
    if (sheets.length < 5 && sheets.length) {
      while (sheets.length < 5) sheets.push({ id: sheets.length + 1, title: `Review Sheet ${sheets.length + 1}`, sections: [{ kind: 'lines', title: 'Review and reflect', items: ['What did you learn?', 'What would you like to practise again?'] }] });
    }
    return sheets.length ? { title: 'Complete Classroom Worksheet Pack', sheets } : null;
  }

  function renderWorksheets() {
    const data = normaliseWorksheets(v2Data.worksheets) || deriveWorksheets({ stories: array(v2Data.stories || v2Data.dossiers), grammar: v2Data.grammar_lab, collocations: array(v2Data.collocations), challenge: normaliseChallenge(v2Data.definition_challenge || v2Data.crossword), writing: normaliseWriting(v2Data.report_builder_guide || v2Data.writing_workshop), truthItems: array(v2Data.content_true_false || v2Data.geography_true_false) });
    return `<div class="worksheets-module"><div class="sheet-tabs-row no-print" id="worksheetTabs">${data.sheets.map((sheet, index) => `<button class="sheet-tab${index === 0 ? ' active' : ''}" type="button" data-sheet-index="${escapeAttribute(sheet.id || index + 1)}">${escapeHtml(sheet.title || `Worksheet ${index + 1}`)}</button>`).join('')}</div><div class="worksheet-display" id="worksheetDisplay"></div></div>`;
  }

  function worksheetData() {
    return normaliseWorksheets(v2Data.worksheets) || deriveWorksheets({ stories: array(v2Data.stories || v2Data.dossiers), grammar: v2Data.grammar_lab, collocations: array(v2Data.collocations), challenge: normaliseChallenge(v2Data.definition_challenge || v2Data.crossword), writing: normaliseWriting(v2Data.report_builder_guide || v2Data.writing_workshop), truthItems: array(v2Data.content_true_false || v2Data.geography_true_false) });
  }

  function renderWorksheet(sheet) {
    if (!sheet) return '';
    return `<article class="printable-paper-sheet"><div class="sheet-meta-header"><div class="sheet-kicker">English 6th Grade • ${escapeHtml(unitLabel())}</div><h1 class="sheet-main-title">${escapeHtml(sheet.title || 'Worksheet')}</h1><div class="sheet-student-info-bar"><span><strong>Student:</strong> __________________</span><span><strong>Class:</strong> ________</span><span><strong>Date:</strong> __________</span></div></div>${array(sheet.sections).map(section => renderWorksheetSection(section)).join('')}<div class="sheet-footer-bar"><span>${escapeHtml(unitLabel())}</span><span>Offline Coursebook Companion</span></div></article>`;
  }

  function renderWorksheetSection(section) {
    const items = array(section.items || section.rows || section.prompts);
    if (!items.length && !section.prompt) return '';
    return `<section class="sheet-task-section"><h3 class="sheet-task-title">${escapeHtml(section.title || 'Task')}</h3>${section.prompt ? `<p class="sheet-prompt-text">${escapeHtml(section.prompt)}</p>` : ''}${items.length ? `<ol class="worksheet-list">${items.map(item => `<li>${escapeHtml(typeof item === 'string' ? item : JSON.stringify(item))}<div class="worksheet-answer-line"></div></li>`).join('')}</ol>` : ''}</section>`;
  }

  function selectWorksheet(index) {
    const data = worksheetData();
    if (!data) return;
    const sheet = data.sheets.find(entry => String(entry.id) === String(index)) || data.sheets[0];
    selectedWorksheet = sheet.id;
    byId('worksheetDisplay').innerHTML = renderWorksheet(sheet);
    byId('worksheetTabs')?.querySelectorAll('[data-sheet-index]').forEach(button => button.classList.toggle('active', String(button.dataset.sheetIndex) === String(sheet.id)));
  }

  function showAllWorksheetsForPrint() {
    const data = worksheetData();
    if (data) byId('worksheetDisplay').innerHTML = data.sheets.map(renderWorksheet).join('');
  }

  function setupWorksheets() {
    const tabs = byId('worksheetTabs');
    if (!tabs) return;
    tabs.addEventListener('click', event => {
      const button = event.target.closest('[data-sheet-index]');
      if (button) selectWorksheet(button.dataset.sheetIndex);
    });
    selectWorksheet(1);
  }

  function renderPassport() {
    const canDo = normaliseCanDo(v2Data.can_do || v2Data.passport, { stories: array(v2Data.stories || v2Data.dossiers), grammar: v2Data.grammar_lab, collocations: array(v2Data.collocations), challenge: normaliseChallenge(v2Data.definition_challenge || v2Data.crossword), writing: normaliseWriting(v2Data.report_builder_guide || v2Data.writing_workshop), truthItems: array(v2Data.content_true_false || v2Data.geography_true_false) });
    return `<div class="passport-layout"><div class="passport-checklist-card"><h3>${escapeHtml(canDo.title)}</h3><p>Tick each statement when you can complete it.</p><div class="can-do-list" id="canDoList">${canDo.statements.map((statement, index) => `<label class="can-do-item"><input type="checkbox" data-can-do-index="${index}"><div class="can-do-content"><strong>${escapeHtml(statement.title || `Can-Do ${index + 1}`)}</strong><span>${escapeHtml(statement.statement || statement.text || '')}</span></div></label>`).join('')}</div><div class="passport-progress-bar-wrap"><div class="progress-bar-label"><span>Unit Mastery</span><strong id="passportProgressPct">0% Complete</strong></div><div class="progress-bar-track"><div class="progress-bar-fill" id="passportProgressFill"></div></div></div></div><div class="certificate-card" id="certificateCard"><div class="cert-border"><div class="cert-header"><span class="cert-crest">🎓</span><h4>${escapeHtml(unitLabel())}</h4><h3>Certificate of Unit Mastery</h3></div><p class="cert-body">This is to certify that <span class="cert-student-name" id="certStudentName">_______________________</span> has completed the learning goals for <strong>${escapeHtml(unitTitle())}</strong>.</p><div class="cert-badges-row" id="certificateBadges">${canDo.statements.map((statement, index) => `<span class="cert-badge" data-certificate-badge="${index}">${escapeHtml(statement.badge || '⭐')} ${escapeHtml(statement.title || `Can-Do ${index + 1}`)}</span>`).join('')}</div><div class="cert-signatures"><div>Teacher: _______________</div><div>Date: _______________</div></div></div></div></div>`;
  }

  function setupPassport() {
    const checkboxes = [...document.querySelectorAll('#canDoList input[type="checkbox"]')];
    if (!checkboxes.length) return;
    const update = () => {
      const complete = checkboxes.filter(box => box.checked).length;
      const percent = Math.round(complete / checkboxes.length * 100);
      byId('passportProgressPct').textContent = `${percent}% Complete`;
      byId('passportProgressFill').style.width = `${percent}%`;
      checkboxes.forEach((box, index) => byId('certificateBadges').querySelector(`[data-certificate-badge="${index}"]`)?.classList.toggle('earned', box.checked));
    };
    checkboxes.forEach(box => box.addEventListener('change', update));
    byId('certificateCard').addEventListener('dblclick', event => {
      if (event.target.closest('button')) return;
      const name = window.prompt('Enter the learner name', '');
      if (name) byId('certStudentName').textContent = name;
    });
    update();
  }

  function activityLesson(activity) {
    if (activity.lesson) return String(activity.lesson).toLowerCase().replace(/[^a-z0-9]+/g, '-');
    const number = String(activity.number || activity.id || '');
    if (/^A/i.test(number)) return 'lesson1';
    if (/^B/i.test(number)) return 'lesson2';
    if (/^C/i.test(number)) return 'lesson3';
    return 'other';
  }

  function renderWorkbook() {
    const filters = [...new Set(workbookActivities.map(activityLesson))];
    return `<div class="workbook-module"><div class="workbook-filters-bar no-print"><span class="filter-label">Quick jump:</span><button class="wb-filter-btn active" type="button" data-wb-filter="all">All (${workbookActivities.length})</button>${filters.map(filter => `<button class="wb-filter-btn" type="button" data-wb-filter="${escapeAttribute(filter)}">${escapeHtml(titleCase(filter))}</button>`).join('')}</div><div class="workbook-cards-container" id="workbookCards">${workbookActivities.map(renderWorkbookCard).join('')}</div></div>`;
  }

  function renderWorkbookCard(activity) {
    const tierLabels = { closed: 'Closed • Instant Check', 'semi-open': 'Semi-Open • Rule Check', open: 'Open • Scaffolding' };
    return `<article class="wb-card" data-activity-id="${escapeAttribute(activity.id)}" data-tier="${escapeAttribute(activity.type)}" data-lesson="${escapeAttribute(activityLesson(activity))}"><div class="wb-card-header"><div class="wb-header-left"><div class="wb-badge-row"><span class="wb-num-badge">Activity ${escapeHtml(activity.number || activity.id)}</span><span class="wb-page-badge">Workbook p. ${escapeHtml(activity.page ?? '—')}</span><span class="wb-tier-badge ${escapeAttribute(activity.type)}">${escapeHtml(tierLabels[activity.type] || activity.type)}</span></div><h3 class="wb-card-title">${escapeHtml(activity.title || '')}</h3></div><button class="wb-print-btn" type="button" data-print-activity="${escapeAttribute(activity.id)}">🖨️ Print Worksheet</button></div>${renderBookCheck(activity.book_check)}${activity.instruction ? `<div class="wb-instruction">${escapeHtml(activity.instruction)}</div>` : ''}${renderWorkbookBody(activity)}<div class="wb-card-actions"><button class="wb-btn wb-btn-primary" type="button" data-check-activity="${escapeAttribute(activity.id)}">Check Answers</button><button class="wb-btn wb-btn-retry" type="button" data-retry-activity="${escapeAttribute(activity.id)}" hidden>Retry Mistakes</button><button class="wb-btn wb-btn-reveal" type="button" data-reveal-activity="${escapeAttribute(activity.id)}">Reveal Models</button><span class="wb-feedback-status" data-status-activity="${escapeAttribute(activity.id)}"></span></div></article>`;
  }

  function renderWorkbookContext(activity) {
    let html = '';
    if (activity.incoming_email) html += `<div class="wb-story-passage"><strong>Incoming message</strong><br>${escapeHtml(activity.incoming_email).replace(/\n/g, '<br>')}</div>`;
    if (activity.image) html += `<div class="wb-photo-box"><img class="wb-photo-img" src="${escapeAttribute(activity.image)}" alt="${escapeAttribute(activity.alt || 'Workbook image')}"></div>`;
    if (activity.greek_timetable && typeof activity.greek_timetable === 'object') {
      const days = Object.keys(activity.greek_timetable);
      const periodCount = Math.max(0, ...days.map(day => array(activity.greek_timetable[day]).length));
      html += `<div class="wb-landforms-table-wrap"><table class="wb-timetable-table"><thead><tr><th>Period</th>${days.map(day => `<th>${escapeHtml(day)}</th>`).join('')}</tr></thead><tbody>${Array.from({ length: periodCount }, (_, period) => `<tr><td class="wb-period-num">${period + 1}</td>${days.map(day => { const subject = array(activity.greek_timetable[day])[period] || ''; const translated = activity.subject_translations?.[subject] || subject; return `<td>${escapeHtml(translated)}</td>`; }).join('')}</tr>`).join('')}</tbody></table></div>`;
    }
    return html;
  }

  function renderWorkbookBody(activity) {
    const wordBank = array(activity.word_bank);
    const bankHtml = wordBank.length ? `<div class="wb-word-bank"><span class="wb-word-bank-label">Word Bank:</span>${wordBank.map(word => `<span class="wb-word-chip">${escapeHtml(word)}</span>`).join('')}</div>` : '';
    if (activity.part1 || activity.part2) return `${bankHtml}<div class="workbook-parts">${activity.part1 ? `<div><strong>${escapeHtml(activity.part1.prompt || '')}</strong><textarea class="wb-pupil-textarea" data-open-input="true" data-model="${escapeAttribute(array(activity.part1.model_answers).join(', '))}"></textarea></div>` : ''}${activity.part2 ? `<div><strong>${escapeHtml(activity.part2.prompt || '')}</strong><div class="wb-part-grid">${array(activity.part2.languages).map((entry, index) => `<label>${escapeHtml(entry.language || '')}<input class="wb-gap-input" data-part-input="${index}"></label>`).join('')}</div></div>` : ''}</div>`;
    if (array(activity.pairs).length) {
      const entries = activity.pairs;
      const firstKey = Object.keys(entries[0]).find(key => !['id', 'accepted', 'key_answer'].includes(key));
      const keys = Object.keys(entries[0]);
      const secondKey = keys.find(key => key !== firstKey && key !== 'id') || 'answer';
      const answers = [...new Set(entries.map(entry => entry[secondKey]))];
      return `${bankHtml}<div class="wb-match-grid">${entries.map((entry, index) => `<div class="wb-match-row"><span class="wb-match-country">${escapeHtml(entry[firstKey])}</span><select class="wb-match-select" data-match-index="${index}"><option value="">Choose…</option>${answers.map(answer => `<option value="${escapeAttribute(answer)}">${escapeHtml(answer)}</option>`).join('')}</select></div>`).join('')}</div>`;
    }
    if (array(activity.gaps).length) return `${bankHtml}<div class="wb-sentence-list">${activity.gaps.map(gap => `<div class="wb-sentence-row">${gap.speaker ? `<span class="wb-speaker-badge">${escapeHtml(gap.speaker)}</span>` : ''}<div class="wb-sentence-body">${gap.label ? `<span>${escapeHtml(gap.label)}</span>` : ''}<div>${escapeHtml(gap.prefix || '')} <input class="wb-gap-input" data-gap-id="${escapeAttribute(gap.id || uid())}" data-accepted="${escapeAttribute(array(gap.accepted || [gap.key_answer]).join('|||'))}"> ${escapeHtml(gap.suffix || '')}</div></div></div>`).join('')}</div>`;
    if (array(activity.landforms).length) return `${bankHtml}<div class="wb-landforms-table-wrap"><table class="wb-landforms-table"><thead><tr><th>${escapeHtml(activity.landforms[0].landform ? 'Term' : 'Item')}</th><th>${escapeHtml(activity.landforms[0].definition ? 'Definition' : 'Details')}</th><th>Your Example</th></tr></thead><tbody>${activity.landforms.map((item, index) => `<tr><td><strong>${escapeHtml(item.landform || item.term || item.name || '')}</strong>${item.greek_term ? `<br><small>${escapeHtml(item.greek_term)}</small>` : ''}</td><td>${escapeHtml(item.definition || item.description || '')}</td><td><input class="wb-gap-input" data-landform-input="${index}" data-model="${escapeAttribute(array(item.model_examples).join(', '))}" style="width:100%"></td></tr>`).join('')}</tbody></table></div>`;
    if (array(activity.items).length && array(activity.items[0].options).length) return `${bankHtml}<div class="wb-sentence-list">${activity.items.map((item, index) => `<div class="wb-sentence-row">${item.speaker ? `<span class="wb-speaker-badge">${escapeHtml(item.speaker)}</span>` : ''}<div class="wb-sentence-body"><span>${escapeHtml(item.context || item.prompt || item.sentence || '')}</span><select class="wb-match-select" data-item-select="${index}" data-key="${escapeAttribute(item.key_answer || item.target || '')}"><option value="">Choose…</option>${array(item.options).map(option => `<option value="${escapeAttribute(option)}">${escapeHtml(option)}</option>`).join('')}</select></div></div>`).join('')}</div>`;
    if (array(activity.items).length) return `${bankHtml}<div class="wb-subjects-grid">${activity.items.map((item, index) => `<div class="wb-subject-card">${item.image ? `<img class="wb-subject-img" src="${escapeAttribute(item.image)}" alt="${escapeAttribute(item.alt || 'Workbook illustration')}">` : ''}<input class="wb-gap-input" data-item-input="${index}" data-accepted="${escapeAttribute(array(item.accepted || [item.target || item.key_answer]).join('|||'))}" data-model="${escapeAttribute(item.target || item.key_answer || '')}" placeholder="Type answer"></div>`).join('')}</div>`;
    if (array(activity.adverbs).length) return `${bankHtml}<div class="wb-word-bank">${activity.adverbs.map((adverb, index) => `<label class="wb-sentence-row"><strong>${escapeHtml(adverb)}</strong><input class="wb-gap-input" style="width:100%" data-adverb-input="${index}" data-target="${escapeAttribute(adverb)}" data-model="${escapeAttribute(array(activity.model_answers)[index] || '')}"></label>`).join('')}</div>`;
    if (array(activity.starters).length) return `${bankHtml}<div class="wb-sentence-list">${activity.starters.map((starter, index) => `<label class="wb-sentence-row"><strong>${escapeHtml(starter)}</strong><input class="wb-gap-input" style="width:100%" data-starter-input="${index}" data-target="${escapeAttribute(starter)}" data-model="${escapeAttribute(array(activity.model_answers)[index] || '')}"></label>`).join('')}</div>`;
    if (activity.letter_text && array(activity.questions).length) return `<div class="wb-story-passage"><strong>${escapeHtml(activity.passage_title || 'Reading text')}</strong><br>${escapeHtml(activity.letter_text).replace(/\n/g, '<br>')}</div><div class="wb-sentence-list">${activity.questions.map((question, index) => `<div class="wb-sentence-row"><div class="wb-sentence-body"><span>${escapeHtml(question.question || '')}</span><input class="wb-gap-input" style="width:100%" data-fact-input="${index}" data-keywords="${escapeAttribute(array(question.key_facts || question.keywords).join('|||'))}" data-model="${escapeAttribute(question.model_answer || '')}"></div></div>`).join('')}</div>`;
    if (activity.incoming_email || activity.image || activity.greek_timetable) return `${renderWorkbookContext(activity)}${renderOpenScaffold(activity)}`;
    if (activity.type === 'open') return renderOpenScaffold(activity);
    return `${bankHtml}<textarea class="wb-pupil-textarea" data-semi-input="true" data-model="${escapeAttribute(array(activity.model_answers).join('\n'))}" placeholder="Write your answer..."></textarea>`;
  }

  function renderOpenScaffold(activity) {
    const checklist = array(activity.checklist || activity.scaffolding_checklist);
    const starters = array(activity.sentence_starters);
    return `<div class="wb-scaffolding-box"><div class="wb-scaffolding-title"><span>Writing checklist</span><span class="wb-disclaimer">Reminder checklist, not a score</span></div>${checklist.length ? `<div class="wb-checklist">${checklist.map((item, index) => `<div class="wb-check-item" data-checklist-index="${index}"><span class="wb-check-icon">◻️</span><span>${escapeHtml(item.label || item.point || '')}</span></div>`).join('')}</div>` : ''}${starters.length ? `<div class="wb-starters-row">${starters.map(starter => `<button class="wb-starter-chip" type="button" data-starter="${escapeAttribute(starter)}">${escapeHtml(starter)}</button>`).join('')}</div>` : ''}${array(activity.word_bank).length ? `<div class="wb-word-bank"><span class="wb-word-bank-label">Word Bank:</span>${activity.word_bank.map(word => `<span class="wb-word-chip">${escapeHtml(word)}</span>`).join('')}</div>` : ''}</div><textarea class="wb-pupil-textarea" data-open-text="${escapeAttribute(activity.id)}" placeholder="Write your response..."></textarea><div class="wb-card-actions"><button class="wb-btn wb-btn-primary wb-hint-btn" type="button" data-hint-activity="${escapeAttribute(activity.id)}">💡 Writing Guide</button><button class="wb-btn wb-btn-reveal wb-model-toggle-btn" type="button" data-model-activity="${escapeAttribute(activity.id)}">Reveal Model Text</button></div><div class="wb-hint-box" data-hint-box="${escapeAttribute(activity.id)}" hidden></div><div class="wb-model-container" data-model-box="${escapeAttribute(activity.id)}" hidden><div class="wb-model-header">Model Text</div><p>${escapeHtml(activity.model_text || array(activity.model_answers).join('\n'))}</p></div>`;
  }

  function getHint(activityId, pupilText) {
    return null;
  }

  function setupWorkbook() {
    const container = byId('workbookCards');
    if (!container) return;
    const filterBar = container.previousElementSibling;
    filterBar?.addEventListener('click', event => {
      const button = event.target.closest('[data-wb-filter]');
      if (!button) return;
      filterBar.querySelectorAll('[data-wb-filter]').forEach(item => item.classList.toggle('active', item === button));
      container.querySelectorAll('.wb-card').forEach(card => { card.hidden = button.dataset.wbFilter !== 'all' && card.dataset.lesson !== button.dataset.wbFilter; });
    });
    workbookActivities.forEach(activity => {
      const card = container.querySelector(`[data-activity-id="${CSS.escape(activity.id)}"]`);
      if (!card) return;
      const controls = [...card.querySelectorAll('input,select,textarea')];
      const status = card.querySelector(`[data-status-activity="${CSS.escape(activity.id)}"]`);
      const retry = card.querySelector(`[data-retry-activity="${CSS.escape(activity.id)}"]`);
      const setStatus = (correct, total) => {
        status.innerHTML = `<span style="color:${correct === total ? '#276749' : '#c53030'}">${correct} / ${total} valid</span>`;
        retry.hidden = correct === total;
      };
      const validate = control => {
        const value = normalise(control.value);
        if (control.matches('[data-match-index]')) return normalise(activity.pairs?.[Number(control.dataset.matchIndex)]?.[Object.keys(activity.pairs[Number(control.dataset.matchIndex)]).find(key => !['id', 'accepted', 'key_answer'].includes(key) && key !== Object.keys(activity.pairs[Number(control.dataset.matchIndex)])[0])] || '') === value;
        if (control.matches('[data-gap-id], [data-item-input]')) return control.dataset.accepted.split('|||').some(answer => normalise(answer) === value);
        if (control.matches('[data-item-select]')) return normalise(control.dataset.key) === value;
        if (control.matches('[data-adverb-input]')) return value.includes(normalise(control.dataset.target)) && value.split(/\s+/).length >= 3;
        if (control.matches('[data-starter-input]')) return value.startsWith(normalise(control.dataset.target)) && value.endsWith('?') && value.split(/\s+/).length >= 3;
        if (control.matches('[data-fact-input]')) return control.dataset.keywords.split('|||').some(keyword => value.includes(normalise(keyword))) && value.length > 2;
        return Boolean(value);
      };
      const check = () => {
        let correct = 0;
        controls.forEach(control => {
          const valid = validate(control);
          control.classList.toggle('is-correct', valid);
          control.classList.toggle('is-retry', !valid);
          if (valid) correct += 1;
        });
        setStatus(correct, controls.length);
      };
      const reveal = () => {
        controls.forEach(control => {
          if (control.matches('[data-match-index]')) {
            const pair = activity.pairs?.[Number(control.dataset.matchIndex)] || {};
            const keys = Object.keys(pair);
            const firstKey = keys.find(key => !['id', 'accepted', 'key_answer'].includes(key));
            const secondKey = keys.find(key => key !== firstKey && key !== 'id') || 'answer';
            control.value = pair[secondKey] || '';
          } else if (control.matches('[data-gap-id]')) {
            const gap = array(activity.gaps).find(item => String(item.id) === control.dataset.gapId);
            control.value = gap?.key_answer || array(gap?.accepted)[0] || '';
          } else if (control.matches('[data-item-select]')) {
            control.value = control.dataset.key;
          } else if (control.dataset.model) {
            control.value = control.dataset.model;
          }
          control.classList.add('is-revealed');
        });
        status.textContent = 'Models revealed';
        retry.hidden = true;
      };
      card.querySelector(`[data-check-activity="${CSS.escape(activity.id)}"]`)?.addEventListener('click', check);
      card.querySelector(`[data-retry-activity="${CSS.escape(activity.id)}"]`)?.addEventListener('click', () => {
        const wrong = controls.filter(control => control.classList.contains('is-retry'));
        wrong.forEach(control => { control.value = ''; control.classList.remove('is-retry'); });
        wrong[0]?.focus();
      });
      card.querySelector(`[data-reveal-activity="${CSS.escape(activity.id)}"]`)?.addEventListener('click', reveal);
      card.querySelector(`[data-print-activity="${CSS.escape(activity.id)}"]`)?.addEventListener('click', () => printWorkbookActivity(activity));
      const openText = card.querySelector('[data-open-text]');
      if (openText) {
        openText.addEventListener('input', () => {
          const text = normalise(openText.value);
          card.querySelectorAll('[data-checklist-index]').forEach(checkItem => {
            const item = array(activity.checklist || activity.scaffolding_checklist)[Number(checkItem.dataset.checklistIndex)];
            const matched = array(item?.keywords).some(keyword => text.includes(normalise(keyword)));
            checkItem.classList.toggle('is-ticked', matched);
            checkItem.querySelector('.wb-check-icon').textContent = matched ? '✅' : '◻️';
          });
        });
      }
      card.querySelectorAll('[data-starter]').forEach(button => button.addEventListener('click', () => {
        if (!openText) return;
        openText.value = `${openText.value.trim()} ${button.dataset.starter}`.trim();
        openText.focus();
      }));
      card.querySelector(`[data-hint-activity="${CSS.escape(activity.id)}"]`)?.addEventListener('click', () => {
        const hint = getHint(activity.id, openText?.value || '');
        const box = card.querySelector(`[data-hint-box="${CSS.escape(activity.id)}"]`);
        box.hidden = false;
        box.textContent = hint || 'Use the checklist, sentence starters, and word bank to check your ideas.';
      });
      card.querySelector(`[data-model-activity="${CSS.escape(activity.id)}"]`)?.addEventListener('click', event => {
        const box = card.querySelector(`[data-model-box="${CSS.escape(activity.id)}"]`);
        box.hidden = !box.hidden;
        event.currentTarget.textContent = box.hidden ? 'Reveal Model Text' : 'Hide Model Text';
      });
    });
  }

  function printWorkbookActivity(activity) {
    const area = byId('workbookPrintArea');
    if (!area) return;
    const sheet = `<article class="printable-paper-sheet"><div class="sheet-meta-header"><div class="sheet-kicker">English 6th Grade • ${escapeHtml(unitLabel())}</div><h1 class="sheet-main-title">Activity ${escapeHtml(activity.number || activity.id)}: ${escapeHtml(activity.title || '')}</h1><div class="sheet-student-info-bar"><span><strong>Name:</strong> __________________</span><span><strong>Class:</strong> ________</span><span><strong>Date:</strong> __________</span></div></div>${renderBookCheck(activity.book_check)}${activity.instruction ? `<p class="sheet-prompt-text">${escapeHtml(activity.instruction)}</p>` : ''}${renderWorkbookBody(activity)}<div class="sheet-footer-bar"><span>${escapeHtml(unitLabel())}</span><span>Workbook Activity</span></div></article>`;
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
        playAudioFile(button.dataset.audioSrc, 'Audio', button.dataset.audioTitle || 'Audio', button);
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
