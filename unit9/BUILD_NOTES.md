# Build Notes — Unit 9: Earth Day Everyday

## 1. Overview & Architecture
- **Unit ID**: 9
- **Unit Title**: Earth Day Everyday
- **Shell Version**: Standard V2 Shell
- **Identity Tags**: `<body data-unit="9" data-workbook="unit9_workbook_data.js">` in `v2.html` and `<body data-unit="9">` in `index.html`
- **Offline / GDPR Compliance**: 0 external CDNs or remote fetches. Local offline fonts loaded from `../assets/fonts/fonts.css`. 100% offline file:/// operational.

## 2. Vocabulary Dataset
- **Item Count**: 48 official items matching Pupil's Book Appendix V (resolving the print run-on `dry cleanercause` into distinct headwords `dry cleaner` and `cause`).
- **Audits**:
  - `python _tools/check_definitions.py unit9`: **0 hard words, 0 circular definitions, 0 target leaks, average 9.7 words (limit 18)**.
  - `python _tools/check_definitions.py unit9 --field example`: **0 hard words**.
  - Strict CEFR A1/A2 defining vocabulary.
- **Data Twin Parity**: 100% semantic identity between `data/vocabulary_data.json` and `data/vocabulary_data.js` (`window.VOCABULARY_DATA`).

## 3. V2 Companion Experience (`data/unit9_v2_data.json` & `.js`)
- **Interactive Stories (4 narratives)**:
  1. `an_earth_day_story`: The Sunset Shore Cleanup — Pupils celebrate Earth Day by cleaning winter storm debris and saving a trapped starfish.
  2. `save_endangered_species`: Guardians of the Loggerhead Nest — Dedicated rangers and veterinarians protecting loggerhead sea turtles (*Caretta caretta*) on Zakynthos beaches.
  3. `the_awful_five_play`: The Awful Five Take the Stage — The school English drama club humorously staging the environmental comedy play personifying air pollutants (Harry Wheezer, Carbon Monoxide, Sulphur Dioxide).
  4. `green_action_community`: Action for a Cleaner Future — A community council taking action against toxic waste dumping, adopting electric trucks, and restoring ocean health.
- **100% Lexis Ownership**: All 48 vocabulary items are uniquely partitioned across the 4 stories and appear in their narratives. Zero unowned words.
- **Null Pill Elimination**: Every story landmark maps directly to an active vocabulary item owned by that story.
- **Inductive Grammar Lab**: Past Perfect Simple (*had + past participle*) for sequencing past actions; Clauses of Reason (*because, as, since*) and Clauses of Result (*so, therefore, as a result*).
- **Collocations & Word Family**: 6 core environmental partnerships (*acid rain*, *endangered species*, *toxic waste*, *chemical plant*, *lay eggs*, *get rid of*).
- **Definition Challenge**: 8 interactive multiple-choice questions assessing environmental and pollution terms, strictly following `.agents/rules/distractor.md` (strict POS match, same semantic field, no giveaways).
- **Guided Writing Workshop**: Environmental action campaign email and awareness poster with model text, scaffolding steps, connector bank, and self-assessment checklist.
- **Can-Do Self-Assessment**: 5 CEFR A2/A2+ self-evaluation descriptors.

## 4. Pupil's Workbook Activities (`data/unit9_workbook_data.json` & `.js`)
- **16 Activities Total** reflecting coursebook numbering:
  - **Section A (Vocabulary)**: A1 (Earth Day crossword clues), A2 (Match collocations), A3 (Odd word out), A4 (Match synonyms), A5 (Complete with correct verbs), A6 (Word derivatives).
  - **Section B (Grammar & Skills)**: B1 (Visiting parents' village: Past Perfect), B2 (Greenville turned brown: Past Perfect), B3 (Combine sentences with Past Perfect), B4 (Past Simple vs Past Perfect), B5 (Helen's beach checklist: had/hadn't), B6 (Because vs Because of), B7 (Reason and result matching), B8 (Connectors: so, as a result, because, because of), B9 (Guided advice email to Shalleen).
  - **Section C (Reading)**: C1 (The Secret of Bog Creek: reading comprehension questions).

## 5. Visual & Audio Assets
- **Original Vector SVGs** in `unit9/assets/images_v2/`:
  - `beach_cleanup.svg`: Sandy shore, rolling turquoise waves, sun setting, volunteer cleanup sacks, starfish on rock.
  - `turtle_rescue.svg`: Loggerhead sea turtle swimming in blue waters near nesting beach, moonlit sky, marine rescue station beacon.
  - `awful_five.svg`: School theater stage, comic pollutant characters, smoking chimney prop, acid rain cloud prop.
  - `green_community.svg`: Modern green town bay, clear ocean water, electric recycling truck, rooftop solar panels, wind turbines.
- **Dual-Engine Vocabulary Audio**:
  - Google Standard TTS: 48 words, 48 definitions, 48 examples = 144 MP3s + 144 `.txt` sidecars.
  - Edge Neural TTS (`en-GB-SoniaNeural`): 48 words, 48 definitions, 48 examples = 144 MP3s + 144 `.txt` sidecars.
  - Total: 288 audio files and 288 verbatim sidecars.
- **Companion Audio**:
  - 4 full story narrations with `.txt` sidecars in `assets/audio_v2/stories/`.
  - 1 multi-turn listening dialogue (`environmental_center_dialogue.mp3`, 6 turns) with `.txt` sidecar in `assets/audio_v2/grammar/`.

## 6. Verification Results
- `node unit9/test_v9.js`: **205 passed, 0 failed**.
- `node verify_offline.js` (from unit9): **41 passed, 0 failed**.
- `python _tools/check_definitions.py unit9`: **48/48 clean, 0 hard words**.

## 7. For the Teacher to Check
- `dry cleaner` (id 16): καθαριστήριο ρούχων
- `cause` (id 17): προκαλώ / αιτία, αφορμή
- `carbon monoxide` (id 6): μονοξείδιο του άνθρακα
- `sulphur dioxide` (id 41): διοξείδιο του θείου
- `pollutant` (id 31): ρύπος, μολυσματική ουσία
- `toxic waste` (id 43): τοξικά απόβλητα
- `toxin` (id 44): τοξίνη, δηλητήριο
- `habitat` (id 24): φυσικός βιότοπος
- `endangered species` (id 19): απειλούμενα είδη
