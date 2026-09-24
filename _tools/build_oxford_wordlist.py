#!/usr/bin/env python3
"""
Turn the published Oxford 3000/5000 "by CEFR level" lists into the reference file
check_definitions.py reads: _tools/wordlist_oxford_cefr.txt, one "word<TAB>LEVEL"
line per entry, lowest level kept when a word appears more than once.

INPUT: put whatever you downloaded in _tools/source/ . Anything goes:
  - the OUP PDFs (The_Oxford_3000_by_CEFR_level.pdf, The_Oxford_5000_by_CEFR_level.pdf)
  - a .txt or .csv copy, one entry per line, level anywhere on the line

  python3 _tools/build_oxford_wordlist.py

PDFs are read with pdftotext (poppler) if available, else pypdf.

Why a word list and not the dictionary text: a list of words is data, and using it as
a reference raises none of the rights questions that copying definitions would. The
definitions in this project are written from scratch; the list only tells us which
words a pupil at a given CEFR level can be expected to have.
"""
import re
import subprocess
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
SRC = ROOT / "_tools" / "source"
OUT = ROOT / "_tools" / "wordlist_oxford_cefr.txt"
LEVELS = ("A1", "A2", "B1", "B2", "C1")
RANK = {lv: i for i, lv in enumerate(LEVELS)}

# "abandon v. B2", "able adj. B1", "a, an indefinite article A1", "get up phr v. A2"
ENTRY = re.compile(
    r"^\s*(?P<word>[A-Za-z][A-Za-z'’\-]*(?:\s+[a-z'’\-]+){0,3}?)"
    r"(?:\s*,\s*[A-Za-z'’\- ]+)?"              # "a, an"
    r"\s+(?:[a-z.]+\s+){0,3}"                   # pos abbreviations: v. adj. n. phr v.
    r"(?P<level>A1|A2|B1|B2|C1)\s*$"
)

POS_BOUNDARY = re.compile(
    r"\s+((?:(?:modal|auxiliary|indefinite|definite|phr)\s+)?"
    r"(?:n\.|v\.|adj\.|adv\.|prep\.|conj\.|det\.|pron\.|number|indefinite article|definite article|exclam\.|det\./|infinitive marker).*)$"
)


def pdf_text(path: Path) -> str:
    try:
        # Running pdftotext without -layout produces clean linear reading order for columned text
        return subprocess.run(["pdftotext", str(path), "-"],
                              capture_output=True, text=True, check=True).stdout
    except (FileNotFoundError, subprocess.CalledProcessError):
        pass
    try:
        from pypdf import PdfReader
        return "\n".join((p.extract_text() or "") for p in PdfReader(str(path)).pages)
    except Exception as exc:                                    # noqa: BLE001
        print(f"  cannot read {path.name}: {exc}", file=sys.stderr)
        return ""


def parse(text: str) -> dict[str, str]:
    found: dict[str, str] = {}
    raw_lines = [l.strip() for l in text.splitlines() if l.strip()]
    raw_lines = [l for l in raw_lines if not re.match(r"^\d+\s*/\s*\d+$", l)]

    # Check if text contains section headers (A1, A2, B1, B2, C1)
    has_section_headers = any(l in LEVELS for l in raw_lines)

    if has_section_headers:
        # Merge wrapped lines (e.g. POS continuation across lines)
        lines = []
        for l in raw_lines:
            if lines and (lines[-1].endswith((",", "/")) or (lines[-1].endswith("det.") and l in ("adj.", "number", "n.", "v.", "adv.")) or l in ("adj.", "number", "n.", "v.", "adv.")):
                lines[-1] = lines[-1] + " " + l
            else:
                lines.append(l)

        cur_level = None
        for line in lines:
            if line in LEVELS:
                cur_level = line
                continue
            if not cur_level or "Oxford" in line or "learners" in line or "level." in line:
                continue
            m = POS_BOUNDARY.search(line)
            if not m:
                continue
            raw_word = line[:m.start()].strip()
            clean = re.sub(r"\s*\([^)]*\)", "", raw_word).strip()
            words = [w.strip() for w in clean.split(",")]
            for w in words:
                w = re.sub(r"\d+$", "", w).strip().lower().replace("’", "'")
                if not w or not re.match(r"^[a-z][a-z'\-\s]*$", w):
                    continue
                if w not in found or RANK[cur_level] < RANK[found[w]]:
                    found[w] = cur_level
    else:
        # Fallback to per-line level matching
        for raw in text.splitlines():
            for chunk in re.split(r"\s{3,}|\t", raw):
                m = ENTRY.match(chunk.strip())
                if not m:
                    continue
                word = m.group("word").strip().lower().replace("’", "'")
                level = m.group("level")
                if word in found and RANK[found[word]] <= RANK[level]:
                    continue
                found[word] = level

    return found


def main() -> int:
    src_dir = SRC if (SRC.exists() and any(SRC.glob("*"))) else ROOT / "_tools"
    if not src_dir.exists():
        print(f"Create {SRC} and put the downloaded list(s) in it.", file=sys.stderr)
        return 2
    files = [p for p in sorted(src_dir.iterdir())
             if p.suffix.lower() in (".pdf", ".txt", ".csv", ".tsv") and not p.name.startswith("wordlist_")]
    if not files:
        print(f"No .pdf/.txt/.csv found in {src_dir}", file=sys.stderr)
        return 2

    merged: dict[str, str] = {}
    for f in files:
        text = pdf_text(f) if f.suffix.lower() == ".pdf" else f.read_text(
            encoding="utf-8", errors="replace")
        got = parse(text)
        print(f"  {f.name}: {len(got)} entries")
        for w, lv in got.items():
            if w not in merged or RANK[lv] < RANK[merged[w]]:
                merged[w] = lv

    if len(merged) < 500:
        print(f"Only {len(merged)} entries parsed; the input format is probably not "
              f"what the parser expects. Inspect it before trusting the result.",
              file=sys.stderr)

    lines = [f"# Oxford 3000/5000 by CEFR level, parsed from {', '.join(f.name for f in files)}",
             "# word<TAB>level. Word list used as a reference only; no dictionary text is copied.",
             f"# {len(merged)} entries"]
    lines += [f"{w}\t{lv}" for w, lv in sorted(merged.items())]
    OUT.write_text("\n".join(lines) + "\n", encoding="utf-8")
    counts = {lv: sum(1 for v in merged.values() if v == lv) for lv in LEVELS}
    print(f"wrote {OUT} : {len(merged)} words  " +
          "  ".join(f"{lv}={counts[lv]}" for lv in LEVELS))
    return 0


if __name__ == "__main__":
    sys.exit(main())
