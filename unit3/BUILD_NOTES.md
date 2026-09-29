# Unit 3 Build Notes: Imaginary Creatures (ΣΤ΄ Δημοτικού)

## 1. Executive Summary & Verification Status
Unit 3 (*Imaginary Creatures*) has been built, enriched, and validated as a Flagship Version 2 Coursebook Companion according to the `coursebook-unit-extender` skill.

| Test / Audit Dimension | Metric | Status | Details |
|---|---|---|---|
| **V3 Regression Suite (`test_v3.js`)** | 1,256 / 1,256 passed | **100% PASS** | Zero failures across identity, lexical items, audio sidecars, and twin integrity. |
| **Offline GDPR Verification (`verify_offline.js`)** | 41 / 41 passed | **100% PASS** | Zero external runtime calls, zero CDNs, local fonts, safe relative paths. |
| **Coursebook Unit Extender Template (`test_unit.template.js 3`)** | 119 / 119 passed | **100% PASS** | Full coverage of stories, landmarks, audio chains, workbook, and checklists. |
| **Learner Dictionary Audit (`check_definitions.py unit3`)** | 54 / 54 clean | **100% PASS** | 0 hard words outside CEFR A2 ceiling, 0 circular definitions, 0 overlong definitions. |
| **Headless Edge Browser CDP Test** | 0 JS errors | **100% PASS** | Real browser session testing all 9 V2 modules and 6 V1 modes with automated clicks. |

---

## 2. Audio Architecture & Synthesis Details
- **Vocabulary Audio**:
  - 54 headwords × 3 clips each (`word`, `def`, `example`) = 162 audio clips per voice engine.
  - Both engines synthesized:
    - `assets/audio/` (Google TTS Standard en-GB, 162 MP3s + 162 `.txt` sidecars)
    - `assets/audio_neural/` (Microsoft Edge Neural en-GB-SoniaNeural, 162 MP3s + 162 `.txt` sidecars)
  - Total vocabulary clips: 324 MP3s + 324 verbatim sidecar files.
  - **No Composite 4th Audio**: Audio is dynamically chained in sequence with a 350 ms natural pause in `playAudioSequence()`.
- **Narrations & Companion Audio**:
  - `assets/audio_v2/stories/polyphemus_full_story.mp3` (274 KB, British Neural) + `.txt` sidecar.
  - `assets/audio_v2/stories/fairies_full_story.mp3` (261 KB, British Neural) + `.txt` sidecar.
  - `assets/audio_v2/stories/ogre_full_story.mp3` (273 KB, British Neural) + `.txt` sidecar.
  - `assets/audio_v2/grammar/the_fifty_cent_piece.mp3` (970 KB, 25-turn multi-speaker play) + `.txt` sidecar.
  - `assets/audio_v2/grammar/midsummer_nights_dream.mp3` (714 KB, 15-turn multi-speaker classroom theatre) + `.txt` sidecar.

---

## 3. Original Visual Art & Rights Compliance
Per curriculum and copyright safety guidelines:
- Names in text (*Shrek*, *Tinkerbell*, *Peter Pan*) are preserved verbatim as printed in the 2004 Greek Ministry coursebook.
- **Strictly No Depiction of Trademarked Characters**:
  - No Disney or DreamWorks trademarked silhouettes, icons, or images were generated.
  - Original folklore and classical mythology SVGs created:
    1. `assets/images_v2/polyphemus.svg`: Classical Greek Cyclops on Mount Etna overlooking the Mediterranean Sea.
    2. `assets/images_v2/fairies_fairyland.svg`: Shakespearean enchanted moonlit forest with winged nature sprites and bluebells.
    3. `assets/images_v2/ogre_adventure.svg`: Mythical folklore green ogre beside an ancient stone castle tower.

---

## 4. Errata & Book Check Register
Pre-seeded errata E1–E6 documented in `ERRATA.md` and preserved:
- **E1 (Appendix V)**: Headword #33 printed as `orge (n)` instead of `ogre`. Annotated in Teacher Notes; engine recognises both forms.
- **E2 (Appendix V)**: `supernatural` and `power` broken across columns. Both headwords individually indexed and searchable.
- **E3 (Lesson 1)**: `Tinkerbelle` spelled with terminal `-e`. Kept verbatim per printed book text.
- **E4 (Workbook B3b)**: Printed as `counties` instead of `countries`. Explanatory hint provided.
- **E5 (Workbook p.22)**: Header layout misprint showing `UNIT 1` above `3`. Scoped cleanly under Unit 3.
- **E6 (Folktale idiom)**: Authentic American folktale uses idiom *"as dark as hell"*. Kept verbatim with cultural context note.

---

## 5. Mini-App Interactive Verification
All mini-apps were verified in a real headless Edge browser session with automated click events:
1. **Reading Dossiers**: 3 interactive dossiers (Homer's Polyphemus, Fairies in Fairyland, Folk Ogre) with 18 clickable audio controls.
2. **Grammar Lab**: Target comparison structures (-er than, more than, as...as, adverbs of manner), 26 interactive controls, listening theatre.
3. **Words in Partnership**: Collocations matchboard & 14-item Definition Clue Challenge.
4. **Writing Workshop**: 4-step classroom theatre performance & monster profiling guide with starter chips.
5. **Practice Arena**: True/False fact checking & audio comprehension questions.
6. **Printable Worksheets**: Complete classroom worksheet generator with single-activity and pack print styles.
7. **Can-Do Passport**: CEFR A2/A2+ self-assessment checklist with dynamic certificate and editable pupil name.
8. **Workbook**: 20 fully authored activities (A1–A7, B1–B12, C Mediation) with instant checking, retry mode, and model reveal.
9. **Teacher Notes**: Comprehensive methodology, curriculum cross-links, and errata explanations.
10. **V1 Vocabulary App**: 54 lexical items, 11 category pills, search filter, visual cards with 3D flip, listening challenge, and definition challenge.
