---
name: coursebook-unit-extender
description: >-
  Builds, modernizes, and extends the digital coursebook companion (Version 2) to any English 6th Grade unit (Units 2-10).
  Activate this skill whenever the user asks to create, build, generate, modernize, or extend a new unit
  (e.g., "build Unit 2", "extend to Unit 3", "modernize Unit 4", or provides a unit PDF like "st_unit2.pdf").
---

# Coursebook Unit Extender (Version 2 Framework)

This skill provides an autonomous, end-to-end runbook for taking **any** 6th Grade Primary English Coursebook unit (Units 2 through 10) and expanding it into a state-of-the-art **Version 2 Digital Companion** with interactive CLIL dossiers, neural multi-voice audio, inductive grammar labs, clue challenges, portfolio writing workshops, and printable classroom worksheets.

When the user supplies **only** the coursebook unit (e.g. *"Unit 2"*, *"Unit 3: Imaginary Creatures"*, or provides *"st_unit2.pdf"*), follow the protocol below without requiring repetitive instructions.

---

## Multi-Unit Folder Architecture

To avoid cross-unit asset overwriting or namespace pollution, adhere strictly to the following repository layout:

```
vocabulary st/
├── portal.html, portal.js, portal.css, data/coursebook_catalog.{json,js}   ← Central hub
├── assets/fonts/                                                            ← Shared offline font files (.woff2)
├── _tools/        check_definitions.py, word lists, visual_gloss_brief.html, build_source_packs.py
├── _scratch/      candidates, test images, anything temporary (never shipped, never inside a unit)
├── .agents/skills/coursebook-unit-extender/templates/unit_shell/   ← the shared app shell
├── unit1/                                                                  ← Unit 1 standalone app
│   ├── index.html (v1), v2.html (v2), app_v2.js, test_v2.js
│   ├── data/unit1_v2_data.{json,js}, data/vocabulary_data.{json,js}
│   └── assets/ (audio/, audio_neural/, audio_v2/, images_v2/)
├── unit2/                                                                  ← Unit 2 standalone app
│   ├── index.html (v1), v2.html (v2), app_v2.js, test_v2.js
│   ├── data/unit2_v2_data.{json,js}, data/vocabulary_data.{json,js}, data/unit2_workbook_data.{json,js}
│   └── assets/ (audio/, audio_neural/, audio_v2/, images_v2/)
└── ...
```

- In `portal.html` and `data/coursebook_catalog.json`, ready unit links are relative paths: `"unit1/v2.html"`, `"unit2/v2.html"`.
- In each unit's `v2.html`, set `<body data-unit="<N>">`.
- In each unit's `app_v2.js`, resolve dynamically: `const unitNum = document.body.dataset.unit || '1'`, loading `window['UNIT' + unitNum + '_V2_DATA']` and `data/unit${unitNum}_v2_data.json`.
- All assets and vocabulary datasets remain strictly scoped inside their respective unit directory (`unit<N>/`).

---

## Build-Time Cloud Services & GDPR Privacy Guarantee

> [!IMPORTANT]
> **Zero Runtime External Network Calls**:
> `node-edge-tts` (Microsoft Edge neural speech) and `google-tts-api` (Google TTS) are executed **strictly at build time** to pre-render static audio files (`.mp3`) during development.
> Only static coursebook text is sent to build-time synthesis tools; **zero pupil data, zero IP addresses, and zero tracking telemetry** are transmitted.
> At runtime in the classroom browser, the application runs **100% offline**, loading local font files from `assets/fonts/` and local audio from `assets/audio*/`.
> Complies with Greek Ministry of Education privacy guidelines and European GDPR standards (cf. LG München I, 20 Jan 2022, 3 O 17493/20).

---

## Session Protocol: one unit per fresh session

Build each unit in a **new agent session** (new Antigravity window). Long sessions drift: an agent that has built Unit 3 carries Unit 3's characters, words and decisions into Unit 4. Everything a unit needs is in files, so nothing is lost by starting fresh.

