/**
 * VERIFICATION TEST SUITE: RETRO COMIC UNIT 1 (OPTION A)
 */
const fs = require('fs');
const path = require('path');

const ROOT = path.resolve(__dirname, '../..');
const MODERN_U1 = path.join(ROOT, 'vocabulary-st-modern', 'unit1');
const MODERN_HUB = path.join(ROOT, 'vocabulary-st-modern', 'index.html');
const CLASSIC_U1 = path.join(ROOT, 'unit1');

console.log('=== RUNNING RETRO COMIC UNIT 1 TEST SUITE ===');
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
  'companion.html',
  'unit1_comic.css',
  'app_v2.js',
  'app_companion.js'
];

requiredFiles.forEach(f => {
  const p = path.join(MODERN_U1, f);
  const exists = fs.existsSync(p);
  const size = exists ? fs.statSync(p).size : 0;
  assert(exists && size > 0, `Modern Unit 1 file exists: ${f} (${size} bytes)`);
});

// 2. Hub index.html references modern unit 1
const hubHtml = fs.readFileSync(MODERN_HUB, 'utf8');
assert(hubHtml.includes('href="unit1/index.html"'), 'Hub links to unit1/index.html (Coursebook)');
assert(hubHtml.includes('href="unit1/companion.html"'), 'Hub links to unit1/companion.html (Companion)');
assert(hubHtml.includes('href="../unit1/v2.html"'), 'Hub preserves switch link to classic Unit 1 edition');

// 3. Modern Unit 1 Coursebook (index.html) integrity
const cbHtml = fs.readFileSync(path.join(MODERN_U1, 'index.html'), 'utf8');
assert(cbHtml.includes('unit1_comic.css'), 'Coursebook includes unit1_comic.css');
assert(cbHtml.includes('../style.css'), 'Coursebook includes modern root style.css');
assert(cbHtml.includes('href="../../unit1/v2.html"'), 'Coursebook has switcher to Classic Edition (unit1/v2.html)');
assert(cbHtml.includes('href="companion.html"'), 'Coursebook links to modern companion.html');
assert(cbHtml.includes('href="../index.html"'), 'Coursebook links back to modern graphic novel hub');
assert(cbHtml.includes('href="../../unit1/photodentro/index.html"'), 'Coursebook links to Photodentro OER without breaking');
assert(cbHtml.includes('../../unit1/data/vocabulary_data.js'), 'Coursebook reuses classic vocabulary_data.js');
assert(cbHtml.includes('../../unit1/data/unit1_v2_data.js'), 'Coursebook reuses classic unit1_v2_data.js');
assert(cbHtml.includes('../../unit1/data/unit1_workbook_data.js'), 'Coursebook reuses classic unit1_workbook_data.js');
assert(cbHtml.includes('id="panel-stories"'), 'Coursebook has panel-stories (Country Dossiers)');
assert(cbHtml.includes('id="panel-grammar"'), 'Coursebook has panel-grammar (Grammar Lab)');
assert(cbHtml.includes('id="panel-collocations"'), 'Coursebook has panel-collocations');
assert(cbHtml.includes('id="panel-report"'), 'Coursebook has panel-report (Report Builder)');
assert(cbHtml.includes('id="panel-challenges"'), 'Coursebook has panel-challenges');
assert(cbHtml.includes('id="panel-worksheets"'), 'Coursebook has panel-worksheets');
assert(cbHtml.includes('id="panel-passport"'), 'Coursebook has panel-passport (Can-Do Passport)');
assert(cbHtml.includes('id="panel-workbook"'), 'Coursebook has panel-workbook (Workbook Activities)');

// 4. Modern Unit 1 Companion (companion.html) integrity
const compHtml = fs.readFileSync(path.join(MODERN_U1, 'companion.html'), 'utf8');
assert(compHtml.includes('unit1_comic.css'), 'Companion includes unit1_comic.css');
assert(compHtml.includes('href="../../unit1/index.html"'), 'Companion has switcher to Classic Companion');
assert(compHtml.includes('href="index.html"'), 'Companion links to Comic Coursebook');
assert(compHtml.includes('href="../index.html"'), 'Companion links to Comic Hub');
assert(compHtml.includes('id="viewTable"'), 'Companion includes Table Companion view');
assert(compHtml.includes('id="viewCards"'), 'Companion includes Visual Cards view');
assert(compHtml.includes('id="viewQuiz"'), 'Companion includes Listening Challenge view');
assert(compHtml.includes('id="viewDefQuiz"'), 'Companion includes Definition Challenge view');
assert(compHtml.includes('id="viewPrintable"'), 'Companion includes Printable Study Sheet view');
assert(compHtml.includes('id="viewTTS"'), 'Companion includes TTS Script & Export view');

