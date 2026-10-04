"""Build the 1-8_ver version of the brochure from the current canonical PDF.

Source : brochure/English 6th Grade pitch brochure.pdf  (has QR + URL + email)
Target : brochure/English 6th Grade pitch brochure 1-8_ver.pdf

Changes vs source:
  - Page 1, THE ASK numbered list (1/2/3): rewritten to reflect that
    Units 1-8 are now live, and to ask teachers to review and send
    feedback to apokrit@gmail.com.
  - Page 1, orange panel subtitle: "Unit 1 live now · 1-2 October 2026"
    becomes "Units 1-8 live now".
  - Page 2, TRACTION AND ROADMAP: "Unit 1 live" -> "Units 1-8 live",
    "Units 2 to 10, one at a time" -> "Units 9 and 10, polishing".

The QR, URL, email, and all other content are preserved.
"""

from pathlib import Path
import shutil
import pymupdf

BASE = Path(r"C:\photodentro\antigravity\vocabulary st\brochure")
SRC = BASE / "English 6th Grade pitch brochure.pdf"
DST = BASE / "English 6th Grade pitch brochure 1-8_ver.pdf"

# Brochure background colour (sampled from a clean area of page 1)
BG = (250 / 255, 247 / 255, 242 / 255)

# Page 1 orange panel background colour (sampled from the panel)
ORANGE_PANEL_BG = (180 / 255, 81 / 255, 26 / 255)

# Page 2 dark background colour (sampled from the right column)
DARK_BG = (24 / 255, 22 / 255, 25 / 255)

# White text on the orange panel
WHITE = (1.0, 1.0, 1.0)

# Orange used by the original number markers "1", "2", "3" (sampled)
ORANGE_NUMBER = (0.804, 0.310, 0.176)

# New copy of the source PDF.
shutil.copyfile(SRC, DST)

# ----- New text to insert -----

# Page 1 - THE ASK numbered list (3 items)
ASK_ITEMS = [
    "Use Units 1\u20138 with your class",
    "this term \u2014 every chapter live.",
    "Try the listening tasks, quizzes,",
    "and the report builder in class.",
    "Send feedback, corrections, or ideas",
    "to apokrit@gmail.com.",
]

# Page 1 - orange panel subtitle (was "Unit 1 live now \u00b7 1\u20132 October 2026")
ORANGE_SUBTITLE = "Units 1\u20138 live now"

# Page 2 - roadmap row 2 (was "Unit 1 live")
ROADMAP_NOW = "Units 1\u20138 live"

# Page 2 - roadmap row 3 (was "Units 2 to 10, one at a time")
ROADMAP_NEXT = "Units 9 and 10, polishing"

FONT = "helv"


def cover(page, rect, fill=BG):
    """Cover a placeholder span with a coloured rectangle."""
    padded = pymupdf.Rect(rect.x0 - 1, rect.y0 - 1, rect.x1 + 1, rect.y1 + 2)
    page.draw_rect(padded, color=fill, fill=fill, width=0, overlay=True)


def replace_lines(page, target_spans, new_lines, fontname=FONT, size=12.0,
                  color=(0, 0, 0), line_height=15.5, line_indent=None):
    """Cover the given spans, then write new lines at the same vertical
    positions (one new line per source line).

    `line_indent` (x0 of the first line). If None, uses target_spans[0].x0.
    The remaining lines are placed at the same x as the first line.
    """
    if line_indent is None:
        line_indent = target_spans[0].x0
    # Cover each original line.
    for span in target_spans:
        cover(page, pymupdf.Rect(span["bbox"]))
    # Insert the new lines at the baseline of each original line.
    for i, (span, text) in enumerate(zip(target_spans, new_lines)):
        baseline = span["bbox"][3] - 2  # near the original baseline
        page.insert_text(
            (line_indent, baseline),
            text,
            fontname=fontname,
            fontsize=size,
            color=color,
            overlay=True,
        )


