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
const v2 = readJson('data/unit5_v2_data.json');
const workbook = readJson('data/unit5_workbook_data.json');

const requiredFiles = [
  'index.html', 'app.js', 'style.css', 'v2.html', 'app_v2.js', 'style_v2.css', 'verify_offline.js',
  'data/vocabulary_data.json', 'data/vocabulary_data.js', 'data/unit5_v2_data.json', 'data/unit5_v2_data.js',
  'data/unit5_workbook_data.json', 'data/unit5_workbook_data.js',
  'assets/images_v2/sixties_party.svg', 'assets/images_v2/ancient_greece_clothing.svg',
  'assets/images_v2/victorian_omnibus.svg', 'assets/images_v2/transport_museum.svg',
  'assets/audio_v2/stories/anastasia_diary_full_story.txt', 'assets/audio_v2/stories/ancient_greece_habits_full_story.txt',
  'assets/audio_v2/stories/victorian_transport_full_story.txt', 'assets/audio_v2/stories/london_transport_museum_full_story.txt'
];
requiredFiles.forEach(file => assert(exists(file), `Required file exists: ${file}`));

assert(v2.unit_id === 5 && v2.unit_title === 'Travelling Through Time', 'Unit identity is Travelling Through Time');
assert(vocab.length === 56, 'Vocabulary dataset contains 56 official entries matching Appendix V');

vocab.forEach((item, index) => {
  assert(Boolean(item.word), `Vocabulary ${index + 1} has word: ${item.word}`);
});

assert(vocab.every(item => item.definition_en && item.example && item.ipa && item.meaning_gr), 'Every vocabulary item has IPA, Greek meaning, definition, and example');

// Data Twin exact match verification
const twinVocab = loadTwin('data/vocabulary_data.js', 'VOCABULARY_DATA');
assert(JSON.stringify(vocab) === JSON.stringify(twinVocab), 'vocabulary_data.js twin matches vocabulary_data.json');

const twinV2 = loadTwin('data/unit5_v2_data.js', 'UNIT5_V2_DATA');
assert(JSON.stringify(v2) === JSON.stringify(twinV2), 'unit5_v2_data.js twin matches unit5_v2_data.json');

const twinWb = loadTwin('data/unit5_workbook_data.js', 'UNIT5_WORKBOOK_DATA');
assert(JSON.stringify(workbook) === JSON.stringify(twinWb), 'unit5_workbook_data.js twin matches unit5_workbook_data.json');

// Check stories & word ownership
const vocabById = new Map(vocab.map(item => [String(item.id), item]));
const vocabByWord = new Map(vocab.map(item => [item.word.toLowerCase(), item]));

for (const story of v2.stories) {
  for (const id of story.vocabulary_ids) {
    const item = vocabById.get(String(id));
    assert(Boolean(item), `${story.id} vocabulary id ${id} resolves`);
    if (item) {
      let pattern;
      if (item.word === 'bell-bottomed pants') {
        pattern = /\bbell-bottomed\s+pants\b/i;
      } else if (item.word === 'fruit punch') {
        pattern = /\bfruit\s+punch\b/i;
      } else if (item.word === 'high heeled shoes') {
        pattern = /\bhigh\s+heeled\s+shoes\b/i;
      } else if (item.word === 'keep clear') {
        pattern = /\bkeep\s+clear\b/i;
      } else if (item.word === 'lean against') {
        pattern = /\blean\s+against\b/i;
      } else if (item.word === 'tube train') {
        pattern = /\btube\s+train\b/i;
      } else if (item.word === 'hunt game') {
        pattern = /\bhunt\b/i;
      } else if (item.word === 'double-decker bus') {
        pattern = /\bdouble-decker\s+bus\b/i;
      } else if (item.word === 'gift shop') {
        pattern = /\bgift\s+shop\b/i;
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

// Workbook structure and checklist validation
assert(Array.isArray(workbook.activities) && workbook.activities.length === 15, 'Workbook contains all 15 activities');
for (const act of workbook.activities) {
  if (act.type === 'open') {
    assert(Array.isArray(act.checklist) && act.checklist.length > 0, `Open activity ${act.id} has valid checklist items`);
  }
  if (act.type === 'closed') {
    const hasAnswers = (act.gaps && act.gaps.every(g => g.accepted && g.accepted.length > 0)) ||
                       (act.pairs && act.pairs.length > 0);
    assert(hasAnswers, `Closed activity ${act.id} has accepted answers or pairs`);
  }
}

console.log(`\nUnit 5 Regression Suite: ${passed} passed, ${failed} failed.`);
if (failed > 0) process.exit(1);
