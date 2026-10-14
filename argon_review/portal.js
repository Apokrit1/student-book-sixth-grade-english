/**
 * ENGLISH 6TH GRADE COURSEBOOK PORTAL & BUDDY HUB - Client Application
 * Implements the Modernized Sixth-Grade English Buddy Hub Design Specification.
 */

// ============================================================================
// CONFIGURATION & GLOBAL STATE
// ============================================================================
const HUB_CONFIG = {
  totalUnits: 10,
  passingScore: 80, // Score threshold to earn CEFR Can-Do Badge and mark complete
};

const STATE = {
  studentName: localStorage.getItem('buddyHub_studentName') || 'Alex',
  studentClass: localStorage.getItem('buddyHub_studentClass') || '6th Grade (ΣΤ΄ Δημοτικού)',
  avatarEmoji: localStorage.getItem('buddyHub_avatarEmoji') || '🎒',
  teacherMode: localStorage.getItem('buddyHub_teacherMode') === 'true',
  activeFilter: 'all',
  searchQuery: '',
  currentUnit: null,
  activeTab: 'lesson',
  currentAudioIndex: 0,
  unitDataCache: {},
  workbookDataCache: {},
  quizState: null,
};

// ============================================================================
// INITIALIZATION ON DOM READY
// ============================================================================
document.addEventListener('DOMContentLoaded', () => {
  initProfile();
  initTeacherMode();
  initSearchAndFilters();
  initModals();
  initAudioPlayerCore();
  renderUnitsGrid();
  updateGlobalStats();

  // Check URL Parameters for direct deep linking (e.g. ?unit=1&tab=quiz)
  const urlParams = new URLSearchParams(window.location.search);
  const deepUnit = parseInt(urlParams.get('unit'), 10);
  const deepTab = urlParams.get('tab') || 'lesson';
  if (deepUnit && deepUnit >= 1 && deepUnit <= HUB_CONFIG.totalUnits) {
    openUnitWrapper(deepUnit, deepTab);
  }
});

// ============================================================================
// 1. PROFILE & USER STATE
// ============================================================================
function initProfile() {
  const navName = document.getElementById('navStudentName');
  const avatarEmojiEl = document.getElementById('avatarEmoji');
  const profileBtn = document.getElementById('profileBtn');
  const profileModal = document.getElementById('profileModal');
  const profileForm = document.getElementById('profileForm');
  const inputName = document.getElementById('inputStudentName');
  const inputClass = document.getElementById('inputStudentClass');
  const profileCloseBtn = document.getElementById('profileModalCloseBtn');
  const profileCancelBtn = document.getElementById('profileCancelBtn');
  const avatarPicker = document.getElementById('avatarPickerGrid');

  if (navName) navName.textContent = STATE.studentName;
  if (avatarEmojiEl) avatarEmojiEl.textContent = STATE.avatarEmoji;

  if (profileBtn && profileModal) {
    profileBtn.addEventListener('click', () => {
      inputName.value = STATE.studentName;
      inputClass.value = STATE.studentClass;
      profileModal.showModal();
    });
  }

  if (avatarPicker) {
    avatarPicker.querySelectorAll('.avatar-opt').forEach(btn => {
      if (btn.dataset.emoji === STATE.avatarEmoji) btn.classList.add('active');
      btn.addEventListener('click', () => {
        avatarPicker.querySelectorAll('.avatar-opt').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        STATE.avatarEmoji = btn.dataset.emoji;
      });
    });
  }

  if (profileForm) {
    profileForm.addEventListener('submit', (e) => {
      e.preventDefault();
      STATE.studentName = inputName.value.trim() || 'Student';
      STATE.studentClass = inputClass.value.trim() || '6th Grade';
      localStorage.setItem('buddyHub_studentName', STATE.studentName);
      localStorage.setItem('buddyHub_studentClass', STATE.studentClass);
      localStorage.setItem('buddyHub_avatarEmoji', STATE.avatarEmoji);
      if (navName) navName.textContent = STATE.studentName;
      if (avatarEmojiEl) avatarEmojiEl.textContent = STATE.avatarEmoji;
      profileModal.close();
      updateWorksheetInputs();
    });
  }

  if (profileCloseBtn) profileCloseBtn.addEventListener('click', () => profileModal.close());
  if (profileCancelBtn) profileCancelBtn.addEventListener('click', () => profileModal.close());
}

