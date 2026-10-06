# English 6th Grade — "The Companion" · Design Spec (rev 2)

## Project Context

**English 6th Grade (ΣΤ΄ Δημοτικού)** — official curriculum of the Greek Ministry of Education (DEPPS-APS / ITYE Diophantus).

**Two artifacts, one journey:**

| | What it is | Where it lives |
|---|---|---|
| **v1 — The Coursebook** | The official, printed 2006 English coursebook — Pupil's Book, Workbook, Teacher's Book, audio CD. Authoritative curriculum content, CEFR A1 / A1+. | `st_unit*.pdf`, paper textbook |
| **v2 — The Companion** | A digital companion that lives next to the coursebook — adds CLIL stories, dual-voice TTS, inductive grammar labs, and printable worksheets. Built to *play with* the book, not replace it. | `unit*/v2.html`, `unit*/index.html` |

**Brand promise:** *The Companion never claims to be the coursebook. It sits beside it, brings it to life, and gets out of the way.*

---

## Concept: A Companion, Not a Replacement

The page is positioned as a **vocabulary companion** to a **legacy coursebook**. Every element of the design reinforces this duality:

- **The coursebook side** feels printed, established, slightly nostalgic — paper texture, page numbers, the typography of a schoolbook, dashed lines like a margin ruler.
- **The companion side** feels warm, modern, hand-drawn — terracotta and sage, bouncy motion, illustrated kids, the friend who helps you with the reading.

The two are never blended into a gray middle. They sit side by side, each clearly itself.

---

## Visual Direction: Modern Educational Playful

Bright, hand-drawn illustration feel; bouncy motion; rounded shapes; warm earthy palette. The Companion is optimistic and inviting without being babyish.

---

## Color Palette (No Blue, No Purple)

| Token | Hex | Role |
|---|---|---|
| `--clay` | `#C8553D` | Companion primary — CTAs, "v2" tags |
| `--clay-soft` | `#E0836E` | Hover state |
| `--sage` | `#7A9471` | v2 Ready badge, secondary accent |
| `--sage-deep` | `#4F6A4A` | Pressed states |
| `--paper` | `#FFFDF8` | Card surface (Companion side) |
| `--paper-cream` | `#F6EFDF` | Coursebook page surface (v1 side) |
| `--cream` | `#FAF3E7` | Page background |
| `--ink` | `#2D2A26` | Body text |
| `--charcoal` | `#1B1916` | Display headlines |
| `--mustard` | `#D4A24C` | Highlights, "Companion" badge |
| `--blush` | `#F4C6B8` | Soft fills |
| `--dust` | `#C8B79C` | Hairlines, ruled lines |

**Two accent colors carry the duality:**
- Coursebook (v1): **dust + ink** — printed-paper feel
- Companion (v2): **clay + sage + mustard** — modern hand-drawn feel

---

## Typography

- **Display (Companion headlines)**: **Fraunces** — variable serif, weight 700–900, opsz 144, SOFT 100. Warm, scholarly, slightly chunky.
- **Coursebook labels**: **Fraunces** italic at smaller sizes — feels like the spine of a book.
- **Body**: **Inter** — clean sans, weight 400/500/600.
- **Mono / labels**: **JetBrains Mono** — for unit numbers, page references, term pills.

---

## Hero Section — Type-led with subtle motion

- **Brand strip** at top: `Photodentro · English 6th Grade · THE COMPANION`
- **Headline** (3 lines):
  - "A **Companion**"
  - "for the coursebook."
- **Subhead**: Short thesis positioning the Companion as additive, not replacement.
- **CTAs**:
  - Primary (terracotta): "Meet the Companion →" — scrolls to units
  - Ghost: "What is this?" — opens the explainer
- **Right side**: A visual of an open coursebook whose right page is "coming alive" with hand-drawn marks, sparkles, and a colored Companion ribbon. Subtle CSS parallax.
- **Background**: cream → blush radial wash with drifting asterisks/sparkles/dotted loops. No video.

---

## "The Two Things" Explainer Card (NEW)

A short section directly under the hero that makes the concept explicit for any visitor who lands confused:

> **The Coursebook** is the printed 2006 textbook. Authoritative. Established. Where the vocabulary list, the grammar targets, and the Can-Do self-assessment live.
>
> **The Companion** is what we built to play alongside it. CLIL stories, neural audio, printable packs — all tuned to the same units and page numbers.
>
> Use either. Use both. The Companion never replaces the book; it just makes the book easier to love.

Visual: two stacked paper-notebook blocks side by side, each clearly labeled.

---

## Unit Grid — Split Cards (the centerpiece)

Each unit card is split vertically into two halves, separated by a thin dashed hairline:

### Left half — **v1 · The Coursebook**
- Cream/paper background, dashed border
- Unit number in mono (e.g., `UNIT 01`)
- Coursebook title (the textbook's title)
- Coursebook page reference (e.g., `pp. 4–15`)
- Coursebook theme (1 line)
- Tiny "open coursebook" link → `st_unit1.pdf`

### Right half — **v2 · The Companion**
- Paper-white background, solid border
- "THE COMPANION" badge in mustard
- Companion tagline
- 4 activity pills (CLIL · Neural Audio · Printable · etc.)
- Primary CTA: "Launch Companion →" → `unit1/v2.html`
- Secondary CTA: "Quick vocab lab" → `unit1/index.html`
- Tiny illustrated mark top-right

On hover: the Companion half lifts 6px, the Coursebook half stays planted. The split feels intentional, like an open book.

**Featured unit card** (Unit 1): the left half is a generated watercolor illustration of multicultural kids (replacing the cream placeholder). The right half is the Companion side. The split is shown with a clear "fold" mark.

---

## Teacher Framework Card

Same as before — cream panel with hand-drawn frame, three pillars. Adds one line at the top: "Designed to leave your coursebook on the desk, not in the cupboard."

---

## Background & Decoration

- Cream paper grain (SVG noise, 4.5% opacity)
- Floating hand-drawn glyphs (asterisks, sparkles, dotted loops) drift with parallax
- A subtle dotted ruled-line pattern visible on Coursebook side of unit cards (like notebook paper)

---

## Motion

- Springy overshoot easing on Companion card lifts (`cubic-bezier(0.34, 1.56, 0.64, 1)`)
- Standard state-transition easing (`cubic-bezier(0.4, 0.0, 0.2, 1)`)
- Background glyphs: 14–22s linear infinite drift
- Filter chips: 200ms color/scale on click
- Hero "Companion" word: subtle pulse on the mustard underline to draw the eye

All motion respects `prefers-reduced-motion: reduce`.

---

## Tech Stack

- HTML5, vanilla CSS, minimal JS (~100 lines)
- Inline critical CSS in `<style>`
- Google Fonts: Fraunces variable + Inter variable + JetBrains Mono
- All icons inline SVG
- Mobile-first responsive

---

## Asset Plan

- `imgs/hero_illustration.jpg` — open book / kids / flags (generated, in palette)
- `imgs/unit1_featured.jpg` — multicultural kids (generated, in palette)
- `imgs/teacher_illus.jpg` — teacher at chalkboard (generated, in palette)
- `imgs/coursebook_cover.jpg` *(future)* — photograph of the 2006 coursebook for authenticity
- All decorative marks are inline SVG

---

## What This Preview Includes

1. Brand strip with "The Companion" identity
3. "The Two Things" explainer card (the explicit concept)
4. Featured Unit 1 card with split layout + generated illustration on Coursebook half
5. Three compact sample units with split cards
6. Filter chip row (working)
7. Teacher pillars card
8. Footer

Not in preview (reserved for full build): all 10 unit cards rendered, video pipeline showcase, mobile deep polish, full coursebook catalog data wiring, coursebook cover photograph, accessibility audit.

---

## Iteration note

The original spec treated v1/v2 as "version 1 (older lab)" vs "version 2 (newer flagship)". The user clarified: **v1 is the legacy coursebook material, v2 is the vocabulary companion.** This reframes the entire product from "an app that comes in two versions" to "a textbook and a friend". The design must respect both halves and never collapse the difference.