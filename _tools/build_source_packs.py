#!/usr/bin/env python3
"""
Build per-unit SOURCE PACKS for the English 6th Grade coursebook (Units 1-10).

Run from anywhere:
    python3 "vocabulary st/_tools/build_source_packs.py"

Needs: pdftotext (poppler). Pure standard library otherwise.

What it produces
----------------
vocabulary st/
  unitN/source/                      one self-contained pack per unit
    00_MANIFEST.md                   what is here, page ranges, shared files that apply
    01_syllabus.txt                  the unit's row of the Pupil's Book Table of Contents
    02_vocabulary_list.txt           the unit's official word list (Appendix V), one per line
    10_SB_unit.txt                   Pupil's Book unit pages (existing layout extraction)
    11_SB_its_your_choice.txt        Appendix I, differentiated tasks for this unit
    12_SB_resource_materials.txt     Appendix II, resources for this unit (may be empty)
    13_SB_grammar_file.txt           Appendix III, grammar summary for this unit
    20_WB_unit.txt                   Workbook (Activity Book) unit pages
    30_TB_unit.txt                   Teacher's Book unit guide, incl. recording scripts and keys
    31_TB_its_your_choice_key.txt    Teacher's Book keys to Appendix I for this unit
    32_TB_extra_activities.txt       Teacher's Book extra activities tagged for this unit
  _shared_source/                    material that spans units (reviews, tests, methodology)

Design rules
------------
* Source text is copied or extracted, never rewritten. Book errors stay as printed;
  known ones are listed in the manifest so the build agent can correct them visibly.
* Teacher's Book is extracted in reading order (not -layout): its pages are two-column
  and -layout interleaves the columns.
* Re-running is safe: every output file is regenerated from the PDFs / text folders.
"""
import re
import subprocess
import sys
from pathlib import Path
from xml.etree import ElementTree as ET

ROOT = Path(__file__).resolve().parent.parent          # .../vocabulary st
TEXT_SB = ROOT / "text"
TEXT_WB = ROOT / "text_workbook"
SPLIT_SB = ROOT / "split"
TB_PDF = ROOT / "10-0149-01_Agglika_ST-Dimotikou_Vivlio-Ekpaideutikou.pdf"
SHARED = ROOT / "_shared_source"

UNITS = {
    1: "Our Multicultural Class",
    2: "Going Shopping",
    3: "Imaginary Creatures",
    4: "The History of the Aeroplane",
    5: "Travelling Through Time",
    6: "Me, Myself and My Future Job",
    7: "Share Your Experiences",
    8: "Blow Your Own Trumpet",
    9: "Earth Day Everyday",
    10: "Time for Fun",
}

# Teacher's Book: PDF page ranges of each unit guide (verified by heading search).
TB_UNIT_PAGES = {
    1: (16, 24), 2: (25, 32), 3: (33, 43), 4: (44, 52), 5: (53, 61),
    6: (62, 69), 7: (70, 78), 8: (79, 88), 9: (89, 96), 10: (97, 106),
}
TB_METHODOLOGY = (1, 15)
TB_ITS_YOUR_CHOICE_KEYS = (107, 113)
TB_EXTRA_ACTIVITIES = (114, 116)
TB_REVISION_TESTS = {"1-3": (117, 120), "4-6": (120, 123), "7-10": (123, 125)}

REVISION_GROUP = {u: ("1-3" if u <= 3 else "4-6" if u <= 6 else "7-10") for u in UNITS}
WB_REVIEW_GROUP = {u: ("1-5" if u <= 5 else "6-10") for u in UNITS}

# Printed errors in Appendix V (Vocabulary List). Keys are exactly as printed.
VOCAB_KNOWN_ISSUES = {
    "orge": "typo in book: ogre",
    "pair of snickers": "typo in book: pair of sneakers (Snickers is a chocolate bar)",
    "unit pice": "typo in book: unit price",
    "woolen": "US spelling; the book is British English elsewhere: woollen",
    "feeestyle": "typo in book: freestyle",
    "jwellery designer": "typo in book: jewellery designer",
    "hair dresser": "standard spelling: hairdresser",
    "instumental": "typo in book: instrumental",
    "perfomance": "typo in book: performance",
    "cheerfulhome": "two entries merged in print: cheerful / home (economics); check column",
    "dry cleanercause": "two entries merged in print: dry cleaner / cause",
    "weather forecaste": "typo in book: weather forecaster",
    "airhostess": "dated term: air hostess; modern usage is flight attendant",
    "pony tail": "standard spelling: ponytail",
    "nuclear power": "line wrap in print: the item is 'nuclear power plant' (next line 'plant')",
    "bell bottomed": "line wrap in print: 'bell-bottomed pants' (next line 'pants')",
}


