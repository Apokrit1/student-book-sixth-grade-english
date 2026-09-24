# Unit 1 review: defining vocabulary in the vocabulary activity

20 Sep 2026. Question asked: are the English definitions in the Unit 1 vocabulary
activity appropriate for the level of the pupils (A2, 11-12 years old)?

Verdict: **no.** They read as native-speaker dictionary glosses (the register of
Oxford's or Collins' full editions), not learner-dictionary entries. In 30 of 35
items the pupil has to decode at least one word harder than the headword, which is
the one failure mode a vocabulary activity cannot afford: the definition becomes the
new unknown.

## How this was measured

`_tools/check_definitions.py <unit>` (new, offline, no network). A word in a
definition counts as available to the pupil if it is:

1. a grammar/function word, or
2. anywhere in the Appendix V vocabulary lists of **all ten units** of the Pupil's
   Book, or in this unit's own Pupil's Book and Workbook text (1599 word forms), or
3. in the top 2000 of a general English frequency list
   (`_tools/wordlist_top3000.txt`), plus a teacher-editable
   `_tools/wordlist_elt_core_extra.txt` for everyday A1-A2 words that web-derived
   frequency lists under-rate.

Anything else is flagged. Inflections are resolved by suffix stripping, so
"flowing" counts as "flow". The script also flags definitions over 12 words,
circular definitions (the headword or a hard part of it reused), and definitions
that lean on another target word from the same unit.

## Results

| | current | proposed rewrite |
|---|---|---|
| clean | **5 / 35** | **35 / 35** |
| average length | 10.4 words | 8.3 words |
| contains a word outside both references | 30 | 0 |
| over 12 words | 5 | 0 |

Only `brave`, `coast`, `connect`, `plain`, `search` pass as printed.

### Worst cases, with the flagged words

| id | word | definition as built | problem |
|---|---|---|---|
| 4 | citrus fruit | "a fruit with a thick skin and pulpy flesh, such as an orange or lemon" | 15 words; *pulpy*, *flesh* (and *flesh* in a food sense is a false friend for Greek pupils) |
| 18 | molecule | "a group of atoms bonded together, representing the smallest unit of a compound" | 13 words; *bonded*, *representing*, *compound* - three abstractions to explain one |
| 22 | nuclear power plant | "a thermal power station in which the heat source is a nuclear reactor" | *thermal*, *reactor*; relative clause with "in which" |
| 19 | mountain | "a large natural elevation of the earth's surface rising abruptly" | *elevation*, *abruptly*: the definition is harder than "mountain" by a wide margin |
| 34 | underwater | "situated, occurring, or done beneath the surface of the water" | *situated*, *occurring*, *beneath*; three synonyms where one plain phrase does |
| 21 | natural disaster | "a major adverse event resulting from natural processes of the Earth" | *adverse*, *resulting*, *processes* |
| 24 | outgoing | "friendly, sociable, and eager to talk to people" | *sociable* is a harder synonym of the headword, *eager* |
| 1 | ancient | "belonging to the distant past and no longer in existence" | *belonging*, *distant*, *existence*; also factually odd (ancient Greece is gone, ancient olive trees are not) |
| 10 | copy | "to produce something that is an exact duplicate of an original" | *produce*, *exact*, *duplicate*; this is a computer-lab verb the pupil will click, not an abstraction |

Full machine output: `python3 _tools/check_definitions.py unit1`.

## Proposed rewrites

`unit1/proposed_definitions_A2.json` (35 entries, `{id: definition}`), written to the
same rules a learner dictionary uses: plain words, one idea per definition, the
pupil's own noun-phrase shape, no synonym that is rarer than the headword. Verified:
`python3 _tools/check_definitions.py unit1 --defs unit1/proposed_definitions_A2.json`
-> 35/35 clean, average 8.3 words.

Samples:

| word | from | to |
|---|---|---|
| ancient | belonging to the distant past and no longer in existence | very old, from a time long ago |
| citrus fruit | a fruit with a thick skin and pulpy flesh, such as an orange or lemon | a fruit like an orange or a lemon |
| molecule | a group of atoms bonded together, representing the smallest unit of a compound | a very small part of something, made of atoms |
| nuclear power plant | a thermal power station in which the heat source is a nuclear reactor | a big station that makes electricity from atoms |
| mountain | a large natural elevation of the earth's surface rising abruptly | a very high hill of rock |
| underwater | situated, occurring, or done beneath the surface of the water | under the top of the sea or a lake |
| oil well | a hole drilled into the earth for bringing oil to the surface | a deep hole in the ground that brings up oil |
| paste | to insert copied text or an image into a document on a computer | to put text or a picture that you copied into a file |

