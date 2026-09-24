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