// ============================================================================
// 2. TEACHER MODE TOGGLE & PERSISTENCE
// ============================================================================
function initTeacherMode() {
  const toggleBtn = document.getElementById('teacherModeToggle');
  const banner = document.getElementById('teacherModeBanner');
  const dismissBtn = document.getElementById('teacherDismissBannerBtn');
  const downloadAllBtn = document.getElementById('teacherDownloadAllBtn');
  const footerTeacherBtn = document.getElementById('footerTeacherBtn');

  function updateTeacherUI() {
    if (toggleBtn) {
      toggleBtn.classList.toggle('active', STATE.teacherMode);
      toggleBtn.setAttribute('aria-pressed', String(STATE.teacherMode));
    }
    if (banner) {
      banner.hidden = !STATE.teacherMode;
    }
  }

  updateTeacherUI();

  if (toggleBtn) {
    toggleBtn.addEventListener('click', () => {
      STATE.teacherMode = !STATE.teacherMode;
      localStorage.setItem('buddyHub_teacherMode', String(STATE.teacherMode));
      updateTeacherUI();
      // Re-render unit cards to show teacher badges if any
      renderUnitsGrid();
    });
  }

  if (footerTeacherBtn) {
    footerTeacherBtn.addEventListener('click', () => {
      STATE.teacherMode = !STATE.teacherMode;
      localStorage.setItem('buddyHub_teacherMode', String(STATE.teacherMode));
      updateTeacherUI();
      renderUnitsGrid();
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  if (dismissBtn && banner) {
    dismissBtn.addEventListener('click', () => {
      banner.hidden = true;
    });
  }

  if (downloadAllBtn) {
    downloadAllBtn.addEventListener('click', () => {
      alert('Generating Complete 10-Unit Classroom Worksheet Pack for printing...');
      window.print();
    });
  }
}

// ============================================================================
// 3. SEARCH & TERM FILTER LOGIC
// ============================================================================
function initSearchAndFilters() {
  const searchInput = document.getElementById('unitSearch');
  const clearBtn = document.getElementById('searchClearBtn');
  const filterTabs = document.querySelectorAll('.term-filter-tabs .filter-tab');
  const resetBtn = document.getElementById('resetSearchFilterBtn');

  if (searchInput) {
    searchInput.addEventListener('input', (e) => {
      STATE.searchQuery = e.target.value.toLowerCase().trim();
      if (clearBtn) clearBtn.hidden = !STATE.searchQuery;
      renderUnitsGrid();
    });

    // Keyboard shortcut '/' to focus search
    window.addEventListener('keydown', (e) => {
      if (e.key === '/' && document.activeElement !== searchInput && !isModalOpen()) {
        e.preventDefault();
        searchInput.focus();
        searchInput.select();
      }
      if (e.key === 'Escape' && document.activeElement === searchInput) {
        searchInput.value = '';
        STATE.searchQuery = '';
        clearBtn.hidden = true;
        renderUnitsGrid();
        searchInput.blur();
      }
    });
  }

  if (clearBtn && searchInput) {
    clearBtn.addEventListener('click', () => {
      searchInput.value = '';
      STATE.searchQuery = '';
      clearBtn.hidden = true;
      renderUnitsGrid();
      searchInput.focus();
    });
  }

  filterTabs.forEach(tab => {
    tab.addEventListener('click', () => {
      filterTabs.forEach(t => {
        t.classList.remove('active');
        t.setAttribute('aria-pressed', 'false');
      });
      tab.classList.add('active');
      tab.setAttribute('aria-pressed', 'true');
      STATE.activeFilter = tab.dataset.filter;
      renderUnitsGrid();
    });
  });

  if (resetBtn && searchInput) {
    resetBtn.addEventListener('click', () => {
      searchInput.value = '';
      STATE.searchQuery = '';
      if (clearBtn) clearBtn.hidden = true;
      filterTabs.forEach(t => t.classList.remove('active'));
      const allTab = document.querySelector('.filter-tab[data-filter="all"]');
      if (allTab) allTab.classList.add('active');
      STATE.activeFilter = 'all';
      renderUnitsGrid();
    });
  }
}

function isModalOpen() {
  const wrapper = document.getElementById('unitWrapperModal');
  const dash = document.getElementById('quizDashboardModal');
  const prof = document.getElementById('profileModal');
  return (wrapper && wrapper.open) || (dash && dash.open) || (prof && prof.open);
}

// ============================================================================
// 4. PROGRESS ENGINE & LOCALSTORAGE
// ============================================================================
function getUnitProgress(unitId) {
  const defaultProgress = {
    visitedLesson: false,
    listenedAudio: false,
    viewedWorksheet: false,
    quizScore: 0,
    quizCompleted: false,
    completed: false,
  };
  try {
    const raw = localStorage.getItem(`buddyHub_progress_${unitId}`);
    if (raw) return { ...defaultProgress, ...JSON.parse(raw) };
  } catch (err) {
    console.warn(`Could not read progress for unit ${unitId}`, err);
  }
  return defaultProgress;
}

function saveUnitProgress(unitId, updates) {
  const current = getUnitProgress(unitId);
  const updated = { ...current, ...updates };

  // Calculate completion percentage:
  // - Lesson visited: 25%
  // - Audio listened: 25%
  // - Worksheet viewed: 25%
  // - Quiz passed >= 80%: 25%
  let score = 0;
  if (updated.visitedLesson) score += 25;
  if (updated.listenedAudio) score += 25;
  if (updated.viewedWorksheet) score += 25;
  if (updated.quizScore >= HUB_CONFIG.passingScore) score += 25;

  updated.percentage = score;
  updated.completed = (updated.percentage >= HUB_CONFIG.passingScore || updated.quizScore >= HUB_CONFIG.passingScore);

  localStorage.setItem(`buddyHub_progress_${unitId}`, JSON.stringify(updated));
  updateGlobalStats();
  return updated;
}

function updateGlobalStats() {
  let completedCount = 0;
  let totalScore = 0;
  let quizCount = 0;

  for (let i = 1; i <= HUB_CONFIG.totalUnits; i++) {
    const p = getUnitProgress(i);
    if (p.completed) completedCount++;
    if (p.quizCompleted) {
      totalScore += p.quizScore;
      quizCount++;
    }
  }

  const badgesEarned = completedCount;
  const avgScore = quizCount > 0 ? Math.round(totalScore / quizCount) : 0;

  // Header badges counter
  const headerCount = document.getElementById('headerBadgesCount');
  if (headerCount) headerCount.textContent = `${badgesEarned}/${HUB_CONFIG.totalUnits}`;

  // Term filters completed count
  const countCompletedEl = document.getElementById('countCompleted');
  if (countCompletedEl) countCompletedEl.textContent = completedCount;

  // Dashboard modal values
  const dashAvg = document.getElementById('dashOverallAvg');
  const dashBadges = document.getElementById('dashBadgesEarned');
  const dashUnits = document.getElementById('dashUnitsCompleted');
  if (dashAvg) dashAvg.textContent = `${avgScore}%`;
  if (dashBadges) dashBadges.textContent = `${badgesEarned} / ${HUB_CONFIG.totalUnits}`;
  if (dashUnits) dashUnits.textContent = `${completedCount} / ${HUB_CONFIG.totalUnits}`;
}

// ============================================================================
// 5. UNITS GRID RENDERING
// ============================================================================
function renderUnitsGrid() {
  const grid = document.getElementById('unitsGrid');
  const feedbackBar = document.getElementById('searchFeedbackBar');
  const feedbackText = document.getElementById('searchFeedbackText');
  if (!grid) return;

  const catalog = window.COURSEBOOK_CATALOG || { units: [] };
  const allUnits = catalog.units || [];

  // Filter units
  const filtered = allUnits.filter(u => {
    const progress = getUnitProgress(u.unit);

    // Term filter
    if (STATE.activeFilter === 'term1' && (u.unit < 1 || u.unit > 3)) return false;
    if (STATE.activeFilter === 'term2' && (u.unit < 4 || u.unit > 7)) return false;
    if (STATE.activeFilter === 'term3' && (u.unit < 8 || u.unit > 10)) return false;
    if (STATE.activeFilter === 'completed' && !progress.completed) return false;

    // Search query match
    if (STATE.searchQuery) {
      const q = STATE.searchQuery;
      const titleMatch = u.title.toLowerCase().includes(q);
      const tagMatch = (u.tagline || '').toLowerCase().includes(q);
      const gramMatch = (u.grammar || '').toLowerCase().includes(q);
      const themeMatch = (u.theme || '').toLowerCase().includes(q);
      const crossMatch = (u.cross_curricular || []).some(c => c.toLowerCase().includes(q));
      const keywordMatch = (u.keywords || '').toLowerCase().includes(q);
      const numMatch = `unit ${u.unit}`.includes(q) || String(u.unit) === q;
      return titleMatch || tagMatch || gramMatch || themeMatch || crossMatch || keywordMatch || numMatch;
    }

    return true;
  });

  // Feedback bar
  if (feedbackBar && feedbackText) {
    if (STATE.searchQuery || STATE.activeFilter !== 'all') {
      feedbackBar.hidden = false;
      feedbackText.textContent = `Showing ${filtered.length} of ${allUnits.length} units ${STATE.searchQuery ? `matching "${STATE.searchQuery}"` : ''}`;
    } else {
      feedbackBar.hidden = true;
    }
  }

  grid.innerHTML = '';

  if (filtered.length === 0) {
    grid.innerHTML = `
      <div style="grid-column: 1 / -1; text-align: center; padding: 60px 20px; background: #ffffff; border-radius: 16px; border: 1px dashed #cbd5e0;">
        <span style="font-size: 2.8rem; display: block; margin-bottom: 12px;">🔍</span>
        <h3 style="font-size: 1.4rem; font-weight: 800; color: #1a202c;">No matching units found</h3>
        <p style="color: #718096; margin-top: 6px;">Try adjusting your search terms or clearing the current term filter.</p>
        <button onclick="document.getElementById('resetSearchFilterBtn').click()" class="btn btn-primary" style="margin-top: 18px;">
          Clear All Filters
        </button>
      </div>
    `;
    return;
  }

  filtered.forEach(u => {
    const progress = getUnitProgress(u.unit);
    const padNum = String(u.unit).padStart(2, '0');
    const card = document.createElement('article');
    card.className = `unit-card`;
    card.style.setProperty('--unit-accent', u.accent_color || '#2b6cb0');
    card.id = `unitCard-${u.unit}`;

    // Completion percentage calculation
    let percentage = progress.percentage || 0;
    if (percentage === 0 && progress.quizScore > 0) {
      percentage = Math.round(progress.quizScore);
    }

    const isCompleted = progress.completed;
    const progressLabel = isCompleted 
      ? '100% Completed • Badge Earned' 
      : (percentage > 0 ? `${percentage}% Completed` : 'Not Started');

    card.innerHTML = `
      <div class="unit-card-header">
        <div class="unit-header-left">
          <span class="unit-icon" aria-hidden="true">${u.icon || '📚'}</span>
          <span class="unit-num-pill">Unit ${padNum}</span>
        </div>
        ${isCompleted ? `
          <span class="completed-badge" title="Unit Complete! CEFR Badge Awarded">
            <span aria-hidden="true">✅</span> Completed
          </span>
        ` : `
          <span class="meta-tag badge-tag" title="CEFR Can-Do Passport Target">
            ${u.can_do_badge || 'A2 Target'}
          </span>
        `}
      </div>

      <h3 class="unit-title">${u.title}</h3>
      <p class="unit-tagline">${u.tagline}</p>

      <div class="unit-meta-tags">
        <span class="meta-tag grammar-tag" title="Grammar Focus">
          <strong>Grammar:</strong> ${u.grammar}
        </span>
        <span class="meta-tag" title="Curriculum Theme">
          <strong>Theme:</strong> ${u.theme}
        </span>
        ${(u.cross_curricular || []).slice(0, 3).map(c => `<span class="meta-tag">📚 ${c}</span>`).join('')}
      </div>

      <!-- Mini-Progress Bar -->
      <div class="unit-progress-box" aria-label="Unit ${u.unit} completion progress">
        <div class="progress-header">
          <span>Progress</span>
          <span class="progress-val-text">${progressLabel}</span>
        </div>
        <div class="progress-track">
          <div class="progress-bar-fill" style="width: ${percentage}%;"></div>
        </div>
      </div>

      <!-- Action Buttons -->
      <div class="unit-card-actions">
        <button class="btn btn-primary launch-v2-btn" data-unit="${u.unit}">
          <span>🚀</span> Launch V2
        </button>

        <div class="resources-dropdown-wrapper" id="resDropWrap-${u.unit}">
          <button class="resources-btn" data-unit="${u.unit}" aria-expanded="false" aria-label="Resources for Unit ${u.unit}">
            <span>📂 Resources</span>
            <span class="dropdown-caret">▼</span>
          </button>
          <div class="resources-menu" role="menu">
            <button class="resource-menu-item res-action" data-unit="${u.unit}" data-tab="lesson" role="menuitem">
              <span>🚀</span> Interactive Explorer (V2)
            </button>
            <a href="${u.v1_url}" class="resource-menu-item" role="menuitem">
              <span>📖</span> Vocabulary Lab (V1)
            </a>
            <button class="resource-menu-item res-action" data-unit="${u.unit}" data-tab="audio" role="menuitem">
              <span>🎧</span> Audio Lab &amp; Transcripts
            </button>
            <button class="resource-menu-item res-action" data-unit="${u.unit}" data-tab="worksheet" role="menuitem">
              <span>🖨️</span> Printable Worksheet Pack
            </button>
            <button class="resource-menu-item res-action" data-unit="${u.unit}" data-tab="quiz" role="menuitem">
              <span>📝</span> Take Quiz &amp; Earn Badge
            </button>
            ${u.photodentro_url ? `
              <a href="${u.photodentro_url}" target="_blank" rel="noopener" class="resource-menu-item" role="menuitem">
                <span>🏛️</span> Photodentro OER Lab
              </a>
            ` : ''}
          </div>
        </div>
      </div>
    `;

    grid.appendChild(card);
  });

  // Wire up action listeners
  grid.querySelectorAll('.launch-v2-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const u = parseInt(btn.dataset.unit, 10);
      openUnitWrapper(u, 'lesson');
    });
  });

  // Resources dropdown toggles
  grid.querySelectorAll('.resources-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      const wrap = btn.closest('.resources-dropdown-wrapper');
      const isOpen = wrap.classList.contains('open');
      // Close any other open dropdowns
      document.querySelectorAll('.resources-dropdown-wrapper.open').forEach(w => {
        w.classList.remove('open');
        w.querySelector('.resources-btn').setAttribute('aria-expanded', 'false');
      });
      if (!isOpen) {
        wrap.classList.add('open');
        btn.setAttribute('aria-expanded', 'true');
      }
    });
  });

  // Dropdown menu actions
  grid.querySelectorAll('.res-action').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      const u = parseInt(btn.dataset.unit, 10);
      const tab = btn.dataset.tab;
      openUnitWrapper(u, tab);
      btn.closest('.resources-dropdown-wrapper').classList.remove('open');
    });
  });

  // Close dropdown on click outside
  document.addEventListener('click', () => {
    document.querySelectorAll('.resources-dropdown-wrapper.open').forEach(w => {
      w.classList.remove('open');
      w.querySelector('.resources-btn').setAttribute('aria-expanded', 'false');
    });
  });
}

