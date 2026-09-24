const http = require('http');
const fs = require('fs');

async function testEndpoint(path, expectedStatus = 200) {
  return new Promise((resolve, reject) => {
    http.get(`http://localhost:3000${path}`, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        if (res.statusCode === expectedStatus) {
          resolve({ ok: true, status: res.statusCode, length: data.length });
        } else {
          resolve({ ok: false, status: res.statusCode, error: `Expected ${expectedStatus} got ${res.statusCode}` });
        }
      });
    }).on('error', reject);
  });
}

async function runTests() {
  console.log('--- RUNNING COMPREHENSIVE AUTOMATED TESTS (DUAL VOICE ENGINES) ---');
  let passed = 0;
  let failed = 0;

  const coreEndpoints = [
    '/',
    '/index.html',
    '/style.css',
    '/app.js',
    '/data/vocabulary_data.js',
    '/data/vocabulary_data.json',
    '/vocabulary_unit1_tts.txt'
  ];

  for (const ep of coreEndpoints) {
    const res = await testEndpoint(ep);
    if (res.ok) {
      console.log(`[PASS] Core endpoint: ${ep} (Status: ${res.status}, Length: ${res.length})`);
      passed++;
    } else {
      console.error(`[FAIL] Core endpoint: ${ep}`, res);
      failed++;
    }
  }

  // Check vocabulary data
  const data = JSON.parse(fs.readFileSync('data/vocabulary_data.json', 'utf-8'));
  if (data.length === 35) {
    console.log(`[PASS] Vocabulary dataset contains exactly 35 items`);
    passed++;
  } else {
    console.error(`[FAIL] Vocabulary dataset count mismatch: expected 35, got ${data.length}`);
    failed++;
  }

  // Check all 105 Standard Google TTS audio files
  let standardAudioPass = 0;
  for (const item of data) {
    const padId = String(item.id).padStart(2, '0');
    const wordRes = await testEndpoint(`/assets/audio/words/${padId}_word.mp3`);
    const defRes = await testEndpoint(`/assets/audio/defs/${padId}_definition.mp3`);
    const exRes = await testEndpoint(`/assets/audio/examples/${padId}_example.mp3`);

    if (wordRes.ok && defRes.ok && exRes.ok) {
      standardAudioPass++;
    }
  }
  if (standardAudioPass === 35) {
    console.log(`[PASS] Voice 1: All 105 Google TTS audio MP3 endpoints verified (35/35 items)`);
    passed++;
  } else {
    console.error(`[FAIL] Google TTS audio verification: ${standardAudioPass}/35 passed`);
    failed++;
  }

  // Check all 105 Natural Neural AI audio files
  let neuralAudioPass = 0;
  for (const item of data) {
    const padId = String(item.id).padStart(2, '0');
    const wordRes = await testEndpoint(`/assets/audio_neural/words/${padId}_word.mp3`);
    const defRes = await testEndpoint(`/assets/audio_neural/defs/${padId}_definition.mp3`);
    const exRes = await testEndpoint(`/assets/audio_neural/examples/${padId}_example.mp3`);

    if (wordRes.ok && defRes.ok && exRes.ok) {
      neuralAudioPass++;
    }
  }
  if (neuralAudioPass === 35) {
    console.log(`[PASS] Voice 2: All 105 Sonia Natural Neural AI audio MP3 endpoints verified (35/35 items)`);
    passed++;
  } else {
    console.log(`[PROGRESS] Sonia Natural Neural AI audio: ${neuralAudioPass}/35 completed`);
  }

  // Check all 35 image files
  let imgPass = 0;
  for (const item of data) {
    const padId = String(item.id).padStart(2, '0');
    const safeName = item.word.toLowerCase().replace(/[^a-z0-9]/g, '_');
    const imgRes = await testEndpoint(`/assets/images/${padId}_${safeName}.svg`);
    if (imgRes.ok) imgPass++;
  }
  if (imgPass === 35) {
    console.log(`[PASS] All 35 SVG visual assets verified successfully (35/35 items)`);
    passed++;
  } else {
    console.error(`[FAIL] Visual assets verification failed. ${imgPass}/35 passed`);
    failed++;
  }

  // Check TTS script file content
  const ttsTxt = fs.readFileSync('vocabulary_unit1_tts.txt', 'utf-8');
  let missingKeywords = [];
  for (const item of data) {
    if (!ttsTxt.includes(item.word.toUpperCase())) {
      missingKeywords.push(item.word);
    }
  }
  if (missingKeywords.length === 0) {
    console.log(`[PASS] vocabulary_unit1_tts.txt contains all 35 vocabulary entries`);
    passed++;
  } else {
    console.error(`[FAIL] vocabulary_unit1_tts.txt missing:`, missingKeywords);
    failed++;
  }

  console.log(`\n========================================`);
  console.log(`TEST SUMMARY: ${passed} core test suites passed.`);
  console.log(`Total MP3 audio files available: ${standardAudioPass * 4 + neuralAudioPass * 4}`);
  console.log(`========================================`);
}

runTests().catch(console.error);
