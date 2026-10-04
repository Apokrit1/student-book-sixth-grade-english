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
const v2 = readJson('data/unit10_v2_data.json');
const workbook = readJson('data/unit10_workbook_data.json');

const requiredFiles = [
  'index.html', 'app.js', 'style.css', 'v2.html', 'app_v2.js', 'style_v2.css', 'verify_offline.js',
  'data/vocabulary_data.json', 'data/vocabulary_data.js', 'data/unit10_v2_data.json', 'data/unit10_v2_data.js',
  'data/unit10_workbook_data.json', 'data/unit10_workbook_data.js',
  'assets/images_v2/super_spy.svg', 'assets/images_v2/film_festival.svg',
  'assets/images_v2/book_adaptation.svg', 'assets/images_v2/film_critics.svg',
  'assets/audio_v2/stories/super_spy_cinema_full_story.txt', 'assets/audio_v2/stories/international_film_festival_full_story.txt',
  'assets/audio_v2/stories/bestseller_to_blockbuster_full_story.txt', 'assets/audio_v2/stories/young_critics_review_full_story.txt',
  'assets/audio_v2/grammar/cinema_dialogue.txt'
];
requiredFiles.forEach(file => assert(exists(file), `Required file exists: ${file}`));

assert(v2.unit_id === 10 && v2.unit_title === 'Time for Fun', 'Unit identity is Time for Fun');
assert(vocab.length === 43, 'Vocabulary dataset contains 43 official entries matching Appendix V');

vocab.forEach((item, index) => {
  assert(Boolean(item.word), `Vocabulary ${index + 1} has word: ${item.word}`);
});

assert(vocab.every(item => item.definition_en && item.example && item.ipa && item.meaning_gr), 'Every vocabulary item has IPA, Greek meaning, definition, and example');

// Data Twin exact match verification
const twinVocab = loadTwin('data/vocabulary_data.js', 'VOCABULARY_DATA');
assert(JSON.stringify(vocab) === JSON.stringify(twinVocab), 'vocabulary_data.js twin matches vocabulary_data.json');

const twinV2 = loadTwin('data/unit10_v2_data.js', 'UNIT10_V2_DATA');
assert(JSON.stringify(v2) === JSON.stringify(twinV2), 'unit10_v2_data.js twin matches unit10_v2_data.json');

const twinWb = loadTwin('data/unit10_workbook_data.js', 'UNIT10_WORKBOOK_DATA');
assert(JSON.stringify(workbook) === JSON.stringify(twinWb), 'unit10_workbook_data.js twin matches unit10_workbook_data.json');

// Check stories & word ownership
const vocabById = new Map(vocab.map(item => [String(item.id), item]));
const vocabByWord = new Map(vocab.map(item => [item.word.toLowerCase(), item]));

for (const story of v2.stories) {
  for (const id of story.vocabulary_ids) {
    const item = vocabById.get(String(id));
    assert(Boolean(item), `${story.id} vocabulary id ${id} resolves`);
    if (item) {
      let pattern;
      if (item.word === 'breaking news') {
        pattern = /\bbreaking\s+news\b/i;
      } else if (item.word === 'hit the shelves') {
        pattern = /\bhit\w*\s+the\s+shelves\b/i;
      } else if (item.word === 'sold out') {
        pattern = /\bsold\s+out\b/i;
      } else if (item.word === 'switch on/off') {
        pattern = /\bswitch\w*\s+(on|off)\b/i;
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
      if (item) {
        assert(story.vocabulary_ids.includes(item.id), `${story.id} owns landmark word ${item.word}`);
      }
    }
  }
}

assert(workbook.activities && workbook.activities.length === 20, 'Workbook contains exactly 20 activities (A1-A10, B1-B9, C1) mapped to Teacher\'s Book');

console.log(`\nUnit 10 Regression Suite: ${passed} passed, ${failed} failed.\n`);
if (failed > 0) process.exit(1);
