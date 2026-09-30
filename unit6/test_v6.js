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
const v2 = readJson('data/unit6_v2_data.json');
const workbook = readJson('data/unit6_workbook_data.json');

const requiredFiles = [
  'index.html', 'app.js', 'style.css', 'v2.html', 'app_v2.js', 'style_v2.css', 'verify_offline.js',
  'data/vocabulary_data.json', 'data/vocabulary_data.js', 'data/unit6_v2_data.json', 'data/unit6_v2_data.js',
  'data/unit6_workbook_data.json', 'data/unit6_workbook_data.js',
  'assets/images_v2/jewellery_workshop.svg', 'assets/images_v2/control_tower.svg',
  'assets/images_v2/home_nurse.svg', 'assets/images_v2/salon_ecology.svg',
  'assets/audio_v2/stories/jewellery_designer.txt', 'assets/audio_v2/stories/air_traffic_controller.txt',
  'assets/audio_v2/stories/home_health_nurse.txt', 'assets/audio_v2/stories/hairdresser_ecologist.txt',
  'assets/audio_v2/grammar/career_day_interview.txt'
];
requiredFiles.forEach(file => assert(exists(file), `Required file exists: ${file}`));

assert(v2.unit_id === 6 && v2.unit_title === 'Me, Myself and My Future Job', 'Unit identity is Me, Myself and My Future Job');
assert(vocab.length === 69, 'Vocabulary dataset contains 69 official entries matching Appendix VI');

vocab.forEach((item, index) => {
  assert(Boolean(item.word), `Vocabulary ${index + 1} has word: ${item.word}`);
});

assert(vocab.every(item => item.definition_en && item.example && item.ipa && item.meaning_gr), 'Every vocabulary item has IPA, Greek meaning, definition, and example');

// Data Twin exact match verification
const twinVocab = loadTwin('data/vocabulary_data.js', 'VOCABULARY_DATA');
assert(JSON.stringify(vocab) === JSON.stringify(twinVocab), 'vocabulary_data.js twin matches vocabulary_data.json');

const twinV2 = loadTwin('data/unit6_v2_data.js', 'UNIT6_V2_DATA');
assert(JSON.stringify(v2) === JSON.stringify(twinV2), 'unit6_v2_data.js twin matches unit6_v2_data.json');

const twinWb = loadTwin('data/unit6_workbook_data.js', 'UNIT6_WORKBOOK_DATA');
assert(JSON.stringify(workbook) === JSON.stringify(twinWb), 'unit6_workbook_data.js twin matches unit6_workbook_data.json');

// Check stories & word ownership
const vocabById = new Map(vocab.map(item => [String(item.id), item]));
const vocabByWord = new Map(vocab.map(item => [item.word.toLowerCase(), item]));

for (const story of v2.stories) {
  for (const id of story.vocabulary_ids) {
    const item = vocabById.get(String(id));
    assert(Boolean(item), `${story.id} vocabulary id ${id} resolves`);
    if (item) {
      let pattern;
      if (item.word === 'air traffic controller') {
        pattern = /\bair\s+traffic\s+controller\b/i;
      } else if (item.word === 'jewellery designer') {
        pattern = /\bjewellery\s+designer\b/i;
      } else if (item.word === 'home health nurse') {
        pattern = /\bhome\s+health\s+nurse\b/i;
      } else if (item.word === 'self confident') {
        pattern = /\bself-?confident\b/i;
      } else if (item.word === 'wear') {
        pattern = /\b(?:wear|wore|wearing|worn)\b/i;
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

console.log(`\nUnit 6 Regression Suite: ${passed} passed, ${failed} failed.`);
if (failed > 0) process.exit(1);
