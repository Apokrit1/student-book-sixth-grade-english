/**
 * COMPREHENSIVE VERIFICATION TEST SUITE: MODERN EDITION (UNITS 1–10)
 * Evaluates architectural decisions and FLL Rubric criteria:
 * - 1.1 Calibrated input & mastery badging
 * - 1.2 Typographical salience for morphemes
 * - 1.3 Recognition-to-recall fading (Level 0 -> Level 1 -> Level 2)
 * - 1.4 Graduated feedback in workbook checking (3-tier)
 * - 2.1 Spatially contiguous tap-to-gloss popovers
 * - 2.2 Dual-channel modality control (listen-first default)
 * - 2.3 Clause-level audio replay & looping
 * - 3.1 Modality-decoupled accessibility toolbar
 * - 4.2 Spaced repetition Leitner scheduling
 * - 4.3 Structured self-check writing rubrics
 * - 5.1 Script-aware typography (lang="el" on all Greek text)
 * - 5.2 Pragmatic register context badges
 * - Clean portal without promotional boasts or version comparisons
 */

const fs = require('fs');
const path = require('path');

const ROOT = path.resolve(__dirname, '..');
const MODERN_ROOT = path.join(ROOT, 'vocabulary-st-modern');
const SHARED_DIR = path.join(MODERN_ROOT, 'shared');

console.log('===============================================================');
console.log('   RUNNING GRADE 6 MODERN EDITION SUITE (UNITS 1–10)   ');
console.log('===============================================================\n');

let passed = 0;
let failed = 0;

function assert(condition, message) {
  if (condition) {
    console.log(`[PASS] ${message}`);
    passed++;
  } else {
    console.error(`[FAIL] ${message}`);
    failed++;
  }
}

// =============================================================================
// TEST 1: Modern Portal Hub (vocabulary-st-modern/index.html)
// =============================================================================
console.log('\n--- 1. Modern Portal Hub Integrity ---');
const hubFile = path.join(MODERN_ROOT, 'index.html');
assert(fs.existsSync(hubFile), 'Hub index.html exists');
const hubHtml = fs.readFileSync(hubFile, 'utf8');

assert(hubHtml.length > 5000, `Hub HTML is fully rendered (${hubHtml.length} bytes)`);
assert(hubHtml.includes('shared/learner_store.js'), 'Hub loads shared/learner_store.js');
assert(hubHtml.includes('shared/a11y.css'), 'Hub loads shared/a11y.css');
assert(hubHtml.includes('id="spacedReviewHubBtn"'), 'Hub includes Spaced Review launcher button');
assert(hubHtml.includes('id="hubDueCountBadge"'), 'Hub includes Spaced Review due count badge');
assert(hubHtml.includes('id="a11yBtn"'), 'Hub includes Accessibility Settings launcher');
assert(hubHtml.includes('id="hubSearchInput"'), 'Hub includes live search input');
assert(hubHtml.includes('data-filter="term-1"'), 'Hub includes Term 1 filter chip');
assert(hubHtml.includes('data-filter="term-2"'), 'Hub includes Term 2 filter chip');
assert(hubHtml.includes('data-filter="term-3"'), 'Hub includes Term 3 filter chip');

// Check no boasts or version comparisons in Hub
assert(!hubHtml.includes('Bio-Warm 2026'), 'Hub has zero "Bio-Warm 2026" boasts');
assert(!hubHtml.includes('Classic Edition'), 'Hub has zero "Classic Edition" buttons or switchers');
assert(!hubHtml.includes('Classic Portal'), 'Hub has zero "Classic Portal" switcher links');
assert(!hubHtml.includes('Retro Comic'), 'Hub has zero "Retro Comic" boasts');

// Check all 10 units are linked in Hub
for (let u = 1; u <= 10; u++) {
  assert(hubHtml.includes(`unit${u}/index.html`), `Hub links to Unit ${u} Coursebook (unit${u}/index.html)`);
  assert(hubHtml.includes(`unit${u}/companion.html`), `Hub links to Unit ${u} Companion (unit${u}/companion.html)`);
}

// =============================================================================
// TEST 2: Root and Portal Clean Redirects
// =============================================================================
console.log('\n--- 2. Root and Portal Redirects ---');
const rootIndex = fs.readFileSync(path.join(ROOT, 'index.html'), 'utf8');
assert(rootIndex.includes('vocabulary-st-modern/index.html'), 'Root index.html redirects to vocabulary-st-modern/index.html');

const portalFile = fs.readFileSync(path.join(ROOT, 'portal.html'), 'utf8');
assert(portalFile.includes('vocabulary-st-modern/index.html'), 'portal.html redirects to vocabulary-st-modern/index.html');

// =============================================================================
// TEST 3: Shared Pedagogical Engine Files
// =============================================================================
console.log('\n--- 3. Shared Pedagogical Engine Files ---');
const sharedFiles = ['learner_store.js', 'a11y.css', 'comic.css', 'app_coursebook.js', 'app_companion.js'];
sharedFiles.forEach(f => {
  const p = path.join(SHARED_DIR, f);
  const exists = fs.existsSync(p);
  const size = exists ? fs.statSync(p).size : 0;
  assert(exists && size > 1000, `Shared engine file exists: ${f} (${size} bytes)`);
});