// ============================================================================
// 6. CONSISTENT UNIT WRAPPER (TABS: LESSON, AUDIO, WORKSHEET, QUIZ)
// ============================================================================
function initModals() {
  const modal = document.getElementById('unitWrapperModal');
  const closeBtn = document.getElementById('wrapperCloseBtn');
  const tabs = document.querySelectorAll('.wrapper-tab');

  if (closeBtn && modal) {
    closeBtn.addEventListener('click', () => {
      modal.close();
      pauseAudio();
      // Re-render grid to reflect updated progress
      renderUnitsGrid();
    });
  }

  tabs.forEach(tab => {
    tab.addEventListener('click', () => {
      switchWrapperTab(tab.dataset.tab);
    });
  });

  // Global Quiz Dashboard Modal wiring
  const dashModal = document.getElementById('quizDashboardModal');
  const openDashBtn = document.getElementById('openQuizDashboardBtn');
  const heroOpenQuizBtn = document.getElementById('heroOpenQuizBtn');
  const footerOpenQuizBtn = document.getElementById('footerOpenQuizBtn');
  const dashCloseBtn = document.getElementById('dashCloseBtn');
  const dashPrintCertBtn = document.getElementById('dashPrintCertificateBtn');
  const dashResetBtn = document.getElementById('dashResetProgressBtn');

  function openDashboard() {
    renderDashboardModal();
    if (dashModal) dashModal.showModal();
  }

  if (openDashBtn) openDashBtn.addEventListener('click', openDashboard);
  if (heroOpenQuizBtn) heroOpenQuizBtn.addEventListener('click', openDashboard);
  if (footerOpenQuizBtn) footerOpenQuizBtn.addEventListener('click', openDashboard);
  if (dashCloseBtn && dashModal) dashCloseBtn.addEventListener('click', () => dashModal.close());

  if (dashPrintCertBtn) {
    dashPrintCertBtn.addEventListener('click', () => {
      printAchievementCertificate();
    });
  }

  if (dashResetBtn) {
    dashResetBtn.addEventListener('click', () => {
      if (confirm('Are you sure you want to reset all your progress, quiz scores, and badges? This cannot be undone.')) {
        for (let i = 1; i <= HUB_CONFIG.totalUnits; i++) {
          localStorage.removeItem(`buddyHub_progress_${i}`);
        }
        updateGlobalStats();
        renderUnitsGrid();
        renderDashboardModal();
        alert('All progress has been reset.');
      }
    });
  }

  // Quick Hero Audio Lab Button
  const heroAudioBtn = document.getElementById('heroQuickAudioBtn');
  if (heroAudioBtn) {
    heroAudioBtn.addEventListener('click', () => {
      openUnitWrapper(1, 'audio');
    });
  }
}

