/**
 * SUPERSEDED on 20 Sep 2026:
 * Neural audio generation is now unified inside generate_unit_audio.js:
 *   node ../.agents/skills/coursebook-unit-extender/scripts/generate_unit_audio.js vocab data/vocabulary_data.json --set neural
 * Composite full/ recordings have also been retired in favor of sequence playback.
 */

const fs = require('fs');
const path = require('path');
const { EdgeTTS } = require('node-edge-tts');

const vocabData = JSON.parse(fs.readFileSync('data/vocabulary_data.json', 'utf-8'));

// High quality British Neural AI Voice - warm, natural, human-like cadence
const VOICE_NAME = 'en-GB-SoniaNeural';

const baseDir = path.join('assets', 'audio_neural');
const dirs = [
  baseDir,
  path.join(baseDir, 'words'),
  path.join(baseDir, 'defs'),
  path.join(baseDir, 'examples')
];

dirs.forEach(d => {
  if (!fs.existsSync(d)) fs.mkdirSync(d, { recursive: true });
});

async function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

async function synthesizeFile(text, targetPath, maxRetries = 3) {
  if (fs.existsSync(targetPath) && fs.statSync(targetPath).size > 1000) {
    return true; // already successfully generated
  }

  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      const tts = new EdgeTTS({ voice: VOICE_NAME, timeout: 15000 });
      await tts.ttsPromise(text, targetPath);
      await sleep(100);
      if (fs.existsSync(targetPath) && fs.statSync(targetPath).size > 1000) {
        return true;
      }
    } catch (err) {
      console.warn(`[Attempt ${attempt}/${maxRetries}] Retrying ${targetPath}: ${err.message || err}`);
      await sleep(500 * attempt);
    }
  }
  return false;
}

async function run() {
  console.log(`Starting Natural Neural Voice generation (${VOICE_NAME}) for 35 items...`);
  let successCount = 0;
  
  for (let i = 0; i < vocabData.length; i++) {
    const item = vocabData[i];
    const padId = String(item.id).padStart(2, '0');
    console.log(`[${i + 1}/35] Processing neural voice for: ${item.word}`);

    // 1. Word
    const wordFile = path.join(baseDir, 'words', `${padId}_word.mp3`);
    await synthesizeFile(item.word, wordFile);

    // 2. Definition
    const defFile = path.join(baseDir, 'defs', `${padId}_definition.mp3`);
    await synthesizeFile(item.definition_en, defFile);

    // 3. Example
    const exFile = path.join(baseDir, 'examples', `${padId}_example.mp3`);
    await synthesizeFile(item.example, exFile);

    successCount++;
  }

  console.log(`Finished generating audio files for ${successCount} items!`);
}

// Auto-run disabled - superseded by generate_unit_audio.js
console.log('generate_neural_voice.js is superseded by generate_unit_audio.js (use --set neural).');
// run().catch(console.error);
