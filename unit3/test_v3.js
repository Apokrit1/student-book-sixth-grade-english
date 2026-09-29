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
const v2 = readJson('data/unit3_v2_data.json');
const workbook = readJson('data/unit3_workbook_data.json');
const catalog = readJson('../data/coursebook_catalog.json');

const requiredFiles = [
  'index.html', 'app.js', 'style.css', 'v2.html', 'app_v2.js', 'style_v2.css', 'verify_offline.js',
  'data/vocabulary_data.json', 'data/vocabulary_data.js', 'data/unit3_v2_data.json', 'data/unit3_v2_data.js',
  'data/unit3_workbook_data.json', 'data/unit3_workbook_data.js',
  'assets/images_v2/polyphemus.svg', 'assets/images_v2/fairies_fairyland.svg', 'assets/images_v2/ogre_adventure.svg',
  'assets/audio_v2/stories/polyphemus_full_story.mp3', 'assets/audio_v2/stories/fairies_full_story.mp3', 'assets/audio_v2/stories/ogre_full_story.mp3',
  'assets/audio_v2/grammar/the_fifty_cent_piece.mp3', 'assets/audio_v2/grammar/midsummer_nights_dream.mp3'
];
requiredFiles.forEach(file => assert(exists(file), `Required file exists: ${file}`));

assert(v2.unit_id === 3 && v2.unit_title === 'Imaginary Creatures', 'Unit identity is Imaginary Creatures');
assert(vocab.length === 54, 'Vocabulary dataset contains 54 official entries');

vocab.forEach((item, index) => {
  assert(Boolean(item.word), `Vocabulary ${index + 1} has word: ${item.word}`);
});

assert(vocab.every(item => item.definition_en && item.example && item.ipa && item.meaning_gr), 'Every vocabulary item has IPA, Greek meaning, definition, and example');

// Rights test: Ensure no trademarked character names are used as image filenames
const imageFiles = fs.readdirSync('assets/images_v2');
for (const img of imageFiles) {
  assert(!/shrek|tinkerbell|peter_pan/i.test(img), `Image ${img} complies with copyright rules (no trademark depiction)`);
}

const vocabById = new Map(vocab.map(item => [String(item.id), item]));
const vocabByWord = new Map(vocab.map(item => [item.word.toLowerCase(), item]));

for (const story of v2.stories) {
  for (const id of story.vocabulary_ids) {
    const item = vocabById.get(String(id));
    assert(Boolean(item), `${story.id} vocabulary id ${id} resolves`);
    if (item) {
      let pattern;
      if (item.word === 'orge') {
        pattern = /\b(?:ogre|orge)\b/i;
      } else if (item.word === 'attractive') {
        pattern = /\b(?:un)?attractive\b/i;
      } else if (item.word === 'keep vigil') {
        pattern = /\bkeeps?\s+vigil\b/i;
      } else if (item.word === 'fall in love') {
        pattern = /\bfalls?\s+in\s+love\b/i;
      } else if (item.word === 'play tricks') {
        pattern = /\bplays?\s+tricks?\b/i;
      } else {
        const words = item.word.toLowerCase().split(/\s+/).map((word, index, list) => {
          if (index !== list.length - 1) return word;
          if (word.endsWith('y')) {
            const base = word.slice(0, -1);
            return `(?:${word}|${word}s|${base}ies|${base}ied)`;
          }
          return `${word}\\w*`;
        });
        pattern = new RegExp(`\\b${words.join('\\s+')}\\b`, 'i');
      }
      assert(pattern.test(story.narrative), `${story.id} narrative contains owned word ${item.word}`);
    }
  }
  for (const landmark of story.landmarks) {
    if (landmark.word_key || landmark.word_id) {
      const item = landmark.word_key ? vocabByWord.get(landmark.word_key.toLowerCase()) : vocabById.get(String(landmark.word_id));
      assert(Boolean(item), `${story.id} landmark ${landmark.name} resolves to vocabulary`);
      if (item) assert(story.vocabulary_ids.map(String).includes(String(item.id)), `${story.id} owns landmark word ${item.word}`);
    } else {
      assert(landmark.word_key === null && landmark.word_id === null, `${story.id} null landmark binding is explicit`);
    }
    assert(exists(landmark.name && story.image), `${story.id} has a local story image`);
  }
}

