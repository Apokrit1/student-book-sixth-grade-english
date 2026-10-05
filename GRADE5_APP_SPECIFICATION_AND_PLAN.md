# Unified Specification & Implementation Plan: 5th Grade English Digital Platform
## *English 5th Grade — Αγγλικά Ε΄ Δημοτικού*
**Target Level**: CEFR A1- to A1 (Beginner to Low Basic User)  
**Target Learners**: 10–11 year-old EFL Primary Students, School Teachers & Tutors in Greece  
**Curriculum**: Greek Ministry of Education & Religious Affairs (*ΥΠΑΙΘΑ*) / ITYE "Diophantus"  
**Architecture**: Zero-backend, 100% GDPR-compliant, Offline-first Dual-Engine Client Web Platform  
**Source Corpus**: `C:\photodentro\antigravity\coursebook_fifth\text\` (Pupil's Book, Activity Book, Teacher's Book, Appendices)  
**Master Vocabulary Base**: `5th grade_coursebook_cefr.json` (714 calibrated lemmas across CEFR A1/A2/B1)

---

# PART I: ARCHITECTURAL & FUNCTIONAL SPECIFICATION

## 1. Executive Vision & Foundational Principles

### 1.1 The Tripartite Architecture
The 5th Grade English application is a complete digital reimagining of the Greek state coursebook (*Αγγλικά Ε΄ Δημοτικού* by E. Kolovou and A. Kraniotou). To serve students and teachers with complete fidelity, every unit is constructed around a **Tripartite Architecture**:

```
                       ┌────────────────────────────────────────────────────────┐
                       │     Unified 5th Grade English Digital Platform         │
                       └───────────────────────────┬────────────────────────────┘
                                                   │
         ┌─────────────────────────────────────────┼────────────────────────────────────────┐
         ▼                                         ▼                                        ▼
