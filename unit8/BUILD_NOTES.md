# Build Notes — Unit 8: Blow Your Own Trumpet

## 1. Overview & Architecture
- **Unit ID**: 8
- **Unit Title**: Blow Your Own Trumpet
- **Shell Version**: Standard V2 Shell
- **Identity Tags**: `<body data-unit="8" data-workbook="unit8_workbook_data.js">` in `v2.html` and `<body data-unit="8">` in `index.html`
- **Offline / GDPR Compliance**: 0 external CDNs or network fetches. Fonts loaded locally from `../assets/fonts/fonts.css`.

## 2. Vocabulary Dataset
- **Item Count**: 66 official items matching Pupil's Book Appendix VIII.
- **Audits**:
  - `python _tools/check_definitions.py unit8`: **0 hard words, 0 circular definitions, 0 target leaks**.
  - `python _tools/check_definitions.py unit8 --field example`: **0 hard words**.
  - Ceiling: Strictly under 18 words, CEFR A2 control.
- **Data Twin Parity**: 100% semantic identity between `data/vocabulary_data.json` and `data/vocabulary_data.js` (`window.VOCABULARY_DATA`).

## 3. V2 Companion Experience (`data/unit8_v2_data.json` & `.js`)
- **Interactive Stories (4 narratives)**:
  1. `museum_folk_instruments`: Eleni and Dimitris visit the Museum of Greek Folk Musical Instruments in Plaka and explore traditional clarinets, lutes, and brass horns.
  2. `school_rock_band`: Maya and Liam rehearse with their passionate school rock band, writing lyrics, tuning guitars, and perfecting their drum rhythm.
  3. `pocket_money_budget`: George and Kelly learn how to manage their weekly pocket money, budget for expenses, avoid debt, and save up for a community charity project.
  4. `fairytale_problem_page`: The Big Bad Wolf writes to the School Magazine problem page seeking advice on how to apologize, overcome prejudice, and join the forest orchestra.
- **Lexis Ownership**: All 66 vocabulary items are partitioned across the 4 stories and appear in their narratives. Zero unowned words.
- **Null Pill Elimination**: Every story landmark maps directly to an active vocabulary item owned by that story.
- **Inductive Grammar Lab**: Modal verbs expressing ability (*can / could / be able to*), obligation & necessity (*must / have to*), advice & suggestions (*should / ought to / why don't you*), and prohibition (*mustn't*).
- **Collocations & Word Family**: 6 musical and financial collocations (*blow your own trumpet*, *strike a chord*, *face the music*, *play by ear*, *music to my ears*, *save up pocket money*).
- **Definition Challenge**: 8 interactive multiple-choice questions assessing instruments, performances, and financial vocabulary.
- **Guided Writing Workshop**: Problem letter and advice column response with model text, scaffolding steps, and self-check criteria.
- **Can-Do Self-Assessment**: 5 CEFR A2/B1 self-evaluation statements with progressive mastery stars.

## 4. Pupil's Workbook Activities (`data/unit8_workbook_data.json` & `.js`)
- **18 Activities Total** reflecting coursebook numbering:
  - **Section A (Vocabulary & Reading)**: A1 (Match instruments to orchestra families: brass, strings, woodwind, percussion), A2 (Complete sentences with instrument names), A3 (Musical styles and performance terms), A4 (Pocket money budgeting and chores), A5 (Word formation & collocations), A6 (Fairy tale problem page reading comprehension).
  - **Section B (Grammar & Skills)**: B1 (Modal verbs of ability: can/could/be able to), B2 (Modals of obligation: must vs have to), B3 (Prohibition vs lack of necessity: mustn't vs don't have to), B4 (Giving advice: should / ought to / had better), B5 (Multiple-choice modals quiz), B6 (Sentence transformations), B7 (Dialogue: preparing for the spring concert), B8 (Writing: advice letter to a friend).

## 5. Visual & Audio Assets
- **Original Vector SVGs** in `unit8/assets/images_v2/`:
  - `folk_instruments.svg`: Museum neoclassical arch, Cretan lyra/violin, folk flute (floyera), brass horn, museum exhibition plaque.
  - `school_band.svg`: Camden rock band setup with acoustic drum kit, electric guitar, vocal mic stand, amplifier stack, and dynamic spotlights.
  - `piggy_bank.svg`: Ceramic piggy bank receiving a gold euro coin, three labeled budget jars (Spend, Save, Donate), budget desk.
  - `problem_page.svg`: School magazine advice column sheet with the wolf's inquiry letter, Counselor Clara's reply, brass trumpet, and friendly wolf badge.
- **Dual-Engine Vocabulary Audio**:
  - Google Standard TTS: 66 words, 66 definitions, 66 examples = 198 MP3s + 198 `.txt` sidecars.
  - Edge Neural TTS (`en-GB-SoniaNeural`): 66 words, 66 definitions, 66 examples = 198 MP3s + 198 `.txt` sidecars.
  - Total: 396 audio files and 396 verbatim sidecars.
- **Companion Audio**:
  - 4 full story narrations with `.txt` sidecars.
  - 1 multi-turn listening dialogue (`school_concert_rehearsal.mp3`, 6 turns) stitched with ffmpeg.

## 6. Verification Results
- `node unit8/test_v8.js`: **259 passed, 0 failed**.
- `node unit8/verify_offline.js`: **41 passed, 0 failed**.
- Audio completeness audited via `generate_unit_audio.js --check`.
