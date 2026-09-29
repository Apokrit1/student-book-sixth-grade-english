const fs = require('fs');
const path = require('path');

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

const vm = require('vm');
const vocab = readJson('data/vocabulary_data.json');
const v2 = readJson('data/unit2_v2_data.json');
const workbook = readJson('data/unit2_workbook_data.json');
const catalog = readJson('../data/coursebook_catalog.json');

const requiredFiles = [
  'index.html', 'app.js', 'style.css', 'v2.html', 'app_v2.js', 'style_v2.css', 'verify_offline.js',
  'data/vocabulary_data.json', 'data/vocabulary_data.js', 'data/unit2_v2_data.json', 'data/unit2_v2_data.js',
  'data/unit2_workbook_data.json', 'data/unit2_workbook_data.js',
  'assets/images_v2/ffm_flyer.svg', 'assets/images_v2/mall_choice.svg', 'assets/images_v2/online_order.svg',
  'assets/audio_v2/stories/ffm_flyer_full_story.mp3', 'assets/audio_v2/stories/mall_choice_full_story.mp3', 'assets/audio_v2/stories/online_order_full_story.mp3',
  'assets/audio_v2/grammar/supermarket_strawberries.mp3', 'assets/audio_v2/grammar/department_store.mp3', 'assets/audio_v2/grammar/fathers_day_breakfast.mp3'
];
requiredFiles.forEach(file => assert(exists(file), `Required file exists: ${file}`));

assert(v2.unit_id === 2 && v2.unit_title === 'Going Shopping', 'Unit identity is Going Shopping');
assert(vocab.length === 48, 'Vocabulary dataset contains 48 official entries');
const expectedWords = ['baggy', 'bakery', 'beef', 'budget', 'catwalk', 'cotton', 'cute', 'dairy', 'delicious', 'denim', 'department store', 'dessert', 'elegant', 'fashion model', 'flavour', 'flyer', 'fruit flans', 'item', 'lamb ribs', 'leather', 'loose', 'match', 'menu', 'mince', 'muffins', 'organic products', 'pair of snickers', 'pastry', 'pork chops', 'poultry', 'quantity', 'receipt', 'selection', 'silk', 'skirt', 'smart', 'space shuttle', 'subtotal', 'suit', 'sweater', 'tempting', 'tight', 'total', 'track suit', 'treat', 'turkey', 'unit pice', 'woolen'];
expectedWords.forEach((word, index) => assert(vocab[index].word === word, `Vocabulary ${index + 1} is ${word}`));
assert(vocab[26].pending_errata === 'E1' && vocab[46].pending_errata === 'E2' && vocab[47].pending_errata === 'E3', 'Three printed CHECK entries remain visibly pending');
assert(vocab.every(item => item.definition_en && item.example && item.ipa && item.meaning_gr), 'Every vocabulary item has IPA, Greek meaning, definition, and example');

