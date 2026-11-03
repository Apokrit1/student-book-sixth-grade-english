/**
 * VERIFICATION TEST SUITE: RETRO COMIC UNIT 2 (BIO-WARM 2026)
 */
const fs = require('fs');
const path = require('path');

const ROOT = path.resolve(__dirname, '../..');
const MODERN_U2 = path.join(ROOT, 'vocabulary-st-modern', 'unit2');
const MODERN_HUB = path.join(ROOT, 'vocabulary-st-modern', 'index.html');
const CLASSIC_U2 = path.join(ROOT, 'unit2');

console.log('=== RUNNING RETRO COMIC UNIT 2 TEST SUITE ===');
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
  'unit2_comic.css',
  'app_v2.js',
  'app_companion.js'
];

requiredFiles.forEach(f => {
  const p = path.join(MODERN_U2, f);
  const exists = fs.existsSync(p);
  const size = exists ? fs.statSync(p).size : 0;
  assert(exists && size > 0, `Modern Unit 2 file exists: ${f} (${size} bytes)`);
});

// 2. Hub index.html references modern Unit 2
const hubHtml = fs.readFileSync(MODERN_HUB, 'utf8');
assert(hubHtml.includes('href="unit2/index.html"'), 'Hub links to unit2/index.html (Coursebook)');
assert(hubHtml.includes('href="unit2/companion.html"'), 'Hub links to unit2/companion.html (Companion)');
assert(hubHtml.includes('href="../unit2/v2.html"'), 'Hub preserves switch link to classic Unit 2 edition');
assert(hubHtml.includes('imgs/unit2_featured.jpg'), 'Hub features unit2_featured.jpg graphic novel cover');
assert(hubHtml.includes('imgs/ffm_flyer.webp'), 'Hub includes ffm_flyer.webp story vignette');
assert(hubHtml.includes('imgs/mall_choice.webp'), 'Hub includes mall_choice.webp story vignette');
assert(hubHtml.includes('imgs/online_order.webp'), 'Hub includes online_order.webp story vignette');

// 3. Modern Unit 2 Coursebook (index.html & coursebook.html) integrity
const cbHtml = fs.readFileSync(path.join(MODERN_U2, 'index.html'), 'utf8');
assert(cbHtml.includes('unit2_comic.css'), 'Coursebook includes unit2_comic.css');
assert(cbHtml.includes('../style.css'), 'Coursebook includes modern root style.css');
assert(cbHtml.includes('href="../../unit2/v2.html"'), 'Coursebook has switcher to Classic Edition (unit2/v2.html)');
assert(cbHtml.includes('href="companion.html"'), 'Coursebook links to modern companion.html');
assert(cbHtml.includes('href="../index.html"'), 'Coursebook links back to modern graphic novel hub');
assert(cbHtml.includes('href="../../portal.html"'), 'Coursebook links to Coursebook Portal');
assert(cbHtml.includes('../../unit2/data/vocabulary_data.js'), 'Coursebook reuses classic vocabulary_data.js');
assert(cbHtml.includes('../../unit2/data/unit2_v2_data.js'), 'Coursebook reuses classic unit2_v2_data.js');
assert(cbHtml.includes('../../unit2/data/unit2_workbook_data.js'), 'Coursebook reuses classic unit2_workbook_data.js');
assert(cbHtml.includes('id="moduleTabs"'), 'Coursebook includes dynamic moduleTabs bar');
assert(cbHtml.includes('id="v2Panels"'), 'Coursebook includes dynamic v2Panels container');
assert(cbHtml.includes('id="audioHud"'), 'Coursebook includes floating audioHud');