## Two content problems, not level problems

- **id 29 `race`**: "a group of people sharing ethnic heritage, or a running
  competition" puts two unrelated senses in one gloss and picks the sense the unit
  cannot support. In a unit called *Our Multicultural Class* the word appears in the
  sense of background/origin, and an 11-year-old reading "a group of people sharing
  ethnic heritage" learns a taxonomy the lesson is trying to avoid. Proposed:
  "a large group of people who share the same background", with a teacher note that
  the homonym (a running race) is the sense the pupils already know, and that the
  book's own framing is about countries and cultures, not races. Flagging rather
  than deciding: this one is yours.
- **id 22 `nuclear power plant`**, example sentence: "The nuclear power plant
  produces massive amounts of clean electricity." That is an editorial claim, and it
  sits in the unit whose Ukraine dossier is about Chernobyl. Proposed neutral
  replacement: "Ukraine has several nuclear power plants that make electricity."

## Also measured: the example sentences

Same references, same method: **31 of 35 examples contain at least one word outside
both lists, average 11.5 words.** Part of that is proper nouns the checker cannot
know (*Peloponnese*, *Olympus*, *Celsius*) and can be ignored. The real cases are
sentences carrying a second unknown load:

- `oil well`: "Engineers drilled an oil well deep beneath the seabed to extract
  petroleum." - *drilled, beneath, seabed, extract, petroleum*
- `plain`: "Farmers cultivate wheat and corn across the vast green plain of
  Thessaly." - *cultivate, wheat, vast*
- `peninsula`: "...connected to mainland Greece by the Isthmus." - *mainland,
  Isthmus*
- `molecule`: "...composed of hydrogen and oxygen." - *composed*

Examples may legitimately sit slightly above the definition (they are context, not
explanation), so the rule proposed for them is looser: at most one new word per
example sentence, 12 words maximum, and no new word in the same semantic field as
the headword. Rewrites for the examples are not drafted yet; say the word and they
follow the same way.

## One book-side item found while reading the data

id 32 is stored as the headword **"split in"**, which is not a lexical item. Appendix
V prints "split in two"; the app's entry has lost the "two". This is an extraction
artefact, not a book error, so it is a fix rather than an errata entry: headword
"split (in two)", definition "to break something into two parts". Confirm and it
goes into `ERRATA.md` as a layout item alongside E5.

## Nothing has been changed

Per the standing rule (errors are put to the teacher, not silently changed),
`vocabulary_data.json` is untouched. Two consequences to weigh before approving:

1. **Audio.** Each word has a definition recording in both voice sets. Adopting the
   rewrites means re-synthesising 35 definition clips (not the word, example or
   story clips). That is a build-time Edge TTS run, roughly a minute, and it is the
   only re-recording involved. Your "don't re-record" instruction was about the
   book's own recordings and the existing word/example audio; say if you want it to
   cover these too, in which case the definitions stay as text-only changes and the
   old audio must be removed rather than left to drift from the text.
2. **Sidecars.** The `.txt` sidecars make the drift visible: changing a definition
   without re-recording will make `generate_unit_audio.js` report the clip stale,
   which is the correct behaviour and should not be suppressed.

## Proposed skill changes (for Units 2-10)

1. **New rule in SKILL.md Step 2 (content rules):** "Definitions use a controlled
   defining vocabulary. Every word in a definition must be a grammar word, a word
   from any unit's Appendix V list, or among the 2000 most frequent English words.
   Maximum 12 words, one sense per definition, no synonym rarer than the headword,
   no other target word from the same unit. Example sentences: maximum 12 words and
   at most one new word." Add a worked before/after pair from this review so a fresh
   agent has the register in front of it.
2. **New Step 10 gate:** `python3 _tools/check_definitions.py unit<N>` must exit 0
   before a unit is declared finished; it already exits 1 on any flagged item.
3. **Reference file:** move the rule and the before/after pairs into
   `references/defining_vocabulary.md` so Step 2 stays short.
4. `_tools/wordlist_elt_core_extra.txt` is teacher-editable: add words you know your
   classes have, and the checker loosens accordingly. Nothing about this touches the
   printed book.

---

