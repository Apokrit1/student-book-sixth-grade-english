# Shared Coursebook Unit Shell

This directory is the common application shell for Units 1-10. Copy its seven code files into a unit folder, set the unit number, and supply that unit's data and assets. Do not copy Unit 1 or another unit as the starting point for content.

## Files

| File | Purpose |
|---|---|
| `index.html` | Vocabulary app shell: table, cards, quizzes, printable sheet, exports, audio HUD. |
| `app.js` | Vocabulary data loading, filtering, cards, quizzes, modal, local audio queue, printing, exports. |
| `style.css` | Vocabulary app visual system. Shared fonts are imported from `../assets/fonts/fonts.css` after copying into `unit<N>/`. |
| `v2.html` | Empty modular companion shell. JavaScript creates only the modules supported by the unit data. |
| `app_v2.js` | Data-driven dossiers, grammar, listening, games, collocations, definitions, writing, practice, worksheets, passport, notes, and Workbook rendering. |
| `style_v2.css` | Companion and print styles for every shell module. |
| `verify_offline.js` | Unit-aware offline, twin, script-order, font, and URL verifier. Run it from the unit folder. |
| `README.md` | This contract. |

## Copying the shell into a unit

1. Copy all eight files into `unit<N>/`.
2. In both HTML files, set `<body data-unit="N">`.
3. If the unit has a separate Workbook twin, set `data-workbook="unit<N>_workbook_data.js"` on the `<body>` in `v2.html`. Omit this attribute when there is no Workbook.
4. Keep the unit's data under `unit<N>/data/` and all media under `unit<N>/assets/`.
5. Load the `.js` data twin before `app.js` or `app_v2.js` when the HTML declares it directly. The companion may inject its unit and Workbook twins dynamically, but the twins must exist for `file://` use.

The shell must remain unit-neutral. Unit titles, themes, activity text, stories, answers, worksheet content, and asset paths belong in data, not HTML or JavaScript.

## Vocabulary app data

`index.html` loads `data/vocabulary_data.js`, which must define:

```js
window.VOCABULARY_DATA = [
  {
    id: 1,
    word: "example",
    ipa: "[ɪɡˈzɑːmpl]",
    pos: "(n)",
    der: "Der: sample (adj)",
    emoji: "🔤",
    meaning_gr: "παράδειγμα",
    definition_en: "a thing that shows how another thing works",
    example: "This picture is an example of good design.",
    category: "General",
    image: "assets/images_v2/vocab/01_example.webp",
    image_alt: "A simple example symbol",
    image_credit: "Illustration generated for this coursebook",
    image_source: "generated",
    image_prompt: "one simple example symbol on a white background"
  }
];
```

The JSON twin must contain the same array.

Optional image fields are `image`, `image_alt`, `image_credit`, `image_source`, and `image_prompt`. A photograph needs licence/author text in `image_source` and the pupil-visible short credit in `image_credit`. A generated image needs `image_source: "generated"` and keeps its `image_prompt`.

The vocabulary app uses six local clips per item: word, definition, and example in each of `assets/audio/` and `assets/audio_neural/`. Playback chains those three parts with a 350 ms pause and stopping clears the remaining queue.

## Companion identity

`data/unit<N>_v2_data.js` defines `window.UNIT<N>_V2_DATA`. Its minimum identity is:

```json
{
  "unit_id": 2,
  "unit_title": "Going Shopping",
  "cefr_level": "A2"
}
```

The HTML and page title are populated from this object. If the JS twin exists, the app uses it before trying the JSON fallback, which keeps `file://` operation offline and reliable.

## Optional module keys

Every module is omitted when its required key or array is absent. No empty tab or panel is rendered.

### `stories` or `dossiers`

```json
{
  "stories": [
    {
      "id": "profile_1",
      "title": "A Reading Profile",
      "student": "Name",
      "flag": "📘",
      "summary": "Short overview.",
      "narrative": "Full A2 narrative.",
      "image": "assets/images_v2/profile_1.svg",
      "audio_file": "assets/audio_v2/stories/profile_1_full_story.mp3",
      "book_check": "Book check note",
      "landmarks": [
        {
          "name": "Connected item",
          "type": "Category",
          "word_key": "target_word",
          "word_id": 1,
          "desc": "Description."
        }
      ],
      "vocabulary_ids": [1]
    }
  ]
}
```