function openUnitWrapper(unitId, initialTab = 'lesson') {
  const modal = document.getElementById('unitWrapperModal');
  if (!modal) return;

  STATE.currentUnit = unitId;
  const catalog = window.COURSEBOOK_CATALOG || { units: [] };
  const unit = catalog.units.find(u => u.unit === unitId);
  if (!unit) return;

  // Header meta updates
  const iconEl = document.getElementById('wrapperUnitIcon');
  const pillEl = document.getElementById('wrapperUnitPill');
  const titleEl = document.getElementById('wrapperUnitTitle');
  const fullLink = document.getElementById('wrapperFullscreenBtn');
  const statusEl = document.getElementById('wrapperCompletionStatus');

  if (iconEl) iconEl.textContent = unit.icon || '📚';
  if (pillEl) {
    pillEl.textContent = `Unit ${String(unit.unit).padStart(2, '0')}`;
    pillEl.style.backgroundColor = unit.accent_color || '#2b6cb0';
  }
  if (titleEl) titleEl.textContent = unit.title;
  if (fullLink) fullLink.href = unit.v2_url;

  const progress = getUnitProgress(unitId);
  if (statusEl) {
    statusEl.textContent = progress.completed ? '✅ Completed' : 'In Progress';
    statusEl.style.color = progress.completed ? '#22543d' : '#4a5568';
  }

  // Setup Iframe for Lesson Tab
  const iframe = document.getElementById('lessonIframe');
  const loader = document.getElementById('iframeLoader');
  if (iframe) {
    if (loader) loader.style.display = 'flex';
    iframe.src = unit.v2_url;
    iframe.onload = () => {
      if (loader) loader.style.display = 'none';
      saveUnitProgress(unitId, { visitedLesson: true });
    };
  }

  // Load Unit Data (Stories, Audios, Exercises)
  loadUnitData(unitId, (unitData) => {
    setupAudioLab(unit, unitData);
    setupWorksheetTab(unit, unitData);
    setupQuizTab(unit, unitData);
  });

  switchWrapperTab(initialTab);
  modal.showModal();
}

function switchWrapperTab(tabName) {
  STATE.activeTab = tabName;
  const tabs = document.querySelectorAll('.wrapper-tab');
  const panels = document.querySelectorAll('.wrapper-panel');

  tabs.forEach(t => {
    const isTarget = t.dataset.tab === tabName;
    t.classList.toggle('active', isTarget);
    t.setAttribute('aria-selected', String(isTarget));
  });

  panels.forEach(p => {
    const isTarget = p.id === `panel${tabName.charAt(0).toUpperCase() + tabName.slice(1)}`;
    p.classList.toggle('active', isTarget);
    p.hidden = !isTarget;
  });

  // Track progress flag
  if (STATE.currentUnit) {
    if (tabName === 'audio') saveUnitProgress(STATE.currentUnit, { listenedAudio: true });
    if (tabName === 'worksheet') saveUnitProgress(STATE.currentUnit, { viewedWorksheet: true });
  }
}

// ============================================================================
// 7. UNIT DATA LOADER (STORIES, EXERCISES, TRANSCRIPTS)
// ============================================================================
function loadUnitData(unitId, callback) {
  if (STATE.unitDataCache[unitId]) {
    callback(STATE.unitDataCache[unitId]);
    return;
  }

  // Check window object first (e.g. window.UNIT1_V2_DATA)
  const windowKey = `UNIT${unitId}_V2_DATA`;
  if (window[windowKey]) {
    STATE.unitDataCache[unitId] = window[windowKey];
    callback(window[windowKey]);
    return;
  }

  // Fetch JSON asynchronously
  const jsonPath = `unit${unitId}/data/unit${unitId}_v2_data.json`;
  fetch(jsonPath)
    .then(res => res.json())
    .then(data => {
      STATE.unitDataCache[unitId] = data;
      callback(data);
    })
    .catch(err => {
      console.warn(`Could not load unit data from ${jsonPath}, attempting fallback:`, err);
      // Fallback synthetic model
      const fallback = createFallbackUnitData(unitId);
      STATE.unitDataCache[unitId] = fallback;
      callback(fallback);
    });
}

function createFallbackUnitData(unitId) {
  const catalog = window.COURSEBOOK_CATALOG || { units: [] };
  const u = catalog.units.find(item => item.unit === unitId) || {};
  return {
    unit_id: unitId,
    unit_title: u.title || `Unit ${unitId}`,
    stories: [
      {
        id: `story_${unitId}_1`,
        title: `${u.title} — Main CLIL Reading`,
        student: 'Coursebook Narrator',
        narrative: `${u.tagline}. This interactive unit explores authentic cultural connections and grammar targets including ${u.grammar}.`,
        audio_file: `unit${unitId}/assets/audio_v2/stories/story1.mp3`,
      }
    ],
    content_true_false: [
      {
        fact: `Unit ${unitId} focuses on ${u.grammar}.`,
        answer: true,
        explanation: `Correct! ${u.title} systematically explores ${u.grammar}.`
      },
      {
        fact: `The theme of this unit is ${u.theme}.`,
        answer: true,
        explanation: `True! The core curricular theme is ${u.theme}.`
      }
    ]
  };
}