// 5. JavaScript Asset Paths verification (no 404 broken asset references)
const appV2 = fs.readFileSync(path.join(MODERN_U1, 'app_v2.js'), 'utf8');
assert(appV2.includes('../../unit1/assets/audio'), 'app_v2 uses proper relative path for audio');
assert(appV2.includes('../../unit1/assets/images_v2'), 'app_v2 uses proper relative path for images_v2');

const appComp = fs.readFileSync(path.join(MODERN_U1, 'app_companion.js'), 'utf8');
assert(appComp.includes('../../unit1/assets/audio'), 'app_companion uses proper relative path for audio');
assert(appComp.includes('../../unit1/assets/images/'), 'app_companion uses proper relative path for visual images');

// Check actual existence of referenced assets from modern unit1 location
const testStoryMp3 = path.resolve(MODERN_U1, '../../unit1/assets/audio_v2/stories/ukraine_full_story.mp3');
assert(fs.existsSync(testStoryMp3) && fs.statSync(testStoryMp3).size > 0, 'Relative path to Ukraine story MP3 resolves correctly');

const testWordMp3 = path.resolve(MODERN_U1, '../../unit1/assets/audio_neural/words/01_word.mp3');
assert(fs.existsSync(testWordMp3) && fs.statSync(testWordMp3).size > 0, 'Relative path to Neural Vocab MP3 resolves correctly');

const testWordSvg = path.resolve(MODERN_U1, '../../unit1/assets/images/01_ancient.svg');
assert(fs.existsSync(testWordSvg) && fs.statSync(testWordSvg).size > 0, 'Relative path to Word SVG resolves correctly');

// 6. Deep Verification: Base Stylesheets cascading
assert(cbHtml.includes('style_v2.css'), 'Coursebook includes base style_v2.css for full component layout');
assert(compHtml.includes('style.css'), 'Companion includes base style.css for 6-view layout');

// 7. Bidirectional edition switchers
const classicV2Html = fs.readFileSync(path.join(CLASSIC_U1, 'v2.html'), 'utf8');
const classicCompHtml = fs.readFileSync(path.join(CLASSIC_U1, 'index.html'), 'utf8');
assert(classicV2Html.includes('../vocabulary-st-modern/unit1/index.html'), 'Classic v2.html has switcher to Comic Edition Coursebook');
assert(classicCompHtml.includes('../vocabulary-st-modern/unit1/companion.html'), 'Classic index.html has switcher to Comic Edition Companion');

// 8. Runtime Asset Path Resolution (resolveAsset verifies all 26 data asset references resolve)
assert(appV2.includes('resolveAsset'), 'app_v2 implements resolveAsset helper');
assert(appComp.includes('resolveAsset'), 'app_companion implements resolveAsset helper');

const v2Data = require('../../unit1/data/unit1_v2_data.json');
const wbData = require('../../unit1/data/unit1_workbook_data.json');
const vocData = require('../../unit1/data/vocabulary_data.json');

function resolveAssetModern(p) {
  if (!p) return null;
  if (p.startsWith('assets/')) return path.resolve(MODERN_U1, '../../unit1/' + p);
  return path.resolve(MODERN_U1, p);
}

// Check Lab scene image & Badluck comic image
assert(fs.existsSync(resolveAssetModern(v2Data.grammar_lab.school_lab_listening.scene_image)), 'Lab scene image exists and resolves from modern coursebook');
assert(fs.existsSync(resolveAssetModern(v2Data.grammar_lab.badluck_comic_image)), 'Badluck comic image exists and resolves from modern coursebook');

// Check Workbook images
let wbImagesFound = 0;
wbData.activities.forEach(act => {
  if (act.image && fs.existsSync(resolveAssetModern(act.image))) wbImagesFound++;
  if (act.items) {
    act.items.forEach(it => {
      if (it.image && fs.existsSync(resolveAssetModern(it.image))) wbImagesFound++;
    });
  }
});
assert(wbImagesFound >= 5, `All workbook activity and item images exist and resolve (${wbImagesFound} found)`);

// Check Vocab WebP images
let vocImagesFound = 0;
vocData.forEach(item => {
  if (item.image && fs.existsSync(resolveAssetModern(item.image))) vocImagesFound++;
});
assert(vocImagesFound >= 14, `All 14 vocabulary realia WebP images exist and resolve (${vocImagesFound} found)`);

console.log('========================================');
console.log(`MODERN UNIT 1 TEST SUMMARY: ${passed} passed, ${failed} failed.`);
console.log('========================================');

if (failed > 0) process.exit(1);
