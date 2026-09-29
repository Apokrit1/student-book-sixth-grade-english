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

function exists(file) {
  return fs.existsSync(file) && fs.statSync(file).size > 0;
}

function readJson(file) {
  return JSON.parse(fs.readFileSync(file, 'utf8'));
}

function loadTwin(file, globalName) {
  const source = fs.readFileSync(file, 'utf8');
  const sandbox = { window: {} };
  vm.runInNewContext(source, sandbox);
  return sandbox.window[globalName];
}

const vocab = readJson('data/vocabulary_data.json');
const v2 = readJson('data/unit4_v2_data.json');
const workbook = readJson('data/unit4_workbook_data.json');

const requiredFiles = [
  'index.html', 'app.js', 'style.css', 'v2.html', 'app_v2.js', 'style_v2.css', 'verify_offline.js',
  'data/vocabulary_data.json', 'data/vocabulary_data.js', 'data/unit4_v2_data.json', 'data/unit4_v2_data.js',
  'data/unit4_workbook_data.json', 'data/unit4_workbook_data.js',
  'assets/images_v2/daedalus_icarus.svg', 'assets/images_v2/fleet_air_arm.svg',
  'assets/images_v2/wright_flyer.svg', 'assets/images_v2/brueghel_landscape.svg',
  'assets/audio_v2/stories/daedalus_icarus_full_story.txt', 'assets/audio_v2/stories/fleet_air_arm_full_story.txt',
  'assets/audio_v2/stories/wright_brothers_full_story.txt', 'assets/audio_v2/stories/fall_of_icarus_full_story.txt'
];
requiredFiles.forEach(file => assert(exists(file), `Required file exists: ${file}`));

assert(v2.unit_id === 4 && v2.unit_title === 'The History of the Aeroplane', 'Unit identity is The History of the Aeroplane');
assert(vocab.length === 41, 'Vocabulary dataset contains 41 official entries matching Appendix V');

vocab.forEach((item, index) => {
  assert(Boolean(item.word), `Vocabulary ${index + 1} has word: ${item.word}`);
});

assert(vocab.every(item => item.definition_en && item.example && item.ipa && item.meaning_gr), 'Every vocabulary item has IPA, Greek meaning, definition, and example');

// Data Twin exact match verification
const twinVocab = loadTwin('data/vocabulary_data.js', 'VOCABULARY_DATA');
assert(JSON.stringify(vocab) === JSON.stringify(twinVocab), 'vocabulary_data.js twin matches vocabulary_data.json');

const twinV2 = loadTwin('data/unit4_v2_data.js', 'UNIT4_V2_DATA');
assert(JSON.stringify(v2) === JSON.stringify(twinV2), 'unit4_v2_data.js twin matches unit4_v2_data.json');

const twinWb = loadTwin('data/unit4_workbook_data.js', 'UNIT4_WORKBOOK_DATA');
assert(JSON.stringify(workbook) === JSON.stringify(twinWb), 'unit4_workbook_data.js twin matches unit4_workbook_data.json');

// Check stories & word ownership
const vocabById = new Map(vocab.map(item => [String(item.id), item]));
const vocabByWord = new Map(vocab.map(item => [item.word.toLowerCase(), item]));

for (const story of v2.stories) {
  for (const id of story.vocabulary_ids) {
    const item = vocabById.get(String(id));
    assert(Boolean(item), `${story.id} vocabulary id ${id} resolves`);
    if (item) {
      let pattern;
      if (item.word === 'attached files') {
        pattern = /\battached\s+files\b/i;
      } else if (item.word === 'grow up') {
        pattern = /\bgrowing\s+up\b/i;
      } else if (item.word === 'kites') {
        pattern = /\bkites?\b/i;
      } else if (item.word === 'fly') {
        pattern = /\b(?:fly|flew|flying|fliers)\b/i;
      } else if (item.word === 'drown') {
        pattern = /\b(?:drown|drowning|drowned)\b/i;
      } else if (item.word === 'melt') {
        pattern = /\b(?:melt|melts|melted)\b/i;
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
assert(Array.isArray(workbook.activities) && workbook.activities.length === 14, 'Workbook contains all 14 activities');
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

console.log(`\nUnit 4 Regression Suite: ${passed} passed, ${failed} failed.`);
if (failed > 0) process.exit(1);