// 4. Modern Unit 2 Companion (companion.html) integrity
const compHtml = fs.readFileSync(path.join(MODERN_U2, 'companion.html'), 'utf8');
assert(compHtml.includes('unit2_comic.css'), 'Companion includes unit2_comic.css');
assert(compHtml.includes('href="../../unit2/index.html"'), 'Companion has switcher to Classic Companion');
assert(compHtml.includes('href="index.html"'), 'Companion links to Comic Coursebook');
assert(compHtml.includes('href="../index.html"'), 'Companion links to Comic Hub');
assert(compHtml.includes('id="viewTable"'), 'Companion includes Table Companion view');
assert(compHtml.includes('id="viewCards"'), 'Companion includes Visual Cards view');
assert(compHtml.includes('id="viewQuiz"'), 'Companion includes Listening Challenge view');
assert(compHtml.includes('id="viewDefQuiz"'), 'Companion includes Definition Challenge view');
assert(compHtml.includes('id="viewPrintable"'), 'Companion includes Printable Study Sheet view');
assert(compHtml.includes('id="viewTTS"'), 'Companion includes TTS Script & Export view');

// 5. JavaScript Asset Paths & offline integrity
const appV2 = fs.readFileSync(path.join(MODERN_U2, 'app_v2.js'), 'utf8');
assert(appV2.includes('resolveAsset'), 'app_v2 implements resolveAsset helper');
assert(!appV2.includes('http://') && !appV2.includes('https://'), 'app_v2 has 0 external network dependencies');

const appComp = fs.readFileSync(path.join(MODERN_U2, 'app_companion.js'), 'utf8');
assert(appComp.includes('resolveAsset'), 'app_companion implements resolveAsset helper');
assert(appComp.includes('../../unit2/assets/audio'), 'app_companion points to unit2 assets/audio');
assert(!appComp.includes('http://') && !appComp.includes('https://'), 'app_companion has 0 external network dependencies');

// 6. Two-Track Graphic Novel Visual Assets & Size Constraints
const imgFeatured = path.join(ROOT, 'vocabulary-st-modern', 'imgs', 'unit2_featured.jpg');
const imgFlyer = path.join(CLASSIC_U2, 'assets', 'images_v2', 'ffm_flyer.webp');
const imgMall = path.join(CLASSIC_U2, 'assets', 'images_v2', 'mall_choice.webp');
const imgOnline = path.join(CLASSIC_U2, 'assets', 'images_v2', 'online_order.webp');

assert(fs.existsSync(imgFeatured), 'unit2_featured.jpg exists');
const featuredSize = fs.statSync(imgFeatured).size;
assert(featuredSize < 150 * 1024, `unit2_featured.jpg (${featuredSize} bytes) is under 150 KB limit`);

assert(fs.existsSync(imgFlyer), 'ffm_flyer.webp exists in unit2/assets/images_v2/');
const flyerSize = fs.statSync(imgFlyer).size;
assert(flyerSize < 90 * 1024, `ffm_flyer.webp (${flyerSize} bytes) is under 90 KB limit`);

assert(fs.existsSync(imgMall), 'mall_choice.webp exists in unit2/assets/images_v2/');
const mallSize = fs.statSync(imgMall).size;
assert(mallSize < 90 * 1024, `mall_choice.webp (${mallSize} bytes) is under 90 KB limit`);

assert(fs.existsSync(imgOnline), 'online_order.webp exists in unit2/assets/images_v2/');
const onlineSize = fs.statSync(imgOnline).size;
assert(onlineSize < 90 * 1024, `online_order.webp (${onlineSize} bytes) is under 90 KB limit`);

// 7. Data Twins consistency check
const v2Json = JSON.parse(fs.readFileSync(path.join(CLASSIC_U2, 'data', 'unit2_v2_data.json'), 'utf8'));
const v2Js = fs.readFileSync(path.join(CLASSIC_U2, 'data', 'unit2_v2_data.js'), 'utf8');
assert(v2Js.includes('window.UNIT2_V2_DATA ='), 'unit2_v2_data.js assigns window.UNIT2_V2_DATA');
assert(v2Json.stories.length === 3, 'unit2_v2_data.json has 3 reading stories');
assert(v2Json.stories[0].image.endsWith('.webp'), 'Story 1 references WebP graphic novel illustration');
assert(v2Json.stories[1].image.endsWith('.webp'), 'Story 2 references WebP graphic novel illustration');
assert(v2Json.stories[2].image.endsWith('.webp'), 'Story 3 references WebP graphic novel illustration');