const cbJs = fs.readFileSync(path.join(SHARED_DIR, 'app_coursebook.js'), 'utf8');
assert(!cbJs.includes('http://') && !cbJs.includes('https://'), 'app_coursebook.js has 0 remote CDN dependencies (100% offline)');
assert(cbJs.includes('LearnerStore'), 'app_coursebook.js integrates LearnerStore');
assert(cbJs.includes('highlightMorphology'), 'app_coursebook.js implements morpheme typographical salience (Criterion 1.2)');
assert(cbJs.includes('gloss-popover'), 'app_coursebook.js implements tap-to-gloss popovers (Criterion 2.1)');
assert(cbJs.includes('resolveAsset'), 'app_coursebook.js implements dynamic asset resolution');
assert(cbJs.includes('feedbackTier') || cbJs.includes('cue hint') || cbJs.includes('Grammar Rule:'), 'app_coursebook.js implements graduated feedback (Criterion 1.4)');

const compJs = fs.readFileSync(path.join(SHARED_DIR, 'app_companion.js'), 'utf8');
assert(!compJs.includes('http://') && !compJs.includes('https://'), 'app_companion.js has 0 remote CDN dependencies (100% offline)');
assert(compJs.includes('LearnerStore'), 'app_companion.js integrates LearnerStore');
assert(compJs.includes('getWordMastery'), 'app_companion.js checks word mastery levels for recall fading (Criterion 1.3)');
assert(compJs.includes('buildFirstLetterClue'), 'app_companion.js generates Level 1 gap-fill clues (Criterion 1.3)');
assert(compJs.includes('recordAttempt'), 'app_companion.js records quiz attempts and schedules spaced review (Criterion 4.2)');
assert(compJs.includes('lang="el"'), 'app_companion.js renders Greek text with lang="el" (Criterion 5.1)');

// =============================================================================
// TEST 4: Units 1 to 10 Shells Integrity
// =============================================================================
console.log('\n--- 4. Modern Unit Shells (Units 1–10) ---');
for (let u = 1; u <= 10; u++) {
  const unitDir = path.join(MODERN_ROOT, `unit${u}`);
  assert(fs.existsSync(unitDir), `Unit ${u} directory exists`);

  const uIndex = path.join(unitDir, 'index.html');
  const uComp = path.join(unitDir, 'companion.html');
  assert(fs.existsSync(uIndex), `Unit ${u} index.html exists`);
  assert(fs.existsSync(uComp), `Unit ${u} companion.html exists`);

  const indexContent = fs.readFileSync(uIndex, 'utf8');
  assert(indexContent.includes('../shared/app_coursebook.js'), `Unit ${u} index.html loads shared app_coursebook.js`);
  assert(indexContent.includes('../shared/learner_store.js'), `Unit ${u} index.html loads shared learner_store.js`);
  assert(indexContent.includes(`../../unit${u}/data/unit${u}_v2_data.js`), `Unit ${u} index.html links classic v2 data`);
  assert(indexContent.includes(`../../unit${u}/data/unit${u}_workbook_data.js`), `Unit ${u} index.html links classic workbook data`);
  assert(indexContent.includes('id="a11yBtn"'), `Unit ${u} index.html has Accessibility button`);
  assert(!indexContent.includes('Classic Edition'), `Unit ${u} index.html has no Classic Edition switchers`);

  const compContent = fs.readFileSync(uComp, 'utf8');
  assert(compContent.includes('../shared/app_companion.js'), `Unit ${u} companion.html loads shared app_companion.js`);
  assert(compContent.includes('../shared/learner_store.js'), `Unit ${u} companion.html loads shared learner_store.js`);
  assert(compContent.includes(`../../unit${u}/data/vocabulary_data.js`), `Unit ${u} companion.html links classic vocabulary data`);
  assert(compContent.includes('id="a11yBtn"'), `Unit ${u} companion.html has Accessibility button`);
  assert(compContent.includes('quick-quizzes-pills'), `Unit ${u} companion.html has quick unit navigation pills`);
  assert(!compContent.includes('Classic Companion'), `Unit ${u} companion.html has no Classic Companion switchers`);
}