doc = pymupdf.open(DST)

# ---------- PAGE 1 ----------
page = doc[0]

# Helper to fetch spans by substring match.
def find_spans(page, needles):
    found = {n: None for n in needles}
    for block in page.get_text("dict")["blocks"]:
        if block["type"] != 0:
            continue
        for line in block["lines"]:
            for span in line["spans"]:
                t = span["text"]
                for n in needles:
                    if n in t and found[n] is None:
                        found[n] = dict(span, _bbox=pymupdf.Rect(span["bbox"]))
    return found

# 1) THE ASK numbered list - 6 source lines (items 1-2-3, where items 1 and 2
#    span multiple lines and item 3 is a single line).
ask_spans = find_spans(page, [
    "Pilot Unit 1",          # item 1 line 1
    "term.",                  # item 1 line 2
    "Report what breaks",     # item 2 line 1
    "wrong recording",        # item 2 line 2
    "screen.",                # item 2 line 3
    "Co-author one of Units", # item 3 line 1
])
ask_order = ["Pilot Unit 1", "term.",
             "Report what breaks", "wrong recording", "screen.",
             "Co-author one of Units"]
ask_target_spans = [ask_spans[k] for k in ask_order]
assert all(ask_target_spans), f"missing ASK spans: {ask_spans}"

# Use the source size where possible. The ASK lines were 12.1-12.3 pt.
ask_line_height = 15.5

# Cover the six lines and the orange number markers (1/2/3) at x=310..317.
for span in ask_target_spans:
    cover(page, span["_bbox"])
# Cover the orange "1", "2", "3" markers (they sit at x=310..317).
for block in page.get_text("dict")["blocks"]:
    if block["type"] != 0:
        continue
    for line in block["lines"]:
        for span in line["spans"]:
            t = span["text"].strip()
            if t in ("1", "2", "3"):
                bb = pymupdf.Rect(span["bbox"])
                if 305 <= bb.x0 <= 320 and 150 <= bb.y0 <= 290:
                    cover(page, bb)

# Insert new ask lines at the same vertical positions.
# Layout:
#   Item 1 (orange 1, y~156..172): "Use Units 1-8 with your class"
#   Item 1 line 2 (y~173..190):     "this term - every chapter live."
#   Item 2 (orange 2, y~201..218):  "Try the listening tasks,"
#   Item 2 line 2 (y~219..235):     "quizzes, and the report builder."
#   Position 5 (y~236..252):        empty (covered, no text) - removed extra line
#   Item 3 (orange 3, y~264..280):  "Send feedback to apokrit@gmail.com"
new_ask_lines = [
    "Use Units 1\u20138 with your class",       # item 1 line 1
    "this term \u2014 every chapter live.",     # item 1 line 2
    "Try the listening tasks,",                  # item 2 line 1
    "quizzes, and the report builder.",          # item 2 line 2
    "",                                          # placeholder slot, covered, no text
    "Send feedback to apokrit@gmail.com",        # item 3 (single line)
]
for i, (span, text) in enumerate(zip(ask_target_spans, new_ask_lines)):
    if not text:
        # Empty placeholder slot - already covered, skip insert.
        continue
    baseline = span["_bbox"].y1 - 2
    page.insert_text(
        (span["_bbox"].x0, baseline),
        text,
        fontname=FONT,
        fontsize=12.1,
        color=(0, 0, 0),
        overlay=True,
    )

# Re-draw orange "1", "2", "3" markers at the same positions.
def redraw_orange_number(page, x, y_baseline, label):
    page.insert_text(
        (x, y_baseline),
        label,
        fontname=FONT,
        fontsize=12.3,
        color=(0.804, 0.310, 0.176),  # orange-ish, same as the original number markers
        overlay=True,
    )