1. **Start**: read this SKILL.md, `references/unit_syllabus_index.md`, `references/defining_vocabulary.md`, `references/visual_glossary.md`, the two other `references/*_spec.md` files, `templates/unit_shell/README.md`, then `unit<N>/source/00_MANIFEST.md` and `unit<N>/ERRATA.md` (create it if missing, see "Book Errors"). Read no other unit's folder. Unit 1 is not a template: everything reusable from it has been extracted into `templates/unit_shell/`.
2. **Build** Unit N following the 11 steps below, starting from the shell (see "Starting a unit: the shell").
3. **Before ending the session**, write `unit<N>/BUILD_NOTES.md`:
   - every deliberate departure from the book (corrected facts, fixed typos, resolved script/key contradictions, rights substitutions) and why;
   - anything unfinished, uncertain or needing the teacher's decision;
   - test results (paste the summary lines of the test runs).
4. **Lessons learned go into the skill, not into the next session.** If you discover a rule that should hold for every unit, list it under "Proposed skill changes" in BUILD_NOTES.md. The reviewer merges it into SKILL.md before the next unit starts.

---

## Rights: what the app must not reproduce

The printed books were licensed for print; the app is a new publication. Full table in `references/unit_syllabus_index.md` ("Rights").

- **Song lyrics** (Unit 5: The Beatles, "Yesterday"; Unit 8: ABBA, "Money, Money, Money"): no lyrics, no lyric gap-fills, no TTS reading or singing of them. Keep the surrounding language work; add a teacher note to play the song from a licensed source.
- **Branded characters** (Unit 3: Shrek, Tinkerbell; Unit 10: James Bond): names in text are fine; never generate images, SVGs or icons depicting them.
- **Book illustrations and photos**: not reusable. Visuals are either original (generated for the app, or SVG drawn for it) or freely licensed photographs and artworks from Wikimedia Commons with a pupil-visible credit. Never a picture found by web search. See `references/visual_glossary.md`.

---

## Book Errors: ERRATA.md, annotation, and asking the teacher

The books have not been corrected since 2004, and pupils still use them. The app keeps the book recognisable and **shows** each correction instead of silently making it. The teacher decides every correction.

**Before building**, look for `unit<N>/ERRATA.md`.
- If it exists, apply every entry exactly as its `Resolution` column says.
- If it does not exist, create it from `templates/ERRATA.template.md`, pre-filled with the CHECK items from `02_vocabulary_list.txt` and any errors you notice while reading the source pack. Ask the teacher to confirm the resolution for each before relying on it.

**During the build**, when you find a possible error that is not in `ERRATA.md` (a wrong fact, a caption that does not match its picture, an impossible figure, a script that contradicts its key, a dated reference, something unsuitable for 11-year-olds):
1. **Stop and ask the teacher.** Quote the book (source file and page), say what looks wrong and why, and offer resolutions: *keep as printed*, *annotate for pupils*, *teacher note only*, *replace* (only if the teacher chooses it).
2. Record the answer in `ERRATA.md` with status `approved`.
3. Never apply a change the teacher has not approved. If the teacher cannot answer now, leave the book text as printed, add the item with status `pending`, and list it in `BUILD_NOTES.md`.

**How annotations look in the app**: one consistent "Book check" component beside the affected item, at most two short lines, e.g. *"Your book says: 'five times the speed of sound'. In fact, Concorde flew at about twice the speed of sound."* Every annotation also appears in `teacher_notes` with its page reference.

**Classroom Rule on Reading Texts & Dialogues:**
Pupils in class have the physical coursebook open in front of them as reference. The student-facing reading texts, narratives, and dialogues in the app MUST match the printed page verbatim (A1/A2 level). Never rewrite texts into adult/C1 prose (e.g., 'seismic events', 'polyphonic music', 'cultivate') or alter facts in the student narrative. If a fact needs a pedagogical observation, place it strictly in `teacher_notes` (teacher-facing) and never alter the pupil narrative so 11-year-olds are not confused when comparing the screen with their printed book.

