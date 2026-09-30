const fs = require('fs');
const path = require('path');
const vm = require('vm');

let passed = 0;
let failed = 0;

function assert(condition, message) {
  if (condition) {
    passed += 1;
    console.log(`[PASS] ${message}`);
  } else {
    failed += 1;
    console.error(`[FAIL] ${message}`);
  }
}

const rootDir = __dirname;
function r(f) { return path.join(rootDir, f); }

function exists(file) {
  const p = r(file);
  return fs.existsSync(p) && fs.statSync(p).size > 0;
}

function readJson(file) {
  return JSON.parse(fs.readFileSync(r(file), 'utf8'));
}

function loadTwin(file, globalName) {
  const source = fs.readFileSync(r(file), 'utf8');
  const sandbox = { window: {} };
  vm.runInNewContext(source, sandbox);
  return sandbox.window[globalName];
}

const vocab = readJson('data/vocabulary_data.json');
const v2 = readJson('data/unit8_v2_data.json');
const workbook = readJson('data/unit8_workbook_data.json');

const requiredFiles = [
  'index.html', 'app.js', 'style.css', 'v2.html', 'app_v2.js', 'style_v2.css', 'verify_offline.js',
  'data/vocabulary_data.json', 'data/vocabulary_data.js', 'data/unit8_v2_data.json', 'data/unit8_v2_data.js',
  'data/unit8_workbook_data.json', 'data/unit8_workbook_data.js',
  'assets/images_v2/folk_instruments.svg', 'assets/images_v2/school_band.svg',
  'assets/images_v2/piggy_bank.svg', 'assets/images_v2/problem_page.svg',
  'assets/audio_v2/stories/museum_folk_instruments_full_story.txt', 'assets/audio_v2/stories/school_rock_band_full_story.txt',
  'assets/audio_v2/stories/pocket_money_budget_full_story.txt', 'assets/audio_v2/stories/fairytale_problem_page_full_story.txt',
  'assets/audio_v2/grammar/school_concert_rehearsal.txt'
];
requiredFiles.forEach(file => assert(exists(file), `Required file exists: ${file}`));

assert(v2.unit_id === 8 && v2.unit_title === 'Blow Your Own Trumpet', 'Unit identity is Blow Your Own Trumpet');
assert(vocab.length === 66, 'Vocabulary dataset contains 66 official entries matching Appendix VI');

vocab.forEach((item, index) => {
  assert(Boolean(item.word), `Vocabulary ${index + 1} has word: ${item.word}`);
});

assert(vocab.every(item => item.definition_en && item.example && item.ipa && item.meaning_gr), 'Every vocabulary item has IPA, Greek meaning, definition, and example');

// Data Twin exact match verification
const twinVocab = loadTwin('data/vocabulary_data.js', 'VOCABULARY_DATA');
assert(JSON.stringify(vocab) === JSON.stringify(twinVocab), 'vocabulary_data.js twin matches vocabulary_data.json');

const twinV2 = loadTwin('data/unit8_v2_data.js', 'UNIT8_V2_DATA');
assert(JSON.stringify(v2) === JSON.stringify(twinV2), 'unit8_v2_data.js twin matches unit8_v2_data.json');

const twinWb = loadTwin('data/unit8_workbook_data.js', 'UNIT8_WORKBOOK_DATA');
assert(JSON.stringify(workbook) === JSON.stringify(twinWb), 'unit8_workbook_data.js twin matches unit8_workbook_data.json');

// Check stories & word ownership
const vocabById = new Map(vocab.map(item => [String(item.id), item]));
const vocabByWord = new Map(vocab.map(item => [item.word.toLowerCase(), item]));

for (const story of v2.stories) {
  for (const id of story.vocabulary_ids) {
    const item = vocabById.get(String(id));
    assert(Boolean(item), `${story.id} vocabulary id ${id} resolves`);
    if (item) {
      let pattern;
      if (item.word === 'look forward to') {
        pattern = /\blook\w*\s+forward\s+to\b/i;
      } else if (item.word === 'pocket money') {
        pattern = /\bpocket\s+money\b/i;
      } else if (item.word === 'folk music') {
        pattern = /\bfolk\s+music\b/i;
      } else if (item.word === 'fairy tale') {
        pattern = /\bfairy\s+tale\b/i;
      } else {
        const word = item.word.toLowerCase();
        pattern = new RegExp(`\\b${word}\\w*\\b`, 'i');
      }
      assert(pattern.test(story.narrative), `${story.id} narrative contains owned word ${item.word}`);
    }
  }
  for (const landmark of story.landmarks) {
    if (landmark.word_key || landmark.word_id) {
      const item = landmark.word_key ? vocabByWord.get(landmark.word_key.toLowerCase()) : vocabById.get(String(landmark.word_id));
      assert(Boolean(item), `${story.id} landmark ${landmark.name} resolves to vocabulary`);
      if (item) assert(story.vocabulary_ids.map(String).includes(String(item.id)), `${story.id} owns landmark word ${item.word}`);
    }
  }
}

// Workbook structure validation
assert(Array.isArray(workbook.activities) && workbook.activities.length >= 10, 'Workbook contains activities');

console.log(`\nUnit 8 Regression Suite: ${passed} passed, ${failed} failed.`);
if (failed > 0) process.exit(1);
