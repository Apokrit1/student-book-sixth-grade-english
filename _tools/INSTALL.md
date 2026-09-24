# Defining-vocabulary bundle

Four files. Copy them into `C:\photodentro\antigravity\vocabulary st\`, keeping the
folders, then do the two steps below.

```
_tools\check_definitions.py                  <- replaces the existing one (keep your .bak)
_tools\build_oxford_wordlist.py              <- new
.agents\skills\coursebook-unit-extender\references\defining_vocabulary.md   <- new
apply_defining_vocabulary_patch.py           <- run once from "vocabulary st", then delete
```

## 1. The word lists (yours)

Download these two PDFs and put them in a new folder `_tools\source\`:

- The Oxford 3000 by CEFR level
  https://www.oxfordlearnersdictionaries.com/external/pdf/wordlists/oxford-3000-5000/The_Oxford_3000_by_CEFR_level.pdf
- The Oxford 5000 by CEFR level
  (same folder on that site; the 5000 adds B2-C1, useful because it lets the report
  say "B2" instead of "not in any list")

Then, from `vocabulary st`:

```
python3 _tools\build_oxford_wordlist.py
```

It prints how many words it parsed per level and writes
`_tools\wordlist_oxford_cefr.txt`. If it warns that too few entries were parsed, send
me the first 30 lines of `pdftotext -layout` output for one of the PDFs and I will
adjust the parser. Any other source works too: a .txt or .csv with one entry per line
and the level at the end of the line.

Nothing breaks if you skip this: the checker falls back to the frequency list and says
so in its header. You just get "rank 2645" instead of "B1".

## 2. The skill

From `vocabulary st`:

```
python3 apply_defining_vocabulary_patch.py
python3 apply_defining_vocabulary_patch.py --skill ~/.gemini/config/skills/coursebook-unit-extender
```

It adds the rule to Step 2, the gate to Step 10, and the reference to the references
list. It keeps a `.bak`, is safe to run twice, and if it cannot find an anchor it
changes nothing and tells you which block to paste by hand.

## 3. Check it works

```
python3 _tools\check_definitions.py unit1
python3 _tools\check_definitions.py unit1 --defs unit1\proposed_definitions_A2_v2.json
python3 _tools\check_definitions.py unit1 --field example
```

The first should still report the app's current definitions as failing (6/35 before
the graded list; expect the same order of magnitude after, with B1/B2/C1 labels
instead of ranks). The second should report 35/35 and exit 0.

## What changed in check_definitions.py

- Reads `_tools/wordlist_oxford_cefr.txt` when present and reports the CEFR level of
  each offending word. The book's own Appendix V vocabulary still overrides the graded
  list: the book is the syllabus.
- `--level` (default a2) sets the ceiling, `--field` lets it check `example` as well
  as `definition_en`.
- Word ceiling 12 -> 18. Cambridge's A1 entry for *river* is 16 words; length was the
  wrong constraint.
- Proper names (capitalised, not sentence-initial) are listed, not flagged.
- Stemming bug fixed: "bigger" was becoming "bigg".