// ============================================================================
// 8. AUDIO LAB & UNIFIED AUDIO PLAYER CONTROLLER
// ============================================================================
let coreAudio = null;

function initAudioPlayerCore() {
  coreAudio = document.getElementById('coreAudioElement');
  const playBtn = document.getElementById('playerPlayPauseBtn');
  const skipBackBtn = document.getElementById('playerSkipBackBtn');
  const skipFwdBtn = document.getElementById('playerSkipForwardBtn');
  const speedSelect = document.getElementById('playerSpeedSelect');
  const volSlider = document.getElementById('playerVolumeSlider');
  const seekSlider = document.getElementById('playerProgressBar');
  const curTimeEl = document.getElementById('playerCurrentTime');
  const durTimeEl = document.getElementById('playerDuration');

  if (!coreAudio) return;

  if (playBtn) {
    playBtn.addEventListener('click', () => {
      if (coreAudio.paused) {
        coreAudio.play().then(() => {
          playBtn.textContent = '⏸️';
          playBtn.setAttribute('aria-label', 'Pause audio');
        }).catch(e => console.warn('Audio play request interrupted:', e));
      } else {
        coreAudio.pause();
        playBtn.textContent = '▶️';
        playBtn.setAttribute('aria-label', 'Play audio');
      }
    });
  }

  if (skipBackBtn) {
    skipBackBtn.addEventListener('click', () => {
      coreAudio.currentTime = Math.max(0, coreAudio.currentTime - 10);
    });
  }

  if (skipFwdBtn) {
    skipFwdBtn.addEventListener('click', () => {
      coreAudio.currentTime = Math.min(coreAudio.duration || 0, coreAudio.currentTime + 10);
    });
  }

  if (speedSelect) {
    speedSelect.addEventListener('change', () => {
      coreAudio.playbackRate = parseFloat(speedSelect.value);
    });
  }

  if (volSlider) {
    volSlider.addEventListener('input', () => {
      coreAudio.volume = parseFloat(volSlider.value);
    });
  }

  if (seekSlider) {
    seekSlider.addEventListener('input', () => {
      if (coreAudio.duration) {
        coreAudio.currentTime = (parseFloat(seekSlider.value) / 100) * coreAudio.duration;
      }
    });
  }

  coreAudio.addEventListener('timeupdate', () => {
    if (coreAudio.duration) {
      const pct = (coreAudio.currentTime / coreAudio.duration) * 100;
      if (seekSlider) seekSlider.value = pct;
      if (curTimeEl) curTimeEl.textContent = formatTime(coreAudio.currentTime);
      if (durTimeEl) durTimeEl.textContent = formatTime(coreAudio.duration);
    }
  });

  coreAudio.addEventListener('loadedmetadata', () => {
    if (durTimeEl) durTimeEl.textContent = formatTime(coreAudio.duration);
  });

  coreAudio.addEventListener('ended', () => {
    if (playBtn) playBtn.textContent = '▶️';
    if (STATE.currentUnit) saveUnitProgress(STATE.currentUnit, { listenedAudio: true });
  });

  // Text size toggle in transcript
  const sizeBtn = document.getElementById('toggleTranscriptSizeBtn');
  const transcriptBody = document.getElementById('transcriptBody');
  if (sizeBtn && transcriptBody) {
    sizeBtn.addEventListener('click', () => {
      transcriptBody.classList.toggle('large-text');
    });
  }
}

function formatTime(seconds) {
  if (isNaN(seconds)) return '0:00';
  const m = Math.floor(seconds / 60);
  const s = Math.floor(seconds % 60);
  return `${m}:${s < 10 ? '0' : ''}${s}`;
}

function pauseAudio() {
  if (coreAudio && !coreAudio.paused) {
    coreAudio.pause();
    const playBtn = document.getElementById('playerPlayPauseBtn');
    if (playBtn) playBtn.textContent = '▶️';
  }
}

function setupAudioLab(unit, unitData) {
  const playlistEl = document.getElementById('audioPlaylist');
  const transcriptTitle = document.getElementById('transcriptStoryTitle');
  const transcriptSpeaker = document.getElementById('transcriptSpeaker');
  const transcriptBody = document.getElementById('transcriptBody');
  if (!playlistEl) return;

  playlistEl.innerHTML = '';
  const stories = unitData.stories || [];

  if (stories.length === 0) {
    playlistEl.innerHTML = '<p style="color:#718096;font-size:0.84rem;">No story tracks found for this unit.</p>';
    return;
  }

  stories.forEach((st, idx) => {
    const item = document.createElement('button');
    item.className = `audio-track-item ${idx === 0 ? 'active' : ''}`;
    item.innerHTML = `
      <span class="track-icon">🎙️</span>
      <div class="track-details">
        <span class="track-name">${st.title}</span>
        <span class="track-speaker">${st.student || st.kicker || 'Lesson Audio'}</span>
      </div>
    `;

    item.addEventListener('click', () => {
      playlistEl.querySelectorAll('.audio-track-item').forEach(b => b.classList.remove('active'));
      item.classList.add('active');
      playTrack(unit, st);
    });

    playlistEl.appendChild(item);
  });

  // Play first track by default
  playTrack(unit, stories[0], false);
}

function playTrack(unit, story, autoPlay = true) {
  const trackTitle = document.getElementById('playerTrackTitle');
  const trackSub = document.getElementById('playerTrackSubtitle');
  const transcriptTitle = document.getElementById('transcriptStoryTitle');
  const transcriptSpeaker = document.getElementById('transcriptSpeaker');
  const transcriptBody = document.getElementById('transcriptBody');
  const playBtn = document.getElementById('playerPlayPauseBtn');

  if (trackTitle) trackTitle.textContent = story.title;
  if (trackSub) trackSub.textContent = `${unit.title} • ${story.student || 'Narrator'}`;
  if (transcriptTitle) transcriptTitle.textContent = story.title;
  if (transcriptSpeaker) transcriptSpeaker.textContent = `Speaker: ${story.student || 'Narrator'} (${story.voice_description || 'Natural Neural AI'})`;

  // Render transcript paragraphs
  if (transcriptBody) {
    const paragraphs = (story.narrative || story.summary || 'Transcript unavailable.').split('\n');
    transcriptBody.innerHTML = paragraphs.map(p => `<p style="margin-bottom: 12px;">${p}</p>`).join('');
  }

  // Construct audio file path
  let audioSrc = story.audio_file;
  if (!audioSrc && story.audio_key) {
    audioSrc = `unit${unit.unit}/assets/audio_v2/stories/${story.audio_key}.mp3`;
  }
  if (!audioSrc) {
    audioSrc = `unit${unit.unit}/assets/audio_v2/stories/story_${story.id || 'main'}.mp3`;
  }

  if (coreAudio && audioSrc) {
    coreAudio.src = audioSrc;
    if (autoPlay) {
      coreAudio.play().then(() => {
        if (playBtn) playBtn.textContent = '⏸️';
      }).catch(e => {
        console.warn('Audio auto-play note:', e);
        if (playBtn) playBtn.textContent = '▶️';
      });
    } else {
      if (playBtn) playBtn.textContent = '▶️';
    }
  }
}