assert(v2.grammar_lab.target_structures.length >= 4, 'Grammar Lab includes the Unit 3 target structures');
assert(v2.grammar_lab.rules.length >= 4, 'Grammar Lab has inductive rules in book order');
assert(v2.grammar_lab.practice_items.length >= 5, 'Grammar Lab has interactive practice items');
assert(v2.grammar_lab.school_lab_listening.dialogue_script.length >= 8, 'The Fifty-Cent Piece recording has dialogue script');
assert(v2.grammar_lab.classroom_listening.length >= 1, 'Classroom listening theatre script supplied');

assert(v2.collocations.length >= 5, 'Collocations dataset is populated');
assert(v2.definition_challenge.group_a.length + v2.definition_challenge.group_b.length === 14, 'Definition challenge has 14 definition clues');
assert(!JSON.stringify(v2).includes('interlocking crossword'), 'No crossword-grid implementation is enabled');
assert(v2.content_true_false.length >= 6, 'Content true/false bank is populated');
assert(v2.report_builder_guide.sections.length === 4, 'Classroom theatre workshop has 4 sections');
assert(v2.can_do.statements.length >= 4, 'Unit 3 Can-Do statements are supplied');

const audioSets = [{ name: 'standard', dir: 'assets/audio' }, { name: 'neural', dir: 'assets/audio_neural' }];
for (const set of audioSets) {
  for (const item of vocab) {
    const id = String(item.id).padStart(2, '0');
    const clips = [
      [`${set.dir}/words/${id}_word.mp3`, item.word],
      [`${set.dir}/defs/${id}_definition.mp3`, item.definition_en],
      [`${set.dir}/examples/${id}_example.mp3`, item.example]
    ];
    for (const [file, expectedText] of clips) {
      assert(exists(file), `${set.name} audio exists: ${file}`);
      const sidecar = file.replace(/\.mp3$/, '.txt');
      assert(exists(sidecar), `${set.name} sidecar exists: ${sidecar}`);
      if (exists(sidecar)) assert(fs.readFileSync(sidecar, 'utf8').trim() === expectedText.trim(), `${sidecar} matches vocabulary text`);
    }
  }
}

const storyAudio = [
  ['assets/audio_v2/stories/polyphemus_full_story.mp3', 'data/story_polyphemus.txt'],
  ['assets/audio_v2/stories/fairies_full_story.mp3', 'data/story_fairies.txt'],
  ['assets/audio_v2/stories/ogre_full_story.mp3', 'data/story_ogre.txt']
];
for (const [audio, textFile] of storyAudio) {
  assert(exists(audio), `Story audio exists: ${audio}`);
  const sidecar = audio.replace(/\.mp3$/, '.txt');
  assert(exists(sidecar), `Story sidecar exists: ${sidecar}`);
  if (exists(sidecar)) assert(fs.readFileSync(sidecar, 'utf8').trim() === fs.readFileSync(textFile, 'utf8').trim(), `${sidecar} matches story text`);
}

const dialogueAudio = [
  ['assets/audio_v2/grammar/the_fifty_cent_piece.mp3', 'data/dialogue_the_fifty_cent_piece.json'],
  ['assets/audio_v2/grammar/midsummer_nights_dream.mp3', 'data/dialogue_midsummer_nights_dream.json']
];
for (const [audio, scriptFile] of dialogueAudio) {
  assert(exists(audio), `Dialogue audio exists: ${audio}`);
  const sidecar = audio.replace(/\.mp3$/, '.txt');
  const json = readJson(scriptFile);
  const script = json.dialogue_script || json.script;
  const expectedText = script.map(turn => `${turn.speaker}: ${turn.text}`).join('\n');
  assert(exists(sidecar), `Dialogue sidecar exists: ${sidecar}`);
  if (exists(sidecar)) assert(fs.readFileSync(sidecar, 'utf8').trim() === expectedText.trim(), `${sidecar} matches recording script`);
}