---

## Defining Vocabulary: definitions the pupils can read

A definition must be **easier than the word it explains**. This is the learner-dictionary
principle (Longman writes inside ~2000 words, Oxford's OALD inside ~3000) and it is a hard
rule here, enforced by a checker. Read `references/defining_vocabulary.md` before writing
any definition, clue, hint or glossary line; it carries the worked before/after pairs.

The short form:

- **Every word** in a definition must be a grammar word, at or below the unit's CEFR level
  in `_tools/wordlist_oxford_cefr.txt`, or a word from any unit's Appendix V list. The
  book's own vocabulary always counts, whatever level a graded list gives it.
- **Ceiling 18 words**, and do not chase a low count: professional A1 definitions run to
  16 words. A definition must build a picture, not just fence off a meaning. "a large
  natural elevation of the earth's surface" is precise and useless.
- **Anchor** visual or abstract items to a referent the class owns: "like Mount Olympus",
  "like the plain of Thessaly". A dictionary cannot do this; a national coursebook can.
- **One sense per entry**, the sense the unit uses. No definition may use another target
  word from the same unit.
- **Readable beats exact.** Each entry carries `meaning_gr`, so the Greek gloss is the
  safety net for meaning; where precision and readability conflict at A2, choose
  readability. Never state something false to make it simple: that is an ERRATA.md
  matter, not a simplification.
- **Example sentences**: 12 words maximum, at most one word above level, no editorial
  claims.
- **Published learner dictionaries**: read them for method, register and level; never copy
  their wording into the app. Their text is protected expression and attribution does not
  cure it. Word lists (the Oxford 3000/5000 by CEFR level) are data and are fine to use as
  a reference. Full reasoning, including Law 2121/1993 arts. 19 and 21, in the reference
  file.
- Never make a flag disappear by adding words to `wordlist_elt_core_extra.txt`. That file
  is the teacher's claim about what a class knows. Fix the definition, or ask.

---

## Starting a unit: the shell

Every unit is two apps built from **one shared shell**, so all ten units look and behave alike
and a bug fixed once is fixed everywhere:

- the **vocabulary app** (`index.html`, `app.js`, `style.css`): flashcards, word table, three-clip
  audio, visual glosses with credits, definition quiz;
- the **v2 companion** (`v2.html`, `app_v2.js`, `style_v2.css`): dossiers/stories, grammar lab,
  definition challenge, writing workshop, worksheets, Workbook module, "Book check" notes.

Copy `templates/unit_shell/` into `unit<N>/`, set `<body data-unit="<N>">` in both HTML files,
and put the unit's content in its data files. Every module renders only when its data key is
present, so a unit without a country dossier or a computer lab simply omits that key. **Change
the unit's data, not the shell's code.** If the unit needs something the shell cannot express,
add it to the shell generically (behind a data key), prove Unit 1 still passes its tests on the
changed shell, and record the change under "Proposed skill changes". Never fork the shell
inside one unit.

`templates/unit_shell/README.md` lists the files, the data keys each module reads, and the
per-unit files the shell does not provide (`test_v<N>.js`, the data files, the audio and images).

**If `templates/unit_shell/` does not exist, stop.** Tell the teacher the shell has not been
extracted yet and do not build a unit by copying or reading `unit1/`: that is how Unit 1's
countries, lab dialogue and one-off fixes would leak into every later unit.

---

## The 11-Step Autonomous Extension Protocol

```
[1. Ingest & Extract] ➔ [2. Pedagogical Modernization] ➔ [3. Semantic Lexis Binding]
        ➔ [4. Inductive Grammar & Listening Lab] ➔ [5. Definition Clue Challenge]
        ➔ [6. Portfolio Writing Workshop] ➔ [7. Dual Data Twins & Offline Arch]
        ➔ [8. Neural Audio & Visuals] ➔ [9. Printable 5-Pack] ➔ [10. Workbook Companion]
        ➔ [11. Regression Testing & Portal]
```

---

### Step 1: Ingestion (read the unit's source pack, not the whole books)

1. **Identify Target Unit**: unit number $N$ from the user prompt. Title, lessons, grammar and project come from `references/unit_syllabus_index.md` and `unit<N>/source/01_syllabus.txt`. Do **not** trust the catalog or memory for these; the catalog was once wrong (Unit 7 was listed as "Sports and Records").
2. **Read the source pack** `unit<N>/source/`. It already contains the extracted text of all three books for this unit. Start with `00_MANIFEST.md`, then:
   - `01_syllabus.txt`: lessons, skills, functions, structures, project, can-do statements.
   - `02_vocabulary_list.txt`: the **official** word list (Appendix V). Its CHECK section lists print errors ("orge", "pair of snickers", merged entries such as "dry cleanercause"). Handle each one as `ERRATA.md` says (see "Book Errors"): the app shows the correct form with a note that the book prints it differently. Never correct silently.
   - `10_SB_unit.txt`, `11..13_SB_*`: Pupil's Book pages and its appendices for this unit.
   - `20_WB_unit.txt`: Workbook (Activity Book).
   - `30_TB_unit.txt`: Teacher's Book guide with **verbatim recording scripts** (search `TAPESCRIPT` / `RECORDING SCRIPT`) and answer keys. `31_`, `32_`: keys to the differentiated tasks and extra activities.
   - Shared material (revision tests, workbook reviews, methodology) is in `_shared_source/`; the manifest lists which files apply.
   Do not open other units' source packs. They cost context and add nothing to this unit.
3. **If the source pack is missing**, rebuild all packs (needs `pdftotext`):
   ```bash
   python3 _tools/build_source_packs.py
   ```
   `scripts/extract_unit_pdf.js` remains as a fallback for a one-off PDF.
4. **Parse Pedagogical Components**: the three lessons as listed in `01_syllabus.txt`. Units differ: not every unit has a computer lab, a country dossier or a frequency spectrum.
   - **Target Lexis**: the unit's word list from `02_vocabulary_list.txt` (count varies, 36–69 lines), enriched with part of speech, Greek translation, English definition, IPA and an A2 example sentence.
     - `definition_en` and `example` follow "Defining Vocabulary" above; the checker gates both.
     - `ipa`: **British** pronunciation (the voices are en-GB), in the Unit 1 format `[ˈmaʊntɪn]`. Stress marks included.
     - `meaning_gr`: the sense the unit uses, comma-separated where Greek needs two words (`βουνό, όρος`). The teacher is a professional translator and reviews every `meaning_gr` line: list them in `BUILD_NOTES.md` under "For the teacher to check" rather than presenting them as final.
     - Keep the Unit 1 field set and order: `id, word, ipa, pos, der, emoji, meaning_gr, definition_en, example, category`, plus the optional image fields from `references/visual_glossary.md`.

---

### Step 2: 20-Year Modernization & Factual Audit

The coursebook dates to 2006. Modernize its context for contemporary 11–12 year olds while preserving 100% of the DEPPS-APS syllabus and CEFR A2/A2+ grammar goals:

1. **Book errors are annotated, never silently fixed** (full procedure in "Book Errors" below). Pupils keep the printed book as their reference, so the app must stay recognisable next to it.
   - **Place names**: keep the book's spelling unless `ERRATA.md` says otherwise. (Unit 1 uses Kyiv, Odesa, Tbilisi by the teacher's decision; leave them.)
   - **Factual errors, typos, wrong captions, impossible figures, script/key contradictions**: follow `unit<N>/ERRATA.md`. The default is a pupil-visible "Book check" annotation plus a teacher note.
   - Keep descriptions objective, age-appropriate and free of outdated stereotypes.
