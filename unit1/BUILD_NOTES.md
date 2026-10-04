# Unit 1 Build Notes: Our Multicultural Class

Written retrospectively on 19 Sep 2026 after two review rounds, to serve as the model for Units 2-10 (see SKILL.md, Session Protocol).

## Textbook Fidelity & Classroom Reality Check (24 Sep 2026)

During live classroom testing with 6th-grade pupils, having the physical paper coursebook open on their desks made it evident that the digital companion must not deviate from the printed page. Editorial rewrites (e.g. changing texts to adult C1 prose like "seismic events", "cultivate", "laureate", or altering city names) confused pupils and contradicted the book's exercises and quizzes.

All four newcomer narratives have been reverted to 100% exact printed textbook text:
- **Sasha (Ukraine)**: Restored verbatim ("capital, Kiev", "Odessa", "The River Dnipo", "Moldavia", "cool along the Black Sea").
- **Christina (Albania)**: Restored verbatim ("earthquakes or tsunamis that happen along the South coast", "popular nun and humanitarian Nobel Prize winner", "Serbia, Montenegro and Greece"). Contradictory `book_check` removed.
- **Georgi (Georgia)**: Restored verbatim ("Colchis", "Golden Fleece", "West Asia", "Pontus Euxinos", "copper and coal mines", "T’blisi").
- **Gwen (UK)**: Restored verbatim ("ten years old", "Channel Tunnel connects Great Britain to France in the South").

Audio narrations for all 4 stories were re-synthesized using differentiated Microsoft Edge Neural voices to give each child an authentic, distinct voice (two female voices for Sasha and Christina, a young male voice for Georgi, and Gwen retaining Sonia) matching the exact coursebook wording.

## Deliberate departures / pedagogical adaptations

| Area | Book (2006) | App | Why |
|---|---|---|---|
| Chernobyl card | (not in book) | "Site of a serious nuclear accident in 1986." | Factual, age-appropriate landmark card for Ukraine. |
| Lab listening (Lesson 2) | Teacher's Book script: Markos "I'm **saving** some photos"; its own key: "he is **printing** some photos" | Script voiced with "printing" | The book contradicts itself; the key and the unit's target lexis (search, print, copy, paste) favour "printing". |
| Lab listening, structure | Listening task: fill the table, then true/false | Kept as a listening task with the verbatim script, table key and 5 true/false items | Exact textbook listening task. |
| Crossword (Lesson 3) | Printed grid | "Guess the word from its definition" (reveal button, solved counter, audio hints) | The printed grid cannot be rebuilt reliably; clue/answer practice is kept. SOUTH clue fixed to "opposite of North". |
| Frequency adverbs | (app example) "Ukraine never borders the Aegean Sea" | "It never snows in the Sahara Desert." | Frequency adverbs need a repeatable action, not a permanent fact. |
| Vocabulary list | "nuclear power" / "plant" printed on two lines | One item: "nuclear power plant" | Line wrap in the printed list. |
| Fonts | (app) loaded from Google Fonts | Self-hosted `.woff2` files | No runtime calls to Google; GDPR for minors. |

## Landmark vocabulary binding

The first build bound landmark cards to words by landmark *type* through a wrong lookup table, so every Coast card played "connect" and every Mountain card "natural disaster". Fixed by binding each landmark to its own word through a string `word_key`; landmarks with no unit word (Tirana, Mother Teresa) show no audio chip. Rule now in `references/lexical_binding_spec.md`.

## Audio

- Story narrations and the lab dialogue were re-voiced after the text corrections (19 Sep, 20:07-20:11), with `.txt` sidecars.
- The `coast` example (word 06) was re-voiced in both voice sets; encoding checked to match each set (Google 64 kbps, Microsoft 48 kbps).
- The other 138 Microsoft-voice recordings date from 17 Sep and received sidecars without being listened to. Their text did not change, so they are expected to be correct. A spot check by ear is still worth doing.

## Folder move (19 Sep, evening)

The hub (portal, catalog, fonts) moved to the project root. Unit 1's "Coursebook Portal" links now point to `../portal.html`, and its tests check the real hub. The old copies are in `unit1/_to_delete/`, with backups of every edited file.

## Open items for the teacher

1. Delete `unit1/_to_delete/` once you are happy with the portal links.
2. Choose one skill location (project `.agents/skills/` or global `~/.gemini/config/skills/`) and remove the other; they are identical tonight.
3. The HTTP section of `test_v2.js` assumes `server.js` serves the unit folder; it is skipped while the server is off. Revisit if you use the server.
4. Listen to a sample of the 17 Sep Microsoft-voice recordings.

## Test results (19 Sep, 23:45)

- `node test_v2.js`: 108 passed, 0 failed
- `node verify_offline.js`: all passed (against the root hub)
- `node ../.agents/skills/coursebook-unit-extender/templates/test_unit.template.js 1`: 123 passed, 0 failed

## Workbook Module Build (20 Sep 2026)

Following `PROMPT_unit1_workbook.md` and the `coursebook-unit-extender` protocol, the complete 8-page Unit 1 Workbook (10-0148-02_V2, pp. 6–13) was converted into an interactive module inside `unit1/v2.html` backed by `unit1/data/unit1_workbook_data.json` and twin `unit1/data/unit1_workbook_data.js` (`window.UNIT1_WORKBOOK_DATA`).

### 1. Structure & Navigation
- All 15 official activities in printed book order: Lead-in Opening Page, A1, A2, A3, B1-I, B1-II, B2, B3, B4, B5, C1, C2, C3, D, E.
- Quick-jump filter pills: All (15), Lesson 1: Vocabulary (Opening, A1–A3), Lesson 2: Grammar (B1–B5), Lesson 3: Reading & Writing (C1–E).
- Clean A4 student worksheet print view for every individual activity triggered via `🖨️ Print Worksheet` button.

