#!/usr/bin/env python3
"""
Check that vocabulary definitions use a controlled defining vocabulary.

A definition must be easier than the word it explains. This script measures that
offline, against three references, in order of authority:

  1. A CEFR-graded word list, if present: _tools/wordlist_oxford_cefr.txt
     ("word<TAB>A1".. built by _tools/build_oxford_wordlist.py). A word is easy when
     its level is at or below --level (default a2). This is the reference that lets
     the report say "B1 word in an A2 definition" instead of "rank 2645".
  2. The books' own vocabulary: every word in the Appendix V lists of all ten Grade 6
     units (unit*/source/02_vocabulary_list.txt) plus every word in this unit's own
     Pupil's Book and Workbook pages. Words the pupils have met or will meet count as
     available whatever their CEFR level: the book is the syllabus.
  3. A general frequency list (_tools/wordlist_top3000.txt), used only for words the
     graded list does not contain, plus the teacher-editable
     _tools/wordlist_elt_core_extra.txt.

A word is FLAGGED when no reference clears it. Inflections are resolved by suffix
stripping, so "flowing" counts as "flow" and "bigger" as "big". Capitalised words
that are not sentence-initial are treated as proper names (Mount Olympus, Thessaly,
the Argonauts): reported, never flagged, because the pupil holds them in Greek.

Also reported: definitions over MAX_WORDS, circular definitions (the headword or a
hard part of it reused), and definitions that lean on another target word from the
same unit (the pupil would need two unknown words to understand one).

Usage, from the "vocabulary st" folder:
    python3 _tools/check_definitions.py unit1
    python3 _tools/check_definitions.py unit1 --level a2 --json report.json
    python3 _tools/check_definitions.py unit1 --defs unit1/proposed_definitions.json
    python3 _tools/check_definitions.py unit1 --field example    # check the examples

Exit code 1 if any definition is flagged, so it can gate a build.
"""
import argparse
import json
import re
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
MAX_WORDS = 18          # learner dictionaries run to 16-18 words at A1 (Cambridge's
                        # A1 entry for "river" is 16). Length is the weak signal;
                        # hard words are the strong one.
EASY_BAND = 2000        # frequency-list fallback: rank still considered easy
LEVELS = ["a1", "a2", "b1", "b2", "c1"]

# Grammar words are never the difficulty in a definition.
FUNCTION_WORDS = set("""a an the of to in on at for and or but if as by be is are am was were
do does did can could will would have has had it its this that these those there here
you your they them their we our i my he she his her him not no nor so than then when
where which who whom whose what why how all any both each every few more most other
another some such only own same very just like into onto from with without about over
under near next along almost between through during before after above below up down
out off again also too much many two one first second thing things something someone
everything everyone people place places part parts kind sort way ways""".split())


def suffix_variants(w: str) -> set[str]:
    """Candidate base forms, generously: holes->hole, copied->copy, running->run, bigger->big."""
    w = w.lower().strip("'")
    out = {w}
    if w.endswith("ies") and len(w) > 4:
        out.add(w[:-3] + "y")
    if w.endswith("ied") and len(w) > 4:
        out.add(w[:-3] + "y")
    if w.endswith("es") and len(w) > 3:
        out |= {w[:-1], w[:-2]}
    if w.endswith("s") and len(w) > 2:
        out.add(w[:-1])
    if w.endswith("ed") and len(w) > 3:
        out |= {w[:-1], w[:-2]}
    if w.endswith("ing") and len(w) > 4:
        out |= {w[:-3], w[:-3] + "e"}
    if len(w) > 5 and w[-4] == w[-5] and w.endswith(("ing", "ed")):
        out.add(w[:-4])                                  # running -> run
    for pat in (r"ly$", r"er$", r"est$"):
        base = re.sub(pat, "", w)
        out.add(base)
        if len(base) > 2 and base[-1] == base[-2]:       # bigger -> bigg -> big
            out.add(base[:-1])
    if w.endswith("'s"):
        out.add(w[:-2])
    return {v for v in out if v}


def load_extra_core() -> set[str]:
    """Everyday A1-A2 words a web-frequency list under-rates. Teacher-editable."""
    path = ROOT / "_tools" / "wordlist_elt_core_extra.txt"
    if not path.exists():
        return set()
    text = "\n".join(ln for ln in path.read_text(encoding="utf-8").splitlines()
                     if not ln.startswith("#"))
    return set(re.findall(r"[a-z']+", text.lower()))