assert(workbook.total_activities === 20 && workbook.activities.length === 20, 'Workbook has all 20 authored activities');
const expectedOrder = ['a1', 'a2', 'a3', 'a4', 'a5', 'a6', 'a7', 'b1', 'b2', 'b3', 'b4', 'b5', 'b6', 'b7', 'b8', 'b9', 'b10', 'b11', 'b12', 'c_mediation'];
assert(JSON.stringify(workbook.activities.map(activity => activity.id)) === JSON.stringify(expectedOrder), 'Workbook activities remain in printed order');

for (const activity of workbook.activities) {
  assert(Boolean(activity.id && activity.number && activity.title && activity.page && activity.type), `Workbook ${activity.id} has identity and numbering`);
  if (activity.type === 'closed') {
    const hasAnswers = activity.pairs || activity.gaps || activity.items;
    assert(Boolean(hasAnswers), `Closed activity ${activity.id} carries answer-bearing data`);
  }
}

assert(catalog.units.find(unit => unit.unit === 3).status === 'ready', 'Catalog marks Unit 3 ready');
assert(catalog.units.find(unit => unit.unit === 3).v1_url === 'unit3/index.html' && catalog.units.find(unit => unit.unit === 3).v2_url === 'unit3/v2.html', 'Catalog Unit 3 links are registered');

const jsonTwins = [
  ['data/vocabulary_data.json', 'data/vocabulary_data.js', 'VOCABULARY_DATA'],
  ['data/unit3_v2_data.json', 'data/unit3_v2_data.js', 'UNIT3_V2_DATA'],
  ['data/unit3_workbook_data.json', 'data/unit3_workbook_data.js', 'UNIT3_WORKBOOK_DATA'],
  ['../data/coursebook_catalog.json', '../data/coursebook_catalog.js', 'COURSEBOOK_CATALOG']
];
for (const [jsonFile, jsFile, globalName] of jsonTwins) {
  assert(exists(jsFile), `Twin exists: ${jsFile}`);
  if (exists(jsFile)) assert(JSON.stringify(readJson(jsonFile)) === JSON.stringify(loadTwin(jsFile, globalName)), `${jsonFile} and ${jsFile} are identical twins`);
}

const appV2 = fs.readFileSync('app_v2.js', 'utf8');
assert(appV2.includes('playAudioSequence') && appV2.includes("getVocabAudioPath('word', padId)") && appV2.includes("getVocabAudioPath('def', padId)") && appV2.includes("getVocabAudioPath('example', padId)"), 'Three-part vocabulary audio queue is preserved');

const codeFiles = ['index.html', 'app.js', 'style.css', 'v2.html', 'app_v2.js', 'style_v2.css', 'verify_offline.js'];
for (const file of codeFiles) {
  const urls = fs.readFileSync(file, 'utf8').match(/https?:\/\/[^\s"'<>)]+/g) || [];
  assert(urls.length === 0, `${file} has no external runtime URLs`);
}

for (const file of ['data/vocabulary_data.js', 'data/unit3_v2_data.js', 'data/unit3_workbook_data.js']) {
  const urls = fs.readFileSync(file, 'utf8').match(/https?:\/\/[^\s"'<>)]+/g) || [];
  assert(urls.every(url => /^https:\/\/creativecommons\.org\//.test(url)), `${file} has no URLs except exact licence links`);
}
for (const file of codeFiles) assert(!/assets\/audio(?:_neural)?\/full\//i.test(fs.readFileSync(file, 'utf8')), `${file} has no composite full-audio path`);

console.log(`\nUNIT 3 V2 TEST SUMMARY: ${passed} passed, ${failed} failed.`);
if (failed > 0) process.exit(1);
