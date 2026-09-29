# Unit 4 Build Notes: The History of the Aeroplane (ΣΤ΄ Δημοτικού)

## 1. Executive Summary & Verification Status
Unit 4 (*The History of the Aeroplane*) has been built, enriched, and validated as a Flagship Version 2 Coursebook Companion according to the `coursebook-unit-extender` skill.

| Test / Audit Dimension | Metric | Status | Details |
|---|---|---|---|
| **V4 Regression Suite (`test_v4.js`)** | 163 / 163 passed | **100% PASS** | Zero failures across identity, lexical items, audio sidecars, and twin integrity. |
| **Offline GDPR Verification (`verify_offline.js`)** | 41 / 41 passed | **100% PASS** | Zero external runtime calls, zero CDNs, local fonts, safe relative paths. |
| **Coursebook Unit Extender Template (`test_unit.template.js 4`)** | 104 / 104 passed | **100% PASS** | Full coverage of stories, landmarks, audio chains, workbook, and checklists. |
| **Learner Dictionary Audit (`check_definitions.py unit4`)** | 41 / 41 clean | **100% PASS** | 0 hard words outside CEFR A2 ceiling, 0 circular definitions, 0 target leaks. |
| **Headless Edge Browser CDP Test (`test_browser_unit4.js`)** | 0 JS errors | **100% PASS** | Real browser session testing all 9 V2 modules and 6 V1 modes with automated clicks. |

---

## 2. Audio Architecture & Synthesis Details
- **Vocabulary Audio**:
  - 41 headwords × 3 clips each (`word`, `def`, `example`) = 123 audio clips per voice engine.
  - Both engines synthesized:
    - `assets/audio/` (Google TTS Standard en-GB, 123 MP3s + 123 `.txt` sidecars)
    - `assets/audio_neural/` (Microsoft Edge Neural en-GB-SoniaNeural, 123 MP3s + 123 `.txt` sidecars)
  - Total vocabulary clips: 246 MP3s + 246 verbatim sidecar files.
  - **No Composite 4th Audio**: Audio is dynamically chained in sequence with a 350 ms natural pause in `playAudioSequence()`.
- **Narrations & Companion Audio**:
  - `assets/audio_v2/stories/daedalus_icarus_full_story.mp3` (British Neural) + `.txt` sidecar.
  - `assets/audio_v2/stories/fleet_air_arm_full_story.mp3` (British Neural) + `.txt` sidecar.
  - `assets/audio_v2/stories/wright_brothers_full_story.mp3` (British Neural) + `.txt` sidecar.
  - `assets/audio_v2/stories/fall_of_icarus_full_story.mp3` (British Neural) + `.txt` sidecar.
  - `assets/audio_v2/grammar/air_pocket_dialogue.mp3` (Multi-speaker authentic in-flight turbulence dialogue between Captain, Airhostess, and Passengers) + `.txt` sidecar.

---

## 3. Original Visual Art & Rights Compliance
Per curriculum and copyright safety guidelines:
- Authentic coursebook texts are preserved verbatim from the Greek Ministry 6th Grade Coursebook.
- Original custom SVG vector art created:
  1. `assets/images_v2/daedalus_icarus.svg`: Classical Greek myth showing Daedalus and Icarus soaring over the Aegean waves with feather-and-wax wings.
  2. `assets/images_v2/fleet_air_arm.svg`: RNAS Yeovilton museum hangars, modern flight simulator pod, and historic naval biplanes.
  3. `assets/images_v2/wright_flyer.svg`: Orville and Wilbur Wright launching the Wright Flyer over the windy sand dunes of Kitty Hawk, North Carolina (1903).
  4. `assets/images_v2/brueghel_landscape.svg`: Pieter Brueghel the Elder's *Landscape with the Fall of Icarus* with the unaware plowman, shepherd, sailing ship, and tiny splash at the water's edge.

---

## 4. Errata & Book Check Register
Errata items E1–E7 documented in `ERRATA.md` and integrated into the Teacher Notes:
- **E1 (Vocabulary item #3 `airhostess`)**: Preserved as printed in Appendix V; pedagogical note added explaining modern gender-neutral term *flight attendant*.
- **E2 (Lesson 1 `Fleet Air Arm Museum`)**: Museum name preserved verbatim; location at RNAS Yeovilton, Somerset explained in dossiers.
- **E3 (Lesson 2 Concorde speed)**: Coursebook text mentions Concorde flying across the Atlantic in 3 hours; historical Mach 2.04 cruising speed clarified against Mach 5 hyperbole.
- **E4 (Lesson 2 Igor Sikorsky)**: Aviation pioneer Igor Sikorsky's birthplace noted as Kyiv (1889).
- **E5 (Student's Book p. 48)**: Printed typo "Montgolfier bothers" corrected to *Montgolfier brothers*.
- **E6 (Workbook A3 Crossword)**: Clue disambiguations verified against Teacher's Book keys.
- **E7 (Teacher's Book p. 55)**: Typo "landing gea" corrected to *landing gear* in accepted answers.

---

## 5. Mini-App Interactive Verification
All interactive modules were verified in a real headless Edge browser session with automated click events:
1. **Reading Dossiers**: 4 interactive dossiers (Daedalus & Icarus, Fleet Air Arm Museum, Wright Brothers 1903, Pieter Brueghel & Fall of Icarus) with audio playback and visual glosses.
2. **Grammar Lab**: Past Simple vs. Past Continuous, time linkers (*when*, *while*, *as*), aerodynamic forces (Lift, Drag, Gravity, Thrust), and authentic in-flight turbulence dialogue.
3. **Words in Partnership**: Aviation collocations matchboard & 14-item Definition Clue Challenge.
4. **Writing Workshop**: Guided Aviation Biography Planner (Early life, Inventions, Famous flight, Impact) with scaffolding starter chips and live markdown preview.
5. **Practice Arena**: Aviation True/False comprehension challenge with instant auditory feedback.
6. **Printable Worksheets**: Complete classroom worksheet generator with single-activity and pack print styles.
7. **Can-Do Passport**: CEFR A2/A2+ self-assessment checklist with dynamic certificate and pupil name input.
8. **Workbook**: 14 fully authored activities (A1–A4, B1–B8, C1–C2) with instant checking, retry mode, and model reveal.
9. **Teacher Notes**: Comprehensive methodology, curriculum cross-links, and errata explanations.
10. **V1 Vocabulary App**: 41 lexical items, 14 category pills, search filter, visual cards with 3D flip, listening challenge, and definition challenge.