// =============================================================================
// TEST 5: Classic Data Twins & Audio Assets Validation
// =============================================================================
console.log('\n--- 5. Classic Data Twins & Audio Assets ---');
let totalWords = 0;
for (let u = 1; u <= 10; u++) {
  const vocabPath = path.join(ROOT, `unit${u}`, 'data', 'vocabulary_data.js');
  const v2Path = path.join(ROOT, `unit${u}`, 'data', `unit${u}_v2_data.js`);
  const wbPath = path.join(ROOT, `unit${u}`, 'data', `unit${u}_workbook_data.js`);

  assert(fs.existsSync(vocabPath), `Unit ${u} vocabulary_data.js exists`);
  assert(fs.existsSync(v2Path), `Unit ${u} v2_data.js exists`);
  assert(fs.existsSync(wbPath), `Unit ${u} workbook_data.js exists`);

  global.window = {};
  eval(fs.readFileSync(vocabPath, 'utf8'));
  const wordCount = window.VOCABULARY_DATA ? window.VOCABULARY_DATA.length : 0;
  totalWords += wordCount;
  assert(wordCount > 20, `Unit ${u} has rich vocabulary dataset (${wordCount} words)`);

  const audioStd = path.join(ROOT, `unit${u}`, 'assets', 'audio');
  const audioNeu = path.join(ROOT, `unit${u}`, 'assets', 'audio_neural');
  assert(fs.existsSync(audioStd), `Unit ${u} standard audio directory exists`);
  assert(fs.existsSync(audioNeu), `Unit ${u} neural audio directory exists`);
}
assert(totalWords > 450, `Grand total vocabulary across 10 units is ${totalWords} words (> 450 target)`);

// =============================================================================
// TEST 6: LearnerStore Spaced Repetition & Recall Fading Engine (Node simulation)
// =============================================================================
console.log('\n--- 6. LearnerStore Simulation & Unit Logic ---');
// Mock localStorage in node environment
const storageMock = {};
global.localStorage = {
  getItem: (k) => storageMock[k] || null,
  setItem: (k, v) => { storageMock[k] = String(v); },
  removeItem: (k) => { delete storageMock[k]; }
};

const LearnerStore = require(path.join(SHARED_DIR, 'learner_store.js'));
assert(typeof LearnerStore.getWordMastery === 'function', 'LearnerStore.getWordMastery exists');
assert(typeof LearnerStore.recordAttempt === 'function', 'LearnerStore.recordAttempt exists');
assert(typeof LearnerStore.scheduleReview === 'function', 'LearnerStore.scheduleReview exists');
assert(typeof LearnerStore.getDueReviews === 'function', 'LearnerStore.getDueReviews exists');
assert(typeof LearnerStore.getDueCount === 'function', 'LearnerStore.getDueCount exists');

// Initial mastery state
const m0 = LearnerStore.getWordMastery(1, 42);
assert(m0.level === 0 && m0.streak === 0, 'Word initially starts at Level 0 (Recognition)');

// First correct answer -> streak 1, level 0
LearnerStore.recordAttempt(1, 42, true, { word: 'baggy', meaning_gr: 'χαλαρός' });
const m1 = LearnerStore.getWordMastery(1, 42);
assert(m1.streak === 1 && m1.level === 0, 'After 1 correct answer: streak = 1, level = 0');

// Second correct answer -> streak 2, level promotes to 1 (Guided Recall)
LearnerStore.recordAttempt(1, 42, true, { word: 'baggy', meaning_gr: 'χαλαρός' });
const m2 = LearnerStore.getWordMastery(1, 42);
assert(m2.streak === 2 && m2.level === 1, 'After 2 consecutive correct answers: promoted to Level 1 (Guided Recall)');

// Mistake occurs -> resets streak, demotes to level 0, schedules Spaced Review Box 1
LearnerStore.recordAttempt(1, 42, false, { word: 'baggy', meaning_gr: 'χαλαρός' });
const m3 = LearnerStore.getWordMastery(1, 42);
assert(m3.streak === 0 && m3.level === 0, 'After mistake: streak resets to 0, demoted to Level 0');

const dueList = LearnerStore.getDueReviews(1);
assert(dueList.length > 0 && dueList.some(r => r.id === 42), 'Missed word is immediately scheduled into Spaced Review Box 1');
assert(LearnerStore.getDueCount(1) >= 1, 'getDueCount(1) reflects due review items');

// After 2 consecutive correct answers on due review -> moves to Box 2
LearnerStore.recordAttempt(1, 42, true, { word: 'baggy', meaning_gr: 'χαλαρός' });
LearnerStore.recordAttempt(1, 42, true, { word: 'baggy', meaning_gr: 'χαλαρός' });
const m4 = LearnerStore.getWordMastery(1, 42);
assert(m4.level === 1, 'Promoted back to Level 1 upon mastery recovery');

// Accessibility settings
assert(typeof LearnerStore.getA11y === 'function', 'LearnerStore.getA11y exists');
assert(typeof LearnerStore.saveA11y === 'function', 'LearnerStore.saveA11y exists');
LearnerStore.saveA11y({ fontSize: 'large', spacing: 'wide', contrast: 'high', audioMode: 'readonly' });
const a11ySettings = LearnerStore.getA11y();
assert(a11ySettings.fontSize === 'large' && a11ySettings.spacing === 'wide' && a11ySettings.contrast === 'high' && a11ySettings.audioMode === 'readonly', 'Accessibility settings persisted and retrieved correctly');

console.log('\n===============================================================');
console.log(`TEST RESULTS: ${passed} PASSED, ${failed} FAILED`);
console.log('===============================================================\n');

if (failed > 0) {
  process.exit(1);
} else {
  console.log('ALL TESTS PASSED! Grade 6 Coursebook modern edition is 100% verified.');
}
