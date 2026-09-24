# Task: adopt the A2 definitions in Unit 1 (and only that)

Written 20 Sep 2026 by the reviewer. Everything you need is on disk; do not redesign
anything outside this list.

## Read first
1. `../.agents/skills/coursebook-unit-extender/references/defining_vocabulary.md` (new)
2. `definition_review.md` (why these changes, with the measurements)
3. `ERRATA.md`, `BUILD_NOTES.md`

## Do

1. **Replace the 35 English definitions** in `data/vocabulary_data.json` with the texts
   in `proposed_definitions_A2_v2.json` (keyed by `id`, field `definition_en` only).
   Change nothing else in those records: not `word`, `ipa`, `pos`, `der`, `emoji`,
   `meaning_gr`, `example` or `category`. Regenerate the `.js` twin with
   `../.agents/skills/coursebook-unit-extender/scripts/sync_data_twins.js`.

2. **Item 32's headword is wrong.** It reads `"split in"`, which is not a lexical item;
   Appendix V prints "split in two" and the extraction lost the "two". Set the headword
   to `split (in two)`. Add it to `ERRATA.md` as a layout/extraction item beside E5,
   resolution `replace`, status `approved (20 Sep 2026)`.

3. **Item 22's example is an editorial claim**: "The nuclear power plant produces massive
   amounts of clean electricity", in the unit whose Ukraine material is Chernobyl.
   Replace with: `Ukraine has several nuclear power plants that make electricity.`
   This is the only `example` you change in this task.

4. **Re-record only what changed.** Re-synthesise the 35 `definition` clips in both
   voice sets, plus the one `example` clip for item 22, with `.txt` sidecars, using
   `scripts/generate_unit_audio.js`. Do **not** re-record the word clips, the other
   example clips, the story narrations or the lab dialogue: their text has not changed.
   If the generator reports any failure it exits 1; fix or report, never certify.

5. **ASK ME before building item 29 (`race`).** The new text is "one of the large groups
   that people are sometimes put into, by where their family comes from". The wording of
   this one is a teaching decision, not a lexicographic one, in a unit called *Our
   Multicultural Class*. Quote it back to me with the alternative you would prefer and
   wait. While waiting, build everything else; leave item 29's current definition and
   audio untouched, and mark it pending in `BUILD_NOTES.md`.
   Also propose (do not build) a `teacher_notes` line saying that the pupils already
   know the other sense of the word, a running race.

## Then
```
cd unit1
node test_v2.js
node verify_offline.js
node ../.agents/skills/coursebook-unit-extender/templates/test_unit.template.js 1
python3 ../_tools/check_definitions.py unit1      # must exit 0
```
The checker is the new Step 10 gate. It reports the CEFR level of any word above A2.
**Never** make a flag disappear by editing `_tools/wordlist_elt_core_extra.txt`: that
file records what the teacher says his classes know, and it is not yours to edit. If a
flag looks wrong, write it in `BUILD_NOTES.md` and ask.

## Do not
- Do not rewrite the other 34 example sentences. They are measured as too hard
  (31/35 carry a word above level) and they are a separate pass, after classroom
  testing, because each one costs another recording.
- Do not touch `_tools/check_definitions.py`, `_tools/build_oxford_wordlist.py`, the word
  lists, or the skill's `references/`. Those are the reviewer's files. One editor per
  file: the app, its data and all audio are yours; the tools and the skill are his.
- Do not add network calls. 100% offline stands.

## Finish
Update `BUILD_NOTES.md`: the definition change (with the before/after count from the
checker), the item 32 headword fix, the item 22 example, which clips were re-synthesised
and which deliberately were not, test results, and anything left pending.