def run_pdftotext(pdf: Path, first: int, last: int, layout: bool = False) -> str:
    args = ["pdftotext", "-enc", "UTF-8", "-f", str(first), "-l", str(last)]
    if layout:
        args.append("-layout")
    args += [str(pdf), "-"]
    return subprocess.run(args, capture_output=True, text=True, check=True).stdout


def tb_pages(first: int, last: int) -> str:
    """Teacher's Book pages in reading order, each with a page marker."""
    out = []
    for p in range(first, last + 1):
        txt = run_pdftotext(TB_PDF, p, p).replace("\f", "").strip()
        out.append(f"\n===== [Teacher's Book | PDF p.{p}] =====\n{txt}\n")
    return "".join(out)


def header(title: str, source: str, note: str = "") -> str:
    bar = "=" * 78
    extra = f"\nNOTE: {note}" if note else ""
    return f"{bar}\n{title}\nSOURCE: {source}{extra}\n{bar}\n"


def find_one(folder: Path, pattern: str) -> Path | None:
    hits = sorted(folder.glob(pattern))
    return hits[0] if hits else None


def split_by_unit_headers(text: str, pattern: str) -> dict[int, str]:
    """Split text into {unit: segment}. A segment runs from a matching header line to the
    next matching header line. Repeated headers for the same unit are concatenated."""
    rx = re.compile(pattern, re.I | re.M)
    marks = [(m.start(), int(m.group(1))) for m in rx.finditer(text)]
    parts: dict[int, list[str]] = {}
    for i, (pos, unit) in enumerate(marks):
        end = marks[i + 1][0] if i + 1 < len(marks) else len(text)
        parts.setdefault(unit, []).append(text[pos:end].strip())
    return {u: "\n\n----- (next segment for this unit) -----\n\n".join(v) for u, v in parts.items()}


# ---------------------------------------------------------------- vocabulary list
def vocabulary_from_bbox(xml_path: Path) -> dict[int, list[str]]:
    """Rebuild Appendix V columns from word bounding boxes.
    Reading order: page by page, column by column, top to bottom."""
    raw = xml_path.read_text(encoding="utf-8", errors="replace")
    raw = raw[raw.find("<doc>"): raw.rfind("</doc>") + len("</doc>")]
    doc = ET.fromstring(raw)
    sequence: list[str] = []
    for page in doc.iter("page"):
        height = float(page.get("height", "835"))
        words = [(float(w.get("xMin")), float(w.get("yMin")), (w.text or "").strip())
                 for w in page.iter("word")]
        # Drop the running header (appendix title) and footer (page title, print date).
        # Their words straddle several columns and would leak into unit lists.
        words = [w for w in words if w[2] and 0.15 * height < w[1] < 0.90 * height]
        # Column starts: x positions where many words begin.
        bins: dict[int, int] = {}
        for x, _, _ in words:
            bins[round(x / 4) * 4] = bins.get(round(x / 4) * 4, 0) + 1
        starts = sorted(x for x, n in bins.items() if n >= 8)
        merged: list[float] = []
        for s in starts:
            if not merged or s - merged[-1] > 30:
                merged.append(s)
        cols: dict[int, list] = {i: [] for i in range(len(merged))}
        for x, y, t in words:
            idx = max((i for i, s in enumerate(merged) if s <= x + 3), default=0)
            cols[idx].append((y, x, t))
        for i in range(len(merged)):
            lines: list[list] = []
            for y, x, t in sorted(cols[i]):
                if lines and abs(lines[-1][0] - y) < 3:
                    lines[-1][1].append((x, t))
                else:
                    lines.append([y, [(x, t)]])
            for _, ws in lines:
                sequence.append(" ".join(t for _, t in sorted(ws)))

    vocab: dict[int, list[str]] = {}
    current = None
    in_title = False
    skip = re.compile(r"(APPENDIX|PPENDIX|Vocabulary List|Pupil.s Book|indd|^\d+$|^[AV]$)")
    for line in sequence:
        line = line.strip()
        if not line or skip.search(line):
            continue
        m = re.fullmatch(r"UNIT\s+(\d+)", line)
        if m:
            current, in_title = int(m.group(1)), True
            vocab.setdefault(current, [])
            continue
        if current is None:
            continue
        if in_title and line.upper() == line:      # all-caps unit title lines
            continue
        in_title = False
        vocab[current].append(line)
    return vocab


