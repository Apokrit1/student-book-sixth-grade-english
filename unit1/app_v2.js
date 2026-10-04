/**
 * UNIT 1: OUR MULTICULTURAL CLASS - VERSION 2 (v2) LOGIC
 * Integrative CLIL, Story Dossiers, Grammar Lab, Writing Workshop & Worksheets
 */

document.addEventListener('DOMContentLoaded', () => {
  // Dynamic Unit Resolution: reads data-unit from body or defaults to 1
  const unitNum = document.body.dataset.unit || '1';
  const windowDataKey = `UNIT${unitNum}_V2_DATA`;
  const jsonPath = `data/unit${unitNum}_v2_data.json`;
  const vocabList = window[`VOCABULARY_UNIT${unitNum}_DATA`] || window.VOCABULARY_DATA || [];
  let v2Data = null;

  // Global State
  let activeTab = 'stories';
  let activeCountry = 'ukraine';
  let selectedVoice = 'neural';
  let playbackRate = 1.0;
  
  // Audio State
  let currentAudio = null;
  let audioQueue = [];
  let audioQueueTimeout = null;
  let activePlayBtn = null;

  // Collocation Matcher State
  let selectedVerb = null;
  let matchedPairs = 0;

  // Challenge Arena State
  let challengeMode = 'greek';
  let chQuestion = null;
  let chScore = 0;
  let chStreak = 0;
  let chTotal = 0;

  // DOM Elements - Navigation
  const navTabs = document.querySelectorAll('.v2-tab');
  const panels = {
    stories: document.getElementById('panel-stories'),
    grammar: document.getElementById('panel-grammar'),
    collocations: document.getElementById('panel-collocations'),
    report: document.getElementById('panel-report'),
    challenges: document.getElementById('panel-challenges'),
    worksheets: document.getElementById('panel-worksheets'),
    passport: document.getElementById('panel-passport'),
    workbook: document.getElementById('panel-workbook')
  };

  // Audio HUD Elements
  const audioHud = document.getElementById('audioHud');
  const hudAudioType = document.getElementById('hudAudioType');
  const hudAudioTitle = document.getElementById('hudAudioTitle');
  const hudPauseBtn = document.getElementById('hudPauseBtn');
  const hudStopBtn = document.getElementById('hudStopBtn');
  const v2VoiceSelect = document.getElementById('v2VoiceSelect');
  const v2SpeedSelect = document.getElementById('v2SpeedSelect');

  // Load V2 Enriched Data (Priority to window object for offline file:// protocol compatibility)
  if (window[windowDataKey]) {
    v2Data = window[windowDataKey];
    initV2();
  } else if (window.UNIT1_V2_DATA && unitNum === '1') {
    v2Data = window.UNIT1_V2_DATA;
    initV2();
  } else {
    fetch(jsonPath)
      .then(res => res.json())
      .then(data => {
        v2Data = data;
        initV2();
      })
      .catch(err => {
        console.error(`Error loading ${jsonPath}:`, err);
      });
  }

  // ==========================================
  // INITIALIZATION
  // ==========================================
  function initV2() {
    setupTabNavigation();
    setupAudioControllers();
    setupCountryDossiers();
    setupGrammarLab();
    setupCollocationsAndCrossword();
    setupReportBuilder();
    setupChallengeArena();
    setupWorksheetsPack();
    setupCanDoPassport();
    setupTeacherNotes();
    setupWorkbookModule();

    // Attach print button shortcuts
    document.querySelectorAll('.btn-print-module').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const sheetIdx = e.currentTarget.dataset.sheet;
        switchToTab('worksheets');
        selectWorksheetTab(sheetIdx);
        setTimeout(() => window.print(), 300);
      });
    });

    document.getElementById('topPrintPackBtn').addEventListener('click', () => {
      switchToTab('worksheets');
      showAllWorksheetsForPrint();
      setTimeout(() => window.print(), 300);
    });
  }

  // ==========================================
  // AUDIO ENGINE & HUD
  // ==========================================
  function getVocabAudioPath(type, padId) {
    const base = selectedVoice === 'neural' ? 'assets/audio_neural' : 'assets/audio';
    switch (type) {
      case 'word': return `${base}/words/${padId}_word.mp3`;
      case 'def': return `${base}/defs/${padId}_definition.mp3`;
      case 'example': return `${base}/examples/${padId}_example.mp3`;
      default: return `${base}/words/${padId}_word.mp3`;
    }
  }

  function playAudioSequence(srcs, typeName, trackTitle, triggerBtn = null) {
    stopAudio();

    if (!Array.isArray(srcs)) {
      srcs = [srcs];
    }
    const cleanSrcs = srcs.filter(s => !!s);
    if (cleanSrcs.length === 0) return;

    audioQueue = cleanSrcs.slice();

    hudAudioType.textContent = typeName;
    hudAudioTitle.textContent = trackTitle;
    audioHud.style.display = 'block';
    hudPauseBtn.textContent = '⏸️';

    if (triggerBtn) {
      activePlayBtn = triggerBtn;
      triggerBtn.classList.add('playing');
    }

    function playNext() {
      if (audioQueue.length === 0) {
        stopAudio();
        return;
      }

      const nextSrc = audioQueue.shift();
      currentAudio = new Audio(nextSrc);
      currentAudio.playbackRate = playbackRate;

      currentAudio.play().catch(e => {
        console.warn('Audio playback prevented or missing file:', nextSrc, e);
        stopAudio();
      });

      currentAudio.onended = () => {
        if (audioQueue.length > 0) {
          audioQueueTimeout = setTimeout(playNext, 350);
        } else {
          stopAudio();
        }
      };

      currentAudio.onerror = () => {
        stopAudio();
      };
    }

    playNext();
  }

  function playAudioFile(src, typeName, trackTitle, triggerBtn = null) {
    playAudioSequence([src], typeName, trackTitle, triggerBtn);
  }

  function stopAudio() {
    if (audioQueueTimeout) {
      clearTimeout(audioQueueTimeout);
      audioQueueTimeout = null;
    }
    audioQueue = [];
    if (currentAudio) {
      currentAudio.pause();
      currentAudio = null;
    }
    audioHud.style.display = 'none';
    if (activePlayBtn) {
      activePlayBtn.classList.remove('playing');
      activePlayBtn = null;
    }
  }

  function setupAudioControllers() {
    hudPauseBtn.addEventListener('click', () => {
      if (!currentAudio) return;
      if (currentAudio.paused) {
        currentAudio.play();
        hudPauseBtn.textContent = '⏸️';
      } else {
        currentAudio.pause();
        hudPauseBtn.textContent = '▶️';
      }
    });

    hudStopBtn.addEventListener('click', stopAudio);

    v2VoiceSelect.addEventListener('change', (e) => {
      selectedVoice = e.target.value;
      stopAudio();
    });

    v2SpeedSelect.addEventListener('change', (e) => {
      playbackRate = parseFloat(e.target.value);
      if (currentAudio) currentAudio.playbackRate = playbackRate;
    });
  }

  // ==========================================
  // TAB NAVIGATION
  // ==========================================
  function setupTabNavigation() {
    navTabs.forEach(tab => {
      tab.addEventListener('click', () => {
        const target = tab.dataset.tab;
        switchToTab(target);
      });
    });
  }

  function switchToTab(tabId) {
    activeTab = tabId;
    navTabs.forEach(t => {
      const isMatch = t.dataset.tab === tabId;
      t.classList.toggle('active', isMatch);
      t.setAttribute('aria-selected', isMatch ? 'true' : 'false');
    });

    Object.keys(panels).forEach(key => {
      panels[key].classList.toggle('active', key === tabId);
    });

    if (tabId === 'challenges' && !chQuestion) {
      startChallenge();
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  // ==========================================
  // MODULE 1: COUNTRY DOSSIERS
  // ==========================================
  function setupCountryDossiers() {
    const pills = document.querySelectorAll('.country-pill');
    pills.forEach(pill => {
      pill.addEventListener('click', () => {
        pills.forEach(p => p.classList.remove('active'));
        pill.classList.add('active');
        activeCountry = pill.dataset.country;
        renderCountryDossier(activeCountry);
      });
    });

    renderCountryDossier('ukraine');
  }

  function renderCountryDossier(countryId) {
    const story = v2Data.stories.find(s => s.id === countryId);
    const container = document.getElementById('storyDossierCard');
    if (!story || !container) return;

    const svgImg = `assets/images_v2/${countryId === 'uk' ? 'gwen_uk' : (countryId === 'ukraine' ? 'sasha_ukraine' : (countryId === 'albania' ? 'christina_albania' : 'georgi_georgia'))}.svg`;
    const storyAudioSrc = `assets/audio_v2/stories/${countryId}_full_story.mp3`;

    container.innerHTML = `
      <div class="dossier-hero-row">
        <div class="dossier-visual-box">
          <img src="${svgImg}" alt="${story.country}">
        </div>
        <div class="dossier-title-area">
          <span class="dossier-kicker">Newcomer Profile • Lesson 1</span>
          <h2 class="dossier-heading">${story.student} from ${story.country} ${story.flag}</h2>
          
          <div class="dossier-meta-tags">
            <span class="dossier-meta-badge">Capital: <strong>${story.capital}</strong></span>
            <span class="dossier-meta-badge">Hometown: <strong>${story.hometown}</strong></span>
            <span class="dossier-meta-badge">Nationality: <strong>${story.nationality}</strong></span>
            ${story.voice_description ? `<span class="dossier-meta-badge" title="Character Voice: ${story.voice}">🎙️ Voice: <strong>${story.voice_description}</strong></span>` : ''}
          </div>

          <p class="dossier-summary">${story.summary}</p>

          <button class="play-full-story-btn" id="btnPlayStoryAudio">
            <span>🔊</span> Listen to ${story.student}'s Complete Story
          </button>
        </div>
      </div>

      <div class="story-narrative-box">
        ${highlightStoryVocabulary(story.narrative)}
      </div>

      ${story.book_check ? `
        <div class="book-check-box">
          <span class="book-check-badge">📖 Book check</span>
          <span class="book-check-text">
            <strong>${story.book_check.title}:</strong> ${story.book_check.note}
          </span>
        </div>
      ` : ''}

      <div class="story-lexis-bar" style="margin: -10px 0 24px; padding: 14px 18px; background: #fffaf0; border-radius: var(--radius-md); border: 1px solid rgba(221, 107, 32, 0.25); display: flex; flex-wrap: wrap; gap: 8px; align-items: center;">
        <span style="font-weight: 800; font-size: 0.85rem; color: var(--primary-color); display: inline-flex; align-items: center; gap: 6px;">
          <span>📖</span> ${story.student}'s Core Vocabulary:
        </span>
        ${(story.vocabulary_ids || []).map(vid => {
          const vItem = vocabList.find(v => v.id === vid);
          if (!vItem) return '';
          const padId = String(vItem.id).padStart(2, '0');
          return `
            <button class="audio-chip-btn" data-padid="${padId}" data-word="${vItem.word}" title="${vItem.pos} • ${vItem.meaning_gr}">
              🔊 ${vItem.word}
            </button>
          `;
        }).join('')}
      </div>

      <h3 class="landmarks-section-title">🗺️ Key Geographical Landmarks & Vocabulary In Focus</h3>
      <div class="landmarks-grid">
        ${story.landmarks.map(lm => {
          let vocabItem = null;
          if (lm.word_key) {
            vocabItem = vocabList.find(v => v.word.toLowerCase() === lm.word_key.toLowerCase());
          }
          if (!vocabItem && lm.word_id) {
            vocabItem = vocabList.find(v => v.id === lm.word_id);
          }
          const padId = vocabItem ? String(vocabItem.id).padStart(2, '0') : null;
          return `
            <div class="landmark-card">
              <div class="landmark-header">
                <div class="landmark-title">${lm.name}</div>
                ${vocabItem ? `
                  <button class="audio-chip-btn" data-padid="${padId}" data-word="${vocabItem.word}" title="Hear pronunciation: ${vocabItem.word}">
                    🔊 ${vocabItem.word}
                  </button>
                ` : ''}
              </div>
              <div class="landmark-type">${lm.type}</div>
              <p class="landmark-desc">${lm.desc}</p>
            </div>
          `;
        }).join('')}
      </div>
    `;

    document.getElementById('btnPlayStoryAudio').addEventListener('click', (e) => {
      playAudioFile(storyAudioSrc, 'Country Story Narration', `${story.student}'s ${story.country}`, e.currentTarget);
    });

    container.querySelectorAll('.audio-chip-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const padId = e.currentTarget.dataset.padid;
        const word = e.currentTarget.dataset.word;
        const srcs = [
          getVocabAudioPath('word', padId),
          getVocabAudioPath('def', padId),
          getVocabAudioPath('example', padId)
        ];
        playAudioSequence(srcs, 'Vocabulary Reading', word, e.currentTarget);
      });
    });
  }

  function highlightStoryVocabulary(text) {
    let result = text;
    vocabList.forEach(item => {
      const regex = new RegExp(`\\b(${item.word})\\b`, 'gi');
      result = result.replace(regex, `<strong style="color: var(--primary); text-decoration: underline dotted;" title="${item.pos} • ${item.meaning_gr}">$1</strong>`);
    });
    return result;
  }

  // ==========================================
  // MODULE 2: GRAMMAR LAB (AUTHENTIC LISTENING & COMPUTER VERBS)
  // ==========================================
  function setupGrammarLab() {
    const labContainer = document.getElementById('labSceneContainer');
    const badluckContainer = document.getElementById('badluckTimeline');
    const freqContainer = document.getElementById('frequencySpectrumBar');
    const playDialogueBtn = document.getElementById('btnPlayLabDialogue');
    const toggleTranscriptBtn = document.getElementById('btnToggleLabTranscript');
    const transcriptBox = document.getElementById('labTranscriptBox');
    const quizList = document.getElementById('labQuizList');
    const quizScoreEl = document.getElementById('labQuizScore');

    if (!v2Data || !v2Data.grammar_lab) return;

    // A1. Authentic Dialogue Audio Player
    if (playDialogueBtn) {
      playDialogueBtn.addEventListener('click', (e) => {
        const src = 'assets/audio_v2/grammar/school_lab_overview.mp3';
        playAudioFile(src, 'Authentic Listening Task', 'Lesson 2: At the School Computer Lab', e.currentTarget);
      });
    }

    // A2. Dialogue Transcript Toggle
    if (toggleTranscriptBtn && transcriptBox && v2Data.grammar_lab.school_lab_listening) {
      transcriptBox.innerHTML = v2Data.grammar_lab.school_lab_listening.dialogue_script.map(turn => `
        <div style="margin-bottom: 8px;">
          <strong style="color: var(--primary-color);">${turn.speaker}:</strong> ${turn.text}
        </div>
      `).join('');

      toggleTranscriptBtn.addEventListener('click', () => {
        const isHidden = transcriptBox.style.display === 'none';
        transcriptBox.style.display = isHidden ? 'block' : 'none';
      });
    }

    // A3. Student Lab Stations (Authentic Tasks & Computer Verbs)
    if (labContainer && v2Data.grammar_lab.school_lab_actions) {
      labContainer.innerHTML = v2Data.grammar_lab.school_lab_actions.map(st => `
        <div class="lab-station-row">
          <div class="student-avatar">${st.student[0]}</div>
          <div class="station-content">
            <div class="station-now">
              <span class="badge" style="background: #e2e8f0; color: #2d3748; font-size: 0.72rem; margin-right: 6px; padding: 2px 6px; border-radius: 4px;">${st.subject || 'STEM'}</span>
              <strong>${st.student}</strong> ${st.action_now}.
            </div>
            <div class="station-habit">Everyday Habit: ${st.student} ${st.habit}.</div>
            ${st.enrichment_note ? `
              <div style="font-size: 0.78rem; color: #744210; background: #feebc8; padding: 4px 8px; border-radius: 4px; margin-top: 4px;">
                🕌 <strong>Enrichment:</strong> ${st.enrichment_note}
              </div>
            ` : ''}
          </div>
          <button class="audio-chip-btn play-lab-btn" data-text="${st.student} ${st.action_now}">
            🔊 Listen
          </button>
        </div>
      `).join('');

      labContainer.querySelectorAll('.play-lab-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
          const text = e.currentTarget.dataset.text;
          const src = `assets/audio_v2/grammar/school_lab_overview.mp3`;
          playAudioFile(src, 'Computer Lab Task', text, e.currentTarget);
        });
      });
    }

    // A4. Authentic True/False Listening Comprehension Check
    if (quizList && v2Data.grammar_lab.school_lab_listening) {
      let score = 0;
      const answered = new Set();
      const items = v2Data.grammar_lab.school_lab_listening.true_false_quiz;

      quizList.innerHTML = items.map((q, idx) => `
        <div class="lab-quiz-item" id="labQuizItem_${idx}" style="padding: 12px 14px; background: #f8fafc; border-radius: var(--radius-sm); border: 1px solid var(--border-subtle);">
          <div style="display: flex; justify-content: space-between; align-items: center; gap: 10px; flex-wrap: wrap;">
            <span style="font-size: 0.92rem; color: #2d3748;"><strong>${idx + 1}.</strong> ${q.statement}</span>
            <div style="display: flex; gap: 6px;">
              <button class="btn-tf" data-idx="${idx}" data-choice="true" style="padding: 4px 12px; font-size: 0.8rem; font-weight: 700; border-radius: 4px; border: 1px solid #cbd5e0; background: #ffffff; cursor: pointer;">TRUE</button>
              <button class="btn-tf" data-idx="${idx}" data-choice="false" style="padding: 4px 12px; font-size: 0.8rem; font-weight: 700; border-radius: 4px; border: 1px solid #cbd5e0; background: #ffffff; cursor: pointer;">FALSE</button>
            </div>
          </div>
          <div class="quiz-feedback" id="quizFeedback_${idx}" style="display: none; margin-top: 8px; font-size: 0.84rem; padding: 6px 10px; border-radius: 4px;"></div>
        </div>
      `).join('');

      quizList.querySelectorAll('.btn-tf').forEach(btn => {
        btn.addEventListener('click', (e) => {
          const idx = parseInt(e.currentTarget.dataset.idx, 10);
          const userChoice = e.currentTarget.dataset.choice === 'true';
          const q = items[idx];
          const itemEl = document.getElementById(`labQuizItem_${idx}`);
          const fbEl = document.getElementById(`quizFeedback_${idx}`);
          const isCorrect = userChoice === q.answer;

          itemEl.querySelectorAll('.btn-tf').forEach(b => b.disabled = true);
          fbEl.style.display = 'block';

          if (isCorrect) {
            e.currentTarget.style.background = '#38a169';
            e.currentTarget.style.color = '#ffffff';
            fbEl.style.background = '#f0fff4';
            fbEl.style.color = '#22543d';
            fbEl.innerHTML = `<strong>Correct!</strong> ${q.explanation}`;
            if (!answered.has(idx)) {
              score++;
              answered.add(idx);
            }
          } else {
            e.currentTarget.style.background = '#e53e3e';
            e.currentTarget.style.color = '#ffffff';
            fbEl.style.background = '#fff5f5';
            fbEl.style.color = '#742a2a';
            fbEl.innerHTML = `<strong>Not quite.</strong> ${q.explanation}`;
          }

          if (quizScoreEl) {
            quizScoreEl.textContent = `Score: ${score} / ${items.length}`;
          }
        });
      });
    }

    // B. Mr Badluck Comic
    if (badluckContainer) {
      badluckContainer.innerHTML = v2Data.grammar_lab.mr_badluck_comic.map(m => `
        <div class="badluck-moment">
          <div class="moment-time-row">
            <span>⏰ ${m.time}</span>
            <span>Habit (Present Simple) vs. Today (Continuous)</span>
          </div>
          <div class="moment-routine">🗓️ <strong>Every day:</strong> ${m.routine}</div>
          <div class="moment-today">⚡ <strong>Today:</strong> ${m.today}</div>
        </div>
      `).join('');
    }

    // C. Frequency Spectrum
    if (freqContainer) {
      freqContainer.innerHTML = v2Data.grammar_lab.frequency_spectrum.map(f => `
        <div class="freq-card">
          <div class="freq-pct">${f.percent}%</div>
          <div class="freq-adverb">${f.adverb}</div>
          <p class="freq-sentence">"${f.example}"</p>
        </div>
      `).join('');
    }

    // D. Classroom Charades Game (§C4)
    const btnNextCharade = document.getElementById('btnNextCharade');
    const charadeDisplay = document.getElementById('charadeActionDisplay');
    const charadePrompt = document.getElementById('charadeQuestionPrompt');

    if (btnNextCharade && v2Data.grammar_lab && v2Data.grammar_lab.charades_game) {
      let charadeIndex = 0;
      const charades = v2Data.grammar_lab.charades_game.prompts || [];

      btnNextCharade.addEventListener('click', () => {
        if (charades.length === 0) return;
        const current = charades[charadeIndex % charades.length];
        charadeIndex++;

        if (charadeDisplay) {
          charadeDisplay.textContent = `🎭 Action: ${current.action}`;
        }
        if (charadePrompt) {
          charadePrompt.innerHTML = `The class asks: <em>"${current.question}"</em> &bull; Reply: <strong style="color: #2b6cb0;">"${current.affirmative}"</strong> or <strong style="color: #c53030;">"${current.negative}"</strong>`;
        }
      });
    }

    // E. Photodentro Interactive Lab In-App Modal Controls
    const btnOpenPhotodentro = document.getElementById('btnOpenPhotodentroModal');
    const modalPhotodentro = document.getElementById('photodentroModal');
    const backdropPhotodentro = document.getElementById('photodentroModalBackdrop');
    const btnClosePhotodentro = document.getElementById('btnClosePhotodentroModal');
    const iframePhotodentro = document.getElementById('photodentroIframe');

    if (btnOpenPhotodentro && modalPhotodentro && iframePhotodentro) {
      const openModal = () => {
        if (iframePhotodentro.getAttribute('src') === 'about:blank') {
          iframePhotodentro.src = 'photodentro/index.html';
        }
        modalPhotodentro.style.display = 'block';
        document.body.style.overflow = 'hidden';
      };
      const closeModal = () => {
        modalPhotodentro.style.display = 'none';
        document.body.style.overflow = '';
      };

      btnOpenPhotodentro.addEventListener('click', openModal);
      if (btnClosePhotodentro) btnClosePhotodentro.addEventListener('click', closeModal);
      if (backdropPhotodentro) backdropPhotodentro.addEventListener('click', closeModal);
      window.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && modalPhotodentro.style.display === 'block') {
          closeModal();
        }
      });
    }
  }

  // ==========================================
  // MODULE 3: COLLOCATIONS & GEOGRAPHY CLUES
  // ==========================================
  function setupCollocationsAndCrossword() {
    const matcherGrid = document.getElementById('collocationMatcher');
    const feedbackEl = document.getElementById('collocationFeedback');
    const acrossList = document.getElementById('acrossCluesList');
    const downList = document.getElementById('downCluesList');
    const crosswordScoreEl = document.getElementById('crosswordScore');

    if (!v2Data) return;

    // Collocation Matcher
    if (matcherGrid && v2Data.collocations) {
      const verbs = v2Data.collocations.map((c, i) => ({ id: i, text: c.verb, type: 'verb' }));
      const partners = v2Data.collocations.map((c, i) => ({ id: i, text: c.partner, type: 'partner' })).sort(() => Math.random() - 0.5);

      matcherGrid.innerHTML = '';
      
      verbs.forEach(v => {
        const item = document.createElement('button');
        item.className = 'matcher-item verb-item';
        item.dataset.id = v.id;
        item.dataset.type = 'verb';
        item.textContent = v.text;
        item.addEventListener('click', () => handleMatcherClick(item, feedbackEl));
        matcherGrid.appendChild(item);
      });

      partners.forEach(p => {
        const item = document.createElement('button');
        item.className = 'matcher-item partner-item';
        item.dataset.id = p.id;
        item.dataset.type = 'partner';
        item.textContent = p.text;
        item.addEventListener('click', () => handleMatcherClick(item, feedbackEl));
        matcherGrid.appendChild(item);
      });
    }

    // Geography & Thematic Clues: Guess the Word from its Definition
    const challenge = v2Data.definition_challenge || v2Data.crossword;
    if (challenge) {
      const groupA = challenge.group_a || challenge.across || [];
      const groupB = challenge.group_b || challenge.down || [];
      let solvedCount = 0;
      const totalClues = groupA.length + groupB.length;

      const renderClue = clue => {
        const cleanWord = clue.word.toLowerCase();
        const vMatch = vocabList.find(v => {
          const vw = v.word.toLowerCase();
          return vw === cleanWord || vw === cleanWord.replace(/s$/, '');
        });
        const audioBtn = vMatch ? `
          <button class="audio-chip-btn clue-audio-btn" data-padid="${String(vMatch.id).padStart(2, '0')}" data-word="${vMatch.word}" title="Audio Hint / Pronunciation" style="margin-left: 6px; padding: 2px 8px; font-size: 0.78rem;">
            🔊 Hint
          </button>
        ` : '';

        return `
        <li class="clue-item" id="clueItem_${clue.number}">
          <span><strong>${clue.number}.</strong> ${clue.clue}</span>
          <div style="display: inline-flex; align-items: center; gap: 6px; margin-top: 4px;">
            <button class="clue-solve-btn" data-word="${clue.word}">💡 Reveal Word</button>
            ${audioBtn}
          </div>
        </li>
      `;};

      if (acrossList && groupA.length > 0) {
        acrossList.innerHTML = groupA.map(renderClue).join('');
      }

      if (downList && groupB.length > 0) {
        downList.innerHTML = groupB.map(renderClue).join('');
      }

      document.querySelectorAll('.clue-solve-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
          const w = e.currentTarget.dataset.word;
          if (!e.currentTarget.classList.contains('revealed')) {
            e.currentTarget.classList.add('revealed');
            e.currentTarget.textContent = `✨ ${w}`;
            e.currentTarget.style.background = '#e6fffa';
            e.currentTarget.style.color = '#234e52';
            e.currentTarget.style.borderColor = '#319795';
            e.currentTarget.style.fontWeight = '800';
            solvedCount++;
            if (crosswordScoreEl) {
              crosswordScoreEl.textContent = `Solved: ${solvedCount} / ${totalClues}`;
            }
          }
        });
      });

      document.querySelectorAll('.clue-audio-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
          const padId = e.currentTarget.dataset.padid;
          const word = e.currentTarget.dataset.word;
          const src = getVocabAudioPath('word', padId);
          playAudioFile(src, 'Vocabulary Clue Audio Hint', word, e.currentTarget);
        });
      });
    }
  }

  // ==========================================
  // TEACHER'S PEDAGOGICAL NOTES (§H)
  // ==========================================
  function setupTeacherNotes() {
    const toggleBtn = document.getElementById('btnToggleTeacherNotes');
    const contentBox = document.getElementById('teacherNotesContent');
    const chevron = document.getElementById('teacherNotesChevron');
    const topBtn = document.getElementById('topTeacherNotesBtn');

    function openTeacherNotes() {
      if (contentBox) contentBox.style.display = 'block';
      if (chevron) chevron.textContent = '▲';
    }

    if (toggleBtn && contentBox) {
      toggleBtn.addEventListener('click', () => {
        const isHidden = contentBox.style.display === 'none' || !contentBox.style.display;
        contentBox.style.display = isHidden ? 'block' : 'none';
        if (chevron) chevron.textContent = isHidden ? '▲' : '▼';
      });
    }

    if (topBtn) {
      topBtn.addEventListener('click', () => {
        switchToTab('stories');
        openTeacherNotes();
        const target = document.querySelector('.teacher-notes-card');
        if (target) {
          target.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
      });
    }
  }

  function handleMatcherClick(item, feedbackEl) {
    if (item.classList.contains('matched')) return;

    if (item.dataset.type === 'verb') {
      document.querySelectorAll('.verb-item').forEach(v => v.classList.remove('selected'));
      item.classList.add('selected');
      selectedVerb = item;
    } else if (item.dataset.type === 'partner' && selectedVerb) {
      const verbId = selectedVerb.dataset.id;
      const partnerId = item.dataset.id;

      if (verbId === partnerId) {
        selectedVerb.classList.remove('selected');
        selectedVerb.classList.add('matched');
        item.classList.add('matched');
        matchedPairs++;
        
        const col = v2Data.collocations[verbId];
        feedbackEl.style.display = 'block';
        feedbackEl.style.background = '#f0fff4';
        feedbackEl.style.color = '#22543d';
        feedbackEl.innerHTML = `🌟 Matched: <strong>${col.verb} ${col.partner}</strong> — <em>"${col.example}"</em>`;
        selectedVerb = null;
      } else {
        feedbackEl.style.display = 'block';
        feedbackEl.style.background = '#fff5f5';
        feedbackEl.style.color = '#742a2a';
        feedbackEl.innerHTML = `❌ Try again! That partner doesn't naturally pair with "${selectedVerb.textContent}".`;
        setTimeout(() => {
          selectedVerb.classList.remove('selected');
          selectedVerb = null;
        }, 1200);
      }
    }
  }

  // ==========================================
  // MODULE 4: 5-PARAGRAPH REPORT BUILDER
  // ==========================================
  function setupReportBuilder() {
    const stepsContainer = document.getElementById('reportStepsContainer');
    const previewBody = document.getElementById('previewParagraphsBody');
    const previewTitle = document.getElementById('previewTitle');
    const previewAuthor = document.getElementById('previewAuthor');
    const countryInput = document.getElementById('reportCountryInput');
    const studentInput = document.getElementById('reportStudentInput');
    const btnPreview = document.getElementById('btnPreviewReport');
    const btnPrint = document.getElementById('btnPrintReport');

    if (!v2Data || !v2Data.report_builder_guide || !stepsContainer) return;

    stepsContainer.innerHTML = v2Data.report_builder_guide.paragraphs.map(p => `
      <div class="step-card" data-step="${p.number}">
        <div class="step-header">
          <div class="step-num-badge">${p.number}</div>
          <div class="step-title">Paragraph ${p.number}: ${p.heading}</div>
        </div>
        <p class="step-guide"><strong>Guide:</strong> ${p.guiding_questions}</p>
        <div class="step-connectors">
          <span>Helpful connectors:</span>
          ${p.connectors.map(c => `<button class="connector-chip" data-text="${c}">${c}</button>`).join('')}
        </div>
        <textarea class="step-textarea" rows="3" placeholder="Write Paragraph ${p.number} here... (e.g. ${p.sample_starter})">${p.sample_starter}</textarea>
      </div>
    `).join('');

    function updatePreview() {
      const country = countryInput.value.trim() || 'Greece';
      const student = studentInput.value.trim() || 'A Student';

      previewTitle.textContent = `European Project: Report on ${country}`;
      previewAuthor.textContent = `By: ${student}`;

      const textareas = stepsContainer.querySelectorAll('.step-textarea');
      previewBody.innerHTML = Array.from(textareas).map((ta, i) => `
        <p class="preview-para"><strong>Paragraph ${i + 1}:</strong> ${ta.value}</p>
      `).join('');
    }

    stepsContainer.querySelectorAll('.step-textarea').forEach(ta => {
      ta.addEventListener('input', updatePreview);
    });

    countryInput.addEventListener('input', updatePreview);
    studentInput.addEventListener('input', updatePreview);
    btnPreview.addEventListener('click', updatePreview);

    stepsContainer.querySelectorAll('.connector-chip').forEach(chip => {
      chip.addEventListener('click', (e) => {
        const text = e.currentTarget.dataset.text;
        const ta = e.currentTarget.closest('.step-card').querySelector('.step-textarea');
        ta.value = `${ta.value} ${text}`.trim();
        updatePreview();
        ta.focus();
      });
    });

    btnPrint.addEventListener('click', () => {
      updatePreview();
      window.print();
    });

    updatePreview();
  }

  // ==========================================
  // MODULE 5: 4-MODE CHALLENGE ARENA
  // ==========================================
  function setupChallengeArena() {
    const modeBtns = document.querySelectorAll('.ch-mode-btn');
    const playBtn = document.getElementById('chPlayBtn');
    const restartBtn = document.getElementById('chRestartBtn');
    const nextBtn = document.getElementById('chNextBtn');

    modeBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        modeBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        challengeMode = btn.dataset.cmode;
        startChallenge();
      });
    });

    playBtn.addEventListener('click', playChallengePrompt);
    restartBtn.addEventListener('click', startChallenge);
    nextBtn.addEventListener('click', loadNextChallengeQuestion);
  }

  function startChallenge() {
    chScore = 0;
    chStreak = 0;
    chTotal = 0;
    updateChallengeHUD();
    loadNextChallengeQuestion();
  }

  function updateChallengeHUD() {
    document.getElementById('chScore').textContent = chScore;
    document.getElementById('chTotal').textContent = chTotal;
    document.getElementById('chStreak').textContent = chStreak > 0 ? `🔥 ${chStreak}` : `0`;
  }

  function loadNextChallengeQuestion() {
    const feedbackBox = document.getElementById('chFeedback');
    const optionsGrid = document.getElementById('chOptionsGrid');
    const instructionEl = document.getElementById('chInstruction');
    const clueEl = document.getElementById('chSubClue');

    feedbackBox.style.display = 'none';
    optionsGrid.innerHTML = '';

    if (challengeMode === 'fact') {
      // Geography True/False Mode
      instructionEl.textContent = 'Geography Fact-Buster: Is this statement TRUE or FALSE?';
      clueEl.textContent = 'Read carefully and decide based on the unit texts';

      const facts = v2Data.geography_true_false;
      const targetFact = facts[Math.floor(Math.random() * facts.length)];
      chQuestion = { mode: 'fact', target: targetFact, answered: false };

      optionsGrid.innerHTML = `
        <button class="ch-option-btn fact-btn" data-val="true">
          <span class="ch-option-letter">A</span>
          <div><strong>TRUE (Correct)</strong></div>
        </button>
        <button class="ch-option-btn fact-btn" data-val="false">
          <span class="ch-option-letter">B</span>
          <div><strong>FALSE (Incorrect)</strong></div>
        </button>
      `;

      instructionEl.innerHTML = `Statement: <br><strong style="font-size: 1.15rem; color: #1a202c;">"${targetFact.fact}"</strong>`;

      optionsGrid.querySelectorAll('.fact-btn').forEach(btn => {
        btn.addEventListener('click', () => handleFactAnswer(btn.dataset.val === 'true', btn));
      });
      return;
    }

    // Vocabulary / Audio Modes
    const target = vocabList[Math.floor(Math.random() * vocabList.length)];
    const distractors = [];
    while (distractors.length < 3) {
      const rand = vocabList[Math.floor(Math.random() * vocabList.length)];
      if (rand.id !== target.id && !distractors.some(d => d.id === rand.id)) {
        distractors.push(rand);
      }
    }
    const options = [target, ...distractors].sort(() => Math.random() - 0.5);
    chQuestion = { mode: challengeMode, target, options, answered: false };

    const letters = ['A', 'B', 'C', 'D'];

    if (challengeMode === 'greek') {
      instructionEl.textContent = 'Listen to the spoken English word and choose the matching Greek translation:';
      clueEl.textContent = 'Mode: Spoken English Word';

      options.forEach((opt, idx) => {
        const btn = document.createElement('button');
        btn.className = 'ch-option-btn';
        btn.dataset.id = opt.id;
        btn.innerHTML = `
          <span class="ch-option-letter">${letters[idx]}</span>
          <div><strong>${opt.meaning_gr}</strong></div>
        `;
        btn.addEventListener('click', () => handleChallengeAnswer(opt, btn));
        optionsGrid.appendChild(btn);
      });
    } else if (challengeMode === 'def') {
      instructionEl.textContent = 'Listen to the spoken English word and choose the matching English definition:';
      clueEl.textContent = 'Mode: Spoken English Word';

      options.forEach((opt, idx) => {
        const btn = document.createElement('button');
        btn.className = 'ch-option-btn';
        btn.dataset.id = opt.id;
        btn.innerHTML = `
          <span class="ch-option-letter">${letters[idx]}</span>
          <div style="font-size: 0.92rem; line-height: 1.4;">${opt.definition_en}</div>
        `;
        btn.addEventListener('click', () => handleChallengeAnswer(opt, btn));
        optionsGrid.appendChild(btn);
      });
    } else if (challengeMode === 'gapfill') {
      instructionEl.textContent = 'Listen to the contextual sentence and select the missing vocabulary word:';
      clueEl.textContent = 'Mode: Audio Sentence Gap-Fill';

      options.forEach((opt, idx) => {
        const btn = document.createElement('button');
        btn.className = 'ch-option-btn';
        btn.dataset.id = opt.id;
        btn.innerHTML = `
          <span class="ch-option-letter">${letters[idx]}</span>
          <div><strong>${opt.word}</strong> <span style="font-size: 0.8rem; color: #718096;">(${opt.pos})</span></div>
        `;
        btn.addEventListener('click', () => handleChallengeAnswer(opt, btn));
        optionsGrid.appendChild(btn);
      });
    }
  }

  function playChallengePrompt() {
    if (!chQuestion) return;
    const padId = String(chQuestion.target.id).padStart(2, '0');
    const playBtn = document.getElementById('chPlayBtn');

    if (chQuestion.mode === 'gapfill') {
      const src = getVocabAudioPath('example', padId);
      playAudioFile(src, 'Contextual Sentence', `Example for: "${chQuestion.target.word}"`, playBtn);
    } else {
      const src = getVocabAudioPath('word', padId);
      playAudioFile(src, 'Spoken Word', `Word: "${chQuestion.target.word}"`, playBtn);
    }
  }

  function handleChallengeAnswer(selectedOption, clickedBtn) {
    if (chQuestion.answered) return;
    chQuestion.answered = true;
    chTotal++;

    const isCorrect = selectedOption.id === chQuestion.target.id;
    const allBtns = document.querySelectorAll('.ch-option-btn');
    const feedbackBox = document.getElementById('chFeedback');
    const feedbackIcon = document.getElementById('chFeedbackIcon');
    const feedbackText = document.getElementById('chFeedbackText');

    allBtns.forEach(b => {
      b.disabled = true;
      if (b.dataset.id === String(chQuestion.target.id)) {
        b.classList.add('correct');
      }
    });

    if (isCorrect) {
      clickedBtn.classList.add('correct');
      chScore++;
      chStreak++;
      feedbackIcon.textContent = '🌟';
      feedbackText.innerHTML = `<strong>Correct!</strong> <em>"${chQuestion.target.word}"</em> (${chQuestion.target.meaning_gr}) is right!`;
    } else {
      clickedBtn.classList.add('wrong');
      chStreak = 0;
      feedbackIcon.textContent = '❌';
      feedbackText.innerHTML = `<strong>Not quite!</strong> The correct word was <em>"${chQuestion.target.word}"</em> (${chQuestion.target.meaning_gr}).`;
    }

    updateChallengeHUD();
    feedbackBox.style.display = 'flex';
  }

  function handleFactAnswer(selectedAnswer, clickedBtn) {
    if (chQuestion.answered) return;
    chQuestion.answered = true;
    chTotal++;

    const isCorrect = selectedAnswer === chQuestion.target.answer;
    const allBtns = document.querySelectorAll('.fact-btn');
    const feedbackBox = document.getElementById('chFeedback');
    const feedbackIcon = document.getElementById('chFeedbackIcon');
    const feedbackText = document.getElementById('chFeedbackText');

    allBtns.forEach(b => {
      b.disabled = true;
      if ((b.dataset.val === 'true') === chQuestion.target.answer) {
        b.classList.add('correct');
      }
    });

    if (isCorrect) {
      clickedBtn.classList.add('correct');
      chScore++;
      chStreak++;
      feedbackIcon.textContent = '🌟';
      feedbackText.innerHTML = `<strong>Correct!</strong> ${chQuestion.target.explanation}`;
    } else {
      clickedBtn.classList.add('wrong');
      chStreak = 0;
      feedbackIcon.textContent = '❌';
      feedbackText.innerHTML = `<strong>Not quite!</strong> ${chQuestion.target.explanation}`;
    }

    updateChallengeHUD();
    feedbackBox.style.display = 'flex';
  }

  // ==========================================
  // MODULE 6: PRINTABLE WORKSHEETS PACK
  // ==========================================
  function setupWorksheetsPack() {
    const tabs = document.querySelectorAll('.sheet-tab');
    tabs.forEach(tab => {
      tab.addEventListener('click', () => {
        tabs.forEach(t => t.classList.remove('active'));
        tab.classList.add('active');
        selectWorksheetTab(tab.dataset.sheetIdx);
      });
    });

    selectWorksheetTab('1');

    document.getElementById('btnPrintAllSheets').addEventListener('click', () => {
      showAllWorksheetsForPrint();
      window.print();
    });
  }

  function selectWorksheetTab(idx) {
    const container = document.getElementById('worksheetsDisplayContainer');
    if (!container) return;

    const renderers = {
      '1': renderSheet1,
      '2': renderSheet2,
      '3': renderSheet3,
      '4': renderSheet4,
      '5': renderSheet5
    };

    if (renderers[idx]) {
      container.innerHTML = renderers[idx]();
    }
  }

  function showAllWorksheetsForPrint() {
    const container = document.getElementById('worksheetsDisplayContainer');
    if (!container) return;
    container.innerHTML = `
      ${renderSheet1()}
      ${renderSheet2()}
      ${renderSheet3()}
      ${renderSheet4()}
      ${renderSheet5()}
    `;
  }

  function getStudentMetaHeaderHtml(sheetTitle, lessonName) {
    return `
      <div class="sheet-meta-header">
        <div class="sheet-kicker">English 6th Grade (ΣΤ΄ Δημοτικού) • Unit 1: Our Multicultural Class • ${lessonName}</div>
        <h1 class="sheet-main-title">${sheetTitle}</h1>
        <div class="sheet-student-info-bar">
          <span><strong>Student Name:</strong> ___________________________________</span>
          <span><strong>Class:</strong> ________</span>
          <span><strong>Date:</strong> __________________</span>
          <span><strong>Score:</strong> _____ / 20</span>
        </div>
      </div>
    `;
  }

  function renderSheet1() {
    return `
      <div class="printable-paper-sheet">
        ${getStudentMetaHeaderHtml('Worksheet 1: Country Dossiers & Reading Comprehension', 'Lesson 1')}
        
        <div class="sheet-task-section">
          <h3 class="sheet-task-title">Task A: Country, Capital & Nationality Matching</h3>
          <p class="sheet-prompt-text">Read Sasha's, Christina's, and Georgi's reports in your coursebook and fill in the missing information:</p>
          <table class="sheet-table">
            <thead>
              <tr><th>Country</th><th>Capital City</th><th>Nationality</th><th>Key Landform / River</th></tr>
            </thead>
            <tbody>
              <tr><td>Ukraine</td><td>______________________</td><td>______________________</td><td>Carpathians / River Dnipro</td></tr>
              <tr><td>Albania</td><td>______________________</td><td>______________________</td><td>Adriatic & Ionian Sea</td></tr>
              <tr><td>Georgia</td><td>______________________</td><td>______________________</td><td>Caucasus / Black Sea</td></tr>
              <tr><td>United Kingdom</td><td>London</td><td>British / Welsh</td><td>______________________</td></tr>
            </tbody>
          </table>
        </div>

        <div class="sheet-task-section">
          <h3 class="sheet-task-title">Task B: European Geography True or False</h3>
          <p class="sheet-prompt-text">Tick (✓) TRUE or FALSE according to the newcomer texts:</p>
          <table class="sheet-table">
            <thead>
              <tr><th>Statement</th><th style="width: 80px;">TRUE</th><th style="width: 80px;">FALSE</th></tr>
            </thead>
            <tbody>
              <tr><td>1. Ukraine is the second largest country in Europe.</td><td></td><td></td></tr>
              <tr><td>2. Ukraine borders the Aegean Sea in the south.</td><td></td><td></td></tr>
              <tr><td>3. Mother Teresa is of Albanian origin.</td><td></td><td></td></tr>
              <tr><td>4. In coastal Georgia, farmers grow citrus fruit and tea.</td><td></td><td></td></tr>
              <tr><td>5. The Channel Tunnel connects Britain to Germany underwater.</td><td></td><td></td></tr>
            </tbody>
          </table>
        </div>

        <div class="sheet-task-section">
          <h3 class="sheet-task-title">Task C: Intercultural Reflection</h3>
          <p class="sheet-prompt-text">Write 2-3 sentences about why having classmates from different countries is exciting for our class:</p>
          <div style="border: 1px dashed #cbd5e0; padding: 14px; min-height: 80px; background: #fff;">
            ________________________________________________________________________________________________________________________<br><br>
            ________________________________________________________________________________________________________________________
          </div>
        </div>

        <div class="sheet-footer-bar">
          <span>Photodentro Coursebook Companion • Unit 1</span>
          <span>Page 1 of 1 • Reading & Cultural Literacy</span>
        </div>
      </div>
    `;
  }

  function renderSheet2() {
    return `
      <div class="printable-paper-sheet">
        ${getStudentMetaHeaderHtml('Worksheet 2: Grammar in Action (Routines vs. Right Now)', 'Lesson 2')}
        
        <div class="sheet-task-section">
          <h3 class="sheet-task-title">Task A: Present Simple vs. Present Continuous</h3>
          <p class="sheet-prompt-text">Put the verbs in brackets into the correct tense (Present Simple for habits or Present Continuous for right now):</p>
          <ol style="margin-left: 20px; line-height: 2;">
            <li>Look! Sophia ___________________________ (print) a picture of molecular structures for the science project.</li>
            <li>Mr. Badluck usually ___________________________ (wake up) at 7:00 AM every morning.</li>
            <li>In winter, it often ___________________________ (rain) heavily in the mountains of Albania.</li>
            <li>Today Markos ___________________________ (copy) a photo of the Taj Mahal and ___________________________ (paste) it in his document.</li>
            <li>Farmers in western Georgia ___________________________ (grow) sweet citrus fruit and tea.</li>
            <li>Listen! The teacher ___________________________ (talk) to the students about their school lab projects.</li>
          </ol>
        </div>

        <div class="sheet-task-section">
          <h3 class="sheet-task-title">Task B: Adverbs of Frequency Ordering</h3>
          <p class="sheet-prompt-text">Rewrite the sentences putting the adverb in the correct position:</p>
          <ol style="margin-left: 20px; line-height: 2;">
            <li>The temperature drops below zero in Batumi. (<em>rarely</em>)<br>➔ _______________________________________________________________________________________</li>
            <li>My brother arrives early for our English lesson. (<em>always</em>)<br>➔ _______________________________________________________________________________________</li>
            <li>People leave their hometowns to find work. (<em>sometimes</em>)<br>➔ _______________________________________________________________________________________</li>
          </ol>
        </div>

        <div class="sheet-task-section">
          <h3 class="sheet-task-title">Task C: Creative Writing: My Day vs. Today</h3>
          <p class="sheet-prompt-text">Write two contrasting sentences about yourself:</p>
          <p>Every day I usually _______________________________________________________________________________________</p>
          <p>...but today I am _______________________________________________________________________________________</p>
        </div>

        <div class="sheet-footer-bar">
          <span>Photodentro Coursebook Companion • Unit 1</span>
          <span>Page 1 of 1 • Grammatical Competence</span>
        </div>
      </div>
    `;
  }

  function renderSheet3() {
    return `
      <div class="printable-paper-sheet">
        ${getStudentMetaHeaderHtml('Worksheet 3: Geography Clues & Collocations', 'Lesson 3')}
        
        <div class="sheet-task-section">
          <h3 class="sheet-task-title">Task A: Collocation Matcher</h3>
          <p class="sheet-prompt-text">Match the verbs from Column A with the natural noun phrases from Column B:</p>
          <table class="sheet-table">
            <thead><tr><th>Column A (Verbs)</th><th>Column B (Partners)</th><th>Answers</th></tr></thead>
            <tbody>
              <tr><td>1. share</td><td>a. in two parts</td><td>1 ➔ _____</td></tr>
              <tr><td>2. temperature drops</td><td>b. citrus fruit & tea</td><td>2 ➔ _____</td></tr>
              <tr><td>3. grow</td><td>c. below zero</td><td>3 ➔ _____</td></tr>
              <tr><td>4. river splits</td><td>d. borders with Greece</td><td>4 ➔ _____</td></tr>
              <tr><td>5. work in</td><td>e. a coal / copper mine</td><td>5 ➔ _____</td></tr>
            </tbody>
          </table>
        </div>

        <div class="sheet-task-section">
          <h3 class="sheet-task-title">Task B: The European Geography Clues & Definitions (Crossword Terms)</h3>
          <p class="sheet-prompt-text">Write the correct geography terms matching each clue below:</p>
          <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 20px; font-size: 0.9rem;">
            <div>
              <strong>ACROSS CLUES:</strong>
              <p>2. The Carpathians are high __________________ in Eastern Europe.</p>
              <p>3. Greece shares northern __________________ with Albania.</p>
              <p>5. It often rains heavily, so there are green __________________.</p>
              <p>8. Albania is in the Balkan __________________.</p>
              <p>11. Odesa is an important port on the Black Sea __________________.</p>
              <p>12. The opposite compass direction of West: __________________.</p>
            </div>
            <div>
              <strong>DOWN CLUES:</strong>
              <p>1. On a map we spot natural __________________ like rivers and lakes.</p>
              <p>4. The opposite compass direction of East: __________________.</p>
              <p>6. Athens is the __________________ city of Greece.</p>
              <p>7. Vast flat agricultural areas: __________________.</p>
              <p>9. The compass direction opposite of South: __________________.</p>
              <p>10. The compass direction opposite of North: __________________.</p>
            </div>
          </div>
        </div>

        <div class="sheet-footer-bar">
          <span>Photodentro Coursebook Companion • Unit 1</span>
          <span>Page 1 of 1 • Lexical Partnerships & Geography Clues</span>
        </div>
      </div>
    `;
  }

  function renderSheet4() {
    return `
      <div class="printable-paper-sheet">
        ${getStudentMetaHeaderHtml('Worksheet 4: 5-Paragraph Country Report (European Portfolio)', 'Project Workshop')}
        
        <div class="sheet-task-section">
          <h3 class="sheet-task-title">European Class Project: My Country Portfolio Report</h3>
          <p class="sheet-prompt-text">Use Gwen's model to write a complete 5-paragraph report about <strong>Greece</strong> (or another country) for visiting European students:</p>
          
          <div style="border: 1px solid #1a202c; padding: 18px; line-height: 1.8; font-size: 0.95rem;">
            <p><strong>Paragraph 1 (Name, Location & Borders):</strong><br>
            ________________________________________________________________________________________________________________________<br>
            ________________________________________________________________________________________________________________________</p>
            
            <p><strong>Paragraph 2 (Landscape, Mountains & Rivers):</strong><br>
            ________________________________________________________________________________________________________________________<br>
            ________________________________________________________________________________________________________________________</p>

            <p><strong>Paragraph 3 (Weather & Climate):</strong><br>
            ________________________________________________________________________________________________________________________<br>
            ________________________________________________________________________________________________________________________</p>

            <p><strong>Paragraph 4 (People, Culture & Modern Life):</strong><br>
            ________________________________________________________________________________________________________________________<br>
            ________________________________________________________________________________________________________________________</p>

            <p><strong>Paragraph 5 (Author's Opinion & Invitation):</strong><br>
            ________________________________________________________________________________________________________________________<br>
            ________________________________________________________________________________________________________________________</p>
          </div>
        </div>

        <div class="sheet-footer-bar">
          <span>Photodentro Coursebook Companion • Unit 1</span>
          <span>Page 1 of 1 • Genre Writing & Portfolio</span>
        </div>
      </div>
    `;
  }

  function renderSheet5() {
    return `
      <div class="printable-paper-sheet">
        ${getStudentMetaHeaderHtml('Worksheet 5: Unit 1 Comprehensive Mastery Test', 'Check Yourself')}
        
        <div class="sheet-task-section">
          <h3 class="sheet-task-title">Section 1: Vocabulary & Definitions (10 Points)</h3>
          <p class="sheet-prompt-text">Match the vocabulary word with its exact English definition:</p>
          <table class="sheet-table">
            <thead><tr><th>Word</th><th>Definition</th><th>Answer</th></tr></thead>
            <tbody>
              <tr><td>1. ancient</td><td>a. a line separating two countries or administrative regions</td><td>1 ➔ _____</td></tr>
              <tr><td>2. border</td><td>b. belonging to the distant past and no longer in existence</td><td>2 ➔ _____</td></tr>
              <tr><td>3. citrus fruit</td><td>c. oranges, lemons, limes, and grapefruits</td><td>3 ➔ _____</td></tr>
              <tr><td>4. river</td><td>d. a large natural stream of water flowing in a channel</td><td>4 ➔ _____</td></tr>
              <tr><td>5. water supplies</td><td>e. water provided for household, drinking, and community needs</td><td>5 ➔ _____</td></tr>
            </tbody>
          </table>
        </div>

        <div class="sheet-task-section">
          <h3 class="sheet-task-title">Section 2: Grammar Multiple Choice (10 Points)</h3>
          <p class="sheet-prompt-text">Circle the correct verb form (a or b):</p>
          <ol style="margin-left: 20px; line-height: 2;">
            <li>I'm in the school lab right now. I ________________ a simulation.<br><strong>a)</strong> code &nbsp;&nbsp;&nbsp;&nbsp; <strong>b)</strong> am coding</li>
            <li>Christina ________________ from Tirana, the capital of Albania.<br><strong>a)</strong> comes &nbsp;&nbsp;&nbsp;&nbsp; <strong>b)</strong> is coming</li>
            <li>We usually ________________ to the museum on Saturdays.<br><strong>a)</strong> go &nbsp;&nbsp;&nbsp;&nbsp; <strong>b)</strong> are going</li>
            <li>Look! The River Dnipro ________________ swiftly today.<br><strong>a)</strong> flows &nbsp;&nbsp;&nbsp;&nbsp; <strong>b)</strong> is flowing</li>
            <li>Water ________________ at 100 degrees Celsius.<br><strong>a)</strong> boils &nbsp;&nbsp;&nbsp;&nbsp; <strong>b)</strong> is boiling</li>
          </ol>
        </div>

        <div class="sheet-footer-bar">
          <span>Photodentro Coursebook Companion • Unit 1</span>
          <span>Page 1 of 1 • Formative Assessment</span>
        </div>
      </div>
    `;
  }

  // ==========================================
  // MODULE 7: CAN-DO PASSPORT & CERTIFICATE
  // ==========================================
  function setupCanDoPassport() {
    const checkboxes = document.querySelectorAll('#canDoList input[type="checkbox"]');
    const fillEl = document.getElementById('passportProgressFill');
    const pctEl = document.getElementById('passportProgressPct');
    const studentNameEl = document.getElementById('certStudentName');
    const btnPrintCert = document.getElementById('btnPrintCertificate');

    function updateProgress() {
      const total = checkboxes.length;
      const checked = Array.from(checkboxes).filter(cb => cb.checked).length;
      const pct = Math.round((checked / total) * 100);

      fillEl.style.width = `${pct}%`;
      pctEl.textContent = `${pct}% Complete`;

      // Update badges
      document.getElementById('badgeGeo').classList.toggle('earned', document.getElementById('check1').checked);
      document.getElementById('badgeGrammar').classList.toggle('earned', document.getElementById('check2').checked);
      document.getElementById('badgeColloc').classList.toggle('earned', document.getElementById('check3').checked);
      document.getElementById('badgeWriting').classList.toggle('earned', document.getElementById('check4').checked);
    }

    checkboxes.forEach(cb => {
      cb.addEventListener('change', updateProgress);
    });

    btnPrintCert.addEventListener('click', () => {
      const name = prompt('Enter Student Name for the Certificate:', 'Alexandros Papadopoulos');
      if (name) studentNameEl.textContent = name;
      window.print();
    });

    updateProgress();
  }

  // =========================================================================
  // AI HINT HOOK (Future Local Model Extension)
  // In accordance with PROMPT_unit1_workbook.md, this hook is intentionally empty
  // and returns null. A local offline model (e.g. WebLLM / ONNX) can be plugged in later.
  // 100% offline, zero network calls.
  // =========================================================================
  function getHint(activityId, pupilText) {
    // Reserved for future local offline AI hint generation
    return null;
  }

  // =========================================================================
  // MODULE 8: WORKBOOK INTERACTIVE COMPANION (Printed pp. 6–13)
  // =========================================================================
  function setupWorkbookModule() {
    const wbContainer = document.getElementById('workbookCardsContainer');
    if (!wbContainer) return;

    const wbData = window.UNIT1_WORKBOOK_DATA || (v2Data && v2Data.workbook) || null;
    if (!wbData || !wbData.activities) {
      console.warn('UNIT1_WORKBOOK_DATA not found.');
      return;
    }

    // Helper functions for normalization & validation
    function norm(str) {
      return (str || '').trim().toLowerCase().replace(/\s+/g, ' ');
    }

    function isAccepted(val, acceptedList) {
      const nVal = norm(val);
      if (!nVal) return false;
      return (acceptedList || []).some(acc => norm(acc) === nVal);
    }

    // Quick filter navigation buttons
    const filterBtns = document.querySelectorAll('.wb-filter-btn');
    filterBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        filterBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        const filter = btn.dataset.filter;
        document.querySelectorAll('.wb-card').forEach(card => {
          if (filter === 'all') {
            card.style.display = 'block';
          } else {
            card.style.display = card.dataset.lesson === filter ? 'block' : 'none';
          }
        });
      });
    });

    // Render cards HTML
    wbContainer.innerHTML = wbData.activities.map(act => renderCardHTML(act)).join('');

    // Attach interactive behavior for each activity
    wbData.activities.forEach(act => {
      attachCardInteractivity(act);
    });

    // Card HTML Renderer
    function renderCardHTML(act) {
      const lessonMap = {
        'opening_page': 'lesson1', 'a1': 'lesson1', 'a2': 'lesson1', 'a3': 'lesson1',
        'b1-I': 'lesson2', 'b1-II': 'lesson2', 'b2': 'lesson2', 'b3': 'lesson2', 'b4': 'lesson2', 'b5': 'lesson2',
        'c1': 'lesson3', 'c2': 'lesson3', 'c3': 'lesson3', 'd': 'lesson3', 'e': 'lesson3'
      };
      const lessonClass = lessonMap[act.id] || 'lesson1';
      const tierLabels = {
        'closed': 'Closed • Instant Check',
        'semi-open': 'Semi-Open • Rule Check',
        'open': 'Open • Scaffolding & Model'
      };

      return `
        <div class="wb-card" id="wbCard_${act.id}" data-id="${act.id}" data-tier="${act.type}" data-lesson="${lessonClass}">
          <div class="wb-card-header">
            <div class="wb-header-left">
              <div class="wb-badge-row">
                <span class="wb-num-badge">Activity ${act.number}</span>
                <span class="wb-page-badge">Workbook p. ${act.page}</span>
                <span class="wb-tier-badge ${act.type}">${tierLabels[act.type] || act.type}</span>
              </div>
              <h3 class="wb-card-title">${act.title}</h3>
            </div>
            <button class="wb-print-btn" data-print-act="${act.id}" title="Print clean A4 student worksheet">
              <span>🖨️</span> Print Worksheet
            </button>
          </div>

          ${act.book_check ? `
            <div class="book-check-box">
              <span class="book-check-badge">📖 Book check</span>
              <span class="book-check-text">${act.book_check}</span>
            </div>
          ` : ''}

          ${act.instruction ? `<div class="wb-instruction">${act.instruction}</div>` : ''}

          ${renderCardBody(act)}
        </div>
      `;
    }

    function renderCardBody(act) {
      switch (act.id) {
        case 'opening_page':
          return renderOpeningBody(act);
        case 'a1':
          return renderA1Body(act);
        case 'a2':
          return renderA2Body(act);
        case 'a3':
          return renderA3Body(act);
        case 'b1-I':
          return renderB1IBody(act);
        case 'b1-II':
          return renderB1IIBody(act);
        case 'b2':
          return renderB2Body(act);
        case 'b3':
          return renderB3Body(act);
        case 'b4':
          return renderB4Body(act);
        case 'b5':
          return renderB5Body(act);
        case 'c1':
          return renderC1Body(act);
        case 'c2':
          return renderC2Body(act);
        case 'c3':
          return renderC3Body(act);
        case 'd':
          return renderDBody(act);
        case 'e':
          return renderEBody(act);
        default:
          return '';
      }
    }

    // 1. OPENING
    function renderOpeningBody(act) {
      return `
        <div style="display: flex; flex-direction: column; gap: 16px;">
          <div style="background: #f8fafc; padding: 16px; border-radius: var(--radius-md); border: 1px solid #edf2f7;">
            <strong style="font-size: 0.92rem; color: var(--text-dark); display: block; margin-bottom: 8px;">${act.part1.prompt}</strong>
            <textarea id="wb_opening_p1_text" class="wb-pupil-textarea" style="min-height: 80px;" placeholder="Write names of friends or classmates from other countries..."></textarea>
          </div>

          <div style="background: #f8fafc; padding: 16px; border-radius: var(--radius-md); border: 1px solid #edf2f7;">
            <strong style="font-size: 0.92rem; color: var(--text-dark); display: block; margin-bottom: 8px;">${act.part2.prompt}</strong>
            <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(240px, 1fr)); gap: 12px; margin-top: 10px;">
              ${act.part2.languages.map((l, i) => `
                <div style="background: #ffffff; padding: 10px 14px; border: 1px solid #e2e8f0; border-radius: var(--radius-sm);">
                  <span style="font-weight: 800; font-size: 0.85rem; color: var(--primary);">${l.language}:</span>
                  <div style="display: flex; gap: 8px; margin-top: 6px;">
                    <input type="text" class="wb-gap-input" style="flex: 1;" placeholder="River..." data-lang-idx="${i}" data-field="river">
                    <input type="text" class="wb-gap-input" style="flex: 1;" placeholder="Mountain..." data-lang-idx="${i}" data-field="mountain">
                  </div>
                </div>
              `).join('')}
            </div>
          </div>

          <div class="wb-card-actions">
            <button class="wb-btn wb-btn-primary" id="btn_opening_reveal">Reveal Language Models &amp; List</button>
            <span class="wb-feedback-status" id="status_opening"></span>
          </div>

          <div class="wb-model-container" id="model_opening" style="display: none;">
            <div class="wb-model-header">Model Examples &amp; European Languages:</div>
            <p><strong>List examples:</strong> ${act.part1.model_answers.join(', ')}</p>
            <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(220px, 1fr)); gap: 8px; margin-top: 8px; font-size: 0.86rem;">
              ${act.part2.languages.map(l => `
                <div><strong>${l.language}:</strong> river = <em>${l.river}</em>, mountain = <em>${l.mountain}</em></div>
              `).join('')}
            </div>
          </div>
        </div>
      `;
    }

    // 2. A1: MATCHING
    function renderA1Body(act) {
      const nationalities = act.pairs.map(p => p.nationality).sort();
      return `
        <div class="wb-match-grid">
          ${act.pairs.map((pair, idx) => `
            <div class="wb-match-row" data-a1-row="${idx}">
              <span class="wb-match-country">${pair.country}</span>
              <select class="wb-match-select" data-pair-idx="${idx}">
                <option value="">-- Choose Nationality --</option>
                ${nationalities.map(n => `<option value="${n}">${n}</option>`).join('')}
              </select>
            </div>
          `).join('')}
        </div>

        <div class="wb-card-actions">
          <button class="wb-btn wb-btn-primary" id="btn_a1_check">Check Answers</button>
          <button class="wb-btn wb-btn-retry" id="btn_a1_retry" style="display: none;">Retry Mistakes</button>
          <button class="wb-btn wb-btn-reveal" id="btn_a1_reveal">Show Model Answers</button>
          <span class="wb-feedback-status" id="status_a1"></span>
        </div>
      `;
    }

    // 3. A2: LANDFORMS
    function renderA2Body(act) {
      return `
        <div class="wb-landforms-table-wrap">
          <table class="wb-landforms-table">
            <thead>
              <tr>
                <th style="width: 22%;">Landform &amp; Greek Term</th>
                <th style="width: 43%;">Definition</th>
                <th style="width: 35%;">Your Greek Geography Examples</th>
              </tr>
            </thead>
            <tbody>
              ${act.landforms.map((lf, idx) => `
                <tr data-lf-idx="${idx}">
                  <td>
                    <strong>${lf.landform}</strong><br>
                    <span style="font-size: 0.8rem; color: #718096;">(${lf.greek_term})</span>
                  </td>
                  <td style="font-size: 0.85rem; line-height: 1.45; color: #4a5568;">${lf.definition}</td>
                  <td>
                    <input type="text" class="wb-gap-input" style="width: 100%;" placeholder="e.g. ${lf.model_examples[0]}..." data-lf-input="${idx}">
                    <div class="wb-lf-model" id="lf_model_${idx}" style="display: none; font-size: 0.8rem; color: #2b6cb0; margin-top: 4px;">
                      <strong>Models:</strong> ${lf.model_examples.join(', ')}
                    </div>
                  </td>
                </tr>
              `).join('')}
            </tbody>
          </table>
        </div>

        <div class="wb-card-actions">
          <button class="wb-btn wb-btn-primary" id="btn_a2_check">Check Examples</button>
          <button class="wb-btn wb-btn-reveal" id="btn_a2_reveal">Reveal Model Examples</button>
          <span class="wb-feedback-status" id="status_a2"></span>
        </div>
      `;
    }

    // 4. A3: SCHOOL SUBJECTS
    function renderA3Body(act) {
      return `
        <div class="wb-word-bank">
          <span class="wb-word-bank-label">Word Bank:</span>
          ${act.word_bank.map(w => `<span class="wb-word-chip">${w}</span>`).join('')}
        </div>

        <div class="wb-subjects-grid">
          ${act.items.map((it, idx) => `
            <div class="wb-subject-card" data-a3-idx="${idx}">
              <img src="${it.image}" alt="School Subject Illustration" class="wb-subject-img">
              <div>
                <input type="text" class="wb-gap-input" placeholder="Type subject..." data-a3-input="${idx}" style="width: 90%; text-align: center;">
              </div>
            </div>
          `).join('')}
        </div>

        <div class="wb-card-actions">
          <button class="wb-btn wb-btn-primary" id="btn_a3_check">Check Answers</button>
          <button class="wb-btn wb-btn-retry" id="btn_a3_retry" style="display: none;">Retry Mistakes</button>
          <button class="wb-btn wb-btn-reveal" id="btn_a3_reveal">Show Model Answers</button>
          <span class="wb-feedback-status" id="status_a3"></span>
        </div>
      `;
    }

    // 5. B1-I: PRESENT CONTINUOUS
    function renderB1IBody(act) {
      return `
        <div class="wb-word-bank">
          <span class="wb-word-bank-label">Word Bank:</span>
          ${act.word_bank.map(w => `<span class="wb-word-chip">${w}</span>`).join('')}
        </div>

        <div class="wb-sentence-list">
          ${act.gaps.map((g, idx) => `
            <div class="wb-sentence-row" data-gap-row="${g.id}">
              <span class="wb-item-num">${g.label || (idx + 1)}.</span>
              <div class="wb-sentence-body">
                <div>
                  ${g.prefix}
                  <input type="text" class="wb-gap-input" data-b1i-gap="${g.id}" placeholder="...">
                  ${g.suffix}
                </div>
              </div>
            </div>
          `).join('')}
        </div>

        <div class="wb-card-actions">
          <button class="wb-btn wb-btn-primary" id="btn_b1i_check">Check Answers</button>
          <button class="wb-btn wb-btn-retry" id="btn_b1i_retry" style="display: none;">Retry Mistakes</button>
          <button class="wb-btn wb-btn-reveal" id="btn_b1i_reveal">Show Model Answers</button>
          <span class="wb-feedback-status" id="status_b1i"></span>
        </div>
      `;
    }

    // 6. B1-II: PRESENT SIMPLE
    function renderB1IIBody(act) {
      return `
        <div class="wb-word-bank">
          <span class="wb-word-bank-label">Word Bank:</span>
          ${act.word_bank.map(w => `<span class="wb-word-chip">${w}</span>`).join('')}
        </div>

        <div class="wb-sentence-list">
          ${act.gaps.map((g, idx) => `
            <div class="wb-sentence-row" data-gap-row="${g.id}">
              <span class="wb-item-num">${g.label || (idx + 1)}.</span>
              <div class="wb-sentence-body">
                <div>
                  ${g.prefix}
                  <input type="text" class="wb-gap-input" data-b1ii-gap="${g.id}" placeholder="...">
                  ${g.suffix}
                </div>
              </div>
            </div>
          `).join('')}
        </div>

        <div class="wb-card-actions">
          <button class="wb-btn wb-btn-primary" id="btn_b1ii_check">Check Answers</button>
          <button class="wb-btn wb-btn-retry" id="btn_b1ii_retry" style="display: none;">Retry Mistakes</button>
          <button class="wb-btn wb-btn-reveal" id="btn_b1ii_reveal">Show Model Answers</button>
          <span class="wb-feedback-status" id="status_b1ii"></span>
        </div>
      `;
    }

    // 7. B2: RESTAURANT DIALOGUE
    function renderB2Body(act) {
      return `
        <div class="wb-word-bank">
          <span class="wb-word-bank-label">Word Bank:</span>
          ${act.word_bank.map(w => `<span class="wb-word-chip">${w}</span>`).join('')}
        </div>

        <div class="wb-dialogue-box">
          ${act.gaps.map(g => `
            <div class="wb-dialogue-row">
              <span class="wb-speaker-badge">${g.speaker}</span>
              <div>
                ${g.prefix}
                <input type="text" class="wb-gap-input" data-b2-gap="${g.id}" placeholder="...">
                ${g.suffix}
              </div>
            </div>
          `).join('')}
        </div>

        <div class="wb-card-actions">
          <button class="wb-btn wb-btn-primary" id="btn_b2_check">Check Answers</button>
          <button class="wb-btn wb-btn-retry" id="btn_b2_retry" style="display: none;">Retry Mistakes</button>
          <button class="wb-btn wb-btn-reveal" id="btn_b2_reveal">Show Model Answers</button>
          <span class="wb-feedback-status" id="status_b2"></span>
        </div>
      `;
    }

    // 8. B3: CHOOSE VERB
    function renderB3Body(act) {
      return `
        <div class="wb-sentence-list">
          ${act.items.map((it, idx) => `
            <div class="wb-sentence-row" data-b3-row="${idx}">
              <span class="wb-speaker-badge">${it.speaker}</span>
              <div class="wb-sentence-body">
                <div>
                  ${it.context}
                  <select class="wb-gap-input" data-b3-select="${idx}">
                    <option value="">-- select verb --</option>
                    ${it.options.map(opt => `<option value="${opt}">${opt}</option>`).join('')}
                  </select>
                </div>
              </div>
            </div>
          `).join('')}
        </div>

        <div class="wb-card-actions">
          <button class="wb-btn wb-btn-primary" id="btn_b3_check">Check Answers</button>
          <button class="wb-btn wb-btn-retry" id="btn_b3_retry" style="display: none;">Retry Mistakes</button>
          <button class="wb-btn wb-btn-reveal" id="btn_b3_reveal">Show Model Answers</button>
          <span class="wb-feedback-status" id="status_b3"></span>
        </div>
      `;
    }

    // 9. B4: FREQUENCY ADVERBS
    function renderB4Body(act) {
      const exampleText = act.example ? `<p style="font-style: italic; color: #4a5568; margin-bottom: 12px;"><strong>Example from book:</strong> "${act.example}"</p>` : '';
      return `
        <div class="wb-word-bank">
          <span class="wb-word-bank-label">Adverbs:</span>
          ${act.adverbs.map(a => `<span class="wb-word-chip">${a}</span>`).join('')}
        </div>
        ${exampleText}

        <div class="wb-sentence-list">
          ${act.adverbs.map((adv, idx) => `
            <div class="wb-sentence-row" data-b4-row="${idx}">
              <span class="wb-item-num">${idx + 1}.</span>
              <div class="wb-sentence-body">
                <span style="font-weight: 700; font-size: 0.88rem; color: #2c5282;">Adverb: "${adv}"</span>
                <input type="text" class="wb-gap-input" style="width: 100%;" placeholder="Write a true summer habit using '${adv}'..." data-b4-input="${idx}">
                <div class="wb-b4-model" id="b4_model_${idx}" style="display: none; font-size: 0.82rem; color: #285e61; margin-top: 4px;">
                  <strong>Model:</strong> ${(act.model_answers && act.model_answers[idx]) || ''}
                </div>
              </div>
            </div>
          `).join('')}
        </div>

        <div class="wb-card-actions">
          <button class="wb-btn wb-btn-primary" id="btn_b4_check">Check Sentences (Rule Check)</button>
          <button class="wb-btn wb-btn-reveal" id="btn_b4_reveal">Reveal Model Sentences</button>
          <span class="wb-feedback-status" id="status_b4"></span>
        </div>
      `;
    }

    // 10. B5: REPORTER QUESTIONS
    function renderB5Body(act) {
      return `
        <div class="wb-sentence-list">
          ${act.starters.map((st, idx) => `
            <div class="wb-sentence-row" data-b5-row="${idx}">
              <span class="wb-item-num">${idx + 1}.</span>
              <div class="wb-sentence-body">
                <span style="font-weight: 700; font-size: 0.88rem; color: #2c5282;">Starter: "${st}..."</span>
                <input type="text" class="wb-gap-input" style="width: 100%;" placeholder="Write question starting with '${st}' and ending with '?'..." data-b5-input="${idx}">
                <div class="wb-b5-model" id="b5_model_${idx}" style="display: none; font-size: 0.82rem; color: #285e61; margin-top: 4px;">
                  <strong>Model Question:</strong> ${(act.model_answers && act.model_answers[idx]) || ''}
                </div>
              </div>
            </div>
          `).join('')}
        </div>

        <div class="wb-card-actions">
          <button class="wb-btn wb-btn-primary" id="btn_b5_check">Check Questions (Rule Check)</button>
          <button class="wb-btn wb-btn-reveal" id="btn_b5_reveal">Reveal Model Questions</button>
          <span class="wb-feedback-status" id="status_b5"></span>
        </div>
      `;
    }

    // 11. C1: QUESTIONS ON JACK'S LETTER
    function renderC1Body(act) {
      const letterContent = act.letter_text ? act.letter_text.replace(/\n/g, '<br>') : "Dear Friend, ...";
      return `
        <div style="background: #ebf8ff; border: 1px solid #bee3f8; border-radius: var(--radius-md); padding: 18px 22px; margin-bottom: 20px;">
          <h4 style="margin: 0 0 8px; font-size: 0.96rem; color: #2b6cb0;">📖 Letter from Bucksport:</h4>
          <p style="margin: 0; font-size: 0.9rem; line-height: 1.6; color: #2d3748;">
            ${letterContent}
          </p>
        </div>

        <div class="wb-sentence-list">
          ${act.questions.map((q, idx) => `
            <div class="wb-sentence-row" data-c1-row="${idx}">
              <span class="wb-item-num">${idx + 1}.</span>
              <div class="wb-sentence-body">
                <span style="font-weight: 700; font-size: 0.9rem; color: var(--text-dark);">${q.question}</span>
                <input type="text" class="wb-gap-input" style="width: 100%;" placeholder="Write answer..." data-c1-input="${idx}">
                <div class="wb-c1-model" id="c1_model_${idx}" style="display: none; font-size: 0.82rem; color: #285e61; margin-top: 4px;">
                  <strong>Model Answer (Teacher's Book):</strong> ${q.model_answer}
                </div>
              </div>
            </div>
          `).join('')}
        </div>

        <div class="wb-card-actions">
          <button class="wb-btn wb-btn-primary" id="btn_c1_check">Check Answers (Key Facts)</button>
          <button class="wb-btn wb-btn-reveal" id="btn_c1_reveal">Reveal Model Answers</button>
          <span class="wb-feedback-status" id="status_c1"></span>
        </div>
      `;
    }

    // 12. C2: HOLIDAY LETTER
    function renderC2Body(act) {
      return renderOpenActivityBody(act);
    }

    // 13. C3: REPLY TO JACK
    function renderC3Body(act) {
      const emailContent = act.incoming_email ? `
        <div style="background: #f7fafc; border: 1px solid #e2e8f0; border-radius: var(--radius-md); padding: 16px 20px; margin-bottom: 16px;">
          <h4 style="margin: 0 0 8px; font-size: 0.92rem; color: #4a5568;">📧 Incoming Email from Jack (Bordeaux, France):</h4>
          <p style="margin: 0; font-size: 0.88rem; line-height: 1.6; color: #2d3748; white-space: pre-line;">${act.incoming_email}</p>
        </div>
      ` : '';
      return emailContent + renderOpenActivityBody(act);
    }

    // 14. D: DESCRIBE PHOTO
    function renderDBody(act) {
      const starterText = act.starter_text || act.starter || '';
      return `
        <div class="wb-photo-box" style="text-align: center; margin-bottom: 14px;">
          <img src="${act.image}" alt="Mediterranean Holiday Beach Snapshot" class="wb-photo-img" style="max-height: 220px; border-radius: var(--radius-md); box-shadow: var(--shadow-sm);">
        </div>
        ${starterText ? `<p style="font-style: italic; color: #4a5568; margin-bottom: 12px;"><strong>Book starter:</strong> "${starterText}"</p>` : ''}
        ${renderOpenActivityBody(act)}
      `;
    }

    // 15. E: SCHOOL TIMETABLE NOTE
    function renderEBody(act) {
      const days = ["ΔΕΥΤΕΡΑ", "ΤΡΙΤΗ", "ΤΕΤΑΡΤΗ", "ΠΕΜΠΤΗ", "ΠΑΡΑΣΚΕΥΗ"];
      return `
        <div style="margin-bottom: 16px;">
          <h4 style="font-size: 0.92rem; margin-bottom: 8px; color: var(--text-dark);">📅 Greek 6th Grade Primary Timetable:</h4>
          <div style="overflow-x: auto;">
            <table class="wb-timetable-table">
              <thead>
                <tr>
                  <th>Period</th>
                  <th>Monday (Δευτέρα)</th>
                  <th>Tuesday (Τρίτη)</th>
                  <th>Wednesday (Τετάρτη)</th>
                  <th>Thursday (Πέμπτη)</th>
                  <th>Friday (Παρασκευή)</th>
                </tr>
              </thead>
              <tbody>
                ${[0, 1, 2, 3, 4, 5].map(pIdx => `
                  <tr>
                    <td class="wb-period-num">${pIdx + 1}</td>
                    ${days.map(d => {
                      const grSub = (act.greek_timetable && act.greek_timetable[d]) ? act.greek_timetable[d][pIdx] : '';
                      const enSub = (act.subject_translations && act.subject_translations[grSub]) ? act.subject_translations[grSub] : grSub;
                      return `<td><strong>${enSub}</strong><br><span style="font-size: 0.76rem; color: #718096;">(${grSub})</span></td>`;
                    }).join('')}
                  </tr>
                `).join('')}
              </tbody>
            </table>
          </div>
        </div>
        ${renderOpenActivityBody(act)}
      `;
    }

    function renderOpenActivityBody(act) {
      const checklist = act.checklist || act.scaffolding_checklist || [];
      return `
        <div class="wb-scaffolding-box">
          <div class="wb-scaffolding-title">
            <span>📋 Writing Scaffolding Checklist</span>
            <span class="wb-disclaimer">(Reminder checklist, not a test score)</span>
          </div>

          <div class="wb-checklist" id="checklist_${act.id}">
            ${checklist.map((item, idx) => `
              <div class="wb-check-item" data-check-idx="${idx}" id="chk_${act.id}_${idx}">
                <span class="wb-check-icon">◻️</span>
                <span>${item.label || item.point}</span>
              </div>
            `).join('')}
          </div>

          ${act.sentence_starters ? `
            <div style="margin-bottom: 10px;">
              <span style="font-size: 0.78rem; font-weight: 800; text-transform: uppercase; color: #6b46c1; display: block; margin-bottom: 6px;">Sentence Starters:</span>
              <div class="wb-starters-row">
                ${act.sentence_starters.map(s => `<button class="wb-starter-chip" data-starter="${s}" data-target-ta="ta_${act.id}">${s}</button>`).join('')}
              </div>
            </div>
          ` : ''}

          ${act.word_bank ? `
            <div class="wb-word-bank" style="margin-bottom: 0;">
              <span class="wb-word-bank-label">Word Bank:</span>
              ${act.word_bank.map(w => `<span class="wb-word-chip">${w}</span>`).join('')}
            </div>
          ` : ''}
        </div>

        <div style="margin: 16px 0;">
          <textarea id="ta_${act.id}" class="wb-pupil-textarea" placeholder="Write your composition here... The checklist above will auto-check as you include required points!"></textarea>
        </div>

        <div class="wb-card-actions">
          <button class="wb-btn wb-btn-primary wb-hint-btn" id="btn_hint_${act.id}" data-hint-act="${act.id}">💡 Get Writing Hint</button>
          <button class="wb-btn wb-btn-reveal wb-model-toggle-btn" id="btn_model_${act.id}" data-target-model="model_box_${act.id}">Reveal Model Text</button>
          <span class="wb-feedback-status" id="status_${act.id}"></span>
        </div>

        <div class="wb-hint-box" id="hint_box_${act.id}" style="display: none; background: #fffaf0; border: 1px solid #feebc8; border-radius: var(--radius-md); padding: 12px 16px; margin-top: 12px; font-size: 0.86rem; color: #744210;">
          <!-- Populated by getHint hook -->
        </div>

        <div class="wb-model-container" id="model_box_${act.id}" style="display: none;">
          <div class="wb-model-header">Model Text (CEFR A2+ Standard):</div>
          <p style="margin: 0; white-space: pre-line;">${act.model_text || ''}</p>
        </div>
      `;
    }

    // Interactive event attachments
    function attachCardInteractivity(act) {
      // Print button handler
      const printBtn = document.querySelector(`[data-print-act="${act.id}"]`);
      if (printBtn) {
        printBtn.addEventListener('click', () => printWorkbookActivity(act.id));
      }

      // Sentence starter insertion
      document.querySelectorAll(`[data-target-ta="ta_${act.id}"]`).forEach(chip => {
        chip.addEventListener('click', () => {
          const ta = document.getElementById(`ta_${act.id}`);
          if (ta) {
            const starter = chip.dataset.starter;
            if (ta.value.trim() === '') {
              ta.value = starter + ' ';
            } else {
              ta.value = ta.value.trim() + ' ' + starter + ' ';
            }
            ta.focus();
            ta.dispatchEvent(new Event('input'));
          }
        });
      });

      // Individual activity logic
      switch (act.id) {
        case 'opening_page':
          setupOpeningEvents(act);
          break;
        case 'a1':
          setupA1Events(act);
          break;
        case 'a2':
          setupA2Events(act);
          break;
        case 'a3':
          setupA3Events(act);
          break;
        case 'b1-I':
          setupB1IEvents(act);
          break;
        case 'b1-II':
          setupB1IIEvents(act);
          break;
        case 'b2':
          setupB2Events(act);
          break;
        case 'b3':
          setupB3Events(act);
          break;
        case 'b4':
          setupB4Events(act);
          break;
        case 'b5':
          setupB5Events(act);
          break;
        case 'c1':
          setupC1Events(act);
          break;
        case 'c2':
        case 'c3':
        case 'd':
        case 'e':
          setupOpenActivityEvents(act);
          break;
      }
    }

    // 1. OPENING EVENTS
    function setupOpeningEvents(act) {
      const btnReveal = document.getElementById('btn_opening_reveal');
      const modelBox = document.getElementById('model_opening');
      if (btnReveal && modelBox) {
        btnReveal.addEventListener('click', () => {
          const isHidden = modelBox.style.display === 'none';
          modelBox.style.display = isHidden ? 'block' : 'none';
          btnReveal.textContent = isHidden ? 'Hide Language Models' : 'Reveal Language Models & List';
        });
      }
    }

    // 2. A1 EVENTS
    function setupA1Events(act) {
      const btnCheck = document.getElementById('btn_a1_check');
      const btnRetry = document.getElementById('btn_a1_retry');
      const btnReveal = document.getElementById('btn_a1_reveal');
      const statusEl = document.getElementById('status_a1');
      const selects = document.querySelectorAll('.wb-match-select');

      btnCheck.addEventListener('click', () => {
        let correct = 0;
        let wrong = 0;

        selects.forEach(sel => {
          const idx = parseInt(sel.dataset.pairIdx, 10);
          const target = act.pairs[idx].nationality;
          if (sel.value.toLowerCase() === target.toLowerCase()) {
            sel.className = 'wb-match-select is-correct';
            correct++;
          } else {
            sel.className = 'wb-match-select is-retry';
            wrong++;
          }
        });

        statusEl.innerHTML = `<span style="color: ${wrong === 0 ? '#276749' : '#c53030'}">Score: ${correct} / ${act.pairs.length} Correct</span>`;
        btnRetry.style.display = wrong > 0 ? 'inline-flex' : 'none';
      });

      btnRetry.addEventListener('click', () => {
        let firstWrong = null;
        selects.forEach(sel => {
          if (sel.classList.contains('is-retry')) {
            sel.value = '';
            sel.className = 'wb-match-select';
            if (!firstWrong) firstWrong = sel;
          }
        });
        btnRetry.style.display = 'none';
        statusEl.textContent = 'Retry the wrong items!';
        if (firstWrong) firstWrong.focus();
      });

      btnReveal.addEventListener('click', () => {
        selects.forEach(sel => {
          const idx = parseInt(sel.dataset.pairIdx, 10);
          sel.value = act.pairs[idx].nationality;
          sel.className = 'wb-match-select is-correct';
        });
        btnRetry.style.display = 'none';
        statusEl.innerHTML = '<span style="color: #2b6cb0">All 10 answers revealed from Teacher&apos;s Book key</span>';
      });
    }

    // 3. A2 EVENTS
    function setupA2Events(act) {
      const btnCheck = document.getElementById('btn_a2_check');
      const btnReveal = document.getElementById('btn_a2_reveal');
      const statusEl = document.getElementById('status_a2');
      const inputs = document.querySelectorAll('[data-lf-input]');

      btnCheck.addEventListener('click', () => {
        let filled = 0;
        inputs.forEach(inp => {
          if (inp.value.trim().length > 0) {
            inp.classList.add('is-correct');
            filled++;
          } else {
            inp.classList.remove('is-correct');
          }
        });
        statusEl.innerHTML = `<span style="color: #276749">Completed ${filled} / ${act.landforms.length} landform examples!</span>`;
      });

      btnReveal.addEventListener('click', () => {
        const isShowing = btnReveal.textContent.includes('Hide');
        act.landforms.forEach((lf, idx) => {
          const m = document.getElementById(`lf_model_${idx}`);
          if (m) m.style.display = isShowing ? 'none' : 'block';
        });
        btnReveal.textContent = isShowing ? 'Reveal Model Examples' : 'Hide Model Examples';
      });
    }

    // 4. A3 EVENTS
    function setupA3Events(act) {
      const btnCheck = document.getElementById('btn_a3_check');
      const btnRetry = document.getElementById('btn_a3_retry');
      const btnReveal = document.getElementById('btn_a3_reveal');
      const statusEl = document.getElementById('status_a3');
      const inputs = document.querySelectorAll('[data-a3-input]');

      btnCheck.addEventListener('click', () => {
        let correct = 0;
        let wrong = 0;

        inputs.forEach(inp => {
          const idx = parseInt(inp.dataset.a3Input, 10);
          const accepted = act.items[idx].accepted;
          if (isAccepted(inp.value, accepted)) {
            inp.className = 'wb-gap-input is-correct';
            correct++;
          } else {
            inp.className = 'wb-gap-input is-retry';
            wrong++;
          }
        });

        statusEl.innerHTML = `<span style="color: ${wrong === 0 ? '#276749' : '#c53030'}">Score: ${correct} / ${act.items.length} Correct</span>`;
        btnRetry.style.display = wrong > 0 ? 'inline-flex' : 'none';
      });

      btnRetry.addEventListener('click', () => {
        let firstWrong = null;
        inputs.forEach(inp => {
          if (inp.classList.contains('is-retry')) {
            inp.value = '';
            inp.className = 'wb-gap-input';
            if (!firstWrong) firstWrong = inp;
          }
        });
        btnRetry.style.display = 'none';
        statusEl.textContent = 'Retry the empty fields!';
        if (firstWrong) firstWrong.focus();
      });

      btnReveal.addEventListener('click', () => {
        inputs.forEach(inp => {
          const idx = parseInt(inp.dataset.a3Input, 10);
          inp.value = act.items[idx].target;
          inp.className = 'wb-gap-input is-correct';
        });
        btnRetry.style.display = 'none';
        statusEl.innerHTML = '<span style="color: #2b6cb0">All 4 school subjects revealed from key</span>';
      });
    }

    // 5. B1-I EVENTS
    function setupB1IEvents(act) {
      const btnCheck = document.getElementById('btn_b1i_check');
      const btnRetry = document.getElementById('btn_b1i_retry');
      const btnReveal = document.getElementById('btn_b1i_reveal');
      const statusEl = document.getElementById('status_b1i');
      const inputs = document.querySelectorAll('[data-b1i-gap]');

      btnCheck.addEventListener('click', () => {
        let correct = 0;
        let wrong = 0;

        inputs.forEach(inp => {
          const gapId = inp.dataset.b1iGap;
          const gapData = act.gaps.find(g => g.id === gapId);
          if (gapData && isAccepted(inp.value, gapData.accepted)) {
            inp.className = 'wb-gap-input is-correct';
            correct++;
          } else {
            inp.className = 'wb-gap-input is-retry';
            wrong++;
          }
        });

        statusEl.innerHTML = `<span style="color: ${wrong === 0 ? '#276749' : '#c53030'}">Score: ${correct} / ${act.gaps.length} Correct</span>`;
        btnRetry.style.display = wrong > 0 ? 'inline-flex' : 'none';
      });

      btnRetry.addEventListener('click', () => {
        let first = null;
        inputs.forEach(inp => {
          if (inp.classList.contains('is-retry')) {
            inp.value = '';
            inp.className = 'wb-gap-input';
            if (!first) first = inp;
          }
        });
        btnRetry.style.display = 'none';
        statusEl.textContent = 'Retry the gaps!';
        if (first) first.focus();
      });

      btnReveal.addEventListener('click', () => {
        inputs.forEach(inp => {
          const gapId = inp.dataset.b1iGap;
          const gapData = act.gaps.find(g => g.id === gapId);
          if (gapData) {
            inp.value = gapData.key_answer;
            inp.className = 'wb-gap-input is-correct';
          }
        });
        btnRetry.style.display = 'none';
        statusEl.innerHTML = '<span style="color: #2b6cb0">All gaps filled from Teacher&apos;s Book key</span>';
      });
    }

    // 6. B1-II EVENTS
    function setupB1IIEvents(act) {
      const btnCheck = document.getElementById('btn_b1ii_check');
      const btnRetry = document.getElementById('btn_b1ii_retry');
      const btnReveal = document.getElementById('btn_b1ii_reveal');
      const statusEl = document.getElementById('status_b1ii');
      const inputs = document.querySelectorAll('[data-b1ii-gap]');

      btnCheck.addEventListener('click', () => {
        let correct = 0;
        let wrong = 0;

        inputs.forEach(inp => {
          const gapId = inp.dataset.b1iiGap;
          const gapData = act.gaps.find(g => g.id === gapId);
          if (gapData && isAccepted(inp.value, gapData.accepted)) {
            inp.className = 'wb-gap-input is-correct';
            correct++;
          } else {
            inp.className = 'wb-gap-input is-retry';
            wrong++;
          }
        });

        statusEl.innerHTML = `<span style="color: ${wrong === 0 ? '#276749' : '#c53030'}">Score: ${correct} / ${act.gaps.length} Correct</span>`;
        btnRetry.style.display = wrong > 0 ? 'inline-flex' : 'none';
      });

      btnRetry.addEventListener('click', () => {
        let first = null;
        inputs.forEach(inp => {
          if (inp.classList.contains('is-retry')) {
            inp.value = '';
            inp.className = 'wb-gap-input';
            if (!first) first = inp;
          }
        });
        btnRetry.style.display = 'none';
        statusEl.textContent = 'Retry the gaps!';
        if (first) first.focus();
      });

      btnReveal.addEventListener('click', () => {
        inputs.forEach(inp => {
          const gapId = inp.dataset.b1iiGap;
          const gapData = act.gaps.find(g => g.id === gapId);
          if (gapData) {
            inp.value = gapData.key_answer;
            inp.className = 'wb-gap-input is-correct';
          }
        });
        btnRetry.style.display = 'none';
        statusEl.innerHTML = '<span style="color: #2b6cb0">All 14 Present Simple forms revealed</span>';
      });
    }

    // 7. B2 EVENTS
    function setupB2Events(act) {
      const btnCheck = document.getElementById('btn_b2_check');
      const btnRetry = document.getElementById('btn_b2_retry');
      const btnReveal = document.getElementById('btn_b2_reveal');
      const statusEl = document.getElementById('status_b2');
      const inputs = document.querySelectorAll('[data-b2-gap]');

      btnCheck.addEventListener('click', () => {
        let correct = 0;
        let wrong = 0;

        inputs.forEach(inp => {
          const gapId = inp.dataset.b2Gap;
          const gapData = act.gaps.find(g => g.id === gapId);
          if (gapData && isAccepted(inp.value, gapData.accepted)) {
            inp.className = 'wb-gap-input is-correct';
            correct++;
          } else {
            inp.className = 'wb-gap-input is-retry';
            wrong++;
          }
        });

        statusEl.innerHTML = `<span style="color: ${wrong === 0 ? '#276749' : '#c53030'}">Score: ${correct} / ${act.gaps.length} Correct</span>`;
        btnRetry.style.display = wrong > 0 ? 'inline-flex' : 'none';
      });

      btnRetry.addEventListener('click', () => {
        let first = null;
        inputs.forEach(inp => {
          if (inp.classList.contains('is-retry')) {
            inp.value = '';
            inp.className = 'wb-gap-input';
            if (!first) first = inp;
          }
        });
        btnRetry.style.display = 'none';
        statusEl.textContent = 'Retry the wrong verbs!';
        if (first) first.focus();
      });

      btnReveal.addEventListener('click', () => {
        inputs.forEach(inp => {
          const gapId = inp.dataset.b2Gap;
          const gapData = act.gaps.find(g => g.id === gapId);
          if (gapData) {
            inp.value = gapData.key_answer;
            inp.className = 'wb-gap-input is-correct';
          }
        });
        btnRetry.style.display = 'none';
        statusEl.innerHTML = '<span style="color: #2b6cb0">All 6 restaurant dialogue verbs revealed</span>';
      });
    }

    // 8. B3 EVENTS
    function setupB3Events(act) {
      const btnCheck = document.getElementById('btn_b3_check');
      const btnRetry = document.getElementById('btn_b3_retry');
      const btnReveal = document.getElementById('btn_b3_reveal');
      const statusEl = document.getElementById('status_b3');
      const selects = document.querySelectorAll('[data-b3-select]');

      btnCheck.addEventListener('click', () => {
        let correct = 0;
        let wrong = 0;

        selects.forEach(sel => {
          const idx = parseInt(sel.dataset.b3Select, 10);
          const target = act.items[idx].key_answer;
          const cleanVal = sel.value.replace(/[’']/g, "'").toLowerCase();
          const cleanTarget = target.replace(/[’']/g, "'").toLowerCase();
          if (cleanVal === cleanTarget) {
            sel.className = 'wb-gap-input is-correct';
            correct++;
          } else {
            sel.className = 'wb-gap-input is-retry';
            wrong++;
          }
        });

        statusEl.innerHTML = `<span style="color: ${wrong === 0 ? '#276749' : '#c53030'}">Score: ${correct} / ${act.items.length} Correct</span>`;
        btnRetry.style.display = wrong > 0 ? 'inline-flex' : 'none';
      });

      btnRetry.addEventListener('click', () => {
        let first = null;
        selects.forEach(sel => {
          if (sel.classList.contains('is-retry')) {
            sel.value = '';
            sel.className = 'wb-gap-input';
            if (!first) first = sel;
          }
        });
        btnRetry.style.display = 'none';
        statusEl.textContent = 'Choose the correct form!';
        if (first) first.focus();
      });

      btnReveal.addEventListener('click', () => {
        selects.forEach(sel => {
          const idx = parseInt(sel.dataset.b3Select, 10);
          sel.value = act.items[idx].key_answer;
          sel.className = 'wb-gap-input is-correct';
        });
        btnRetry.style.display = 'none';
        statusEl.innerHTML = '<span style="color: #2b6cb0">All 8 sentences completed from Teacher&apos;s Book key</span>';
      });
    }

    // 9. B4 EVENTS (RULE CHECK)
    function setupB4Events(act) {
      const btnCheck = document.getElementById('btn_b4_check');
      const btnReveal = document.getElementById('btn_b4_reveal');
      const statusEl = document.getElementById('status_b4');
      const inputs = document.querySelectorAll('[data-b4-input]');

      btnCheck.addEventListener('click', () => {
        let valid = 0;
        inputs.forEach((inp, idx) => {
          const text = inp.value.trim().toLowerCase();
          const targetAdv = (act.adverbs && act.adverbs[idx]) ? act.adverbs[idx].toLowerCase() : '';
          const hasAdverb = /\b(always|usually|often|sometimes|rarely|never)\b/i.test(text);
          const hasLength = text.split(/\s+/).length >= 3;
          if (hasAdverb && hasLength) {
            inp.className = 'wb-gap-input is-correct';
            valid++;
          } else {
            inp.className = 'wb-gap-input is-retry';
          }
        });

        if (valid === act.adverbs.length) {
          statusEl.innerHTML = '<span style="color: #276749">✅ Excellent! All 6 sentences correctly use frequency adverbs!</span>';
        } else {
          statusEl.innerHTML = `<span style="color: #c53030">${valid} / ${act.adverbs.length} valid. Check that each sentence has an adverb (always, usually...) and at least 3 words.</span>`;
        }
      });

      btnReveal.addEventListener('click', () => {
        const isShowing = btnReveal.textContent.includes('Hide');
        act.adverbs.forEach((_, idx) => {
          const m = document.getElementById(`b4_model_${idx}`);
          if (m) m.style.display = isShowing ? 'none' : 'block';
        });
        btnReveal.textContent = isShowing ? 'Reveal Model Sentences' : 'Hide Model Sentences';
      });
    }

    // 10. B5 EVENTS (RULE CHECK)
    function setupB5Events(act) {
      const btnCheck = document.getElementById('btn_b5_check');
      const btnReveal = document.getElementById('btn_b5_reveal');
      const statusEl = document.getElementById('status_b5');
      const inputs = document.querySelectorAll('[data-b5-input]');

      btnCheck.addEventListener('click', () => {
        let valid = 0;
        inputs.forEach(inp => {
          const idx = parseInt(inp.dataset.b5Input, 10);
          const promptWord = (act.starters && act.starters[idx]) ? act.starters[idx].toLowerCase() : '';
          const text = inp.value.trim().toLowerCase();

          const startsWithPrompt = promptWord ? text.startsWith(promptWord) : true;
          const endsWithQ = text.endsWith('?');
          const hasWords = text.split(/\s+/).length >= 3;

          if (startsWithPrompt && endsWithQ && hasWords) {
            inp.className = 'wb-gap-input is-correct';
            valid++;
          } else {
            inp.className = 'wb-gap-input is-retry';
          }
        });

        if (valid === act.starters.length) {
          statusEl.innerHTML = '<span style="color: #276749">✅ Fantastic! All interview questions start with the prompt and end with "?"</span>';
        } else {
          statusEl.innerHTML = `<span style="color: #c53030">${valid} / ${act.starters.length} valid. Each question must start with the given word and end with "?".</span>`;
        }
      });

      btnReveal.addEventListener('click', () => {
        const isShowing = btnReveal.textContent.includes('Hide');
        act.starters.forEach((_, idx) => {
          const m = document.getElementById(`b5_model_${idx}`);
          if (m) m.style.display = isShowing ? 'none' : 'block';
        });
        btnReveal.textContent = isShowing ? 'Reveal Model Questions' : 'Hide Model Questions';
      });
    }

    // 11. C1 EVENTS (KEY FACT CHECK)
    function setupC1Events(act) {
      const btnCheck = document.getElementById('btn_c1_check');
      const btnReveal = document.getElementById('btn_c1_reveal');
      const statusEl = document.getElementById('status_c1');
      const inputs = document.querySelectorAll('[data-c1-input]');

      btnCheck.addEventListener('click', () => {
        let matched = 0;
        inputs.forEach(inp => {
          const idx = parseInt(inp.dataset.c1Input, 10);
          const kws = (act.questions[idx].key_facts || act.questions[idx].keywords || []);
          const text = inp.value.trim().toLowerCase();
          const hasKw = kws.some(kw => text.includes(kw.toLowerCase()));

          if (hasKw && text.length > 2) {
            inp.className = 'wb-gap-input is-correct';
            matched++;
          } else {
            inp.className = 'wb-gap-input is-retry';
          }
        });

        if (matched === act.questions.length) {
          statusEl.innerHTML = '<span style="color: #276749">✅ Well done! Key comprehension facts from Jack&apos;s letter identified.</span>';
        } else {
          statusEl.innerHTML = `<span style="color: #c53030">${matched} / ${act.questions.length} facts verified. Check Jack's letter for the details!</span>`;
        }
      });

      btnReveal.addEventListener('click', () => {
        const isShowing = btnReveal.textContent.includes('Hide');
        act.questions.forEach((_, idx) => {
          const m = document.getElementById(`c1_model_${idx}`);
          if (m) m.style.display = isShowing ? 'none' : 'block';
        });
        btnReveal.textContent = isShowing ? 'Reveal Model Answers' : 'Hide Model Answers';
      });
    }

    // 12-15. OPEN ACTIVITIES EVENTS (C2, C3, D, E)
    function setupOpenActivityEvents(act) {
      const ta = document.getElementById(`ta_${act.id}`);
      const btnHint = document.getElementById(`btn_hint_${act.id}`);
      const hintBox = document.getElementById(`hint_box_${act.id}`);
      const btnModel = document.getElementById(`btn_model_${act.id}`);
      const modelBox = document.getElementById(`model_box_${act.id}`);
      const statusEl = document.getElementById(`status_${act.id}`);
      const checklist = act.checklist || act.scaffolding_checklist || [];

      if (ta) {
        // Live auto-ticking checklist
        ta.addEventListener('input', () => {
          const text = ta.value.toLowerCase();
          let tickedCount = 0;

          checklist.forEach((item, idx) => {
            const chkEl = document.getElementById(`chk_${act.id}_${idx}`);
            if (!chkEl) return;
            const hasMatch = (item.keywords || []).some(kw => text.includes(kw.toLowerCase()));
            if (hasMatch) {
              chkEl.classList.add('is-ticked');
              chkEl.querySelector('.wb-check-icon').textContent = '✅';
              tickedCount++;
            } else {
              chkEl.classList.remove('is-ticked');
              chkEl.querySelector('.wb-check-icon').textContent = '◻️';
            }
          });

          if (tickedCount === checklist.length) {
            statusEl.innerHTML = '<span style="color: #276749">🌟 All checklist points mentioned in your text!</span>';
          } else {
            statusEl.innerHTML = `<span style="color: #718096">${tickedCount} / ${checklist.length} checklist points included</span>`;
          }
        });
      }

      // Model text toggle
      if (btnModel && modelBox) {
        btnModel.addEventListener('click', () => {
          const isShowing = modelBox.style.display === 'block';
          modelBox.style.display = isShowing ? 'none' : 'block';
          btnModel.textContent = isShowing ? 'Reveal Model Text' : 'Hide Model Text';
        });
      }

      // AI Hint button hook
      if (btnHint && hintBox) {
        btnHint.addEventListener('click', () => {
          const pupilText = ta ? ta.value : '';
          const customHint = getHint(act.id, pupilText);

          hintBox.style.display = 'block';
          if (customHint) {
            hintBox.innerHTML = `<strong>💡 AI Writing Coach:</strong> ${customHint}`;
          } else {
            // Default rule-guided pedagogical advice when hook returns null
            const unticked = [];
            checklist.forEach((item, idx) => {
              const chkEl = document.getElementById(`chk_${act.id}_${idx}`);
              if (chkEl && !chkEl.classList.contains('is-ticked')) {
                unticked.push(item.label || item.point);
              }
            });

            if (unticked.length === 0) {
              hintBox.innerHTML = `<strong>💡 Writing Guide:</strong> Superb composition! You have covered all required points. You can enrich it by using more descriptive adjectives from the unit word bank.`;
            } else {
              hintBox.innerHTML = `<strong>💡 Writing Guide:</strong> Remember to include: <strong>${unticked.join(', ')}</strong>. Use the sentence starters above to help organize your paragraphs!`;
            }
          }
        });
      }
    }
  }

  // =========================================================================
  // WORKBOOK SINGLE-ACTIVITY A4 PRINT GENERATOR
  // Generates clean, authentic A4 student worksheet matching existing style
  // =========================================================================
  function printWorkbookActivity(activityId) {
    const wbData = window.UNIT1_WORKBOOK_DATA || (v2Data && v2Data.workbook) || null;
    if (!wbData) return;
    const act = wbData.activities.find(a => a.id === activityId);
    if (!act) return;

    const printContainer = document.getElementById('workbookPrintArea');
    if (!printContainer) return;

    printContainer.innerHTML = buildPrintableWorksheetHTML(act);

    // Apply print-specific class and trigger print
    document.body.classList.add('printing-wb-sheet');
    setTimeout(() => {
      window.print();
    }, 200);

    window.addEventListener('afterprint', () => {
      document.body.classList.remove('printing-wb-sheet');
    }, { once: true });
  }

  function buildPrintableWorksheetHTML(act) {
    return `
      <div class="printable-paper-sheet">
        <div class="sheet-header-crest-row">
          <div class="sheet-crest">🇬🇷 🇪🇺</div>
          <div class="sheet-gov-titles">
            <h3>Hellenic Republic • Ministry of Education &amp; Religious Affairs</h3>
            <h4>English 6th Grade Primary • Coursebook Companion (Version 2)</h4>
          </div>
        </div>

        <div class="sheet-student-info-bar">
          <div class="info-field"><span>Name:</span> ____________________________________</div>
          <div class="info-field"><span>Class:</span> ____________</div>
          <div class="info-field"><span>Date:</span> ________________</div>
        </div>

        <h2 class="sheet-main-title">Workbook Activity ${act.number}: ${act.title}</h2>
        <div style="font-size: 0.85rem; color: #4a5568; margin-bottom: 14px;">Reference: Printed Workbook page ${act.page}</div>

        ${act.instruction ? `<div class="sheet-task-prompt" style="font-weight: 700; margin-bottom: 14px;">${act.instruction}</div>` : ''}

        ${buildPrintableActivityBody(act)}

        <div class="sheet-footer-bar" style="margin-top: 36px;">
          <span>Photodentro Coursebook Companion • Unit 1: Our Multicultural Class</span>
          <span>Workbook Worksheet • Formative Assessment</span>
        </div>
      </div>
    `;
  }

  function buildPrintableActivityBody(act) {
    switch (act.id) {
      case 'opening_page':
        return `
          <div style="margin-bottom: 24px;">
            <p style="font-weight: 700;">1. Make a list of people you know from other countries:</p>
            <div style="line-height: 2.2; border-bottom: 1px dotted #000; height: 32px;"></div>
            <div style="line-height: 2.2; border-bottom: 1px dotted #000; height: 32px;"></div>
            <div style="line-height: 2.2; border-bottom: 1px dotted #000; height: 32px;"></div>
          </div>
          <div>
            <p style="font-weight: 700;">2. Can you find the words 'river' and 'mountain' in other languages?</p>
            <table class="sheet-table" style="width: 100%; border-collapse: collapse; margin-top: 10px;">
              <thead>
                <tr>
                  <th style="border: 1px solid #000; padding: 6px;">Language</th>
                  <th style="border: 1px solid #000; padding: 6px;">Word for 'River'</th>
                  <th style="border: 1px solid #000; padding: 6px;">Word for 'Mountain'</th>
                </tr>
              </thead>
              <tbody>
                ${act.part2.languages.map(l => `
                  <tr>
                    <td style="border: 1px solid #000; padding: 8px; font-weight: 700;">${l.language}</td>
                    <td style="border: 1px solid #000; padding: 8px;">______________________</td>
                    <td style="border: 1px solid #000; padding: 8px;">______________________</td>
                  </tr>
                `).join('')}
              </tbody>
            </table>
          </div>
        `;

      case 'a1':
        return `
          <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 20px; margin: 20px 0;">
            <div>
              <h4 style="margin-bottom: 10px;">Country:</h4>
              <ol style="line-height: 2.2; padding-left: 20px;">
                ${act.pairs.map(p => `<li><strong>${p.country}</strong></li>`).join('')}
              </ol>
            </div>
            <div>
              <h4 style="margin-bottom: 10px;">Nationality:</h4>
              <ul style="list-style-type: none; line-height: 2.2; padding-left: 0;">
                ${act.pairs.map(p => `<li>[ &nbsp; ] _______________________</li>`).join('')}
              </ul>
            </div>
          </div>
        `;

      case 'a2':
        return `
          <table class="sheet-table" style="width: 100%; border-collapse: collapse; margin-top: 14px;">
            <thead>
              <tr>
                <th style="border: 1px solid #000; padding: 6px; width: 25%;">Landform &amp; Greek Term</th>
                <th style="border: 1px solid #000; padding: 6px; width: 45%;">Definition</th>
                <th style="border: 1px solid #000; padding: 6px; width: 30%;">Examples from Greek Geography</th>
              </tr>
            </thead>
            <tbody>
              ${act.landforms.map(lf => `
                <tr>
                  <td style="border: 1px solid #000; padding: 8px;">
                    <strong>${lf.landform}</strong><br>
                    <span style="font-size: 0.8rem;">(${lf.greek_term})</span>
                  </td>
                  <td style="border: 1px solid #000; padding: 8px; font-size: 0.85rem;">${lf.definition}</td>
                  <td style="border: 1px solid #000; padding: 8px;">__________________________</td>
                </tr>
              `).join('')}
            </tbody>
          </table>
        `;

      case 'a3':
        return `
          <div style="border: 1px solid #000; padding: 8px 12px; margin-bottom: 16px; font-weight: 700;">
            Word Bank: ${act.word_bank.join(', ')}
          </div>
          <div style="display: grid; grid-template-columns: repeat(2, 1fr); gap: 24px; margin-top: 14px;">
            ${act.items.map((it, i) => `
              <div style="text-align: center; border: 1px solid #ccc; padding: 12px;">
                <img src="${it.image}" alt="Subject ${i+1}" style="max-height: 120px; object-fit: contain; margin-bottom: 10px;">
                <div style="border-top: 1px dotted #000; padding-top: 8px; font-weight: 700;">
                  Subject: ___________________________
                </div>
              </div>
            `).join('')}
          </div>
        `;

      case 'b1-I':
        return `
          <div style="border: 1px solid #000; padding: 8px 12px; margin-bottom: 16px; font-weight: 700;">
            Word Bank (Present Continuous): ${act.word_bank.join(', ')}
          </div>
          <div style="font-size: 1rem; line-height: 2.3; border: 1px solid #ccc; padding: 18px;">
            ${act.gaps.map(g => `<p style="margin-bottom: 8px;"><strong>${g.label}</strong> ${g.prefix} ________________________ ${g.suffix}</p>`).join('')}
          </div>
        `;

      case 'b1-II':
        return `
          <div style="border: 1px solid #000; padding: 8px 12px; margin-bottom: 16px; font-weight: 700;">
            Word Bank (Present Simple - remember negative forms): ${act.word_bank.join(', ')}
          </div>
          <div style="font-size: 1rem; line-height: 2.3; border: 1px solid #ccc; padding: 18px;">
            ${act.gaps.map(g => `<p style="margin-bottom: 8px;"><strong>${g.label}</strong> ${g.prefix} ________________________ ${g.suffix}</p>`).join('')}
          </div>
        `;

      case 'b2':
        return `
          <div style="border: 1px solid #000; padding: 8px 12px; margin-bottom: 16px; font-weight: 700;">
            Word Bank: ${act.word_bank.join(', ')}
          </div>
          <div style="font-size: 1rem; line-height: 2.3; border: 1px solid #ccc; padding: 18px;">
            ${act.gaps.map(g => `<p style="margin-bottom: 8px;"><strong>${g.speaker}:</strong> ${g.prefix} ________________________ ${g.suffix}</p>`).join('')}
          </div>
        `;

      case 'b3':
        return `
          <div style="font-size: 1rem; line-height: 2.4; padding: 10px 0;">
            ${act.items.map((it, idx) => `<p style="margin-bottom: 8px;"><strong>${it.speaker}:</strong> ${it.context} [ &nbsp; ] <strong>${it.options[0]}</strong> &nbsp;&nbsp; [ &nbsp; ] <strong>${it.options[1]}</strong></p>`).join('')}
          </div>
        `;

      case 'b4':
        return `
          <div style="border: 1px solid #000; padding: 8px 12px; margin-bottom: 16px; font-weight: 700;">
            Adverbs of Frequency: ${act.adverbs.join(', ')}
          </div>
          ${act.example ? `<p style="font-style: italic; margin-bottom: 12px;"><strong>Example:</strong> "${act.example}"</p>` : ''}
          <ol style="line-height: 2.2; font-size: 1rem; padding-left: 20px;">
            ${act.adverbs.map(adv => `
              <li style="margin-bottom: 12px;">
                <strong>${adv}</strong>: __________________________________________________________________________________________
              </li>
            `).join('')}
          </ol>
        `;

      case 'b5':
        return `
          <ol style="line-height: 2.2; font-size: 1rem; padding-left: 20px;">
            ${act.starters.map(st => `
              <li style="margin-bottom: 12px;">
                <strong>${st}</strong> ___________________________________________________________________ ?
              </li>
            `).join('')}
          </ol>
        `;

      case 'c1':
        return `
          <div style="border: 1px solid #ccc; padding: 14px; margin-bottom: 18px; font-size: 0.92rem; line-height: 1.6; white-space: pre-line;">
            <strong>Jack's Letter:</strong>\n${act.letter_text || ''}
          </div>
          <ol style="line-height: 2.2; font-size: 1rem; padding-left: 20px;">
            ${act.questions.map(q => `
              <li style="margin-bottom: 12px;">
                <strong>${q.question}</strong><br>
                __________________________________________________________________________________________
              </li>
            `).join('')}
          </ol>
        `;

      case 'c2':
      case 'c3':
        const chkItems = act.checklist || act.scaffolding_checklist || [];
        return `
          ${act.incoming_email ? `
            <div style="border: 1px solid #ccc; padding: 12px; margin-bottom: 14px; font-size: 0.9rem; white-space: pre-line;">
              <strong>Incoming Email from Jack:</strong>\n${act.incoming_email}
            </div>
          ` : ''}
          <div style="border: 1px solid #000; padding: 10px 14px; margin-bottom: 18px;">
            <strong>Checklist of points to mention:</strong> ${chkItems.map(c => c.label || c.point).join(' • ')}<br>
            ${act.word_bank ? `<strong>Word Bank:</strong> ${act.word_bank.join(', ')}` : ''}
          </div>
          <div style="line-height: 2.4;">
            ${Array(14).fill(0).map(() => '<div style="border-bottom: 1px dotted #000; height: 32px;"></div>').join('')}
          </div>
        `;

      case 'd':
        const dChkItems = act.checklist || act.scaffolding_checklist || [];
        return `
          <div style="text-align: center; margin-bottom: 14px;">
            <img src="${act.image}" alt="Beach Photo" style="max-height: 160px; object-fit: contain;">
          </div>
          <p><strong>Starter:</strong> "${act.starter_text || act.starter || ''}"</p>
          <div style="border: 1px solid #000; padding: 8px 12px; margin-bottom: 14px; font-size: 0.85rem;">
            <strong>Key points:</strong> ${dChkItems.map(c => c.label || c.point).join(' • ')}
          </div>
          <div style="line-height: 2.4;">
            ${Array(12).fill(0).map(() => '<div style="border-bottom: 1px dotted #000; height: 32px;"></div>').join('')}
          </div>
        `;

      case 'e':
        const printDays = ["ΔΕΥΤΕΡΑ", "ΤΡΙΤΗ", "ΤΕΤΑΡΤΗ", "ΠΕΜΠΤΗ", "ΠΑΡΑΣΚΕΥΗ"];
        return `
          <table class="sheet-table" style="width: 100%; border-collapse: collapse; margin-bottom: 16px; font-size: 0.85rem;">
            <thead>
              <tr>
                <th style="border: 1px solid #000; padding: 4px;">Period</th>
                <th style="border: 1px solid #000; padding: 4px;">Monday</th>
                <th style="border: 1px solid #000; padding: 4px;">Tuesday</th>
                <th style="border: 1px solid #000; padding: 4px;">Wednesday</th>
                <th style="border: 1px solid #000; padding: 4px;">Thursday</th>
                <th style="border: 1px solid #000; padding: 4px;">Friday</th>
              </tr>
            </thead>
            <tbody>
              ${[0, 1, 2, 3, 4, 5].map(pIdx => `
                <tr>
                  <td style="border: 1px solid #000; padding: 4px; text-align: center; font-weight: 700;">${pIdx + 1}</td>
                  ${printDays.map(d => {
                    const grSub = (act.greek_timetable && act.greek_timetable[d]) ? act.greek_timetable[d][pIdx] : '';
                    const enSub = (act.subject_translations && act.subject_translations[grSub]) ? act.subject_translations[grSub] : grSub;
                    return `<td style="border: 1px solid #000; padding: 4px; text-align: center;">${enSub}</td>`;
                  }).join('')}
                </tr>
              `).join('')}
            </tbody>
          </table>
          <p><strong>Note to Peter:</strong></p>
          <div style="line-height: 2.4;">
            ${Array(10).fill(0).map(() => '<div style="border-bottom: 1px dotted #000; height: 32px;"></div>').join('')}
          </div>
        `;

      default:
        return '';
    }
  }

});