def load_cefr() -> dict[str, str]:
    """word -> 'a1'..'c1' from the graded list, if the teacher has built it."""
    path = ROOT / "_tools" / "wordlist_oxford_cefr.txt"
    if not path.exists():
        return {}
    out: dict[str, str] = {}
    for line in path.read_text(encoding="utf-8").splitlines():
        if not line.strip() or line.startswith("#"):
            continue
        parts = re.split(r"[\t,;]|\s{2,}", line.strip())
        if len(parts) < 2:
            parts = line.strip().rsplit(None, 1)
        if len(parts) < 2:
            continue
        word, level = parts[0].strip().lower(), parts[-1].strip().lower()
        if level not in LEVELS or " " in word:
            continue
        if word not in out or LEVELS.index(level) < LEVELS.index(out[word]):
            out[word] = level
    return out


def load_frequency() -> dict[str, int]:
    path = ROOT / "_tools" / "wordlist_top3000.txt"
    if not path.exists():
        return {}
    words = [ln.strip().lower() for ln in path.read_text(encoding="utf-8").splitlines()
             if ln.strip() and not ln.startswith("#")]
    return {w: i + 1 for i, w in enumerate(words)}


class Reference:
    """The three references, consulted in order, with a reason for every verdict."""

    def __init__(self, known: set[str], cefr: dict[str, str], freq: dict[str, int],
                 max_level: str):
        self.known, self.cefr, self.freq = known, cefr, freq
        self.max_level = max_level
        self.cap = LEVELS.index(max_level)

    def verdict(self, word: str) -> tuple[bool, str]:
        """(easy?, reason). Reason is shown in the report when the word is flagged."""
        if word.lower() in FUNCTION_WORDS:
            return True, "grammar word"
        variants = suffix_variants(word)
        if variants & self.known:
            return True, "in the books"
        levels = [self.cefr[v] for v in variants if v in self.cefr]
        if levels:
            best = min(levels, key=LEVELS.index)
            return (LEVELS.index(best) <= self.cap), best.upper()
        rank = min([self.freq[v] for v in variants if v in self.freq], default=None)
        if rank is not None:
            return rank <= EASY_BAND, f"rank {rank}"
        return False, "not in any list"

    def easy(self, word: str) -> bool:
        return self.verdict(word)[0]


def load_book_words(unit_dir: Path) -> set[str]:
    known: set[str] = set()
    for p in sorted(ROOT.glob("unit*/source/02_vocabulary_list.txt")):
        for line in p.read_text(encoding="utf-8").splitlines():
            if line.startswith("-----"):
                break
            if line.startswith(("=", "SOURCE", "NOTE")):
                continue
            known |= set(re.findall(r"[a-z']+", line.lower()))
    for name in ("10_SB_unit.txt", "20_WB_unit.txt"):
        f = unit_dir / "source" / name
        if f.exists():
            known |= set(re.findall(r"[a-z']+", f.read_text(encoding="utf-8").lower()))
    return known


def check(unit: str, defs_override: Path | None = None, field: str = "definition_en",
          max_level: str = "a2") -> tuple[list[dict], dict]:
    unit_dir = ROOT / unit
    vocab = json.loads((unit_dir / "data" / "vocabulary_data.json").read_text(encoding="utf-8"))
    if defs_override:
        override = json.loads(defs_override.read_text(encoding="utf-8"))
        by_id = ({int(k): v for k, v in override.items()} if isinstance(override, dict)
                 else {int(d["id"]): d[field] for d in override})
        for item in vocab:
            if item["id"] in by_id:
                item[field] = by_id[item["id"]]

    ref = Reference(load_book_words(unit_dir) | load_extra_core(),
                    load_cefr(), load_frequency(), max_level)

    single_targets, phrase_targets = {}, []
    for item in vocab:
        parts = re.findall(r"[a-z']+", item["word"].lower())
        (single_targets.__setitem__(parts[0], item["word"]) if len(parts) == 1
         else phrase_targets.append((" ".join(parts), item["word"])))

    results = []
    for item in vocab:
        text = item.get(field, "")
        tokens = re.findall(r"[A-Za-z']+", text)
        head_stems = {v for w in re.findall(r"[a-z']+", item["word"].lower())
                      for v in suffix_variants(w)}

        flagged, names, other_targets = [], [], []
        for pos, tok in enumerate(tokens):
            if tok.lower() in FUNCTION_WORDS:
                continue
            # A capitalised word that is not sentence-initial is a proper name
            # (Mount Olympus, Thessaly, the Argonauts). Reported, never flagged.
            if pos > 0 and tok[:1].isupper():
                names.append(tok)
                continue
            ok, reason = ref.verdict(tok)
            if not ok:
                flagged.append({"word": tok, "reason": reason})
        low = " ".join(t.lower() for t in tokens)
        for tok in tokens:
            for v in suffix_variants(tok):
                if (v in single_targets and v not in head_stems and len(v) > 3
                        and not ref.easy(v)):
                    other_targets.append(single_targets[v])
        for phrase, label in phrase_targets:
            if (label.lower() != item["word"].lower()
                    and re.search(rf"\b{re.escape(phrase)}\b", low)
                    and not all(ref.easy(p) for p in phrase.split())):
                other_targets.append(label)
        # Repeating an EASY element of a compound headword is normal in learner
        # dictionaries ("coal" in "coal mines"); repeating a hard element is not.
        repeated = {v for tok in tokens for v in suffix_variants(tok) if len(v) > 3} & head_stems
        circular = any(not ref.easy(v) for v in repeated)

        results.append({
            "id": item["id"], "word": item["word"], "text": text,
            "length": len(tokens), "too_long": len(tokens) > MAX_WORDS,
            "flagged": flagged, "names": sorted(set(names)),
            "circular": circular,
            "repeats_easy_element": sorted(v for v in repeated if ref.easy(v)),
            "uses_other_target_words": sorted(set(other_targets)),
            "ok": not flagged and len(tokens) <= MAX_WORDS and not circular
                  and not other_targets,
        })

    summary = {
        "unit": unit, "field": field, "level": max_level, "items": len(results),
        "clean": sum(1 for r in results if r["ok"]),
        "with_hard_words": sum(1 for r in results if r["flagged"]),
        "too_long": sum(1 for r in results if r["too_long"]),
        "circular": sum(1 for r in results if r["circular"]),
        "using_other_targets": sum(1 for r in results if r["uses_other_target_words"]),
        "avg_length": round(sum(r["length"] for r in results) / max(len(results), 1), 1),
        "book_word_forms": len(ref.known), "cefr_entries": len(ref.cefr),
    }
    return results, summary