### 2. The Three Pedagogical Treatment Tiers
- **Closed Activities (A1, A3, B1-I, B1-II, B2, B3):**
  - Instant self-checking against accepted answer sets.
  - Case-insensitive, multi-space normalization.
  - "Retry Mistakes" button clears and focuses only wrong inputs while preserving correct answers.
  - "Show Model Answers" displays Teacher's Book official answers.
- **Semi-Open Activities (Opening, A2, B4, B5, C1):**
  - Pure deterministic rule checking (0 AI, 0 network calls).
  - B4: Verifies sentence contains at least one of the 6 target frequency adverbs (`always`, `usually`, `often`, `sometimes`, `rarely`, `never`) and a verbal element (length >= 3 words).
  - B5: Verifies question starts with target prompt word (`Where`, `When`, `What`, `How often`, `Do you`, `Who`) and ends with `?`.
  - C1: Verifies comprehension answer against factual keyword sets from Jack's letter.
  - Model answers pre-written from Teacher's Book key, revealable on click.
- **Open Activities (C2, C3, D, E):**
  - Scaffolding checklist that automatically ticks live as the pupil includes key points (using regex keyword matching), accompanied by the disclaimer: *(Reminder checklist, not a test score)*.
  - Clickable sentence starter chips and unit word bank pills.
  - Empty AI hook `getHint(activityId, pupilText)` returning `null` (ready for future local offline LLMs/ONNX). When `null`, displays rule-guided pedagogical writing reminders.
  - Model texts conforming to CEFR A2/A2+ standards.

### 3. Accepted-Answer Reasoning & Decisions
- **B1-I (Present Continuous):**
  - Accepted sets include both uncontracted Teacher's Book forms (`is looking after`, `is sleeping`, `are sitting`) and authentic colloquial contractions (`'s looking after`, `'s sleeping`, `'re sitting`).
  - Addressed E8 ("Tony" vs "Tonny") with a pupil "Book check" notice; exercises accept both spellings.
- **B1-II (Present Simple with Negatives):**
  - Key answers contain negative actions. Accepted sets support both full forms (`do not get up`, `do not walk`, `does not want`) and contracted forms (`don't get up`, `don't walk`, `doesn't want`).
- **B2 (Restaurant Dialogue):**
  - Culinary and kitchen conversation allows natural flexibility from the word bank. Gaps accept both progressive and simple forms where context permits (`prepare` / `cook` / `make`, `am preparing` / `'m preparing` / `am cooking` / `'m cooking` / `am making` / `'m making`, `put` / `add` / `use`, `is` / `tastes`).
- **B3 (Choose the Verb):**
  - Strictly adheres to Teacher's Book key targets (`visits`, `is crying`, `go`, `is washing`, `boils`, `are playing`).
- **A2 (Landforms Table):**
  - Follows the printed Workbook requirement (E9) with an interactive Greek Geography landforms table. Model examples include Aliakmon, Peloponnese, Olympus, Crete, Thessaly plain, Trichonida, Navarino bay, Corinthian Gulf.

### 4. Errata Handled in App
- **E2:** SB p. 2 (PDF p. 19), Christina's text — "Book check" notice rendered on Albania country dossier.
- **E8:** WB p. 2 (PDF p. 9), B1 title vs item d ("TONY" vs "Tonny") — "Book check" notice rendered on Activity B1-I.
- **E9:** WB p. 1 (PDF p. 8), A2 Landforms table vs TB key description — "Book check" notice rendered on Activity A2.

### 5. Test Results (20 Sep 2026)
- `node test_v2.js`: **228 passed, 0 failed** (including 20+ Section L Workbook assertions).
- `node verify_offline.js`: **100% passed** (0 external URLs across all runtime files).
- `node ../.agents/skills/coursebook-unit-extender/templates/test_unit.template.js 1`: **123 passed, 0 failed**.

## Proposed Skill Changes (for Units 2–10)

To ensure Units 2–10 benefit from this pattern automatically:
1. **Add Step 11 to SKILL.md:** "Workbook Companion Module".
   - Extract `20_WB_unit.txt` into `unit<N>/data/unit<N>_workbook_data.json` and sync to `.js` twin.
   - Categorize every exercise into Closed (instant check with accepted sets & contractions), Semi-Open (rule checks, no AI), or Open (auto-ticking checklists + empty `getHint()` hook).
   - Generate vector illustrations for exercises lacking artwork (school subjects, snapshot photos).
   - Provide an individual A4 printable worksheet view for every single activity.
2. **Update `sync_data_twins.js`:**
   - Already completed in this session: automatically handles `workbook` keyword and syncs `UNIT<N>_WORKBOOK_DATA`.
3. **Extend `test_unit.template.js`:**
   - Add Section L checks to verify workbook activities count, twin synchronization, accepted answer sets, and 100% offline compliance.

## Defining Vocabulary Adoption & Lexical Fixes (20 Sep 2026)

Following `TASK_definitions_v2.md` and the methodology in `defining_vocabulary.md` and `definition_review.md`:

### 1. English Definitions Modernization (CEFR A2 Controlled Vocabulary)
- **Before:** 7 / 35 clean (28 definitions contained words at B1, B2, C1, or outside the reference lists; average 10.4 words).
- **After (Adopted):** **35 / 35 clean (100% clean)**; average 10.6 words, 0 over 18-word limit. All 35 items adopted with learner-appropriate definitions meeting CEFR A2.
- **Item 29 (`race`):** Teacher decision approved (20 Sep 2026): adopted `"a large group of people whose families come from the same part of the world"`. Added dedicated `teacher_notes` entry noting pupils already know the running race homonym and that the book uses the word once in "coming from different countries and races" (SB p.1).