// ============================================================================
// 9. WORKSHEET PACK CONTROLLER & INK-FRIENDLY PRINTING
// ============================================================================
function setupWorksheetTab(unit, unitData) {
  const unitTitleEl = document.getElementById('wsUnitTitle');
  const contentEl = document.getElementById('wsBodyContent');
  const printBtn = document.getElementById('printCurrentWorksheetBtn');
  const downloadBtn = document.getElementById('downloadPdfWorksheetBtn');

  if (unitTitleEl) {
    unitTitleEl.textContent = `Unit ${String(unit.unit).padStart(2, '0')}: ${unit.title}`;
  }

  updateWorksheetInputs();

  if (contentEl) {
    contentEl.innerHTML = '';

    // Exercise 1: Vocabulary & Collocations
    const collocations = unitData.collocations || [];
    const ex1 = document.createElement('div');
    ex1.className = 'ws-exercise-block';
    ex1.innerHTML = `
      <h4 class="ws-exercise-title">Part A: Curricular Key Vocabulary &amp; Word Partners</h4>
      <p style="font-size:0.86rem;color:#4a5568;margin-bottom:8px;">Match each target verb with its natural partner from the unit stories:</p>
      <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); gap: 8px;">
        ${(collocations.slice(0, 6)).map((c, i) => `
          <div class="ws-question-item">
            <strong>${i + 1}.</strong> ${c.verb} 
            <span class="ws-blank-line"></span> (${c.partner})
          </div>
        `).join('')}
      </div>
    `;
    contentEl.appendChild(ex1);

    // Exercise 2: Grammar & Comprehension
    const facts = unitData.content_true_false || [];
    const ex2 = document.createElement('div');
    ex2.className = 'ws-exercise-block';
    ex2.innerHTML = `
      <h4 class="ws-exercise-title">Part B: Reading Comprehension &amp; Fact Verification</h4>
      <p style="font-size:0.86rem;color:#4a5568;margin-bottom:8px;">Read the statements below. Circle <strong>T</strong> (True) or <strong>F</strong> (False):</p>
      <div>
        ${(facts.slice(0, 5)).map((f, i) => `
          <div class="ws-question-item" style="display: flex; justify-content: space-between; align-items: center; border-bottom: 1px dotted #e2e8f0; padding: 4px 0;">
            <span><strong>${i + 1}.</strong> ${f.fact}</span>
            <span style="font-weight: bold; letter-spacing: 4px;">[ T / F ]</span>
          </div>
        `).join('')}
      </div>
    `;
    contentEl.appendChild(ex2);

    // Exercise 3: Writing Portfolio Prompt
    const reportGuide = unitData.report_builder_guide || unitData.writing_workshop || {};
    const ex3 = document.createElement('div');
    ex3.className = 'ws-exercise-block';
    ex3.innerHTML = `
      <h4 class="ws-exercise-title">Part C: CEFR Writing Portfolio Workshop</h4>
      <p style="font-size:0.86rem;color:#4a5568;margin-bottom:8px;">
        ${reportGuide.title || 'Portfolio Writing Task'}: Write 3–4 sentences applying the target grammar (${unit.grammar}).
      </p>
      <div style="margin-top: 12px;">
        <div style="border-bottom: 1px solid #718096; height: 26px;"></div>
        <div style="border-bottom: 1px solid #718096; height: 26px;"></div>
        <div style="border-bottom: 1px solid #718096; height: 26px;"></div>
        <div style="border-bottom: 1px solid #718096; height: 26px;"></div>
      </div>
    `;
    contentEl.appendChild(ex3);
  }

  if (printBtn) {
    printBtn.onclick = () => {
      window.print();
      saveUnitProgress(unit.unit, { viewedWorksheet: true });
    };
  }

  if (downloadBtn) {
    downloadBtn.onclick = () => {
      window.print();
    };
  }
}

function updateWorksheetInputs() {
  const nameInput = document.getElementById('wsStudentName');
  const dateInput = document.getElementById('wsDate');
  const classInput = document.getElementById('wsClass');
  const printName = document.getElementById('wsPrintStudentName');
  const printDate = document.getElementById('wsPrintDate');
  const printClass = document.getElementById('wsPrintClass');

  const today = new Date().toLocaleDateString('el-GR');

  if (nameInput) {
    nameInput.value = STATE.studentName;
    nameInput.oninput = () => {
      if (printName) printName.textContent = nameInput.value || '____________________';
    };
  }
  if (dateInput) {
    dateInput.value = today;
    dateInput.oninput = () => {
      if (printDate) printDate.textContent = dateInput.value;
    };
  }
  if (classInput) {
    classInput.value = STATE.studentClass;
    classInput.oninput = () => {
      if (printClass) printClass.textContent = classInput.value;
    };
  }

  if (printName) printName.textContent = STATE.studentName || '____________________';
  if (printDate) printDate.textContent = today;
  if (printClass) printClass.textContent = STATE.studentClass || '6th Grade';
}

// ============================================================================
// 10. INTERACTIVE QUIZ ENGINE & CEFR CAN-DO BADGES
// ============================================================================
function setupQuizTab(unit, unitData) {
  const activeScreen = document.getElementById('quizActiveScreen');
  const resultsScreen = document.getElementById('quizResultsScreen');
  if (!activeScreen || !resultsScreen) return;

  activeScreen.hidden = false;
  resultsScreen.hidden = true;

  // Build Quiz Questions pool
  const questions = buildUnitQuestions(unit, unitData);
  STATE.quizState = {
    unit: unit,
    questions: questions,
    currentIndex: 0,
    userAnswers: [],
    score: 0,
    startTime: Date.now(),
    timerInterval: null,
  };

  renderCurrentQuestion();
  startQuizTimer();
}

