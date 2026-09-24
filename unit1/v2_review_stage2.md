# Stage 2 Review: Unit 1 app + `coursebook-unit-extender` skill
Reviewer feedback for the build agent. Every finding below was verified by reading the files or running code on this machine, not inferred.

**Scope:** `unit1/` (app, data, assets, tests) and the skill in both locations (`~/.gemini/config/skills/coursebook-unit-extender/` and `unit1/.agents/skills/coursebook-unit-extender/`).

**Verified healthy (no action):**
- `node test_v2.js` → 108 passed, 0 failed. `node verify_offline.js` → all pass.
- All `.json`/`.js` data twins are content-identical (unit data, vocabulary, catalog).
- Fix list B–K from `v2_fixlist_for_gemini.md` is applied correctly, including the guess-the-word conversion, the verbatim lab listening script, `teacher_notes`, and romanization.
- The two skill copies differ only in code comments.

Severity: **[HARD]** breaks a rule or produces wrong output · **[SOFT]** quality/robustness.

---

## Part A: Unit 1 app

### A1 [HARD] Google Fonts break the no-Google-calls rule
`v2.html` (lines 8–10) and `portal.html` (lines 8–10) load fonts from `fonts.googleapis.com` / `fonts.gstatic.com`. Every page load sends the pupil's IP address and user agent to Google. This violates the project rule "no Google calls at runtime" and is a GDPR problem for minors (cf. LG München I, 20 Jan 2022, 3 O 17493/20, on exactly this). It also means the page is not truly offline; `verify_offline.js` passes only because it doesn't check for external URLs.

Fix:
1. Download the Outfit and Plus Jakarta Sans `.woff2` files (weights 400–800) into `assets/fonts/`.
2. Declare them with `@font-face` in `style_v2.css` and `portal.css`.
3. Delete the three `<link>` lines (two `preconnect`, one stylesheet) from both HTML files.
4. Extend `verify_offline.js`: fail if any `.html`, `.css` or `.js` file in the app contains `http://` or `https://`.

### A2 [HARD] Audio no longer matches the text pupils read
Recordings were made before the text was corrected, so the read-along is out of sync:

| Audio file | Recorded | Text edited | What pupils hear vs. read |
|---|---|---|---|
| `assets/audio_v2/stories/ukraine_full_story.mp3` | 19 Sep 09:39 | 19 Sep 14:23 | "Kiev", "Odessa" vs. "Kyiv", "Odesa" |
| `assets/audio_v2/stories/georgia_full_story.mp3` | 19 Sep 09:40 | 19 Sep 14:23 | "T'bilisi" text change (verify) |
| `assets/audio/examples/06_example.mp3` and `assets/audio_neural/examples/06_example.mp3` | 17 Sep | 19 Sep 13:43 | "Odessa" vs. "Odesa" |

Fix: regenerate these from the current text. Also regenerate `albania_full_story.mp3` and `uk_full_story.mp3` if their narrative text changed after 09:40 (diff the narrative against what was voiced). Verify that `assets/audio_v2/grammar/school_lab_overview.mp3` voices Markos saying **"printing"**, not "saving".

The generator cannot fix this by itself (see B4): it skips any MP3 that already exists. Delete the stale files first, or add the `--force` option from B4.

### A3 [SOFT] Leftover naming
The guess-the-word activity is still stored under the key `crossword` with `across`/`down`. It works, but the name will mislead the next agent into rebuilding a grid. Rename to `definition_challenge` with `group_a`/`group_b` in data, app, test and skill template together, or leave it and add a comment. Low priority.

---

## Part B: `coursebook-unit-extender` skill

The SKILL.md distils the Unit 1 lessons well (semantic binding, null pills, no crossword grids, repeatable-action rule, teacher notes). The problems are in the code and in how Unit-1-specific the framework is.

### B1 [HARD] The PDF extractor crashes with the installed library
`scripts/extract_unit_pdf.js` calls `parser.asPages()`. The installed `pdf-parse` is 2.4.5, whose API is `getText()`; `asPages` does not exist in it (checked in `node_modules/pdf-parse/dist`). Step 1 of every future unit will fail.

Fix: `const result = await parser.getText(); const text = result.text;` Then test it on `st_unit1.pdf` and compare with `st_unit1_extracted.txt`.

### B2 [HARD] Units 2–10 will overwrite Unit 1
The skill never defines a folder layout, and several names are not unit-specific:
- `data/vocabulary_data.json` / `window.VOCABULARY_DATA` (one vocabulary for all units)
- audio paths `assets/audio/words/NN_word.mp3` (Unit 2 word 01 = Unit 1 word 01)
- `v1_url: "index.html"`, `v2_url: "v2.html"` in the catalog
- `app_v2.js` hard-codes `UNIT1_V2_DATA` and `unit1_v2_data.json` (lines 53–64)

