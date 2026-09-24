#!/usr/bin/env python3
"""
Add the defining-vocabulary rule to the coursebook-unit-extender skill.

Run from the "vocabulary st" folder, after copying the four files of this bundle
into place:

    _tools/check_definitions.py                       (replaces the existing one)
    _tools/build_oxford_wordlist.py                   (new)
    .agents/skills/coursebook-unit-extender/references/defining_vocabulary.md  (new)
    apply_defining_vocabulary_patch.py                (this file, delete after use)

    python3 apply_defining_vocabulary_patch.py
    python3 apply_defining_vocabulary_patch.py --skill ~/.gemini/config/skills/coursebook-unit-extender

It edits SKILL.md in three places, keeps a .bak, is safe to run twice, and refuses
to guess: if an anchor is missing it prints what it looked for and changes nothing.
"""
import argparse
import re
import shutil
import sys
from pathlib import Path

STEP2_BLOCK = """
- **Definitions use a controlled defining vocabulary.** A definition must be easier
  than the word it explains. Every word in it must be a grammar word, at or below the
  unit's CEFR level in `_tools/wordlist_oxford_cefr.txt`, or a word from any unit's
  Appendix V list. Ceiling 18 words. One sense per entry, and the sense the unit uses.
  No definition may use another target word from the same unit. Do not chase a low
  word count: a definition must build a picture, not just fence off a meaning, and
  professional A1 definitions run to 16 words. Anchor visual or abstract items to a
  referent the class already owns ("like Mount Olympus", "like the plain of
  Thessaly"). Each entry also carries `meaning_gr`, so where precision and
  readability conflict at A2, choose readability - but never state something false to
  make it simple. Example sentences: 12 words maximum, at most one word above level,
  no editorial claims. Read `references/defining_vocabulary.md` before writing any
  definition, hint or glossary text; it carries the worked pairs and the rights rule
  for consulting published learner dictionaries (method yes, their wording no).
"""

STEP10_BLOCK = """
- `python3 _tools/check_definitions.py unit<N>` must exit 0. It flags any definition
  containing a word above the unit's level, over 18 words, circular, or leaning on
  another target word. Fix the definition; do not add words to the teacher's word
  lists to make a flag go away (see `references/defining_vocabulary.md`).
"""

REF_LINE = ("- `references/defining_vocabulary.md` - how definitions are written: "
            "controlled defining vocabulary, the word lists, the checker, and what may "
            "be taken from published learner dictionaries\n")


def find_anchor(text: str, patterns: list[str]) -> re.Match | None:
    for p in patterns:
        m = re.search(p, text, re.IGNORECASE | re.MULTILINE)
        if m:
            return m
    return None


def insert_after_section(text: str, heading_patterns: list[str], block: str,
                         label: str) -> tuple[str, str]:
    """Insert block at the end of the section whose heading matches, before the next heading."""
    m = find_anchor(text, heading_patterns)
    if not m:
        return text, f"NOT FOUND: {label} (looked for {heading_patterns[0]!r})"
    start = m.end()
    nxt = re.search(r"^#{1,4}\s", text[start:], re.MULTILINE)
    end = start + (nxt.start() if nxt else len(text[start:]))
    return text[:end].rstrip() + "\n" + block + "\n" + text[end:], f"ok: {label}"


def main() -> int:
    ap = argparse.ArgumentParser()
    ap.add_argument("--skill", default=".agents/skills/coursebook-unit-extender",
                    help="path to the skill folder")
    args = ap.parse_args()

    skill_dir = Path(args.skill).expanduser()
    skill = skill_dir / "SKILL.md"
    if not skill.exists():
        print(f"no SKILL.md at {skill}", file=sys.stderr)
        return 2
    ref = skill_dir / "references" / "defining_vocabulary.md"
    if not ref.exists():
        print(f"copy defining_vocabulary.md into {ref.parent} first", file=sys.stderr)
        return 2

    text = original = skill.read_text(encoding="utf-8")
    log = []

    if "controlled defining vocabulary" in text:
        print("SKILL.md already mentions the controlled defining vocabulary; "
              "nothing to do.")
        return 0

    text, msg = insert_after_section(
        text, [r"^#{1,4}.*\bStep\s*2\b.*$", r"^#{1,4}.*content rules.*$"],
        STEP2_BLOCK, "Step 2 content rules")
    log.append(msg)

    text, msg = insert_after_section(
        text, [r"^#{1,4}.*\bStep\s*10\b.*$", r"^#{1,4}.*\btests?\b.*$"],
        STEP10_BLOCK, "Step 10 tests")
    log.append(msg)

    m = find_anchor(text, [r"^- +`references/[^`]+`.*$"])
    if m:
        # append after the last references bullet
        last = None
        for mm in re.finditer(r"^- +`references/[^`]+`.*$", text, re.MULTILINE):
            last = mm
        text = text[:last.end()] + "\n" + REF_LINE.rstrip() + text[last.end():]
        log.append("ok: references list")
    else:
        log.append("NOT FOUND: references list (add REF_LINE by hand)")

    for line in log:
        print("  " + line)
    if any(l.startswith("NOT FOUND") for l in log):
        print("\nNothing written. Insert the blocks by hand, or fix the anchors.",
              file=sys.stderr)
        return 1

    shutil.copy2(skill, skill.with_suffix(".md.bak"))
    skill.write_text(text, encoding="utf-8")
    print(f"\npatched {skill} ({len(original)} -> {len(text)} bytes), backup at "
          f"{skill.with_suffix('.md.bak').name}")
    return 0


if __name__ == "__main__":
    sys.exit(main())
