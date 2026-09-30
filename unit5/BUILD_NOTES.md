# Build Notes — Unit 5: Travelling Through Time

## 1. Overview & Architecture
- **Unit ID**: 5
- **Unit Title**: Travelling Through Time
- **Shell Version**: Standard V2 Shell copied from `.agents/skills/coursebook-unit-extender/templates/unit_shell/`
- **Identity Tags**: `<body data-unit="5" data-workbook="unit5_workbook_data.js">` in both `index.html` and `v2.html`
- **Offline / GDPR Compliance**: 0 external CDNs or network fetches. Fonts loaded locally from `../assets/fonts/fonts.css`.

## 2. Vocabulary Dataset
- **Item Count**: 56 official items matching Pupil's Book Appendix V.
- **Audits**:
  - `python _tools/check_definitions.py unit5`: **0 hard words, 0 circular definitions, 0 target leaks**.
  - `python _tools/check_definitions.py unit5 --field example`: **0 hard words**.
  - Ceiling: Strictly under 18 words, CEFR A2 control.
- **Data Twin Parity**: 100% semantic identity between `data/vocabulary_data.json` and `data/vocabulary_data.js` (`window.VOCABULARY_DATA`).

## 3. V2 Companion Experience (`data/unit5_v2_data.json` & `.js`)
- **Interactive Stories (4 narratives)**:
  1. `anastasia_diary`: Anastasia's 1960s fancy dress birthday party (bell-bottomed pants, mini-skirts, fruit punch, canapés).
  2. `ancient_greece_habits`: Habits, garments, and daily grooming of ancient Athens and Sparta (tunics, togas, braids, ponytails, perfumes).
  3. `victorian_transport`: Victorian public transportation evolution from horse omnibuses with straw flooring to the world's first underground tube trains.
  4. `london_transport_museum`: Educational school tour inside Covent Garden museum exploring historic double-decker buses, signal levers, and railway tracks.
- **Lexis Ownership**: All target vocabulary IDs mapped to stories are present verbatim in their narratives. Zero unowned words.
- **Null Pill Elimination**: Every story landmark maps directly to an active vocabulary item.
- **Inductive Grammar Lab**: Contrast between *used to* (past habits/states) and *Past Simple* (completed specific actions), directional navigational prepositions, and audio listening comprehension.
- **Collocations & Word Family**: 4 thematic collocation pairings and word-building matrices.
- **Definition Challenge**: 12 diverse multiple-choice questions assessing word meaning and contextual usage.
- **Guided Writing Workshop**: Scaffolded letter-writing framework to an overseas pen friend recounting historical discoveries.
- **Can-Do Self-Assessment**: 5 CEFR A2 self-evaluation statements with progressive mastery stars.

## 4. Pupil's Workbook Activities (`data/unit5_workbook_data.json` & `.js`)
- **15 Activities Total** reflecting coursebook numbering:
  - **Section A (Vocabulary)**: A1 (Opposites), A2 (Fashion Accessories Crossword), A3 (1960s Party Preparation Multiple Choice), A4 (Ancient Greek Habits True/False), A5 (Victorian Transport Gap Fill), A6 (Transport Museum Sign Matching).
  - **Section B (Grammar)**: B1 (Used to vs Didn't use to gap-fill), B2 (Grandpa's Childhood Habits Guided Writing), B3 (Giving Directions on Map), B4 (Town Map Route Production), B5 (Transport Museum Hours & Ticket Rates Dialogue Completion), B6 (Museum Rules Modals: must / mustn't / should), B7 (Past Habit Interview Questions Formulation).
  - **Section C (Mediation & Cultural Songs)**: C1 (Mediation: Ancient Olympic Habits vs Modern Athletics), C2 (Song Pedagogical Study: Beatles' "Yesterday" focusing on past habit and loss expressions).

## 5. Visual & Audio Assets
- **Original Vector SVGs** in `unit5/assets/images_v2/`:
  - `sixties_party.svg`: 1960s retro living room with record player, bell-bottoms, mini-skirt, and canapés.
  - `ancient_greece_clothing.svg`: Ancient Greek courtyard with tunics, togas, braided hairstyles, and oil amphorae.
  - `victorian_omnibus.svg`: Victorian London street scene with two-horse omnibus, conductor, and cobblestones.
  - `transport_museum.svg`: London Transport Museum interior showing vintage red double-decker bus, tube map, and levers.
- **Dual-Engine Vocabulary Audio**:
  - Google Standard TTS: 56 words, 56 definitions, 56 examples = 168 MP3s + 168 `.txt` sidecars.
  - Edge Neural TTS (`en-GB-SoniaNeural`): 56 words, 56 definitions, 56 examples = 168 MP3s + 168 `.txt` sidecars.
  - Total: 336 audio files and 336 verbatim sidecars.
- **Companion Audio**:
  - 4 full story narrations with `.txt` sidecars.
  - 1 multi-turn listening dialogue (`transport_museum_guide.mp3`) stitched with ffmpeg.

## 6. Verification Results
- `node unit5/test_v5.js`: **215 passed, 0 failed**.
- `node unit5/verify_offline.js`: **41 passed, 0 failed**.
- `generate_unit_audio.js --check`: **All 336 checked clips clean**.
