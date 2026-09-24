# Prompt: Unit 1 Workbook conversion (paste into a NEW Antigravity window)

```
Task: turn the Unit 1 Workbook into an interactive part of the Unit 1 app,
following the coursebook-unit-extender skill.

READ FIRST, in this order, before writing any code:
1. .agents/skills/coursebook-unit-extender/SKILL.md (all of it, especially
   "Book Errors", "Rights" and the Session Protocol)
2. unit1/ERRATA.md and unit1/BUILD_NOTES.md
3. unit1/source/20_WB_unit.txt  (the Workbook, printed pp.1-8)
4. unit1/source/30_TB_unit.txt  (the Teacher's Book; the Workbook answer key
   is at "Key to Workbook Exercises", PDF pp.23-24)
5. unit1/v2.html, unit1/app_v2.js, unit1/style_v2.css (how the app is built now)
Do not open other units' folders.

WHAT TO BUILD
A "Workbook" module in unit1/v2.html: one card per Workbook activity, in the
book's order and with the book's numbering (A1, A2, A3, B1-I, B1-II, B2, B3,
B4, B5, C1, C2, C3, D, E, plus the opening page), so a pupil can go from the
printed page to the screen without getting lost.

Keep the book's wording, names and word banks. Where the book is wrong, follow
ERRATA.md; where you find something new, ASK ME (see below).

Three kinds of activity, three treatments:

1. Closed activities (A1 matching; B1-I and B1-II fill-ins; B2 dialogue;
   B3 choose the verb): instant checking.
   - Answers come from the Teacher's Book key. Do not invent answers.
   - Store SETS of accepted answers, not one string. The key's negatives
     count ("do not get up", "do not walk") and so do contractions
     ("don't get up"). In B2 more than one verb from the bank can fit;
     accept every form the key or the grammar allows, and list your
     reasoning in BUILD_NOTES.md.
   - Ignore case and extra spaces. Show which gaps are right and let the
     pupil retry the wrong ones before showing the answer.

2. Semi-open activities (opening page; A2 landforms; B4 frequency-adverb
   sentences; B5 reporter's questions; C1 Bucksport questions):
   - Pre-written model answers the pupil can reveal after trying.
   - Simple rule checks, no AI: B4, does each sentence contain one of the six
     adverbs and a verb; B5, does each question start with the given word
     and end with "?"; C1, does the answer contain the key facts from the
     letter (the Teacher's Book key lists them).
   - A3 (school subjects) needs pictures that are not in the text: generate
     original, simple, consistent illustrations of the school subjects
     used in the unit.

3. Open activities (C2 holiday letter; C3 reply to Jack; D describe the
   photo; E note to Peter from the Greek timetable):
   - Scaffolding only: the book's own prompts as a checklist ("location,
     weather, sights, people, your opinion"), sentence starters, a word bank
     from the unit, and one short model text per activity.
   - The checklist ticks itself when the pupil's text mentions each point
     (simple keyword rules; say in the UI that it is a reminder, not a mark).
   - D needs an original holiday-beach snapshot image matching the book's
     starter text. Generate it; no real people, no brands.
   - Leave a clearly marked empty hook in the code, getHint(activityId,
     pupilText), that returns null for now. A local AI model may be plugged
     in later. Do NOT add any AI, model download or network call now.

Every activity gets a "Print" view: the same activity as a clean A4
worksheet with name/class/date lines, matching the existing worksheet style.

HARD RULES
- 100% offline. No http/https URLs anywhere in runtime files.
- Pupil text never leaves the page and is not stored after the page closes.
- Data goes in unit1/data/unit1_workbook_data.json with its twin
  unit1/data/unit1_workbook_data.js (window.UNIT1_WORKBOOK_DATA), kept in sync
  with .agents/skills/coursebook-unit-extender/scripts/sync_data_twins.js.
- No audio is re-recorded. If an activity needs new audio, generate only new
  files, with sidecars, using the skill's generate_unit_audio.js.
- Do not change existing Unit 1 content outside the Workbook module.

ASK ME, DO NOT GUESS
When the book or its key looks wrong, stop and ask me before building that
item: quote the page, say what looks wrong, offer keep / annotate / teacher-note
/ replace. Record my answer in unit1/ERRATA.md. Known candidates to ask about
first:
- B1: the title says "TONY Papadopoulos", the text and key say "Tonny".
- A2: the key describes labelling a picture; the Workbook asks for examples
  from the Greek Geography map. Which does the app follow?
If I do not answer, keep the book's version, mark the item "pending" in
ERRATA.md, and carry on.

FINISH
1. Add tests to unit1/test_v2.js: every closed item has at least one accepted
   answer; the key's own answers are all accepted; the workbook data twins
   match; no external URLs.
2. Run, inside unit1/: node test_v2.js, node verify_offline.js, and
   node ../.agents/skills/coursebook-unit-extender/templates/test_unit.template.js 1
   All must pass.
3. Update unit1/BUILD_NOTES.md: what you built, every accepted-answer
   decision, any ERRATA items added, test results, and "Proposed skill
   changes" (how the Workbook step should be written into the skill for
   Units 2-10).
```

## Why these choices

- **Separate data file**: the Workbook data is as large as the rest of Unit 1; keeping it apart keeps both files readable for future sessions.
- **Answer sets from the key**: the key includes negatives the exercise only hints at; a single-answer checker would mark correct pupils wrong.
- **No AI yet, but a hook**: the decision on local AI stays open; the hook means adding it later touches one function, not every activity.
- **"Proposed skill changes"**: after this session, the Workbook step becomes part of the skill so Units 2-10 get it automatically.