function buildUnitQuestions(unit, unitData) {
  const pool = [];

  // 1. True/False Comprehension Questions
  const tf = unitData.content_true_false || [];
  tf.forEach(q => {
    pool.push({
      type: 'Fact Comprehension',
      prompt: q.fact,
      options: ['True', 'False'],
      correctAnswer: q.answer ? 'True' : 'False',
      explanation: q.explanation || `The correct answer is ${q.answer ? 'True' : 'False'}.`
    });
  });

  // 2. Definition Challenge Questions
  const defs = unitData.definition_challenge;
  if (defs) {
    const items = [...(defs.group_a || []), ...(defs.group_b || []), ...(defs.items || [])];
    items.slice(0, 4).forEach(d => {
      if (d.prompt && d.options) {
        // Multiple choice format
        pool.push({
          type: 'Vocabulary Definition',
          prompt: d.prompt,
          options: d.options,
          correctAnswer: d.answer,
          explanation: `Definition: "${d.answer}" is the precise lexical term.`
        });
      } else if (d.word && d.clue) {
        // Clue matching
        pool.push({
          type: 'Vocabulary Clue',
          prompt: `Which word matches the clue: "${d.clue}"?`,
          options: shuffleArray([d.word, 'PUPIL', 'LESSON', 'JOURNEY']),
          correctAnswer: d.word,
          explanation: `"${d.word}" matches the curricular definition.`
        });
      }
    });
  }

  // Fallback questions if pool is short
  if (pool.length < 5) {
    pool.push(
      {
        type: 'Curricular Grammar',
        prompt: `Which grammar tense is prominently practiced in Unit ${unit.unit}?`,
        options: shuffleArray([unit.grammar, 'Future Perfect', 'Past Continuous Passive', 'Gerunds']),
        correctAnswer: unit.grammar,
        explanation: `Unit ${unit.unit} focuses primarily on ${unit.grammar}.`
      },
      {
        type: 'Theme Alignment',
        prompt: `What is the core intercultural / cross-curricular theme of ${unit.title}?`,
        options: shuffleArray([unit.theme, 'Advanced Astrophysics', 'Roman Law', 'Ocean Navigation']),
        correctAnswer: unit.theme,
        explanation: `${unit.title} is centered on ${unit.theme}.`
      }
    );
  }

  return pool.slice(0, 8); // Top 8 questions
}