2. **Grammar Usage Heuristics**:
   - If the unit teaches **frequency adverbs** (`always`, `usually`, `often`, `sometimes`, `rarely`, `never`), **never** use stative permanent facts (e.g., avoid *"Country never borders..."*). **Always** use repeatable dynamic actions (e.g., *"It never snows in the Sahara Desert"*, *"She usually arrives early"*).
   - For every other structure, take the exact target list from the unit's `01_syllabus.txt` ("LANGUAGE (Structures/Lexis)" column) and the Grammar File `13_SB_grammar_file.txt`, then write clean inductive rules with age-appropriate contrastive examples. Teach what the book teaches, in the book's order; do not add structures it does not list.

---

### Step 3: Semantic Lexical Binding (Anti-Scrambling Rule)

1. **Bind Realia / Landmarks Semantically**:
   - Each item in a thematic dossier binds directly to the specific target vocabulary word it illustrates.
   - Use stable string keys: `"word_key": "mountain"`, resolved dynamically against `vocabulary_data.json` by word text, with `"word_id": 19` as fallback.
2. **Null Pill Rule**:
   - If a cultural landmark or realia item does not correspond to an item in the unit's target vocabulary list, set `"word_key": null` and `"word_id": null`.
   - The UI renders the card cleanly without an audio vocabulary chip. **Never** force an unrelated core word onto a card.
