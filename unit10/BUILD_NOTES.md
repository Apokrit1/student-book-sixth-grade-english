# Build Notes — Unit 10: Time for Fun

## 1. Overview & Architecture
- **Unit ID**: 10
- **Unit Title**: Time for Fun
- **Unit Subtitle**: The Super Spy • Film Festival • Writing a Film Review
- **Shell Version**: Standard V2 Shell
- **Identity Tags**: `<body data-unit="10" data-workbook="unit10_workbook_data.js">` in `v2.html` and `<body data-unit="10">` in `index.html`
- **Offline / GDPR Compliance**: 0 external CDNs or remote fetches. Local offline fonts loaded from `../assets/fonts/fonts.css`. 100% offline file:/// operational.

## 2. Vocabulary Dataset
- **Item Count**: 43 official items matching Pupil's Book Appendix V.
- **Audits**:
  - `python _tools/check_definitions.py unit10`: **43/43 clean, 0 hard words, 0 circular definitions, 0 target leaks, average 8.9 words (limit 18)**.
  - `python _tools/check_definitions.py unit10 --field example`: **0 hard words**.
  - Strict CEFR A1/A2 defining vocabulary.
- **Data Twin Parity**: 100% semantic identity between `data/vocabulary_data.json` and `data/vocabulary_data.js` (`window.VOCABULARY_DATA`).

## 3. V2 Companion Experience (`data/unit10_v2_data.json` & `.js`)
- **Interactive Stories (4 narratives)**:
  1. `super_spy_cinema`: On Set with the Secret Spy — Behind the scenes at the movie studio with secret agent missions, director soundstage commands, gadgets, and camera experiments.
  2. `international_film_festival`: The Youth Film Festival — Sold-out opening gala, enthusiastic viewers, popcorn, red carpet rules, and golden festival awards.
  3. `bestseller_to_blockbuster`: From Page to Big Screen — How an author's bestseller adventure novel is adapted into a motion picture screenplay with vivid illustrations.
  4. `young_critics_review`: The Young Critics Circle — School media club members debating film genres, dramatic plots, foggy settings, villain makeup, and writing reviews.
- **100% Lexis Ownership**: All 43 vocabulary items are partitioned across the 4 stories and appear in their narratives. Zero unowned words.
- **Null Pill Elimination**: Every story landmark maps directly to an active vocabulary item owned by that story.
- **Inductive Grammar Lab**:
  - Present Simple Passive (*am / is / are + past participle*).
  - Participial Adjectives: -ed (emotional reaction) vs. -ing (cause/quality).
  - Preferences: *prefer ... to ...* and *would rather ... than ...*.
- **Collocations & Word Family**: 4 core cinema collocations (*hit the shelves*, *sold out*, *switch on/off*, *breaking news*).
- **Definition Challenge**: 8 interactive multiple-choice questions assessing film and book terminology, strictly following `.agents/rules/distractor.md` (strict POS match, same semantic field, no giveaways).
- **Guided Writing Workshop**: Film review writing scaffold covering genre, stars, plot summary, setting, climax, and critical verdict.
- **Can-Do Self-Assessment**: 5 CEFR A2/A2+ self-evaluation descriptors.

## 4. Pupil's Workbook Activities (`data/unit10_workbook_data.json` & `.js`)
- **20 Activities Total** matching Teacher's Book keys:
  - **Section A (Vocabulary)**:
    - A1: Categorize Film & Book Vocabulary (Films, Books, Both)
    - A2: Film Types & Genres Matching (Star Wars, Hitchcock, Nemo, Bond, etc.)
    - A3: Complete with Box Words (*hit the shelves*, *fan*, *nasty*, *scruffy*, *mission*, *acne*)
    - A4: Match Opposites (*handsome/ugly*, *evil/good*, *baggy/tight*, *nasty/kind*, *scruffy/tidy*, *interesting/boring*, *crooked/straight*)
    - A5: Appearance vs Character Adjectives
    - A6: Describe Your Best Friend (Guided open response)
    - A7: Feelings and Adjectives Matching (-ed adjectives)
    - A8: Form -ed / -ing Adjectives from base verbs
    - A9: Choose the Correct Participle (-ed or -ing)
    - A10: Dialogue Ordering: Planning a Cinema Night (13 turns)
  - **Section B (Grammar)**:
    - B1: Present Simple Passive: Verb Forms (*is/are done*, *is/are watched*, etc.)
    - B2: Complete Sentences with Present Simple Passive (*are seen*, *are sold*, *is shown*, etc.)
    - B3: Sentence Construction in the Passive Voice (*is set*, *are displayed*, *is forbidden*, etc.)
    - B4: Match Passive Signs with Places (train, restaurant, shop, concert hall, etc.)
    - B5: Match Spoken Passive Notices to Situations (airport, teacher, shop assistant, etc.)
    - B6: Museum Rules: Passive Signs from Pictograms
    - B7: Classmate Interview Questions (Guided inquiry)
    - B8: Persuasive Email: Recommend a Film
    - B9: Magazine Film Review Scaffold
  - **Section C (Writing)**:
    - C1: Letter to Kate recommending *Eight Below* with -ing adjectives.

## 5. Visual & Audio Assets
- **Original Vector SVGs** in `unit10/assets/images_v2/`:
  - `super_spy.svg`: High-tech film studio soundstage, director's chair, studio lamps, spy silhouette, clapperboard, futuristic monitor screens.
  - `film_festival.svg`: Cinema facade with marquee lights, red carpet, velvet ropes, golden trophy podium, popcorn tub, audience silhouettes.
  - `book_adaptation.svg`: Open hardcover bestseller novel, winding celluloid film strip with glowing frames, storyboard easel, desk lamp.
  - `film_critics.svg`: Media clubroom, round debate table with microphone and mugs, critique board with 5-star ratings, television broadcast, film reels.
- **Dual-Engine Vocabulary Audio**:
  - Google Standard TTS: 43 words, 43 definitions, 43 examples = 129 MP3s + 129 `.txt` sidecars.
  - Edge Neural TTS (`en-GB-SoniaNeural`): 43 words, 43 definitions, 43 examples = 129 MP3s + 129 `.txt` sidecars.
  - Total: 258 audio files and 258 verbatim sidecars.
- **Companion Audio**:
  - 4 full story narrations with `.txt` sidecars in `assets/audio_v2/stories/`.
  - 1 multi-turn listening dialogue (`cinema_dialogue.mp3`, 6 turns) with `.txt` sidecar in `assets/audio_v2/grammar/`.

## 6. Verification Results
- `node unit10/test_v10.js`: **190 passed, 0 failed**.
- `node verify_offline.js` (from unit10): **41 passed, 0 failed**.
- `python _tools/check_definitions.py unit10`: **43/43 clean, 0 hard words**.

## 7. For the Teacher to Check
- `hit the shelves` (id 23): κυκλοφορεί στα καταστήματα/βιβλιοπωλεία
- `sold out` (id 38): εξαντλημένος (για εισιτήρια)
- `switch on/off` (id 41): ανάβω / σβήνω (διακόπτη)
- `screenplay` (id 34): κινηματογραφικό σενάριο
- `bestseller` (id 6): μπεστ σέλερ, ευπώλητο βιβλίο
- `scruffy` (id 35): ατημέλητος, ανοικοκύρευτος
- `crooked` (id 13): στραβός, κυρτός
- `acne` (id 1): ακμή, σπυράκια
