# AGENT HANDOVER: 6th Grade English Digital Companion (Units 1–4 Complete)
**Document Version**: 1.0  
**Repository**: [Apokrit1/student-book-sixth-grade-english](https://github.com/Apokrit1/student-book-sixth-grade-english)  
**Workspace Root**: `c:\photodentro\antigravity\vocabulary st`  
**Current Branch**: `main` (Clean, up to date with `origin/main`)  
**Target for Next Session**: **Unit 5: Travelling Through Time**

---

## 1. Executive Summary & Project Mission
This project modernizes the Greek Ministry of Education's 6th Grade Primary English Coursebook (*Αγγλικά ΣΤ΄ Δημοτικού*) into a state-of-the-art, 100% GDPR-compliant, offline-capable digital companion.

### Core Non-Negotiables:
1. **100% GDPR & Offline Compliance**: Zero runtime external network requests, zero CDNs, zero third-party font calls. Shared fonts load locally via `../assets/fonts/fonts.css`. Fully functional over local `file:///` protocols.
2. **Dual-Format Data Twins**: Every JSON file (`unitN_v2_data.json`, `vocabulary_data.json`, `unitN_workbook_data.json`, `coursebook_catalog.json`) MUST have an identical `.js` twin (`window.UNITN_V2_DATA = ...;`). This prevents CORS errors when opened from local filesystems.
3. **Strict CEFR A2 Lexical Standards**: Every vocabulary definition is under 18 words, strictly uses words within the CEFR A2 ceiling, contains zero circular logic, and never leaks the target word. Verified using `python _tools/check_definitions.py <unit_slug>`.
4. **Dual-Engine Audio with Text Sidecars**: Every vocabulary headword has 3 distinct audio clips (`word`, `def`, `example`) across two voice engines (Classic Google TTS `assets/audio/` + Microsoft Edge `en-GB-SoniaNeural` `assets/audio_neural/`). **Never generate a 4th composite clip**; the player dynamically chains them with a 350 ms natural pause. Every MP3 must have a corresponding verbatim `.txt` sidecar.
5. **Zero JavaScript Errors**: All mini-apps, tabs, audio controls, and quizzes must load and execute cleanly with 0 console errors in a real browser session.

---

## 2. Completed Status Matrix (Units 1–4)

| Unit | Title | Vocabulary | CEFR / Errata | Stories & Artwork | Audio Clips | Workbook | Browser CDP | Git Status |
|---|---|---|---|---|---|---|---|---|
| **Unit 1** | *Our Multicultural Class* | 40 items | A1/A2 (E1–E4) | 4 Dossiers (UA, AL, GE, UK), 4 SVGs | 240 clips + 4 stories + dialogue | 5 Worksheets | 0 JS errors | Merged & Pushed |
| **Unit 2** | *A Weekend in London* | 41 items | A2 (E1–E5) | 4 Dossiers (Big Ben, London Eye, Tower, British Museum), 4 SVGs | 246 clips + 4 stories + dialogue | 12 Activities | 0 JS errors | Merged & Pushed |
| **Unit 3** | *Imaginary Creatures* | 54 items | A2/A2+ (E1–E6) | 3 Dossiers (Polyphemus, Fairies, Ogre), 3 SVGs | 324 clips + 3 stories + 2 plays | 20 Activities | 0 JS errors | Merged & Pushed |
| **Unit 4** | *The History of the Aeroplane* | 41 items | A2/A2+ (E1–E7) | 4 Dossiers (Daedalus, FAA Museum, Wright Bros, Brueghel), 4 SVGs | 246 clips + 4 stories + in-flight dialogue | 14 Activities | 0 JS errors | Commit `f1bbc9f` (Clean) |

---

## 3. Skill & Reference Sitemap

The primary skill guiding all unit authoring and verification is:
- **`c:\photodentro\antigravity\vocabulary st\.agents\skills\coursebook-unit-extender\SKILL.md`**

Key scripts and templates:
- **Definition Checker**: `_tools/check_definitions.py`
- **Data Twin Synchronizer**: `.agents/skills/coursebook-unit-extender/scripts/sync_data_twins.js`
- **Audio Generator**: `.agents/skills/coursebook-unit-extender/scripts/generate_unit_audio.js`
- **Unit Shell Template**: `.agents/skills/coursebook-unit-extender/templates/unit_shell/`
- **Extender Regression Test**: `.agents/skills/coursebook-unit-extender/templates/test_unit.template.js`
- **Central Catalog**: `data/coursebook_catalog.json` and `data/coursebook_catalog.js`
- **Browser CDP Test Harness**: `_scratch/test_browser_unit4.js` (template for Unit 5)

---

## 4. Canonical Step-by-Step Protocol for Unit 5 (*Travelling Through Time*)

### Phase 1: Source Discovery & Errata Registration
1. Inspect `unit5/source/`:
   - `00_MANIFEST.md`
   - `01_syllabus.txt`
   - `02_vocabulary_list.txt` (extract target vocabulary items)
   - `10_SB_unit.txt` (Student's Book lessons & readings)
   - `13_SB_grammar_file.txt` (Grammar rules: *used to*, asking for/giving directions)
   - `20_WB_unit.txt` & `30_TB_unit.txt` (Workbook activities and Teacher's Book keys)
2. Author `unit5/ERRATA.md` cataloging any textbook typos, misprints, archaisms, or ambiguous keys before coding.

### Phase 2: Shell Setup
1. Copy shell files from `.agents/skills/coursebook-unit-extender/templates/unit_shell/` into `unit5/`:
   - `index.html`, `v2.html`, `app.js`, `app_v2.js`, `style.css`, `style_v2.css`, `verify_offline.js`, `README.md`
2. Update metadata in HTML:
   - `unit5/index.html`: `<body data-unit="5">`
   - `unit5/v2.html`: `<body data-unit="5" data-workbook="unit5_workbook_data.js">`
3. Create asset directories:
   - `unit5/data/`
   - `unit5/assets/images_v2/`
   - `unit5/assets/audio/{words,defs,examples}`
   - `unit5/assets/audio_neural/{words,defs,examples}`
   - `unit5/assets/audio_v2/{stories,grammar}`

### Phase 3: Vocabulary Dataset & Checker
1. Author `unit5/data/vocabulary_data.json` for all official Unit 5 headwords:
   - Fields: `id`, `word`, `ipa`, `part_of_speech`, `meaning_gr`, `definition_en`, `example`, `topic`, `cefr_level`.
2. Run lexical auditor:
   ```bash
   python _tools/check_definitions.py unit5
   ```
   *Requirement*: 0 hard words outside CEFR A2, 0 circular definitions, 0 target leaks, max 18 words per definition.
3. Synchronize JS twin:
   ```bash
   node .agents/skills/coursebook-unit-extender/scripts/sync_data_twins.js unit5/data/vocabulary_data.json
   ```

### Phase 4: Version 2 Companion Dataset
1. Author `unit5/data/unit5_v2_data.json`:
   - `stories`: 3–4 narrative dossiers grounded in verbatim student book texts.
   - `grammar_lab`: Rule explanations, signal words, examples, target structures, and authentic listening task.
     > ⚠️ **CRITICAL KEY NAME**: Use `"grammar_lab": { ... }` (not `"grammar"`), matching `app_v2.js`.
   - `collocations`: Authentic coursebook word partnerships.
   - `definition_challenge`: 12–16 clue questions with 4 multiple-choice options each.
   - `writing_workshop` / `report_builder_guide`: Guided scaffolded text planner (e.g., historical diary / letter).
   - `content_true_false`: 6–10 fact-check items with auditory feedback.
   - `can_do`: Self-assessment items matching coursebook "Now tick what you can do".
   - `teacher_notes`: Fact-checks, pedagogical context, and errata register.
2. Synchronize JS twin:
   ```bash
   node .agents/skills/coursebook-unit-extender/scripts/sync_data_twins.js unit5/data/unit5_v2_data.json
   ```

### Phase 5: Workbook Dataset
1. Author `unit5/data/unit5_workbook_data.json`:
   - All printed activities in original order.
   - Closed activities (`type: "closed"`): exact Teacher's Book answer keys in `accepted_answers` or `pairs`.
   - Semi-open activities (`type: "semi-open"`): model answers.
   - Open activities (`type: "open"`): MUST include `checklist: [{ "label": "..." }]` for student self-evaluation.
2. Synchronize JS twin:
   ```bash
   node .agents/skills/coursebook-unit-extender/scripts/sync_data_twins.js unit5/data/unit5_workbook_data.json
   ```

### Phase 6: Vector Artwork & Dual-Engine Audio
1. Create 3–4 original SVGs in `unit5/assets/images_v2/` depicting the authentic unit settings (clean, vibrant, zero copyright/trademark infringements).
2. Synthesize dual-engine vocabulary audio:
   ```bash
   node .agents/skills/coursebook-unit-extender/scripts/generate_unit_audio.js unit5
   ```
   Verify all `.mp3` and `.txt` sidecars:
   ```bash
   node .agents/skills/coursebook-unit-extender/scripts/generate_unit_audio.js unit5 --check
   ```
3. Synthesize story narrations into `unit5/assets/audio_v2/stories/` and dialogue into `unit5/assets/audio_v2/grammar/` with matching `.txt` sidecars.

### Phase 7: Catalog Registration
Update `data/coursebook_catalog.json` and sync `data/coursebook_catalog.js`:
- Set Unit 5: `status: "ready"`, `v1_url: "unit5/index.html"`, `v2_url: "unit5/v2.html"`, `badge: "Flagship v2 Ready"`.

### Phase 8: Full Verification Suite
Run the full battery of tests:
1. `node unit5/verify_offline.js` (must pass 41/41)
2. `python _tools/check_definitions.py unit5` (clean exit code 0)
3. `node .agents/skills/coursebook-unit-extender/templates/test_unit.template.js 5` (100% pass)
4. Headless Edge Browser CDP Test:
   - Adapt `_scratch/test_browser_unit4.js` to `_scratch/test_browser_unit5.js`.
   - Click each module tab, verify panels, test quiz options, check console for errors.
   - Confirm **0 runtime exceptions and 0 console errors**.

### Phase 9: Release & Git Push
1. Author `unit5/BUILD_NOTES.md`.
2. Check `git status`.
3. Commit and push:
   ```bash
   git add unit5 data/coursebook_catalog.js data/coursebook_catalog.json
   git commit -m "feat(unit5): complete Flagship v2 Digital Companion for Unit 5 (Travelling Through Time)"
   git push origin main
   ```

---

## 5. Critical Invariants & Gotchas (Lessons Learned)

1. **Lexis Ownership Rule**:
   - In `v2_data.json`, every ID listed under `story.vocabulary_ids` **MUST exist verbatim** in `story.narrative`. Do not add vocabulary IDs to a story unless the exact lemma or form is present in the text!
2. **Null Pill Rule for Landmarks**:
   - Realia landmarks that highlight a cultural location rather than an owned target word MUST specify `"word_key": null, "word_id": null`. Never force a false core-word association.
3. **No 4th Composite Audio**:
   - Never generate or reference `_full.mp3` or composite 4th audio clips for vocabulary items. The runtime player automatically chains `[word, def, example]` with a 350 ms natural pause via `playAudioSequence()`.
4. **Verbatim Audio Sidecars**:
   - Every audio file (`.mp3`) must have an accompanying `.txt` file with identical basename containing the exact spoken text.
5. **Open Workbook Scaffolding**:
   - Any workbook activity marked `type: "open"` will fail regression unless it contains a `checklist: [...]` array with actionable self-evaluation criteria.
6. **Node Modules & Symlink**:
   - If TTS generation fails due to missing modules, ensure Node resolves from root (`node_modules` is present at the workspace root and symlinked).
7. **Edge Process Cleanup**:
   - When running headless browser tests using Microsoft Edge CDP, always kill the process and close the HTTP server at the end of the script to prevent port conflicts on 8088/9222.

---
*End of Handover. Incoming agent can proceed directly with Unit 5.*
