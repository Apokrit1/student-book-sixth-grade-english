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
const v2 = readJson('data/unit7_v2_data.json');
const workbook = readJson('data/unit7_workbook_data.json');

const requiredFiles = [
  'index.html', 'app.js', 'style.css', 'v2.html', 'app_v2.js', 'style_v2.css', 'verify_offline.js',
  'data/vocabulary_data.json', 'data/vocabulary_data.js', 'data/unit7_v2_data.json', 'data/unit7_v2_data.js',
  'data/unit7_workbook_data.json', 'data/unit7_workbook_data.js',
  'assets/images_v2/olympic_pool.svg', 'assets/images_v2/paralympic_podium.svg',
  'assets/images_v2/hot_air_balloon.svg', 'assets/images_v2/theatre_stage.svg',
  'assets/audio_v2/stories/record_swimmers_full_story.txt', 'assets/audio_v2/stories/paralympic_champion_fykas_full_story.txt',
  'assets/audio_v2/stories/hot_air_balloon_race_full_story.txt', 'assets/audio_v2/stories/theatre_musical_night_full_story.txt',
  'assets/audio_v2/grammar/radio_champion_interview.txt'
];
requiredFiles.forEach(file => assert(exists(file), `Required file exists: ${file}`));

assert(v2.unit_id === 7 && v2.unit_title === 'Share Your Experiences', 'Unit identity is Share Your Experiences');
assert(vocab.length === 52, 'Vocabulary dataset contains 52 official entries matching Appendix V');

vocab.forEach((item, index) => {
  assert(Boolean(item.word), `Vocabulary ${index + 1} has word: ${item.word}`);
});

assert(vocab.every(item => item.definition_en && item.example && item.ipa && item.meaning_gr), 'Every vocabulary item has IPA, Greek meaning, definition, and example');

// Data Twin exact match verification
const twinVocab = loadTwin('data/vocabulary_data.js', 'VOCABULARY_DATA');
assert(JSON.stringify(vocab) === JSON.stringify(twinVocab), 'vocabulary_data.js twin matches vocabulary_data.json');

const twinV2 = loadTwin('data/unit7_v2_data.js', 'UNIT7_V2_DATA');
assert(JSON.stringify(v2) === JSON.stringify(twinV2), 'unit7_v2_data.js twin matches unit7_v2_data.json');

const twinWb = loadTwin('data/unit7_workbook_data.js', 'UNIT7_WORKBOOK_DATA');
assert(JSON.stringify(workbook) === JSON.stringify(twinWb), 'unit7_workbook_data.js twin matches unit7_workbook_data.json');

// Check stories & word ownership
const vocabById = new Map(vocab.map(item => [String(item.id), item]));
const vocabByWord = new Map(vocab.map(item => [item.word.toLowerCase(), item]));

for (const story of v2.stories) {
  for (const id of story.vocabulary_ids) {
    const item = vocabById.get(String(id));
    assert(Boolean(item), `${story.id} vocabulary id ${id} resolves`);
    if (item) {
      let pattern;
      if (item.word === 'hot-air balloon') {
        pattern = /\bhot-air\s+balloon\b/i;
      } else if (item.word === 'gold medal') {
        pattern = /\bgold\s+medal\b/i;
      } else if (item.word === 'relay team') {
        pattern = /\brelay\s+team\b/i;
      } else if (item.word === 'packed audience') {
        pattern = /\bpacked\s+audience\b/i;
      } else if (item.word === 'long-running') {
        pattern = /\blong-running\b/i;
      } else if (item.word === 'post-show') {
        pattern = /\bpost-show\b/i;
      } else if (item.word === 'recycling bank') {
        pattern = /\brecycling\s+bank\b/i;
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

console.log(`\nUnit 7 Regression Suite: ${passed} passed, ${failed} failed.`);
if (failed > 0) process.exit(1);
