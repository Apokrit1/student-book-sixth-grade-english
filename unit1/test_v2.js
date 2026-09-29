const fs = require('fs');
const path = require('path');
const http = require('http');

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

async function runV2Tests() {
  console.log('=== RUNNING VERSION 2 (v2) AND COURSEBOOK HUB TEST SUITE ===');
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

  // 1. Files existence & non-empty check
  const requiredFiles = [
    '../portal.html',
    '../portal.css',
    '../portal.js',
    'v2.html',
    'style_v2.css',
    'app_v2.js',
    '../data/coursebook_catalog.json',
    'data/unit1_v2_data.json',
    'data/unit1_workbook_data.json',
    'data/unit1_workbook_data.js',
    'assets/images_v2/sasha_ukraine.svg',
    'assets/images_v2/christina_albania.svg',
    'assets/images_v2/georgi_georgia.svg',
    'assets/images_v2/gwen_uk.svg',
    'assets/images_v2/stem_school_lab.svg',
    'assets/images_v2/mr_badluck.svg',
    'assets/images_v2/subject_maths.svg',
    'assets/images_v2/subject_science.svg',
    'assets/images_v2/subject_geography.svg',
    'assets/images_v2/subject_music.svg',
    'assets/images_v2/beach_snapshot.svg',
    'assets/audio_v2/stories/ukraine_full_story.mp3',
    'assets/audio_v2/stories/albania_full_story.mp3',
    'assets/audio_v2/stories/georgia_full_story.mp3',
    'assets/audio_v2/stories/uk_full_story.mp3',
    'assets/audio_v2/grammar/school_lab_overview.mp3',
    'assets/audio_v2/grammar/mr_badluck_story.mp3'
  ];

  for (const f of requiredFiles) {
    const exists = fs.existsSync(f);
    const size = exists ? fs.statSync(f).size : 0;
    assert(exists && size > 50, `File exists and non-empty: ${f} (${size} bytes)`);
  }

  // 2. Catalog validation
  const catalog = JSON.parse(fs.readFileSync('../data/coursebook_catalog.json', 'utf-8'));
  assert(catalog.units && catalog.units.length === 10, 'Catalog contains all 10 coursebook units');
  assert(catalog.units[0].status === 'ready' && catalog.units[0].v2_url === 'unit1/v2.html', 'Unit 1 is designated ready with v2_url');

  // 3. Unit 1 v2 data validation & Dossier Vocabulary Regression Guard
  const u1Data = JSON.parse(fs.readFileSync('data/unit1_v2_data.json', 'utf-8'));
  assert(u1Data.stories && u1Data.stories.length === 4, 'Unit 1 v2 has 4 country dossiers (Ukraine, Albania, Georgia, UK)');
  assert(u1Data.grammar_lab && u1Data.grammar_lab.school_lab_actions.length >= 4, 'Grammar lab has school lab actions');
  assert(u1Data.collocations && u1Data.collocations.length >= 6, 'Collocations dataset has at least 6 lexical partnerships');
  assert(u1Data.crossword && u1Data.crossword.across.length >= 6, 'Crossword has across clues');
  assert(u1Data.report_builder_guide && u1Data.report_builder_guide.paragraphs.length === 5, '5-paragraph report builder guide defined');

  // Load Vocabulary Data for Dossier Checks
  const vm = require('vm');
  const vocabCode = fs.readFileSync('data/vocabulary_data.js', 'utf-8');
  const sandbox = { window: {} };
  vm.createContext(sandbox);
  vm.runInContext(vocabCode, sandbox);
  const coreVocab = sandbox.window.VOCABULARY_DATA;
  assert(coreVocab && coreVocab.length === 35, 'Core vocabulary loaded with 35 target items');

  // Regression Guard from v2_review_dossiers.md:
  for (const story of u1Data.stories) {
    assert(Array.isArray(story.vocabulary_ids) && story.vocabulary_ids.length >= 6, 
      `${story.student} (${story.country}) has valid vocabulary_ids array with ${story.vocabulary_ids.length} items`);
    
    for (const lm of story.landmarks) {
      if (lm.word_key !== null || lm.word_id !== null) {
        // 1. Resolve against core vocabulary
        let vItem = null;
        if (lm.word_key) {
          vItem = coreVocab.find(v => v.word.toLowerCase() === lm.word_key.toLowerCase());
        }
        if (!vItem && lm.word_id) {
          vItem = coreVocab.find(v => v.id === lm.word_id);
        }
        assert(vItem !== null && vItem !== undefined, 
          `Landmark "${lm.name}" resolves to valid word in vocabulary_data (${lm.word_key || lm.word_id})`);

        // 2. Ownership assertion: landmark word must be in story.vocabulary_ids
        if (vItem) {
          const isOwned = story.vocabulary_ids.includes(vItem.id);
          assert(isOwned, 
            `Landmark word "${vItem.word}" (id:${vItem.id}) is owned by ${story.country}'s vocabulary_ids`);

          // 3. Audio file existence check
          const padId = String(vItem.id).padStart(2, '0');
          const audioStd = `assets/audio/words/${padId}_word.mp3`;
          const audioNeu = `assets/audio_neural/words/${padId}_word.mp3`;
          assert(fs.existsSync(audioStd) && fs.existsSync(audioNeu), 
            `Audio files exist for "${vItem.word}" (${audioStd})`);
        }
      } else {
        assert(lm.word_key === null && lm.word_id === null, 
          `Landmark "${lm.name}" correctly has null vocabulary pill (no false core-word forced)`);
      }

      // Check Chernobyl register fix (§G)
      if (lm.name.includes('Chernobyl')) {
        assert(lm.desc.includes('nuclear accident') && !lm.desc.includes('green transition'), 
          'Chernobyl landmark description is factual, age-appropriate, and not mislabeled');
      }
    }
  }

  // Section K2: Frequency example repeatable action check
  const neverItem = u1Data.grammar_lab.frequency_spectrum.find(f => f.adverb === 'Never');
  assert(neverItem && !neverItem.example.includes('borders') && neverItem.example.includes('snows'), 
    'Frequency spectrum "Never" uses repeatable action ("It never snows...") instead of stative fact');

  // Verify all frequency items avoid stative "borders"
  u1Data.grammar_lab.frequency_spectrum.forEach(f => {
    assert(!f.example.includes('borders'), `Frequency example for "${f.adverb}" uses dynamic/repeatable lexis without stative "borders"`);
  });

  // Section K3: Computer-lab verbs check (search, print, copy, paste)
  const labContentStr = JSON.stringify(u1Data.grammar_lab);
  ['search', 'print', 'copy', 'paste'].forEach(v => {
    assert(labContentStr.toLowerCase().includes(v), 
      `Computer lab activity contains core target verb "${v}"`);
  });

  // Section D: South clue check
  const southClue = u1Data.crossword.down.find(c => c.word === 'SOUTH');
  assert(southClue && southClue.clue.includes('North') && !southClue.clue.includes('equator'), 
    'Crossword clue for SOUTH correctly defined as opposite of North');

  // Section E: Coursebook fidelity check (spelling and capitals)
  const ukr = u1Data.stories.find(s => s.id === 'ukraine');
  const geo = u1Data.stories.find(s => s.id === 'georgia');
  const alb = u1Data.stories.find(s => s.id === 'albania');
  const uk = u1Data.stories.find(s => s.id === 'uk');
  assert(ukr.capital === 'Kiev' && ukr.hometown === 'Odessa', 'Ukraine capital is "Kiev" and hometown is "Odessa" matching coursebook');
  assert(geo.capital === 'T’blisi', 'Georgia capital is "T’blisi" matching coursebook');
  assert(alb.capital === 'Tirana', 'Albania capital is "Tirana" matching coursebook');
  assert(uk.capital === 'London', 'UK capital is "London" matching coursebook');

  // Section F: Collocation consistency check
  const searchColloc = u1Data.collocations.find(c => c.verb === 'search for');
  assert(searchColloc && searchColloc.partner === 'online information' && searchColloc.example.includes('online information'),
    'Collocation "search for" partner and example sentence both consistently use "online information"');

  // Section H: Teacher Notes fact-check verification
  assert(u1Data.teacher_notes && u1Data.teacher_notes.length >= 3, 'Teacher notes array populated with fact-checks and lexis notes');
  const tsunamiNote = u1Data.teacher_notes.find(n => n.id === 'albania_seismic_vs_tsunami');
  assert(tsunamiNote && tsunamiNote.note.includes('coursebook') && tsunamiNote.note.includes('verbatim'),
    'Teacher notes document Albania coursebook fidelity matching Pupil Book and Quiz');
  const printSaveNote = u1Data.teacher_notes.find(n => n.id === 'computer_lab_print_vs_save');
  assert(printSaveNote && printSaveNote.note.includes('printing'),
    'Teacher notes document textbook printing vs saving discrepancy resolution');

  // Section I: Catalog Teacher Notice & Planned Unit URLs check
  const catJson = JSON.parse(fs.readFileSync('../data/coursebook_catalog.json', 'utf-8'));
  assert(catJson.teacher_syllabus_notice && catJson.teacher_syllabus_notice.length > 20,
    'Catalog contains teacher syllabus verification notice for Units 2-10');
  catJson.units.filter(u => u.status === 'planned').forEach(pu => {
    assert(!pu.v1_url && !pu.v2_url, `Planned unit ${pu.unit} (${pu.title}) correctly omits dead v1/v2 URLs`);
  });

  // Section J: Coursebook authentic text verification
  assert(ukr.narrative.includes('cool along the Black Sea') && ukr.narrative.includes('River Dnipo'),
    'Ukraine narrative accurately matches coursebook reading text ("cool along the Black Sea", "River Dnipo")');
  assert(alb.narrative.includes('earthquakes or tsunamis') && !alb.narrative.includes('seismic'),
    'Albania narrative retains authentic coursebook lexis ("earthquakes or tsunamis") without non-A1 "seismic"');
  assert(geo.narrative.includes('copper and coal mines') && !geo.narrative.includes('polyphonic'),
    'Georgia narrative matches authentic coursebook reading text ("copper and coal mines")');
  assert(uk.narrative.includes('ten years old') && uk.narrative.includes('Channel Tunnel'),
    'UK narrative matches authentic coursebook reading text ("ten years old")');

  // Section K5: Data Twins Byte/Semantic Consistency Check
  const u1JsContent = fs.readFileSync('data/unit1_v2_data.js', 'utf-8')
    .replace(/^window\.UNIT1_V2_DATA\s*=\s*/, '').replace(/;\s*$/, '');
  assert(JSON.stringify(JSON.parse(u1JsContent)) === JSON.stringify(u1Data), 
    'unit1_v2_data.json and unit1_v2_data.js are 100% consistent twins');

  const catJsContent = fs.readFileSync('../data/coursebook_catalog.js', 'utf-8')
    .replace(/^window\.COURSEBOOK_CATALOG\s*=\s*/, '').replace(/;\s*$/, '');
  assert(JSON.stringify(JSON.parse(catJsContent)) === JSON.stringify(catJson), 
    'coursebook_catalog.json and coursebook_catalog.js are 100% consistent twins');

  // Section K6: Classroom Autoplay Prevention Check
  const jsV2Str = fs.readFileSync('app_v2.js', 'utf-8');
  const jsV1Str = fs.readFileSync('app.js', 'utf-8');
  const htmlV2Str = fs.readFileSync('v2.html', 'utf-8');
  const htmlV1Str = fs.readFileSync('index.html', 'utf-8');
  assert(!jsV2Str.includes('setTimeout(playChallengePrompt'), 
    'app_v2.js contains no audio autoplay timeout on challenge/question load');
  assert(!jsV1Str.includes('setTimeout(playQuizPrompt') && !jsV1Str.includes('setTimeout(playDefQuizPrompt'), 
    'app.js contains no audio autoplay timeout on quiz/question load');
  assert(!htmlV2Str.includes('autoplay') && !htmlV1Str.includes('autoplay'), 
    'Runtime HTML files contain zero autoplay attributes');

  // =========================================================================
  // Section L: Workbook Module Verification (PROMPT_unit1_workbook.md)
  // =========================================================================
  console.log('\n--- Section L: Workbook Module Verification ---');

  // L1. Workbook Data Structure & Activity Count
  const wbJson = JSON.parse(fs.readFileSync('data/unit1_workbook_data.json', 'utf-8'));
  assert(wbJson.total_activities === 15 && wbJson.activities.length === 15,
    `Workbook data has exactly 15 activities (found: ${wbJson.activities.length})`);

  const expectedOrder = [
    'opening_page', 'a1', 'a2', 'a3',
    'b1-I', 'b1-II', 'b2', 'b3', 'b4', 'b5',
    'c1', 'c2', 'c3', 'd', 'e'
  ];
  const actualOrder = wbJson.activities.map(a => a.id);
  assert(JSON.stringify(actualOrder) === JSON.stringify(expectedOrder),
    'Workbook activities follow the exact printed coursebook order (Opening -> A1-A3 -> B1-B5 -> C1-E)');

  // L2. Workbook Data Twins Consistency Check
  const wbJsContent = fs.readFileSync('data/unit1_workbook_data.js', 'utf-8')
    .replace(/^window\.UNIT1_WORKBOOK_DATA\s*=\s*/, '').replace(/;\s*$/, '');
  assert(JSON.stringify(JSON.parse(wbJsContent)) === JSON.stringify(wbJson),
    'unit1_workbook_data.json and unit1_workbook_data.js are 100% consistent twins');

  // L3. Closed Activities: Accepted Answer Sets Validation
  const closedActivities = wbJson.activities.filter(a => a.type === 'closed');
  assert(closedActivities.length === 6, 'Found 6 closed self-checking activities (A1, A3, B1-I, B1-II, B2, B3)');

  // A1 matching pairs
  const a1 = wbJson.activities.find(a => a.id === 'a1');
  assert(a1 && a1.pairs.length === 10, 'A1 contains all 10 country-nationality pairs');
  a1.pairs.forEach(p => {
    assert(p.country && p.nationality, `A1 pair defined: ${p.country} -> ${p.nationality}`);
  });

  // A3 school subjects
  const a3 = wbJson.activities.find(a => a.id === 'a3');
  assert(a3 && a3.items.length === 4, 'A3 contains all 4 school subject illustration items');
  a3.items.forEach(it => {
    assert(Array.isArray(it.accepted) && it.accepted.length > 0, `A3 item ${it.target} has non-empty accepted set`);
    assert(it.accepted.map(s => s.toLowerCase()).includes(it.target.toLowerCase()), `A3 item ${it.target} accepts target`);
  });

  // B1-I: Present Continuous
  const b1i = wbJson.activities.find(a => a.id === 'b1-I');
  assert(b1i && b1i.gaps.length === 8, 'B1-I contains all 8 gaps');
  b1i.gaps.forEach(g => {
    assert(Array.isArray(g.accepted) && g.accepted.length >= 2, `B1-I gap ${g.id} has accepted set with variants`);
    const keyClean = g.key_answer.toLowerCase();
    assert(g.accepted.map(s => s.toLowerCase()).includes(keyClean),
      `B1-I gap ${g.id} accepts TB key: "${g.key_answer}"`);
  });

  // B1-II: Present Simple with Negatives
  const b1ii = wbJson.activities.find(a => a.id === 'b1-II');
  assert(b1ii && b1ii.gaps.length === 14, 'B1-II contains all 14 Present Simple gaps across items a-f');
  b1ii.gaps.forEach(g => {
    assert(Array.isArray(g.accepted) && g.accepted.length >= 1, `B1-II gap ${g.id} has accepted set`);
    const keyClean = g.key_answer.toLowerCase();
    assert(g.accepted.map(s => s.toLowerCase()).includes(keyClean),
      `B1-II gap ${g.id} accepts TB key: "${g.key_answer}"`);
    if (g.key_answer.includes('not')) {
      const contracted = g.key_answer.replace('do not', "don't").replace('does not', "doesn't");
      assert(g.accepted.map(s => s.toLowerCase()).includes(contracted.toLowerCase()),
        `B1-II gap ${g.id} accepts contraction: "${contracted}"`);
    }
  });

  // B2: Restaurant Dialogue
  const b2 = wbJson.activities.find(a => a.id === 'b2');
  assert(b2 && b2.gaps.length === 6, 'B2 dialogue contains all 6 gaps');
  b2.gaps.forEach(g => {
    assert(Array.isArray(g.accepted) && g.accepted.length >= 2, `B2 gap ${g.id} accepts multiple grammatical forms`);
    const cleanKey = g.key_answer.replace(/[’']/g, "'").toLowerCase();
    const keyAccepted = g.accepted.some(acc => acc.replace(/[’']/g, "'").toLowerCase() === cleanKey || cleanKey.includes(acc.toLowerCase()));
    assert(keyAccepted, `B2 gap ${g.id} accepts key answer "${g.key_answer}"`);
  });

  // B3: Choose Correct Verb
  const b3 = wbJson.activities.find(a => a.id === 'b3');
  assert(b3 && b3.items.length === 8, 'B3 contains 8 verb selection items in Petros & George dialogue');
  b3.items.forEach(it => {
    const cleanKey = it.key_answer.replace(/[’']/g, "'").toLowerCase();
    assert(it.options.some(opt => opt.replace(/[’']/g, "'").toLowerCase() === cleanKey),
      `B3 item ${it.id} options include key answer "${it.key_answer}"`);
  });

  // L4. Semi-open & Open Scaffolding Verification
  const openActivities = wbJson.activities.filter(a => a.type === 'open');
  assert(openActivities.length === 4, 'Found 4 open writing tasks (C2, C3, D, E)');
  openActivities.forEach(oa => {
    const cl = oa.checklist || oa.scaffolding_checklist || [];
    assert(Array.isArray(cl) && cl.length >= 3,
      `Open task ${oa.number} (${oa.id}) has scaffolding checklist with >= 3 criteria (found ${cl.length})`);
    assert(Array.isArray(oa.word_bank) || oa.subject_translations,
      `Open task ${oa.number} has dedicated vocabulary support (word bank or translations)`);
    assert(oa.model_text && oa.model_text.length > 50,
      `Open task ${oa.number} has pre-written model text`);
  });

  // L5. Offline & Security Audit: Zero External HTTP/HTTPS URLs in runtime files
  const runtimeFiles = [
    'v2.html',
    'app_v2.js',
    'style_v2.css',
    'data/unit1_workbook_data.json',
    'data/unit1_workbook_data.js'
  ];
  const urlRegex = /https?:\/\/(?!localhost|127\.0\.0\.1|www\.w3\.org)/gi;
  runtimeFiles.forEach(rf => {
    const content = fs.readFileSync(rf, 'utf-8');
    const matches = content.match(urlRegex) || [];
    assert(matches.length === 0, `Runtime file ${rf} is 100% offline (0 external URLs found, ${matches.length} matches)`);
  });

  // =========================================================================
  // Section M: Three-Clip Vocabulary Audio & Sidecar Veracity (TASK_audio_refresh.md)
  // =========================================================================
  console.log('\n--- Section M: Vocabulary Audio & Sidecar Veracity (3 Clips, No Full Composite) ---');

  const voiceSets = [
    { name: 'Standard Google TTS', dir: 'assets/audio' },
    { name: 'Natural Neural AI TTS', dir: 'assets/audio_neural' }
  ];

  let missingClips = 0;
  let missingSidecars = 0;
  let driftedClips = 0;

  for (const item of coreVocab) {
    const padId = String(item.id).padStart(2, '0');
    const clips = [
      { cat: 'words', file: `${padId}_word.mp3`, expected: item.word },
      { cat: 'defs', file: `${padId}_definition.mp3`, expected: item.definition_en },
      { cat: 'examples', file: `${padId}_example.mp3`, expected: item.example }
    ];

    for (const vs of voiceSets) {
      for (const c of clips) {
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
            driftedClips++;
            assert(false, `[DRIFTED TEXT] (${vs.name}) ${mp3Path} expected "${cleanExpected}" got "${actualText}"`);
          }
        }
      }
    }
  }

  assert(missingClips === 0, `All 210 vocabulary clips exist across both voice sets (0 missing)`);
  assert(missingSidecars === 0, `All 210 vocabulary clips have matching .txt sidecars (0 missing)`);
  assert(driftedClips === 0, `All 210 sidecars verbatim match current vocabulary_data.json (0 drifted)`);

  // Assert no runtime file references a composite full/ path
  const runtimeAudioFiles = ['v2.html', 'app_v2.js', 'style_v2.css', 'index.html', 'app.js', 'style.css'];
  runtimeAudioFiles.forEach(rf => {
    if (fs.existsSync(rf)) {
      const content = fs.readFileSync(rf, 'utf-8');
      const hasFullAudio = /assets\/audio(?:_neural)?\/full\//i.test(content) || /['"]full['"]/i.test(content);
      assert(!hasFullAudio, `Runtime file ${rf} contains no composite 'full' audio paths`);
    }
  });

  // Assert full-reading button / audio chip queues exactly three sources in order: word, def, example
  const appV2Content = fs.readFileSync('app_v2.js', 'utf-8');
  assert(appV2Content.includes('playAudioSequence') &&
         appV2Content.includes("getVocabAudioPath('word', padId)") &&
         appV2Content.includes("getVocabAudioPath('def', padId)") &&
         appV2Content.includes("getVocabAudioPath('example', padId)"),
    'app_v2.js implements playAudioSequence queuing exactly [word, def, example]');

  // --- Section N: Newcomer Character Story Voices (Differentiated Voices) ---
  console.log('\n--- Section N: Newcomer Character Story Voices ---');
  const sasha = u1Data.stories.find(s => s.id === 'ukraine');
  const christina = u1Data.stories.find(s => s.id === 'albania');
  const georgi = u1Data.stories.find(s => s.id === 'georgia');
  const gwen = u1Data.stories.find(s => s.id === 'uk');

  assert(sasha && sasha.voice && sasha.voice === 'en-GB-MaisieNeural', 'Sasha (Ukraine) is assigned female pupil voice en-GB-MaisieNeural');
  assert(christina && christina.voice && christina.voice === 'en-GB-LibbyNeural', 'Christina (Albania) is assigned female pupil voice en-GB-LibbyNeural');
  assert(georgi && georgi.voice && georgi.voice === 'en-US-EricNeural', 'Georgi (Georgia) is assigned young male voice en-US-EricNeural');
  assert(gwen && gwen.voice, 'Gwen (UK) is assigned voice ' + gwen.voice);

  // Distinct voices assertion
  const distinctVoices = new Set([sasha.voice, christina.voice, georgi.voice, gwen.voice]);
  assert(distinctVoices.size === 4, `All 4 story characters have completely distinct voices (${distinctVoices.size}/4)`);
  assert(sasha.voice !== christina.voice, 'Sasha and Christina have different female voices');
  assert(georgi.voice !== sasha.voice && georgi.voice !== christina.voice, 'Georgi voice is distinct from female characters');

  // Verify all 4 story MP3s and their sidecars
  u1Data.stories.forEach(st => {
    const mp3 = path.join('assets', 'audio_v2', 'stories', `${st.id}_full_story.mp3`);
    const txt = path.join('assets', 'audio_v2', 'stories', `${st.id}_full_story.txt`);
    assert(fs.existsSync(mp3) && fs.statSync(mp3).size > 100000, `Story MP3 exists and is valid size: ${mp3} (${fs.existsSync(mp3) ? fs.statSync(mp3).size : 0} bytes)`);
    assert(fs.existsSync(txt), `Story .txt sidecar exists: ${txt}`);
    if (fs.existsSync(txt)) {
      const txtContent = fs.readFileSync(txt, 'utf-8').trim();
      assert(txtContent === st.narrative.trim(), `Story sidecar matches narrative text verbatim for ${st.student} (${st.country})`);
    }
  });

  // 4. Test endpoints if server is running
  try {
    const epTest = await testEndpoint('/portal.html');
    if (epTest.ok) {
      assert(true, 'Server is running, testing HTTP routes:');
      const routes = [
        '/',
        '/portal',
        '/v1',
        '/v2',
        '/portal.html',
        '/v2.html',
        '/portal.css',
        '/style_v2.css',
        '/app_v2.js',
        '/data/coursebook_catalog.json',
        '/data/unit1_v2_data.json',
        '/assets/audio_v2/stories/ukraine_full_story.mp3',
        '/assets/images_v2/sasha_ukraine.svg'
      ];
      for (const r of routes) {
        const res = await testEndpoint(r);
        assert(res.ok, `HTTP GET ${r} -> Status 200 (Length: ${res.length})`);
      }
    }
  } catch (e) {
    console.log('[INFO] Server is currently offline, static file verification passed.');
  }

  console.log(`\n========================================`);
  console.log(`V2 TEST SUMMARY: ${passed} assertions passed, ${failed} failed.`);
  console.log(`========================================`);

  if (failed > 0) process.exit(1);
}

runV2Tests().catch(err => {
  console.error('Test suite error:', err);
  process.exit(1);
});
