/**
 * VERIFICATION TEST SUITE: MODERN UNIT 1
 */
const fs = require('fs');
const path = require('path');

const ROOT = path.resolve(__dirname, '../..');
const MODERN_U1 = path.join(ROOT, 'vocabulary-st-modern', 'unit1');
const MODERN_HUB = path.join(ROOT, 'vocabulary-st-modern', 'index.html');

console.log('=== RUNNING MODERN UNIT 1 TEST SUITE ===');
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

// 1. Files exist and non-empty
const requiredFiles = [
  'index.html',
  'coursebook.html',
  'companion.html'
];

requiredFiles.forEach(f => {
  const p = path.join(MODERN_U1, f);
  const exists = fs.existsSync(p);
  const size = exists ? fs.statSync(p).size : 0;
  assert(exists && size > 0, `Modern Unit 1 file exists: ${f} (${size} bytes)`);
});

// 2. Hub index.html references modern unit 1
const hubHtml = fs.readFileSync(MODERN_HUB, 'utf8');
assert(hubHtml.includes('unit1/index.html'), 'Hub links to unit1/index.html (Coursebook)');
assert(hubHtml.includes('unit1/companion.html'), 'Hub links to unit1/companion.html (Companion)');

// 3. Modern Unit 1 Coursebook (index.html) integrity
const cbHtml = fs.readFileSync(path.join(MODERN_U1, 'index.html'), 'utf8');
assert(cbHtml.includes('comic.css'), 'Coursebook includes comic.css');
assert(cbHtml.includes('a11y.css'), 'Coursebook includes a11y.css');
assert(cbHtml.includes('../style.css'), 'Coursebook includes modern root style.css');
assert(cbHtml.includes('href="companion.html"'), 'Coursebook links to modern companion.html');
assert(cbHtml.includes('href="../index.html"'), 'Coursebook links back to modern hub');
assert(cbHtml.includes('../../unit1/data/vocabulary_data.js'), 'Coursebook reuses classic vocabulary_data.js');
assert(cbHtml.includes('../../unit1/data/unit1_v2_data.js'), 'Coursebook reuses classic unit1_v2_data.js');
assert(cbHtml.includes('../../unit1/data/unit1_workbook_data.js'), 'Coursebook reuses classic unit1_workbook_data.js');
assert(cbHtml.includes('id="moduleTabs"'), 'Coursebook includes dynamic moduleTabs');
assert(cbHtml.includes('id="v2Panels"'), 'Coursebook includes dynamic v2Panels container');
assert(cbHtml.includes('id="a11yBtn"'), 'Coursebook includes accessibility trigger button');

// 4. Modern Unit 1 Companion (companion.html) integrity
const compHtml = fs.readFileSync(path.join(MODERN_U1, 'companion.html'), 'utf8');
assert(compHtml.includes('comic.css'), 'Companion includes comic.css');
assert(compHtml.includes('a11y.css'), 'Companion includes a11y.css');
assert(compHtml.includes('href="index.html"'), 'Companion links to Coursebook');
assert(compHtml.includes('href="../index.html"'), 'Companion links to Modern Hub');
assert(compHtml.includes('id="viewTable"'), 'Companion includes Table Companion view');
assert(compHtml.includes('id="viewCards"'), 'Companion includes Visual Cards view');
assert(compHtml.includes('id="viewQuiz"'), 'Companion includes Listening & Recall Challenge view');
assert(compHtml.includes('id="viewDefQuiz"'), 'Companion includes Definition Challenge view');
assert(compHtml.includes('id="viewPrintable"'), 'Companion includes Printable Study Sheet view');
assert(compHtml.includes('id="viewTTS"'), 'Companion includes Dataset Export view');
assert(compHtml.includes('id="a11yBtn"'), 'Companion includes accessibility trigger button');

// 5. JavaScript Asset Paths verification
const testStoryMp3 = path.resolve(MODERN_U1, '../../unit1/assets/audio_v2/stories/ukraine_full_story.mp3');
assert(fs.existsSync(testStoryMp3) && fs.statSync(testStoryMp3).size > 0, 'Relative path to Ukraine story MP3 resolves correctly');

const testWordMp3 = path.resolve(MODERN_U1, '../../unit1/assets/audio_neural/words/01_word.mp3');
assert(fs.existsSync(testWordMp3) && fs.statSync(testWordMp3).size > 0, 'Relative path to Neural Vocab MP3 resolves correctly');

const testWordSvg = path.resolve(MODERN_U1, '../../unit1/assets/images/01_ancient.svg');
assert(fs.existsSync(testWordSvg) && fs.statSync(testWordSvg).size > 0, 'Relative path to Word SVG resolves correctly');

console.log('========================================');
console.log(`MODERN UNIT 1 TEST SUMMARY: ${passed} passed, ${failed} failed.`);
console.log('========================================');

if (failed > 0) process.exit(1);