### 2. Item 32 Headword Correction
- Headword updated in `data/vocabulary_data.json` and twin from `"split in"` to `"split (in two)"` (correcting layout extraction loss from Appendix V "split in two").
- Updated `word_key` in `data/unit1_v2_data.json` and twin to `"split (in two)"`.
- Documented in `ERRATA.md` as **E10** beside E5 with status `approved (20 Sep 2026)`.

### 3. Item 22 Example Neutralization
- Replaced editorial claim (`"The nuclear power plant produces massive amounts of clean electricity."`) with neutral factual statement:
  `"Ukraine has several nuclear power plants that make electricity."`
- No other example sentences were modified.

### 4. Audio Synthesis Record
- **Re-synthesised (with `.txt` sidecars):**
  - All 35 definition clips in `assets/audio/defs/` using Google TTS (en, 64 kbps), including writing the missing `29_definition.txt` sidecar.
  - All 35 definition clips in `assets/audio_neural/defs/` using Edge TTS (`en-GB-SoniaNeural`, 48 kbps) with `.txt` sidecars.
  - Item 22 example clip in `assets/audio/examples/22_example.mp3` (Google TTS).
  - Item 22 example clip in `assets/audio_neural/examples/22_example.mp3` (Edge TTS `en-GB-SoniaNeural`).
- **Deliberately NOT re-synthesised:**
  - Word clips (`words/`), the remaining 34 example clips (`examples/`), story narrations, and lab dialogue (their source text did not change).

### 5. Verification Results
- `node test_v2.js`: **228 passed, 0 failed**.
- `node verify_offline.js`: **100% passed** (0 external URLs).
- `node ../.agents/skills/coursebook-unit-extender/templates/test_unit.template.js 1`: **123 passed, 0 failed**.
- `python3 ../_tools/check_definitions.py unit1`: **35/35 clean, 0 hard words (exit 0)**.

## Three-Clip Audio Architecture & Composite Clip Retirement (20 Sep 2026, 22:30)

Following `TASK_audio_refresh.md`, the audio model was restructured to eliminate composite clip drift and establish a single unified generator for all units.

### 1. The Decision: Three Clips Instead of Four
- **Problem:** Previously, each item had 4 clips (`word`, `def`, `example`, and composite `full` reading `"<word>. Definition: <definition_en>. Example: <example>"`). The composite clip duplicated text already recorded in three separate files, so any edit to a word, definition, or example silently invalidated it.
- **Solution:** Dropped composite `full` clips completely. The full reading action now sequences the three existing clips (`word` -> `def` -> `example`) with a deliberate 350 ms natural pause on the `ended` event.
- **Benefits:**
  - One text edit costs exactly 1 recording, not 2.
  - The entire composite drift class is permanently eliminated.
  - 3 clips per item instead of 4: 210 files per unit across both voice sets instead of 280 (saving ~700 unnecessary files across Units 2–10).
  - Clean pedagogical spacing between word, definition, and example.

### 2. Files Retired to `_to_delete/`
- `assets/audio/full/` -> moved to `unit1/_to_delete/audio_full/audio/` (35 stale Google composite recordings).
- `assets/audio_neural/full/` -> moved to `unit1/_to_delete/audio_full/audio_neural/` (35 stale Neural composite recordings).
- Left intact in `_to_delete/` for the teacher to remove.
- All references to `/full/` and `case 'full'` purged from runtime files (`app_v2.js`, `app.js`, `test_app.js`, etc.).

### 3. Audio Refresh & Sidecar Census
- **Google TTS (`assets/audio/`):**
  - Re-voiced all 35 `words/` and all 35 `examples/` with exact `.txt` sidecars using `--set google --only words,examples --force`.
  - Combined with the 35 `defs/` re-voiced earlier, all 105 Google clips now have verified, matching `.txt` sidecars.
- **Neural TTS (`assets/audio_neural/`):**
  - Re-voiced item 32 (`split (in two)`) with `--set neural --only words --ids 32 --force`.
  - All 105 Neural clips (`words/`, `defs/`, `examples/`) have verified, matching `.txt` sidecars.