// 8. Bidirectional edition switchers
const classicV2Html = fs.readFileSync(path.join(CLASSIC_U2, 'v2.html'), 'utf8');
const classicCompHtml = fs.readFileSync(path.join(CLASSIC_U2, 'index.html'), 'utf8');
assert(classicV2Html.includes('../vocabulary-st-modern/unit2/index.html'), 'Classic v2.html has switcher to Comic Edition Coursebook');
assert(classicCompHtml.includes('../vocabulary-st-modern/unit2/companion.html'), 'Classic index.html has switcher to Comic Edition Companion');

// 9. Offline Audio Assets Resolution
const testWordMp3 = path.resolve(MODERN_U2, '../../unit2/assets/audio/words/01_word.mp3');
assert(fs.existsSync(testWordMp3) && fs.statSync(testWordMp3).size > 0, 'Classic Audio MP3 resolves correctly from modern unit2');
const testNeuralMp3 = path.resolve(MODERN_U2, '../../unit2/assets/audio_neural/words/01_word.mp3');
assert(fs.existsSync(testNeuralMp3) && fs.statSync(testNeuralMp3).size > 0, 'Neural Audio MP3 resolves correctly from modern unit2');
const testStoryMp3 = path.resolve(MODERN_U2, '../../unit2/assets/audio_v2/stories/ffm_flyer_full_story.mp3');
assert(fs.existsSync(testStoryMp3) && fs.statSync(testStoryMp3).size > 0, 'Story full narration MP3 resolves correctly from modern unit2');

// 10. All 48 Visual Card SVGs & Bio-Warm 2026 CSS Coverage
const vocabData = JSON.parse(fs.readFileSync(path.join(CLASSIC_U2, 'data', 'vocabulary_data.json'), 'utf8'));
assert(vocabData.length === 48, 'Unit 2 vocabulary_data.json contains 48 items');
let svgCount = 0;
vocabData.forEach(item => {
  const padId = String(item.id).padStart(2, '0');
  const safeName = item.word.toLowerCase().replace(/[^a-z0-9]/g, '_');
  const svgFile = path.join(CLASSIC_U2, 'assets', 'images', `${padId}_${safeName}.svg`);
  if (fs.existsSync(svgFile) && fs.statSync(svgFile).size > 200) svgCount++;
});
assert(svgCount === 48, `All 48 Bio-Warm Retro Comic SVG visual cards exist in unit2/assets/images/ (${svgCount}/48)`);

const comicCss = fs.readFileSync(path.join(MODERN_U2, 'unit2_comic.css'), 'utf8');
[
  '.table-card',
  '.word-visual-badge',
  '.flashcard-container',
  '.card-front',
  '.card-back',
  '.flashcard-visual-img',
  '.quiz-card',
  '.def-quiz-option-btn',
  '.printable-sheet-container',
  '.export-card',
  '.modal-card',
  '.dossier-hero-row',
  '.dossier-visual-box'
].forEach(selector => {
  assert(comicCss.includes(selector), `unit2_comic.css styles ${selector} in Bio-Warm 2026 aesthetic`);
});

assert(appComp.includes('flashcard-visual-img'), 'app_companion.js renders illustrated visual cards in #viewCards');
assert(appComp.includes('badge-thumb-img'), 'app_companion.js renders visual card thumbnails in #viewTable');

console.log('========================================');
console.log(`MODERN UNIT 2 TEST SUMMARY: ${passed} passed, ${failed} failed.`);
console.log('========================================');

if (failed > 0) process.exit(1);
