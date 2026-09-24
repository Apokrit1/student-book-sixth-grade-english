const fs = require('fs');

console.log('--- VERIFYING v2.html OFFLINE INTEGRATION ---');
const v2Html = fs.readFileSync('v2.html', 'utf-8');
const portalHtml = fs.readFileSync('../portal.html', 'utf-8');

function checkHtml(name, html, dataScript, appScript) {
  const matches = [...html.matchAll(/<script[^>]*src=["']([^"']+)["']/g)].map(m => m[1]);
  console.log(`${name} scripts:`, matches);
  const dataIdx = matches.indexOf(dataScript);
  const appIdx = matches.indexOf(appScript);
  if (dataIdx === -1) throw new Error(`${name} is missing ${dataScript}`);
  if (appIdx === -1) throw new Error(`${name} is missing ${appScript}`);
  if (dataIdx >= appIdx) throw new Error(`${name} has ${dataScript} after ${appScript}`);
  console.log(`[PASS] ${name} properly loads ${dataScript} before ${appScript}`);
}

checkHtml('v2.html', v2Html, 'data/unit1_v2_data.js', 'app_v2.js');
checkHtml('portal.html', portalHtml, 'data/coursebook_catalog.js', 'portal.js');

// Test synchronous execution of data.js and verify global variables
const sandbox = { window: {}, document: {}, console: console };
const vm = require('vm');
vm.createContext(sandbox);

const v2DataContent = fs.readFileSync('data/unit1_v2_data.js', 'utf-8');
vm.runInContext(v2DataContent, sandbox);
if (!sandbox.window.UNIT1_V2_DATA) throw new Error('UNIT1_V2_DATA not defined on window');
console.log('[PASS] window.UNIT1_V2_DATA loaded successfully with keys:', Object.keys(sandbox.window.UNIT1_V2_DATA));

const catalogContent = fs.readFileSync('../data/coursebook_catalog.js', 'utf-8');
vm.runInContext(catalogContent, sandbox);
if (!sandbox.window.COURSEBOOK_CATALOG) throw new Error('COURSEBOOK_CATALOG not defined on window');
console.log('[PASS] window.COURSEBOOK_CATALOG loaded successfully with units:', sandbox.window.COURSEBOOK_CATALOG.units.length);

// Strict Offline Verification: Ensure no external URLs (http:// or https://) in runtime app files
console.log('\n--- VERIFYING ZERO EXTERNAL URL CALLS (GDPR / NO-GOOGLE-CALLS) ---');
const runtimeFiles = [
  'v2.html',
  '../portal.html',
  'index.html',
  'style_v2.css',
  '../portal.css',
  'style.css',
  'assets/fonts/fonts.css',
  'app_v2.js',
  '../portal.js',
  'app.js',
  'data/unit1_v2_data.js',
  '../data/coursebook_catalog.js',
  'data/vocabulary_data.js'
];

let externalUrlViolations = 0;
for (const relPath of runtimeFiles) {
  if (fs.existsSync(relPath)) {
    const content = fs.readFileSync(relPath, 'utf-8');
    // Match http:// or https:// (ignoring static license metadata URIs like creativecommons.org)
    const allUrls = content.match(/https?:\/\/[^\s"'<>)]+/g) || [];
    const matches = allUrls.filter(u => !/^https:\/\/creativecommons\.org\//.test(u));
    if (matches && matches.length > 0) {
      console.error(`[FAIL] ${relPath} contains external URL(s):`, matches);
      externalUrlViolations += matches.length;
    } else {
      console.log(`[PASS] ${relPath} has 0 external network dependencies (100% offline)`);
    }
  }
}

if (externalUrlViolations > 0) {
  throw new Error(`Offline verification failed: ${externalUrlViolations} external URL(s) detected in client runtime files.`);
}

console.log('\nALL OFFLINE LOADING & PRIVACY VERIFICATIONS PASSED 100%!');
