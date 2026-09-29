/**
 * Coursebook Unit Extender - Audio Synthesis Helper
 * Generates natural speech for words, stories, and multi-speaker dialogues.
 * Supports both Google TTS (standard) and Microsoft Edge TTS (neural British AI).
 * 
 * Usage: node generate_unit_audio.js <command> [args...] [options]
 * Commands:
 *   - dialogue <dialogue-json-file> <output-mp3> [options]
 *   - story <story-text-file> <output-mp3> [voice]
 *   - vocab <vocab-json-file> [output-dir] [options]
 * 
 * Vocab Options:
 *   --set google|neural|both  Engine/voice set (default: both)
 *                             google -> assets/audio/, neural -> assets/audio_neural/
 *   --only words,defs,examples,full
 *                             Comma-separated list of clip categories (default: all four)
 *   --ids 1,22,29             Comma-separated list of target item IDs (default: all)
 *   --check                   Audit mode: record nothing, verify existence and sidecar
 *                             matching against vocabulary_data.json, exit 1 if drifted/missing
 *   --force                   Regenerate audio even if MP3 files already exist
 *   --adopt-existing          Accept existing MP3s with no sidecar and write sidecar
 *                             (Use only after human confirmation)
 * 
 * Voice Note for Teachers & Authors:
 * en-GB-ThomasNeural is an adult male voice. Microsoft Edge TTS currently provides
 * no young British boy voice (only young girl en-GB-MaisieNeural). Therefore,
 * male pupils such as Markos sound adult next to Maisie. This is an accepted
 * platform limitation.
 */

const fs = require('fs');
const path = require('path');
const { spawnSync } = require('child_process');

let EdgeTTS = null;
try {
  const edgeTtsModule = require('node-edge-tts');
  EdgeTTS = edgeTtsModule.EdgeTTS;
} catch (e) {
  const local = path.join(process.cwd(), 'node_modules', 'node-edge-tts');
  if (fs.existsSync(local)) EdgeTTS = require(local).EdgeTTS;
}

let googleTTS = null;
try {
  googleTTS = require('google-tts-api');
} catch (e) {
  const local = path.join(process.cwd(), 'node_modules', 'google-tts-api');
  if (fs.existsSync(local)) googleTTS = require(local);
}

// Global flag for adopting existing unverified files (use with care)
let ADOPT_EXISTING = false;

const DEFAULT_VOICES = {
  narrator: 'en-GB-SoniaNeural',
  teacher: 'en-GB-RyanNeural',
  student_f1: 'en-GB-MaisieNeural', // Maria / young girl
  student_f2: 'en-GB-LibbyNeural',  // Anne
  student_m1: 'en-GB-ThomasNeural'  // Markos (adult male timbre - Edge TTS platform limitation)
};

async function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

function checkFfmpegAvailable() {
  try {
    const res = spawnSync('ffmpeg', ['-version'], { stdio: 'ignore', shell: true });
    return res.status === 0;
  } catch (e) {
    return false;
  }
}

/**
 * Synthesizes neural speech with EdgeTTS and maintains a .txt sidecar with exact voiced text.
 */
