# Task: three clips instead of four, and one audio path for all units

Supersedes the first version of this file (22:15). Measured state on 20 Sep 2026, 22:30,
after the definition change.

| folder | mp3 | sidecars | state |
|---|---|---|---|
| `assets/audio/words` (Google) | 35 | **0** | text unchanged, but unverified: no sidecar ever written |
| `assets/audio/defs` | 35 | 35 | correct, re-recorded today |
| `assets/audio/examples` | 35 | **2** | only #22 verified; the other 33 unverified |
| `assets/audio/full` | 35 | **1** | **all 35 read the OLD definitions** |
| `assets/audio_neural/words` | 35 | 35 | correct |
| `assets/audio_neural/defs` | 35 | 35 | correct, re-recorded today |
| `assets/audio_neural/examples` | 35 | 35 | correct |
| `assets/audio_neural/full` | 35 | 35 | **all 35 read the OLD definitions** (sidecars prove it) |

## The decision: drop the composite clip

`full/` is a single recording of `"<word>. Definition: <definition_en>. Example: <example>"`.
It duplicates text that is already recorded three times over, so every edit to a word, a
definition or an example silently invalidates it. That is exactly what happened today.

**The "full reading" button will instead play the three existing clips in sequence.**
Consequences, all in the right direction:

- One text change costs **one** recording, not two.
- The composite drift class disappears: there is no clip whose text is derived from three
  fields.
- 3 clips per item instead of 4: 210 files per unit per two voice sets instead of 280.
  Across ten units that is roughly 700 fewer recordings to keep honest.
- A pause between word, definition and example is pedagogically fine, arguably better
  than a seamless run-on.

What is lost: the spoken connectives "Definition:" and "Example:", and the single-pass
intonation across the whole reading. The on-screen card already labels the three parts, so
the connectives are not needed. If we ever want them back, they are two tiny clips per
voice set recorded **once for the whole project**, not per unit; do not build that now.

Note on technique: the app runs from `file://`, where `fetch()` and `XMLHttpRequest` are
blocked, so Web Audio buffer scheduling is not available and gapless playback is not
achievable. Chain `<audio>` elements on their `ended` event. Insert a deliberate 350 ms
pause between clips so the seam is a choice rather than an artefact.

## Part 1: the app plays a sequence

In `unit1/app_v2.js`:

- Replace the single-element player with a small queue. `playAudioSequence(srcs, typeName,
  trackTitle, triggerBtn)` plays `srcs[0]`, and on `ended` waits 350 ms and starts the
  next. The existing `playAudioFile` becomes a one-element call into it.
- `stopAudio()` must clear the queue as well as the current element, or a stop mid-way
  will be followed by the next clip starting on its own.
- The HUD's pause and playback-rate controls must act on whichever clip is playing, and
  the chosen `playbackRate` must be applied to each clip in the queue, not only the first.
- `getVocabAudioPath('full', …)` goes away. The full-reading button now asks for
  `['word', 'def', 'example']` paths. Keep the button, its label and its position.
- The HUD title for the sequence stays one title (the headword), not three.

## Part 2: retire the composite files

- Move `assets/audio/full/` and `assets/audio_neural/full/` to
  `unit1/_to_delete/audio_full/` (keep the two folder names apart inside it). Do not
  delete: the teacher deletes.
- Grep the whole unit for `/full/` and `'full'` and remove every remaining reference in
  runtime files, tests and worksheets.

## Part 3: fill the unverified Google sidecars

The Google set has no sidecars for `words` (0/35) and almost none for `examples` (2/35).
Their text has not changed, but an unlistened clip is not evidence, so re-voice rather
than adopt. **Do not pass `--adopt-existing` anywhere in this task.**

```bash
cd unit1
node ../.agents/skills/coursebook-unit-extender/scripts/generate_unit_audio.js vocab \
     data/vocabulary_data.json --set google --only words,examples --force
```
Leave both `defs/` folders and the neural `words/` and `examples/` alone: their sidecars
already match the current data. **Do not re-record any `full` clip**: they are being
retired, not refreshed.

## Part 4: one generator for all units (authorised edit inside the skill)

Edit `.agents/skills/coursebook-unit-extender/scripts/generate_unit_audio.js`. Keep every
existing flag and behaviour, and add:

- `--set google|neural|both` (default `both`). `google` writes `assets/audio/` using
  `google-tts-api`, ported from `unit1/build_data_and_audio.js` with its current encoding;
  `neural` writes `assets/audio_neural/` using Edge TTS as now. **Both engines always
  write `.txt` sidecars.** Sidecar-less output is not acceptable from either.
- `--only words,defs,examples` (default: all three). `full` is no longer generated; if
  someone passes `--only full`, print a one-line explanation that composite clips were
  retired on 20 Sep 2026 and exit 1.
- `--ids 1,22,29` (default: all).
- `--check`: record nothing. Compare every expected clip and every sidecar against the
  current `vocabulary_data.json`; list missing mp3s, missing sidecars and drifted text;
  exit 1 if anything is wrong. This is the audit that replaces reading mtimes by hand.
- Update the header usage block and the no-argument help text.

Keep the existing failure tracking: a failed recording still prints `[VOCAB INCOMPLETE]`
and sets exit code 1.

Then retire the one-off paths:
- `unit1/build_data_and_audio.js` also builds data files, so keep it, but disable its
  audio section and add a header line saying audio now comes from the skill generator with
  `--set google`.
- Mark `unit1/generate_neural_voice.js` superseded the same way. Do not delete either.
- Delete any leftover one-off re-record script under `unit1/scripts/`.
- No new audio scripts from here on. If the generator cannot express what is needed, add a
  flag to it.

## Part 5: the test that would have caught today's problem

Add to `unit1/test_v2.js` **and** to
`.agents/skills/coursebook-unit-extender/templates/test_unit.template.js`, so Units 2-10
inherit it:

- every vocabulary item has `word`, `definition` and `example` clips in both voice sets;
- every clip has a `.txt` sidecar;
- every sidecar equals the corresponding field in `vocabulary_data.json`;
- no runtime file references a `full/` path;
- the full-reading button queues exactly three sources, in the order word, definition,
  example.

## Finish

```bash
cd unit1
node ../.agents/skills/coursebook-unit-extender/scripts/generate_unit_audio.js vocab \
     data/vocabulary_data.json --set both --check      # must exit 0
node test_v2.js
node verify_offline.js
node ../.agents/skills/coursebook-unit-extender/templates/test_unit.template.js 1
python3 ../_tools/check_definitions.py unit1           # must exit 0
```

Listen to one sequence yourself in the browser before reporting: open `v2.html`, press the
full-reading button on item 19 (`mountain`) in both voice sets, and confirm the three
clips play in order with the pause and no overlap.

Then update `BUILD_NOTES.md`: the three-clip decision and why, what moved to `_to_delete/`,
which clips were re-voiced, the new generator flags, the new tests, and a
"Proposed skill changes" section saying Step 8 now specifies three clips per item, no
composite, one generator for both voice sets.

Constraints unchanged: 100% offline at runtime, no network calls in the app, the book's
text is not edited, `_tools/` and the skill's `references/` stay untouched.