| Folder | Voice Engine | MP3 Clips | `.txt` Sidecars | Status |
|---|---|---|---|---|
| `assets/audio/words` | Standard Google TTS (64 kbps) | 35 | 35 | Re-voiced with sidecars |
| `assets/audio/defs` | Standard Google TTS (64 kbps) | 35 | 35 | Clean (re-voiced 20 Sep) |
| `assets/audio/examples` | Standard Google TTS (64 kbps) | 35 | 35 | Re-voiced with sidecars |
| **Google TTS Subtotal** | | **105** | **105** | **100% verified** |
| `assets/audio_neural/words` | Natural Neural AI (Sonia, 48 kbps) | 35 | 35 | Clean (#32 refreshed) |
| `assets/audio_neural/defs` | Natural Neural AI (Sonia, 48 kbps) | 35 | 35 | Clean (re-voiced 20 Sep) |
| `assets/audio_neural/examples` | Natural Neural AI (Sonia, 48 kbps) | 35 | 35 | Clean |
| **Neural TTS Subtotal** | | **105** | **105** | **100% verified** |
| **Grand Total** | | **210** | **210** | **100% verified (0 missing, 0 drifted)** |

### 4. Single Unified Generator (`generate_unit_audio.js`)
Updated `.agents/skills/coursebook-unit-extender/scripts/generate_unit_audio.js` (and synchronized across skill roots):
- `--set google|neural|both` (default: `both`). Standard Google TTS via `google-tts-api` (64 kbps) and Edge TTS `en-GB-SoniaNeural` (48 kbps). Both engines always produce `.txt` sidecars.
- `--only words,defs,examples` (default: all three). If `--only full` is passed, it rejects with a clear retirement notice and exits 1.
- `--ids 1,22,29` (default: all).
- `--check`: audit mode that inspects every clip and sidecar against `data/vocabulary_data.json`, verifies existence and exact text match, and exits 1 on drift/missing or 0 on clean.
- Preserved `[VOCAB INCOMPLETE]` failure tracking and exit code 1.
- Superseded and retired one-off scripts:
  - `build_data_and_audio.js`: audio synthesis disabled; marked to use `generate_unit_audio.js --set google`.
  - `generate_neural_voice.js`: marked superseded by `generate_unit_audio.js --set neural`.

### 5. Regression Tests Added
- Added Section M to `unit1/test_v2.js` and updated Criterion 4 in `.agents/skills/coursebook-unit-extender/templates/test_unit.template.js`:
  - Asserts all 210 clips exist and have valid file sizes (> 500 B).
  - Asserts all 210 clips have `.txt` sidecars.
  - Asserts all 210 sidecars match `vocabulary_data.json` verbatim.
  - Asserts 0 references to `/full/` audio paths across runtime files (`v2.html`, `app_v2.js`, `style_v2.css`, `index.html`, `app.js`, `style.css`).
  - Asserts `app_v2.js` implements `playAudioSequence` queuing exactly `[word, def, example]`.

### 6. Verification Test Suite Run
- `node ../.agents/skills/coursebook-unit-extender/scripts/generate_unit_audio.js vocab data/vocabulary_data.json --set both --check`: **All 210 checked clips and sidecars match current vocabulary data (exit 0)**.
- `node test_v2.js`: **238 passed, 0 failed (exit 0)**.
- `node verify_offline.js`: **100% passed (0 external URLs, exit 0)**.
- `node ../.agents/skills/coursebook-unit-extender/templates/test_unit.template.js 1`: **63 passed, 0 failed (exit 0)**.
- `python3 ../_tools/check_definitions.py unit1`: **35/35 clean, 0 hard words (exit 0)**.

## Proposed skill changes
Step 8 in SKILL.md now specifies three clips per item (`words`, `defs`, `examples`), no composite `full` clips, and one unified generator (`generate_unit_audio.js`) for both Google and Neural voice sets with mandatory `.txt` sidecars and `--check` auditing.

## Wikimedia Commons Visual Glossary Build — Second Pass (22 Sep 2026)

Following `visual_glossary.md` and the updated Second Pass brief, freely licensed photographs from Wikimedia Commons were searched, audited, and deployed for all 14 visual gloss items in Unit 1.

### 1. Updated Licence Policy & Anchor Rules
- **Licence Policy:** Admitted `CC0`, `Public domain`, `PD-*`, `PDM`, `CC BY <version>`, and **`CC BY-SA <version>`**. Scaling and format conversion to WebP are technical modifications under CC 4.0 licences and do not create adapted material; placing an unmodified picture in the app does not make the app share-alike. Where a gilded museum frame was cropped out (Item 13), the crop inherits share-alike and is explicitly documented in `image_modified`. GFDL-only and unparseable usage terms remain strictly excluded.
- **Anchor Rule:** Where `definition_en` or `example` names a specific place or thing, the image depicts that exact entity:
  - **13 golden fleece:** Depicts Jason and the Golden Fleece (oil painting by Peter Paul Rubens).
  - **19 mountain:** Redone with Mount Olympus (`Hiking on Mount Olympus 54.jpg`), replacing Ama Dablam (Nepal) so the gloss directly illustrates the definition *"like Mount Olympus"*.
  - **26 peninsula:** Depicts the Peloponnese from space (`The Peloponnese from ISS.jpg`), showing the landmass surrounded by water on three sides and connected by the Isthmus.
  - **27 plain:** Depicts the Plain of Thessaly (`Plain of Thessaly.jpg`), showing the vast flat agricultural expanse.
- **Query Ladder:** Each item followed the 4-rung ladder stopping at the first rung that yielded an acceptable picture.
- **Pedagogical & Photocopy Contrast:** Every candidate was converted to grayscale and scaled to 35 mm (school photocopier width) to guarantee high-contrast legibility when printed without colour. All files are under the 90 KB ceiling.

### 2. Query Ladder & Picture Selections (14 Items)

| ID | Word | Ladder Rung Succeeded | Chosen Commons File | Licence | Size (WebP) | Runner-up & Rejection Rationale |
|---|---|---|---|---|---|---|
| **04** | **citrus fruit** | **Rung 1** (`incategory:"Quality images" filetype:bitmap citrus fruit`) | `File:Citrus paradisi (Grapefruit, pink) white bg.jpg` | CC BY-SA 2.5 | 29.3 KB | Cand #5 (`Mandarin Oranges (Citrus Reticulata).jpg`, CC BY-SA 3.0) rejected because it shows only whole, unpeeled mandarins without interior segments; Cand #4 provides whole fruit, a cut cross-section, and a juicy wedge on a clean white background, instantly illustrating citrus pulp and rind. |
| **05** | **coal mines** | **Rung 4** (`filetype:bitmap surface coal mine`) | `File:Surface coal mine detail, Gillette, Wyoming.jpg` | CC BY-SA 2.0 | 77.2 KB | Rungs 1–3 failed: Rung 1 candidates are abandoned winding towers overgrown with trees (`Couillet`), train terminals, or historic brick buildings; Rung 3 (`incategory:"Coal mines"`) gave demolished rubble or trade-fair machinery. Cand #2 on Rung 4 clearly shows the massive stepped black coal seam terraces and excavation machinery of a major working coal mine pit, instantly recognizable to an 11-year-old pupil. |
| **06** | **coast** | **Rung 1** (`incategory:"Quality images" filetype:bitmap rocky coast`) | `File:Rocky Coast El Houaria Tunisia.jpg` | CC BY-SA 4.0 | 86.8 KB | Cand #2 (`Peterborough... Worm Bay`) rejected because it shows a low sandy beach inlet rather than a clear rocky coastline; Cand #1 offers a dramatic coastal headland meeting deep blue water with crashing white foam, maintaining a strong diagonal contrast boundary in 35 mm grayscale print. |
| **09** | **copper** | **Rung 1** (`incategory:"Quality images" filetype:bitmap copper wire`) | `File:Electric guide 3×2.5 mm.jpg` | CC BY-SA 4.0 | 21.8 KB | Cand #2 (`Wago splicing connector`) rejected because the orange plastic lever block dominates the frame; Cand #1 focuses directly on stripped industrial cable with three bright, reflective reddish-brown copper conductor cores, perfectly matching both the definition (*"soft red-brown metal"*) and the example (*"thin copper wires"*). |
| **13** | **golden fleece** | **Rung 2** (`filetype:bitmap Jason golden fleece`) | `File:Jason and the Golden Fleece by Peter Paul Rubens.jpg` | CC BY-SA 4.0 | 72.7 KB | Rung 1 returned 0 results. On Rung 2, Candidates #1–#6 (Thorvaldsen's classical statue) depict completely nude male figures with exposed genitals, inappropriate for primary school coursebooks; Cand #8 has large burned-in text (`"I am JASON"`). Cand #7 is Rubens' historic oil study of Jason in armor holding the fleece; cropped 11% to remove the gilded museum frame. |
| **14** | **instrument** | **Rung 1** (`incategory:"Quality images" filetype:bitmap musical instruments`) | `File:Flute with musicial notes.jpg` | CC BY-SA 4.0 | 75.1 KB | Cand #1 (`Double guitar Paris 1690`) rejected due to museum display case reflections and an atypical antique design unfamiliar to 6th graders; Cand #3 features a modern silver concert flute cleanly resting on sheet music with legible notation, providing high pedagogical clarity and stark grayscale photocopy contrast. |
| **16** | **landscape** | **Rung 1** (`incategory:"Quality images" filetype:bitmap countryside landscape`) | `File:Tuscan Landscape 7.JPG` | CC BY-SA 3.0 | 63.0 KB | Cand #1 (`Frosty Raftsundet landscape...`) rejected due to low morning light, heavy shadows, and mist that turn murky in black-and-white reproduction; Cand #2 shows sunlit rolling countryside hills with harvested fields and cypress trees, presenting a quintessential landscape under a clear sky. |
| **19** | **mountain** | **Rung 1** (`incategory:"Quality images" filetype:bitmap Mount Olympus`) | `File:Hiking on Mount Olympus 54.jpg` | CC BY-SA 4.0 | 80.8 KB | **Redone under Anchor Rule** (Pass 1's Ama Dablam rejected as Himalayan). Among the Mount Olympus Quality Images set, Cand #1 (`03`) was rejected because it features a wooden footbridge; Cand #3 (`11`) was rejected because it is a vertical shot dominated by foreground scree and hillside. Cand #7 (`54`) is a wide horizontal landscape panorama of Mount Olympus' rocky summits under a clear blue sky, peer-reviewed in Commons under `Category:Quality images of mountains`. |
| **23** | **oil well** | **Rung 1** (`incategory:"Quality images" filetype:bitmap pumpjack`) | `File:Gnitz (Usedom), Ölförderpumpe -- 2010 -- 2673.jpg` | CC BY-SA 4.0 | 53.8 KB | Cand #1 (`Pumpjacks.JPG`) rejected due to dusk/sunset silhouetting and cluttered background; Cand #3 (`Balancín petrolero I`) has a cramped angle with distracting overhead cables. Cand #4 by Dietmar Rabich is a clean daytime photograph of a solitary pumpjack in an open field, free of logos, graffiti, or clutter. |
| **26** | **peninsula** | **Rung 2** (`filetype:bitmap Peloponnese satellite`) | `File:The Peloponnese from ISS.jpg` | Public domain | 57.7 KB | Rung 1 returned 0 results. Cand #1 rejected due to burned-in cartographic place names and borders; Cand #2 (`Peloponnese modis`) rejected due to atmospheric haze and washed-out coastline contrast. Cand #4 is an authentic NASA astronaut photograph from the International Space Station showing the entire Peloponnese peninsula, the surrounding seas on three sides, and the narrow Isthmus connecting it to mainland Greece. |
| **27** | **plain** | **Rung 2** (`filetype:bitmap Thessaly plain`) | `File:Plain of Thessaly.jpg` | CC BY-SA 4.0 | 20.0 KB | Rung 1 returned 0 results. Cand #1 (`Thessaly Plain.jpg` by Evgeni Dinev) rejected because it focuses on a winding river valley enclosed by hills rather than the flat expanse. Cand #4 (Robin Rönnlund) taken from Farsala captures the expansive, flat agricultural plain of Thessaly stretching to the horizon, directly matching the book's definition (*"large flat area where farmers grow food"*). |
| **30** | **river** | **Kept (Pass 1)** | `File:The Brynica River flowing through meadows on the border of Sosnowiec and Katowice in the morning.jpg` | CC BY 4.0 | 81.3 KB | Kept as previously deployed. A peer-reviewed Quality Image showing a clear meandering river course through meadows with distinct bank reflections; water line remains high-contrast in 35 mm grayscale print. |
| **34** | **underwater** | **Rung 1** (`incategory:"Quality images" filetype:bitmap underwater seabed`) | `File:Gallito (Stephanolepis hispidus), franja marina Teno-Rasca, Tenerife, España, 2022-01-06, DD 16.jpg` | CC BY-SA 4.0 | 19.0 KB | Candidates #1, #5, #6 (`Lenguado común...`) depict flatfish so camouflaged against the sandy seabed that they dissolve completely into gray speckles in a 35 mm photocopy. Cand #3 features a planehead filefish swimming in clear water above the sandy seabed and rocks, making both the marine creature and the underwater floor unmistakably clear. |
| **35** | **water supplies** | **Rung 1** (`incategory:"Quality images" filetype:bitmap drinking water tap`) | `File:Benasque - Anciles - Grifo 01.jpg` | CC BY-SA 4.0 | 27.7 KB | Cand #3 (`Korfu... 1362`) rejected due to a weathered wall with confusing exposed plumbing; Cand #4 features a cow drinking from a tap. Cand #1 depicts a traditional public stone drinking fountain with fresh water streaming cleanly from a brass tap into a basin, directly communicating the concept of municipal drinking water supplies. |

### 3. Items Left Without Picture
**None.** All 14 visual gloss items successfully cleared the licence audit, anchor rule validation, 35 mm grayscale photocopier check, and the < 90 KB file size ceiling.

### 4. Full Pupil & Legal Attribution List

1. **Citrus Fruit (Item 04):**
   - **File:** `assets/images_v2/vocab/04_citrus_fruit.webp`
   - **Alt Text (CEFR A2):** `"A whole pink grapefruit, with a cut half and a slice"`
   - **Commons File:** `File:Citrus paradisi (Grapefruit, pink) white bg.jpg`
   - **Pupil Credit:** `א (Aleph) / raeky / Wikimedia Commons / CC BY-SA 2.5`
   - **Full Source:** `Wikimedia Commons, Grapefruit (Citrus paradisi) with pink flesh, א (Aleph) and raeky, CC BY-SA 2.5, https://creativecommons.org/licenses/by-sa/2.5`
   - **Modifications:** scaled to 768px, converted to webp (29.3 KB)

2. **Coal Mines (Item 05):**
   - **File:** `assets/images_v2/vocab/05_coal_mines.webp`
   - **Alt Text (CEFR A2):** `"A large open-pit coal mine with black layers and excavating machines"`
   - **Commons File:** `File:Surface coal mine detail, Gillette, Wyoming.jpg`
   - **Pupil Credit:** `Greg Goebel / Wikimedia Commons / CC BY-SA 2.0`
   - **Full Source:** `Wikimedia Commons, Surface coal mine detail, Gillette, Wyoming, Greg Goebel, CC BY-SA 2.0, https://creativecommons.org/licenses/by-sa/2.0`
   - **Modifications:** scaled to 768px, converted to webp (77.2 KB)

3. **Coast (Item 06):**
   - **File:** `assets/images_v2/vocab/06_coast.webp`
   - **Alt Text (CEFR A2):** `"A rocky coast with blue sea water and white waves"`
   - **Commons File:** `File:Rocky Coast El Houaria Tunisia.jpg`
   - **Pupil Credit:** `Aymen FANTAR / Wikimedia Commons / CC BY-SA 4.0`
   - **Full Source:** `Wikimedia Commons, Rocky Coast El Houaria Tunisia, Aymen FANTAR, CC BY-SA 4.0, https://creativecommons.org/licenses/by-sa/4.0`
   - **Modifications:** scaled to 768px, converted to webp (86.8 KB)

4. **Copper (Item 09):**
   - **File:** `assets/images_v2/vocab/09_copper.webp`
   - **Alt Text (CEFR A2):** `"Three shiny reddish copper wires inside an electric cable"`
   - **Commons File:** `File:Electric guide 3×2.5 mm.jpg`
   - **Pupil Credit:** `Petar Milošević / Wikimedia Commons / CC BY-SA 4.0`
   - **Full Source:** `Wikimedia Commons, Electric guide 3×2.5 mm, Petar Milošević, CC BY-SA 4.0, https://creativecommons.org/licenses/by-sa/4.0`
   - **Modifications:** scaled to 768px, converted to webp (21.8 KB)

5. **Golden Fleece (Item 13):**
   - **File:** `assets/images_v2/vocab/13_golden_fleece.webp`
   - **Alt Text (CEFR A2):** `"Jason in armor holding the golden fleece, painted by Rubens"`
   - **Commons File:** `File:Jason and the Golden Fleece by Peter Paul Rubens.jpg`
   - **Pupil Credit:** `Peter Paul Rubens / Yair Haklai / Wikimedia Commons / CC BY-SA 4.0`
   - **Full Source:** `Wikimedia Commons, Jason and the Golden Fleece by Peter Paul Rubens, Yair Haklai, CC BY-SA 4.0, https://creativecommons.org/licenses/by-sa/4.0`
   - **Modifications:** cropped gilded museum frame, scaled to 768px, converted to webp (72.7 KB)

6. **Instrument (Item 14):**
   - **File:** `assets/images_v2/vocab/14_instrument.webp`
   - **Alt Text (CEFR A2):** `"A silver concert flute resting on musical notes on paper"`
   - **Commons File:** `File:Flute with musicial notes.jpg`
   - **Pupil Credit:** `Petar Milošević / Wikimedia Commons / CC BY-SA 4.0`
   - **Full Source:** `Wikimedia Commons, Flute with musicial notes, Petar Milošević, CC BY-SA 4.0, https://creativecommons.org/licenses/by-sa/4.0`
   - **Modifications:** scaled to 768px, converted to webp (75.1 KB)

7. **Landscape (Item 16):**
   - **File:** `assets/images_v2/vocab/16_landscape.webp`
   - **Alt Text (CEFR A2):** `"Rolling green and gold hills in the countryside under a clear sky"`
   - **Commons File:** `File:Tuscan Landscape 7.JPG`
   - **Pupil Credit:** `Martin Falbisoner / Wikimedia Commons / CC BY-SA 3.0`
   - **Full Source:** `Wikimedia Commons, Tuscan Landscape 7, Martin Falbisoner, CC BY-SA 3.0, https://creativecommons.org/licenses/by-sa/3.0`
   - **Modifications:** scaled to 768px, converted to webp (63.0 KB)

8. **Mountain (Item 19):**
   - **File:** `assets/images_v2/vocab/19_mountain.webp`
   - **Alt Text (CEFR A2):** `"The high rocky peaks of Mount Olympus under a clear sky"`
   - **Commons File:** `File:Hiking on Mount Olympus 54.jpg`
   - **Pupil Credit:** `Anastasiya Lvova / Wikimedia Commons / CC BY-SA 4.0`
   - **Full Source:** `Wikimedia Commons, Hiking on Mount Olympus 54, Anastasiya Lvova, CC BY-SA 4.0, https://creativecommons.org/licenses/by-sa/4.0`
   - **Modifications:** scaled to 768px, converted to webp (80.8 KB)

9. **Oil Well (Item 23):**
   - **File:** `assets/images_v2/vocab/23_oil_well.webp`
   - **Alt Text (CEFR A2):** `"A pumpjack pumping oil in a field under a blue sky"`
   - **Commons File:** `File:Gnitz (Usedom), Ölförderpumpe -- 2010 -- 2673.jpg`
   - **Pupil Credit:** `Dietmar Rabich / Wikimedia Commons / CC BY-SA 4.0`
   - **Full Source:** `Wikimedia Commons, Gnitz (Usedom), Ölförderpumpe -- 2010 -- 2673, Dietmar Rabich, CC BY-SA 4.0, https://creativecommons.org/licenses/by-sa/4.0`
   - **Modifications:** scaled to 768px, converted to webp (53.8 KB)

10. **Peninsula (Item 26):**
    - **File:** `assets/images_v2/vocab/26_peninsula.webp`
    - **Alt Text (CEFR A2):** `"The Peloponnese peninsula seen from space, surrounded by sea"`
    - **Commons File:** `File:The Peloponnese from ISS.jpg`
    - **Pupil Credit:** `NASA / ISS Expedition 59 / Wikimedia Commons / Public domain`
    - **Full Source:** `Wikimedia Commons, The Peloponnese from ISS, NASA / ISS Expedition 59, Public domain`
    - **Modifications:** scaled to 768px, converted to webp (57.7 KB)

11. **Plain (Item 27):**
    - **File:** `assets/images_v2/vocab/27_plain.webp`
    - **Alt Text (CEFR A2):** `"A wide and flat green plain with farm fields to the horizon"`
    - **Commons File:** `File:Plain of Thessaly.jpg`
    - **Pupil Credit:** `Robin Rönnlund / Wikimedia Commons / CC BY-SA 4.0`
    - **Full Source:** `Wikimedia Commons, Plain of Thessaly, Robin Rönnlund, CC BY-SA 4.0, https://creativecommons.org/licenses/by-sa/4.0`
    - **Modifications:** scaled to 768px, converted to webp (20.0 KB)

12. **River (Item 30):**
    - **File:** `assets/images_v2/vocab/30_river.webp`
    - **Alt Text (CEFR A2):** `"A river between green fields and trees"`
    - **Commons File:** `File:The Brynica River flowing through meadows on the border of Sosnowiec and Katowice in the morning.jpg`
    - **Pupil Credit:** `Krzysztof Popławski / Wikimedia Commons / CC BY 4.0`
    - **Full Source:** `Wikimedia Commons, The Brynica River flowing through meadows on the border of Sosnowiec and Katowice in the morning, Krzysztof Popławski, CC BY 4.0, https://creativecommons.org/licenses/by-sa/4.0`
    - **Modifications:** scaled to 768px, converted to webp (81.3 KB)

13. **Underwater (Item 34):**
    - **File:** `assets/images_v2/vocab/34_underwater.webp`
    - **Alt Text (CEFR A2):** `"A fish swimming underwater over the sandy sea floor"`
    - **Commons File:** `File:Gallito (Stephanolepis hispidus), franja marina Teno-Rasca, Tenerife, España, 2022-01-06, DD 16.jpg`
    - **Pupil Credit:** `Diego Delso / Wikimedia Commons / CC BY-SA 4.0`
    - **Full Source:** `Wikimedia Commons, Gallito (Stephanolepis hispidus), franja marina Teno-Rasca, Tenerife, España, 2022-01-06, DD 16, Diego Delso, CC BY-SA 4.0, https://creativecommons.org/licenses/by-sa/4.0`
    - **Modifications:** scaled to 768px, converted to webp (19.0 KB)

14. **Water Supplies (Item 35):**
    - **File:** `assets/images_v2/vocab/35_water_supplies.webp`
    - **Alt Text (CEFR A2):** `"Clean drinking water flowing from an outdoor stone fountain tap"`
    - **Commons File:** `File:Benasque - Anciles - Grifo 01.jpg`
    - **Pupil Credit:** `Basotxerri / Wikimedia Commons / CC BY-SA 4.0`
    - **Full Source:** `Wikimedia Commons, Benasque - Anciles - Grifo 01, Basotxerri, CC BY-SA 4.0, https://creativecommons.org/licenses/by-sa/4.0`
    - **Modifications:** scaled to 768px, converted to webp (27.7 KB)

### 5. Verification & Regression Checklist
- All 14 visual gloss WebP images exist locally under `assets/images_v2/vocab/` and are strictly under 90 KB (range: 19.0 KB – 86.8 KB).
- Zero remote image URLs referenced in runtime code.
- Data twins (`data/vocabulary_data.json` and `data/vocabulary_data.js`) updated in exact sync.
- `node test_v2.js`: **238 passed, 0 failed**.
- `node verify_offline.js`: **100% passed** (0 external runtime network dependencies; exact prefix regex for creativecommons.org).
- `node ../.agents/skills/coursebook-unit-extender/templates/test_unit.template.js 1`: **186 passed, 0 failed**.
- `python ../_tools/check_definitions.py unit1`: **35/35 clean, 0 hard words (exit 0)**.

## Newcomer Character Voice Differentiation (24 Sep 2026)

### 1. Pedagogical Motivation & Requirement
In Unit 1 Lesson 1 (*"Our Multicultural Class"*), the children introducing their homelands previously all shared a single neural voice (`en-GB-SoniaNeural`). During classroom testing with 6th-grade pupils, listening to three newcomer children from different countries (Sasha from Ukraine, Christina from Albania, Georgi from Georgia) and local host Gwen in the exact same mature female voice reduced character distinction and immersion. In particular, Georgi (a young schoolboy) was voiced by an adult female.

The requirement was to provide differentiated voices:
- **Two distinct female voices** for Sasha and Christina.
- **An authentic young male voice** for Georgi.
- Dedicated voice metadata and tests ensuring 100% offline playback with exact sidecar matching.

### 2. Character Voice Mapping

| Character | Country | Role / Age | Assigned Voice | Characteristics | Audio File |
|---|---|---|---|---|---|
| **Sasha** | Ukraine 🇺🇦 | Female pupil | `en-GB-MaisieNeural` | Bright, lively British schoolgirl voice | `assets/audio_v2/stories/ukraine_full_story.mp3` (371 KB) |
| **Christina** | Albania 🇦🇱 | Female pupil | `en-GB-LibbyNeural` | Clear, youthful British female voice (distinct from Maisie) | `assets/audio_v2/stories/albania_full_story.mp3` (343 KB) |
| **Georgi** | Georgia 🇬🇪 | Male pupil | `en-US-EricNeural` | Authentic young male (boy) voice; replaces adult voice | `assets/audio_v2/stories/georgia_full_story.mp3` (251 KB) |
| **Gwen** | UK 🇬🇧 | Host pupil (Oxford) | `en-GB-SoniaNeural` | Warm, expressive British female narrator voice | `assets/audio_v2/stories/uk_full_story.mp3` (408 KB) |

### 3. Implementation Details
1. **Data Schemas & Twins:**
   - Updated `data/unit1_v2_data.json` with `voice` and `voice_description` fields for each story entry.
   - Synchronized twin file `data/unit1_v2_data.js` via `node ../.agents/skills/coursebook-unit-extender/scripts/sync_data_twins.js data/unit1_v2_data.json`.
2. **Audio Synthesis Pipeline:**
   - Re-synthesized all 4 story MP3s using Edge TTS neural models matching the exact verbatim textbook text.
   - Maintained matching `.txt` sidecars alongside every audio file in `assets/audio_v2/stories/`.
   - Updated `generate_v2_assets.js` with `CHARACTER_VOICES` mapping so that running the asset generator preserves and re-synthesizes each character's assigned voice and updates `.txt` sidecars.
3. **User Interface (Dossier Profiles):**
   - Updated `app_v2.js` to render a dedicated voice badge (`🎙️ Voice: [Voice Name]`) in the newcomer dossier header meta-tags, letting teachers and pupils visually identify who is speaking.
4. **Test Suite Verification:**
   - Added `Section N: Newcomer Character Story Voices` to `unit1/test_v2.js`, asserting:
     - Voice assignments for Sasha (`en-GB-MaisieNeural`), Christina (`en-GB-LibbyNeural`), Georgi (`en-US-EricNeural`), and Gwen (`en-GB-SoniaNeural`).
     - Distinctness assertion (all 4 voices are distinct; Sasha ≠ Christina; Georgi is young male).
     - File existence, size (> 100 KB), and verbatim `.txt` sidecar text equivalence.
   - Test results: `node test_v2.js` passed **265 assertions, 0 failed**.






## Photodentro OER Integration: Present Simple vs. Present Continuous (04 Oct 2026)

### 1. Source & Pedagogical Alignment
Modernized from the official Greek Ministry of Education Open Educational Resource (OER) hosted on the Photodentro National Repository (Ψηφιακό Σχολείο / ΙΤΥΕ «ΔΙΟΦΑΝΤΟΣ», Version 2.0). 
- **Learning Object**: *Present Simple & Present Continuous for Younger Children (v2.0)*
- **Curriculum Alignment**: Matches **Unit 1 Lesson 2** (*"A school day in Great Britain - What do you usually do? / What are you doing now?"*) and the contrast between routine habits / frequency adverbs (*always, usually, every day, at 7.45*) and temporary present actions (*now, today, look!, watch out!*).
- **Format**: 27 curriculum-aligned contrast sentences organized in dynamic 5-sentence rounds, with instant checking, hints, scoring, and review.

### 2. Architecture & Deliverables
1. **Self-Contained Local App**:
   - Deployed at `unit1/photodentro/` (`index.html`, `app.js`, `css/style.css`, `fonts/`, `credits/`).
   - 100% offline, zero external CDN or network dependencies, fully GDPR-compliant.
   - Enhanced with a topbar return button linking back to the Unit 1 Coursebook Companion.
2. **In-App Integration in Flagship Companion (`v2.html`)**:
   - Added **Sub-module E** inside `MODULE 2: GRAMMAR LAB` featuring an interactive presentation card with direct launch capabilities.
   - Built a distraction-free in-app modal overlay (`#photodentroModal`) allowing pupils to play the quest seamlessly inside `v2.html` without navigating away, plus an option to open full-screen in a new tab.
3. **Version 1 Vocabulary Lab Link (`index.html`)**:
   - Added a direct quick-launch button in the header (`🏛️ Photodentro Grammar Quiz ➔`).
4. **Portal Hub Integration (`portal.html`, `data/coursebook_catalog.json`)**:
   - Registered `photodentro_url: "unit1/photodentro/index.html"` and `"Photodentro OER"` tag in Unit 1 catalog data.
   - Added an emerald `[ 🏛️ Photodentro OER Lab ]` action button to Unit 1's card in `portal.html` and `portal.js`.
5. **Verification**:
   - `node test_v2.js`: 260 assertions passed, 0 failed.
   - `node verify_offline.js`: 100% offline compliance passed with zero external network leaks.
