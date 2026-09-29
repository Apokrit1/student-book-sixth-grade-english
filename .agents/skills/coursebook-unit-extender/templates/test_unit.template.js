/**
 * Regression Test Suite Template for Coursebook Units (Version 2)
 * Asserts all quality criteria from the Pedagogical Standard (§K & Stage 2 Review).
 * Usage: node test_unit.js [unitNumber]
 */

const fs = require('fs');
const path = require('path');

const unitNum = process.argv[2] || '1';
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

async function runUnitTests() {
  console.log(`=== RUNNING UNIT ${unitNum} REGRESSION SUITE ===`);

  const v2JsonPath = `data/unit${unitNum}_v2_data.json`;
  const v2JsPath = `data/unit${unitNum}_v2_data.js`;
  const vocabJsonPath = `data/vocabulary_data.json`;

  assert(fs.existsSync(v2JsonPath), `V2 JSON exists: ${v2JsonPath}`);
  assert(fs.existsSync(v2JsPath), `V2 JS twin exists: ${v2JsPath}`);
  assert(fs.existsSync(vocabJsonPath), `Vocabulary data exists: ${vocabJsonPath}`);

  if (!fs.existsSync(v2JsonPath) || !fs.existsSync(vocabJsonPath)) {
    console.error('Core files missing, aborting test.');
    process.exit(1);
  }

  const uData = JSON.parse(fs.readFileSync(v2JsonPath, 'utf-8'));
  const coreVocab = JSON.parse(fs.readFileSync(vocabJsonPath, 'utf-8'));

  // Criterion 1: Semantic Landmark Vocabulary Bindings & Story Ownership
  console.log('\n--- Checking Landmark Lexical Bindings ---');
  (uData.stories || []).forEach(story => {
    (story.landmarks || []).forEach(lm => {
      if (lm.word_key || lm.word_id) {
        let vItem = null;
        if (lm.word_key) {
          vItem = coreVocab.find(v => v.word.toLowerCase() === lm.word_key.toLowerCase());
        }
        if (!vItem && lm.word_id) {
          vItem = coreVocab.find(v => v.id === lm.word_id);
        }
        assert(vItem !== null && vItem !== undefined,
          `Landmark "${lm.name}" (${story.country || story.student}) resolves to vocabulary: ${lm.word_key || lm.word_id}`);

        if (vItem && story.vocabulary_ids) {
          const isOwned = story.vocabulary_ids.includes(vItem.id);
          assert(isOwned,
            `Word "${vItem.word}" (id:${vItem.id}) is owned by ${story.country || story.student}'s vocabulary_ids`);
        }
      } else {
        assert(lm.word_key === null && lm.word_id === null,
          `Landmark "${lm.name}" cleanly has null pill (no false core-word forced)`);
      }
    });
  });

  // Criterion 2: Repeatable Dynamic Action in Frequency Spectrum (Fixed Regex)
  console.log('\n--- Checking Frequency Spectrum Actions ---');
  if (uData.grammar_lab && uData.grammar_lab.frequency_spectrum) {
    uData.grammar_lab.frequency_spectrum.forEach(f => {
      // Flag permanent geographical border claims
      assert(!/\bborders?\b/i.test(f.example),
        `Frequency example for "${f.adverb}" avoids permanent border facts: "${f.example}"`);
      
      // Warn if potential stative verbs appear
      const stative = f.example.match(/\b(is|are|am|be|belongs?)\b/i);
      if (stative) {
        console.warn(`[WARN] Frequency item "${f.adverb}" contains "${stative[0]}": "${f.example}". Verify dynamic repeatable usage.`);
      }
    });
  }

  // Criterion 3: Core Target Verbs in Lab Activity
  console.log('\n--- Checking Target Verbs ---');
  if (uData.grammar_lab && uData.grammar_lab.school_lab_listening) {
    const labStr = JSON.stringify(uData.grammar_lab).toLowerCase();
    const targetVerbs = uData.grammar_lab.school_lab_listening.target_verbs || [];
    targetVerbs.forEach(tv => {
      assert(labStr.includes(tv.verb.toLowerCase()),
        `Lab activity includes core target verb "${tv.verb}"`);
    });
  }

  // Criterion 4: Vocabulary Audio Veracity, Sidecar Parity & Media
  console.log('\n--- Checking Audio Assets & Sidecar Veracity (3 Clips, No Full Composite) ---');
  const voiceSets = [
    { name: 'Standard Google TTS', dir: 'assets/audio' },
    { name: 'Natural Neural AI TTS', dir: 'assets/audio_neural' }
  ];

  let missingClips = 0;
  let missingSidecars = 0;
  let driftedSidecars = 0;

  (coreVocab || []).forEach(v => {
    const padId = String(v.id).padStart(2, '0');
    const clips = [
      { cat: 'words', file: `${padId}_word.mp3`, expected: v.word },
      { cat: 'defs', file: `${padId}_definition.mp3`, expected: v.definition_en },
      { cat: 'examples', file: `${padId}_example.mp3`, expected: v.example }
    ];

    voiceSets.forEach(vs => {
      clips.forEach(c => {
        const mp3Path = `${vs.dir}/${c.cat}/${c.file}`;
        const txtPath = mp3Path.replace(/\.mp3$/i, '.txt');
        const cleanExpected = (c.expected || '').trim();

        if (!fs.existsSync(mp3Path) || fs.statSync(mp3Path).size < 500) {
          missingClips++;
          assert(false, `[MISSING MP3] (${vs.name}) ${mp3Path}`);
        }
        if (!fs.existsSync(txtPath)) {
          missingSidecars++;
          assert(false, `[MISSING SIDECAR] (${vs.name}) ${txtPath}`);
        } else {
          const actualText = fs.readFileSync(txtPath, 'utf-8').trim();
          if (actualText !== cleanExpected) {
            driftedSidecars++;
            assert(false, `[DRIFTED] (${vs.name}) ${mp3Path} expected "${cleanExpected}" got "${actualText}"`);
          }
        }
      });
    });
  });

  assert(missingClips === 0, `All vocabulary clips exist across both voice sets (${coreVocab.length * 6} clips, 0 missing)`);
  assert(missingSidecars === 0, `All vocabulary clips have matching .txt sidecars (0 missing)`);
  assert(driftedSidecars === 0, `All vocabulary sidecars match vocabulary_data.json verbatim (0 drifted)`);

  (uData.stories || []).forEach(s => {
    const storyMp3 = `assets/audio_v2/stories/${s.id}_full_story.mp3`;
    assert(fs.existsSync(storyMp3), `Story narration audio exists: ${storyMp3}`);
  });

  if (uData.grammar_lab && uData.grammar_lab.school_lab_listening && uData.grammar_lab.school_lab_listening.audio_file) {
    const dialMp3 = uData.grammar_lab.school_lab_listening.audio_file;
    assert(fs.existsSync(dialMp3), `Dialogue audio exists: ${dialMp3}`);
  }

  // Assert no runtime file references a composite full/ path
  const runtimeAudioFiles = ['v2.html', 'app_v2.js', 'style_v2.css', 'index.html', 'app.js', 'style.css'];
  runtimeAudioFiles.forEach(rf => {
    if (fs.existsSync(rf)) {
      const content = fs.readFileSync(rf, 'utf-8');
      const hasFullAudio = /assets\/audio(?:_neural)?\/full\//i.test(content) || /['"]full['"]/i.test(content);
      assert(!hasFullAudio, `Runtime file ${rf} contains no composite 'full' audio paths`);
    }
  });

  // Assert full-reading sequence playback in app_v2.js
  if (fs.existsSync('app_v2.js')) {
    const appV2Content = fs.readFileSync('app_v2.js', 'utf-8');
    assert(appV2Content.includes('playAudioSequence') &&
           appV2Content.includes("getVocabAudioPath('word', padId)") &&
           appV2Content.includes("getVocabAudioPath('def', padId)") &&
           appV2Content.includes("getVocabAudioPath('example', padId)"),
      'app_v2.js implements playAudioSequence queuing [word, def, example]');
  }

  // Criterion 5: Data Twins Byte Consistency
  console.log('\n--- Checking Data Twins Consistency ---');
  const jsContent = fs.readFileSync(v2JsPath, 'utf-8')
    .replace(/^window\.[A-Za-z0-9_]+\s*=\s*/, '')
    .replace(/;\s*$/, '');
  assert(JSON.stringify(JSON.parse(jsContent)) === JSON.stringify(uData),
    `${v2JsonPath} and ${v2JsPath} are 100% consistent twins`);

  // Criterion 5b: every other data twin (vocabulary, workbook)
  const twinOf = (jsonPath) => {
    const jsPath = jsonPath.replace(/\.json$/, '.js');
    if (!fs.existsSync(jsonPath)) return;
    assert(fs.existsSync(jsPath), `Twin exists: ${jsPath}`);
    if (!fs.existsSync(jsPath)) return;
    const a = JSON.parse(fs.readFileSync(jsonPath, 'utf-8'));
    const b = JSON.parse(fs.readFileSync(jsPath, 'utf-8')
      .replace(/^[\s\S]*?window\.[A-Za-z0-9_]+\s*=\s*/, '').replace(/;\s*$/, ''));
    assert(JSON.stringify(a) === JSON.stringify(b), `${jsonPath} and ${jsPath} are consistent twins`);
  };
  twinOf(vocabJsonPath);
  twinOf(`data/unit${unitNum}_workbook_data.json`);

  // Criterion 6: Strict Offline Privacy (Zero external http/https calls in runtime code)
  // App code and markup may contain no URL at all. Data files may contain licence URLs
  // (text shown in a credit, never fetched), and only on creativecommons.org by exact prefix.
  console.log('\n--- Checking Zero External Network Calls (GDPR / Offline) ---');
  const urlRe = /https?:\/\/[^\s"'<>)]+/g;
  const codeFiles = ['v2.html', 'style_v2.css', 'app_v2.js', 'index.html', 'app.js', 'style.css'];
  codeFiles.forEach(rf => {
    if (fs.existsSync(rf)) {
      const matches = fs.readFileSync(rf, 'utf-8').match(urlRe);
      assert(!matches || matches.length === 0, `${rf} contains 0 external URLs (100% offline)`);
    }
  });
  const dataFiles = [v2JsPath, 'data/vocabulary_data.js', `data/unit${unitNum}_workbook_data.js`];
  dataFiles.forEach(rf => {
    if (fs.existsSync(rf)) {
      const bad = (fs.readFileSync(rf, 'utf-8').match(urlRe) || [])
        .filter(u => !/^https:\/\/creativecommons\.org\//.test(u));
      assert(bad.length === 0, `${rf} contains no URLs other than licence links${bad.length ? ': ' + bad.slice(0, 3).join(', ') : ''}`);
    }
  });

  // Criterion 7: Visual glosses (teacher-selected pictures)
  console.log('\n--- Checking Visual Glosses ---');
  const pictured = (coreVocab || []).filter(v => v.image);
  pictured.forEach(v => {
    const ok = fs.existsSync(v.image);
    assert(ok, `[${v.id} ${v.word}] image file exists: ${v.image}`);
    if (ok) {
      const kb = fs.statSync(v.image).size / 1024;
      assert(kb > 1 && kb <= 120, `[${v.id} ${v.word}] image is 1-120 KB (${kb.toFixed(1)} KB)`);
    }
    assert(!/^https?:/i.test(v.image), `[${v.id} ${v.word}] image path is local, not a URL`);
    assert(typeof v.image_alt === 'string' && v.image_alt.trim().length > 0, `[${v.id} ${v.word}] has image_alt`);
    const generated = v.image_source === 'generated';
    assert(generated ? !!v.image_prompt : (!!v.image_source && !!v.image_credit),
      `[${v.id} ${v.word}] ${generated ? 'generated picture keeps its image_prompt' : 'photograph has image_source and pupil-visible image_credit'}`);
  });
  if (!pictured.length) console.log('(no pictures in this unit yet)');
  const unitDirEntries = fs.readdirSync('.', { withFileTypes: true }).map(d => d.name);
  assert(!unitDirEntries.includes('scripts') || !fs.existsSync('scripts/inspection'),
    'No candidate/inspection images left inside the unit folder (they belong in ../_scratch/)');

  // Criterion 8: Workbook companion
  console.log('\n--- Checking Workbook Companion ---');
  const wbPath = `data/unit${unitNum}_workbook_data.json`;
  if (fs.existsSync(wbPath)) {
    const wb = JSON.parse(fs.readFileSync(wbPath, 'utf-8'));
    const acts = wb.activities || [];
    assert(acts.length > 0, `Workbook has activities (${acts.length})`);
    if (wb.total_activities !== undefined) {
      assert(wb.total_activities === acts.length, `Workbook total_activities (${wb.total_activities}) matches activities listed (${acts.length})`);
    }
    const hasKey = (o, re) => {
      if (Array.isArray(o)) return o.some(x => hasKey(x, re));
      if (o && typeof o === 'object') return Object.entries(o).some(([k, v]) =>
        (re.test(k) && (Array.isArray(v) ? v.length > 0 : v !== null && v !== '')) || hasKey(v, re));
      return false;
    };
    acts.forEach(a => {
      assert(a.id && a.title && a.type, `Workbook activity ${a.id || '?'} has id, title (book numbering) and type`);
      assert(['closed', 'semi-open', 'open'].includes(a.type), `Workbook activity ${a.id} type is closed / semi-open / open (got "${a.type}")`);
      if (a.type === 'closed') {
        assert(hasKey(a, /^(accepted|pairs|key_answer)$/), `Closed activity ${a.id} carries its answers (accepted / pairs / key_answer)`);
      }
      if (a.type === 'open') {
        assert(hasKey(a, /^checklist$/), `Open activity ${a.id} has a scaffolding checklist`);
      }
    });
    const app = fs.existsSync('app_v2.js') ? fs.readFileSync('app_v2.js', 'utf-8') : '';
    if (app) {
      assert(/getHint\s*\(/.test(app), 'Workbook getHint() hook exists (returns null until a local model is added)');
    }
  } else {
    console.log('(no workbook data for this unit yet)');
  }

  console.log(`\n========================================`);
  console.log(`UNIT ${unitNum} TEST SUMMARY: ${passed} passed, ${failed} failed.`);
  console.log(`========================================`);

  if (failed > 0) process.exit(1);
}

runUnitTests().catch(err => {
  console.error('[FATAL ERROR]', err);
  process.exit(1);
});