def main() -> int:
    ap = argparse.ArgumentParser()
    ap.add_argument("unit", nargs="*", help="unit folder(s), e.g. unit1. "
                                           "Omit to check every unit present.")
    ap.add_argument("--json", help="write the full report to this file")
    ap.add_argument("--defs", help="JSON of proposed texts to check instead ({id: text})")
    ap.add_argument("--field", default="definition_en",
                    help="vocabulary field to check (definition_en, example)")
    ap.add_argument("--level", default="a2", choices=LEVELS,
                    help="highest CEFR level allowed in a definition (default a2)")
    args = ap.parse_args()

    units = args.unit or sorted(
        (d.name for d in ROOT.glob("unit*") if (d / "data" / "vocabulary_data.json").exists()),
        key=lambda n: int(re.sub(r"\D", "", n) or 0))
    if not units:
        print("No unit folder with data/vocabulary_data.json found. Run this from the "
              "\"vocabulary st\" folder, or name a unit: check_definitions.py unit1",
              file=sys.stderr)
        return 2
    if args.defs and len(units) > 1:
        print("--defs applies to one unit; name it: check_definitions.py unit1 --defs ...",
              file=sys.stderr)
        return 2

    failed = 0
    for unit in units:
        failed += report(unit, args)
    if len(units) > 1:
        print(f"\n=== {len(units)} units checked, {failed} with problems ===")
    return 1 if failed else 0


def report(unit: str, args) -> int:
    results, summary = check(unit, Path(args.defs) if args.defs else None,
                             args.field, args.level)
    print(f"=== Defining-vocabulary check: {summary['unit']}, field '{summary['field']}', "
          f"level {summary['level'].upper()} ===")
    print(f"{summary['items']} entries, {summary['clean']} clean, "
          f"average {summary['avg_length']} words (limit {MAX_WORDS})")
    print(f"hard words: {summary['with_hard_words']} | too long: {summary['too_long']} | "
          f"circular: {summary['circular']} | using other target words: "
          f"{summary['using_other_targets']}")
    ref_note = (f"{summary['cefr_entries']} CEFR-graded words" if summary["cefr_entries"]
                else f"NO graded list (run build_oxford_wordlist.py); "
                     f"frequency fallback, top {EASY_BAND}")
    print(f"(reference: {summary['book_word_forms']} word forms from the books + {ref_note})\n")

    for r in sorted(results, key=lambda r: (r["ok"], -len(r["flagged"]))):
        if r["ok"]:
            continue
        notes = []
        if r["flagged"]:
            notes.append("hard: " + ", ".join(f"{f['word']}({f['reason']})" for f in r["flagged"]))
        if r["too_long"]:
            notes.append(f"{r['length']} words")
        if r["circular"]:
            notes.append("circular")
        if r["uses_other_target_words"]:
            notes.append("uses target words: " + ", ".join(r["uses_other_target_words"]))
        if r["names"]:
            notes.append("names: " + ", ".join(r["names"]))
        print(f"  {r['id']:>3} {r['word']:<20} {' | '.join(notes)}")
        print(f"      \"{r['text']}\"")

    if args.json:
        Path(args.json).write_text(
            json.dumps({"summary": summary, "results": results}, indent=1, ensure_ascii=False),
            encoding="utf-8")
        print(f"\nreport written to {args.json}")

    return 1 if summary["clean"] < summary["items"] else 0


if __name__ == "__main__":
    sys.exit(main())