┌─────────────────────────────────┐   ┌──────────────────────────────────┐   ┌──────────────────────────────────┐
│ 1. VOCABULARY COMPANION         │   │ 2. COURSEBOOK COMPANION          │   │ 3. MASTER COURSEBOOK PORTAL      │
│    (unitXX/index.html)          │   │    (unitXX/v2.html)              │   │    (portal.html)                 │
├─────────────────────────────────┤   ├──────────────────────────────────┤   ├──────────────────────────────────┤
│ • Interactive Table Companion   │   │ • Full Pupil's Book reading texts│   │ • 10-Unit visual dashboard       │
│ • Visual Flippable Flashcards   │   │ • Complete Workbook worksheets   │   │ • Unit progress & mastery tracker│
│ • Listening & Definition Quiz   │   │ • Differentiated Appendix (*/**) │   │ • Dual audio engine toggles      │
│ • Printable Study Sheets        │   │ • Inductive Grammar Laboratories │   │ • Integrated video showcase &    │
│ • Floating Audio Waveform HUD   │   │ • Landmark Hotspot Storyboards   │   │   Photodentro OER launchpad      │
│ • Dual-Engine Audio Pronunciation│  │ • Teacher's Book Answer Keys     │   │ • Full offline export / backup   │
└─────────────────────────────────┘   └──────────────────────────────────┘   └──────────────────────────────────┘
```

### 1.2 The Dual-Role Mandate for 5th Grade
1. **Total Printed Book Replacement**:
   - Provides 100% digital coverage of the **Pupil's Book (170 pp)**, the **Activity Book / Workbook (98 pp)**, and the **Teacher's Book (146 pp)**.
   - Eliminates the need for physical textbooks, paper workbooks, notebooks, and standalone CD players in both physical classrooms and home study.
   - All 10 units, 30 lessons, 10 revision/self-assessment sections, and the 26-page **Differentiated Appendix (`*` and `**`)** are interactive, auto-evaluating, and state-persistent.
2. **Augmented Digital Companion**:
   - Embeds interactive story dossiers following the three core protagonists: **Kostas** (Greece), **Nadine** (France), and **Mark** (UK).
   - Features dual-engine synchronized audio (clear pedagogical articulation + native British neural voice), inductive grammar sandboxes, vocabulary discovery hotspots, and scientifically calibrated distractor quiz applets.
   - Seamlessly integrates Greek National Educational Repository (**Photodentro OER**) interactive applets.

### 1.3 Pedagogical Calibration for CEFR A1- to A1
While 6th Grade targets A1/A1+, 5th Grade serves younger learners (ages 10–11) transitioning into formal literacy:
* **Lexical Cap**: Target words defined using strictly A1-level vocabulary (concrete nouns, high-frequency verbs, color/shape/action adjectives). Maximum definition length: **14 words**. Zero circularity.
* **Typographic Readability**: High-legibility sans-serif fonts with generous x-height (Lexend / Outfit / Inter), increased line spacing (1.6), and visual scaffolding icons matching the official coursebook symbols (Listening ear, Speaking lips, Writing pencil, Reading glasses, Group work).
* **Cognitive Load Control**: Tasks chunked into 3–5 items per interaction screen. Error states are gentle, inviting, and formative rather than punitive.

---

## 2. Core Functional Capabilities (What the App Does)

### 2.1 The Interactive Vocabulary Companion (`unitXX/index.html` + `app.js`)
The Vocabulary Companion is the dedicated, high-intensity lexical learning station for every unit. It houses all headwords, phonetic guides, Greek translations, simple definitions, and contextual examples, supporting six specialized learning modes:

```
┌────────────────────────────────────────────────────────────────────────┐
│             Six Specialized Learning Modes in Vocabulary Companion     │
├────────────────────────────┬───────────────────────────────────────────┤
│ Mode                       │ Functional Mechanics & User Actions       │
├────────────────────────────┼───────────────────────────────────────────┤
│ 1. Table Companion         │ 6-column interactive lexical grid:        │
│                            │ Word, POS, IPA Phonetic, Greek Meaning,   │
│                            │ Simple A1 Definition, Example Sentence.   │
│                            │ 4 Audio triggers per row: [Word], [Def],  │
│                            │ [Example], and chained [Play All].        │
│                            │ Highlights target words in example text.  │
├────────────────────────────┼───────────────────────────────────────────┤
│ 2. Visual Flashcards       │ 3D tactile flip cards for self-testing.   │
│                            │ Front: Word + IPA + Topic Badge + Audio.  │
│                            │ Back: Greek meaning + Simple Definition + │
│                            │ contextual example with target word mark. │
│                            │ Controls: Next, Prev, Shuffle, Keyboard   │
│                            │ Spacebar flip, touch swipe navigation.    │
├────────────────────────────┼───────────────────────────────────────────┤
│ 3. Listening Challenge     │ Audio stimulus plays automatically without│
│                            │ showing the English spelling. Student     │
│                            │ selects the correct Greek translation from│
│                            │ 4 calibrated distractors (distractor.md). │
│                            │ Formative audio feedback + streak counter.│
├────────────────────────────┼───────────────────────────────────────────┤
│ 4. Definition Challenge    │ Child-friendly A1 English clue presented; │
│                            │ student chooses the correct target word   │
│                            │ from 4 POS-matched choices. Explanations  │
│                            │ provided for incorrect selections.        │
├────────────────────────────┼───────────────────────────────────────────┤
│ 5. Printable Study Sheet   │ Clean, high-contrast, print-optimized     │
│                            │ layout (@media print) formatting the unit │
│                            │ lexis into a two-column revision table    │
│                            │ with name/date header for paper homework. │
├────────────────────────────┼───────────────────────────────────────────┤
│ 6. Script & Sidecar View   │ Transparent developer & teacher inspector │
│                            │ showing exact TTS verbatim scripts and    │
│                            │ sidecar text files (.txt sidecars).       │
└────────────────────────────┴───────────────────────────────────────────┘
```

#### Shared Controls across the Vocabulary Companion:
* **Real-Time Instant Search**: Live fuzzy filtering across English headwords, Greek translations, definitions, and topics simultaneously.
* **Topic Pill Filter**: Dynamically populated filter chips derived from unit topics (e.g., `All Words (45)`, `Computer Parts (12)`, `Internet Actions (8)`, `Feelings (10)`).
* **Dual-Engine Voice Switcher**: Instantly toggles between:
  - **Natural Neural AI**: High-fidelity British English accent via Microsoft Edge Neural synthesis (`en-GB-SoniaNeural`).
  - **Google Standard**: Classic clear pedagogical pronunciation.
* **Speed Calibrator**: Three-position speed control: **0.8x** (slow articulation for phonetic drilling), **1.0x** (standard), and **1.2x** (fluent review).
* **Floating Audio HUD**: Persistent audio controller that slides into view during playback, displaying real-time animated audio waveforms, the active word title, and instant Pause/Stop controls.
* **Seamless Bridge to Coursebook V2**: Direct header button launching the full Coursebook & Workbook companion (`v2.html`), ensuring students move effortlessly between lexical mastery and narrative reading.

---

### 2.2 The Coursebook & Workbook Companion (`unitXX/v2.html` + `app_v2.js`)
The Coursebook Companion is the full digital environment replacing the physical Student's Book, Workbook, and Teacher's Book:

* **Synchronized Reading & Workstation View (Tablet, Laptop & Desktop)**:
  - Left pane displays the authentic coursebook lesson: dialogues between Kostas, Nadine, and Mark, cultural reading texts, poems, or song lyrics.
  - Right pane hosts the corresponding comprehension tasks, vocabulary exercises, or grammar challenges.
  - Interactive cross-linking: Tapping a highlighted lexical item or landmark in the text instantly focuses its corresponding question in the worksheet.
* **Single-Column Responsive Fold (Mobile 360px - 480px)**:
  - Stacks the reading and exercise modules vertically with a persistent, non-intrusive floating toggle ("Read Story" ↔ "Exercises") that preserves scroll offsets and unfinished inputs.
* **Karaoke-Style Read-Along Audio Synchronization**:
  - Highlights speaker turns and narrative sentences in real time as the audio plays.
  - Clicking any sentence jumps audio playback directly to that timestamp.
  - Audio speed toggle: **0.8x** (scaffolded listening), **1.0x** (standard classroom speed), and **1.2x** (fast review).

---

### 2.3 Polymorphic Interactive Exercise Engine
Every exercise from the Pupil's Book, Activity Book, and Differentiated Appendix is powered by an auto-checking engine supporting 8 fundamental interaction archetypes:
1. **Inline Cloze / Gap-Fill**: Text input or inline dropdown; case-insensitive; automatically accepts authorized grammatical variants documented in the Teacher's Book.
2. **Visual Word-Bank Drag & Drop**: Visual chip rack with snap-to-target dropzones; optimized for touch gestures (tap chip, then tap slot) and desktop mouse dragging.
3. **Two-Column Matching**: Connects vocabulary to definitions, opposites, or picture labels with dynamic SVG connecting lines.
4. **Matrix Categorization**: Multi-column sorting bins (e.g., Computer Parts vs. Internet Terms; Healthy Habits vs. Bad Habits).
5. **Syntax Scrambler**: Interactive word chips arranged horizontally; learners drag/tap to construct grammatically valid A1 sentences (Subject + Verb + Object + Time/Place).
6. **Dialogue Turn Sequencing**: Chronological reconstruction of pen-pal emails and chat conversations between Kostas, Mark, and Nadine.
7. **Multiple Choice & True/False with Textual Justification**: 4-option questions with immediate feedback and citation highlighting.
8. **Guided Writing Canvas**: Multi-step template for writing emails, postcards, and recipe cards, equipped with word-count milestones and sentence starter chips.

---

### 2.4 Inductive Grammar Studio
Replaces passive grammar tables with manipulable visual sandboxes:
* **Unit 1 & 2**: Like/Enjoy/Hate + `-ing` builder; Adverbs of Frequency speedometer (*never 0% → sometimes 50% → usually 80% → always 100%*).
* **Unit 3**: Interactive City Compass & Map (giving/following directions with prepositions of place and movement).
* **Unit 4**: Recipe Step Sequencer (imperatives: *mix, bake, stir, pour*).
* **Unit 5**: Environmental Future Planner (*be going to* vs. *Present Continuous*).
* **Unit 6**: Comparative & Superlative Balance Scale (dragging `-er / more` and `-est / most` to balance adjectives).
* **Unit 7 & 8**: The Time Machine (Past Simple regular `-ed` endings, irregular verb card deck, Past Continuous scene builder).
* **Unit 9**: Present Perfect Experience Vault (linking past actions to visible present results).
* **Unit 10**: Preposition of Place 3D-Style Diorama & Tense Review Matrix.

---

### 2.5 Calibrated Distractor Assessment Engine
Every multiple-choice quiz item adheres strictly to the project's scientific distractor rules:
* **Strict POS Matching**: Noun targets only face noun distractors; adjectives only face adjectives.
* **Semantic Field Calibration**: Distractors drawn from the same unit or pooled from preceding units within the same topic (e.g., feelings, sports, city services).
* **Zero Giveaway Protocol**: Distractors match the morphological length, pluralization, and grammatical agreement of the stem.
* **Error-Bank Replay**: Wrong answers are silently routed to the student's personal review vault for spaced re-testing.

---

### 2.6 The Differentiated Learning Appendix Engine
The 5th Grade workbook uniquely features a 26-page graded appendix:
* **One-Star (`*`) Activities**: Scaffolded support with picture prompts, word banks, and partial answers.
* **Two-Star (`**`) Activities**: Extended challenge tasks with open production and higher lexical expectations.
* **Adaptive Recommendation**: The app analyzes student performance in the core unit and recommends either the `*` reinforcement or the `**` extension.

---

## 3. Operational Modes & Interface Workflows

```
┌────────────────────────────────────────────────────────────────────────┐
│                   Three Operational Interaction Modes                  │
├────────────────────────────────────────────────────────────────────────┤
│ 1. Student Self-Study Mode (Default)                                   │
│    • Interactive auto-checking with multi-tiered hints (clue → 1st     │
│      letter → explanation)                                             │
│    • Word bank audio pronunciation on tap                              │
│    • Personal progress tracking, unit completion stars, streak badges │
├────────────────────────────────────────────────────────────────────────┤
│ 2. Teacher Classroom & Interactive Whiteboard (IWB) Mode               │
│    • Instant "Reveal All Keys" toggle for collective grading           │
│    • High-visibility presentation scaling (oversized 64px hitboxes)    │
│    • Front-of-class digital pointer, timer, and spotlight mask tool    │
│    • Teacher's Book methodological notes & lesson plan drawer          │
├────────────────────────────────────────────────────────────────────────┤
│ 3. Photodentro OER Interactive Laboratory                              │
│    • In-situ sandboxed embeds of official Photodentro learning objects │
│    • Deep bidirectional state bridge passing completion status back to  │
│      the unit dashboard                                                │
└────────────────────────────────────────────────────────────────────────┘
```

---

# PART II: 5TH GRADE SYLLABUS & LEXICAL ARCHITECTURE

The 10 units are mapped from `pupil_front_matter.txt`, `teacher_front_matter.txt`, and `5th grade_coursebook_cefr.json`:

```
┌──────┬───────────────────────────────┬──────────────────────────────────┬─────────────────────────────┬──────────┐
│ Unit │ Title & Characters            │ Grammar & Structures             │ Lexical & Thematic Focus    │ Lexis Qty│
├──────┼───────────────────────────────┼──────────────────────────────────┼─────────────────────────────┼──────────┤
│ 01   │ Internet Friends Around       │ Like/hate/enjoy + -ing;          │ Computer parts, internet    │ ~68 items│
│      │ Europe (Kostas, Nadine, Mark) │ Prefer... to...; Present Simple  │ terms, countries, flags     │          │
├──────┼───────────────────────────────┼──────────────────────────────────┼─────────────────────────────┼──────────┤
│ 02   │ School Life & The World       │ Present Simple; Adverbs of       │ School routines, feelings,  │ ~72 items│
│      │ Around Us                     │ frequency; Prepositions in/on/at │ healthy habits, world foods │          │
├──────┼───────────────────────────────┼──────────────────────────────────┼─────────────────────────────┼──────────┤
│ 03   │ Places                        │ Prepositions of place/direction; │ Public buildings, transport,│ ~65 items│
│      │                               │ Imperatives; Why don't you...?   │ city maps, road safety      │          │
├──────┼───────────────────────────────┼──────────────────────────────────┼─────────────────────────────┼──────────┤
│ 04   │ Christmas Everywhere          │ Sequence words (first, then);    │ Cooking verbs, ingredients, │ ~64 items│
│      │ (New York, Athens, London)    │ Imperatives; Process description │ Christmas customs & carols  │          │
├──────┼───────────────────────────────┼──────────────────────────────────┼─────────────────────────────┼──────────┤
│ 05   │ Ready for Action              │ Present Continuous future sense; │ Recycling, litter, ecology, │ ~74 items│
│      │ (Environmental Project)       │ be going to; Modals can/must/need│ conservation campaigns      │          │
├──────┼───────────────────────────────┼──────────────────────────────────┼─────────────────────────────┼──────────┤
│ 06   │ Good, Better, Best!           │ Comparative adjectives (-er/more)│ Consumer goods, packaging,  │ ~70 items│
│      │ (Presents & World Records)    │ Superlative adjectives (-est/most│ records, sports feats       │          │
├──────┼───────────────────────────────┼──────────────────────────────────┼─────────────────────────────┼──────────┤
│ 07   │ Going Back in Time            │ Past Simple regular verbs (-ed); │ History, ancient theatre,   │ ~76 items│
│      │ (Alexander the Great)         │ Past time markers (ago, last...) │ archaeology, biographies    │          │
├──────┼───────────────────────────────┼──────────────────────────────────┼─────────────────────────────┼──────────┤
│ 08   │ All About Stories             │ Past Simple irregular verbs;     │ Fairy tales, Karagiozis,    │ ~75 items│
│      │ (Fairy Tales & Drama)         │ Past Continuous; when / while    │ characters, Easter traditions│         │
├──────┼───────────────────────────────┼──────────────────────────────────┼─────────────────────────────┼──────────┤
│ 09   │ Amazing People & Places       │ Present Perfect (affirmative,    │ Wildlife, Dian Fossey,      │ ~78 items│
│      │ (Gorillas & Dubai Trip)       │ negative, questions, ever/never) │ newspapers, art awards      │          │
├──────┼───────────────────────────────┼──────────────────────────────────┼─────────────────────────────┼──────────┤
│ 10   │ Summer is Here!               │ Tense synthesis (Past, Present,  │ Airport, travel, Parthenon  │ ~72 items│
│      │ (Airport Reunion & Parthenon) │ Future); Prepositions of place   │ marbles debate, Greek myths │          │
├──────┴───────────────────────────────┴──────────────────────────────────┴─────────────────────────────┴──────────┤
│ TOTAL CORE CURRICULUM ITEMS: 714 lemmas (Oxford 3000/5000 CEFR A1- to A1 calibrated)                              │
└───────────────────────────────────────────────────────────────────────────────────────────────────────────────────┘
```

---

# PART III: END-TO-END IMPLEMENTATION PLAN

## 1. Directory Topology
The 5th Grade companion platform will be housed under `C:\photodentro\antigravity\coursebook_fifth\web\` (or integrated alongside existing tooling):

```
coursebook_fifth/
├── data/
│   ├── coursebook_catalog.json           # 10-unit curriculum manifest
│   ├── coursebook_catalog.js             # window.COURSEBOOK_CATALOG twin
│   └── 5th_grade_master_cefr.json        # 714 calibrated lemmas
├── assets/
│   ├── fonts/                            # WOFF2 files (fonts.css)
│   ├── audio/                            # Shared audio UI assets
│   └── icons/                            # Coursebook SVG activity badges
├── unit01/ ... unit10/
│   ├── index.html                        # VOCABULARY COMPANION & AUDIO LAB
│   ├── v2.html                           # COURSEBOOK & WORKBOOK COMPANION
│   ├── app.js                            # Vocabulary Companion Controller
│   ├── app_v2.js                         # Coursebook V2 Controller
│   ├── style.css                         # Vocabulary Companion Stylesheet
│   ├── style_v2.css                      # Coursebook Companion Stylesheet
│   ├── data/
│   │   ├── vocabulary_data.json & .js    # Unit lexis twins (Word, IPA, Greek, Def, Ex)
│   │   ├── unitN_v2_data.json & .js      # Stories, landmarks, grammar lab
│   │   └── unitN_workbook_data.json & .js# Workbook & differentiated tasks
│   ├── assets/
│   │   ├── images_v2/                    # Original vector SVGs
│   │   ├── audio/                        # Classic TTS audio + .txt sidecars
│   │   ├── audio_neural/                 # Edge neural audio + .txt sidecars
│   │   └── audio_v2/                     # Story & dialogue narrations
│   ├── test_vN.js                        # Node regression test harness
│   └── verify_offline.js                 # Air-gap zero-leak verifier
└── portal.html / portal.css / portal.js  # Master 10-Unit Navigation Hub
```

---

## 2. Six-Phase Execution Protocol (Unit by Unit)

```
┌────────────────────────────────────────────────────────────────────────┐
│                      The 6-Phase Unit Pipeline                         │
├────────────────────────────────────────────────────────────────────────┤
│ Phase 1: Textual Ingestion & Errata Auditing                           │
│   • Parse text/unitXX/pupil_unitXX and workbook_unitXX                 │
│   • Reconcile with teacher_unitXX keys                                 │
│   • Author unitXX/ERRATA.md cataloging misprints and ambiguities       │
├────────────────────────────────────────────────────────────────────────┤
│ Phase 2: Vocabulary Companion & Lexical Data Twins                     │
│   • Author vocabulary_data.json from 5th grade_coursebook_cefr.json    │
│   • Ensure 100% IPA, Greek meaning, A1 definition, and example         │
│   • Validate CEFR A1- ceiling via check_definitions.py                 │
│   • Synchronize JS twins (sync_data_twins.js)                          │
│   • Deploy unitXX/index.html & app.js (Table, Cards, Quizzes)          │
├────────────────────────────────────────────────────────────────────────┤
│ Phase 3: Workbook & Differentiated Appendix Authoring                  │
│   • Digitize all Section A (Vocab), Section B (Grammar), and           │
│     Section C (Skills) exercises into unitXX_workbook_data.json        │
│   • Digitize Differentiated Appendix tasks (* and **)                  │
│   • Generate matching JS twins                                         │
├────────────────────────────────────────────────────────────────────────┤
│ Phase 4: Story Dossiers, Landmarks & Inductive Grammar Lab             │
│   • Structure 3–4 narrative storyboards featuring Kostas, Mark, Nadine │
│   • Ensure 100% lexical ownership (zero orphan words)                  │
│   • Create original vector SVGs with landmark coordinate hotspots      │
│   • Code unit-specific inductive grammar interactive laboratory        │
│   • Deploy unitXX/v2.html & app_v2.js                                  │
├────────────────────────────────────────────────────────────────────────┤
│ Phase 5: Dual-Engine Audio Generation                                  │
│   • Generate Google TTS audio in assets/audio/                         │
│   • Generate Microsoft Edge Neural audio in assets/audio_neural/       │
│   • Create verbatim .txt sidecars for 100% of audio clips              │
│   • Synthesize story and dialogue listening tracks                     │
├────────────────────────────────────────────────────────────────────────┤
│ Phase 6: Automated Verification & Air-Gap Testing                      │
│   • Run Node regression test (test_vN.js: 180+ assertions)             │
│   • Run verify_offline.js (0 external fetches, font/audio local check) │
│   • Launch headless browser CDP test (0 console errors, audio play ok) │
└────────────────────────────────────────────────────────────────────────┘
```

---

## 3. Unit-by-Unit Implementation Roadmap

```
┌──────────┬─────────────────────────────────────┬──────────────┬───────────────┐
│ Sprint   │ Scope                               │ Deliverables │ Target Status │
├──────────┼─────────────────────────────────────┼──────────────┼───────────────┤
│ Sprint 1 │ Core Infrastructure & Shared Hub    │ portal.*     │ Foundation    │
│          │ Typography, Photodentro bridges     │ fonts/, data/│ Complete      │
├──────────┼─────────────────────────────────────┼──────────────┼───────────────┤
│ Sprint 2 │ Unit 1: Internet Friends            │ Unit 1 Full  │ Flagship V2   │
│          │ Unit 2: School Life & Feelings      │ Unit 2 Full  │ Production    │
├──────────┼─────────────────────────────────────┼──────────────┼───────────────┤
│ Sprint 3 │ Unit 3: Places & Directions         │ Unit 3 Full  │ Flagship V2   │
│          │ Unit 4: Christmas Everywhere        │ Unit 4 Full  │ Production    │
├──────────┼─────────────────────────────────────┼──────────────┼───────────────┤
│ Sprint 4 │ Unit 5: Ready for Action (Eco)      │ Unit 5 Full  │ Flagship V2   │
│          │ Unit 6: Good, Better, Best! (Adjs)  │ Unit 6 Full  │ Production    │
├──────────┼─────────────────────────────────────┼──────────────┼───────────────┤
│ Sprint 5 │ Unit 7: Going Back in Time (Past)   │ Unit 7 Full  │ Flagship V2   │
│          │ Unit 8: All About Stories (Tales)   │ Unit 8 Full  │ Production    │
├──────────┼─────────────────────────────────────┼──────────────┼───────────────┤
│ Sprint 6 │ Unit 9: Amazing People (Pres. Perf) │ Unit 9 Full  │ Flagship V2   │
│          │ Unit 10: Summer is Here! (Reunion)  │ Unit 10 Full │ Production    │
├──────────┼─────────────────────────────────────┼──────────────┼───────────────┤
│ Sprint 7 │ Differentiated Appendix & Revisions │ Appendix     │ Systemic      │
│          │ Cross-Unit QA & Air-Gap Packaging   │ Offline ZIP  │ Delivery      │
└──────────┴─────────────────────────────────────┴──────────────┴───────────────┘
```

---

# PART IV: TECHNICAL STANDARDS & QUALITY ASSURANCE GATES

## 1. Technical Invariants Learned from 6th Grade
1. **Never Generate Composite 4th Audio Files**: Play the `word` clip, pause 350ms, play `def` clip, pause 350ms, play `example` clip dynamically in JS.
2. **Regex Target Word Replacement**: Always use capture groups `(\\b${first}[a-z]*\\b)` and replace with `<span class="example-target-word">$1</span>` so words are never swallowed.
3. **No External CDNs**: All fonts loaded locally from `../assets/fonts/fonts.css` via `@font-face`.
4. **Data Twin Parity**: Zero tolerance for mismatches between `.json` and `.js` twins.
5. **Clean Git Hygiene**: Automatically exclude all raw render frames, temporary video shoot frames, and Python caches via `.gitignore`.

## 2. Automated Regression Test Contract (`test_vN.js`)
Before any unit is marked "Ready", the test runner must output:
```
[PASS] Every vocabulary item has IPA, Greek meaning, A1 definition, and example
[PASS] vocabulary_data.js twin matches vocabulary_data.json
[PASS] unitN_v2_data.js twin matches unitN_v2_data.json
[PASS] unitN_workbook_data.js twin matches unitN_workbook_data.json
[PASS] 100% Lexical Ownership: all headwords appear in story narratives
[PASS] 0 Null Pills: every landmark hotspot resolves to an active headword
[PASS] Every audio MP3 has a verbatim .txt sidecar
[PASS] All workbook exercises match Teacher's Book keys
[PASS] Differentiated activities (* and **) correctly categorized
[PASS] Vocabulary Companion (index.html) modes: Table, Cards, Quizzes, Print verified

Unit Regression Suite: 190+ passed, 0 failed.
```

---

## 3. Executive Sign-Off & Ready-to-Build Verdict
With the source texts extracted under `C:\photodentro\antigravity\coursebook_fifth\text\`, the 714-item CEFR catalog compiled in `5th grade_coursebook_cefr.json`, and the distractor database initialized in `grade5_distractor_candidates.json`, this blueprint serves as the single source of truth for engineering the 5th Grade Digital Companion.