`dossiers` is an alias for `stories`. `image` is preferred. If it is absent, the shell uses the data-derived `<student>_<id>.svg` convention under `assets/images_v2/`. `word_key` is the primary vocabulary binding and `word_id` is the fallback. An unrelated realia item uses both fields as `null`; no false vocabulary chip is shown.

### `grammar_lab`

```json
{
  "grammar_lab": {
    "title": "Grammar Lab",
    "target_structures": ["Target structure"],
    "rules": [
      {
        "concept": "Rule name",
        "usage": "Simple pupil-facing explanation.",
        "signal_words": ["signal"],
        "examples": ["Example one.", "Example two."]
      }
    ],
    "practice_items": [
      {
        "sentence": "Choose [a] option.",
        "options": ["a", "b"],
        "answer": "a",
        "explanation": "Why this answer fits."
      }
    ]
  }
}
```

All grammar parts are independent and optional:

| Key | Rendered part |
|---|---|
| `target_structures` | Target-language chips. |
| `rules` | Inductive rule cards. |
| `practice_items` | Fill-in/multiple-choice practice. |
| `frequency_spectrum` | Frequency cards with `{adverb, percent, example}`. |
| `school_lab_listening`, `classroom_listening`, `authentic_listening` | Recording, transcript, projects/target verbs, and comprehension. |
| `school_lab_actions`, `scene_actions` | Present/action comparison cards. |
| `story_timeline` or a grammar array whose items have `routine` and `today` | Data-driven contrast timeline. |
| `charades_game`, `communicative_game` | Draw-card/miming game with `{action, question, affirmative, negative}` prompts. |

A listening object minimally uses:

```json
{
  "title": "Listening title",
  "audio_file": "assets/audio_v2/grammar/dialogue.mp3",
  "dialogue_script": [{ "speaker": "A", "text": "Turn text." }],
  "true_false_quiz": [{ "statement": "Statement.", "answer": true, "explanation": "Explanation." }]
}
```

### `collocations`

```json
{
  "collocations": [
    { "verb": "choose", "partner": "a colour", "example": "Choose a colour for the model." }
  ]
}
```

### `definition_challenge`

Preferred key:

```json
{
  "definition_challenge": {
    "title": "Theme Terms: Guess the Word from its Definition",
    "note": "Some terms extend beyond the core vocabulary.",
    "group_a": [{ "number": 1, "word": "ANSWER", "clue": "Definition clue." }],
    "group_b": [{ "number": 2, "word": "TERM", "clue": "Definition clue." }]
  }
}
```

`crossword` with `across` and `down` is accepted as a legacy alias. This module never draws an interlocking crossword grid. It provides reveal buttons, vocabulary audio hints, and a solved counter.

### `content_true_false`

```json
{
  "content_true_false": [
    { "fact": "Factual statement.", "answer": true, "explanation": "Explanation." }
  ]
}
```

`geography_true_false` is accepted as a legacy alias. This key enables the Practice Arena. The arena also offers spoken-word, definition, and example-sentence modes when enough vocabulary items exist.

### `report_builder_guide` or `writing_workshop`

```json
{
  "report_builder_guide": {
    "title": "Portfolio Writing Workshop",
    "genre": "Project genre",
    "default_topic": "",
    "default_author": "",
    "project_label": "Topic",
    "paragraphs": [
      {
        "number": 1,
        "heading": "Section heading",
        "guiding_questions": "Questions that guide the section.",
        "connectors": ["and", "because"],
        "sample_starter": "A short starter."
      }
    ]
  }
}
```

`writing_workshop.sections` is accepted instead of `paragraphs`. The live preview and print view use only supplied data.

### `worksheets`

```json
{
  "worksheets": {
    "title": "Classroom Worksheet Pack",
    "sheets": [
      {
        "id": 1,
        "title": "Worksheet 1",
        "sections": [
          { "title": "Task", "prompt": "Optional prompt.", "items": ["Question or task text."] }
        ]
      }
    ]
  }
}
```

