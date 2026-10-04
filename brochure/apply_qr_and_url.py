"""Overlay QR code + URL + email onto the brochure PDF (page 1).

Layout:
  - Cover the [QR CODE], [SITE URL], [YOUR EMAIL] placeholder text and the
    "Free for every school." tagline with cream-coloured rectangles that
    match the brochure background, so the original text disappears but the
    page background looks untouched. Rects are padded slightly to swallow
    any descenders that extend past the bounding box.
  - The original rounded-corner dashed border around [QR CODE] is kept as
    a frame; the QR image is placed inside it.
  - Place the URL below the contact row on its own line at a readable size.
  - Place the email in the [YOUR EMAIL] row, sized to match the
    surrounding contact text.

After this script runs, the PDF is fully re-saved (no incremental-update
layers) so the file is smaller and easier to handle downstream.
"""

from pathlib import Path
import pymupdf

BASE = Path(r"C:\photodentro\antigravity\vocabulary st\brochure")
PDF_IN = BASE / "English 6th Grade pitch brochure.pdf.bak-pre-edit"  # original
PDF_OUT = BASE / "English 6th Grade pitch brochure.pdf"
QR_PATH = BASE / "qr-code.png"

URL = "https://sixthgrade-english-buddy.lovable.app"
EMAIL = "apokrit@gmail.com"

# Brochure background colour (sampled from a clean area of page 1)
BG = (250 / 255, 247 / 255, 242 / 255)


def cover_box(page, rect):
    """Cover a placeholder span with the page background colour.

    Pad the rect slightly so any descender or punctuation that extends
    past the reported bounding box is also hidden.
    """
    padded = pymupdf.Rect(rect.x0 - 1, rect.y0 - 1, rect.x1 + 1, rect.y1 + 2)
    page.draw_rect(padded, color=BG, fill=BG, width=0, overlay=True)


doc = pymupdf.open(PDF_IN)
page = doc[0]

# Locate the placeholder text spans.
qr_box = url_box = email_box = free_box = None
for block in page.get_text("dict")["blocks"]:
    if block["type"] != 0:
        continue
    for line in block["lines"]:
        for span in line["spans"]:
            t = span["text"]
            if "[QR CODE]" in t:
                qr_box = pymupdf.Rect(span["bbox"])
            elif "[SITE URL]" in t:
                url_box = pymupdf.Rect(span["bbox"])
            elif "[YOUR EMAIL]" in t:
                email_box = pymupdf.Rect(span["bbox"])
            elif "Free for every school" in t:
                free_box = pymupdf.Rect(span["bbox"])

assert qr_box and url_box and email_box and free_box, "Could not find placeholders"

# 1) Cover the placeholder text with the background colour.
for r in (qr_box, url_box, email_box, free_box):
    cover_box(page, r)

# 2) Insert the QR code image inside the existing rounded dashed border.
QR_SIZE = 70
qr_x0 = (291 + 382) / 2 - QR_SIZE / 2
qr_rect = pymupdf.Rect(qr_x0, 480, qr_x0 + QR_SIZE, 480 + QR_SIZE)
page.insert_image(qr_rect, filename=str(QR_PATH), overlay=True)

# 3) Insert the URL below the contact row on a single line.
URL_X0, URL_X1 = 310, 560
font = pymupdf.Font("helv")
size = 12
while font.text_length(URL, fontsize=size) > (URL_X1 - URL_X0) and size > 7:
    size -= 1
url_rect = pymupdf.Rect(URL_X0, 565, URL_X1, 588)
page.insert_textbox(
    url_rect,
    URL,
    fontname="helv",
    fontsize=size,
    color=(0, 0, 0),
    align=pymupdf.TEXT_ALIGN_LEFT,
    overlay=True,
)

# 4) Insert the email in the [YOUR EMAIL] row. Use insert_text (a baseline
#    placement) rather than insert_textbox -- insert_textbox silently
#    dropped the text when the rect was tight. Place at the baseline of
#    the original placeholder.
email_x = email_box.x0
email_baseline = email_box.y1 - 2  # roughly the baseline of the placeholder
result = page.insert_text(
    (email_x, email_baseline),
    EMAIL,
    fontname="helv",
    fontsize=12,
    color=(0, 0, 0),
    overlay=True,
)
# pymupdf returns the count of chars that did not fit; >0 here means the
# last glyph(s) extended slightly past the available space. Verify visually.
print(f"  email insert_text chars-not-fit: {result}")

# Save without incremental updates to keep the file lean.
doc.save(PDF_OUT, garbage=4, deflate=True, clean=True)
doc.close()
print("Updated brochure PDF")
print(f"  QR rect:  {qr_rect}  (size {QR_SIZE} pt)")
print(f"  URL text: '{URL}' at {url_rect}  (size {size})")
print(f"  Email:    '{EMAIL}' at ({email_x}, {email_baseline})")