function shuffleArray(arr) {
  const a = [...new Set(arr)];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function startQuizTimer() {
  const timerVal = document.getElementById('quizTimerVal');
  if (STATE.quizState.timerInterval) clearInterval(STATE.quizState.timerInterval);

  STATE.quizState.timerInterval = setInterval(() => {
    if (!STATE.quizState) return;
    const elapsed = Math.floor((Date.now() - STATE.quizState.startTime) / 1000);
    const m = Math.floor(elapsed / 60);
    const s = elapsed % 60;
    if (timerVal) timerVal.textContent = `${m < 10 ? '0' : ''}${m}:${s < 10 ? '0' : ''}${s}`;
  }, 1000);
}

function renderCurrentQuestion() {
  const qState = STATE.quizState;
  if (!qState) return;

  const currentQ = qState.questions[qState.currentIndex];
  const curNumEl = document.getElementById('quizCurrentQ');
  const totNumEl = document.getElementById('quizTotalQ');
  const liveScoreEl = document.getElementById('quizLiveScore');
  const qTypeEl = document.getElementById('quizQType');
  const promptEl = document.getElementById('quizPrompt');
  const optionsListEl = document.getElementById('quizOptionsList');
  const feedbackBoxEl = document.getElementById('quizFeedbackBox');
  const feedbackTextEl = document.getElementById('quizFeedbackText');
  const nextBtn = document.getElementById('quizNextBtn');

  if (curNumEl) curNumEl.textContent = qState.currentIndex + 1;
  if (totNumEl) totNumEl.textContent = qState.questions.length;
  if (liveScoreEl) {
    const pct = qState.currentIndex > 0 ? Math.round((qState.score / qState.currentIndex) * 100) : 0;
    liveScoreEl.textContent = `${pct}%`;
  }

  if (qTypeEl) qTypeEl.textContent = currentQ.type;
  if (promptEl) promptEl.textContent = currentQ.prompt;
  if (feedbackBoxEl) feedbackBoxEl.hidden = true;
  if (nextBtn) {
    nextBtn.disabled = true;
    nextBtn.textContent = (qState.currentIndex === qState.questions.length - 1) ? 'Finish Quiz 🏁' : 'Next Question ❯';
  }

  if (optionsListEl) {
    optionsListEl.innerHTML = '';
    currentQ.options.forEach(opt => {
      const btn = document.createElement('button');
      btn.className = 'quiz-option-btn';
      btn.textContent = opt;

      btn.addEventListener('click', () => {
        handleOptionSelected(opt, btn, currentQ);
      });

      optionsListEl.appendChild(btn);
    });
  }

  if (nextBtn) {
    nextBtn.onclick = () => {
      qState.currentIndex++;
      if (qState.currentIndex < qState.questions.length) {
        renderCurrentQuestion();
      } else {
        finishQuiz();
      }
    };
  }
}

function handleOptionSelected(selected, btnEl, question) {
  const qState = STATE.quizState;
  const isCorrect = (selected === question.correctAnswer);
  const optionsListEl = document.getElementById('quizOptionsList');
  const feedbackBoxEl = document.getElementById('quizFeedbackBox');
  const feedbackTextEl = document.getElementById('quizFeedbackText');
  const feedbackIconEl = document.getElementById('quizFeedbackIcon');
  const nextBtn = document.getElementById('quizNextBtn');

  // Disable options once selected
  if (optionsListEl) {
    optionsListEl.querySelectorAll('.quiz-option-btn').forEach(b => {
      b.disabled = true;
      if (b.textContent === question.correctAnswer) {
        b.classList.add('selected-correct');
      }
    });
  }

  if (!isCorrect) {
    btnEl.classList.add('selected-wrong');
    playTone(260, 0.2); // Low buzz
  } else {
    qState.score++;
    playTone(523.25, 0.15); // Pleasant high C chime
  }

  qState.userAnswers.push({
    question: question.prompt,
    selected: selected,
    correct: question.correctAnswer,
    isCorrect: isCorrect,
    explanation: question.explanation
  });

  // Show Feedback
  if (feedbackBoxEl && feedbackTextEl) {
    feedbackBoxEl.hidden = false;
    feedbackIconEl.textContent = isCorrect ? '🎉 Correct!' : '💡 Explanation:';
    feedbackTextEl.textContent = question.explanation;
  }

  if (nextBtn) nextBtn.disabled = false;
}

function finishQuiz() {
  const qState = STATE.quizState;
  if (!qState) return;

  clearInterval(qState.timerInterval);
  const activeScreen = document.getElementById('quizActiveScreen');
  const resultsScreen = document.getElementById('quizResultsScreen');
  if (activeScreen) activeScreen.hidden = true;
  if (resultsScreen) resultsScreen.hidden = false;

  const finalPct = Math.round((qState.score / qState.questions.length) * 100);
  const passed = (finalPct >= HUB_CONFIG.passingScore);

  // Play celebration sound if passed
  if (passed) {
    playCelebrationFanfare();
  }

  // Save progress
  saveUnitProgress(qState.unit.unit, {
    quizScore: finalPct,
    quizCompleted: true,
  });

  // Results screen UI
  const scorePercentEl = document.getElementById('resultsScorePercent');
  const correctCountEl = document.getElementById('resultsCorrectCount');
  const canDoStatusEl = document.getElementById('resultsCanDoStatus');
  const badgeIconEl = document.getElementById('resultsBadgeIcon');
  const titleEl = document.getElementById('resultsTitle');
  const subEl = document.getElementById('resultsSubtitle');
  const retakeBtn = document.getElementById('quizRetakeBtn');
  const reviewBtn = document.getElementById('quizReviewBtn');
  const doneBtn = document.getElementById('quizDoneCloseBtn');

  if (scorePercentEl) scorePercentEl.textContent = `${finalPct}%`;
  if (correctCountEl) correctCountEl.textContent = `${qState.score} / ${qState.questions.length}`;
  if (badgeIconEl) badgeIconEl.textContent = qState.unit.icon || '🎖️';

  if (canDoStatusEl) {
    if (passed) {
      canDoStatusEl.textContent = `Awarded: ${qState.unit.can_do_badge} 🎖️`;
      canDoStatusEl.className = 'status-passed';
    } else {
      canDoStatusEl.textContent = 'Needs Practice (Score < 80%)';
      canDoStatusEl.className = 'status-pending';
    }
  }

  if (titleEl) titleEl.textContent = passed ? 'Congratulations! 🏆' : 'Good Effort! 📚';
  if (subEl) {
    subEl.textContent = passed 
      ? `You mastered Unit ${qState.unit.unit} and earned your CEFR Can-Do Passport badge!`
      : `You scored ${finalPct}%. Review your answers or retake the quiz to earn your badge.`;
  }

  if (retakeBtn) {
    retakeBtn.onclick = () => {
      setupQuizTab(qState.unit, STATE.unitDataCache[qState.unit.unit]);
    };
  }

  if (reviewBtn) {
    reviewBtn.onclick = () => {
      const tray = document.getElementById('quizReviewTray');
      const list = document.getElementById('reviewQuestionsList');
      if (tray && list) {
        tray.hidden = false;
        list.innerHTML = qState.userAnswers.map((a, i) => `
          <div class="review-q-item" style="border-left: 4px solid ${a.isCorrect ? '#38a169' : '#e53e3e'};">
            <strong>${i + 1}. ${a.question}</strong><br>
            <span>Your Answer: <strong style="color: ${a.isCorrect ? '#22543d' : '#e53e3e'};">${a.selected}</strong></span> | 
            <span>Correct: <strong>${a.correct}</strong></span>
            <p style="font-size:0.84rem;color:#4a5568;margin-top:4px;">${a.explanation}</p>
          </div>
        `).join('');
      }
    };
  }

  if (doneBtn) {
    doneBtn.onclick = () => {
      document.getElementById('unitWrapperModal').close();
      renderUnitsGrid();
    };
  }
}

// Subtle Audio Synthesizer (Web Audio API)
function playTone(freq, duration) {
  try {
    const AudioContext = window.AudioContext || window.webkitAudioContext;
    if (!AudioContext) return;
    const ctx = new AudioContext();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = 'sine';
    osc.frequency.value = freq;
    gain.gain.setValueAtTime(0.08, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + duration);
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start();
    osc.stop(ctx.currentTime + duration);
  } catch (err) {
    // Ignore audio autoplay restrictions
  }
}

function playCelebrationFanfare() {
  setTimeout(() => playTone(523.25, 0.15), 0);
  setTimeout(() => playTone(659.25, 0.15), 150);
  setTimeout(() => playTone(783.99, 0.3), 300);
}

// ============================================================================
// 11. QUIZ DASHBOARD & CERTIFICATE PRINTER
// ============================================================================
function renderDashboardModal() {
  const badgesGrid = document.getElementById('dashBadgesGrid');
  const tbody = document.getElementById('dashScoresTbody');
  if (!badgesGrid || !tbody) return;

  const catalog = window.COURSEBOOK_CATALOG || { units: [] };
  const allUnits = catalog.units || [];

  badgesGrid.innerHTML = '';
  tbody.innerHTML = '';

  allUnits.forEach(u => {
    const progress = getUnitProgress(u.unit);
    const isCompleted = progress.completed;

    // Badges Card
    const badgeCard = document.createElement('div');
    badgeCard.className = `badge-card ${isCompleted ? 'unlocked' : 'locked'}`;
    badgeCard.innerHTML = `
      <div class="badge-card-icon">${u.icon || '🎖️'}</div>
      <div class="badge-card-title">${u.can_do_badge || `Unit ${u.unit} Badge`}</div>
      <div class="badge-card-unit">Unit ${u.unit}: ${u.title}</div>
      <div style="font-size:0.75rem;margin-top:6px;font-weight:bold;color:${isCompleted ? '#22543d' : '#718096'};">
        ${isCompleted ? 'Unlocked ✅' : 'Locked 🔒'}
      </div>
    `;
    badgesGrid.appendChild(badgeCard);

    // Score Table Row
    const row = document.createElement('tr');
    row.innerHTML = `
      <td><strong>Unit ${u.unit}</strong></td>
      <td>${u.icon || ''} ${u.title}</td>
      <td>
        <span class="meta-tag ${isCompleted ? 'grammar-tag' : ''}">
          ${isCompleted ? '✅ Passed' : (progress.quizCompleted ? 'Needs Practice' : 'Not Attempted')}
        </span>
      </td>
      <td><strong>${progress.quizCompleted ? `${progress.quizScore}%` : '—'}</strong></td>
      <td>${u.can_do_badge || '—'}</td>
      <td>
        <button class="btn btn-outline" style="padding: 4px 10px; font-size: 0.78rem;" onclick="openUnitWrapper(${u.unit}, 'quiz'); document.getElementById('quizDashboardModal').close();">
          ${progress.quizCompleted ? 'Retake Quiz' : 'Take Quiz'}
        </button>
      </td>
    `;
    tbody.appendChild(row);
  });
}

function printAchievementCertificate() {
  const certContainer = document.getElementById('printCertificateContainer');
  const nameEl = document.getElementById('certStudentName');
  const badgesRow = document.getElementById('certBadgesRow');
  if (!certContainer) return;

  if (nameEl) nameEl.textContent = STATE.studentName;

  if (badgesRow) {
    const catalog = window.COURSEBOOK_CATALOG || { units: [] };
    badgesRow.innerHTML = (catalog.units || []).map(u => {
      const p = getUnitProgress(u.unit);
      return `
        <span style="font-size: 1.5rem; margin: 0 4px; ${p.completed ? '' : 'filter: grayscale(1); opacity: 0.3;'}" title="${u.can_do_badge}">
          ${u.icon}
        </span>
      `;
    }).join('');
  }

  window.print();
}
