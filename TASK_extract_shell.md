# Task: extract the shared unit shell from Unit 1

One session, before Unit 2. Its only job is to turn Unit 1's working code into the shell every
later unit is built from, and to prove the shell by running Unit 1 on it. No new content.

You are authorised in this session to create `.agents/skills/coursebook-unit-extender/templates/unit_shell/`
and to replace Unit 1's six code files with the shell's copies. You are not authorised to change
any file in `unit1/data/`, `unit1/assets/`, `_tools/`, or the skill's `SKILL.md` and `references/`.

## Read first
1. `.agents/skills/coursebook-unit-extender/SKILL.md`, especially "Starting a unit: the shell",
   Step 8 (three-clip audio, visual glosses) and Step 10 (Workbook Companion)
2. `unit1/BUILD_NOTES.md`

## Build `templates/unit_shell/`

Files: `index.html`, `app.js`, `style.css` (vocabulary app); `v2.html`, `app_v2.js`,
`style_v2.css` (companion, including the Workbook module); `verify_offline.js`; `README.md`.

Starting point: the same files in `unit1/`. Then:

1. **No unit-specific string in shell code.** Today `v2.html` and `app_v2.js` name Unit 1's
   countries (about 24 mentions), the pages say "Multicultural", and several places hard-code
   `35` items. Everything that differs between units comes from data: the unit title and
   number from `data/unit<N>_v2_data.json` (`unit_id`, `unit_title`), item counts from the data
   length, dossier names from the stories array. Both HTML files read `data-unit` from `<body>`.
   The vocabulary app loads the v2 data twin only for the title, if it needs it.
2. **Every module renders only when its data key exists** (stories/dossiers, grammar lab and each
   of its optional parts, definition challenge, collocations, true/false, writing workshop,
   worksheets, Workbook, teacher notes). A unit that lacks a key shows no empty panel and no
   console error.
3. Keep what Unit 1 proved: the three-clip `playAudioSequence` queue with the 350 ms pause and
   queue-clearing `stopAudio()`; visual glosses with the pupil-visible credit line; the
   "Book check" component; the Workbook module with closed / semi-open / open treatment, print
   views, and `getHint(activityId, pupilText)` returning `null`; offline loading from `.js`
   twins before any `fetch()`.
4. `verify_offline.js`: generic (unit number from the folder or `data-unit`), and it may exempt
   only licence URLs, by exact prefix `^https://creativecommons\.org/`, and only in data files.
5. Fonts load from the hub's `../assets/fonts/`; no remote URL anywhere.

`README.md` in the shell lists: every file; every data key each module reads, with a minimal
example; what each unit must provide itself (`data/*` and twins, `assets/audio*`,
`assets/images_v2/`, `test_v<N>.js`, `ERRATA.md`, `BUILD_NOTES.md`); how to add a module
(generic, behind a data key, then re-run Unit 1).

## Prove it on Unit 1

1. Move Unit 1's current `index.html app.js style.css v2.html app_v2.js style_v2.css
   verify_offline.js` into `_scratch/unit1_code_before_shell/` (move, do not delete: this is the
   rollback).
2. Copy the shell's seven code files into `unit1/`; set `data-unit="1"` in both HTML files.
3. Everything must pass, from inside `unit1/`:
   ```
   node test_v2.js
   node verify_offline.js
   node ../.agents/skills/coursebook-unit-extender/templates/test_unit.template.js 1
   node ../.agents/skills/coursebook-unit-extender/scripts/generate_unit_audio.js vocab data/vocabulary_data.json --set both --check
   python3 ../_tools/check_definitions.py unit1
   ```
   If a Unit 1 test fails because it tested shell behaviour through a Unit 1 string, fix the shell
   (or move the check into the shell's generic tests), not the data.
4. Open `unit1/index.html` and `unit1/v2.html` in the browser from `file://` and go through
   every tab. The two apps must look and behave as before. List anything that changed.
5. Smoke test for genericity: make a throwaway `_scratch/shell_smoke/` containing the shell plus
   a three-item `vocabulary_data` and a `unit_v2_data` with only `unit_id`, `unit_title` and
   `teacher_notes`. Both pages must load with no console error and no empty panels. Delete the
   folder's contents afterwards (move it to `_scratch/`, it is already there).

## Also
- `scripts/fetch_commons_images.js` is a library with no command line. Add a `main` that takes
  a JSON list of items (`id`, `word`, `hint`) and the brief's settings, writes candidates only to
  `../_scratch/commons_unit<N>/`, and prints the report table. Its `USER_AGENT` names an invented
  contact address; replace it with `https://github.com/` style project URL or leave a clearly
  marked placeholder `CONTACT_NEEDED` and tell the teacher. Do not invent an e-mail address.

## Finish
Write a "Shell extraction (date)" section in `unit1/BUILD_NOTES.md`: what moved into the shell,
what was generalised and how, the test results, anything that looks different in the browser,
and "Proposed skill changes" if the shell needs rules the skill does not state.