async function synthesizeTextNeural(text, targetPath, voice = DEFAULT_VOICES.narrator, force = false, retries = 3) {
  const adopt = ADOPT_EXISTING;
  const cleanText = (text || '').trim();
  const sidecarPath = targetPath.replace(/\.mp3$/i, '.txt');
  const dir = path.dirname(targetPath);
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });

  if (!force && fs.existsSync(targetPath) && fs.statSync(targetPath).size > 1000) {
    if (fs.existsSync(sidecarPath)) {
      const existingText = fs.readFileSync(sidecarPath, 'utf-8').trim();
      if (existingText === cleanText) {
        console.log(`[EXISTS & MATCHES] ${targetPath}`);
        return true;
      }
      console.log(`[TEXT CHANGED vs SIDECAR] Re-synthesizing ${targetPath}...`);
    } else if (adopt) {
      fs.writeFileSync(sidecarPath, cleanText, 'utf-8');
      console.log(`[ADOPTED EXISTING (SIDECAR CREATED)] ${targetPath}`);
      return true;
    } else {
      console.log(`[NO SIDECAR: RE-VOICING] ${targetPath}`);
    }
  }

  if (!EdgeTTS) {
    console.warn(`[WARN] node-edge-tts not available, skipping synthesis for: ${targetPath}`);
    return false;
  }

  for (let attempt = 1; attempt <= retries; attempt++) {
    try {
      const tts = new EdgeTTS({ voice, timeout: 25000 });
      await tts.ttsPromise(cleanText, targetPath);
      await sleep(150);
      if (fs.existsSync(targetPath) && fs.statSync(targetPath).size > 1000) {
        fs.writeFileSync(sidecarPath, cleanText, 'utf-8');
        console.log(`[NEURAL GENERATED] ${targetPath} (${fs.statSync(targetPath).size} bytes) [${voice}]`);
        return true;
      }
    } catch (err) {
      console.warn(`[RETRY ${attempt}] Neural failed for ${targetPath}: ${err.message || err}`);
      await sleep(500 * attempt);
    }
  }
  return false;
}

/**
 * Synthesizes standard speech with Google TTS and maintains a .txt sidecar with exact voiced text.
 */
async function synthesizeTextGoogle(text, targetPath, force = false, retries = 3) {
  const adopt = ADOPT_EXISTING;
  const cleanText = (text || '').trim();
  const sidecarPath = targetPath.replace(/\.mp3$/i, '.txt');
  const dir = path.dirname(targetPath);
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });

  if (!force && fs.existsSync(targetPath) && fs.statSync(targetPath).size > 500) {
    if (fs.existsSync(sidecarPath)) {
      const existingText = fs.readFileSync(sidecarPath, 'utf-8').trim();
      if (existingText === cleanText) {
        console.log(`[EXISTS & MATCHES] ${targetPath}`);
        return true;
      }
      console.log(`[TEXT CHANGED vs SIDECAR] Re-synthesizing ${targetPath}...`);
    } else if (adopt) {
      fs.writeFileSync(sidecarPath, cleanText, 'utf-8');
      console.log(`[ADOPTED EXISTING (SIDECAR CREATED)] ${targetPath}`);
      return true;
    } else {
      console.log(`[NO SIDECAR: RE-VOICING] ${targetPath}`);
    }
  }

  if (!googleTTS) {
    console.error(`[ERROR] google-tts-api not available for: ${targetPath}`);
    return false;
  }

  for (let attempt = 1; attempt <= retries; attempt++) {
    try {
      const b64 = await googleTTS.getAudioBase64(cleanText, { lang: 'en', slow: false });
      const buffer = Buffer.from(b64, 'base64');
      if (buffer.length > 500) {
        fs.writeFileSync(targetPath, buffer);
        fs.writeFileSync(sidecarPath, cleanText, 'utf-8');
        console.log(`[GOOGLE GENERATED] ${targetPath} (${buffer.length} bytes)`);
        await sleep(150);
        return true;
      }
    } catch (err) {
      console.warn(`[RETRY ${attempt}] Google TTS failed for ${targetPath}: ${err.message || err}`);
      await sleep(500 * attempt);
    }
  }
  return false;
}