The shell also derives a five-sheet review pack from available stories, grammar, collocations, writing, and content facts when `worksheets` is absent. The derived version is a review aid, not a replacement for teacher-authored paper when exact book wording matters.

### `can_do` or `passport`

```json
{
  "can_do": {
    "title": "Can-Do Passport",
    "statements": [
      { "id": "reading", "title": "Reader", "statement": "I can read the unit text.", "badge": "📚" }
    ]
  }
}
```

`passport.statements` is an alias. If no statements are supplied, the shell derives statements only from modules present in the unit data. The certificate uses the current unit title and never embeds a pupil name by default.

### `teacher_notes` and `book_checks`

```json
{
  "teacher_notes": [
    { "id": "note_1", "lesson": "Lesson reference", "title": "Teacher note", "note": "Guidance." }
  ],
  "book_checks": [
    { "title": "Book check", "note": "What the book prints and the approved resolution." }
  ]
}
```

Teacher notes or book checks enable the notes module. `book_check` may also be a string on a story or Workbook activity. It is always rendered through the same Book check component.

### Workbook

The separate twin is `data/unit<N>_workbook_data.js`:

```js
window.UNIT2_WORKBOOK_DATA = {
  unit: 2,
  title: "Unit 2 Workbook",
  total_activities: 1,
  activities: [
    {
      "id": "a1",
      "number": "A1",
      "title": "Printed activity title",
      "page": 1,
      "type": "closed",
      "instruction": "Printed instruction.",
      "gaps": [
        { "id": "1", "prefix": "We have", "suffix": "apples.", "accepted": ["some"], "key_answer": "some" }
      ]
    }
  ]
};
```

Required activity fields are `id`, `number`, `title`, `page`, and `type`. `type` is `closed`, `semi-open`, or `open`.

The generic renderer detects current activity shapes by fields, not activity IDs:

- `pairs`
- `gaps`
- `items` with `options`
- image-led `items` with `accepted` or `target`
- `landforms`
- `adverbs`
- `starters`
- `letter_text` with `questions`
- `part1` and `part2`
- `open` checklists, sentence starters, word banks, and model text
- optional `incoming_email`, `image`, or timetable data

Closed activities require official answer sets, `pairs`, or `key_answer` values. Semi-open activities use only data rules such as an expected adverb, starter, keyword, or completion check. Open activities use reminder checklists, sentence starters, a word bank, and one model text. `getHint(activityId, pupilText)` always returns `null`; there is no AI or network call.

## Files each unit must provide itself

The shell does not provide unit content or assets:

- `data/vocabulary_data.json` and `.js`
- `data/unit<N>_v2_data.json` and `.js`
- `data/unit<N>_workbook_data.json` and `.js` when a Workbook exists
- `assets/audio/`, `assets/audio_neural/`, and `assets/audio_v2/`
- `assets/images_v2/`
- `test_v<N>.js`
- `ERRATA.md`
- `BUILD_NOTES.md`
- source pack and any unit-specific non-code assets required by the tests

## Adding a module

1. Choose a new top-level data key and define its schema in this README.
2. Add one module to the module registry in `app_v2.js` only when that key exists.
3. Render a complete panel or return no module. Never show an empty heading or panel.
4. Add generic CSS selectors only. Do not add visible unit content to CSS.
5. Re-run Unit 1 against the changed shell, then run the new unit's own tests, offline verification, audio audit, and definition checker.
6. Record reusable rules under “Proposed skill changes” in the affected unit's `BUILD_NOTES.md` before asking the reviewer to update the skill.

## Verification

Run from the unit folder:

```text
node test_v<N>.js
node verify_offline.js
node ../.agents/skills/coursebook-unit-extender/templates/test_unit.template.js <N>
node ../.agents/skills/coursebook-unit-extender/scripts/generate_unit_audio.js vocab data/vocabulary_data.json --set both --check
python3 ../_tools/check_definitions.py unit<N>
```

`verify_offline.js` derives the unit from `<body data-unit="N">` or a `unitN` folder name. It fails on missing runtime files, validates JS-before-fetch loading, checks data twins, and rejects every external URL. The only exemption is a data-file URL beginning exactly with `https://creativecommons.org/`; licence text is displayed and is never fetched.