const vocabById = new Map(vocab.map(item => [String(item.id), item]));
const vocabByWord = new Map(vocab.map(item => [item.word.toLowerCase(), item]));
for (const story of v2.stories) {
  for (const id of story.vocabulary_ids) {
    const item = vocabById.get(String(id));
    assert(Boolean(item), `${story.id} vocabulary id ${id} resolves`);
    if (item) {
      const words = item.word.toLowerCase().split(/\s+/).map((word, index, list) => {
        if (index !== list.length - 1) return word;
        if (word.endsWith('y')) {
          const base = word.slice(0, -1);
          return `(?:${word}|${word}s|${base}ies|${base}ied)`;
        }
        return `${word}\\w*`;
      });
      const pattern = new RegExp(`\\b${words.join('\\s+')}\\b`, 'i');
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
assert(v2.grammar_lab.target_structures.length >= 5, 'Grammar Lab includes the Unit 2 target structures');
assert(v2.grammar_lab.rules.length >= 5, 'Grammar Lab has inductive rules in book order');
assert(v2.grammar_lab.practice_items.length >= 5, 'Grammar Lab has interactive practice items');
assert(v2.grammar_lab.school_lab_listening.dialogue_script.length === 7, 'Supermarket recording has seven turns');
assert(v2.grammar_lab.classroom_listening.length === 2, 'Mall and breakfast recordings are both supplied');
assert(v2.grammar_lab.classroom_listening[0].dialogue_script.length === 16, 'Department-store recording has sixteen turns');
assert(v2.collocations.length >= 6, 'Collocations dataset is populated');
assert(v2.definition_challenge.group_a.length + v2.definition_challenge.group_b.length === 10, 'Definition challenge has ten definition clues');
assert(!JSON.stringify(v2).includes('interlocking crossword'), 'No crossword-grid implementation is enabled');
assert(v2.content_true_false.length >= 8, 'Content true/false bank is populated');
assert(v2.report_builder_guide.paragraphs.length === 4, 'Online-order writing workshop has four sections');
assert(v2.can_do.statements.length === 4, 'Four Unit 2 Can-Do statements are supplied');
assert(v2.teacher_notes.some(note => note.id === 'u2_e01_pending') && v2.teacher_notes.some(note => note.id === 'u2_e06_pending'), 'Pending ERRATA decisions are recorded in teacher notes');

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
  ['assets/audio_v2/stories/ffm_flyer_full_story.mp3', 'data/story_ffm_flyer.txt'],
  ['assets/audio_v2/stories/mall_choice_full_story.mp3', 'data/story_mall_choice.txt'],
  ['assets/audio_v2/stories/online_order_full_story.mp3', 'data/story_online_order.txt']
];
for (const [audio, textFile] of storyAudio) {
  assert(exists(audio), `Story audio exists: ${audio}`);
  const sidecar = audio.replace(/\.mp3$/, '.txt');
  assert(exists(sidecar), `Story sidecar exists: ${sidecar}`);
  if (exists(sidecar)) assert(fs.readFileSync(sidecar, 'utf8').trim() === fs.readFileSync(textFile, 'utf8').trim(), `${sidecar} matches story text`);
}
const dialogueAudio = [
  ['assets/audio_v2/grammar/supermarket_strawberries.mp3', 'data/dialogue_supermarket_strawberries.json'],
  ['assets/audio_v2/grammar/department_store.mp3', 'data/dialogue_department_store.json'],
  ['assets/audio_v2/grammar/fathers_day_breakfast.mp3', 'data/dialogue_fathers_day_breakfast.json']
];
for (const [audio, scriptFile] of dialogueAudio) {
  assert(exists(audio), `Dialogue audio exists: ${audio}`);
  const sidecar = audio.replace(/\.mp3$/, '.txt');
  const script = readJson(scriptFile).dialogue_script;
  const expectedText = script.map(turn => `${turn.speaker}: ${turn.text}`).join('\n');
  assert(exists(sidecar), `Dialogue sidecar exists: ${sidecar}`);
  if (exists(sidecar)) assert(fs.readFileSync(sidecar, 'utf8').trim() === expectedText.trim(), `${sidecar} matches recording script`);
}

assert(workbook.total_activities === 18 && workbook.activities.length === 18, 'Workbook has all 18 authored activities');
const expectedOrder = ['opening_page', 'a1', 'a2', 'a3', 'a4', 'a5', 'a6', 'a7', 'b1', 'b2', 'b3', 'b4', 'b5', 'b6', 'b7', 'b8', 'c', 'd'];
assert(JSON.stringify(workbook.activities.map(activity => activity.id)) === JSON.stringify(expectedOrder), 'Workbook activities remain in printed order');
for (const activity of workbook.activities) {
  assert(Boolean(activity.id && activity.number && activity.title && activity.page && activity.type), `Workbook ${activity.id} has identity and numbering`);
  if (activity.type === 'closed') {
    const hasAnswers = activity.pairs || activity.gaps || activity.items;
    assert(Boolean(hasAnswers), `Closed activity ${activity.id} carries answer-bearing data`);
  }
  if (activity.type === 'open') assert(Array.isArray(activity.checklist) && activity.checklist.length >= 3, `Open activity ${activity.id} has a checklist`);
}
assert(workbook.activities.find(activity => activity.id === 'a6').book_check.includes('blank 6'), 'A6 extracted-key contradiction is annotated');
assert(workbook.activities.find(activity => activity.id === 'b1').book_check.includes('blank'), 'B1 extracted-key contradiction is annotated');
assert(catalog.units.find(unit => unit.unit === 2).status === 'ready', 'Catalog marks Unit 2 ready');
assert(catalog.units.find(unit => unit.unit === 2).v1_url === 'unit2/index.html' && catalog.units.find(unit => unit.unit === 2).v2_url === 'unit2/v2.html', 'Catalog Unit 2 links are registered');

const jsonTwins = [
  ['data/vocabulary_data.json', 'data/vocabulary_data.js', 'VOCABULARY_DATA'],
  ['data/unit2_v2_data.json', 'data/unit2_v2_data.js', 'UNIT2_V2_DATA'],
  ['data/unit2_workbook_data.json', 'data/unit2_workbook_data.js', 'UNIT2_WORKBOOK_DATA'],
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
for (const file of ['data/vocabulary_data.js', 'data/unit2_v2_data.js', 'data/unit2_workbook_data.js']) {
  const urls = fs.readFileSync(file, 'utf8').match(/https?:\/\/[^\s"'<>)]+/g) || [];
  assert(urls.every(url => /^https:\/\/creativecommons\.org\//.test(url)), `${file} has no URLs except exact licence links`);
}
for (const file of codeFiles) assert(!/assets\/audio(?:_neural)?\/full\//i.test(fs.readFileSync(file, 'utf8')), `${file} has no composite full-audio path`);

console.log(`\nUNIT 2 V2 TEST SUMMARY: ${passed} passed, ${failed} failed.`);
if (failed) process.exit(1);