async function handleVocab(vocabFile, positionalOutDir, opts) {
  if (!fs.existsSync(vocabFile)) {
    console.error(`Vocab file not found: ${vocabFile}`);
    process.exit(1);
  }

  const vocabData = JSON.parse(fs.readFileSync(vocabFile, 'utf-8'));
  let list = Array.isArray(vocabData) ? vocabData : (vocabData.vocabulary || []);

  if (opts.ids && opts.ids.length > 0) {
    list = list.filter(item => opts.ids.includes(Number(item.id)));
  }

  // Resolve base unit dir
  let unitDir = path.dirname(path.resolve(vocabFile));
  if (path.basename(unitDir).toLowerCase() === 'data') {
    unitDir = path.dirname(unitDir);
  }

  // Determine sets
  const sets = [];
  const requestedSet = (opts.set || 'both').toLowerCase();
  if (requestedSet === 'google' || requestedSet === 'both') {
    const outDir = (positionalOutDir && requestedSet === 'google') ? path.resolve(positionalOutDir) : path.join(unitDir, 'assets', 'audio');
    sets.push({
      name: 'google',
      dir: outDir,
      synth: (text, file, force) => synthesizeTextGoogle(text, file, force)
    });
  }
  if (requestedSet === 'neural' || requestedSet === 'both') {
    const outDir = (positionalOutDir && requestedSet === 'neural') ? path.resolve(positionalOutDir) : path.join(unitDir, 'assets', 'audio_neural');
    sets.push({
      name: 'neural',
      dir: outDir,
      synth: (text, file, force) => synthesizeTextNeural(text, file, DEFAULT_VOICES.narrator, force)
    });
  }

  if (opts.only && opts.only.includes('full')) {
    console.error('Composite clips were retired on 20 Sep 2026; vocabulary entries now sequence word, definition, and example dynamically.');
    process.exit(1);
  }

  const onlyCats = opts.only || ['words', 'defs', 'examples'];

  if (opts.check) {
    console.log(`[CHECK MODE] Auditing clips and sidecars for ${list.length} item(s) across set(s) [${sets.map(s => s.name).join(', ')}]...`);
    const issues = [];
    let totalChecked = 0;

    for (const s of sets) {
      for (const item of list) {
        const id = item.id;
        const padId = String(id).padStart(2, '0');

        const tasks = [
          { cat: 'words', file: `${padId}_word.mp3`, expected: item.word },
          { cat: 'defs', file: `${padId}_definition.mp3`, expected: item.definition_en },
          { cat: 'examples', file: `${padId}_example.mp3`, expected: item.example }
        ].filter(t => onlyCats.includes(t.cat));

        for (const t of tasks) {
          totalChecked++;
          const mp3Path = path.join(s.dir, t.cat, t.file);
          const txtPath = mp3Path.replace(/\.mp3$/i, '.txt');
          const cleanExpected = (t.expected || '').trim();

          if (!fs.existsSync(mp3Path) || fs.statSync(mp3Path).size < 500) {
            issues.push(`[MISSING MP3] (${s.name}) ${mp3Path}`);
            continue;
          }
          if (!fs.existsSync(txtPath)) {
            issues.push(`[MISSING SIDECAR] (${s.name}) ${txtPath}`);
            continue;
          }
          const actualText = fs.readFileSync(txtPath, 'utf-8').trim();
          if (actualText !== cleanExpected) {
            issues.push(`[DRIFTED] (${s.name}) ${mp3Path}\n    Expected: "${cleanExpected}"\n    Found:    "${actualText}"`);
          }
        }
      }
    }

    if (issues.length > 0) {
      console.error(`\n[CHECK FAILED] Found ${issues.length} issue(s):`);
      issues.forEach(iss => console.error(`  - ${iss}`));
      process.exitCode = 1;
    } else {
      console.log(`\n[CHECK CLEAN] All ${totalChecked} checked clips and sidecars match current vocabulary data.`);
      process.exitCode = 0;
    }
    return;
  }

  // Generation mode
  console.log(`Synthesizing audio for ${list.length} vocabulary items across set(s) [${sets.map(s => s.name).join(', ')}] (only: ${onlyCats.join(',')}, force=${opts.force})...`);

  const failures = [];
  const track = async (ok, file) => { if (!ok) failures.push(file); };

  for (const s of sets) {
    const dirs = {
      words: path.join(s.dir, 'words'),
      defs: path.join(s.dir, 'defs'),
      examples: path.join(s.dir, 'examples')
    };
    Object.values(dirs).forEach(d => {
      if (!fs.existsSync(d)) fs.mkdirSync(d, { recursive: true });
    });

    for (let i = 0; i < list.length; i++) {
      const item = list[i];
      const id = item.id || (i + 1);
      const padId = String(id).padStart(2, '0');

      console.log(`[${s.name.toUpperCase()}] [${i + 1}/${list.length}] #${padId}: "${item.word}"`);

      if (onlyCats.includes('words')) {
        const wordFile = path.join(dirs.words, `${padId}_word.mp3`);
        await track(await s.synth(item.word, wordFile, opts.force), wordFile);
      }

      if (onlyCats.includes('defs')) {
        const defFile = path.join(dirs.defs, `${padId}_definition.mp3`);
        await track(await s.synth(item.definition_en, defFile, opts.force), defFile);
      }

      if (onlyCats.includes('examples')) {
        const exFile = path.join(dirs.examples, `${padId}_example.mp3`);
        await track(await s.synth(item.example, exFile, opts.force), exFile);
      }
    }
  }

  if (failures.length) {
    console.error(`\n[VOCAB INCOMPLETE] ${failures.length} recording(s) FAILED and are missing or stale:`);
    failures.forEach(f => console.error(`   - ${f}`));
    process.exitCode = 1;
  } else {
    console.log(`\n[VOCAB COMPLETE] All requested recordings are present and match the text.`);
  }
}

