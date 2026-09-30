# Build Notes — Unit 6: Me, Myself and My Future Job

## 1. Overview & Architecture
- **Unit ID**: 6
- **Unit Title**: Me, Myself and My Future Job
- **Shell Version**: Standard V2 Shell copied from `.agents/skills/coursebook-unit-extender/templates/unit_shell/`
- **Identity Tags**: `<body data-unit="6" data-workbook="unit6_workbook_data.js">` in both `index.html` and `v2.html`
- **Offline / GDPR Compliance**: 0 external CDNs or network fetches. Fonts loaded locally from `../assets/fonts/fonts.css`.

## 2. Vocabulary Dataset
- **Item Count**: 69 official items matching Pupil's Book Appendix VI.
- **Audits**:
  - `python _tools/check_definitions.py unit6`: **0 hard words, 0 circular definitions, 0 target leaks**.
  - `python _tools/check_definitions.py unit6 --field example`: **0 hard words**.
  - Ceiling: Strictly under 18 words, CEFR A2 control.
- **Data Twin Parity**: 100% semantic identity between `data/vocabulary_data.json` and `data/vocabulary_data.js` (`window.VOCABULARY_DATA`).

## 3. V2 Companion Experience (`data/unit6_v2_data.json` & `.js`)
- **Interactive Stories (4 narratives)**:
  1. `jewellery_designer`: Alexis creates artisanal rings, pearl necklaces, and earrings using gems and hand tools.
  2. `air_traffic_controller`: Gary manages multi-lingual radar communications and runway schedules in an international airport tower.
  3. `home_health_nurse`: Helen delivers compassionate bedside care, medical checks, and nutrition planning to elderly community patients.
  4. `hairdresser_ecologist`: Career day highlights featuring Vassilis (precision hair styling, treatments) and Maria (wildlife ecology, Amazon volunteer field trips).
- **Lexis Ownership**: All 69 vocabulary IDs mapped to stories are present verbatim in their narratives. Zero unowned words.
- **Null Pill Elimination**: Every story landmark maps directly to an active vocabulary item.
- **Inductive Grammar Lab**: Modals of ability (*can*), permission/possibility (*may*), advice (*should*), and future intentions (*will* vs *be going to*).
- **Collocations & Word Family**: 4 thematic professional collocations and career skill pairings.
- **Definition Challenge**: 12 diverse multiple-choice questions assessing career knowledge.
- **Guided Writing Workshop**: Scaffolded future career research and poster design.
- **Can-Do Self-Assessment**: 5 CEFR A2 self-evaluation statements with progressive mastery stars.

## 4. Pupil's Workbook Activities (`data/unit6_workbook_data.json` & `.js`)
- **15 Activities Total** reflecting coursebook numbering:
  - **Section A (Vocabulary)**: A1 (Job and workplace matching), A2 (Complete sentences with job titles), A3 (Match jobs to traits/skills), A4 (Match jobs to school subjects), A5 (Identify jobs from descriptions: journalist, actor, model).
  - **Section B (Grammar)**: B1 (Modal verbs: may, can, should, will, going to gap-fill), B2 (Tom's schedule future plans), B3 (Conversational reactions & modals), B4 (Predictions with MAY), B5 (Personal interests & career prediction with WILL), B6 (Everyday situational functional speech), B7 (Interviewing a computer programmer).
  - **Section C (Writing, Mediation & Songs)**: C1 (Future career poster project outline), C2 (Mediation: Proverb "All work and no play makes Jack a dull boy"), C3 (Song Pedagogical Analysis: Doris Day's "Que Será, Será" identifying future predictions with *will*).

## 5. Visual & Audio Assets
- **Original Vector SVGs** in `unit6/assets/images_v2/`:
  - `jewellery_workshop.svg`: Workbench with gems, magnifying glass, ring sketches, and pliers.
  - `control_tower.svg`: Airport control tower overlooking sunset runways, radar screen with blips.
  - `home_nurse.svg`: Nurse visiting an elderly patient in a cozy armchair with medical kit.
  - `salon_ecology.svg`: Eco-friendly salon with living plant wall, mirror styling station, bamboo.
- **Dual-Engine Vocabulary Audio**:
  - Google Standard TTS: 69 words, 69 definitions, 69 examples = 207 MP3s + 207 `.txt` sidecars.
  - Edge Neural TTS (`en-GB-SoniaNeural`): 69 words, 69 definitions, 69 examples = 207 MP3s + 207 `.txt` sidecars.
  - Total: 414 audio files and 414 verbatim sidecars.
- **Companion Audio**:
  - 4 full story narrations with `.txt` sidecars.
  - 1 multi-turn listening dialogue (`career_day_interview.mp3`, 6 turns) stitched with ffmpeg.

## 6. Verification Results
- `node unit6/test_v6.js`: **236 passed, 0 failed**.
- `node unit6/verify_offline.js`: **41 passed, 0 failed**.
- `generate_unit_audio.js --check`: **All 414 checked clips clean**.