# Second pass, 20 Sep 2026 evening: after teacher review

The teacher rejected several of the first rewrites as flat ("a very high hill of
rock" for *mountain*, "a lot of water that runs to the sea or a lake" for *river*).
He was right, and the reason is instructive: the first pass optimised the metric.
With a 12-word ceiling and a flag on every word outside the reference, the cheapest
way to a clean score is a telegraphic gloss. Clean is not the same as good. The
checker measures one failure mode (the definition is harder than the word) and is
blind to the other (the definition is too thin to build a concept).

## Consulting learner dictionaries: permitted, with a line

The question was whether an agent may look at published learner dictionaries for
this. Yes, and it should. The distinction that matters is **method versus text**.

- **Method is not owned.** The controlled defining vocabulary is published
  lexicographic practice: Longman writes LDOCE inside about 2000 words, Oxford's
  OALD inside about 3000, and the technique is documented in the open. Studying how
  Cambridge shapes an A1 entry and writing our own entries the same way is normal
  professional work, the same as a teacher learning to write a rubric by reading
  good rubrics.
- **Their wording is owned.** Copying 35 definitions out of a learner dictionary
  into an app that is distributed to classes would be copying protected expression,
  and a set of them is also a taking from the dictionary's compilation. Attribution
  does not fix that; attribution answers plagiarism, not copyright.
- **The Greek teaching exception is narrower than it sounds.** Law 2121/1993
  art. 21 permits reproducing short extracts "exclusively for teaching or
  examination purposes at an educational establishment", to an extent commensurate
  with that purpose, with the source named, and on condition that it does not
  interfere with normal exploitation of the work. Art. 19 permits short quotations
  in support of an argument, again with attribution. Showing a class a Cambridge
  entry on the projector to compare definitions sits comfortably inside art. 21. A
  shipped app whose vocabulary module is a dictionary's own definitions does not:
  it substitutes for the dictionary, which is exactly the "normal exploitation" the
  article protects. Non-commercial intent helps but does not decide it.
- **So the rule for the skill:** read learner dictionaries for register, shape and
  level; write every definition in our own words; quote another dictionary only as
  a quotation, marked and attributed, and only where the point is the comparison
  itself (a teacher note, an errata entry). Never as the app's own text.

This is also the cheaper answer pedagogically, because our definitions can do
something no commercial dictionary can (below).

## What the learner dictionaries actually do

Checked directly:

- *mountain*, Cambridge Essential English, labelled A2: "a very high hill".
  So the first draft's shape was the standard one, and the standard one is weak here.
  For a class in Volos with Pelion out of the window, defining a mountain as a kind
  of hill explains the familiar by the unfamiliar. Cambridge's full entry does it
  better ("much larger than a hill"), which is the version worth borrowing the shape
  of.
- *river*, Cambridge, labelled **A1**: "a long, natural area of water that flows
  across the land and into a sea, lake, or another river". **Sixteen words at A1.**
  This is the finding that recalibrates the whole check: professional A1 definitions
  are not short, they are *easy*. Length was the wrong constraint.
- *plain*, Longman: "a large area of flat dry land".

## Design principle adopted for this book

Three rules, in priority order:

1. **Every word in the definition must be easier than the headword.** Unchanged,
   and it is the only hard rule.
2. **The definition must build a picture, not just fence off a meaning.** One
   concrete, distinguishing feature the pupil can see in the mind, in preference to
   a genus-and-differentia formula.
3. **Anchor abstract or visual items to a referent the class already owns.**
   "like Mount Olympus", "like the Peloponnese", "like the plain of Thessaly", "in
   the story of Jason and the Argonauts". A commercial dictionary cannot do this
   because it does not know its reader; a national coursebook does. It also pulls
   the vocabulary module back into the unit's own subject matter (Greek geography
   and the multicultural class) instead of floating free of it.

A fourth, weaker consideration: each entry already carries `meaning_gr` (βουνό,
όρος). The Greek gloss is the safety net for meaning, which frees the English
definition to be readable input rather than an airtight legal gloss. That is a real
difference from a monolingual dictionary and it argues for rule 2 over precision.

## Second-pass definitions

`unit1/proposed_definitions_A2_v2.json` supersedes `proposed_definitions_A2.json`.
35/35 clean under the recalibrated check, average 10.7 words.

