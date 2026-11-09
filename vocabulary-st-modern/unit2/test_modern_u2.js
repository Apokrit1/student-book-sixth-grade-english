/**
 * VERIFICATION TEST SUITE: MODERN UNIT 2
 */
const fs = require('fs');
const path = require('path');

const ROOT = path.resolve(__dirname, '../..');
const MODERN_U2 = path.join(ROOT, 'vocabulary-st-modern', 'unit2');
const MODERN_HUB = path.join(ROOT, 'vocabulary-st-modern', 'index.html');
const CLASSIC_U2 = path.join(ROOT, 'unit2');

console.log('=== RUNNING MODERN UNIT 2 TEST SUITE ===');
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
  const p = path.join(MODERN_U2, f);
  const exists = fs.existsSync(p);
  const size = exists ? fs.statSync(p).size : 0;
  assert(exists && size > 0, `Modern Unit 2 file exists: ${f} (${size} bytes)`);
});

// 2. Hub index.html references modern Unit 2
const hubHtml = fs.readFileSync(MODERN_HUB, 'utf8');
assert(hubHtml.includes('unit2/index.html'), 'Hub links to unit2/index.html (Coursebook)');
assert(hubHtml.includes('unit2/companion.html'), 'Hub links to unit2/companion.html (Companion)');

// 3. Modern Unit 2 Coursebook (index.html & coursebook.html) integrity
const cbHtml = fs.readFileSync(path.join(MODERN_U2, 'index.html'), 'utf8');
assert(cbHtml.includes('comic.css'), 'Coursebook includes comic.css');
assert(cbHtml.includes('a11y.css'), 'Coursebook includes a11y.css');
assert(cbHtml.includes('../style.css'), 'Coursebook includes modern root style.css');
assert(cbHtml.includes('href="companion.html"'), 'Coursebook links to modern companion.html');
assert(cbHtml.includes('href="../index.html"'), 'Coursebook links back to modern hub');
assert(cbHtml.includes('../../unit2/data/vocabulary_data.js'), 'Coursebook reuses classic vocabulary_data.js');
assert(cbHtml.includes('../../unit2/data/unit2_v2_data.js'), 'Coursebook reuses classic unit2_v2_data.js');
assert(cbHtml.includes('../../unit2/data/unit2_workbook_data.js'), 'Coursebook reuses classic unit2_workbook_data.js');
assert(cbHtml.includes('id="moduleTabs"'), 'Coursebook includes dynamic moduleTabs bar');
assert(cbHtml.includes('id="v2Panels"'), 'Coursebook includes dynamic v2Panels container');
assert(cbHtml.includes('id="audioHud"'), 'Coursebook includes floating audioHud');
assert(cbHtml.includes('id="a11yBtn"'), 'Coursebook includes accessibility trigger button');

// 4. Modern Unit 2 Companion (companion.html) integrity
const compHtml = fs.readFileSync(path.join(MODERN_U2, 'companion.html'), 'utf8');
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

// 5. JavaScript Asset Paths & offline integrity
const appShared = fs.readFileSync(path.join(ROOT, 'vocabulary-st-modern/shared/app_coursebook.js'), 'utf8');
assert(appShared.includes('resolveAsset'), 'app_coursebook implements resolveAsset helper');
assert(!appShared.includes('http://') && !appShared.includes('https://'), 'app_coursebook has 0 external network dependencies');

const appComp = fs.readFileSync(path.join(ROOT, 'vocabulary-st-modern/shared/app_companion.js'), 'utf8');
assert(appComp.includes('resolveAsset'), 'app_companion implements resolveAsset helper');
assert(!appComp.includes('http://') && !appComp.includes('https://'), 'app_companion has 0 external network dependencies');

// 6. Visual Assets exist
const imgFlyer = path.join(CLASSIC_U2, 'assets', 'images_v2', 'ffm_flyer.webp');
const imgMall = path.join(CLASSIC_U2, 'assets', 'images_v2', 'mall_choice.webp');
const imgOnline = path.join(CLASSIC_U2, 'assets', 'images_v2', 'online_order.webp');

assert(fs.existsSync(imgFlyer), 'ffm_flyer.webp exists in classic assets');
assert(fs.existsSync(imgMall), 'mall_choice.webp exists in classic assets');
assert(fs.existsSync(imgOnline), 'online_order.webp exists in classic assets');

// 7. Verify all 48 visual cards exist in unit2/assets/images
const u2Images = path.join(CLASSIC_U2, 'assets', 'images');
global.window = {};
eval(fs.readFileSync(path.join(CLASSIC_U2, 'data', 'vocabulary_data.js'), 'utf8'));
let foundSvg = 0;
window.VOCABULARY_DATA.forEach(item => {
  const padId = String(item.id).padStart(2, '0');
  const safeName = item.word.toLowerCase().replace(/[^a-z0-9]/g, '_');
  const svgFile = path.join(u2Images, `${padId}_${safeName}.svg`);
  if (fs.existsSync(svgFile)) foundSvg++;
});
assert(foundSvg === 48, `All 48 SVG visual cards exist in unit2/assets/images/ (${foundSvg}/48)`);

console.log('========================================');
console.log(`MODERN UNIT 2 TEST SUMMARY: ${passed} passed, ${failed} failed.`);
console.log('========================================');

if (failed > 0) process.exit(1);
