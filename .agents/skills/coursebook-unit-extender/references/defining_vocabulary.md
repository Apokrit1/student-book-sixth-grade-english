# Defining vocabulary: how definitions are written in this project

Reference for `SKILL.md`, section "Defining Vocabulary". Applies to every unit's
vocabulary module, to Step 5's definition clues, and to any other place the app
explains a word to a pupil (hints, word banks, "Book check" notes, worksheet
glossaries).

The principle is the one learner dictionaries are built on: **a definition must be
easier than the word it explains.** If the pupil has to decode the definition, the
activity has moved the problem, not solved it. Longman writes LDOCE inside a defining
vocabulary of about 2000 words, Oxford's OALD inside about 3000. This project does
the same thing with its own lists.

## The rules, in priority order

1. **Every word in a definition must be one the pupil can be expected to have.**
   The only hard rule; the checker enforces it. That means: a grammar word, a word at
   or below the unit's CEFR level in `_tools/wordlist_oxford_cefr.txt`, or a word from
   any of the ten units' Appendix V lists. The book's own vocabulary always counts,
   whatever level a graded list gives it: the book is the syllabus.
2. **The definition must build a picture, not just fence off a meaning.** Prefer one
   concrete, distinguishing feature the pupil can see in the mind over a formal
   genus-and-differentia gloss. "a large natural elevation of the earth's surface" is
   precise and useless.
3. **Anchor visual or abstract items to a referent the class already owns.**
   "like Mount Olympus", "like the plain of Thessaly", "in the story of Jason and the
   Argonauts". A commercial dictionary cannot do this, because it does not know its
   reader. A national coursebook does. It also keeps the vocabulary module inside the
   unit's own subject matter instead of floating free of it.
4. **Readable beats exact.** Each entry also carries `meaning_gr`, and in many Greek
   classrooms vocabulary at this level is taught through the Greek equivalent alone.
   The Greek gloss is the safety net for meaning, so the English definition's job is
   to be processable English input, not an airtight gloss. Where precision and
   readability conflict at A2, choose readability and let the Greek carry the rest.
   **The one thing never traded is truth**: a simplification that states something
   false is a book error of the kind ERRATA.md exists for (see the tsunami entries).
   Simplify the picture, never the fact.
5. **No definition may lean on another target word from the same unit.** Two unknowns
   to understand one.
6. **Length is a weak signal.** The ceiling is 18 words. Professional A1 definitions
   are not short, they are easy: Cambridge's A1 entry for *river* runs to sixteen
   words. Do not chase a low word count; a telegraphic gloss is a different failure
   mode, and it teaches nothing.

## Consulting published learner dictionaries

**Permitted and encouraged, for method. Not for text.**

- The controlled-defining-vocabulary technique is published lexicographic practice and
  is owned by nobody. Read Cambridge, Oxford, Longman and COBUILD entries to calibrate
  register, shape and level, then write our own.
- **Do not copy their wording into the app.** A set of copied definitions is a taking
  of protected expression and of the dictionary's compilation. Attribution answers
  plagiarism; it does not answer copyright.
- The Greek teaching exception is narrower than it sounds. Law 2121/1993 art. 21
  permits reproducing short extracts "exclusively for teaching or examination purposes
  at an educational establishment", to an extent commensurate with that purpose, with
  the source named, and on condition that it does not interfere with normal
  exploitation of the work; art. 19 permits short attributed quotations in support of
  an argument. Projecting a dictionary entry in class to compare definitions is inside
  that. A distributed app whose vocabulary module *is* a dictionary's definitions
  substitutes for the dictionary and is not. Non-commercial intent helps; it does not
  decide.
- A dictionary entry may appear in the app **only** as a marked, attributed quotation
  where the comparison itself is the teaching point (a teacher note, an errata entry),
  never as the app's own text.
- **Word lists are different.** A list of words is data. Using the Oxford 3000/5000 by
  CEFR level as the reference for rule 1 raises none of the above.

## The reference lists

`_tools/` holds three files.

| file | what it is | how to get it |
|---|---|---|
| `wordlist_oxford_cefr.txt` | word -> A1..C1, the authority for rule 1 (4952 entries as built 20 Sep 2026) | `python3 _tools/build_oxford_wordlist.py` over the OUP "by CEFR level" PDFs in `_tools/source/` |
| `wordlist_top3000.txt` | web frequency list, fallback for words the graded list lacks | present |
| `wordlist_elt_core_extra.txt` | the teacher's own additions: words a class demonstrably has | edited by hand |

## The check

```
python3 _tools/check_definitions.py                       # every unit built so far
python3 _tools/check_definitions.py unit<N>               # definitions, level A2
python3 _tools/check_definitions.py unit<N> --field example
python3 _tools/check_definitions.py unit<N> --defs unit<N>/proposed_definitions.json
```

Exit 0 is required before a unit is declared finished. The report names the offending
word and why: `eager(C1)`, `ethnic(B2)`, `surface(B1)`, `rank 2645`, `not in any list`.
Proper names are listed, not flagged.

**Do not make a definition pass by editing the word lists.** Adding a word to
`wordlist_elt_core_extra.txt` is a claim that the class has that word; that is the
teacher's claim to make, not the agent's. If a flag looks wrong, write it in
BUILD_NOTES.md and ask.

## Worked pairs from Unit 1

| word | dictionary-style gloss (rejected) | telegraphic gloss (also rejected) | adopted |
|---|---|---|---|
| mountain | a large natural elevation of the earth's surface rising abruptly | a very high hill of rock | a very high piece of land, much bigger than a hill, like Mount Olympus |
| river | a large natural stream of water flowing in a channel to the sea or a lake | a lot of water that runs to the sea or a lake | water that flows in a long line across the land to the sea or a lake |
| plain | a large area of flat land with few trees | (as before) | a large flat area of land where farmers grow food, like the plain of Thessaly |
| molecule | a group of atoms bonded together, representing the smallest unit of a compound | a very small part of something, made of atoms | the smallest piece of water, air or anything else; it is made of atoms |
| nuclear power plant | a thermal power station in which the heat source is a nuclear reactor | a big station that makes electricity from atoms | a place that makes electricity from the energy inside atoms |
| underwater | situated, occurring, or done beneath the surface of the water | under the top of the sea or a lake | under the top of the water, in a sea, a lake or a river |
| outgoing | friendly, sociable, and eager to talk to people | friendly and happy to talk to new people | someone who likes meeting and talking to new people |

The middle column is the failure mode to watch for in your own output: it passes a
word-count gate and teaches nothing.

## Example sentences

Looser rules, because an example is context rather than explanation:

- at most **one** word above the unit's level, and not one from the headword's own
  semantic field (an example for *oil well* may not introduce *petroleum*);
- 12 words or fewer;
- no editorial claim. "The nuclear power plant produces massive amounts of clean
  electricity" is an opinion, in a unit whose Ukraine material is about Chernobyl.
  Examples state facts or describe actions.

## Two content traps the checker cannot catch

- **Homonyms.** One entry, one sense, and the sense the unit uses. Unit 1's `race` was
  built as "a group of people sharing ethnic heritage, or a running competition": two
  senses in one gloss, in a unit called *Our Multicultural Class*. Where a word's other
  sense is the one the pupils know, put that in a teacher note rather than cramming
  both into the definition.
- **Sensitive categories.** For words like `race`, the wording is a teaching decision,
  not a lexicographic one. Draft it, flag it, ask the teacher.