| id | word | v1 (rejected) | v2 |
|---|---|---|---|
| 19 | mountain | a very high hill of rock | a very high piece of land, much bigger than a hill, like Mount Olympus |
| 30 | river | a lot of water that runs to the sea or a lake | water that flows in a long line across the land to the sea or a lake |
| 27 | plain | a large flat area of land with few trees | a large flat area of land where farmers grow food, like the plain of Thessaly |
| 26 | peninsula | land with sea on almost every side | land with water on three sides of it, like the Peloponnese |
| 1 | ancient | very old, from a time long ago | very old, from a time thousands of years ago, like ancient Greece |
| 13 | golden fleece | the gold wool of a flying sheep in a Greek story | the gold wool of a magic sheep, in the story of Jason and the Argonauts |
| 18 | molecule | a very small part of something, made of atoms | the smallest piece of water, air or anything else; it is made of atoms |
| 22 | nuclear power plant | a big station that makes electricity from atoms | a place that makes electricity from the energy inside atoms |
| 11 | earthquake | when the ground shakes hard and buildings can fall | when the ground shakes suddenly and strongly |
| 15 | landmark | a famous building or place that everyone knows | a building or place that is easy to know again, and helps you find your way |
| 24 | outgoing | friendly and happy to talk to new people | someone who likes meeting and talking to new people |
| 9 | copper | a brown-red metal used in wires and coins | a soft red-brown metal, used in coins and electric wires |

`race` (id 29) is now "one of the large groups that people are sometimes put into, by
where their family comes from". "Sometimes put into" is deliberate: it presents the
category as something people do, not a property of the people. Still the teacher's
call, and still wants a teacher note.

## Checker recalibrated

Changes to `_tools/check_definitions.py`, with reasons:

1. `MAX_WORDS` 12 -> **18**. Evidence: Cambridge's A1 *river* entry is 16 words.
   Length is the weak signal; hard words are the strong one.
2. **Proper names are no longer flagged.** A capitalised token that is not
   sentence-initial (Olympus, Thessaly, the Argonauts) is a name, not defining
   vocabulary; the pupil holds it in Greek. Names are now listed in the report so
   the teacher can see which anchors an entry leans on.
3. **Comparative bug fixed**: "bigger" stemmed to "bigg" and was flagged. Doubled
   consonants before *-er/-est* are now handled.
4. `wordlist_elt_core_extra.txt` extended with A1-A2 words the web-frequency proxy
   under-rates: dig, suddenly, soft, thousand, magic, climb, energy.

Under the loosened calibration the **book app's current definitions still score 6/35**,
so the verdict is not an artefact of a strict gate.

Known weakness, for a later pass: the frequency proxy is a web-derived list, not a
CEFR-graded one. The right reference is the Oxford 3000/5000 by CEFR level (A1-B2),
which is published as a word list. Swapping it in would let the check say "B1 word in
an A2 definition" instead of "rank 2645", and would remove most of the manual
whitelisting. A word list is data, not expression, so using it as a reference raises
none of the issues in the rights section above.

---

# Adopted, 20 Sep 2026, 22:00

Applied in Antigravity by Gemini, from `unit1/TASK_definitions_v2.md`:

- All 35 `definition_en` fields replaced from `proposed_definitions_A2_v2.json`.
- Item 29 `race`, teacher's decision: "a large group of people whose families come
  from the same part of the world", with a `teacher_notes` line recording that the
  pupils already know the running-race sense and that the book uses the word once,
  in "coming from different countries and races" (SB p.1).
- Item 32 headword corrected to `split (in two)` (ERRATA E10).
- Item 22's example replaced with "Ukraine has several nuclear power plants that make
  electricity." No other example sentence touched.
- Audio: 35 definition clips re-synthesised in both voice sets (Google 64 kbps,
  Edge `en-GB-SoniaNeural`) plus item 22's example clip, all with `.txt` sidecars.
  Word clips, the other 34 example clips, story narrations and the lab dialogue were
  deliberately not re-recorded: their text did not change.
- A pre-existing gap closed on the way: `assets/audio/defs/29_definition.txt` had
  never had a sidecar, so that clip's text was unverified.

Verification: `test_v2.js` 228/0, `verify_offline.js` all passed,
`test_unit.template.js 1` 123/0, all three data twins in sync, 70/70 definition
sidecars matching the data, and `check_definitions.py unit1` **35/35 clean, exit 0**.

Still open, deliberately: the other 34 example sentences (31 carry a word above A2).
A separate pass after classroom testing, because each one costs another recording.