async function handleStory(storyFile, outMp3, voiceArg, force) {
  if (!fs.existsSync(storyFile)) {
    console.error(`Story file not found: ${storyFile}`);
    process.exit(1);
  }

  const text = fs.readFileSync(storyFile, 'utf-8');
  const voice = voiceArg || DEFAULT_VOICES.narrator;
  const ok = await synthesizeTextNeural(text, outMp3, voice, force);
  if (!ok) { console.error(`[STORY FAILED] ${outMp3}`); process.exitCode = 1; }
}

async function handleDialogue(scriptFile, outMp3, force) {
  if (!fs.existsSync(scriptFile)) {
    console.error(`Dialogue file not found: ${scriptFile}`);
    process.exit(1);
  }

  const raw = JSON.parse(fs.readFileSync(scriptFile, 'utf-8'));
  let turns = [];
  let customVoices = {};

  if (Array.isArray(raw)) {
    turns = raw;
  } else if (raw.grammar_lab && raw.grammar_lab.school_lab_listening) {
    turns = raw.grammar_lab.school_lab_listening.dialogue_script || [];
    customVoices = raw.speaker_voices || raw.grammar_lab.school_lab_listening.speaker_voices || {};
  } else if (raw.dialogue_script) {
    turns = raw.dialogue_script;
    customVoices = raw.speaker_voices || {};
  } else {
    console.error('Invalid dialogue format. Expected array of turns or object with dialogue_script.');
    process.exit(1);
  }

  const fullDialogueScript = turns.map(t => `${t.speaker}: ${t.text}`).join('\n');
  const dialogueSidecar = outMp3.replace(/\.mp3$/i, '.txt');

  if (!force && fs.existsSync(outMp3) && fs.statSync(outMp3).size > 1000) {
    if (fs.existsSync(dialogueSidecar)) {
      const existingText = fs.readFileSync(dialogueSidecar, 'utf-8').trim();
      if (existingText === fullDialogueScript.trim()) {
        console.log(`[EXISTS & MATCHES] ${outMp3}`);
        return;
      }
      console.log(`[TEXT CHANGED vs SIDECAR] Re-synthesizing dialogue ${outMp3}...`);
    } else if (ADOPT_EXISTING) {
      fs.writeFileSync(dialogueSidecar, fullDialogueScript, 'utf-8');
      console.log(`[ADOPTED EXISTING (SIDECAR CREATED)] ${outMp3}`);
      return;
    } else {
      console.log(`[NO SIDECAR: RE-VOICING DIALOGUE] ${outMp3} (use --adopt-existing to keep a checked recording)`);
    }
  }

  const speakerVoiceMap = { ...DEFAULT_VOICES, ...customVoices };
  const tempDir = path.join(path.dirname(outMp3), '__temp_dialogue');
  if (!fs.existsSync(tempDir)) fs.mkdirSync(tempDir, { recursive: true });

  const chunkFiles = [];
  for (let i = 0; i < turns.length; i++) {
    const turn = turns[i];
    const speaker = (turn.speaker || '').trim();
    const speakerLower = speaker.toLowerCase();

    let voice = speakerVoiceMap.narrator;

    if (speakerVoiceMap[speakerLower]) {
      voice = speakerVoiceMap[speakerLower];
    } else if (speakerVoiceMap[speaker]) {
      voice = speakerVoiceMap[speaker];
    } else if (speakerLower.includes('teacher')) {
      voice = speakerVoiceMap.teacher;
    } else if (speakerLower.includes('maria') || speakerLower.includes('girl')) {
      voice = speakerVoiceMap.student_f1;
    } else if (speakerLower.includes('markos') || speakerLower.includes('boy')) {
      voice = speakerVoiceMap.student_m1;
    } else if (speakerLower.includes('anne')) {
      voice = speakerVoiceMap.student_f2;
    } else if (speakerLower.includes('sophia')) {
      voice = speakerVoiceMap.narrator;
    }

    const chunkPath = path.join(tempDir, `turn_${String(i).padStart(2, '0')}.mp3`);
    const ok = await synthesizeTextNeural(turn.text, chunkPath, voice, true);
    if (!ok) {
      console.error(`[CHUNK FAILED] ${chunkPath}`);
      process.exitCode = 1;
      return;
    }
    chunkFiles.push(chunkPath);
  }

  // Stitch chunks
  const hasFfmpeg = checkFfmpegAvailable();
  if (hasFfmpeg) {
    const listFile = path.join(tempDir, 'concat_list.txt');
    const listContent = chunkFiles
      .map(f => `file '${path.resolve(f).replace(/\\/g, '/')}'`)
      .join('\n');
    fs.writeFileSync(listFile, listContent, 'utf-8');

    const outDir = path.dirname(outMp3);
    if (!fs.existsSync(outDir)) fs.mkdirSync(outDir, { recursive: true });

    const ffmpegRes = spawnSync('ffmpeg', ['-y', '-f', 'concat', '-safe', '0', '-i', listFile, '-c', 'copy', outMp3], {
      stdio: 'pipe',
      shell: true
    });

    if (ffmpegRes.status === 0 && fs.existsSync(outMp3)) {
      console.log(`[MERGED DIALOGUE WITH FFMPEG] ${outMp3} (${fs.statSync(outMp3).size} bytes, ${chunkFiles.length} turns)`);
    } else {
      console.warn('[WARN] ffmpeg concat failed, falling back to Buffer.concat:', ffmpegRes.stderr ? ffmpegRes.stderr.toString() : '');
      const buffers = chunkFiles.map(f => fs.readFileSync(f));
      const merged = Buffer.concat(buffers);
      fs.writeFileSync(outMp3, merged);
      console.log(`[MERGED DIALOGUE (FALLBACK BUFFER)] ${outMp3} (${merged.length} bytes, ${chunkFiles.length} turns)`);
    }
  } else {
    const buffers = chunkFiles.map(f => fs.readFileSync(f));
    const merged = Buffer.concat(buffers);
    fs.writeFileSync(outMp3, merged);
    console.log(`[MERGED DIALOGUE WITH BUFFER] ${outMp3} (${merged.length} bytes, ${chunkFiles.length} turns)`);
  }

  // Write full dialogue sidecar
  fs.writeFileSync(dialogueSidecar, fullDialogueScript, 'utf-8');

  // Clean up temp chunks
  chunkFiles.forEach(f => {
    if (fs.existsSync(f)) fs.unlinkSync(f);
    const sc = f.replace(/\.mp3$/i, '.txt');
    if (fs.existsSync(sc)) fs.unlinkSync(sc);
  });
  const listFile = path.join(tempDir, 'concat_list.txt');
  if (fs.existsSync(listFile)) fs.unlinkSync(listFile);
  if (fs.existsSync(tempDir)) fs.rmdirSync(tempDir);
}