# ---------------------------------------------------------------- syllabus (TOC)
def syllabus_blocks() -> dict[int, str]:
    fm = find_one(TEXT_SB, "00_FrontMatter*/00_FrontMatter*.txt")
    text = fm.read_text(encoding="utf-8")
    start = text.find("Table of Contents")
    toc = text[start:] if start >= 0 else text
    # The TOC ends where the book lists its appendices.
    end = re.search(r"^\s*Appendix\s+[IV]+\b", toc, re.M)
    if end:
        toc = toc[: end.start()]
    blocks = split_by_unit_headers(toc, r"^\s*UNIT\s+(\d+)\s*:")
    return blocks


def extra_activities_by_unit(text: str) -> dict[int, str]:
    """Extra Activities are numbered items whose heading ends with (UNIT n), (UNITS 1 OR 6) etc.
    Headings can wrap over several lines, so look ahead up to six lines for the tag,
    stopping early at the next numbered line."""
    lines = text.splitlines()
    starts = []
    for i, line in enumerate(lines):
        if re.match(r"^\s*\d+\.\s", line):
            window = [line]
            for nxt in lines[i + 1:i + 6]:
                if re.match(r"^\s*\d+\.\s", nxt):
                    break
                window.append(nxt)
            head = " ".join(window)
            tag = re.search(r"\(UNITS?\s*([^)]*)\)", head, re.I)
            if tag:
                units = [int(n) for n in re.findall(r"\d+", tag.group(1)) if 1 <= int(n) <= 10]
                starts.append((i, units))
    out: dict[int, list[str]] = {}
    for k, (i, units) in enumerate(starts):
        end = starts[k + 1][0] if k + 1 < len(starts) else len(lines)
        seg = "\n".join(lines[i:end]).strip()
        for u in units:
            out.setdefault(u, []).append(seg)
    return {u: "\n\n----- (next activity) -----\n\n".join(v) for u, v in out.items()}