# Find original baselines of 1, 2, 3 from the source text spans.
for block in page.get_text("dict")["blocks"]:
    if block["type"] != 0:
        continue
    for line in block["lines"]:
        for span in line["spans"]:
            t = span["text"].strip()
            if t in ("1", "2", "3"):
                bb = pymupdf.Rect(span["bbox"])
                if 305 <= bb.x0 <= 320 and 150 <= bb.y0 <= 290:
                    redraw_orange_number(page, bb.x0, bb.y1 - 2, t)

# 2) Orange panel subtitle - cover with the orange panel colour, then
#    rewrite in white.
orange_span = None
for block in page.get_text("dict")["blocks"]:
    if block["type"] != 0:
        continue
    for line in block["lines"]:
        for span in line["spans"]:
            if "Unit 1 live now" in span["text"]:
                orange_span = span
                break
        if orange_span:
            break
    if orange_span:
        break
assert orange_span, "Could not find orange subtitle"
# Cover generously to the right edge of the orange panel -- PDF text
# bboxes are sometimes slightly tighter than the rendered glyph extent
# (e.g. trailing punctuation, the "·" middle dot).
padded = pymupdf.Rect(orange_span["bbox"][0] - 4,
                       orange_span["bbox"][1] - 2,
                       842,                               # all the way to the page edge
                       orange_span["bbox"][3] + 4)
page.draw_rect(padded, color=ORANGE_PANEL_BG, fill=ORANGE_PANEL_BG,
               width=0, overlay=True)
orange_baseline = orange_span["bbox"][3] - 2
page.insert_text(
    (orange_span["bbox"][0], orange_baseline),
    ORANGE_SUBTITLE,
    fontname=FONT,
    fontsize=orange_span["size"],
    color=WHITE,
    overlay=True,
)

# ---------- PAGE 2 ----------
page = doc[1]

# 3a) "Unit 1 live" -> "Units 1-8 live"
# 3b) "Units 2 to 10, one at a time" -> "Units 9 and 10, polishing"

for block in page.get_text("dict")["blocks"]:
    if block["type"] != 0:
        continue
    for line in block["lines"]:
        for span in line["spans"]:
            t = span["text"]
            if t.strip() == "Unit 1 live":
                bb = pymupdf.Rect(span["bbox"])
                # Cover generously to fit the longer "Units 1-8 live" text
                # and use the dark page background, not the cream page-1 colour.
                padded = pymupdf.Rect(bb.x0 - 1, bb.y0 - 1, bb.x1 + 60, bb.y1 + 2)
                page.draw_rect(padded, color=DARK_BG, fill=DARK_BG,
                               width=0, overlay=True)
                page.insert_text(
                    (bb.x0, bb.y1 - 2),
                    ROADMAP_NOW,
                    fontname=FONT,
                    fontsize=span["size"],
                    color=(0.85, 0.85, 0.87),  # light grey on dark background
                    overlay=True,
                )
            elif t.strip() == "Units 2 to 10, one at a time":
                bb = pymupdf.Rect(span["bbox"])
                padded = pymupdf.Rect(bb.x0 - 1, bb.y0 - 1, bb.x1 + 2, bb.y1 + 2)
                page.draw_rect(padded, color=DARK_BG, fill=DARK_BG,
                               width=0, overlay=True)
                page.insert_text(
                    (bb.x0, bb.y1 - 2),
                    ROADMAP_NEXT,
                    fontname=FONT,
                    fontsize=span["size"],
                    color=(0.85, 0.85, 0.87),
                    overlay=True,
                )

doc.saveIncr()
doc.close()
print(f"Built {DST.name}")
print(f"  Page 1 THE ASK -> 3 items, 6 lines about Units 1-8 + feedback")
print(f"  Page 1 orange subtitle -> '{ORANGE_SUBTITLE}'")
print(f"  Page 2 roadmap Now -> '{ROADMAP_NOW}'")
print(f"  Page 2 roadmap Next -> '{ROADMAP_NEXT}'")