Fix: add a **Folder Layout** section to SKILL.md and follow it everywhere. Recommended (matches today's structure, least rework):

```
vocabulary st/
├── portal.html, portal.js, portal.css, data/coursebook_catalog.{json,js}   ← hub, one copy
├── unit1/   index.html, v2.html, app_v2.js, data/, assets/, test_v2.js
├── unit2/   same shape, own vocabulary_data, own assets
└── ...
```
Catalog URLs become `unit2/v2.html`. `app_v2.js` reads the unit number from one constant at the top (or from `data-unit` on `<body>`) instead of hard-coding `UNIT1`. Move the portal files out of `unit1/` when you do this, and update the portal links.

### B3 [HARD] The framework is shaped around Unit 1 only
SKILL.md Step 4 and the data template assume every unit has a frequency-adverb spectrum, a computer-lab dialogue, a charades game, geography true/false, "35 core words" and a 5-paragraph country report. The catalog says otherwise (Unit 2: countable/uncountable and some/any; Unit 4: past simple/continuous; Unit 7: present perfect; Unit 10: passive). An agent following the template literally will force Unit 2 into Unit 1's mould.

Fix:
- Make `frequency_spectrum`, `school_lab_listening`, `charades_game` and `geography_true_false` **optional**, each included only when the unit's own syllabus contains it. Rename `geography_true_false` to `content_true_false`.
- `grammar_lab` becomes generic: `target_structures[]` (from the catalog's `grammar` field) + `practice_items[]`. The frequency rule in Step 2 applies only when the unit teaches frequency adverbs.
- Replace "35 core words" with "the unit's own word list (count varies)".
- Step 6 and Worksheet 4: take the writing genre from the unit (the catalog already lists e-shopping order, poem, informal letter, e-mail, film review). The 5-paragraph layout is Unit 1's genre, not a universal one.
- Step 1: also extract the unit's pages from the **Teacher's Book** (`10-0149-01_Agglika_ST-Dimotikou_Vivlio-Ekpaideutikou.pdf`). Step 4 requires verbatim recording scripts and answer keys, and those exist only there (for Unit 1, the lab transcript and its internal "saving/printing" contradiction came from it).

### B4 [HARD] Audio generator: missing command, cannot refresh stale audio
`scripts/generate_unit_audio.js`:
1. The usage line advertises `vocab <vocab-json-file> <output-dir>`, but there is no `vocab` branch; it prints "Unknown command". Implement it (word, definition, example per item → `words/`, `defs/`, `examples/`, `full/`, matching the existing naming).
2. `synthesizeText` returns early if the MP3 exists and is >1000 bytes. After any text correction the old audio stays forever; this is the root cause of A2. Add a `--force` flag, and write a sidecar `<file>.txt` with the exact text voiced; regenerate when the sidecar differs from the current text.
3. The dialogue voice map hard-codes Maria/Markos/Anne/Sophia. Read a `speaker_voices` map from the unit data instead, with the current voices as defaults.
4. Note for the teacher: `en-GB-ThomasNeural` is an adult male voice; Edge TTS has no British boy voice, so Markos sounds adult next to child-voiced Maisie. Acceptable, but a known limitation.
5. Dialogue joining uses a raw `Buffer.concat` of MP3 files. Browsers play it, but duration and seeking can be reported wrongly. If `ffmpeg` is available, use its concat demuxer; otherwise keep the current approach.

### B5 [HARD] Test template flags correct data
`templates/test_unit.template.js`, criterion 2: `!f.example.includes('be')` is a substring test, so it fails any sentence containing "December", "below", "remember", "number", "beautiful". Run against Unit 1's own (correct) data it reports **2 failures**:
- "The temperature usually drops in December."
- "The temperature rarely drops below zero in Batumi."

Fix: match whole words only, for example `/\b(is|are|am|be|borders?|has|have|belongs?)\b/i`, and treat a hit as a warning for human review, not an automatic failure (no regex reliably separates stative from dynamic use).

Also in the template:
- Criterion 4 checks only the first 10 vocabulary words and only the standard voice. Check every word, both voices, every landmark-resolved word, and every story/dialogue MP3 named in the unit data.
- Add a criterion 6: no `http://`/`https://` in the unit's HTML/CSS/JS (see A1).

### B6 [SOFT] Two copies of the skill
The skill exists in `~/.gemini/config/skills/` and in `unit1/.agents/skills/`. They already differ (comments). Keep one source of truth. Recommendation: keep the workspace copy (it travels with the project), move it to the `vocabulary st/` root with the portal (see B2), and remove or link the global copy.

### B7 [SOFT] Build-time cloud services, for the record
`node-edge-tts` (Microsoft) and `google-tts-api` (Google, in `package.json`) are called **at build time only**, send only coursebook text, and no pupil data. That fits the rule. Worth one line in SKILL.md so a future agent never moves either call into runtime code.

---

## Suggested order
1. A1 (fonts), A2 (re-record audio), because they affect Unit 1 in the classroom.
2. B1, B2, B5, B4, because Unit 2 cannot start safely without them.
3. B3, then B6, B7, A3.
4. Re-run `node test_v2.js`, `node verify_offline.js` and the fixed template (`node test_unit.js 1`); all must pass with 0 failures.
