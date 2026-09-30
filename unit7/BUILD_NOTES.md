# Build Notes — Unit 7: Share Your Experiences

## 1. Overview & Architecture
- **Unit ID**: 7
- **Unit Title**: Share Your Experiences
- **Shell Version**: Standard V2 Shell
- **Identity Tags**: `<body data-unit="7" data-workbook="unit7_workbook_data.js">` in `v2.html` and `<body data-unit="7">` in `index.html`
- **Offline / GDPR Compliance**: 0 external CDNs or network fetches. Fonts loaded locally from `../assets/fonts/fonts.css`.

## 2. Vocabulary Dataset
- **Item Count**: 52 official items matching Pupil's Book Appendix VII.
- **Audits**:
  - `python _tools/check_definitions.py unit7`: **0 hard words, 0 circular definitions, 0 target leaks**.
  - `python _tools/check_definitions.py unit7 --field example`: **0 hard words**.
  - Ceiling: Strictly under 18 words, CEFR A2 control.
- **Data Twin Parity**: 100% semantic identity between `data/vocabulary_data.json` and `data/vocabulary_data.js` (`window.VOCABULARY_DATA`).

## 3. V2 Companion Experience (`data/unit7_v2_data.json` & `.js`)
- **Interactive Stories (4 narratives)**:
  1. `record_swimmers`: Sofia and Nikos explore competitive swimming strokes, world records, and relay races at the Athens Aquatic Centre.
  2. `paralympic_champion_fykas`: Greek champion swimmer Konstantinos Fykas ('The Dolphin') conquers obstacles, wins Paralympic gold medals, and inspires young athletes.
  3. `hot_air_balloon_race`: Colourful balloons ascend over the Greek countryside, highlighting wildlife sanctuaries, recycling banks, and festive community gatherings.
  4. `theatre_musical_night`: A lively musical performance based on ancient Greek comedy captivates a packed theatre audience in Athens.
- **Lexis Ownership**: All 52 vocabulary IDs mapped to stories are present verbatim in their narratives. Zero unowned words.
- **Null Pill Elimination**: Every story landmark maps directly to an active vocabulary item.
- **Inductive Grammar Lab**: Present Perfect Simple (life experiences, results) vs Past Simple (definite finished past times), and Present Perfect Continuous (*have/has been + -ing*) with *for* and *since*.
- **Collocations & Word Family**: 4 thematic sports and experiential collocations (*break a record*, *take part in*, *cheer on*, *gain experience*).
- **Definition Challenge**: 8 interactive multiple-choice questions assessing sports, competition, and experience vocabulary.
- **Guided Writing Workshop**: Scaffolded personal experience report with model text, scaffolding steps, and self-check criteria.
- **Can-Do Self-Assessment**: 5 CEFR A2/B1 self-evaluation statements with progressive mastery stars.

## 4. Pupil's Workbook Activities (`data/unit7_workbook_data.json` & `.js`)
- **16 Activities Total** reflecting coursebook numbering:
  - **Section A (Vocabulary & Reading)**: A1 (Match sports actions to descriptions), A2 (Classify Olympic & Paralympic events), A3 (Swimming strokes vocabulary), A4 (Adjectives of emotion & experience), A5 (Word puzzle: sports records), A6 (Hot-air balloon flight reading comprehension).
  - **Section B (Grammar & Skills)**: B1 (Present Perfect Simple affirmative & negative), B2 (Questions with Have you ever...?), B3 (Past Simple vs Present Perfect contrast), B4 (Signal words: already, yet, just), B5 (For vs Since duration), B6 (Present Perfect Continuous gap-fill), B7 (Sentence transformations), B8 (Listening comprehension: athlete interview), B9 (Writing: memorable school sports day), B10 (Project: Greek Olympic legends).

## 5. Visual & Audio Assets
- **Original Vector SVGs** in `unit7/assets/images_v2/`:
  - `olympic_pool.svg`: 10-lane competition swimming pool, lane dividers, touch pads, electronic scoreboard.
  - `paralympic_podium.svg`: Paralympic gold medal podium, laurels, ceremonial stadium spotlights.
  - `hot_air_balloon.svg`: Vibrant multi-coloured hot-air balloon drifting over rolling green hills and sanctuary.
  - `theatre_stage.svg`: Classical theatre stage with red velvet curtains, spotlights, orchestra pit, and seated audience.
- **Dual-Engine Vocabulary Audio**:
  - Google Standard TTS: 52 words, 52 definitions, 52 examples = 156 MP3s + 156 `.txt` sidecars.
  - Edge Neural TTS (`en-GB-SoniaNeural`): 52 words, 52 definitions, 52 examples = 156 MP3s + 156 `.txt` sidecars.
  - Total: 312 audio files and 312 verbatim sidecars.
- **Companion Audio**:
  - 4 full story narrations with `.txt` sidecars.
  - 1 multi-turn listening dialogue (`radio_champion_interview.mp3`, 6 turns) stitched with ffmpeg.

## 6. Verification Results
- `node unit7/test_v7.js`: **217 passed, 0 failed**.
- `node unit7/verify_offline.js`: **41 passed, 0 failed**.
- `generate_unit_audio.js --check`: **All 312 checked clips clean**.
