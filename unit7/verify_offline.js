const fs = require('fs');
const path = require('path');
const vm = require('vm');

const failures = [];
let checks = 0;

function check(condition, message) {
  checks += 1;
  if (condition) console.log(`[PASS] ${message}`);
  else {
    failures.push(message);
    console.error(`[FAIL] ${message}`);
  }
}

function existing(relativePath) {
  return fs.existsSync(relativePath) && fs.statSync(relativePath).isFile();
}

function read(relativePath) {
  return fs.readFileSync(relativePath, 'utf8');
}

function unitFromLocation() {
  const v2HtmlPath = path.join(process.cwd(), 'v2.html');
  if (existing(v2HtmlPath)) {
    const match = read(v2HtmlPath).match(/<body[^>]*data-unit=["'](\d+)["']/i);
    if (match) return match[1];
  }
  const folder = path.basename(process.cwd()).match(/^unit(\d+)$/i);
  return folder ? folder[1] : '';
}

function scriptsIn(html) {
  return [...html.matchAll(/<script[^>]*src=["']([^"']+)["']/g)].map(match => match[1]);
}

function unwrapTwin(source, globalName) {
  const pattern = new RegExp(`^[\\s\\S]*?window\\.${globalName}\\s*=\\s*`);
  return source.replace(pattern, '').replace(/;\s*$/, '');
}

function checkScriptOrder(label, html, dataScript, appScript) {
  const scripts = scriptsIn(html);
  const dataIndex = scripts.indexOf(dataScript);
  const appIndex = scripts.indexOf(appScript);
  check(dataIndex >= 0, `${label} loads ${dataScript}`);
  check(appIndex >= 0, `${label} loads ${appScript}`);
  check(dataIndex >= 0 && appIndex > dataIndex, `${label} loads data before application code`);
}

function loadGlobal(relativePath, globalName) {
  if (!existing(relativePath)) return null;
  const sandbox = { window: {} };
  vm.createContext(sandbox);
  vm.runInContext(read(relativePath), sandbox, { filename: relativePath });
  return sandbox.window[globalName] ?? null;
}

function sameData(jsonObject, jsObject) {
  return JSON.stringify(jsonObject) === JSON.stringify(jsObject);
}

function checkUrls(relativePath, dataFile) {
  if (!existing(relativePath)) {
    check(false, `Required runtime file exists: ${relativePath}`);
    return;
  }
  const urls = read(relativePath).match(/https?:\/\/[^\s"'<>)]+/g) || [];
  const invalid = dataFile ? urls.filter(url => !/^https:\/\/creativecommons\.org\//.test(url)) : urls;
  check(invalid.length === 0, `${relativePath} has no runtime external URL${dataFile ? ' except exact Creative Commons licence text' : ''}`);
}

const unitNum = unitFromLocation();
check(/^\d+$/.test(unitNum), `Unit number resolves from data-unit or folder name: ${unitNum || 'missing'}`);

const required = ['index.html', 'app.js', 'style.css', 'v2.html', 'app_v2.js', 'style_v2.css'];
required.forEach(file => check(existing(file) && fs.statSync(file).size > 0, `Required shell file exists and is non-empty: ${file}`));

if (/^\d+$/.test(unitNum)) {
  const v2Json = `data/unit${unitNum}_v2_data.json`;
  const v2Js = `data/unit${unitNum}_v2_data.js`;
  const vocabJson = 'data/vocabulary_data.json';
  const vocabJs = 'data/vocabulary_data.js';
  [v2Json, v2Js, vocabJson, vocabJs].forEach(file => check(existing(file) && fs.statSync(file).size > 0, `Required data file exists and is non-empty: ${file}`));

  if (required.every(existing) && existing(v2Json) && existing(v2Js) && existing(vocabJson) && existing(vocabJs)) {
    const v2JsonData = JSON.parse(read(v2Json));
    const v2JsData = loadGlobal(v2Js, `UNIT${unitNum}_V2_DATA`);
    const vocabJsonData = JSON.parse(read(vocabJson));
    const vocabJsData = loadGlobal(vocabJs, 'VOCABULARY_DATA');
    check(Boolean(v2JsData), `window.UNIT${unitNum}_V2_DATA loads from the JS twin`);
    check(Array.isArray(vocabJsData), 'window.VOCABULARY_DATA loads from the JS twin');
    check(sameData(v2JsonData, v2JsData), `${v2Json} and ${v2Js} are semantically identical`);
    check(sameData(vocabJsonData, vocabJsData), `${vocabJson} and ${vocabJs} are semantically identical`);

    const workbookJson = `data/unit${unitNum}_workbook_data.json`;
    const workbookJs = `data/unit${unitNum}_workbook_data.js`;
    if (existing(workbookJson) || existing(workbookJs)) {
      check(existing(workbookJson) && existing(workbookJs), 'Workbook JSON and JS twin both exist when Workbook is supplied');
      if (existing(workbookJson) && existing(workbookJs)) {
        const workbookJsonData = JSON.parse(read(workbookJson));
        const workbookJsData = loadGlobal(workbookJs, `UNIT${unitNum}_WORKBOOK_DATA`);
        check(Boolean(workbookJsData), `window.UNIT${unitNum}_WORKBOOK_DATA loads from the JS twin`);
        check(sameData(workbookJsonData, workbookJsData), `${workbookJson} and ${workbookJs} are semantically identical`);
      }
    }
  }

  if (existing('index.html')) checkScriptOrder('index.html', read('index.html'), 'data/vocabulary_data.js', 'app.js');
  if (existing('v2.html')) checkScriptOrder('v2.html', read('v2.html'), 'data/vocabulary_data.js', 'app_v2.js');
  if (existing('app_v2.js')) {
    const source = read('app_v2.js');
    check(source.indexOf('window[v2DataKey]') < source.indexOf('fetch(`data/unit${unitNum}_v2_data.json`)'), 'app_v2.js checks the JS twin before any JSON fetch');
    check(source.includes('playAudioSequence') && source.includes('audioQueue = []') && source.includes('setTimeout(playNext, 350)'), 'app_v2.js keeps the queued three-part audio design with a 350 ms pause');
  }
  if (existing('app.js')) {
    const source = read('app.js');
    check(source.includes('playSequence') && source.includes('audioQueue = []') && source.includes('setTimeout(playNext, 350)'), 'app.js keeps the queued three-part audio design with a 350 ms pause');
  }
}

['index.html', 'app.js', 'style.css', 'v2.html', 'app_v2.js', 'style_v2.css'].forEach(file => checkUrls(file, false));
if (existing('data/vocabulary_data.js')) checkUrls('data/vocabulary_data.js', true);
if (/^\d+$/.test(unitNum)) {
  if (existing(`data/unit${unitNum}_v2_data.js`)) checkUrls(`data/unit${unitNum}_v2_data.js`, true);
  if (existing(`data/unit${unitNum}_workbook_data.js`)) checkUrls(`data/unit${unitNum}_workbook_data.js`, true);
}
if (existing('../portal.html')) checkUrls('../portal.html', false);
if (existing('../portal.js')) checkUrls('../portal.js', false);
if (existing('../portal.css')) checkUrls('../portal.css', false);

if (existing('style.css')) check(read('style.css').includes("../assets/fonts/fonts.css"), 'style.css loads shared fonts from ../assets/fonts/fonts.css');
if (existing('style_v2.css')) check(read('style_v2.css').includes("../assets/fonts/fonts.css"), 'style_v2.css loads shared fonts from ../assets/fonts/fonts.css');

console.log(`\nOFFLINE VERIFICATION SUMMARY: ${checks - failures.length} passed, ${failures.length} failed.`);
if (failures.length) {
  failures.forEach(failure => console.error(`- ${failure}`));
  process.exit(1);
}