3. **Dossier Lexis Ownership**:
   - Every dossier's `vocabulary_ids` array must contain **only** words actually appearing in that specific narrative.

---

### Step 4: Inductive Grammar Lab & Authentic Listening (Modular Syllabus)

The Grammar Lab is modular to reflect each unit's distinct curriculum:

1. **Generic Grammar Structure**:
   - `target_structures[]`: Array of grammatical foci (e.g., Countable/Uncountable, Some/Any, Past Simple vs. Continuous, Modals).
   - `rules[]`: Inductive explanations with signal words and contrasting example sentences.
   - `practice_items[]`: Interactive practice exercises (fill-in, multiple choice, sentence sorting).
2. **Optional Lab Components** (include only when present in the unit's syllabus):
   - `frequency_spectrum`: Included if the unit teaches adverbs of frequency.
   - `school_lab_listening` / `classroom_listening`: Included if the unit has an authentic listening dialogue. Voiced from verbatim Teacher's Book script.
   - `charades_game` / `communicative_game`: Interactive classroom communicative challenge (miming, guessing, surveys) with a *"🎲 Draw Card"* button.
   - `content_true_false`: Factual and thematic comprehension questions (renamed from geography true/false for universal curriculum fit).

---

### Step 5: Definition Clue Challenge (No Crossword Grids)

> [!IMPORTANT]
> **CRITICAL RULE**: Do **NOT** build an interlocking crossword grid. Unanchored crossword objects produce broken rendering across viewports.

1. **Format as Definition Guessing**:
   - Title: **`"[Theme] Terms: Guess the Word from its Definition"`**.
   - Use key `definition_challenge` with `group_a` and `group_b` (or `crossword` with `across` and `down` for backwards compatibility).
   - Reuse coursebook clues as definitions, target vocabulary/concepts as answers. A clue printed in the book stays as printed (it is the pupils' reference). A clue **the app writes** follows "Defining Vocabulary": reuse the item's `definition_en` rather than writing a second definition of the same word.
2. **Interactive UI**:
   - `"💡 Reveal Word"` button on each clue item.
   - `"🔊 Hint"` pronunciation button for any clue word that matches a unit vocabulary item.
   - Solved score counter: `Solved: X / Total`.
3. **Compass & Thematic Definitions**:
   - Compass directions must be defined relative to their opposite (e.g., *SOUTH* = *"The compass direction opposite of North"*).
   - Extended terms not in the core vocabulary are clearly labeled as thematic extension lexis.

---

### Step 6: Portfolio Writing Workshop (Unit-Specific Genre)

Build the workshop around the unit's **own project and portfolio tasks**, as printed in the book (full detail in `references/unit_syllabus_index.md`):

| Unit | Book project | Other portfolio writing |
|---|---|---|
| 1 | A report about a European project (country report) | Diagram: schools in Greece and Great Britain; Mr Badluck's day |
| 2 | An online order | A poem about a favourite thing using the senses; canteen list |
| 3 | Act out a scene from *A Midsummer Night's Dream* | ID cards; describing and comparing monsters |
| 4 | Poems, paintings, pictures and information about the fall of Icarus | A biography (inventors); a poem |
| 5 | A museum leaflet (Transport Museum) | Writing about the past from a photo; rules and signs; an informal letter |
| 6 | A job profile | New Year's resolutions; safety rules |
| 7 | A poster about your personal record | A page for the class book of records; a report about a champion |
| 8 | An advice letter | E-mail about a museum of folk instruments; class survey on pocket money |
| 9 | Acting "The Awful Five" | E-mail about a day trip; e-mails about endangered animals; a poster |
| 10 | A film review | E-mail about a book; a poster; signs and notices |

Where the project is a performance (Units 3 and 9), the workshop scaffolds the script, roles and rehearsal notes rather than a written text.

**Scaffolding Elements**:
- Clear step-by-step section breakdown.
- Guiding questions and connector banks (`and`, `but`, `so`, `because`, `in addition`, `however`).
- Sample starter templates.
- Live formatted A4 preview with student inputs and print export.

---

### Step 7: Dual Data Architecture & Offline Support

1. **Maintain Twin Files**:
   - `data/unit<N>_v2_data.json` & `data/unit<N>_v2_data.js` (`window.UNIT<N>_V2_DATA = { ... };`)
   - `data/vocabulary_data.json` & `data/vocabulary_data.js` (`window.VOCABULARY_DATA = [ ... ];`)
   - `data/unit<N>_workbook_data.json` & `.js` (`window.UNIT<N>_WORKBOOK_DATA = { ... };`)
   - Always regenerate a twin with `scripts/sync_data_twins.js` after editing its `.json`; never hand-edit a `.js` twin.
2. **Catalog Registration**:
   - In `data/coursebook_catalog.json` and `.js`:
     - Set `status: "ready"`
     - Set `v1_url: "unit<N>/index.html"`
     - Set `v2_url: "unit<N>/v2.html"`
     - Set `badge: "Flagship v2 Ready"`
3. **Offline Priority**:
   - In `app_v2.js`, always check `if (window.UNIT<N>_V2_DATA)` before calling `fetch()` so `file:///` works seamlessly without CORS issues.

---

### Step 8: Multi-Voice Neural Audio & SVG Visuals

> [!IMPORTANT]
> **Three clips per item, never four. Units 2-10.**
> Record `word`, `definition` and `example` separately and let the app play them in
> sequence for a "full reading". Do **not** record a composite `full/` clip of
> `"<word>. Definition: ... Example: ..."`. A composite duplicates text that is already
> recorded, so editing any one of the three fields silently invalidates it: in Unit 1 a
> definition pass left all 70 composite clips reading the old text, and nothing but a hand
> audit caught it. Three clips also mean one text change costs one recording, and 210
> files per unit across two voice sets instead of 280.
> The app plays the sequence by chaining `<audio>` elements on their `ended` event with a
> deliberate 350 ms pause. The app runs from `file://`, where `fetch()` and
> `XMLHttpRequest` are blocked, so Web Audio buffer scheduling is unavailable and gapless
> playback is not achievable; the pause is the design, not a defect. `stopAudio()` must
> clear the queue, or a stop is followed by the next clip starting on its own, and the
> playback-rate setting must apply to every clip in the queue, not only the first.
> The spoken connectives "Definition:" and "Example:" are deliberately dropped; the card
> labels the three parts on screen. If they are ever wanted, they are two clips per voice
> set recorded **once for the whole project**, never per unit.
> **Unit 1 is the exception**: it was built with composite clips before this rule and they
> are kept and refreshed. If Unit 1's vocabulary text is edited again, retire its
> composites then rather than re-recording them.

1. **Audio Synthesis Helper**:
   Use `scripts/generate_unit_audio.js`, run **from inside `unit<N>/`**. It is the only audio path:
   never write a one-off audio script; if it cannot express something, add a flag to it.
   ```bash
   cd unit<N>
   G=../.agents/skills/coursebook-unit-extender/scripts/generate_unit_audio.js
   # 1. Vocabulary: word, definition and example clips, both voice sets, with sidecars
   node $G vocab data/vocabulary_data.json --set both
   #    after any text edit, refresh only what changed, e.g. two definitions:
   node $G vocab data/vocabulary_data.json --set both --only defs --ids 7,19 --force
   #    audit: records nothing, exits 1 on any missing clip, missing sidecar or drift
   node $G vocab data/vocabulary_data.json --set both --check

   # 2. Synthesize story narrations
   node $G story data/story_text.txt assets/audio_v2/stories/story_name.mp3

   # 3. Synthesize multi-character dialogues (with speaker voice map and ffmpeg/buffer merging)
   node $G dialogue data/unit<N>_v2_data.json assets/audio_v2/grammar/dialogue.mp3
   ```
2. **Audio Sidecars (`.txt`)**:
   Every synthesized `.mp3` automatically generates a matching `<filename>.txt` containing the exact voiced text. If the script text is ever edited, the generator detects the mismatch and refreshes the audio automatically (or override with `--force`).
   An `.mp3` **without** a sidecar is re-voiced by default, because nobody knows what it says. Only pass `--adopt-existing` after a person has listened and confirmed the recordings match the current text; the flag then writes sidecars instead of re-voicing.
3. **Voice Timbre Note**:
   Microsoft Edge TTS provides British voices: `en-GB-SoniaNeural`, `en-GB-RyanNeural`, `en-GB-MaisieNeural` (girl), `en-GB-LibbyNeural` (girl), and `en-GB-ThomasNeural` (male). Currently Edge TTS offers no British boy child voice; male pupils (e.g. Markos) use `ThomasNeural`, which has a more mature timbre than female child peers. This is an accepted platform limitation.
4. **SVG Visuals**:
   Provide lightweight, accessible SVGs for characters and scenes in `assets/images_v2/`.
5. **Visual glosses for vocabulary** (teacher-selected, two routes):
   For concrete items a picture is a better gloss than any definition. Read
   `references/visual_glossary.md` first. **The teacher chooses the items**; the agent never
   decides which words get a picture.
   - **Commons photograph** (preferred for real things, and required whenever the definition
     names a specific place or thing, e.g. "like Mount Olympus"): fetched with
     `scripts/fetch_commons_images.js` from a brief the teacher writes with
     `_tools/visual_gloss_brief.html`. Licence policy CC0 / PD / CC BY / CC BY-SA, keyword
     queries, the query ladder, the anchor rule, and a pupil-visible credit on the card.
   - **Generated illustration** (generic concepts only, marked with `image_prompt`): the style
     contract in the reference. Never generate a picture of a specific real place, object,
     event, machine or person: a plausible picture of the wrong thing teaches something false.
   Candidates, grayscale tests and helper code stay in `../_scratch/`, never in `unit<N>/`.

---

### Step 9: Printable Classroom Worksheets Suite (5-Pack)

Generate 5 ink-friendly, printable A4 worksheets per unit:
- **Worksheet 1**: Reading Comprehension & Dossiers (Matching + Comprehension + Critical Thinking)
- **Worksheet 2**: Grammar in Action (Inductive tense practice + Signal word ordering + Creative prompt)
- **Worksheet 3**: Collocations & Definition Clues (Lexical partnerships + Definition challenge)
- **Worksheet 4**: Guided Portfolio Writing Template (Unit genre structure with connector banks)
- **Worksheet 5**: Unit Mastery Review & Self-Assessment (Integrated review + CEFR Can-Do checklist)

---

### Step 10: Workbook Companion Module

The Workbook is part of the unit. Convert `source/20_WB_unit.txt` into
`data/unit<N>_workbook_data.json` (twin `.js` as `window.UNIT<N>_WORKBOOK_DATA`, via
`scripts/sync_data_twins.js`) and render it with the shell's Workbook module: one card per
activity, in the book's order and **with the book's numbering**, so a pupil can go from the
printed page to the screen without getting lost.

Classify every activity:
- **closed** (matching, fill-ins, choose the word): instant checking. Answers come from the
  Teacher's Book key in `source/30_TB_unit.txt`; never invent one. Store **sets**:
  `"accepted": ["do not get up", "don't get up"]`, including negatives and contractions the key
  or the grammar allows; matching uses `"pairs"`. Ignore case and extra spaces; mark which gaps
  are wrong and let the pupil retry before revealing.
- **semi-open** (answers vary within limits): `model_answers` the pupil can reveal after trying,
  plus simple rule checks written as data (starts with the given word, ends with "?", contains
  one of the target adverbs). No AI.
- **open** (letters, descriptions, notes): scaffolding only. The book's own prompts as a
  `checklist` that ticks itself by keyword (labelled in the UI as a reminder, not a mark),
  sentence starters, a unit word bank, one `model_text`. The shell's `getHint(activityId,
  pupilText)` hook returns `null`: no AI, no model download, no network call.

Every activity has a clean A4 print view. Pupil text never leaves the page and is not stored.
Where the key and the Workbook disagree, or the Workbook is wrong, it is an ERRATA item: ask.
Record every accepted-answer decision in `BUILD_NOTES.md`.

---

### Step 11: Regression Testing & Offline Verification

Run the unit verification suite **from inside the unit folder** (the tests use paths relative to it):
```bash
cd unit<N>
node test_v<N>.js
node verify_offline.js
node ../.agents/skills/coursebook-unit-extender/templates/test_unit.template.js <N>
node ../.agents/skills/coursebook-unit-extender/scripts/generate_unit_audio.js vocab data/vocabulary_data.json --set both --check
python3 ../_tools/check_definitions.py unit<N>                       # must exit 0
python3 ../_tools/check_definitions.py unit<N> --field example       # report; fix what it flags
```
`test_v<N>.js` is the unit's own suite, written in this session for this unit's content (the shell
README says what it must cover). `verify_offline.js` comes from the shell unchanged.
**Verification Checklist**:
- All vocabulary items resolve with valid audio files.
- Zero stative facts in frequency adverb examples.
- Zero crossword grid rendering bugs (definition challenge format only).
- Zero external URLs (`http://` or `https://`) across all runtime HTML, CSS, JS.
- Data twins (`.json` and `.js`) are 100% byte-consistent.
- All tests report **0 failures**.
- `check_definitions.py` exits 0: no definition contains a word above the unit's level, exceeds 18 words, is circular, or leans on another target word.
- Every recording in the unit was voiced from the current text (sidecar `.txt` matches the data).
- No song lyrics, no depictions of branded characters (see Rights).
- Every picture has its file, `image_alt`, and a credit (or `image_source: "generated"`); no candidate or scratch file inside `unit<N>/`.
- Zero autoplay: Audio must NEVER autoplay on page load, tab switch, or question loading. Audio must strictly require an explicit user click on a speaker/play button.
- Workbook: every activity present with the book's numbering; every closed item has an answer set; data twins match.
- `BUILD_NOTES.md` written (see Session Protocol), including "For the teacher to check" (`meaning_gr`, pending errata, empty picture slots).
- Every departure from the book traces to an `approved` line in `ERRATA.md`; `pending` items are left as printed and listed in `BUILD_NOTES.md`.
