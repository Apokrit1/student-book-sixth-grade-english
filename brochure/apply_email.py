"""Overlay QR code + URL + email onto the brochure PDF (page 1).

This is a focused pass that only fills the [YOUR EMAIL] placeholder with
apokrit@gmail.com. The QR + URL from the earlier pass are already in place
in the PDF.
"""

from pathlib import Path
import pymupdf

BASE = Path(r"C:\photodentro\antigravity\vocabulary st\brochure")
PDF_IN = BASE / "English 6th Grade pitch brochure.pdf"

EMAIL = "apokrit@gmail.com"

# Brochure background colour (sampled from a clean area of page 1)
BG = (250 / 255, 247 / 255, 242 / 255)

doc = pymupdf.open(PDF_IN)
page = doc[0]

# Locate the [YOUR EMAIL] placeholder text span.
email_box = None
for block in page.get_text("dict")["blocks"]:
    if block["type"] != 0:
        continue
    for line in block["lines"]:
        for span in line["spans"]:
            if "[YOUR EMAIL]" in span["text"]:
                email_box = pymupdf.Rect(span["bbox"])

assert email_box, "Could not find [YOUR EMAIL] placeholder"

# Cover the placeholder text with the background colour.
page.draw_rect(email_box, color=BG, fill=BG, width=0, overlay=True)

# Insert the email at the same position, using the same font as the
# placeholder so it matches visually.
# Use a font size that keeps the email on one line and doesn't overshoot
# the [YOUR EMAIL] baseline style.
font = pymupdf.Font("helv")
size = 12
# Slightly wider box than the placeholder so the email has a touch of room.
text_rect = pymupdf.Rect(email_box.x0, email_box.y0,
                         email_box.x0 + email_box.width, email_box.y1)
while font.text_length(EMAIL, fontsize=size) > text_rect.width and size > 7:
    size -= 1

page.insert_textbox(
    text_rect,
    EMAIL,
    fontname="helv",
    fontsize=size,
    color=(0, 0, 0),
    align=pymupdf.TEXT_ALIGN_LEFT,
    overlay=True,
)

doc.saveIncr()
doc.close()
print("Updated brochure PDF")
print(f"  Email text: '{EMAIL}' at {text_rect}  (font size {size})")