function parseOptions(argv) {
  const opts = {
    set: 'both',
    only: null,
    ids: null,
    check: false,
    force: false,
    adoptExisting: false,
    help: false,
    positional: []
  };

  for (let i = 0; i < argv.length; i++) {
    const arg = argv[i];
    if (arg === '--force') {
      opts.force = true;
    } else if (arg === '--adopt-existing') {
      opts.adoptExisting = true;
    } else if (arg === '--check') {
      opts.check = true;
    } else if (arg === '--set') {
      opts.set = argv[++i];
    } else if (arg.startsWith('--set=')) {
      opts.set = arg.slice(6);
    } else if (arg === '--only') {
      opts.only = argv[++i].split(',').map(s => s.trim().toLowerCase());
    } else if (arg.startsWith('--only=')) {
      opts.only = arg.slice(7).split(',').map(s => s.trim().toLowerCase());
    } else if (arg === '--ids') {
      opts.ids = argv[++i].split(',').map(s => parseInt(s.trim(), 10)).filter(n => !isNaN(n));
    } else if (arg.startsWith('--ids=')) {
      opts.ids = arg.slice(6).split(',').map(s => parseInt(s.trim(), 10)).filter(n => !isNaN(n));
    } else if (arg === '--help' || arg === '-h') {
      opts.help = true;
    } else if (!arg.startsWith('--')) {
      opts.positional.push(arg);
    }
  }

  return opts;
}