# ---------------------------------------------------------------- main build
def main() -> int:
    for tool in ("pdftotext",):
        if subprocess.run(["which", tool], capture_output=True).returncode:
            print(f"ERROR: {tool} not found"); return 1
    if not TB_PDF.exists():
        print(f"ERROR: Teacher's Book PDF not found: {TB_PDF}"); return 1

    report = []

    # Appendices of the Pupil's Book, reading-order extraction from the split PDFs
    app1 = split_by_unit_headers(run_pdftotext(find_one(SPLIT_SB, "11_Appendix_I_*.pdf"), 1, 99),
                                 r"^\s*UNIT\s+(\d+)\b")
    app2 = split_by_unit_headers(run_pdftotext(find_one(SPLIT_SB, "12_Appendix_II_*.pdf"), 1, 99),
                                 r"^\s*UNIT\s+(\d+)\b")
    app3 = split_by_unit_headers(run_pdftotext(find_one(SPLIT_SB, "13_Appendix_III_*.pdf"), 1, 99),
                                 r"^\s*UNIT\s+(\d+)\b")
    vocab = vocabulary_from_bbox(find_one(TEXT_SB, "15_Appendix_V*/15_Appendix_V*.bbox.xml"))
    toc = syllabus_blocks()

    # Teacher's Book shared parts
    tb_keys = split_by_unit_headers(tb_pages(*TB_ITS_YOUR_CHOICE_KEYS), r"^\s*UNIT\s*(\d+)\s*:")
    extra_text = tb_pages(*TB_EXTRA_ACTIVITIES)
    extra = extra_activities_by_unit(extra_text)

    SHARED.mkdir(exist_ok=True)
    shared_files = {
        "TB_00_methodology_and_portfolio_p001-015.txt":
            header("Teacher's Book: introduction, methodology, portfolio task list",
                   f"{TB_PDF.name} PDF pp.{TB_METHODOLOGY[0]}-{TB_METHODOLOGY[1]}")
            + tb_pages(*TB_METHODOLOGY),
        "TB_extra_activities_all_p114-116.txt":
            header("Teacher's Book: Extra Activities (all units)", f"{TB_PDF.name} PDF pp.114-116")
            + extra_text,
    }
    for grp, (a, b) in TB_REVISION_TESTS.items():
        shared_files[f"TB_revision_test_{grp}_p{a:03d}-{b:03d}.txt"] = (
            header(f"Teacher's Book: Revision test {grp} with key", f"{TB_PDF.name} PDF pp.{a}-{b}",
                   "page boundaries between tests are approximate; check the first/last page")
            + tb_pages(a, b))
    for pat, name in [("WB06_Review_1-5*", "WB_review_1-5.txt"),
                      ("WB07_Keys_CheckYourself_Units1-5*", "WB_keys_check_yourself_1-5.txt"),
                      ("WB13_Review_6-10*", "WB_review_6-10.txt"),
                      ("WB14_Keys_CheckYourself_Units6-10*", "WB_keys_check_yourself_6-10.txt")]:
        f = find_one(TEXT_WB, f"{pat}/{pat}.txt")
        if f:
            shared_files[name] = f.read_text(encoding="utf-8")
    for pat, name in [("00_FrontMatter*", "SB_front_matter_and_TOC.txt"),
                      ("14_Appendix_IV*", "SB_appendix_IV_irregular_verbs.txt"),
                      ("16_Appendix_VI*", "SB_appendix_VI_maps.txt"),
                      ("17_Portfolio*", "SB_portfolio_and_back_cover.txt")]:
        f = find_one(TEXT_SB, f"{pat}/{pat}.txt")
        if f:
            shared_files[name] = f.read_text(encoding="utf-8")
    for name, content in shared_files.items():
        (SHARED / name).write_text(content, encoding="utf-8")
    (SHARED / "README.md").write_text(
        "# Shared source material (spans several units)\n\n"
        "Built by `_tools/build_source_packs.py`. Each unit's `source/00_MANIFEST.md` says which of these apply.\n\n"
        + "\n".join(f"- `{n}`" for n in sorted(shared_files)) + "\n", encoding="utf-8")

    for u, title in UNITS.items():
        src = ROOT / f"unit{u}" / "source"
        src.mkdir(parents=True, exist_ok=True)
        files: dict[str, str] = {}

        sb = find_one(TEXT_SB, f"{u:02d}_Unit{u}_*/{u:02d}_Unit{u}_*.txt")
        wb = find_one(TEXT_WB, f"WB*_Unit{u}_*/WB*_Unit{u}_*.txt")
        a, b = TB_UNIT_PAGES[u]

        files["01_syllabus.txt"] = header(f"Unit {u} syllabus (Pupil's Book Table of Contents)",
                                          "text/00_FrontMatter*/ (layout extraction)") + toc.get(u, "NOT FOUND\n")
        words = vocab.get(u, [])
        flagged = [f"{w}  ->  {VOCAB_KNOWN_ISSUES[w]}" for w in words if w in VOCAB_KNOWN_ISSUES]
        files["02_vocabulary_list.txt"] = (
            header(f"Unit {u} official vocabulary list ({len(words)} lines as printed)",
                   "Pupil's Book Appendix V, rebuilt from word positions (.bbox.xml)",
                   "printed as-is; see CHECK section for known print errors")
            + "\n".join(words)
            + ("\n\n----- CHECK (known print errors / wraps) -----\n" + "\n".join(flagged) if flagged else "")
            + "\n")
        files["10_SB_unit.txt"] = sb.read_text(encoding="utf-8") if sb else "NOT FOUND\n"
        files["11_SB_its_your_choice.txt"] = header(f"Unit {u}: Appendix I It's Your Choice (differentiated tasks)",
                                                    "split/11_Appendix_I*.pdf, reading order") + app1.get(u, "(none for this unit)\n")
        files["12_SB_resource_materials.txt"] = header(f"Unit {u}: Appendix II Resource Materials",
                                                       "split/12_Appendix_II*.pdf, reading order",
                                                       "resources are printed out of unit order; all segments headed with this unit are collected here") + app2.get(u, "(none for this unit)\n")
        files["13_SB_grammar_file.txt"] = header(f"Unit {u}: Appendix III Grammar File",
                                                 "split/13_Appendix_III*.pdf, reading order") + app3.get(u, "NOT FOUND\n")
        files["20_WB_unit.txt"] = wb.read_text(encoding="utf-8") if wb else "NOT FOUND\n"
        files["30_TB_unit.txt"] = header(f"Unit {u} Teacher's Book guide: aims, stages, RECORDING SCRIPTS, keys",
                                         f"{TB_PDF.name} PDF pp.{a}-{b}, reading order",
                                         ("also contains the key to Review 1-5" if u == 5 else
                                          "also contains the key to Review 6-10" if u == 10 else "")) + tb_pages(a, b)
        files["31_TB_its_your_choice_key.txt"] = header(f"Unit {u}: Teacher's Book key to It's Your Choice",
                                                        f"{TB_PDF.name} PDF pp.107-113") + tb_keys.get(u, "(none found)\n")
        files["32_TB_extra_activities.txt"] = header(f"Unit {u}: Teacher's Book extra activities",
                                                     f"{TB_PDF.name} PDF pp.114-116",
                                                     "only activities tagged '(UNIT {u})' in the book") + extra.get(u, "(none tagged for this unit)\n")

        for name, content in files.items():
            (src / name).write_text(content, encoding="utf-8")

        sizes = {n: len(c) for n, c in files.items()}
        manifest = [
            f"# Unit {u}: {title} — source pack",
            "",
            "Built by `_tools/build_source_packs.py` from the three official books. Text is extracted, not rewritten.",
            "Read these files instead of the full books. Everything a unit build needs is here or in the shared files listed below.",
            "",
            "## Files",
            "",
            "| File | Contents | Characters |",
            "|---|---|---|",
            f"| `01_syllabus.txt` | Lessons, skills, functions, structures, project, can-do statements | {sizes['01_syllabus.txt']:,} |",
            f"| `02_vocabulary_list.txt` | Official word list, {len(words)} lines | {sizes['02_vocabulary_list.txt']:,} |",
            f"| `10_SB_unit.txt` | Pupil's Book unit pages | {sizes['10_SB_unit.txt']:,} |",
            f"| `11_SB_its_your_choice.txt` | Differentiated tasks (Appendix I) | {sizes['11_SB_its_your_choice.txt']:,} |",
            f"| `12_SB_resource_materials.txt` | Resource materials (Appendix II) | {sizes['12_SB_resource_materials.txt']:,} |",
            f"| `13_SB_grammar_file.txt` | Grammar summary (Appendix III) | {sizes['13_SB_grammar_file.txt']:,} |",
            f"| `20_WB_unit.txt` | Workbook unit pages | {sizes['20_WB_unit.txt']:,} |",
            f"| `30_TB_unit.txt` | Teacher's Book guide, pp.{a}-{b}: aims, procedure, **recording scripts**, keys | {sizes['30_TB_unit.txt']:,} |",
            f"| `31_TB_its_your_choice_key.txt` | Keys to Appendix I | {sizes['31_TB_its_your_choice_key.txt']:,} |",
            f"| `32_TB_extra_activities.txt` | Extra activities tagged for this unit | {sizes['32_TB_extra_activities.txt']:,} |",
            "",
            "## Shared files that apply (in `../../_shared_source/`)",
            "",
            f"- `TB_revision_test_{REVISION_GROUP[u]}_*.txt` (revision test covering this unit, with key)",
            f"- `WB_review_{WB_REVIEW_GROUP[u]}.txt` and `WB_keys_check_yourself_{WB_REVIEW_GROUP[u]}.txt`",
            "- `TB_00_methodology_and_portfolio_p001-015.txt` (portfolio task for every unit is listed on pp.13-14)",
            "- `SB_appendix_IV_irregular_verbs.txt`, `SB_appendix_VI_maps.txt` if the unit needs them",
            "",
            "## Rules for the build agent",
            "",
            "- **Recording scripts** are in `30_TB_unit.txt` (search `TAPESCRIPT` / `RECORDING SCRIPT`). Use them verbatim for listening tasks.",
            "- **Where the book contradicts itself** (script vs. key, as in Unit 1 'saving'/'printing'), do not resolve it yourself: it is an `ERRATA.md` item. Ask the teacher (SKILL.md, \"Book Errors\").",
            "- **Printed errors** in the vocabulary list are flagged in the CHECK section of `02_vocabulary_list.txt`. Each one is an `ERRATA.md` item: the app follows the resolution the teacher approved and shows a \"Book check\" note, because pupils keep the printed book as their reference. Nothing is corrected silently.",
            "- **Dated or wrong facts** (place names, technology, hazards, anything unsuitable for 11-year-olds) are `ERRATA.md` items too: quote the page, propose keep / annotate / teacher note / replace, and wait for the teacher's decision. Until then the book's text stands.",
        ]
        if flagged:
            manifest += ["", "## Known print errors in this unit's word list", ""] + [f"- {f}" for f in flagged]
        missing = [n for n, c in files.items() if "NOT FOUND" in c[:400] or len(c) < 200]
        if missing:
            manifest += ["", "## Check", "", "These files are empty or very short, verify by hand:", ""] + [f"- `{m}`" for m in missing]
        (src / "00_MANIFEST.md").write_text("\n".join(manifest) + "\n", encoding="utf-8")
        report.append(f"unit{u}: {len(words):>3} vocab lines | " +
                      " ".join(f"{n.split('_')[0]}={sizes[n]//1000}k" for n in files) +
                      (f" | CHECK {missing}" if missing else ""))

    print("\n".join(report))
    print(f"\nshared: {len(shared_files)} files in {SHARED}")
    return 0


if __name__ == "__main__":
    sys.exit(main())
