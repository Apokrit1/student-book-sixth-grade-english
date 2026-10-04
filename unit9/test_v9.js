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
const v2 = readJson('data/unit9_v2_data.json');
const workbook = readJson('data/unit9_workbook_data.json');

const requiredFiles = [
  'index.html', 'app.js', 'style.css', 'v2.html', 'app_v2.js', 'style_v2.css', 'verify_offline.js',
  'data/vocabulary_data.json', 'data/vocabulary_data.js', 'data/unit9_v2_data.json', 'data/unit9_v2_data.js',
  'data/unit9_workbook_data.json', 'data/unit9_workbook_data.js',
  'assets/images_v2/beach_cleanup.svg', 'assets/images_v2/turtle_rescue.svg',
  'assets/images_v2/awful_five.svg', 'assets/images_v2/green_community.svg',
  'assets/audio_v2/stories/an_earth_day_story_full_story.txt', 'assets/audio_v2/stories/save_endangered_species_full_story.txt',
  'assets/audio_v2/stories/the_awful_five_play_full_story.txt', 'assets/audio_v2/stories/green_action_community_full_story.txt',
  'assets/audio_v2/grammar/environmental_center_dialogue.txt'
];
requiredFiles.forEach(file => assert(exists(file), `Required file exists: ${file}`));

assert(v2.unit_id === 9 && v2.unit_title === 'Earth Day Everyday', 'Unit identity is Earth Day Everyday');
assert(vocab.length === 48, 'Vocabulary dataset contains 48 official entries matching Appendix V (with dry cleaner/cause split)');

vocab.forEach((item, index) => {
  assert(Boolean(item.word), `Vocabulary ${index + 1} has word: ${item.word}`);
});

assert(vocab.every(item => item.definition_en && item.example && item.ipa && item.meaning_gr), 'Every vocabulary item has IPA, Greek meaning, definition, and example');

// Data Twin exact match verification
const twinVocab = loadTwin('data/vocabulary_data.js', 'VOCABULARY_DATA');
assert(JSON.stringify(vocab) === JSON.stringify(twinVocab), 'vocabulary_data.js twin matches vocabulary_data.json');

const twinV2 = loadTwin('data/unit9_v2_data.js', 'UNIT9_V2_DATA');
assert(JSON.stringify(v2) === JSON.stringify(twinV2), 'unit9_v2_data.js twin matches unit9_v2_data.json');

const twinWb = loadTwin('data/unit9_workbook_data.js', 'UNIT9_WORKBOOK_DATA');
assert(JSON.stringify(workbook) === JSON.stringify(twinWb), 'unit9_workbook_data.js twin matches unit9_workbook_data.json');

// Check stories & word ownership
const vocabById = new Map(vocab.map(item => [String(item.id), item]));
const vocabByWord = new Map(vocab.map(item => [item.word.toLowerCase(), item]));

for (const story of v2.stories) {
  for (const id of story.vocabulary_ids) {
    const item = vocabById.get(String(id));
    assert(Boolean(item), `${story.id} vocabulary id ${id} resolves`);
    if (item) {
      let pattern;
      if (item.word === 'acid rain') {
        pattern = /\bacid\s+rain\b/i;
      } else if (item.word === 'become extinct') {
        pattern = /\bbecome\w*\s+extinct\b/i;
      } else if (item.word === 'chemical plant') {
        pattern = /\bchemical\s+plant\w*\b/i;
      } else if (item.word === 'carbon monoxide') {
        pattern = /\bcarbon\s+monoxide\b/i;
      } else if (item.word === 'dry cleaner') {
        pattern = /\bdry\s+cleaner\w*\b/i;
      } else if (item.word === 'endangered species') {
        pattern = /\bendangered\s+species\b/i;
      } else if (item.word === 'get rid of') {
        pattern = /\bget\w*\s+rid\s+of\b/i;
      } else if (item.word === 'head for') {
        pattern = /\bhead\w*\s+for\b/i;
      } else if (item.word === 'lay eggs') {
        pattern = /\b(lay|laid|laying)\s+eggs\b/i;
      } else if (item.word === 'stare at') {
        pattern = /\bstare\w*\s+at\b/i;
      } else if (item.word === 'sulphur dioxide') {
        pattern = /\bsulphur\s+dioxide\b/i;
      } else if (item.word === 'toxic waste') {
        pattern = /\btoxic\s+waste\b/i;
      } else if (item.word === 'wash up') {
        pattern = /\bwash\w*\s+up\b/i;
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

assert(workbook.activities && workbook.activities.length > 0, 'Workbook contains activities');

console.log(`\nUnit 9 Regression Suite: ${passed} passed, ${failed} failed.\n`);
if (failed > 0) process.exit(1);