async function main() {
  const opts = parseOptions(process.argv.slice(2));
  ADOPT_EXISTING = opts.adoptExisting;

  const [cmd, arg1, arg2, arg3] = opts.positional;

  if (opts.help || !cmd) {
    console.log('Usage: node generate_unit_audio.js <command> [args...] [options]');
    console.log('Commands:');
    console.log('  dialogue <script-file> <output-mp3>');
    console.log('  story <story-txt-file> <output-mp3> [voice]');
    console.log('  vocab <vocab-json-file> [output-dir] [options]');
    console.log('\nVocab Options:');
    console.log('  --set google|neural|both   Audio engine/set (default: both)');
    console.log('  --only words,defs,examples Comma-separated list of clip categories (default: all three)');
    console.log('                             Note: composite full/ clips were retired on 20 Sep 2026');
    console.log('  --ids 1,22,29              Comma-separated item IDs to process');
    console.log('  --check                    Audit mode: verify existence and sidecar matching');
    console.log('  --force                    Regenerate audio even if MP3 exists');
    console.log('  --adopt-existing           Accept existing MP3s with no sidecar');
    process.exit(opts.help ? 0 : 1);
  }

  if (cmd === 'story') {
    await handleStory(arg1, arg2 || 'story.mp3', arg3, opts.force);
  } else if (cmd === 'dialogue') {
    await handleDialogue(arg1, arg2 || 'dialogue.mp3', opts.force);
  } else if (cmd === 'vocab') {
    // If positional arg2 is provided, check if it was intended as output-dir
    let posOut = arg2;
    if (posOut && (posOut.startsWith('--') || posOut === 'undefined')) {
      posOut = undefined;
    }
    await handleVocab(arg1, posOut, opts);
  } else {
    console.error(`Unknown command: ${cmd}`);
    process.exit(1);
  }
}

main().catch(err => {
  console.error('[FATAL]', err);
  process.exit(1);
});
